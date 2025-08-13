/**
 * @interface TChangePasswordRequest
 * @description 變更密碼請求資料
 */
export interface TChangePasswordRequest {
  Id: string
  Password: string
}

/**
 * @interface TChangePasswordResponse
 * @description 變更密碼回應資料
 */
export interface TChangePasswordResponse {
  // 根據原始 API 回應結構定義...
  [key: string]: any
}

/**
 * 變更使用者密碼
 * @param {TChangePasswordRequest} data - 密碼變更資料
 * @returns {Promise<TChangePasswordResponse>} 變更結果
 */
export async function apiChangeUserPassword(data: TChangePasswordRequest): Promise<TChangePasswordResponse> {
  const api = useApi()
  
  return await api.post<TChangePasswordResponse>('/User/SaveUser', {
    Id: data.Id,
    Password: data.Password
  })
}