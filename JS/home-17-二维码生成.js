window.flRegisterToolPage('pageQrcode', "<!-- qrContent -->\n<div class=\"tool-page page-qrcode\" id=\"pageQrcode\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 0;display:flex;align-items:center;justify-content:space-between;\">\n      <h3>📷 二维码生成</h3>\n      <div style=\"display:flex;flex-direction:column;gap:6px;\">\n        <button class=\"common-btn\" onclick=\"openToolWithReturn('scanner','qrcode')\" style=\"padding:6px 12px;font-size:13px;min-height:34px;white-space:nowrap;\">📷 扫码</button>\n        <button class=\"common-btn\" onclick=\"openToolWithReturn('encqrcode','qrcode')\" style=\"padding:6px 12px;font-size:13px;min-height:34px;white-space:nowrap;\">🔒 加密二维码</button>\n      </div>\n    </div>\n    <div class=\"qr-grid\">\n      <div class=\"qr-form\">\n        <label>输入内容</label>\n        <textarea id=\"qrContent\" placeholder=\"输入网址、文字生成二维码\"></textarea>\n        <div class=\"logo-row\">\n          <input type=\"file\" id=\"logoFile\" accept=\"image/*\">\n          <button class=\"common-btn\" id=\"clearLogo\">清除Logo</button>\n        </div>\n        <div class=\"qr-preview\">\n        <div id=\"qrcode-box\">\n          <img id=\"logo-preview\" alt=\"logo\">\n        </div>\n        <div class=\"download-wrap\">\n          <button class=\"download-qr\" id=\"btnDownloadPng\">下载PNG</button>\n          <button class=\"download-qr\" id=\"btnDownloadSvg\">下载SVG</button>\n        </div>\n      </div>\n        <div class=\"qr-fields\">\n          <div><label>大小(px)</label><input id=\"qrSize\" type=\"number\" value=\"512\"></div>\n          <div><label>边距</label><input id=\"qrMargin\" type=\"number\" value=\"1\"></div>\n          <div><label>容错级别</label>\n            <select id=\"qrLevel\">\n              <option value=\"L\">L low</option><option value=\"M\">M medium</option>\n              <option value=\"Q\">Q quartile</option><option value=\"H\">H high</option>\n            </select>\n          </div>\n          <div><label>前景色</label><input id=\"qrFg\" type=\"color\" value=\"#000000\"></div>\n          <div><label>背景色</label><input id=\"qrBg\" type=\"color\" value=\"#ffffff\"></div>\n        </div>\n        <div class=\"qr-actions\">\n          <button class=\"qr-btn\" id=\"btnGenQr\">生成二维码</button>\n          <button class=\"qr-btn\" id=\"btnBatchQr\" style=\"background:linear-gradient(135deg,#8b5cf6,#a78bfa);\">📦 批量生成</button>\n          <button class=\"qr-btn\" id=\"btnClearQr\" style=\"opacity:0.85\">清空</button>\n        </div>\n      </div>\n    </div>\n    <!-- 批量生成结果区 -->\n    <div class=\"common-block\" id=\"qrBatchBlock\" style=\"display:none;margin-top:16px;\">\n      <div style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;\">\n        <h3 style=\"margin:0;font-size:16px;\">📦 批量生成结果</h3>\n        <div style=\"display:flex;gap:8px;\">\n          <button class=\"common-btn\" id=\"btnDownloadAllQr\" style=\"padding:6px 14px;font-size:13px;min-height:34px;\">⬇️ 全部下载</button>\n          <button class=\"common-btn\" id=\"btnCloseBatchQr\" style=\"padding:6px 14px;font-size:13px;min-height:34px;\">✕ 关闭</button>\n        </div>\n      </div>\n      <div id=\"qrBatchGrid\" style=\"display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;\"></div>\n    </div>\n  </div>\n");
// ==================== 二维码生成 ====================
let qrInstance=null, qrDebounceTimer=null, logoImg=null;
const qrBox=document.getElementById('qrcode-box'), qrContent=document.getElementById('qrContent'),
  qrSize=document.getElementById('qrSize'), qrMargin=document.getElementById('qrMargin'),
  qrLevel=document.getElementById('qrLevel'), qrFg=document.getElementById('qrFg'),
  qrBg=document.getElementById('qrBg'), btnGenQr=document.getElementById('btnGenQr'),
  btnClearQr=document.getElementById('btnClearQr'), btnDownloadPng=document.getElementById('btnDownloadPng'),
  btnDownloadSvg=document.getElementById('btnDownloadSvg'), logoFile=document.getElementById('logoFile'),
  clearLogoBtn=document.getElementById('clearLogo'), logoPreview=document.getElementById('logo-preview');
