/**
 * @interface TGetOperationRecordRequest
 * @description 取得操作記錄請求資料
 */
export interface TGetOperationRecordRequest {
  [key: string]: any
}

/**
 * @interface TOperationRecord
 * @description 操作記錄資料結構
 */
export interface TOperationRecord {
  [key: string]: any
}

/**
 * @interface TGetOperationRecordResponse
 * @description 取得操作記錄回應資料
 */
export interface TGetOperationRecordResponse {
  data: TOperationRecord[]
  [key: string]: any
}

/**
 * 取得操作記錄列表
 * @param {TGetOperationRecordRequest} [params] - 請求參數
 * @returns {Promise<TGetOperationRecordResponse>} 操作記錄列表
 */
export async function apiGetOperationRecord(params: TGetOperationRecordRequest = {}): Promise<TGetOperationRecordResponse> {
  const api = useApi()
  
  return await api.post<TGetOperationRecordResponse>('/operation/OpeRecList', params)
}