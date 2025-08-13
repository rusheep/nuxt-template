/**
 * @interface TGetDashboardInitRequest
 * @description 取得儀表板初始化請求資料
 */
export interface TGetDashboardInitRequest {
  page_type?: string // SR:戰情室;PS:生產設定
}

/**
 * @interface TGetDashboardInitResponse
 * @description 取得儀表板初始化回應資料
 */
export interface TGetDashboardInitResponse {
  // 根據原始 API 回應結構定義...
  [key: string]: any
}

/**
 * 取得儀表板初始化資料
 * @param {string} [pageType] - 頁面類型 (預設: "SR")
 * @returns {Promise<TGetDashboardInitResponse>} 初始化資料
 */
export async function apiGetDashboardInit(pageType: string = "SR"): Promise<TGetDashboardInitResponse> {
  const api = useApi()
  
  return await api.post<TGetDashboardInitResponse>('/SituationRoom/Initialize', {
    page_type: pageType
  })
}