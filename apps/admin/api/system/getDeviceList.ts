/**
 * @interface TGetDeviceListRequest
 * @description 取得設備列表請求資料
 */
export interface TGetDeviceListRequest {
  // 根據原始 API 需要的參數定義...
  [key: string]: any
}

/**
 * @interface TDevice
 * @description 設備資料結構
 */
export interface TDevice {
  // 根據原始 API 回應結構定義...
  [key: string]: any
}

/**
 * @interface TGetDeviceListResponse
 * @description 取得設備列表回應資料
 */
export interface TGetDeviceListResponse {
  data: TDevice[]
  // 其他可能的回應欄位...
}

/**
 * 取得系統設備列表
 * @param {TGetDeviceListRequest} [params] - 請求參數
 * @returns {Promise<TGetDeviceListResponse>} 設備列表
 */
export async function apiGetSystemDeviceList(params: TGetDeviceListRequest = {}): Promise<TGetDeviceListResponse> {
  const api = useApi()
  
  return await api.post<TGetDeviceListResponse>('/api/Device/GetDeviceList', params)
}