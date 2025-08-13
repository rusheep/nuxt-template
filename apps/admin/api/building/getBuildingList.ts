/**
 * @interface TGetBuildingListRequest
 * @description 取得建築物列表請求資料
 */
export interface TGetBuildingListRequest {
  // 根據原始 API 需要的參數定義...
  [key: string]: any
}

/**
 * @interface TBuilding
 * @description 建築物資料結構
 */
export interface TBuilding {
  // 根據原始 API 回應結構定義...
  [key: string]: any
}

/**
 * @interface TGetBuildingListResponse
 * @description 取得建築物列表回應資料
 */
export interface TGetBuildingListResponse {
  data: TBuilding[]
  // 其他可能的回應欄位...
}

/**
 * 取得建築物列表
 * @param {TGetBuildingListRequest} [params] - 請求參數
 * @returns {Promise<TGetBuildingListResponse>} 建築物列表
 */
export async function apiGetBuildingList(params: TGetBuildingListRequest = {}): Promise<TGetBuildingListResponse> {
  const api = useApi()
  
  return await api.post<TGetBuildingListResponse>('/AssetManage/GetBuildingList', params)
}