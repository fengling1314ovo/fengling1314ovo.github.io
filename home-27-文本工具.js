/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageTextutil", "<!-- pageTextutil -->\n<div class=\"tool-page\" id=\"pageTextutil\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>📝文本处理</h3>\n      <textarea id=\"textInputUtil\" placeholder=\"粘贴文本\"></textarea>\n      <br>\n      <button class=\"common-btn\" onclick=\"textUpper()\">全部大写</button>\n      <button class=\"common-btn\" onclick=\"textLower()\">全部小写</button>\n      <button class=\"common-btn\" onclick=\"textTrimAll()\">去除全部空格</button>\n      <button class=\"common-btn\" onclick=\"textUrlEncode()\">URL编码</button>\n      <button class=\"common-btn\" onclick=\"textUrlDecode()\">URL解码</button>\n      <button class=\"common-btn\" onclick=\"textCopyUtil()\">📋 复制内容</button>\n    </div>\n  </div>");
// ==================== 文本工具 ====================
const textInputUtil=document.getElementById('textInputUtil');
function textUpper(){ textInputUtil.value=textInputUtil.value.toUpperCase(); }
function textLower(){ textInputUtil.value=textInputUtil.value.toLowerCase(); }
function textTrimAll(){ textInputUtil.value=textInputUtil.value.replace(/\s+/g,''); }
function textUrlEncode(){ textInputUtil.value=encodeURIComponent(textInputUtil.value); }
function textUrlDecode(){ try{ textInputUtil.value=decodeURIComponent(textInputUtil.value); }catch(e){ showToast('解码失败'); } }
function textCopyUtil(){
  if(!textInputUtil.value){ showToast('输入框是空的'); return; }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(textInputUtil.value).then(()=>showToast('✅ 已复制到剪贴板')).catch(()=>{
      textInputUtil.select(); document.execCommand('copy'); showToast('✅ 已复制到剪贴板');
    });
  }else{ textInputUtil.select(); document.execCommand('copy'); showToast('✅ 已复制到剪贴板'); }
}

