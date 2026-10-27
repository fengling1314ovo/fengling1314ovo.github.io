;(function(){
  const id = 'flScannerPageStyles';
  if(document.getElementById(id)) return;
  /* Styles moved to css/home-19-扫码识别.css. */
})();
window.flRegisterToolPage('pageScanner', "<!-- tabCamera -->\n<div class=\"tool-page page-scanner\" id=\"pageScanner\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"backFromTool()\"><span>←</span> 返回</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 0\">\n      <h3>📷 扫码识别</h3>\n    </div>\n    <div class=\"scanner-container\">\n      <div class=\"scanner-tabs\">\n        <button class=\"scanner-tab active\" id=\"tabCamera\" onclick=\"switchScannerTab('camera')\">摄像头扫描</button>\n        <button class=\"scanner-tab\" id=\"tabUpload\" onclick=\"switchScannerTab('upload')\">图片识别</button>\n      </div>\n      <div id=\"scannerCameraPanel\">\n        <div id=\"qr-reader\" style=\"width:100%;border-radius:12px;overflow:hidden;\"></div>\n        <div class=\"scanner-actions\">\n          <button class=\"qr-btn\" id=\"btnStartCamera\">开启摄像头</button>\n          <button class=\"qr-btn\" id=\"btnStopCamera\" style=\"opacity:0.85;display:none;\">停止扫描</button>\n        </div>\n        <p class=\"scanner-hint\">支持条形码和二维码，需在 HTTPS 或 localhost 下使用摄像头</p>\n      </div>\n      <div id=\"scannerUploadPanel\" style=\"display:none;\">\n        <div class=\"upload-area\" id=\"uploadArea\" onclick=\"document.getElementById('scanFile').click()\">\n          <div style=\"font-size:40px;\">📁</div>\n          <div style=\"font-size:14px;color:var(--text-secondary);margin-top:8px;\">点击或拖拽图片到此处</div>\n          <div style=\"font-size:12px;color:var(--text-placeholder);margin-top:4px;\">支持条形码、二维码图片</div>\n        </div>\n        <input type=\"file\" id=\"scanFile\" accept=\"image/*\" style=\"display:none;\">\n        <div style=\"margin-top:10px;text-align:center;\">\n          <button class=\"common-btn\" id=\"btnTogglePreview\" onclick=\"toggleScanPreview()\" style=\"padding:6px 14px;font-size:13px;min-height:34px;display:none;\">👁 显示图片</button>\n        </div>\n        <div id=\"scanPreview\" style=\"margin-top:12px;text-align:center;display:none;\"></div>\n      </div>\n      <div class=\"scanner-result\" id=\"scannerResult\" style=\"display:none;\">\n        <div class=\"result-label\">识别结果</div>\n        <div class=\"result-content\" id=\"resultText\"></div>\n        <div class=\"result-actions\">\n          <button class=\"common-btn\" onclick=\"copyScanResult()\">📋 复制</button>\n          <button class=\"common-btn\" id=\"resultOpenBtn\" style=\"display:none;\" onclick=\"openScanResult()\">🔗 打开链接</button>\n        </div>\n      </div>\n      <div class=\"scanner-history\">\n        <div style=\"display:flex;align-items:center;justify-content:space-between;\">\n          <label style=\"margin:0;\">扫描历史（点击复制）</label>\n          <button class=\"common-btn\" onclick=\"clearScanHistory()\" style=\"padding:4px 10px;font-size:12px;min-height:28px;opacity:0.7;\">🗑 清空</button>\n        </div>\n        <div id=\"scanHistoryWrap\"></div>\n      </div>\n    </div>\n  </div>");
let html5QrCode=null, scannerRunning=false;

function switchScannerTab(tab){
  document.getElementById('tabCamera').classList.toggle('active', tab==='camera');
  document.getElementById('tabUpload').classList.toggle('active', tab==='upload');
  document.getElementById('scannerCameraPanel').style.display = tab==='camera' ? '' : 'none';
  document.getElementById('scannerUploadPanel').style.display = tab==='upload' ? '' : 'none';
  if(tab==='upload' && scannerRunning) stopCameraScan();
}

function onScanSuccess(decodedText, decodedResult){
  showScanResult(decodedText);
  if(navigator.vibrate) navigator.vibrate(100);
}

async function startCameraScan(){
  if(scannerRunning) return;
  if(typeof Html5Qrcode === 'undefined'){ showToast('扫码库加载失败，请检查网络'); return; }
  try{
    if(!html5QrCode) html5QrCode = new Html5Qrcode('qr-reader');
    const config = { fps:10, qrbox:{width:250,height:250} };
    await html5QrCode.start({ facingMode:'environment' }, config, onScanSuccess, ()=>{});
    scannerRunning = true;
    document.getElementById('btnStartCamera').style.display = 'none';
    document.getElementById('btnStopCamera').style.display = '';
    showToast('摄像头已开启，对准条码即可识别');
  }catch(e){
    showToast('无法开启摄像头：'+e.message);
  }
}

