window.flRegisterToolPage('pageBarcode', "<!-- barcodeContent -->\n<div class=\"tool-page page-barcode\" id=\"pageBarcode\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 0;display:flex;align-items:center;justify-content:space-between;\">\n      <h3>📊 条形码生成</h3>\n      <div style=\"display:flex;flex-direction:column;gap:6px;\">\n        <button class=\"common-btn\" onclick=\"openToolWithReturn('scanner','barcode')\" style=\"padding:6px 12px;font-size:13px;min-height:34px;white-space:nowrap;\">📷 扫码</button>\n      </div>\n    </div>\n    <div class=\"qr-grid\">\n      <div class=\"qr-form\">\n        <label>输入内容</label>\n        <textarea id=\"barcodeContent\" placeholder=\"单个生成：输入一行内容&#10;批量生成：每行输入一个内容\" style=\"width:100%;padding:10px 12px;border:1px solid var(--border-color);border-radius:10px;font-size:14px;color:var(--text-main);box-sizing:border-box;min-height:60px;resize:vertical;font-family:inherit;\"></textarea>\n        <div class=\"qr-preview\">\n        <div id=\"barcode-box\" class=\"barcode-empty\"></div>\n        <div class=\"download-wrap\">\n          <button class=\"download-qr\" id=\"btnDownloadBarcode\">下载PNG</button>\n        </div>\n      </div>\n        <div class=\"qr-fields\">\n          <div><label>格式</label>\n            <select id=\"barcodeFormat\">\n              <option value=\"CODE128\">CODE128（通用）</option>\n              <option value=\"EAN13\">EAN13（13位商品码）</option>\n              <option value=\"EAN8\">EAN8（8位商品码）</option>\n              <option value=\"CODE39\">CODE39</option>\n              <option value=\"ITF14\">ITF14</option>\n              <option value=\"MSI\">MSI</option>\n              <option value=\"Pharmacode\">Pharmacode</option>\n              <option value=\"codabar\">Codabar</option>\n            </select>\n          </div>\n          <div><label>条宽</label><input id=\"barcodeWidth\" type=\"number\" value=\"2\" min=\"1\" max=\"5\"></div>\n          <div><label>高度(px)</label><input id=\"barcodeHeight\" type=\"number\" value=\"60\" min=\"30\" max=\"300\"></div>\n          <div><label>显示文字</label>\n            <select id=\"barcodeDisplay\">\n              <option value=\"true\">显示</option>\n              <option value=\"false\" selected>隐藏</option>\n            </select>\n          </div>\n          <div><label>前景色</label><input id=\"barcodeFg\" type=\"color\" value=\"#000000\"></div>\n          <div><label>背景色</label><input id=\"barcodeBg\" type=\"color\" value=\"#ffffff\"></div>\n        </div>\n        <div class=\"qr-actions\">\n          <button class=\"qr-btn\" id=\"btnGenBarcode\">生成条形码</button>\n          <button class=\"qr-btn\" id=\"btnBatchBarcode\" style=\"background:linear-gradient(135deg,#8b5cf6,#a78bfa);\">📦 批量生成</button>\n          <button class=\"qr-btn\" id=\"btnClearBarcode\" style=\"opacity:0.85\">清空</button>\n        </div>\n      </div>\n    </div>\n    <!-- 批量生成结果区 -->\n    <div class=\"common-block\" id=\"barcodeBatchBlock\" style=\"display:none;margin-top:16px;\">\n      <div style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;\">\n        <h3 style=\"margin:0;font-size:16px;\">📦 批量生成结果</h3>\n        <div style=\"display:flex;gap:8px;\">\n          <button class=\"common-btn\" id=\"btnDownloadAllBarcode\" style=\"padding:6px 14px;font-size:13px;min-height:34px;\">⬇️ 全部下载</button>\n          <button class=\"common-btn\" id=\"btnCloseBatchBarcode\" style=\"padding:6px 14px;font-size:13px;min-height:34px;\">✕ 关闭</button>\n        </div>\n      </div>\n      <p style=\"font-size:12px;color:var(--text-secondary);margin:0 0 12px;\">💡 批量模式：在上方输入框中每行输入一个内容，点击批量生成</p>\n      <div id=\"barcodeBatchGrid\" style=\"display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;\"></div>\n    </div>\n  </div>\n");
// ==================== 条形码生成 ====================
const barcodeBox=document.getElementById('barcode-box'), barcodeContent=document.getElementById('barcodeContent'),
  barcodeFormat=document.getElementById('barcodeFormat'), barcodeWidth=document.getElementById('barcodeWidth'),
  barcodeHeight=document.getElementById('barcodeHeight'), barcodeDisplay=document.getElementById('barcodeDisplay'),
  barcodeFg=document.getElementById('barcodeFg'), barcodeBg=document.getElementById('barcodeBg');
