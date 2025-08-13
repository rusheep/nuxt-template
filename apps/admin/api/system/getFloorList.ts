/**
 * @interface TGetFloorListRequest
 * @description 取得樓層列表請求資料
 */
export interface TGetFloorListRequest {
  // 根據原始 API 需要的參數定義...
  [key: string]: any
}

/**
 * @interface TFloor
 * @description 樓層資料結構
 */
export interface TFloor {
  // 根據原始 API 回應結構定義...
  [key: string]: any
}

/**
 * @interface TGetFloorListResponse
 * @description 取得樓層列表回應資料
 */
export interface TGetFloorListResponse {
  data: TFloor[]
  // 其他可能的回應欄位...
}

/**
 * 取得系統樓層列表
 * @param {TGetFloorListRequest} [params] - 請求參數
 * @returns {Promise<TGetFloorListResponse>} 樓層列表
 */
export async function apiGetSystemFloorList(params: TGetFloorListRequest = {}): Promise<TGetFloorListResponse> {
  const api = useApi()
  
  return await api.post<TGetFloorListResponse>('/api/Device/GetFloor', params)
}