/**
 * @interface TGetEnergyInfoRequest
 * @description 取得能源資訊請求資料
 */
export interface TGetEnergyInfoRequest {
  building_guid: string
}

/**
 * @interface TGetEnergyInfoResponse
 * @description 取得能源資訊回應資料
 */
export interface TGetEnergyInfoResponse {
  // 根據原始 API 回應結構定義...
  [key: string]: any
}

/**
 * 取得能源資訊
 * @param {string} buildingGuid - 建築物GUID
 * @returns {Promise<TGetEnergyInfoResponse>} 能源資訊
 */
export async function apiGetEnergyInfo(buildingGuid: string): Promise<TGetEnergyInfoResponse> {
  const api = useApi()
  
  return await api.post<TGetEnergyInfoResponse>('api/dashboard/GetEnergyInfo', {
    building_guid: buildingGuid
  })
}