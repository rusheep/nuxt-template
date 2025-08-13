/**
 * @interface TSaveOperationRecordRequest
 * @description 儲存操作記錄請求資料
 */
export interface TSaveOperationRecordRequest {
  [key: string]: any
}

/**
 * @interface TSaveOperationRecordResponse
 * @description 儲存操作記錄回應資料
 */
export interface TSaveOperationRecordResponse {
  [key: string]: any
}

/**
 * 儲存操作記錄
 * @param {TSaveOperationRecordRequest} data - 操作記錄資料
 * @returns {Promise<TSaveOperationRecordResponse>} 儲存結果
 */
export async function apiSaveOperationRecord(data: TSaveOperationRecordRequest): Promise<TSaveOperationRecordResponse> {
  const api = useApi()
  
  return await api.post<TSaveOperationRecordResponse>('/operation/SavOpeRecord', data)
}