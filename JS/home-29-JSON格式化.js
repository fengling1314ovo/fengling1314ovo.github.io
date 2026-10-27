/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageJsonfmt", "<!-- pageJsonfmt -->\n<div class=\"tool-page\" id=\"pageJsonfmt\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"backFromTool()\"><span>←</span> 返回上一级</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>📋 JSON格式化</h3>\n      <textarea id=\"jsonInput\" rows=\"10\" placeholder=\"粘贴JSON文本\"></textarea>\n      <br>\n      <button class=\"common-btn\" onclick=\"jsonPretty()\">格式化美化</button>\n      <button class=\"common-btn\" onclick=\"jsonCompress()\">压缩JSON</button>\n      <button class=\"common-btn\" onclick=\"jsonValidate()\">校验JSON</button>\n      <button class=\"common-btn\" onclick=\"jsonClear()\">清空</button>\n      <div id=\"jsonTip\" style=\"margin-top:10px;color:var(--text-secondary);\"></div>\n    </div>\n  </div>");
// ==================== JSON格式化 ====================
const jsonInput=document.getElementById('jsonInput'), jsonTip=document.getElementById('jsonTip');
function jsonPretty(){ try{ const obj=JSON.parse(jsonInput.value); jsonInput.value=JSON.stringify(obj,null,2); jsonTip.textContent='✅格式化成功'; showToast('格式化成功'); }catch(e){ jsonTip.textContent='❌JSON解析错误：'+e.message; } }
function jsonCompress(){ try{ const obj=JSON.parse(jsonInput.value); jsonInput.value=JSON.stringify(obj); jsonTip.textContent='✅压缩完成'; showToast('压缩完成'); }catch(e){ jsonTip.textContent='❌JSON解析错误：'+e.message; } }
function jsonValidate(){ try{ JSON.parse(jsonInput.value); jsonTip.textContent='✅JSON格式合法'; showToast('JSON格式合法'); }catch(e){ jsonTip.textContent='❌JSON格式错误：'+e.message; } }
function jsonClear(){ jsonInput.value=''; jsonTip.textContent=''; }

