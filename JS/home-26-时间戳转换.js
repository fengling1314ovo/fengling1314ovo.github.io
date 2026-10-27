/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageTimestamp", "<!-- pageTimestamp -->\n<div class=\"tool-page\" id=\"pageTimestamp\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"backFromTool()\"><span>←</span> 返回上一级</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>⏱️时间戳转换</h3>\n      <label>Unix时间戳(秒)</label>\n      <input id=\"tsSec\" placeholder=\"输入时间戳\">\n      <label>日期时间</label>\n      <input id=\"tsDatetime\" placeholder=\"2026-09-02 12:00:00\">\n      <br>\n      <button class=\"common-btn\" onclick=\"tsFromSec()\">时间戳转时间</button>\n      <button class=\"common-btn\" onclick=\"tsToSec()\">时间转时间戳</button>\n      <button class=\"common-btn\" onclick=\"tsNow()\">获取当前时间戳</button>\n    </div>\n  </div>");
// ==================== 时间戳转换 ====================
const tsSec=document.getElementById('tsSec'), tsDatetime=document.getElementById('tsDatetime');
function tsFromSec(){
  const s=Number(tsSec.value); if(isNaN(s)){ showToast('请输入有效时间戳'); return; }
  const d=new Date(s*1000);
  tsDatetime.value=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')+':'+String(d.getSeconds()).padStart(2,'0');
}
function tsToSec(){ const d=new Date(tsDatetime.value); if(isNaN(d.getTime())){ showToast('日期格式无效'); return; } tsSec.value=Math.floor(d.getTime()/1000); }
function tsNow(){ tsSec.value=Math.floor(Date.now()/1000); tsFromSec(); }

