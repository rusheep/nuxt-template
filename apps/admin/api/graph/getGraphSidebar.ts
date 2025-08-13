/**
 * @interface TGetGraphSidebarRequest
 * @description 取得圖表側邊欄請求資料
 */
export interface TGetGraphSidebarRequest {
  [key: string]: any
}

/**
 * @interface TGraphSidebarItem
 * @description 圖表側邊欄項目資料結構
 */
export interface TGraphSidebarItem {
  [key: string]: any
}

/**
 * @interface TGetGraphSidebarResponse
 * @description 取得圖表側邊欄回應資料
 */
export interface TGetGraphSidebarResponse {
  data: TGraphSidebarItem[]
  [key: string]: any
}

/**
 * 取得圖表管理側邊欄樹狀列表
 * @param {TGetGraphSidebarRequest} [params] - 請求參數
 * @returns {Promise<TGetGraphSidebarResponse>} 側邊欄資料
 */
export async function apiGetGraphSidebar(params: TGetGraphSidebarRequest = {}): Promise<TGetGraphSidebarResponse> {
  const api = useApi()
  
  return await api.post<TGetGraphSidebarResponse>('/GraphManage/GraphManageTreeList', params)
}