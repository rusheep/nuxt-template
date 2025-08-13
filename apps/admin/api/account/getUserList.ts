/**
 * @interface TGetUserListRequest
 * @description 取得使用者列表請求參數
 */
export interface TGetUserListRequest {
  [key: string]: any // 允許動態搜尋條件
}

/**
 * @interface TUser
 * @description 使用者資料結構
 */
export interface TUser {
  id: string
  account: string
  full_name: string
  email: string
  phone: string
  role_guid: string
  // 其他可能的欄位...
}

/**
 * @interface TGetUserListResponse
 * @description 取得使用者列表回應資料
 */
export interface TGetUserListResponse {
  data: TUser[]
  // 其他可能的回應欄位...
}

/**
 * 取得帳號使用者列表
 * @param {TGetUserListRequest} [searchCondition] - 搜尋條件
 * @returns {Promise<TGetUserListResponse>} 使用者列表回應
 */
export async function apiGetAccountUserList(searchCondition: TGetUserListRequest = {}): Promise<TGetUserListResponse> {
  const api = useApi()
  
  return await api.post<TGetUserListResponse>('/User/UserManagerList', searchCondition)
}