async function stopCameraScan(){
  if(!scannerRunning || !html5QrCode) return;
  try{
    await html5QrCode.stop();
    html5QrCode.clear();
  }catch(e){}
  scannerRunning = false;
  document.getElementById('btnStartCamera').style.display = '';
  document.getElementById('btnStopCamera').style.display = 'none';
}

document.getElementById('btnStartCamera').addEventListener('click', startCameraScan);
document.getElementById('btnStopCamera').addEventListener('click', stopCameraScan);

// 图片识别
const scanFile = document.getElementById('scanFile');
scanFile.addEventListener('change', e=>{
  const file = e.target.files[0];
  if(file) scanImageFile(file);
});

// 拖拽上传
const uploadArea = document.getElementById('uploadArea');
['dragover','dragenter'].forEach(ev=>uploadArea.addEventListener(ev, e=>{ e.preventDefault(); uploadArea.classList.add('dragover'); }));
['dragleave','drop'].forEach(ev=>uploadArea.addEventListener(ev, e=>{ e.preventDefault(); uploadArea.classList.remove('dragover'); }));
uploadArea.addEventListener('drop', e=>{
  const file = e.dataTransfer.files[0];
  if(file && file.type.startsWith('image/')) scanImageFile(file);
});

async function scanImageFile(file){
  if(typeof Html5Qrcode === 'undefined'){ showToast('扫码库加载失败'); return; }
  const preview = document.getElementById('scanPreview');
  const toggleBtn = document.getElementById('btnTogglePreview');
  const reader = new FileReader();
  reader.onload = async function(e){
    preview.innerHTML = '<img src="'+e.target.result+'" style="max-width:200px;border-radius:8px;">';
    preview.style.display = 'none';
    toggleBtn.style.display = '';
    toggleBtn.textContent = '👁 显示图片';
    try{
      if(!html5QrCode) html5QrCode = new Html5Qrcode('qr-reader');
      const result = await html5QrCode.scanFile(file, true);
      showScanResult(result);
    }catch(err){
      preview.innerHTML += '<p style="color:#ef4444;font-size:13px;margin-top:8px;">未识别到条码/二维码，请确保图片清晰</p>';
    }
  };
  reader.readAsDataURL(file);
}

function toggleScanPreview(){
  const preview = document.getElementById('scanPreview');
  const btn = document.getElementById('btnTogglePreview');
  if(preview.style.display === 'none'){
    preview.style.display = '';
    btn.textContent = '🙈 隐藏图片';
  }else{
    preview.style.display = 'none';
    btn.textContent = '👁 显示图片';
  }
}

function showScanResult(text){
  const box = document.getElementById('scannerResult');
  const textEl = document.getElementById('resultText');
  const openBtn = document.getElementById('resultOpenBtn');
  textEl.textContent = text;
  box.style.display = '';
  // 判断是否是链接
  if(/^https?:\/\//i.test(text)){
    openBtn.style.display = '';
  }else{
    openBtn.style.display = 'none';
  }
  // 保存历史
  addScanHistory(text);
}

function copyScanResult(){
  const text = document.getElementById('resultText').textContent;
  copyText(text).then(()=>showToast('已复制'));
}

function openScanResult(){
  const text = document.getElementById('resultText').textContent;
  if(/^https?:\/\//i.test(text)) window.open(text, '_blank');
}

// 扫描历史
function getScanHistory(){
  try{ return JSON.parse(lsGet('scan_history','[]')); }catch(e){ return []; }
}
function addScanHistory(text){
  let list = getScanHistory();
  list = list.filter(t=>t!==text);
  list.unshift(text);
  if(list.length>20) list = list.slice(0,20);
  lsSet('scan_history', JSON.stringify(list));
  renderScanHistory();
}
function renderScanHistory(){
  const wrap = document.getElementById('scanHistoryWrap');
  const list = getScanHistory();
  if(list.length===0){ wrap.innerHTML='<span style="font-size:12px;color:var(--text-placeholder);">暂无记录</span>'; return; }
  wrap.innerHTML = list.map(t=>{
    const short = t.length>30 ? t.slice(0,30)+'...' : t;
    return '<span class="history-item" title="'+t.replace(/"/g,'&quot;')+'" onclick="copyText(\''+t.replace(/'/g,"\\'")+'\').then(()=>showToast(\'已复制\'))">'+short.replace(/</g,'&lt;')+'</span>';
  }).join('');
}
renderScanHistory();
function clearScanHistory(){
  if(getScanHistory().length===0){ showToast('暂无记录'); return; }
  lsSet('scan_history','[]');
  renderScanHistory();
  showToast('已清空历史');
}

// 离开页面时停止摄像头
const origOpenPage = openPage;
// 在 cleanup 里加停止
const origCleanup = cleanupBeforePageSwitch;
cleanupBeforePageSwitch = function(){
  if(scannerRunning) stopCameraScan();
  origCleanup();
};

