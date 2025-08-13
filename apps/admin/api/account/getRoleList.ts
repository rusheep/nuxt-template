/**
 * @interface TGetRoleListRequest
 * @description 取得角色列表請求參數
 */
export interface TGetRoleListRequest {
  Layer?: number
  [key: string]: any // 允許其他搜尋條件
}

/**
 * @interface TRole
 * @description 角色資料結構
 */
export interface TRole {
  Id: string
  Name: string
  // 其他可能的欄位...
}

/**
 * @interface TGetRoleListResponse
 * @description 取得角色列表回應資料
 */
export interface TGetRoleListResponse {
  data: TRole[]
  // 其他可能的回應欄位...
}

/**
 * 取得帳號角色列表
 * @param {TGetRoleListRequest} [searchCondition] - 搜尋條件
 * @returns {Promise<TGetRoleListResponse>} 角色列表回應
 */
export async function apiGetAccountRoleList(searchCondition: TGetRoleListRequest = {}): Promise<TGetRoleListResponse> {
  const api = useApi()
  
  return await api.post<TGetRoleListResponse>('/User/RoleManagerList', {
    Layer: 1,
    ...searchCondition
  })
}