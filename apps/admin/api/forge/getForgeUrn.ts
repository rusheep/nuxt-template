/**
 * @interface TGetForgeUrnRequest
 * @description 取得 Forge URN 請求資料
 */
export interface TGetForgeUrnRequest {
  [key: string]: any
}

/**
 * @interface TGetForgeUrnResponse
 * @description 取得 Forge URN 回應資料
 */
export interface TGetForgeUrnResponse {
  [key: string]: any
}

/**
 * 取得 Forge URN 建築資料
 * @param {TGetForgeUrnRequest} [params] - 請求參數
 * @returns {Promise<TGetForgeUrnResponse>} Forge URN 資料
 */
export async function apiGetForgeUrn(params: TGetForgeUrnRequest = {}): Promise<TGetForgeUrnResponse> {
  const api = useApi()
  
  return await api.post<TGetForgeUrnResponse>('/api/Device/GetBuild', params)
}