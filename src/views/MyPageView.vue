<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { updateEmail, updatePassword } from 'firebase/auth'
import { auth, logout as firebaseLogout } from '@/firebase/firebase'
import { apiGet, apiPut, type ApiError } from '@/utils/api'
import { clearAuthTokens } from '@/utils/authToken'

type UserProfileResponse = {
  userId: number
  username?: string | null
  loginId?: string | null
  email: string
  name: string
  phone?: string | null
  createdAt?: string | null
}

const router = useRouter()

const profile = reactive({
  userId: '',
  username: '',
  name: '',
  phone: '',
  email: '',
})

const profileForm = reactive({
  username: '',
  name: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const showProfileModal = ref(false)
const feedbackMessage = ref('')
const errorMessage = ref('')
const logoutError = ref('')
const isLoggingOut = ref(false)
const profileLoading = ref(false)
const profileLoadError = ref('')

const resetFeedback = () => {
  feedbackMessage.value = ''
  errorMessage.value = ''
}

const applyProfile = (data: Partial<UserProfileResponse>) => {
  profile.userId = data.userId !== undefined ? String(data.userId) : profile.userId
  profile.username = data.username ?? data.loginId ?? profile.username
  profile.name = data.name ?? profile.name
  profile.phone = data.phone ?? profile.phone
  profile.email = data.email ?? profile.email
}

const loadProfile = async () => {
  const emailValue = auth.currentUser?.email?.trim()
  if (!emailValue) {
    profileLoadError.value = '로그인이 필요합니다. 다시 로그인해 주세요.'
    return
  }

  profileLoading.value = true
  profileLoadError.value = ''
  try {
    const data = await apiGet<UserProfileResponse>(
      `/api/users?email=${encodeURIComponent(emailValue)}`
    )
    applyProfile(data)
    profileForm.username = profile.username
    profileForm.name = profile.name
    profileForm.phone = profile.phone
    profileForm.email = profile.email
  } catch (err) {
    console.error(err)
    const apiErr = err as ApiError
    profileLoadError.value =
      apiErr?.userMessage ||
      '프로필을 찾을 수 없습니다. 회원가입으로 계정을 만든 뒤 다시 로그인해 주세요.'
  } finally {
    profileLoading.value = false
  }
}

onMounted(loadProfile)

const openProfileModal = () => {
  profileForm.username = profile.username
  profileForm.name = profile.name
  profileForm.phone = profile.phone
  profileForm.email = profile.email
  profileForm.password = ''
  profileForm.confirmPassword = ''
  resetFeedback()
  showProfileModal.value = true
}

const closeProfileModal = () => {
  showProfileModal.value = false
}

const handleProfileSubmit = async () => {
  resetFeedback()

  if (!profileForm.password.trim()) {
    errorMessage.value = '비밀번호를 입력해 주세요.'
    return
  }

  if (profileForm.password.length < 8) {
    errorMessage.value = '비밀번호는 8자리 이상으로 입력해 주세요.'
    return
  }

  if (profileForm.password !== profileForm.confirmPassword) {
    errorMessage.value = '비밀번호와 비밀번호 확인이 일치하지 않습니다.'
    return
  }

  const newPassword = profileForm.password.trim()
  const newEmail = profileForm.email.trim()
  const currentUser = auth.currentUser

  const body = {
    password: newPassword,
    username: profileForm.username.trim(),
    email: newEmail,
    name: profileForm.name.trim(),
    phone: profileForm.phone.trim(),
  }

  try {
    // Firebase 계정 정보 업데이트 (이메일/비밀번호)
    if (currentUser) {
      await updatePassword(currentUser, newPassword)
      if (newEmail && newEmail !== currentUser.email) {
        await updateEmail(currentUser, newEmail)
      }
    }

    // 백엔드 프로필 업데이트
    const updated = await apiPut<UserProfileResponse>(`/api/users/${profile.userId}`, body)
    applyProfile(updated)
    // 이메일이 바뀌면 로컬 저장소에 반영해 이후 요청에 사용
    localStorage.setItem('ws_user_email', updated.email)
    feedbackMessage.value = '프로필이 저장되었습니다.'
    showProfileModal.value = false
  } catch (err) {
    console.error(err)
    const apiErr = err as ApiError
    errorMessage.value =
      apiErr?.userMessage || '프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    profileForm.password = ''
    profileForm.confirmPassword = ''
  }
}

const handleLogout = async () => {
  if (isLoggingOut.value) {
    return
  }
  logoutError.value = ''
  isLoggingOut.value = true
  try {
    await firebaseLogout()
    clearAuthTokens()
    await router.replace({ name: 'login' })
  } catch (error) {
    logoutError.value =
      error instanceof Error ? error.message : '로그아웃에 실패했습니다.'
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<template>
  <section class="page-section">
    <h1>내 계정</h1>

    <article class="card profile-card" aria-labelledby="profile-heading">
      <h2 id="profile-heading">기본 정보</h2>
      <p v-if="profileLoading" class="info-text">프로필을 불러오는 중입니다...</p>
      <p v-else-if="profileLoadError" class="error-text">{{ profileLoadError }}</p>
      <dl v-else>
        <div>
          <dt>아이디</dt>
          <dd>{{ profile.username || '-' }}</dd>
        </div>
        <div>
          <dt>이름</dt>
          <dd>{{ profile.name || '-' }}</dd>
        </div>
        <div>
          <dt>연락처</dt>
          <dd>{{ profile.phone || '-' }}</dd>
        </div>
        <div>
          <dt>이메일</dt>
          <dd>{{ profile.email || '-' }}</dd>
        </div>
      </dl>
    </article>

    <div class="card">
      <div class="card-row">
        <div>
          <strong>프로필 관리</strong>
          <p>아이디/비밀번호 포함 기본 정보를 수정할 수 있습니다.</p>
        </div>
        <button type="button" @click="openProfileModal">관리</button>
      </div>

      <div class="card-row">
        <div>
          <strong>로그아웃</strong>
          <p>안전하게 로그아웃하세요.</p>
        </div>
        <button type="button" :disabled="isLoggingOut" @click="handleLogout">
          {{ isLoggingOut ? '로그아웃 중...' : '로그아웃' }}
        </button>
      </div>
      <p v-if="logoutError" class="error-text logout-error">{{ logoutError }}</p>
    </div>

    <div v-if="showProfileModal" class="modal-overlay" role="dialog" aria-modal="true">
      <section class="modal" aria-labelledby="profile-modal-title">
        <header class="modal-header">
          <div>
            <h2 id="profile-modal-title">프로필 관리</h2>
            <p>아이디·비밀번호를 포함한 기본 정보를 변경할 수 있습니다.</p>
          </div>
          <button class="ghost" type="button" aria-label="닫기" @click="closeProfileModal">닫기</button>
        </header>

        <form class="profile-form" @submit.prevent="handleProfileSubmit">
          <label>
            <span>아이디</span>
            <input v-model="profileForm.username" type="text" required />
          </label>

          <label>
            <span>이름</span>
            <input v-model="profileForm.name" type="text" required />
          </label>

          <label>
            <span>연락처</span>
            <input v-model="profileForm.phone" type="tel" placeholder="010-0000-0000" />
          </label>

          <label>
            <span>이메일</span>
            <input v-model="profileForm.email" type="email" required />
          </label>

          <label>
            <span>새 비밀번호</span>
            <input v-model="profileForm.password" type="password" placeholder="8자리 이상" required />
          </label>

          <label>
            <span>비밀번호 확인</span>
            <input v-model="profileForm.confirmPassword" type="password" required />
          </label>

          <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
          <p v-if="feedbackMessage" class="success-text">{{ feedbackMessage }}</p>

          <div class="modal-actions">
            <button class="ghost" type="button" @click="closeProfileModal">취소</button>
            <button class="primary" type="submit">저장</button>
          </div>
        </form>
      </section>
    </div>
  </section>
</template>

<style scoped>
.page-section {
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h1 {
  margin: 0;
  font-size: 1.6rem;
}

h2 {
  margin: 0 0 16px;
  font-size: 1.1rem;
}

.card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 12px 24px rgba(84, 97, 119, 0.12);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.profile-card dl {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin: 0;
}

.profile-card dt {
  font-size: 0.85rem;
  color: #9ca3af;
}

.profile-card dd {
  margin: 4px 0 0;
  font-weight: 600;
  font-size: 1rem;
  color: #1f2937;
}

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.card-row strong {
  display: block;
  font-size: 1rem;
}

.card-row p {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 0.85rem;
}

.card-row button {
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  background: #f1f5f9;
  cursor: pointer;
}

.card-row button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  z-index: 100;
}

.modal {
  width: min(560px, 100%);
  background: #fff;
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.modal-header h2 {
  margin: 0;
}

.modal-header p {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.ghost {
  border: none;
  background: #f1f5f9;
  border-radius: 999px;
  padding: 8px 18px;
  cursor: pointer;
}

.primary {
  border: none;
  background: #ff4e5c;
  color: #fff;
  border-radius: 999px;
  padding: 10px 22px;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(255, 78, 92, 0.35);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.profile-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.9rem;
  color: #475569;
}

.profile-form input {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 1rem;
}

.error-text {
  color: #dc2626;
  font-size: 0.85rem;
}

.info-text {
  color: #475569;
  font-size: 0.9rem;
}

.logout-error {
  margin: -8px 0 0;
}

.success-text {
  color: #059669;
  font-size: 0.85rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

@media (max-width: 540px) {
  .modal {
    border-radius: 20px;
    padding: 20px;
  }

  .modal-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }
}
</style>
