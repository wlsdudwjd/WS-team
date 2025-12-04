<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { logout as firebaseLogout } from '@/firebase/firebase'

const router = useRouter()

const profile = reactive({
  userId: 'campus_user01',
  name: '김캠퍼스',
  phone: '010-1234-5678',
  email: 'user@campus.kr',
})

const profileForm = reactive({
  userId: '',
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

const resetFeedback = () => {
  feedbackMessage.value = ''
  errorMessage.value = ''
}

const openProfileModal = () => {
  profileForm.userId = profile.userId
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

const handleProfileSubmit = () => {
  resetFeedback()

  if (profileForm.password && profileForm.password.length < 8) {
    errorMessage.value = '비밀번호는 8자 이상으로 입력해주세요.'
    return
  }

  if (profileForm.password !== profileForm.confirmPassword) {
    errorMessage.value = '비밀번호와 비밀번호 확인이 일치하지 않습니다.'
    return
  }

  profile.userId = profileForm.userId.trim() || profile.userId
  profile.name = profileForm.name.trim() || profile.name
  profile.phone = profileForm.phone.trim() || profile.phone
  profile.email = profileForm.email.trim() || profile.email

  profileForm.password = ''
  profileForm.confirmPassword = ''

  feedbackMessage.value = '프로필이 저장되었습니다.'
}

const handleLogout = async () => {
  if (isLoggingOut.value) {
    return
  }
  logoutError.value = ''
  isLoggingOut.value = true
  try {
    await firebaseLogout()
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
      <dl>
        <div>
          <dt>아이디</dt>
          <dd>{{ profile.userId }}</dd>
        </div>
        <div>
          <dt>이름</dt>
          <dd>{{ profile.name }}</dd>
        </div>
        <div>
          <dt>연락처</dt>
          <dd>{{ profile.phone }}</dd>
        </div>
        <div>
          <dt>이메일</dt>
          <dd>{{ profile.email }}</dd>
        </div>
      </dl>
    </article>

    <div class="card">
      <div class="card-row">
        <div>
          <strong>프로필 관리</strong>
          <p>아이디, 비밀번호 등 내 프로필을 수정합니다.</p>
        </div>
        <button type="button" @click="openProfileModal">관리</button>
      </div>

      <div class="card-row">
        <div>
          <strong>로그아웃</strong>
          <p>안전하게 로그아웃합니다.</p>
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
            <p>아이디와 비밀번호를 포함한 기본 정보를 변경합니다.</p>
          </div>
          <button class="ghost" type="button" aria-label="닫기" @click="closeProfileModal">닫기</button>
        </header>

        <form class="profile-form" @submit.prevent="handleProfileSubmit">
          <label>
            <span>아이디</span>
            <input v-model="profileForm.userId" type="text" required />
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
            <input v-model="profileForm.email" type="email" />
          </label>

          <label>
            <span>새 비밀번호</span>
            <input v-model="profileForm.password" type="password" placeholder="8자 이상" />
          </label>

          <label>
            <span>비밀번호 확인</span>
            <input v-model="profileForm.confirmPassword" type="password" />
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
