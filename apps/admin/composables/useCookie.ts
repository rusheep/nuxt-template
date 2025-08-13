/**
 * Cookie 管理 Composable
 * 用於處理認證 token、用戶名稱等 Cookie 操作
 */

interface CookieOptions {
  maxAge?: number // 秒數
  expires?: Date
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
}

export const useCookieManager = () => {
  /**
   * 設定 Cookie
   */
  const setCookie = (name: string, value: string, options: CookieOptions = {}) => {
    if (process.server) return // 服務端不執行

    const {
      maxAge = 24 * 60 * 60, // 預設 24 小時
      expires,
      path = '/',
      domain,
      secure = false,
      sameSite = 'Lax'
    } = options

    let cookieString = `${name}=${encodeURIComponent(value)}`
    
    if (maxAge) {
      cookieString += `; Max-Age=${maxAge}`
    }
    
    if (expires) {
      cookieString += `; Expires=${expires.toUTCString()}`
    }
    
    cookieString += `; Path=${path}`
    
    if (domain) {
      cookieString += `; Domain=${domain}`
    }
    
    if (secure) {
      cookieString += `; Secure`
    }
    
    cookieString += `; SameSite=${sameSite}`

    document.cookie = cookieString
  }

  /**
   * 取得 Cookie
   */
  const getCookie = (name: string): string | null => {
    if (process.server) return null // 服務端不執行

    const cookies: Record<string, string> = {}
    
    document.cookie.split(';').forEach((cookie) => {
      const [key, value] = cookie.split('=')
      if (key && value) {
        cookies[key.trim()] = decodeURIComponent(value.trim())
      }
    })
    
    return cookies[name] || null
  }

  /**
   * 刪除 Cookie
   */
  const removeCookie = (name: string, path = '/') => {
    if (process.server) return // 服務端不執行

    document.cookie = `${name}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
  }

  /**
   * 設定認證 Token
   */
  const setAuthToken = (token: string) => {
    setCookie('JWT-Authorization', token, {
      maxAge: 24 * 60 * 60 * 1000, // 24 小時（毫秒）
    })
  }

  /**
   * 取得認證 Token
   */
  const getAuthToken = (): string | null => {
    return getCookie('JWT-Authorization')
  }

  /**
   * 設定用戶名稱
   */
  const setUserName = (userName: string) => {
    setCookie('user_name', userName, {
      maxAge: 24 * 60 * 60 * 1000, // 24 小時（毫秒）
    })
  }

  /**
   * 取得用戶名稱
   */
  const getUserName = (): string | null => {
    return getCookie('user_name')
  }

  /**
   * 清除認證相關 Cookie
   */
  const clearAuth = () => {
    removeCookie('JWT-Authorization')
    removeCookie('user_name')
  }

  return {
    setCookie,
    getCookie,
    removeCookie,
    setAuthToken,
    getAuthToken,
    setUserName,
    getUserName,
    clearAuth
  }
}