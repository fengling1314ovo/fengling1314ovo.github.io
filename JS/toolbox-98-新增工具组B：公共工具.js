/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageBmiPage", "<!-- pageBmiPage -->\n<div class=\"tool-page\" id=\"pageBmiPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>⚖️ BMI身体指数</h3>\n      <label>身高(cm)</label>\n      <input id=\"bmiHeight\" type=\"number\" placeholder=\"例如 170\" min=\"50\" max=\"250\" inputmode=\"numeric\">\n      <label>体重(kg)</label>\n      <input id=\"bmiWeight\" type=\"number\" placeholder=\"例如 62\" min=\"20\" max=\"300\" inputmode=\"numeric\">\n      <br>\n      <button class=\"common-btn\" onclick=\"calcBmi()\">📊 计算BMI</button>\n      <button class=\"common-btn\" onclick=\"clearBmi()\">🗑 清除</button>\n      <div id=\"bmiResult\"></div>\n    </div>\n  </div>");
// ==================== 新增工具组B：公共工具 ====================
// 字符串种子伪随机（LCG），同一天/同一输入结果固定
function gbRng(seedStr){
  let h = 0;
  for(let i=0;i<seedStr.length;i++){ h = ((h<<5) - h + seedStr.charCodeAt(i)) | 0; }
  return function(){
    h = (h*1103515245 + 12345) & 0x7fffffff;
    return h / 0x7fffffff;
  };
}
// 从数组中不重复抽取 n 个
function gbPickN(rng, arr, n){
  const copy = arr.slice();
  const out = [];
  while(out.length < n && copy.length > 0){
    const idx = Math.floor(rng() * copy.length);
    out.push(copy.splice(idx,1)[0]);
  }
  return out;
}
// 复制分享
function gbShareText(text){
  copyText(text).then(function(ok){
    showToast(ok ? '📋 结果已复制，快去分享吧~' : '复制失败，请截图分享哦');
  });
}

