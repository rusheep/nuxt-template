/**
 * @interface TGetEnergyCostRankRequest
 * @description 取得能源成本排名請求資料
 */
export interface TGetEnergyCostRankRequest {
  [key: string]: any
}

/**
 * @interface TEnergyCostRankItem
 * @description 能源成本排名項目資料結構
 */
export interface TEnergyCostRankItem {
  [key: string]: any
}

/**
 * @interface TGetEnergyCostRankResponse
 * @description 取得能源成本排名回應資料
 */
export interface TGetEnergyCostRankResponse {
  data: TEnergyCostRankItem[]
  [key: string]: any
}

/**
 * 取得站點能源成本排名
 * @param {TGetEnergyCostRankRequest} [params] - 請求參數
 * @returns {Promise<TGetEnergyCostRankResponse>} 能源成本排名
 */
export async function apiGetEnergyCostRank(params: TGetEnergyCostRankRequest = {}): Promise<TGetEnergyCostRankResponse> {
  const api = useApi()
  
  return await api.post<TGetEnergyCostRankResponse>('/api/energy-manager/all-site/energy-cost-rank', params)
}