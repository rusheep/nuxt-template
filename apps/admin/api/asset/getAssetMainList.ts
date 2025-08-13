/**
 * @interface TGetAssetMainListRequest
 * @description 取得資產主列表請求資料
 */
export interface TGetAssetMainListRequest {
  [key: string]: any
}

/**
 * @interface TAssetMain
 * @description 資產主資料結構
 */
export interface TAssetMain {
  [key: string]: any
}

/**
 * @interface TGetAssetMainListResponse
 * @description 取得資產主列表回應資料
 */
export interface TGetAssetMainListResponse {
  data: TAssetMain[]
  [key: string]: any
}

/**
 * 取得資產主列表
 * @param {TGetAssetMainListRequest} [params] - 請求參數
 * @returns {Promise<TGetAssetMainListResponse>} 資產主列表
 */
export async function apiGetAssetMainList(params: TGetAssetMainListRequest = {}): Promise<TGetAssetMainListResponse> {
  const api = useApi()
  
  return await api.post<TGetAssetMainListResponse>('/AssetManage/GetAssetMainList', params)
}