/**
 * @interface TGetAssetListRequest
 * @description 取得資產列表請求資料
 */
export interface TGetAssetListRequest {
  [key: string]: any
}

/**
 * @interface TAsset
 * @description 資產資料結構
 */
export interface TAsset {
  [key: string]: any
}

/**
 * @interface TGetAssetListResponse
 * @description 取得資產列表回應資料
 */
export interface TGetAssetListResponse {
  data: TAsset[]
  [key: string]: any
}

/**
 * 取得資產列表
 * @param {TGetAssetListRequest} [params] - 請求參數
 * @returns {Promise<TGetAssetListResponse>} 資產列表
 */
export async function apiGetAssetList(params: TGetAssetListRequest = {}): Promise<TGetAssetListResponse> {
  const api = useApi()
  
  return await api.post<TGetAssetListResponse>('/AssetManage/GetAssetList', params)
}