export default defineEventHandler(async (event) => {
  // 處理 CORS 預檢請求
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Building-GUID',
    'Access-Control-Max-Age': '86400'
  })
  
  return ''
})