/**
 * @interface TGetGraphTableRequest
 * @description 取得圖表表格請求資料
 */
export interface TGetGraphTableRequest {
  [key: string]: any
}

/**
 * @interface TGraphTableItem
 * @description 圖表表格項目資料結構
 */
export interface TGraphTableItem {
  [key: string]: any
}

/**
 * @interface TGetGraphTableResponse
 * @description 取得圖表表格回應資料
 */
export interface TGetGraphTableResponse {
  data: TGraphTableItem[]
  [key: string]: any
}

/**
 * 取得圖表管理表格列表
 * @param {TGetGraphTableRequest} [params] - 請求參數
 * @returns {Promise<TGetGraphTableResponse>} 表格資料
 */
export async function apiGetGraphTable(params: TGetGraphTableRequest = {}): Promise<TGetGraphTableResponse> {
  const api = useApi()
  
  return await api.post<TGetGraphTableResponse>('/GraphManage/GraManList', params)
}