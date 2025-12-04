import { initializeApp } from 'firebase/app'
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  setPersistence,
  signOut,
  updateProfile,
} from 'firebase/auth'

// 👉 여기는 네 Firebase 콘솔에서 복붙해와야 해!
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export const setAuthPersistence = async (type: 'local' | 'session') => {
  const persistence =
    type === 'local' ? browserLocalPersistence : browserSessionPersistence
  await setPersistence(auth, persistence)
}

export const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    console.log('구글 로그인 성공:', result.user)
    return result.user
  } catch (error) {
    console.error('구글 로그인 에러:', error)
    throw error instanceof Error ? error : new Error('구글 로그인에 실패했습니다.')
  }
}

const assertEmailPassword = (email: string, password: string) => {
  if (!email || !password) {
    throw new Error('이메일과 비밀번호를 모두 입력해 주세요.')
  }
  if (password.length < 6) {
    throw new Error('비밀번호는 6자 이상이어야 합니다.')
  }
}

export const emailLogin = async (email: string, password: string) => {
  assertEmailPassword(email, password)

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    if (!user.emailVerified) {
      throw new Error('이메일 인증 후 로그인해 주세요. 메일함을 확인해 주세요.')
    }
    console.log('이메일 로그인 성공:', user)
    return user
  } catch (error) {
    console.error('이메일 로그인 에러:', error)
    throw error instanceof Error ? error : new Error('이메일 로그인에 실패했습니다.')
  }
}

export const emailSignup = async (
  email: string,
  password: string,
  userId: string,
  name: string,
  phone: string
) => {
  assertEmailPassword(email, password)
  const trimmedId = userId?.trim()
  if (!trimmedId) {
    throw new Error('아이디를 입력해 주세요.')
  }
  const trimmedName = name?.trim()
  const trimmedPhone = phone?.trim()
  if (!trimmedName) {
    throw new Error('이름을 입력해 주세요.')
  }
  if (!trimmedPhone) {
    throw new Error('전화번호를 입력해 주세요.')
  }

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    if (!user.emailVerified) {
      await sendEmailVerification(user)
    }
    await updateProfile(user, { displayName: trimmedName })
    console.log('이메일 회원가입 성공:', { user, userId: trimmedId, phone: trimmedPhone })
    return user
  } catch (error) {
    console.error('이메일 회원가입 에러:', error)
    throw error instanceof Error ? error : new Error('이메일 회원가입에 실패했습니다.')
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('로그아웃 에러:', error)
    throw error instanceof Error ? error : new Error('로그아웃에 실패했습니다.')
  }
}
