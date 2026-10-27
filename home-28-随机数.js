/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageRandom", "<!-- pageRandom -->\n<div class=\"tool-page\" id=\"pageRandom\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🎲随机数生成</h3>\n      <label>最小值</label><input id=\"randMin\" value=\"1\">\n      <label>最大值</label><input id=\"randMax\" value=\"100\">\n      <br>\n      <button class=\"common-btn\" onclick=\"genRandom()\">生成随机整数</button>\n      <div id=\"randResult\" style=\"margin-top:10px;font-size:18px;font-weight:bold\"></div>\n    </div>\n  </div>");
// ==================== 随机数 ====================
const randMin=document.getElementById('randMin'), randMax=document.getElementById('randMax'), randResult=document.getElementById('randResult');
function genRandom(){
  const min=Number(randMin.value), max=Number(randMax.value);
  if(isNaN(min)||isNaN(max)||min>max){ randResult.textContent='输入非法'; showToast('请检查输入范围'); return; }
  randResult.textContent=Math.floor(Math.random()*(max-min+1))+min;
}