let barcodeGenerated=false;
let barcodeDebounceTimer=null;
function debounceGenBarcode(){ clearTimeout(barcodeDebounceTimer); barcodeDebounceTimer=setTimeout(genBarcode,180); }
function genBarcode(){
  const text=barcodeContent.value.trim();
  if(!text){
    barcodeBox.innerHTML='';
    barcodeBox.classList.add('barcode-empty');
    barcodeBox.classList.remove('has-barcode');
    barcodeGenerated=false;
    return;
  }
  try{
    barcodeBox.innerHTML='';
    barcodeBox.classList.remove('barcode-empty');
    barcodeBox.classList.add('has-barcode');
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    barcodeBox.appendChild(svg);
    JsBarcode(svg, text, {
      format: barcodeFormat.value,
      width: Number(barcodeWidth.value),
      height: Number(barcodeHeight.value),
      displayValue: barcodeDisplay.value==='true',
      lineColor: barcodeFg.value,
      background: barcodeBg.value,
      margin: 10,
      fontSize: 16
    });
    barcodeGenerated=true;
  }catch(e){
    barcodeBox.innerHTML='<span style="color:#ef4444;font-size:13px;">生成失败：'+e.message+'</span>';
    barcodeBox.classList.add('barcode-empty');
    barcodeBox.classList.remove('has-barcode');
    barcodeGenerated=false;
  }
}
document.getElementById('btnGenBarcode').addEventListener('click', genBarcode);
barcodeContent.addEventListener('input',debounceGenBarcode);
barcodeFormat.addEventListener('change',debounceGenBarcode);
barcodeWidth.addEventListener('input',debounceGenBarcode);
barcodeHeight.addEventListener('input',debounceGenBarcode);
barcodeDisplay.addEventListener('change',debounceGenBarcode);
barcodeFg.addEventListener('input',debounceGenBarcode);
barcodeBg.addEventListener('input',debounceGenBarcode);
genBarcode();
document.getElementById('btnClearBarcode').addEventListener('click', ()=>{
  barcodeContent.value=''; barcodeBox.innerHTML=''; barcodeBox.classList.add('barcode-empty'); barcodeBox.classList.remove('has-barcode'); barcodeGenerated=false;
});
document.getElementById('btnDownloadBarcode').addEventListener('click', ()=>{
  if(!barcodeGenerated){ showToast('请先生成条形码'); return; }
  const svg=barcodeBox.querySelector('svg');
  if(!svg){ showToast('未找到条形码'); return; }
  const svgData=new XMLSerializer().serializeToString(svg);
  const img=new Image();
  const svgBlob=new Blob([svgData],{type:'image/svg+xml;charset=utf-8'});
  const url=URL.createObjectURL(svgBlob);
  img.onload=function(){
    const canvas=document.createElement('canvas');
    const bbox=svg.getBoundingClientRect();
    canvas.width=bbox.width*2; canvas.height=bbox.height*2;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle=barcodeBg.value; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    URL.revokeObjectURL(url);
    const a=document.createElement('a'); a.download='barcode.png'; a.href=canvas.toDataURL('image/png'); a.click();
    showToast('已下载PNG');
  };
  img.src=url;
});
// 回车生成（textarea中用Ctrl+Enter）
barcodeContent.addEventListener('keydown', e=>{ if(e.key==='Enter' && (e.ctrlKey||e.metaKey)){ e.preventDefault(); genBarcode(); } });

