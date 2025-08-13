/**
 * @interface TDeleteUserRequest
 * @description 刪除使用者請求資料
 */
export interface TDeleteUserRequest {
  Id: string
}

/**
 * @interface TDeleteUserResponse
 * @description 刪除使用者回應資料
 */
export interface TDeleteUserResponse {
  // 根據原始 API 回應結構定義...
  [key: string]: any
}

/**
 * 刪除帳號使用者
 * @param {string} userId - 使用者ID
 * @returns {Promise<TDeleteUserResponse>} 刪除結果
 */
export async function apiDeleteAccountUser(userId: string): Promise<TDeleteUserResponse> {
  const api = useApi()
  
  return await api.post<TDeleteUserResponse>('/User/DeleteOneUser', {
    Id: userId
  })
}