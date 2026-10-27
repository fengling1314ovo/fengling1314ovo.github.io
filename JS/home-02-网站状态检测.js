/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageSiteCheck", "<!-- pageSiteCheck -->\n<div class=\"tool-page\" id=\"pageSiteCheck\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🔍 网站状态检测</h3>\n      <div class=\"currency-container\" style=\"margin-top:16px;\">\n        <div class=\"currency-row\">\n          <label>网址</label>\n          <input type=\"text\" id=\"siteCheckInput\" placeholder=\"例如：baidu.com 或 https://www.baidu.com\">\n        </div>\n        <button class=\"qr-btn\" onclick=\"startSiteCheck();document.activeElement.blur();\">🚀 开始检测</button>\n        <div id=\"siteCheckStatus\" style=\"margin-top:12px;text-align:center;font-size:14px;color:var(--text-secondary);display:none;\"></div>\n        <div id=\"siteCheckResult\" style=\"display:none;margin-top:16px;padding:24px;border-radius:16px;background:rgba(255,255,255,0.35);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(99,102,241,0.15);text-align:center;\">\n          <div id=\"siteCheckUrl\" style=\"font-size:15px;font-weight:700;color:var(--text-main);word-break:break-all;margin-bottom:16px;\"></div>\n          <div id=\"siteCheckIcon\" style=\"font-size:56px;margin-bottom:10px;\">⏳</div>\n          <div id=\"siteCheckState\" style=\"font-size:20px;font-weight:700;color:var(--text-secondary);margin-bottom:6px;\">检测中...</div>\n          <div id=\"siteCheckMethod\" style=\"font-size:13px;color:var(--text-secondary);margin-bottom:12px;display:none;\"></div>\n          <div id=\"siteCheckTimeWrap\" style=\"display:inline-block;padding:8px 20px;border-radius:10px;background:rgba(99,102,241,0.08);margin-bottom:16px;\">\n            <span id=\"siteCheckTimeLabel\" style=\"font-size:12px;color:var(--text-secondary);\">响应时间</span>\n            <span id=\"siteCheckTime\" style=\"font-size:22px;font-weight:700;color:var(--primary);margin-left:8px;\">-- ms</span>\n          </div>\n          <div id=\"siteCheckCode\" style=\"font-size:13px;color:var(--text-secondary);margin-bottom:16px;display:none;\"></div>\n          <div id=\"siteCheckDetailWrap\" style=\"display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px;padding-top:16px;border-top:1px solid var(--border-color);\">\n            <div style=\"text-align:center;\">\n              <div style=\"font-size:12px;color:var(--text-secondary);margin-bottom:4px;\">🌐 远程节点</div>\n              <div id=\"remoteDetail\" style=\"font-size:13px;font-weight:600;color:var(--text-secondary);\">检测中...</div>\n            </div>\n            <div style=\"text-align:center;\">\n              <div style=\"font-size:12px;color:var(--text-secondary);margin-bottom:4px;\">📡 本地网络</div>\n              <div id=\"localDetail\" style=\"font-size:13px;font-weight:600;color:var(--text-secondary);\">检测中...</div>\n            </div>\n          </div>\n          <div id=\"siteCheckHistory\" style=\"margin-top:16px;text-align:left;\">\n            <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;\">\n              <div style=\"font-size:13px;font-weight:600;color:var(--text-secondary);\">📋 最近检测记录</div>\n              <button onclick=\"clearSiteCheckHistory()\" style=\"font-size:12px;padding:4px 10px;border:1px solid rgba(99,102,241,0.15);border-radius:8px;background:rgba(255,255,255,0.3);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:var(--text-secondary);cursor:pointer;\">🗑️ 清空</button>\n            </div>\n            <div id=\"siteCheckHistoryList\" style=\"display:flex;flex-direction:column;gap:6px;\"></div>\n          </div>\n        </div>\n        <div style=\"margin-top:16px;padding:12px 14px;border-radius:var(--radius-md);background:rgba(255,255,255,0.35);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(99,102,241,0.12);font-size:12px;line-height:1.7;color:var(--text-secondary);\">\n          <b>说明：</b>采用远程和本地两种检测方式。如果测出是远程节点在线，代表这个网站你大概率无法正常访问，但网站是真实存在的，只是你这边网络无法访问；如果测出网站离线，那么代表这个网站的服务器大概率已经挂了，或是你输入了一个不存在的网站。检测记录保存在本地浏览器。\n        </div>\n      </div>\n    </div>\n  </div>");
// ==================== 网站状态检测 ====================
let scDone = {remote:false, local:false};
let scState = {remote:null, local:null};
let scFinalized = false;
function startSiteCheck(){
  const input = document.getElementById('siteCheckInput').value.trim();
  if(!input){ showToast('请输入网址'); return; }
  let url = input;
  if(!/^https?:\/\//i.test(url)){ url = 'https://' + url; }
  try{ new URL(url); }catch(e){ showToast('网址格式不正确'); return; }
  scDone = {remote:false, local:false};
  scState = {remote:null, local:null};
  scFinalized = false;
  document.getElementById('siteCheckUrl').textContent = url;
  document.getElementById('siteCheckResult').style.display = 'block';
  document.getElementById('siteCheckStatus').style.display = 'block';
  document.getElementById('siteCheckStatus').textContent = '⏳ 正在检测...';
  // 重置主结果
  document.getElementById('siteCheckIcon').textContent = '⏳';
  document.getElementById('siteCheckState').textContent = '检测中...';
  document.getElementById('siteCheckState').style.color = 'var(--text-secondary)';
  document.getElementById('siteCheckMethod').style.display = 'none';
  document.getElementById('siteCheckTime').textContent = '-- ms';
  document.getElementById('siteCheckTime').style.color = 'var(--primary)';
  document.getElementById('siteCheckTimeLabel').textContent = '响应时间';
  document.getElementById('siteCheckCode').style.display = 'none';
  // 重置详情
  document.getElementById('remoteDetail').textContent = '检测中...';
  document.getElementById('remoteDetail').style.color = 'var(--text-secondary)';
  document.getElementById('localDetail').textContent = '检测中...';
  document.getElementById('localDetail').style.color = 'var(--text-secondary)';
  // 同时发起两个检测
  remoteSiteCheck(url);
  localCheck(url);
}
function onCheckComplete(which, state, time, code){
  if(scFinalized) return;
  scDone[which] = true;
  scState[which] = {state:state, time:time, code:code};
  // 更新详情
  const detailEl = document.getElementById(which+'Detail');
  if(state === 'online'){
    detailEl.textContent = '✅ 在线' + (time > 0 ? ' (' + time + 'ms)' : '');
    detailEl.style.color = '#22c55e';
  } else if(state === 'offline'){
    detailEl.textContent = '❌ 离线' + (time > 0 ? ' (' + time + 'ms)' : '');
    detailEl.style.color = '#ef4444';
  } else {
    detailEl.textContent = '⏱️ 超时';
    detailEl.style.color = '#f59e0b';
  }
  // 判定逻辑
  if(state === 'online'){
    // 有一个在线，立即出结果
    showFinalResult('online', which);
  } else {
    // 离线/超时，检查另一个
    const other = which === 'remote' ? 'local' : 'remote';
    if(scDone[other]){
      if(scState[other].state === 'online'){
        showFinalResult('online', other);
      } else {
        // 两个都是红的
        showFinalResult('offline', null);
      }
    } else {
      // 另一个还在测，更新状态提示
      document.getElementById('siteCheckState').textContent = which === 'remote' ? '远程节点离线，等待本地检测...' : '本地无法访问，等待远程检测...';
      document.getElementById('siteCheckState').style.color = '#f59e0b';
    }
  }
}
function showFinalResult(state, which){
  if(scFinalized) return;
  scFinalized = true;
  document.getElementById('siteCheckStatus').style.display = 'none';
  const iconEl = document.getElementById('siteCheckIcon');
  const stateEl = document.getElementById('siteCheckState');
  const methodEl = document.getElementById('siteCheckMethod');
  const timeEl = document.getElementById('siteCheckTime');
  const timeLabelEl = document.getElementById('siteCheckTimeLabel');
  const codeEl = document.getElementById('siteCheckCode');
  const detailWrap = document.getElementById('siteCheckDetailWrap');
  if(state === 'online'){
    const data = scState[which];
    iconEl.textContent = '✅';
    stateEl.textContent = '网站在线';
    stateEl.style.color = '#22c55e';
    methodEl.style.display = 'block';
    methodEl.textContent = '经 ' + (which === 'remote' ? '🌐 远程节点' : '📡 本地网络') + ' 检测确认';
    timeLabelEl.textContent = which === 'remote' ? '检测耗时' : '响应时间';
    timeEl.textContent = data.time > 0 ? data.time + ' ms' : '-- ms';
    timeEl.style.color = '#22c55e';
    if(which === 'remote' && data.code){
      codeEl.style.display = 'block';
      codeEl.textContent = 'HTTP ' + data.code;
    }
    // 在线时只显示检测出来的那个节点，隐藏详情区域
    if(detailWrap) detailWrap.style.display = 'none';
  } else {
    iconEl.textContent = '❌';
    stateEl.textContent = '网站离线';
    stateEl.style.color = '#ef4444';
    methodEl.style.display = 'block';
    methodEl.textContent = '远程节点和本地网络均无法访问';
    timeEl.textContent = '--';
    timeEl.style.color = '#ef4444';
    // 离线时显示两个节点的详情，方便排查
    if(detailWrap) detailWrap.style.display = 'grid';
  }
  // 保存历史记录
  try{
    const now = new Date();
    const dateStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0') + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
    let history = JSON.parse(localStorage.getItem('siteCheckHistory') || '[]');
    history.unshift({
      url: document.getElementById('siteCheckUrl').textContent,
      result: state,
      remote: scState.remote ? scState.remote.state : 'unknown',
      local: scState.local ? scState.local.state : 'unknown',
      date: dateStr
    });
    history = history.slice(0, 10);
    localStorage.setItem('siteCheckHistory', JSON.stringify(history));
    renderSiteCheckHistory();
  }catch(e){}
}
function remoteSiteCheck(url){
  const domain = url.replace(/^https?:\/\//, '').split('/')[0];
  const startTime = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(function(){ controller.abort(); }, 12000);
  fetch('https://api.hackertarget.com/httpheaders/?q=' + encodeURIComponent(domain), {signal: controller.signal})
    .then(function(r){ clearTimeout(timeoutId); return r.text(); })
    .then(function(text){
      const respTime = Math.round(performance.now() - startTime);
      if(text.indexOf('HTTP/') >= 0){
        const match = text.match(/HTTP\/[\d.]+\s+(\d+)/);
        const statusCode = match ? match[1] : '200';
        onCheckComplete('remote', 'online', respTime, statusCode);
      } else {
        onCheckComplete('remote', 'offline', respTime, null);
      }
    })
    .catch(function(err){
      clearTimeout(timeoutId);
      onCheckComplete('remote', 'timeout', 0, null);
    });
}
function localCheck(url){
  const startTime = performance.now();
  // 先用 fetch no-cors 探测根路径（比 favicon 更准确，不受图标有无影响）
  fetch(url, {mode: 'no-cors', cache: 'no-store'})
    .then(function(){
      const respTime = Math.round(performance.now() - startTime);
      onCheckComplete('local', 'online', respTime, null);
    })
    .catch(function(){
      // fetch 失败，用 favicon 探测兜底
      localFaviconFallback(url);
    });
}
function localFaviconFallback(url){
  const startTime = performance.now();
  let done = false;
  const img = new Image();
  const timer = setTimeout(function(){
    if(!done){ done = true; onCheckComplete('local', 'timeout', 0, null); }
  }, 5000);
  img.onload = function(){
    if(!done){ done = true; clearTimeout(timer); onCheckComplete('local', 'online', Math.round(performance.now() - startTime), null); }
  };
  img.onerror = function(){
    if(!done){ done = true; clearTimeout(timer); onCheckComplete('local', 'offline', Math.round(performance.now() - startTime), null); }
  };
  img.src = url.replace(/\/$/, '') + '/favicon.ico?_=' + Date.now();
}
function clearSiteCheckHistory(){
  try{
    localStorage.removeItem('siteCheckHistory');
    renderSiteCheckHistory();
    showToast('已清空检测记录');
  }catch(e){}
}
function renderSiteCheckHistory(){
  try{
    const history = JSON.parse(localStorage.getItem('siteCheckHistory') || '[]');
    const listEl = document.getElementById('siteCheckHistoryList');
    if(history.length === 0){ listEl.innerHTML = '<div style="font-size:12px;color:var(--text-secondary);">暂无记录</div>'; return; }
    let html = '';
    history.forEach(function(item){
      const icon = item.result === 'online' ? '✅' : '❌';
      const color = item.result === 'online' ? '#22c55e' : '#ef4444';
      const label = item.result === 'online' ? '在线' : '离线';
      html += '<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;background:rgba(99,102,241,0.04);font-size:12px;">'
        + '<span>' + icon + '</span>'
        + '<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-main);">' + item.url + '</span>'
        + '<span style="color:' + color + ';font-weight:600;">' + label + '</span>'
        + '<span style="color:var(--text-secondary);font-size:11px;">' + item.date + '</span>'
        + '</div>';
    });
    listEl.innerHTML = html;
  }catch(e){}
}