logoFile.onchange=function(e){
  const file=e.target.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{ logoPreview.src=ev.target.result; logoPreview.style.display='block'; logoImg=new Image(); logoImg.src=ev.target.result; };
  reader.readAsDataURL(file);
};
clearLogoBtn.onclick=()=>{ logoFile.value=''; logoPreview.src=''; logoPreview.style.display='none'; logoImg=null; };
function debounceMakeQr(){ clearTimeout(qrDebounceTimer); qrDebounceTimer=setTimeout(makeQr,180); }
function makeQr(){
  qrBox.innerHTML=''; qrBox.appendChild(logoPreview);
  const text=qrContent.value.trim();
  if(!text){
    qrBox.classList.add('qr-empty');
    qrBox.classList.remove('has-qr');
    return;
  }
  qrBox.classList.remove('qr-empty');
  qrBox.classList.add('has-qr');
  qrInstance=new QRCode(qrBox,{text:text,width:Number(qrSize.value),height:Number(qrSize.value),colorDark:qrFg.value,colorLight:qrBg.value,correctLevel:QRCode.CorrectLevel[qrLevel.value]});
}
qrContent.addEventListener('input',debounceMakeQr); qrFg.addEventListener('input',debounceMakeQr);
qrBg.addEventListener('input',debounceMakeQr); qrLevel.addEventListener('change',debounceMakeQr);
qrSize.addEventListener('input',debounceMakeQr);
btnGenQr.onclick=makeQr;
// 页面加载时自动生成默认网址二维码
makeQr();
btnClearQr.onclick=()=>{ qrContent.value=''; qrBox.innerHTML=''; qrBox.appendChild(logoPreview); qrInstance=null; qrBox.classList.add('qr-empty'); qrBox.classList.remove('has-qr'); };
btnDownloadPng.onclick=()=>{
  const canvas=qrBox.querySelector('canvas'), img=qrBox.querySelector('img'), el=canvas||img;
  if(!el){ showToast('请先生成二维码'); return; }
  const a=document.createElement('a'); a.download='qrcode.png';
  a.href=el.toDataURL?el.toDataURL('image/png'):el.src; a.click();
  showToast('已下载PNG');
};
btnDownloadSvg.onclick=()=>{
  const text=qrContent.value.trim();
  if(!text){ showToast('请先生成二维码'); return; }
  const size=Number(qrSize.value), fg=qrFg.value, bg=qrBg.value;
  const svgText=`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="${bg}" /></svg>`;
  const blob=new Blob([svgText],{type:'image/svg+xml'}), url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='qrcode.svg'; a.click(); URL.revokeObjectURL(url);
  showToast('已下载SVG');
};

