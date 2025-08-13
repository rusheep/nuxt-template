/**
 * @interface TGetRealTimeDistributionRequest
 * @description 取得即時分配請求資料
 */
export interface TGetRealTimeDistributionRequest {
  // 根據原始 API 需要的參數定義...
  [key: string]: any
}

/**
 * @interface TGetRealTimeDistributionResponse
 * @description 取得即時分配回應資料
 */
export interface TGetRealTimeDistributionResponse {
  // 根據原始 API 回應結構定義...
  [key: string]: any
}

/**
 * 取得即時分配資料
 * @param {TGetRealTimeDistributionRequest} [params] - 請求參數
 * @returns {Promise<TGetRealTimeDistributionResponse>} 即時分配資料
 */
export async function apiGetRealTimeDistribution(params: TGetRealTimeDistributionRequest = {}): Promise<TGetRealTimeDistributionResponse> {
  const api = useApi()
  
  return await api.post<TGetRealTimeDistributionResponse>('/api/Energe/GetRealTimeDistribution', params)
}