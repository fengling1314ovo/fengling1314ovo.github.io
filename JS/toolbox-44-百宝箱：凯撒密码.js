/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagecaesarPage", "<!-- pagecaesarPage -->\n<div class=\"tool-page\" id=\"pagecaesarPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"backFromTool()\"><span>←</span> 返回上一级</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🔏 凯撒密码</h3>\n      <div style=\"font-size:12px;color:var(--text-secondary);margin-bottom:12px;\">💡 仅支持英文字母加密，中文和符号保持不变</div>\n      <label>偏移量（1-25）</label>\n      <input id=\"caesarShift\" type=\"number\" value=\"3\" min=\"1\" max=\"25\">\n      <label>输入文本</label>\n      <textarea id=\"caesarInput\" rows=\"4\" placeholder=\"输入要加密/解密的文本\"></textarea>\n      <br>\n      <button type=\"button\" class=\"common-btn\" onclick=\"caesarEncrypt();document.activeElement.blur();\">🔒 加密</button>\n      <button type=\"button\" class=\"common-btn\" onclick=\"caesarDecrypt();document.activeElement.blur();\">🔓 解密</button>\n      <label style=\"margin-top:12px;display:none;\" id=\"caesarResultLabel\">结果</label>\n      <textarea id=\"caesarOutput\" readonly rows=\"4\" style=\"display:none;\"></textarea>\n      <button type=\"button\" class=\"common-btn\" id=\"caesarCopyBtn\" style=\"display:none;\" onclick=\"copyText(document.getElementById('caesarOutput').value);showToast('已复制');document.activeElement.blur();\">📋 复制结果</button>\n    </div>\n  </div>");
// ==================== 百宝箱：凯撒密码 ====================
function caesarProcess(text,shift,encrypt){
  const s=encrypt?shift:-shift;
  return text.split('').map(ch=>{
    if(ch>='a'&&ch<='z')return String.fromCodePoint(((ch.codePointAt(0)-97+s)%26+26)%26+97);
    if(ch>='A'&&ch<='Z')return String.fromCodePoint(((ch.codePointAt(0)-65+s)%26+26)%26+65);
    return String.fromCodePoint(ch.codePointAt(0)+s);
  }).join('');
}
function caesarEncrypt(){
  const text=document.getElementById('caesarInput').value;
  const shift=Math.max(1,Math.min(25,Number(document.getElementById('caesarShift').value)||3));
  document.getElementById('caesarOutput').value=caesarProcess(text,shift,true);
  document.getElementById('caesarResultLabel').style.display='';
  document.getElementById('caesarOutput').style.display='';
  document.getElementById('caesarCopyBtn').style.display='';
  showToast('加密完成');
}
function caesarDecrypt(){
  const text=document.getElementById('caesarInput').value;
  const shift=Math.max(1,Math.min(25,Number(document.getElementById('caesarShift').value)||3));
  document.getElementById('caesarOutput').value=caesarProcess(text,shift,false);
  document.getElementById('caesarResultLabel').style.display='';
  document.getElementById('caesarOutput').style.display='';
  document.getElementById('caesarCopyBtn').style.display='';
  showToast('解密完成');
}

