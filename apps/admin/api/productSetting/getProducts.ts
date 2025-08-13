/**
 * @interface TGetProductsRequest
 * @description 取得產品請求資料
 */
export interface TGetProductsRequest {
  [key: string]: any
}

/**
 * @interface TProduct
 * @description 產品資料結構
 */
export interface TProduct {
  [key: string]: any
}

/**
 * @interface TGetProductsResponse
 * @description 取得產品回應資料
 */
export interface TGetProductsResponse {
  data: TProduct[]
  [key: string]: any
}

/**
 * 取得產品列表
 * @param {TGetProductsRequest} [params] - 請求參數
 * @returns {Promise<TGetProductsResponse>} 產品列表
 */
export async function apiGetProducts(params: TGetProductsRequest = {}): Promise<TGetProductsResponse> {
  const api = useApi()
  
  return await api.post<TGetProductsResponse>('/SituationRoom/GetProducts', params)
}