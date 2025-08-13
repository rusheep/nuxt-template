/**
 * @interface TGetSitesSystemStatusRequest
 * @description 取得站點系統狀態請求資料
 */
export interface TGetSitesSystemStatusRequest {
  [key: string]: any
}

/**
 * @interface TSiteSystemStatus
 * @description 站點系統狀態資料結構
 */
export interface TSiteSystemStatus {
  [key: string]: any
}

/**
 * @interface TGetSitesSystemStatusResponse
 * @description 取得站點系統狀態回應資料
 */
export interface TGetSitesSystemStatusResponse {
  data: TSiteSystemStatus[]
  [key: string]: any
}

/**
 * 取得站點系統狀態
 * @param {TGetSitesSystemStatusRequest} [params] - 請求參數
 * @returns {Promise<TGetSitesSystemStatusResponse>} 站點系統狀態
 */
export async function apiGetSitesSystemStatus(params: TGetSitesSystemStatusRequest = {}): Promise<TGetSitesSystemStatusResponse> {
  const api = useApi()
  
  return await api.post<TGetSitesSystemStatusResponse>('/api/monitoring/sites-system-status', params)
}