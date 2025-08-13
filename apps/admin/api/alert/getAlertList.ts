/**
 * @interface TGetAlertListRequest
 * @description 取得警報列表請求資料
 */
export interface TGetAlertListRequest {
  // 根據原始 API 需要的參數定義...
  [key: string]: any
}

/**
 * @interface TAlert
 * @description 警報資料結構
 */
export interface TAlert {
  // 根據原始 API 回應結構定義...
  [key: string]: any
}

/**
 * @interface TGetAlertListResponse
 * @description 取得警報列表回應資料
 */
export interface TGetAlertListResponse {
  data: TAlert[]
  // 其他可能的回應欄位...
}

/**
 * 取得警報列表
 * @param {TGetAlertListRequest} [params] - 請求參數
 * @returns {Promise<TGetAlertListResponse>} 警報列表
 */
export async function apiGetAlertList(params: TGetAlertListRequest = {}): Promise<TGetAlertListResponse> {
  const api = useApi()
  
  return await api.post<TGetAlertListResponse>('/Alert/AlertList', params)
}