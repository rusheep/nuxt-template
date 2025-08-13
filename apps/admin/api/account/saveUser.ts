/**
 * @interface TSaveUserRequest
 * @description 儲存使用者請求資料
 */
export interface TSaveUserRequest {
  Id?: string
  Account: string
  Name: string
  Email: string
  Phone: string
  RoleId: string
  Password?: string
}

/**
 * @interface TSaveUserResponse
 * @description 儲存使用者回應資料
 */
export interface TSaveUserResponse {
  // 根據原始 API 回應結構定義...
  [key: string]: any
}

/**
 * 儲存帳號使用者 (新增或更新)
 * @param {TSaveUserRequest} userData - 使用者資料
 * @returns {Promise<TSaveUserResponse>} 儲存結果
 */
export async function apiSaveAccountUser(userData: TSaveUserRequest): Promise<TSaveUserResponse> {
  const api = useApi()
  
  const requestData = userData.Id 
    ? {
        Id: userData.Id,
        Account: userData.Account,
        Name: userData.Name,
        Email: userData.Email,
        Phone: userData.Phone,
        RoleId: userData.RoleId
      }
    : {
        Id: "0",
        Account: userData.Account,
        Name: userData.Name,
        Email: userData.Email,
        Phone: userData.Phone,
        RoleId: userData.RoleId,
        Password: userData.Password
      }
  
  return await api.post<TSaveUserResponse>('/User/SaveUser', requestData)
}