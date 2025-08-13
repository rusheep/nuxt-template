/**
 * @interface TGetHistoryFavoriteRequest
 * @description 取得歷史收藏請求資料
 */
export interface TGetHistoryFavoriteRequest {
  [key: string]: any
}

/**
 * @interface THistoryFavoriteItem
 * @description 歷史收藏項目結構
 */
export interface THistoryFavoriteItem {
  [key: string]: any
}

/**
 * @interface TGetHistoryFavoriteResponse
 * @description 取得歷史收藏回應資料
 */
export interface TGetHistoryFavoriteResponse {
  data: THistoryFavoriteItem[]
  [key: string]: any
}

/**
 * 取得歷史收藏
 * @param {TGetHistoryFavoriteRequest} [params] - 請求參數
 * @returns {Promise<TGetHistoryFavoriteResponse>} 歷史收藏資料
 */
export async function apiGetHistoryFavorite(params: TGetHistoryFavoriteRequest = {}): Promise<TGetHistoryFavoriteResponse> {
  const api = useApi()
  
  return await api.post<TGetHistoryFavoriteResponse>('/api/History/GetHistoryFavorite', params)
}