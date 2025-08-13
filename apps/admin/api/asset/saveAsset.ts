/**
 * @interface TSaveAssetRequest
 * @description 儲存資產請求資料
 */
export interface TSaveAssetRequest {
  [key: string]: any
}

/**
 * @interface TSaveAssetResponse
 * @description 儲存資產回應資料
 */
export interface TSaveAssetResponse {
  [key: string]: any
}

/**
 * 儲存資產
 * @param {TSaveAssetRequest} data - 資產資料
 * @returns {Promise<TSaveAssetResponse>} 儲存結果
 */
export async function apiSaveAsset(data: TSaveAssetRequest): Promise<TSaveAssetResponse> {
  const api = useApi()
  
  return await api.post<TSaveAssetResponse>('/AssetManage/SaveAsset', data)
}