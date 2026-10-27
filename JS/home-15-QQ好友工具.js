window.flRegisterToolPage("pageQq", "<!-- QQ工具页面 -->\n  <div class=\"tool-page page-qq\" id=\"pageQq\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 0\">\n      <h3>👤 QQ快捷工具</h3>\n    </div>\n    <div class=\"common-block\">\n      <label class=\"personal-fav-setting-title\" for=\"uin\">QQ 号码</label>\n      <div class=\"search-box\">\n        <span class=\"search-icon\" aria-hidden=\"true\">👤</span>\n        <input id=\"uin\" value=\"\" inputmode=\"numeric\" autocomplete=\"off\" placeholder=\"请输入QQ号\">\n        <button class=\"search-clear\" type=\"button\" aria-label=\"清空输入\" id=\"clearBtn\" title=\"清空输入\">✕</button>\n      </div>\n      <button class=\"common-btn\" type=\"button\" style=\"width:100%;margin:12px 0 0\" id=\"openCardBtn\" onclick=\"openQQCard()\">打开 QQ 资料卡</button>\n      <button class=\"common-btn\" type=\"button\" style=\"width:100%;margin:12px 0 0\" id=\"chatBtn\" onclick=\"openQQChat()\">💬发起QQ聊天</button>\n      <div class=\"soft-action-row\">\n        <button class=\"common-btn\" type=\"button\" id=\"copyCardBtn\" onclick=\"copyCardProtocol()\">复制资料卡链接</button>\n        <button class=\"common-btn\" type=\"button\" id=\"copyChatBtn\" onclick=\"copyChatProtocol()\">复制聊天链接</button>\n      </div>\n      <p class=\"personal-fav-setting-description\" id=\"msg\">点击按钮尝试唤起QQ客户端</p>\n      <div class=\"home-notice personal-fav-setting-description\">\n💡 如果点击无响应：普通浏览器会拦截自定义协议跳转。<br>\n建议复制链接手动使用；QQ内置浏览器打开效果最佳。\n      </div>\n    </div>\n  </div>");
// ==================== QQ好友工具 ====================
const uinInput = document.getElementById('uin');
const msg = document.getElementById('msg');
const clearBtn = document.getElementById('clearBtn');
clearBtn.onclick = ()=>{ uinInput.value=''; msg.textContent='点击按钮尝试唤起QQ客户端'; };
function buildCardUrl(){ const uin=uinInput.value.trim(); return 'mqq://card/show_pslcard?src_type=internal&version=1&uin='+encodeURIComponent(uin)+'&card_type=person&source=sharecard'; }
function buildChatUrl(){ const uin=uinInput.value.trim(); return 'mqq://im/chat?chat_type=wpa&version=1&src_type=web&uin='+encodeURIComponent(uin); }
function openQQCard(){
  const uin=uinInput.value.trim();
  if(!/^\d+$/.test(uin)){ showToast('⚠️ 请输入正确纯数字QQ号'); return; }
  msg.textContent='正在尝试打开资料卡…';
  window.location.href=buildCardUrl();
  setTimeout(()=>msg.textContent='未跳转？复制链接使用',1200);
}
function openQQChat(){
  const uin=uinInput.value.trim();
  if(!/^\d+$/.test(uin)){ showToast('⚠️ 请输入正确纯数字QQ号'); return; }
  msg.textContent='正在尝试发起聊天…';
  window.location.href=buildChatUrl();
  setTimeout(()=>msg.textContent='未跳转？复制链接使用',1200);
}
async function copyCardProtocol(){
  const uin=uinInput.value.trim();
  if(!/^\d+$/.test(uin)){ showToast('⚠️ 请输入正确纯数字QQ号'); return; }
  if(await copyText(buildCardUrl())){ msg.textContent='✅资料卡协议已复制'; showToast('已复制资料卡链接'); }
  else msg.textContent='❌复制失败';
}
async function copyChatProtocol(){
  const uin=uinInput.value.trim();
  if(!/^\d+$/.test(uin)){ showToast('⚠️ 请输入正确纯数字QQ号'); return; }
  if(await copyText(buildChatUrl())){ msg.textContent='✅聊天协议已复制'; showToast('已复制聊天链接'); }
  else msg.textContent='❌复制失败';
}

