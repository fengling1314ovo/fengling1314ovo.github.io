/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageVideoParse", "<!-- pageVideoParse -->\n<div class=\"tool-page\" id=\"pageVideoParse\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🎬 短视频去水印</h3>\n      <div class=\"currency-container\" style=\"margin-top:16px;\">\n        <div style=\"display:flex;gap:10px;align-items:center;\">\n          <input type=\"text\" id=\"videoParseInput\" placeholder=\"粘贴抖音/快手/小红书分享链接...\" style=\"flex:1;height:48px;padding:0 16px;border:1.5px solid var(--border);border-radius:12px;background:var(--bg-input);font-size:14px;outline:none;\" onkeydown=\"if(event.key==='Enter')parseVideo()\">\n          <button class=\"qr-btn\" onclick=\"parseVideo()\" style=\"width:140px;height:48px;margin:0;white-space:nowrap;\">🔍 解析</button>\n        </div>\n        <div style=\"display:flex;gap:10px;margin-top:12px;\">\n          <button onclick=\"pasteVideoLink()\" style=\"flex:1;height:40px;border:1.5px solid var(--border);border-radius:10px;background:rgba(255,255,255,0.5);backdrop-filter:blur(10px);font-size:13px;cursor:pointer;\">📋 粘贴链接</button>\n          <button onclick=\"document.getElementById('videoParseInput').value='';document.getElementById('videoParseResult').style.display='none';document.getElementById('videoParseStatus').style.display='none';\" style=\"flex:1;height:40px;border:1.5px solid var(--border);border-radius:10px;background:rgba(255,255,255,0.5);backdrop-filter:blur(10px);font-size:13px;cursor:pointer;\">🗑️ 清空</button>\n        </div>\n        <div id=\"videoParseStatus\" style=\"margin-top:12px;text-align:center;font-size:14px;color:var(--text-secondary);display:none;\"></div>\n        <div id=\"videoParseResult\" style=\"display:none;margin-top:16px;padding:20px;border-radius:16px;background:rgba(255,255,255,0.35);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(99,102,241,0.15);\">\n          <div style=\"display:flex;gap:16px;align-items:flex-start;\">\n            <img id=\"vpCover\" style=\"width:120px;height:120px;object-fit:cover;border-radius:12px;flex-shrink:0;\">\n            <div style=\"flex:1;min-width:0;\">\n              <div id=\"vpPlatform\" style=\"display:inline-block;padding:2px 10px;border-radius:6px;background:var(--primary-bg);color:var(--primary);font-size:12px;font-weight:600;margin-bottom:6px;\"></div>\n              <div id=\"vpTitle\" style=\"font-size:15px;font-weight:600;color:var(--text-main);line-height:1.4;margin-bottom:4px;word-break:break-all;\"></div>\n              <div id=\"vpAuthor\" style=\"font-size:13px;color:var(--text-secondary);margin-bottom:4px;\"></div>\n              <div id=\"vpStats\" style=\"font-size:12px;color:var(--text-secondary);\"></div>\n            </div>\n          </div>\n          <div id=\"vpVideoSection\" style=\"margin-top:16px;\">\n            <button onclick=\"downloadVideo()\" class=\"qr-btn\" style=\"width:100%;height:46px;\">⬇️ 下载无水印视频</button>\n            <button onclick=\"extractAudioFromVideo()\" id=\"vpExtractAudioBtn\" class=\"qr-btn\" style=\"width:100%;height:42px;margin-top:10px;\">🎵 提取视频音频（MP3）</button>\n            <div id=\"vpAudioProgress\" style=\"display:none;margin-top:8px;text-align:center;font-size:13px;color:var(--text-secondary);\">⏳ 正在加载转换引擎...</div>\n          </div>\n          <div id=\"vpImagesSection\" style=\"margin-top:16px;display:none;\">\n            <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;\">\n              <span style=\"font-size:14px;font-weight:600;\">📷 图集（<span id=\"vpImageCount\">0</span>张）</span>\n              <button onclick=\"downloadAllImages()\" style=\"padding:6px 14px;border:none;border-radius:8px;background:var(--primary);color:#fff;font-size:12px;cursor:pointer;\">⬇️ 全部下载</button>\n            </div>\n            <div id=\"vpImagesGrid\" style=\"display:grid;grid-template-columns:repeat(3,1fr);gap:8px;\"></div>\n          </div>\n          <div id=\"vpMusicSection\" style=\"margin-top:12px;display:none;\">\n            <button onclick=\"downloadMusic()\" style=\"width:100%;height:42px;border:1.5px solid var(--primary);border-radius:10px;background:transparent;color:var(--primary);font-size:14px;cursor:pointer;\">🎵 下载背景音乐</button>\n          </div>\n        </div>\n        <div style=\"margin-top:16px;padding:12px 14px;border-radius:var(--radius-md);background:rgba(255,255,255,0.35);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(99,102,241,0.12);font-size:12px;line-height:1.7;color:var(--text-secondary);\">\n          <b>支持平台：</b>抖音、快手、小红书、B站、微博、微信视频号<br>\n          <b>使用方法：</b>在APP里点「分享」→「复制链接」，粘贴到上面输入框，点解析即可下载无水印视频/图片<br>\n          <b>提示：</b>如解析失败可能因平台改版失效，请稍后重试或切换其他链接。\n        </div>\n      </div>\n    </div>\n  </div>");
// ==================== 短视频去水印 ====================
let vpCurrentData = null;
async function pasteVideoLink(){
  try{
    const text = await navigator.clipboard.readText();
    document.getElementById('videoParseInput').value = text;
    showToast('已粘贴链接');
  }catch(e){
    showToast('请手动粘贴链接');
  }
}
function parseVideo(){
  const url = document.getElementById('videoParseInput').value.trim();
  if(!url){ showToast('请输入视频链接'); return; }
  const statusEl = document.getElementById('videoParseStatus');
  const resultEl = document.getElementById('videoParseResult');
  statusEl.style.display = 'block';
  statusEl.textContent = '⏳ 正在解析，请稍候...';
  resultEl.style.display = 'none';
  fetch('https://api.fengling1314ovo.top/api/video-parse?url=' + encodeURIComponent(url), {signal: AbortSignal.timeout(20000)})
    .then(function(r){ return r.json(); })
    .then(function(data){
      if(data && data.ok){
        vpCurrentData = data;
        renderVideoParse(data);
        statusEl.style.display = 'none';
      } else {
        statusEl.textContent = '❌ ' + (data.msg || '解析失败，请稍后重试');
      }
    })
    .catch(function(){
      statusEl.textContent = '❌ 网络错误，请检查网络连接';
    });
}
function renderVideoParse(data){
  const resultEl = document.getElementById('videoParseResult');
  const coverEl = document.getElementById('vpCover');
  const platformEl = document.getElementById('vpPlatform');
  const titleEl = document.getElementById('vpTitle');
  const authorEl = document.getElementById('vpAuthor');
  const statsEl = document.getElementById('vpStats');
  const videoSection = document.getElementById('vpVideoSection');
  const imagesSection = document.getElementById('vpImagesSection');
  const musicSection = document.getElementById('vpMusicSection');

  platformEl.textContent = data.platform || '';
  titleEl.textContent = data.title || '无标题';
  authorEl.textContent = data.author ? '👤 ' + data.author : '';

  if(data.cover){
    coverEl.src = data.cover;
    coverEl.style.display = 'block';
  } else {
    coverEl.style.display = 'none';
  }

  let stats = [];
  if(data.likeCount) stats.push('❤️ ' + formatVPCount(data.likeCount));
  if(data.commentCount) stats.push('💬 ' + formatVPCount(data.commentCount));
  statsEl.textContent = stats.join('  ');

  if(data.type === 'images' && data.images && data.images.length > 0){
    videoSection.style.display = 'none';
    imagesSection.style.display = 'block';
    document.getElementById('vpImageCount').textContent = data.images.length;
    const grid = document.getElementById('vpImagesGrid');
    grid.innerHTML = '';
    data.images.forEach(function(img, i){
      const div = document.createElement('div');
      div.style.cssText = 'position:relative;cursor:pointer;';
      div.innerHTML = '<img src="'+img+'" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:8px;" loading="lazy"><div onclick="downloadVPImage('+i+')" style="position:absolute;bottom:4px;right:4px;padding:2px 6px;border-radius:6px;background:rgba(0,0,0,0.5);color:#fff;font-size:10px;">⬇️</div>';
      grid.appendChild(div);
    });
  } else {
    videoSection.style.display = 'block';
    imagesSection.style.display = 'none';
  }

  if(data.musicUrl){
    musicSection.style.display = 'block';
  } else {
    musicSection.style.display = 'none';
  }

  resultEl.style.display = 'block';
}
function formatVPCount(n){
  if(n >= 10000) return (n/10000).toFixed(1) + 'w';
  if(n >= 1000) return (n/1000).toFixed(1) + 'k';
  return n;
}
async function downloadVideo(){
  if(!vpCurrentData || !vpCurrentData.videoUrl){ showToast('视频地址无效'); return; }
  showToast('正在下载视频...');
  try{
    const res = await fetch(vpCurrentData.videoUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (vpCurrentData.title || 'video').substring(0,30) + '.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('视频下载完成');
  }catch(e){
    // 如果fetch失败，回退到直接打开
    const a = document.createElement('a');
    a.href = vpCurrentData.videoUrl;
    a.download = 'video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
function downloadVPImage(index){
  if(!vpCurrentData || !vpCurrentData.images || !vpCurrentData.images[index]) return;
  const a = document.createElement('a');
  a.href = vpCurrentData.images[index];
  a.download = 'image_' + (index+1) + '.jpg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
function downloadAllImages(){
  if(!vpCurrentData || !vpCurrentData.images) return;
  vpCurrentData.images.forEach(function(url, i){
    setTimeout(function(){
      const a = document.createElement('a');
      a.href = url;
      a.download = 'image_' + (i+1) + '.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, i * 300);
  });
  showToast('开始批量下载图片');
}
function downloadMusic(){
  if(!vpCurrentData || !vpCurrentData.musicUrl){ showToast('音乐地址无效'); return; }
  const a = document.createElement('a');
  a.href = vpCurrentData.musicUrl;
  a.download = 'music.mp3';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('开始下载背景音乐');
}

