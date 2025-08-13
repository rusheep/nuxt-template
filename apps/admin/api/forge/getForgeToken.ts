/**
 * @interface TGetForgeTokenRequest
 * @description 取得 Forge Token 請求資料
 */
export interface TGetForgeTokenRequest {
  [key: string]: any
}

/**
 * @interface TGetForgeTokenResponse
 * @description 取得 Forge Token 回應資料
 */
export interface TGetForgeTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  [key: string]: any
}

/**
 * 取得 Forge OAuth Token
 * @param {TGetForgeTokenRequest} [params] - 請求參數
 * @returns {Promise<TGetForgeTokenResponse>} Forge Token
 */
export async function apiGetForgeToken(params: TGetForgeTokenRequest = {}): Promise<TGetForgeTokenResponse> {
  const api = useApi()
  
  return await api.post<TGetForgeTokenResponse>('/api/forge/oauth/token', params)
}