/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageHexconvert", "<!-- pageHexconvert -->\n<div class=\"tool-page\" id=\"pageHexconvert\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"backFromTool()\"><span>←</span> 返回上一级</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🔢进制转换(2/8/10/16)</h3>\n      <label>输入数值</label><input id=\"hexInput\" placeholder=\"输入数字\">\n      <label>原进制(2,8,10,16)</label><input id=\"hexFrom\" value=\"10\">\n      <br>\n      <button class=\"common-btn\" onclick=\"doConvert()\">执行转换</button>\n      <div id=\"hexResult\" style=\"margin-top:12px;line-height:1.8;\"></div>\n    </div>\n  </div>");
// ==================== 进制转换 ====================
const hexInput=document.getElementById('hexInput'), hexFrom=document.getElementById('hexFrom'), hexResult=document.getElementById('hexResult');
function doConvert(){
  hexResult.innerText=''; const valStr=hexInput.value.trim(), fromBase=Number(hexFrom.value);
  if(![2,8,10,16].includes(fromBase)){ hexResult.innerText='仅支持2,8,10,16进制'; return; }
  const dec=parseInt(valStr,fromBase);
  if(isNaN(dec)){ hexResult.innerText='数值无效'; showToast('请输入有效数值'); return; }
  hexResult.innerText=`十进制：${dec}\n二进制：${dec.toString(2)}\n八进制：${dec.toString(8)}\n十六进制：${dec.toString(16).toUpperCase()}`;
}

