/**
 * @interface TGetDashboardDeviceRequest
 * @description 取得儀表板設備請求資料
 */
export interface TGetDashboardDeviceRequest {
  option: number | string
}

/**
 * @interface TGetDashboardDeviceResponse
 * @description 取得儀表板設備回應資料
 */
export interface TGetDashboardDeviceResponse {
  // 根據原始 API 回應結構定義...
  [key: string]: any
}

/**
 * 取得儀表板設備資料
 * @param {TGetDashboardDeviceRequest} params - 請求參數
 * @returns {Promise<TGetDashboardDeviceResponse>} 設備資料
 */
export async function apiGetDashboardDevice(params: TGetDashboardDeviceRequest): Promise<TGetDashboardDeviceResponse> {
  const api = useApi()
  
  return await api.post<TGetDashboardDeviceResponse>('/SituationRoom/GetDeviceList', {
    option: parseInt(params.option.toString())
  })
}