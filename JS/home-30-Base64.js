/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageBase64", "<!-- pageBase64 -->\n<div class=\"tool-page\" id=\"pageBase64\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🔐 Base64 编解码</h3>\n      <textarea id=\"b64Input\" rows=\"8\" placeholder=\"输入文本或base64字符串\"></textarea>\n      <br>\n      <button class=\"common-btn\" onclick=\"b64Encode()\">文本→Base64编码</button>\n      <button class=\"common-btn\" onclick=\"b64Decode()\">Base64→文本解码</button>\n      <button class=\"common-btn\" onclick=\"b64CopyInput()\">📋 复制内容</button>\n      <button class=\"common-btn\" onclick=\"b64Clear()\">清空</button>\n    </div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🖼️ 图片转Base64</h3>\n      <div style=\"display:flex;gap:10px;align-items:center;margin-bottom:12px;flex-wrap:wrap;\">\n        <input type=\"file\" id=\"b64ImageInput\" accept=\"image/*\" style=\"flex:1;min-width:200px;\" onchange=\"b64ImageConvert(this)\">\n        <button class=\"common-btn\" onclick=\"document.getElementById('b64ImageInput').click()\" style=\"white-space:nowrap;\">📁 选择图片</button>\n      </div>\n      <div id=\"b64ImagePreviewWrap\" style=\"display:none;margin-bottom:12px;text-align:center;\">\n        <img id=\"b64ImagePreview\" style=\"max-width:100%;max-height:200px;border-radius:8px;border:1px solid var(--border-color);\">\n        <div id=\"b64ImageInfo\" style=\"font-size:12px;color:var(--text-secondary);margin-top:6px;\"></div>\n      </div>\n      <div id=\"b64ImageResultWrap\" style=\"display:none;\">\n        <textarea id=\"b64ImageResult\" rows=\"6\" placeholder=\"转换后的Base64字符串\" style=\"width:100%;font-size:12px;word-break:break-all;\"></textarea>\n        <div style=\"display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;\">\n          <button class=\"common-btn\" onclick=\"b64CopyImageResult()\" style=\"white-space:nowrap;\">📋 复制Base64</button>\n          <button class=\"common-btn\" onclick=\"b64ClearImage()\" style=\"white-space:nowrap;opacity:0.8;\">清空</button>\n        </div>\n      </div>\n    </div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🖼️ Base64转图片</h3>\n      <textarea id=\"b64ToImageInput\" rows=\"6\" placeholder=\"粘贴图片的Base64字符串（支持data:image/...开头或纯base64）\" style=\"width:100%;font-size:12px;word-break:break-all;\"></textarea>\n      <div style=\"display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;\">\n        <button class=\"common-btn\" onclick=\"b64ToImageConvert()\" style=\"white-space:nowrap;\">🔄 转换为图片</button>\n        <button class=\"common-btn\" onclick=\"b64ToImageCopyInput()\" style=\"white-space:nowrap;\">📋 复制内容</button>\n        <button class=\"common-btn\" onclick=\"b64ToImageClear()\" style=\"white-space:nowrap;opacity:0.8;\">清空</button>\n      </div>\n      <div id=\"b64ToImageResultWrap\" style=\"display:none;margin-top:14px;text-align:center;\">\n        <img id=\"b64ToImagePreview\" style=\"max-width:100%;max-height:300px;border-radius:8px;border:1px solid var(--border-color);\">\n        <div id=\"b64ToImageInfo\" style=\"font-size:12px;color:var(--text-secondary);margin-top:6px;\"></div>\n        <div style=\"display:flex;gap:8px;margin-top:10px;justify-content:center;flex-wrap:wrap;\">\n          <button class=\"common-btn\" onclick=\"b64ToImageDownload()\" style=\"white-space:nowrap;\">⬇️ 下载图片</button>\n        </div>\n      </div>\n    </div>\n  </div>");
// ==================== Base64 ====================
const b64Input=document.getElementById('b64Input');
function b64Encode(){ try{ b64Input.value=btoa(unescape(encodeURIComponent(b64Input.value))); showToast('编码成功'); }catch(e){ showToast('编码失败'); } }
function b64Decode(){ try{ b64Input.value=decodeURIComponent(escape(atob(b64Input.value.trim()))); showToast('解码成功'); }catch(e){ showToast('解码失败，请检查base64字符串'); } }
function b64Clear(){ b64Input.value=''; }
function b64CopyInput(){
  if(!b64Input.value){ showToast('输入框是空的'); return; }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(b64Input.value).then(()=>showToast('✅ 已复制到剪贴板')).catch(()=>b64FallbackCopy(b64Input.value));
  }else{ b64FallbackCopy(b64Input.value); }
}
// 图片转Base64
function b64ImageConvert(input){
  const file=input.files[0];
  if(!file) return;
  if(!file.type.startsWith('image/')){ showToast('请选择图片文件'); return; }
  const reader=new FileReader();
  reader.onload=function(e){
    const dataUrl=e.target.result;
    document.getElementById('b64ImagePreview').src=dataUrl;
    document.getElementById('b64ImagePreviewWrap').style.display='block';
    document.getElementById('b64ImageInfo').textContent=file.name+' · '+(file.size/1024).toFixed(1)+'KB · Base64长度'+(dataUrl.length/1024).toFixed(1)+'KB';
    document.getElementById('b64ImageResult').value=dataUrl;
    document.getElementById('b64ImageResultWrap').style.display='block';
    showToast('✅ 转换成功');
  };
  reader.onerror=function(){ showToast('❌ 读取文件失败'); };
  reader.readAsDataURL(file);
}
function b64CopyImageResult(){
  const result=document.getElementById('b64ImageResult').value;
  if(!result){ showToast('没有可复制的内容'); return; }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(result).then(()=>showToast('✅ Base64已复制到剪贴板')).catch(()=>b64FallbackCopy(result));
  }else{ b64FallbackCopy(result); }
}
function b64FallbackCopy(text){
  const ta=document.createElement('textarea');
  ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select();
  try{ document.execCommand('copy'); showToast('✅ Base64已复制到剪贴板'); }
  catch(e){ showToast('❌ 复制失败'); }
  document.body.removeChild(ta);
}
function b64ClearImage(){
  document.getElementById('b64ImageInput').value='';
  document.getElementById('b64ImagePreviewWrap').style.display='none';
  document.getElementById('b64ImageResultWrap').style.display='none';
  document.getElementById('b64ImageResult').value='';
}
// Base64转图片
function b64ToImageConvert(){
  const input=document.getElementById('b64ToImageInput').value.trim();
  if(!input){ showToast('请输入Base64字符串'); return; }
  let dataUrl=input;
  // 如果不是data:开头，自动加上png前缀
  if(!input.startsWith('data:')){
    dataUrl='data:image/png;base64,'+input.replace(/\s/g,'');
  }
  const img=new Image();
  img.onload=function(){
    document.getElementById('b64ToImagePreview').src=dataUrl;
    document.getElementById('b64ToImageInfo').textContent='图片尺寸：'+img.naturalWidth+'×'+img.naturalHeight+'px · '+(dataUrl.length/1024).toFixed(1)+'KB';
    document.getElementById('b64ToImageResultWrap').style.display='block';
    showToast('✅ 转换成功');
  };
  img.onerror=function(){
    showToast('❌ 转换失败，请检查Base64字符串是否正确');
    document.getElementById('b64ToImageResultWrap').style.display='none';
  };
  img.src=dataUrl;
}
function b64ToImageClear(){
  document.getElementById('b64ToImageInput').value='';
  document.getElementById('b64ToImageResultWrap').style.display='none';
}
function b64ToImageCopyInput(){
  const text=document.getElementById('b64ToImageInput').value;
  if(!text){ showToast('输入框是空的'); return; }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(()=>showToast('✅ 已复制到剪贴板')).catch(()=>b64FallbackCopy(text));
  }else{ b64FallbackCopy(text); }
}
function b64ToImageDownload(){
  const src=document.getElementById('b64ToImagePreview').src;
  if(!src) return;
  const a=document.createElement('a');
  a.download='base64_image_'+Date.now()+'.png';
  a.href=src;
  a.click();
}
function b64ToImageCopy(){
  const src=document.getElementById('b64ToImagePreview').src;
  if(!src){ showToast('没有可复制的图片'); return; }
  fetch(src).then(r=>r.blob()).then(blob=>{
    navigator.clipboard.write([new ClipboardItem({[blob.type]:blob})]).then(()=>{
      showToast('✅ 图片已复制到剪贴板');
    }).catch(()=>showToast('❌ 复制失败'));
  }).catch(()=>showToast('❌ 复制失败'));
}

