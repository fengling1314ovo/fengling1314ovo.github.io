/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageImghost", "<!-- pageImghost -->\n<div class=\"tool-page\" id=\"pageImghost\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"backFromTool()\"><span>←</span> 返回上一级</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🖼️ 图床上传</h3>\n      <div class=\"va-upload-area\" id=\"ihUploadArea\" onclick=\"document.getElementById('ihFileInput').click()\" ondragover=\"event.preventDefault();this.classList.add('dragover');\" ondragleave=\"this.classList.remove('dragover');\" ondrop=\"event.preventDefault();this.classList.remove('dragover');handleImgDrop(event);\">\n        <input type=\"file\" id=\"ihFileInput\" accept=\"image/*\" style=\"display:none;\" onchange=\"handleImgSelect(this.files[0])\">\n        <div class=\"va-upload-icon\">🖼️</div>\n        <div class=\"va-upload-text\">点击选择图片，或<span class=\"va-upload-highlight\">拖拽</span>到此处</div>\n        <div class=\"va-upload-hint\">支持 JPG / PNG / GIF / WebP，最大 3MB，也可 Ctrl+V 粘贴</div>\n      </div>\n      <div id=\"ihProgress\" style=\"display:none;margin-top:16px;\">\n        <div style=\"height:8px;background:var(--bg-input);border-radius:4px;overflow:hidden;\">\n          <div id=\"ihProgressBar\" style=\"height:100%;width:0%;background:linear-gradient(90deg,var(--primary),var(--primary-light));border-radius:4px;transition:width .3s;\"></div>\n        </div>\n        <div id=\"ihProgressText\" style=\"text-align:center;font-size:12px;color:var(--text-secondary);margin-top:6px;\">上传中...</div>\n      </div>\n      <div id=\"ihResult\" style=\"display:none;margin-top:20px;\">\n        <div style=\"display:flex;gap:16px;align-items:flex-start;\">\n          <img id=\"ihPreview\" style=\"width:110px;height:110px;object-fit:cover;border-radius:12px;border:1px solid var(--border-color);flex-shrink:0;\">\n          <div style=\"flex:1;min-width:0;\">\n            <div style=\"font-size:13px;font-weight:600;color:var(--text-primary);margin-bottom:8px;\">上传成功！复制链接：</div>\n            <div class=\"ih-link-row\">\n              <span class=\"ih-link-label\">URL</span>\n              <input id=\"ihUrl\" readonly style=\"flex:1;padding:6px 10px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-input);font-size:12px;color:var(--text-primary);min-width:0;\">\n              <button onclick=\"copyText('ihUrl')\" style=\"padding:6px 12px;border:none;border-radius:8px;background:var(--primary);color:#fff;font-size:12px;cursor:pointer;flex-shrink:0;\">复制</button>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div style=\"margin-top:16px;padding:12px 14px;border-radius:var(--radius-md);background:rgba(255,255,255,0.35);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(99,102,241,0.12);font-size:12px;line-height:1.7;color:var(--text-secondary);\">\n        <b>说明：</b>使用极速图床（tucdn.wpon.cn），免费无需注册，国内访问速度快。<br>\n        <b>提示：</b>免费图床不保证长期存储，重要图片请自行备份。\n      </div>\n    </div>\n  </div>\n<!-- rrResult -->\n<div class=\"tool-page page-refreshrate\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"backFromTool()\"><span>←</span> 返回上一级</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 0\">\n      <h3>📺 屏幕刷新率测试</h3>\n    </div>\n    <div style=\"max-width:600px;margin:20px auto;padding:0 20px;\">\n      <div style=\"text-align:center;padding:30px;background:var(--bg-card);border-radius:16px;border:1px solid var(--border-color);\">\n        <div id=\"rrResult\" style=\"font-size:48px;font-weight:700;color:var(--primary);margin-bottom:8px;\">-- Hz</div>\n        <div id=\"rrStatus\" style=\"font-size:14px;color:var(--text-secondary);\">点击下方按钮开始测试</div>\n      </div>\n      <div id=\"rrCanvasWrap\" style=\"display:none;margin-top:16px;text-align:center;\">\n        <canvas id=\"rrCanvas\" width=\"560\" height=\"200\" style=\"width:100%;max-width:560px;border-radius:12px;background:#0f172a;\"></canvas>\n        <div style=\"font-size:12px;color:var(--text-secondary);margin-top:8px;\">观察移动条是否流畅卡顿，数值越高越流畅</div>\n      </div>\n      <button class=\"qr-btn\" onclick=\"startRefreshRate()\" style=\"margin-top:16px;width:100%;\">开始测试</button>\n      <div style=\"margin-top:16px;padding:14px;border-radius:12px;background:var(--bg-card);font-size:13px;line-height:1.8;color:var(--text-secondary);\">\n        <b>说明：</b>通过 requestAnimationFrame 测量每秒渲染帧数，即为屏幕刷新率。手机通常 60-120Hz，笔记本常见 60Hz，高刷屏可达 144Hz 以上。测试时请保持页面在前台。<br>\n        <b style=\"color:#ef4444;\">⚠️ iOS 系统说明：iPhone 在 Safari 中会将网页强制锁定在 60Hz，即使屏幕支持 ProMotion 120Hz 也无法测到高刷，这是系统限制，不是屏幕问题。</b>\n      </div>\n    </div>\n  </div>");
// ==================== 图床上传（极速图床） ====================
function handleImgSelect(file){
  if(!file) return;
  if(!file.type.startsWith('image/')){ showToast('请选择图片文件'); return; }
  if(file.size > 3*1024*1024){ showToast('图片不能超过3MB'); return; }
  uploadImage(file);
}
function handleImgDrop(e){
  const file = e.dataTransfer.files[0];
  handleImgSelect(file);
}
// 粘贴上传
document.addEventListener('paste', function(e){
  const page = document.getElementById('pageImghost');
  if(page && page.style.display !== 'none' && page.classList.contains('active')){
    const items = e.clipboardData.items;
    for(let i=0;i<items.length;i++){
      if(items[i].type.startsWith('image/')){
        const file = items[i].getAsFile();
        handleImgSelect(file);
        break;
      }
    }
  }
});
async function uploadImage(file){
  const progressEl = document.getElementById('ihProgress');
  const progressBar = document.getElementById('ihProgressBar');
  const progressText = document.getElementById('ihProgressText');
  const resultEl = document.getElementById('ihResult');
  resultEl.style.display = 'none';
  progressEl.style.display = 'block';
  progressBar.style.width = '10%';
  progressText.textContent = '正在上传到极速图床...';
  try{
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('https://tucdn.wpon.cn/api/upload', {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(60000)
    });
    const data = await res.json();
    if(data && data.code === 200 && data.data && data.data.url){
      progressBar.style.width = '100%';
      progressText.textContent = '上传成功！';
      setTimeout(()=>{ progressEl.style.display = 'none'; }, 1000);
      showImgResult(data.data.url);
    } else {
      throw new Error(data.msg || '上传失败');
    }
  }catch(e){
    console.error(e);
    progressText.textContent = '❌ 上传失败：' + (e.message || '网络错误');
    showToast('上传失败，请稍后重试');
  }
}
function showImgResult(url){
  const resultEl = document.getElementById('ihResult');
  const preview = document.getElementById('ihPreview');
  preview.src = url;
  document.getElementById('ihUrl').value = url;
  resultEl.style.display = 'block';
}