// 图片放大查看器
function openImageViewer(dataUrl, title, downloadName){
  const mask=document.getElementById('imageViewerMask');
  const img=document.getElementById('imageViewerImg');
  const titleEl=document.getElementById('imageViewerTitle');
  const dlBtn=document.getElementById('imageViewerDownload');
  const copyBtn=document.getElementById('imageViewerCopy');
  img.src=dataUrl;
  titleEl.textContent=title||'';
  titleEl.title=title||'';
  dlBtn.onclick=()=>{
    const a=document.createElement('a'); a.download=downloadName||'image.png'; a.href=dataUrl; a.click();
  };
  // 复制图片到剪贴板
  copyBtn.onclick=async ()=>{
    try{
      const res=await fetch(dataUrl);
      const blob=await res.blob();
      await navigator.clipboard.write([new ClipboardItem({[blob.type]:blob})]);
      showToast('✅ 图片已复制到剪贴板');
    }catch(e){
      // 降级方案：用canvas+execCommand
      try{
        const c=document.createElement('canvas');
        const ctx=c.getContext('2d');
        const im=new Image();
        im.onload=()=>{
          c.width=im.naturalWidth; c.height=im.naturalHeight;
          ctx.drawImage(im,0,0);
          c.toBlob((blob)=>{
            const item=new ClipboardItem({[blob.type]:blob});
            navigator.clipboard.write([item]).then(()=>showToast('✅ 图片已复制到剪贴板')).catch(()=>showToast('❌ 复制失败，请手动保存'));
          });
        };
        im.src=dataUrl;
      }catch(e2){ showToast('❌ 复制失败：'+e.message); }
    }
  };
  mask.style.display='flex';
  document.body.style.overflow='hidden';
}
function fallbackCopyText(text){
  const ta=document.createElement('textarea');
  ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select();
  try{ document.execCommand('copy'); showToast('✅ Base64已复制到剪贴板（'+(text.length/1024).toFixed(1)+'KB）'); }
  catch(e){ showToast('❌ 复制失败'); }
  document.body.removeChild(ta);
}
function closeImageViewer(e){
  if(e && e.target && e.target.closest('.modal-box') && e.type==='click') return;
  closeModalAnimated('imageViewerMask');
}
// SVG转PNG dataURL
function svgToPngDataUrl(svgEl, bgColor){
  return new Promise((resolve)=>{
    const svgData=new XMLSerializer().serializeToString(svgEl);
    const img=new Image();
    const svgBlob=new Blob([svgData],{type:'image/svg+xml;charset=utf-8'});
    const url=URL.createObjectURL(svgBlob);
    img.onload=function(){
      const canvas=document.createElement('canvas');
      const bbox=svgEl.getBoundingClientRect();
      canvas.width=Math.max(bbox.width*2, 200); canvas.height=Math.max(bbox.height*2, 100);
      const ctx=canvas.getContext('2d');
      ctx.fillStyle=bgColor||'#ffffff'; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src=url;
  });
}

// 批量生成二维码
const qrBatchBlock=document.getElementById('qrBatchBlock'), qrBatchGrid=document.getElementById('qrBatchGrid');
document.getElementById('btnBatchQr').onclick=()=>{
  const lines=qrContent.value.split('\n').map(s=>s.trim()).filter(s=>s);
  if(lines.length===0){ showToast('请输入内容，每行一个'); return; }
  if(lines.length>100){ showToast('最多一次生成100个'); return; }
  qrBatchGrid.innerHTML='';
  qrBatchBlock.style.display='block';
  let success=0, fail=0;
  lines.forEach((line,idx)=>{
    const card=document.createElement('div');
    card.style.cssText='background:var(--bg-card,#fff);border:1px solid var(--border-color);border-radius:12px;padding:10px;text-align:center;';
    const title=document.createElement('div');
    title.style.cssText='font-size:11px;color:var(--text-secondary);margin-bottom:6px;word-break:break-all;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
    title.textContent=line; title.title=line;
    const box=document.createElement('div');
    box.style.cssText='display:flex;align-items:center;justify-content:center;min-height:100px;background:#fff;border-radius:8px;margin-bottom:6px;cursor:pointer;transition:transform .2s;';
    box.onmouseover=()=>{ box.style.transform='scale(1.03)'; };
    box.onmouseout=()=>{ box.style.transform='scale(1)'; };
    const dlBtn=document.createElement('button');
    dlBtn.style.cssText='width:100%;padding:5px;font-size:11px;background:var(--primary);color:#fff;border:none;border-radius:6px;cursor:pointer;';
    dlBtn.textContent='下载';
    card.appendChild(title); card.appendChild(box); card.appendChild(dlBtn);
    qrBatchGrid.appendChild(card);
    try{
      new QRCode(box,{text:line,width:120,height:120,colorDark:qrFg.value,colorLight:qrBg.value,correctLevel:QRCode.CorrectLevel[qrLevel.value]});
      success++;
      // 点击放大查看
      box.onclick=()=>{
        const el=box.querySelector('canvas')||box.querySelector('img');
        if(!el)return;
        const dataUrl=el.toDataURL?el.toDataURL('image/png'):el.src;
        openImageViewer(dataUrl, line, 'qrcode_'+(idx+1)+'.png');
      };
      dlBtn.onclick=(ev)=>{
        ev.stopPropagation();
        const el=box.querySelector('canvas')||box.querySelector('img');
        if(!el)return;
        const a=document.createElement('a'); a.download='qrcode_'+(idx+1)+'.png';
        a.href=el.toDataURL?el.toDataURL('image/png'):el.src; a.click();
      };
    }catch(e){ fail++; box.innerHTML='<span style="color:#ef4444;font-size:11px;">失败</span>'; box.style.cursor='default'; dlBtn.style.opacity='0.4'; dlBtn.disabled=true; }
  });
  showToast('批量生成完成：成功'+success+'个，失败'+fail+'个');
  qrBatchBlock.scrollIntoView({behavior:'smooth',block:'start'});
};
document.getElementById('btnCloseBatchQr').onclick=()=>{ qrBatchBlock.style.display='none'; };
document.getElementById('btnDownloadAllQr').onclick=()=>{
  const cards=qrBatchGrid.querySelectorAll('button');
  if(cards.length===0){ showToast('没有可下载的二维码'); return; }
  showToast('开始批量下载...');
  cards.forEach((btn,i)=>{ if(!btn.disabled) setTimeout(()=>btn.click(), i*200); });
};