// 批量生成条形码
const barcodeBatchBlock=document.getElementById('barcodeBatchBlock'), barcodeBatchGrid=document.getElementById('barcodeBatchGrid');
document.getElementById('btnBatchBarcode').onclick=()=>{
  const lines=barcodeContent.value.split('\n').map(s=>s.trim()).filter(s=>s);
  if(lines.length===0){ showToast('请输入内容，每行一个'); return; }
  if(lines.length>100){ showToast('最多一次生成100个'); return; }
  barcodeBatchGrid.innerHTML='';
  barcodeBatchBlock.style.display='block';
  let success=0, fail=0;
  lines.forEach((line,idx)=>{
    const card=document.createElement('div');
    card.style.cssText='background:var(--bg-card,#fff);border:1px solid var(--border-color);border-radius:12px;padding:10px;text-align:center;';
    const title=document.createElement('div');
    title.style.cssText='font-size:11px;color:var(--text-secondary);margin-bottom:6px;word-break:break-all;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
    title.textContent=line; title.title=line;
    const box=document.createElement('div');
    box.style.cssText='display:flex;align-items:center;justify-content:center;min-height:80px;background:#fff;border-radius:8px;margin-bottom:6px;overflow:hidden;cursor:pointer;transition:transform .2s;';
    box.onmouseover=()=>{ box.style.transform='scale(1.03)'; };
    box.onmouseout=()=>{ box.style.transform='scale(1)'; };
    const dlBtn=document.createElement('button');
    dlBtn.style.cssText='width:100%;padding:5px;font-size:11px;background:var(--primary);color:#fff;border:none;border-radius:6px;cursor:pointer;';
    dlBtn.textContent='下载';
    card.appendChild(title); card.appendChild(box); card.appendChild(dlBtn);
    barcodeBatchGrid.appendChild(card);
    try{
      const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
      box.appendChild(svg);
      JsBarcode(svg, line, {
        format: barcodeFormat.value,
        width: 1.5,
        height: 50,
        displayValue: barcodeDisplay.value==='true',
        lineColor: barcodeFg.value,
        background: barcodeBg.value,
        margin: 6,
        fontSize: 12
      });
      success++;
      // 点击放大查看
      box.onclick=async ()=>{
        const svgEl=box.querySelector('svg');
        if(!svgEl)return;
        const dataUrl=await svgToPngDataUrl(svgEl, barcodeBg.value);
        openImageViewer(dataUrl, line, 'barcode_'+(idx+1)+'.png');
      };
      dlBtn.onclick=(ev)=>{
        ev.stopPropagation();
        const svgEl=box.querySelector('svg');
        if(!svgEl)return;
        svgToPngDataUrl(svgEl, barcodeBg.value).then(dataUrl=>{
          const a=document.createElement('a'); a.download='barcode_'+(idx+1)+'.png'; a.href=dataUrl; a.click();
        });
      };
    }catch(e){ fail++; box.innerHTML='<span style="color:#ef4444;font-size:11px;">失败</span>'; box.style.cursor='default'; dlBtn.style.opacity='0.4'; dlBtn.disabled=true; }
  });
  showToast('批量生成完成：成功'+success+'个，失败'+fail+'个');
  barcodeBatchBlock.scrollIntoView({behavior:'smooth',block:'start'});
};
document.getElementById('btnCloseBatchBarcode').onclick=()=>{ barcodeBatchBlock.style.display='none'; };
document.getElementById('btnDownloadAllBarcode').onclick=()=>{
  const btns=barcodeBatchGrid.querySelectorAll('button');
  if(btns.length===0){ showToast('没有可下载的条形码'); return; }
  showToast('开始批量下载...');
  btns.forEach((btn,i)=>{ if(!btn.disabled) setTimeout(()=>btn.click(), i*250); });
};

