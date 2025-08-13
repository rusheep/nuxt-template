/**
 * @interface TSetProductRequest
 * @description 設定產品請求資料
 */
export interface TSetProductRequest {
  [key: string]: any
}

/**
 * @interface TSetProductResponse
 * @description 設定產品回應資料
 */
export interface TSetProductResponse {
  [key: string]: any
}

/**
 * 設定產品
 * @param {TSetProductRequest} data - 產品設定資料
 * @returns {Promise<TSetProductResponse>} 設定結果
 */
export async function apiSetProduct(data: TSetProductRequest): Promise<TSetProductResponse> {
  const api = useApi()
  
  return await api.post<TSetProductResponse>('/SituationRoom/SetProduct', data)
}