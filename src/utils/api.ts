import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from './authToken'

const API_BASE = (
  import.meta.env.VITE_API_BASE ??
  import.meta.env.VITE_API_BASE_URL ??
  ''
).replace(/\/$/, '')

const withBase = (path: string) => {
  if (!API_BASE) return path
  return `${API_BASE}${path}`
}

type RequestOptions = {
  skipAuth?: boolean // true for auth/refresh endpoints
  retrying?: boolean
}

export type ApiError = Error & {
  status?: number
  code?: string
  path?: string
  details?: unknown
  raw?: unknown
  userMessage?: string
}

const API_ERROR_MESSAGES: Record<string, string> = {
  BAD_REQUEST: '요청을 다시 확인해 주세요.',
  VALIDATION_FAILED: '입력값을 다시 확인해 주세요.',
  INVALID_QUERY_PARAM: '요청 파라미터가 올바르지 않습니다.',
  UNAUTHORIZED: '로그인이 필요합니다.',
  TOKEN_EXPIRED: '로그인 세션이 만료되었습니다. 다시 로그인해 주세요.',
  REFRESH_TOKEN_EXPIRED: '로그인 세션이 만료되었습니다. 다시 로그인해 주세요.',
  INVALID_REFRESH_TOKEN: '로그인 세션이 만료되었습니다. 다시 로그인해 주세요.',
  FORBIDDEN: '접근 권한이 없습니다.',
  RESOURCE_NOT_FOUND: '요청한 정보를 찾을 수 없습니다.',
  USER_NOT_FOUND: '사용자를 찾을 수 없습니다.',
  DUPLICATE_RESOURCE: '이미 존재하는 정보입니다.',
  STATE_CONFLICT: '요청을 처리할 수 없는 상태입니다.',
  UNPROCESSABLE_ENTITY: '요청을 처리할 수 없습니다.',
  TOO_MANY_REQUESTS: '요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.',
  INTERNAL_SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  DATABASE_ERROR: 'DB 처리 중 오류가 발생했습니다.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
}

const parseError = async (res: Response, fallback: string): Promise<ApiError> => {
  let data: any = null
  try {
    data = await res.clone().json()
  } catch {
    // ignore parse errors
  }
  const code = data?.code ?? (res.status === 401 ? 'UNAUTHORIZED' : 'UNKNOWN_ERROR')
  const message = data?.message || fallback || res.statusText || `status ${res.status}`
  const userMessage = API_ERROR_MESSAGES[code] || message

  const err = new Error(userMessage) as ApiError
  err.status = res.status
  err.code = code
  err.path = data?.path
  err.details = data?.details
  err.raw = data
  err.userMessage = userMessage
  return err
}

type JsonLike = Record<string, unknown>
type RefreshResponse = { accessToken: string; refreshToken?: string }

const refreshTokens = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  let res: Response
  try {
    res = await fetch(withBase('/api/auth/refresh'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
  } catch {
    clearAuthTokens()
    return false
  }

  if (!res.ok) {
    clearAuthTokens()
    return false
  }

  const data = (await res.json()) as RefreshResponse
  if (!data?.accessToken) {
    clearAuthTokens()
    return false
  }
  setAccessToken(data.accessToken)
  if (data.refreshToken) {
    setRefreshToken(data.refreshToken)
  }
  return true
}

const buildHeaders = (skipAuth: boolean, hasBody: boolean) => {
  const headers: Record<string, string> = hasBody ? { 'Content-Type': 'application/json' } : {}
  const accessToken = getAccessToken()
  if (!skipAuth && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }
  return headers
}

const request = async <T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: unknown,
  options?: RequestOptions
): Promise<T> => {
  const skipAuth = options?.skipAuth ?? false

  const makeFetch = async () => {
    const headers = buildHeaders(skipAuth, body !== undefined)
    // 토큰이 필요한데 없는 경우 -> 바로 갱신 시도
    if (!skipAuth && !headers.Authorization) {
      const refreshed = await refreshTokens()
      if (!refreshed) {
        throw Object.assign(new Error('로그인이 필요합니다.') as ApiError, {
          status: 401,
          code: 'UNAUTHORIZED',
          userMessage: '로그인이 필요합니다.',
        })
      }
      headers.Authorization = `Bearer ${getAccessToken()!}`
    }

    const res = await fetch(withBase(path), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    if (res.ok) {
      try {
        return (await res.json()) as T
      } catch {
        // no content
        return undefined as T
      }
    }

    // 액세스 토큰 만료 시 한 번만 자동 재시도
    if (res.status === 401 && !skipAuth && !options?.retrying) {
      const refreshed = await refreshTokens()
      if (refreshed) {
        return request<T>(path, method, body, { ...options, retrying: true })
      }
      clearAuthTokens()
    }

    throw await parseError(res, `${method} ${path} failed`)
  }

  return makeFetch()
}

export const apiGet = async <T>(path: string, options?: RequestOptions): Promise<T> =>
  request<T>(path, 'GET', undefined, options)

export const apiPost = async <T>(
  path: string,
  body: JsonLike | unknown,
  options?: RequestOptions
): Promise<T> => request<T>(path, 'POST', body, options)

export const apiPut = async <T>(
  path: string,
  body: JsonLike | unknown,
  options?: RequestOptions
): Promise<T> => request<T>(path, 'PUT', body, options)

export const apiDelete = async <T>(path: string, options?: RequestOptions): Promise<T> =>
  request<T>(path, 'DELETE', undefined, options)
