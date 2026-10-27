/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageUuidgen", "<!-- pageUuidgen -->\n<div class=\"tool-page\" id=\"pageUuidgen\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"backFromTool()\"><span>←</span> 返回上一级</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🆔 UUID v4生成</h3>\n      <label>生成数量</label><input id=\"uuidCount\" value=\"5\">\n      <br>\n      <button class=\"common-btn\" onclick=\"genUuid()\">生成UUID</button>\n      <button class=\"common-btn\" onclick=\"copyAllUuid()\">复制全部</button>\n      <textarea id=\"uuidOut\" readonly rows=\"8\" style=\"margin-top:10px;\"></textarea>\n    </div>\n  </div>");
// ==================== UUID ====================
const uuidCount=document.getElementById('uuidCount'), uuidOut=document.getElementById('uuidOut');
function uuidv4(){ return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){ const r=Math.random()*16|0, v=c==='x'?r:(r&0x3|0x8); return v.toString(16); }); }
function genUuid(){
  const cnt=Number(uuidCount.value);
  if(isNaN(cnt)||cnt<1||cnt>200){ showToast('数量范围1-200'); return; }
  const arr=[]; for(let i=0;i<cnt;i++) arr.push(uuidv4()); uuidOut.value=arr.join('\n');
  showToast('已生成'+cnt+'个UUID');
}
async function copyAllUuid(){ if(!uuidOut.value){ showToast('请先生成UUID'); return; } if(await copyText(uuidOut.value)) showToast('已复制全部UUID'); else showToast('复制失败'); }

