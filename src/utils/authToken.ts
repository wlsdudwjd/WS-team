const ACCESS_TOKEN_KEY = 'ws_access_token'
const REFRESH_TOKEN_KEY = 'ws_refresh_token'

export const setAccessToken = (token?: string | null) => {
  if (token && token.trim()) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token.trim())
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  }
}

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export const setRefreshToken = (token?: string | null) => {
  if (token && token.trim()) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token.trim())
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }
}

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}
