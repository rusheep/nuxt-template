/**
 * @interface TGetHistoryDataRequest
 * @description 取得歷史資料請求資料
 */
export interface TGetHistoryDataRequest {
  [key: string]: any
}

/**
 * @interface THistoryDataItem
 * @description 歷史資料項目結構
 */
export interface THistoryDataItem {
  [key: string]: any
}

/**
 * @interface TGetHistoryDataResponse
 * @description 取得歷史資料回應資料
 */
export interface TGetHistoryDataResponse {
  data: THistoryDataItem[]
  [key: string]: any
}

/**
 * 取得歷史資料
 * @param {TGetHistoryDataRequest} [params] - 請求參數
 * @returns {Promise<TGetHistoryDataResponse>} 歷史資料
 */
export async function apiGetHistoryData(params: TGetHistoryDataRequest = {}): Promise<TGetHistoryDataResponse> {
  const api = useApi()
  
  return await api.post<TGetHistoryDataResponse>('/api/History/GetHistoryData', params)
}