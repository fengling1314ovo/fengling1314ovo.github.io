window.flRegisterToolPage("pageQqGroup", "<!-- QQ群工具页面 -->\n  <div class=\"tool-page page-qqgroup\" id=\"pageQqGroup\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 0\">\n      <h3>👥 QQ群快捷工具</h3>\n    </div>\n    <div class=\"common-block\">\n      <label class=\"personal-fav-setting-title\" for=\"groupUin\">QQ 群号</label>\n      <div class=\"search-box\">\n        <span class=\"search-icon\" aria-hidden=\"true\">👥</span>\n        <input id=\"groupUin\" value=\"\" inputmode=\"numeric\" autocomplete=\"off\" placeholder=\"请输入QQ群号\">\n        <button class=\"search-clear\" type=\"button\" aria-label=\"清空输入\" id=\"clearGroupBtn\" title=\"清空输入\">✕</button>\n      </div>\n      <button class=\"common-btn\" type=\"button\" style=\"width:100%;margin:12px 0 0\" id=\"openGroupBtn\" onclick=\"openQQGroup()\">打开 QQ群卡片</button>\n      <div class=\"soft-action-row\">\n        <button class=\"common-btn\" type=\"button\" id=\"copyGroupBtn\" onclick=\"copyGroupProtocol()\">复制群协议链接</button>\n      </div>\n      <p class=\"personal-fav-setting-description\" id=\"msgGroup\">点击按钮尝试唤起QQ群</p>\n      <div class=\"home-notice personal-fav-setting-description\">\n💡 如果点击无响应：浏览器拦截自定义协议。<br>\nmqqapi协议仅手机端生效；电脑浏览器复制链接无效。\n      </div>\n    </div>\n  </div>");
// ==================== QQ群工具 ====================
const groupUinInput = document.getElementById('groupUin');
const msgGroup = document.getElementById('msgGroup');
const clearGroupBtn = document.getElementById('clearGroupBtn');
clearGroupBtn.onclick = ()=>{ groupUinInput.value=''; msgGroup.textContent='点击按钮尝试唤起QQ群'; };
function buildGroupUrl(){ const g=groupUinInput.value.trim(); return 'mqqapi://card/show_pslcard?src_type=internal&version=1&card_type=group&uin='+encodeURIComponent(g); }
function openQQGroup(){
  const g=groupUinInput.value.trim();
  if(!/^\d+$/.test(g)){ showToast('⚠️ 请输入正确纯数字群号'); return; }
  msgGroup.textContent='正在尝试打开QQ群卡片…';
  window.location.href=buildGroupUrl();
  setTimeout(()=>msgGroup.textContent='未跳转？复制链接使用',1200);
}
async function copyGroupProtocol(){
  const g=groupUinInput.value.trim();
  if(!/^\d+$/.test(g)){ showToast('⚠️ 请输入正确纯数字群号'); return; }
  if(await copyText(buildGroupUrl())){ msgGroup.textContent='✅群协议链接已复制'; showToast('已复制群协议链接'); }
  else msgGroup.textContent='❌复制失败';
}

