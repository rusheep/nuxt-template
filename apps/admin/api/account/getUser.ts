/**
 * @interface TGetUserRequest
 * @description 取得單一使用者請求資料
 */
export interface TGetUserRequest {
  Id: string
}

/**
 * @interface TGetUserResponse
 * @description 取得單一使用者回應資料
 */
export interface TGetUserResponse {
  Account: string
  Name: string
  Email: string
  Phone: string
  RoleId: string
  Id: string
}

/**
 * 取得單一帳號使用者
 * @param {string} userId - 使用者ID
 * @returns {Promise<TGetUserResponse>} 使用者資料
 */
export async function apiGetAccountUser(userId: string): Promise<TGetUserResponse> {
  const api = useApi()
  
  const response = await api.post('/User/GetOneUser', {
    Id: userId
  })
  
  // 轉換回應格式 (根據原始實作)
  return {
    Account: response.data?.account,
    Name: response.data?.full_name,
    Email: response.data?.email,
    Phone: response.data?.phone,
    RoleId: response.data?.role_guid,
    Id: userId
  }
}