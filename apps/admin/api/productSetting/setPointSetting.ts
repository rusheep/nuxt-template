/**
 * @interface TSetPointSettingRequest
 * @description 設定點位請求資料
 */
export interface TSetPointSettingRequest {
  [key: string]: any
}

/**
 * @interface TSetPointSettingResponse
 * @description 設定點位回應資料
 */
export interface TSetPointSettingResponse {
  [key: string]: any
}

/**
 * 設定點位設定
 * @param {TSetPointSettingRequest} data - 點位設定資料
 * @returns {Promise<TSetPointSettingResponse>} 設定結果
 */
export async function apiSetPointSetting(data: TSetPointSettingRequest): Promise<TSetPointSettingResponse> {
  const api = useApi()
  
  return await api.post<TSetPointSettingResponse>('/SituationRoom/SetPointSetting', data)
}