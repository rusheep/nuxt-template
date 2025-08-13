/**
 * @interface TLoginRequest
 * @description 登入請求資料
 */
export interface TLoginRequest {
  account: string
  password: string
}

/**
 * @interface TLoginResponse
 * @description 登入回應資料
 */
export interface TLoginResponse {
  token: string
  user_name: string
  // 其他可能的回應欄位...
}

/**
 * @interface TLoginResult
 * @description 登入處理結果
 */
export interface TLoginResult {
  data: TLoginResponse | null
  isSuccess: boolean
  code: string
  msg?: string
}

/**
 * 使用者登入
 * @param {TLoginRequest} credentials - 登入憑證
 * @returns {Promise<TLoginResult>} 登入處理結果
 */
export async function apiLogin(credentials: TLoginRequest): Promise<TLoginResult> {
  const api = useApi()
  
  try {
    const response = await api.post<any>('/LoginV2/', {
      account: credentials.account,
      password: credentials.password
    })
    
    // 攔截器已經自動處理 Cookie 設定，這裡只需要返回結果
    if (response.code === "0000" && response.data) {
      return {
        data: response.data,
        isSuccess: true,
        code: response.code,
        msg: response.msg
      }
    }
    
    // 登入失敗
    return {
      data: null,
      isSuccess: false,
      code: response.code || 'UNKNOWN',
      msg: response.msg || '登入失敗'
    }
  } catch (error) {
    console.error('登入失敗:', error)
    return {
      data: null,
      isSuccess: false,
      code: 'ERROR',
      msg: error instanceof Error ? error.message : '登入發生錯誤'
    }
  }
}