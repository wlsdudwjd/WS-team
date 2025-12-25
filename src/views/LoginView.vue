<template>
  <div class="login">
    <h1>로그인</h1>
    <p class="subtitle">이메일 또는 구글 계정으로 로그인하세요.</p>

    <form class="email-card" @submit.prevent="handleEmailSubmit">
      <div class="segmented">
        <button
          type="button"
          :class="{ active: mode === 'login' }"
          @click="mode = 'login'"
        >
          로그인
        </button>
        <button
          type="button"
          :class="{ active: mode === 'signup' }"
          @click="mode = 'signup'"
        >
          회원가입
        </button>
      </div>

      <label class="field" v-if="mode === 'signup'">
        <span>이름</span>
        <input
          v-model.trim="name"
          type="text"
          placeholder="홍길동"
          autocomplete="name"
          required
        />
      </label>

      <label class="field" v-if="mode === 'signup'">
        <span>전화번호</span>
        <input
          v-model.trim="phone"
          type="tel"
          placeholder="010-0000-0000"
          autocomplete="tel"
          required
        />
      </label>

      <label class="field" v-if="mode === 'signup'">
        <span>아이디</span>
        <input
          v-model.trim="username"
          type="text"
          placeholder="campus_user01"
          minlength="4"
          autocomplete="username"
          required
        />
      </label>

      <label class="field">
        <span>이메일</span>
        <input
          v-model="email"
          type="email"
          placeholder="example@naver.com"
          autocomplete="email"
          required
        />
      </label>

      <label class="field">
        <span>비밀번호</span>
        <input
          v-model="password"
          type="password"
          placeholder="6자리 이상 입력"
          minlength="6"
          autocomplete="current-password"
          required
        />
      </label>

      <div class="options">
        <label class="option">
          <input v-model="rememberEmail" type="checkbox" />
          <span>아이디 저장</span>
        </label>
        <label class="option">
          <input v-model="keepLoggedIn" type="checkbox" />
          <span>로그인 유지</span>
        </label>
      </div>

      <p class="hint" v-if="mode === 'signup'">
        회원가입 시 인증 메일을 보내요. 메일을 확인한 뒤 로그인해 주세요.
      </p>
      <p class="hint" v-else>인증된 이메일과 비밀번호로 로그인해 주세요.</p>

      <button
        class="primary"
        type="submit"
        :disabled="isEmailSubmitting || isGoogleSubmitting"
      >
        {{ isEmailSubmitting ? '처리 중...' : emailButtonLabel }}
      </button>
      <p v-if="errorMsg" style="margin-top: 8px; color: #ef4444; font-size: 13px;">
        {{ errorMsg }}
      </p>
    </form>

    <div class="divider">
      <span>또는</span>
    </div>

    <button
      class="google-button"
      type="button"
      @click="handleGoogleLogin"
      :disabled="isGoogleSubmitting || isEmailSubmitting"
    >
      <span class="google-icon">G</span>
      <span>{{ isGoogleSubmitting ? '구글 로그인 중...' : 'Google 계정으로 로그인' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { User as FirebaseAuthUser } from 'firebase/auth'
import { emailLogin, emailSignup, googleLogin, setAuthPersistence } from '@/firebase/firebase'
import { apiPost, type ApiError } from '@/utils/api'
import { setAccessToken, setRefreshToken } from '@/utils/authToken'
import { AUTH_ERROR_MESSAGES } from '@/utils/authErrorMessages'

type AuthResponse = {
  userId: number
  username: string
  email: string
  name: string
  role?: string
  accessToken: string
  tokenType: string
  refreshToken?: string
}

const router = useRouter()
const mode = ref<'login' | 'signup'>('login')
const email = ref('')
const name = ref('')
const phone = ref('')
const username = ref('')
const password = ref('')
const isEmailSubmitting = ref(false)
const isGoogleSubmitting = ref(false)
const errorMsg = ref<string | null>(null)
const rememberEmail = ref(false)
const keepLoggedIn = ref(true)

const buildFirebaseLoginPayload = async (
  user: FirebaseAuthUser,
  profile?: { username?: string; name?: string; phone?: string }
) => {
  const idToken = await user.getIdToken()
  const emailLocal = user.email?.split('@')[0]?.trim()
  const uid = user.uid?.trim()
  const uidShort = uid?.slice(0, 6)

  // username은 사람이 읽기 쉬우면서 충돌 가능성을 낮춘다: 이메일 앞부분 + uid 앞자리
  const usernameToSend =
    profile?.username?.trim() ||
    (emailLocal && uidShort ? `${emailLocal}_${uidShort}` : uid || emailLocal || 'firebase_user')
  const nameToSend = profile?.name?.trim() || user.displayName?.trim() || emailLocal || usernameToSend
  const phoneToSend = profile?.phone?.trim() || user.phoneNumber?.trim() || '미입력'

  return { idToken, username: usernameToSend, name: nameToSend, phone: phoneToSend }
}

const persistUserEmail = (emailValue: string | null | undefined) => {
  if (emailValue) {
    localStorage.setItem('ws_user_email', emailValue)
  }
}

const handleAuthSuccess = (auth: AuthResponse, fallbackEmail?: string | null) => {
  if (auth?.accessToken) {
    setAccessToken(auth.accessToken)
  }
  setRefreshToken(auth?.refreshToken ?? null)
  persistUserEmail(auth?.email ?? fallbackEmail)
}

const resolveApiErrorMessage = (err: unknown, fallback: string) => {
  const apiErr = err as ApiError
  return apiErr?.userMessage || apiErr?.message || fallback
}

const emailButtonLabel = computed(() =>
  mode.value === 'login' ? '이메일로 로그인' : '이메일로 회원가입'
)

const loadPreferences = () => {
  const savedRemember = localStorage.getItem('ws-remember-email') === 'true'
  const savedEmail = localStorage.getItem('ws-remember-email-value')
  const savedKeepLogin = localStorage.getItem('ws-keep-login') === 'true'

  rememberEmail.value = savedRemember
  keepLoggedIn.value = savedKeepLogin

  if (savedRemember && savedEmail) {
    email.value = savedEmail
  }
}

onMounted(loadPreferences)

const persistPreferences = () => {
  localStorage.setItem('ws-keep-login', String(keepLoggedIn.value))

  if (rememberEmail.value) {
    localStorage.setItem('ws-remember-email', 'true')
    localStorage.setItem('ws-remember-email-value', email.value)
  } else {
    localStorage.removeItem('ws-remember-email')
    localStorage.removeItem('ws-remember-email-value')
  }
}

const handleGoogleLogin = async () => {
  if (isGoogleSubmitting.value) return

  errorMsg.value = null
  isGoogleSubmitting.value = true
  try {
    const user = await googleLogin()
    const payload = await buildFirebaseLoginPayload(user)
    const auth = await apiPost<AuthResponse>('/api/auth/firebase-login', payload, { skipAuth: true })
    handleAuthSuccess(auth, user.email)
    router.push({ name: 'home' })
  } catch (err: unknown) {
    console.error(err)
    const apiMessage = resolveApiErrorMessage(
      err,
      '구글 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.'
    )
    if (apiMessage) {
      const code = (err as { code?: string } | undefined)?.code
      errorMsg.value = code && AUTH_ERROR_MESSAGES[code] ? AUTH_ERROR_MESSAGES[code] : apiMessage
    } else {
      errorMsg.value = '구글 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.'
    }
  } finally {
    isGoogleSubmitting.value = false
  }
}

const handleEmailSubmit = async () => {
  if (isEmailSubmitting.value) return

  if (mode.value === 'signup') {
    if (!name.value.trim()) {
      errorMsg.value = '이름을 입력해 주세요.'
      return
    }
    if (!phone.value.trim()) {
      errorMsg.value = '전화번호를 입력해 주세요.'
      return
    }
    if (!username.value.trim()) {
      errorMsg.value = '아이디를 입력해 주세요.'
      return
    }
  }

  errorMsg.value = null
  isEmailSubmitting.value = true
  try {
    await setAuthPersistence(keepLoggedIn.value ? 'local' : 'session')
    persistPreferences()

    if (mode.value === 'login') {
      const user = await emailLogin(email.value, password.value)
      const payload = await buildFirebaseLoginPayload(user)
      const auth = await apiPost<AuthResponse>('/api/auth/firebase-login', payload, {
        skipAuth: true,
      })
      handleAuthSuccess(auth, user.email ?? email.value)
      router.push({ name: 'home' })
    } else {
      const trimmedUsername = username.value.trim()
      const trimmedName = name.value.trim()
      const trimmedPhone = phone.value.trim()

      // 1) Firebase Auth에 계정 생성
      const user = await emailSignup(
        email.value,
        password.value,
        trimmedUsername,
        trimmedName,
        trimmedPhone
      )

      // 2) Firebase ID token으로 백엔드 로그인 처리
      const payload = await buildFirebaseLoginPayload(user, {
        username: trimmedUsername,
        name: trimmedName,
        phone: trimmedPhone,
      })
      const auth = await apiPost<AuthResponse>('/api/auth/firebase-login', payload, {
        skipAuth: true,
      })
      handleAuthSuccess(auth, user.email ?? email.value)

      alert('인증 메일을 보냈어요. 메일을 확인한 뒤 로그인해 주세요.')
      name.value = ''
      phone.value = ''
      username.value = ''
      mode.value = 'login'
    }
  } catch (err: unknown) {
    console.error(err)
    const code = (err as { code?: string } | undefined)?.code
    const apiMessage = resolveApiErrorMessage(
      err,
      '이메일 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.'
    )
    if (code && AUTH_ERROR_MESSAGES[code]) {
      errorMsg.value = AUTH_ERROR_MESSAGES[code]
    } else {
      errorMsg.value = apiMessage
    }
  } finally {
    isEmailSubmitting.value = false
  }
}
</script>

<style scoped>
.login {
  max-width: 420px;
  margin: 40px auto;
  padding: 28px 24px;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 18px 35px rgba(84, 97, 119, 0.12);
  text-align: center;
}

.subtitle {
  margin: 8px 0 18px;
  color: #5f6b7a;
  font-size: 14px;
}

.email-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
}

.segmented {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 4px;
  background: #f3f5f9;
  border-radius: 16px;
}

.segmented button {
  border: none;
  border-radius: 12px;
  padding: 10px 0;
  background: transparent;
  color: #4b5563;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.segmented button.active {
  background: linear-gradient(135deg, #ff9a9e, #ffd4d2);
  color: #3c1b1b;
  box-shadow: 0 10px 24px rgba(255, 153, 158, 0.35);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #111827;
}

.field input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #d5d9e1;
  background: #fdfdff;
  font-size: 14px;
}

.field input:focus {
  outline: 2px solid #ff9a9e;
  outline-offset: 1px;
}

.options {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 4px;
}

.option {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
}

.hint {
  font-size: 12px;
  color: #6b7280;
  margin: 4px 0 0;
}

.primary {
  width: 100%;
  margin-top: 4px;
  padding: 12px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #ff8066, #ffa9a5);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 30px rgba(255, 128, 102, 0.35);
}

.primary:disabled,
.google-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  box-shadow: none;
}

.divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 22px 0 14px;
  color: #9ca3af;
  font-size: 13px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.google-button {
  width: 100%;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid #d5d9e1;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 10px 24px rgba(82, 95, 127, 0.08);
}

.google-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 16px 32px rgba(82, 95, 127, 0.14);
}

.google-icon {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: #4285f4;
  color: #fff;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}
</style>
