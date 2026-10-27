window.flRegisterToolPage("pageAes", "<!-- aesKey -->\n<div class=\"tool-page page-aes\" id=\"pageAes\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 0;display:flex;align-items:center;justify-content:space-between;\">\n      <h3 style=\"margin:0;\">🔐 AES加密解密</h3>\n      <button type=\"button\" onclick=\"aesShowHelp();document.activeElement.blur();\" style=\"background:var(--primary-bg);color:var(--primary);border:none;border-radius:50%;width:32px;height:32px;font-size:16px;cursor:pointer;font-weight:700;\">?</button>\n    </div>\n    <div class=\"currency-container\">\n      <div class=\"currency-row\">\n        <label>密钥（密码）</label>\n        <input type=\"text\" id=\"aesKey\" placeholder=\"输入加密密钥\">\n      </div>\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:6px 0 10px;\">\n        <button type=\"button\" class=\"qr-btn\" style=\"background:var(--primary-bg);color:var(--primary);\" onclick=\"aesRandomKey();document.activeElement.blur();\">🎲 随机生成密钥</button>\n        <button type=\"button\" class=\"qr-btn\" style=\"background:var(--primary-bg);color:var(--primary);\" onclick=\"aesCopyKey();document.activeElement.blur();\">📋 复制密钥</button>\n      </div>\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0;\">\n        <button type=\"button\" class=\"qr-btn\" id=\"aesTabEnc\" onclick=\"aesSwitchTab('enc');document.activeElement.blur();\" style=\"background:var(--primary);color:#fff;\">🔒 加密</button>\n        <button type=\"button\" class=\"qr-btn\" id=\"aesTabDec\" onclick=\"aesSwitchTab('dec');document.activeElement.blur();\" style=\"background:var(--bg-input);color:var(--text-primary);\">🔓 解密</button>\n      </div>\n      <div id=\"aesEncPanel\">\n        <div class=\"currency-row\">\n          <label>明文内容</label>\n          <textarea id=\"aesEncInput\" rows=\"4\" style=\"width:100%;padding:12px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-primary);font-size:15px;resize:vertical;box-sizing:border-box;\" placeholder=\"输入要加密的文字...\"></textarea>\n        </div>\n        <button type=\"button\" class=\"qr-btn\" onclick=\"doAesEncrypt();document.activeElement.blur();\">🔒 立即加密</button>\n      </div>\n      <div id=\"aesDecPanel\" style=\"display:none;\">\n        <div class=\"currency-row\">\n          <label>密文内容（Base64）</label>\n          <textarea id=\"aesDecInput\" rows=\"4\" style=\"width:100%;padding:12px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-primary);font-size:15px;resize:vertical;box-sizing:border-box;\" placeholder=\"输入要解密的Base64密文...\"></textarea>\n        </div>\n        <button type=\"button\" class=\"qr-btn\" onclick=\"doAesDecrypt();document.activeElement.blur();\">🔓 立即解密</button>\n      </div>\n      <div id=\"aesResult\" style=\"display:none;margin-top:16px;padding:14px;border-radius:12px;background:var(--bg-card);border:1px solid var(--border-color);\">\n        <div style=\"font-size:12px;color:var(--text-secondary);margin-bottom:6px;\">结果</div>\n        <div id=\"aesResultText\" style=\"font-size:14px;line-height:1.6;word-break:break-all;white-space:pre-wrap;color:var(--text-primary);\"></div>\n        <div id=\"aesResultHint\" style=\"font-size:12px;color:var(--primary);margin-top:8px;line-height:1.5;\">💡 把此结果复制到解密页，填上相同密钥即可解密</div>\n        <button class=\"qr-btn\" style=\"margin-top:10px;padding:6px 14px;font-size:13px;\" onclick=\"copyAesResult()\">📋 复制结果</button>\n      </div>\n      <div style=\"margin-top:14px;font-size:12px;color:var(--text-secondary);line-height:1.6;\">\n        使用 AES-GCM 256位加密，每次加密结果不同。\n      </div>\n    </div>\n    <!-- 使用说明弹窗 -->\n    <div id=\"aesHelpModal\" style=\"display:none;position:fixed;inset:0;background:rgba(0,0,0,0.4);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:9999;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .25s ease;\">\n      <div id=\"aesHelpCard\" style=\"background:var(--bg-card);border-radius:16px;padding:24px;max-width:360px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);transform:scale(0.85) translateY(20px);transition:transform .25s ease;\">\n        <h4 style=\"margin:0 0 16px 0;font-size:17px;text-align:center;\">📖 使用说明</h4>\n        <div style=\"font-size:14px;line-height:2;color:var(--text-primary);\">\n          <div>1️⃣ 加密：输入密钥（或点随机生成），在加密页输入明文，点\"立即加密\"得到密文</div>\n          <div>2️⃣ 解密：输入相同的密钥，在解密页粘贴密文，点\"立即解密\"还原明文</div>\n          <div>3️⃣ 密钥必须相同才能解密成功</div>\n          <div>4️⃣ 所有操作在本地完成，不会上传任何数据</div>\n        </div>\n        <button type=\"button\" class=\"qr-btn\" style=\"margin-top:18px;width:100%;\" onclick=\"aesCloseHelp()\">知道了</button>\n      </div>\n    </div>\n  </div>\n");

/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageEncQr", "<!-- pageEncQr -->\n<div class=\"tool-page\" id=\"pageEncQr\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('qrcode')\"><span>←</span> 返回</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 0;display:flex;align-items:center;justify-content:space-between;\">\n      <h3>🔒 加密二维码</h3>\n      <button class=\"back-btn\" id=\"encQrScanBtn\" onclick=\"openToolWithReturn('encscan','encqrcode')\" style=\"display:none;padding:6px 12px;font-size:13px;min-height:34px;\">📷 扫码导入</button>\n    </div>\n    <div style=\"max-width:500px;margin:0 auto;padding:0 28px 32px;\">\n      <div style=\"display:flex;gap:10px;margin-bottom:16px;\">\n        <button class=\"back-btn\" id=\"encQrTabEnc\" onclick=\"encQrSwitchTab('encrypt')\" style=\"flex:1;justify-content:center;background:var(--primary);color:#fff;\">🔒 加密</button>\n        <button class=\"back-btn\" id=\"encQrTabDec\" onclick=\"encQrSwitchTab('decrypt')\" style=\"flex:1;justify-content:center;\">🔓 解密</button>\n      </div>\n      <div id=\"encQrEncPanel\">\n        <label style=\"font-size:13px;color:var(--text-secondary);\">要加密的内容</label>\n        <textarea id=\"encQrContent\" rows=\"3\" style=\"width:100%;padding:12px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-primary);font-size:15px;resize:vertical;box-sizing:border-box;margin:6px 0 12px;\" placeholder=\"输入要加密的文字或链接\"></textarea>\n        <label style=\"font-size:13px;color:var(--text-secondary);\">密码</label>\n        <input type=\"text\" id=\"encQrPassword\" style=\"width:100%;padding:12px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-primary);font-size:15px;box-sizing:border-box;margin:6px 0 12px;\" placeholder=\"设置密码\">\n        <button type=\"button\" class=\"qr-btn\" style=\"width:100%;\" onclick=\"genEncryptQr();document.activeElement.blur();\">🔒 生成加密二维码</button>\n        <div id=\"encQrResult\" style=\"display:none;text-align:center;margin-top:20px;\">\n          <div id=\"encQrImg\" style=\"display:inline-block;padding:16px;background:#fff;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.1);\"></div>\n          <p style=\"font-size:13px;color:var(--text-secondary);margin-top:12px;line-height:1.6;\">扫码后需输入密码才能查看内容</p>\n        <button type=\"button\" class=\"qr-btn\" style=\"margin-top:12px;\" onclick=\"downloadEncQr();document.activeElement.blur();\">💾 保存二维码</button>\n        </div>\n      </div>\n      <div id=\"encQrDecPanel\" style=\"display:none;\">\n        <label style=\"font-size:13px;color:var(--text-secondary);\">导入二维码图片</label>\n        <div id=\"decQrUploadArea\" onclick=\"document.getElementById('decQrFile').click()\" style=\"margin:6px 0 12px;padding:30px;border-radius:12px;border:2px dashed var(--border-color);background:var(--bg-input);text-align:center;cursor:pointer;\">\n          <div style=\"font-size:36px;\">📁</div>\n          <div style=\"font-size:14px;color:var(--text-secondary);margin-top:8px;\">点击选择二维码图片</div>\n        </div>\n        <div id=\"decQrSuccess\" style=\"display:none;margin:6px 0 12px;padding:16px;border-radius:12px;background:var(--primary-bg);text-align:center;\">\n          <div style=\"font-size:14px;color:var(--primary);font-weight:600;\">✅ 已识别二维码，可开始解密</div>\n          <button type=\"button\" onclick=\"reimportDecQr()\" style=\"margin-top:10px;padding:6px 16px;border:none;border-radius:10px;background:var(--primary);color:#fff;font-size:13px;cursor:pointer;\">重新导入</button>\n        </div>\n        <input type=\"file\" id=\"decQrFile\" accept=\"image/*\" style=\"display:none;\" onchange=\"readDecQr(this)\">\n        <div id=\"decQrPreview\" style=\"display:none;text-align:center;margin-bottom:12px;position:relative;\">\n          <img id=\"decQrPreviewImg\" src=\"\" style=\"max-width:150px;border-radius:8px;filter:blur(15px);transition:filter .2s;\">\n          <button type=\"button\" onclick=\"toggleDecQrPreview()\" style=\"display:block;margin:8px auto 0;padding:6px 16px;border:none;border-radius:10px;background:var(--primary-bg);color:var(--primary);font-size:13px;font-weight:600;cursor:pointer;\">👁 显示图片</button>\n        </div>\n      <div id=\"decQrScanTmp\" style=\"display:none;\"></div>\n        <label style=\"font-size:13px;color:var(--text-secondary);\">密码</label>\n        <input type=\"text\" id=\"decQrPassword\" style=\"width:100%;padding:12px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-primary);font-size:15px;box-sizing:border-box;margin:6px 0 12px;\" placeholder=\"输入解密密码\">\n        <button type=\"button\" class=\"qr-btn\" style=\"width:100%;\" onclick=\"decryptQr();document.activeElement.blur();\">🔓 解密</button>\n        <div id=\"decQrResult\" style=\"display:none;margin-top:16px;padding:14px;border-radius:12px;background:var(--bg-card);border:1px solid var(--border-color);\">\n          <div style=\"font-size:12px;color:var(--text-secondary);margin-bottom:6px;\">解密结果</div>\n          <div id=\"decQrResultText\" style=\"font-size:15px;white-space:pre-wrap;word-break:break-all;\"></div>\n        </div>\n      </div>\n    </div>\n  </div>");
window.flRegisterToolPage("pageEncScan", "<!-- pageEncScan -->\n<div class=\"tool-page\" id=\"pageEncScan\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"stopEncScan();backFromTool()\"><span>←</span> 返回</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 0\">\n      <h3>📷 扫码导入</h3>\n    </div>\n    <div style=\"max-width:500px;margin:0 auto;padding:0 28px 32px;\">\n      <div id=\"encScanReader\" style=\"width:100%;border-radius:12px;overflow:hidden;\"></div>\n      <div style=\"margin-top:12px;\">\n        <button type=\"button\" class=\"qr-btn\" id=\"encScanStartBtn\" style=\"width:100%;\" onclick=\"startEncScan();document.activeElement.blur();\">开启摄像头</button>\n        <button type=\"button\" class=\"qr-btn\" id=\"encScanStopBtn\" style=\"width:100%;margin-top:8px;display:none;background:#ef4444;color:#fff;\" onclick=\"stopEncScan();document.activeElement.blur();\">⏹ 关闭摄像头</button>\n        <button type=\"button\" class=\"qr-btn\" style=\"width:100%;margin-top:8px;background:var(--bg-input);color:var(--text-primary);\" onclick=\"document.getElementById('encScanFile').click();document.activeElement.blur();\">🖼 从相册选择</button>\n        <input type=\"file\" id=\"encScanFile\" accept=\"image/*\" style=\"display:none;\" onchange=\"readEncScanFile(this)\">\n      </div>\n      <p style=\"font-size:12px;color:var(--text-secondary);margin-top:12px;text-align:center;\">对准加密二维码即可自动识别</p>\n    </div>\n  </div>\n");
// ==================== AES加密 ====================
function aesStrToBytes(str){
  const bytes=new Uint8Array(str.length);
  for(let i=0;i<str.length;i++) bytes[i]=str.charCodeAt(i)&0xff;
  return bytes;
}
function aesBytesToStr(bytes){
  let str='';
  for(let i=0;i<bytes.length;i++) str+=String.fromCharCode(bytes[i]);
  return str;
}
function aesB64Encode(bytes){
  return btoa(aesBytesToStr(bytes));
}
function aesB64Decode(b64){
  return aesStrToBytes(atob(b64));
}
async function aesGetKey(keyStr){
  const keyBytes=aesStrToBytes(keyStr);
  const padded=new Uint8Array(32);
  for(let i=0;i<32;i++) padded[i]=keyBytes[i%keyBytes.length];
  return crypto.subtle.importKey('raw',padded,{name:'AES-GCM'},false,['encrypt','decrypt']);
}
let aesHelpCloseTimer = null;
let aesHelpOpenFrame1 = null;
let aesHelpOpenFrame2 = null;
function aesShowHelp(){
  const m=document.getElementById('aesHelpModal');
  const c=document.getElementById('aesHelpCard');
  if(!m||!c) return;
  if(aesHelpCloseTimer!==null){ clearTimeout(aesHelpCloseTimer); aesHelpCloseTimer=null; }
  if(aesHelpOpenFrame1!==null){ cancelAnimationFrame(aesHelpOpenFrame1); aesHelpOpenFrame1=null; }
  if(aesHelpOpenFrame2!==null){ cancelAnimationFrame(aesHelpOpenFrame2); aesHelpOpenFrame2=null; }
  m.style.display='flex';
  m.style.opacity='0';
  c.style.transform='scale(0.85) translateY(20px)';
  void m.offsetWidth;
  aesHelpOpenFrame1=requestAnimationFrame(()=>{
    aesHelpOpenFrame1=null;
    aesHelpOpenFrame2=requestAnimationFrame(()=>{
      aesHelpOpenFrame2=null;
      m.style.opacity='1';
      c.style.transform='scale(1) translateY(0)';
    });
  });
}
function aesCloseHelp(){
  const m=document.getElementById('aesHelpModal');
  const c=document.getElementById('aesHelpCard');
  if(!m||!c) return;
  if(aesHelpOpenFrame1!==null){ cancelAnimationFrame(aesHelpOpenFrame1); aesHelpOpenFrame1=null; }
  if(aesHelpOpenFrame2!==null){ cancelAnimationFrame(aesHelpOpenFrame2); aesHelpOpenFrame2=null; }
  if(aesHelpCloseTimer!==null) clearTimeout(aesHelpCloseTimer);
  m.style.opacity='0';
  c.style.transform='scale(0.85) translateY(20px)';
  aesHelpCloseTimer=setTimeout(()=>{
    m.style.display='none';
    aesHelpCloseTimer=null;
  },250);
}
function flAudioShowHelp(){
  const m=document.getElementById("flAudioHelpModal");
  const c=document.getElementById("flAudioHelpCard");
  if(!m||!c)return;
  m.style.display="flex";
  requestAnimationFrame(()=>{
    m.style.opacity="1";
    c.style.transform="scale(1) translateY(0)";
  });
}
function flAudioCloseHelp(){
  const m=document.getElementById("flAudioHelpModal");
  const c=document.getElementById("flAudioHelpCard");
  if(!m||!c)return;
  m.style.opacity="0";
  c.style.transform="scale(0.85) translateY(20px)";
  setTimeout(()=>{m.style.display="none";},250);
}
function encQrSwitchTab(tab){
  const enc=document.getElementById('encQrEncPanel');
  const dec=document.getElementById('encQrDecPanel');
  const btnEnc=document.getElementById('encQrTabEnc');
  const btnDec=document.getElementById('encQrTabDec');
  const scanBtn=document.getElementById('encQrScanBtn');
  if(tab==='encrypt'){
    enc.style.display='';dec.style.display='none';
    btnEnc.style.background='var(--primary)';btnEnc.style.color='#fff';
    btnDec.style.background='';btnDec.style.color='';
    scanBtn.style.display='none';
  }else{
    enc.style.display='none';dec.style.display='';
    btnDec.style.background='var(--primary)';btnDec.style.color='#fff';
    btnEnc.style.background='';btnEnc.style.color='';
    scanBtn.style.display='';
  }
}
let decQrScannedData='';
function reimportDecQr(){
  decQrScannedData='';
  document.getElementById('decQrUploadArea').style.display='';
  document.getElementById('decQrSuccess').style.display='none';
  document.getElementById('decQrPreview').style.display='none';
  document.getElementById('decQrResult').style.display='none';
  document.getElementById('decQrFile').value='';
}
let encScanner=null;
function startEncScan(){
  if(typeof Html5Qrcode==='undefined'){showToast('扫码库未加载');return;}
  if(encScanner)return;
  encScanner=new Html5Qrcode('encScanReader');
  encScanner.start({facingMode:"environment"},{fps:10,qrbox:{width:250,height:250}},
    text=>{stopEncScan();finishEncScan(text);},
    err=>{}
  ).then(()=>{
    document.getElementById('encScanStartBtn').style.display='none';
    document.getElementById('encScanStopBtn').style.display='';
  }).catch(err=>showToast('摄像头启动失败：'+err));
}
function stopEncScan(){
  if(encScanner){
    encScanner.stop().then(()=>{
      encScanner.clear();
      encScanner=null;
    }).catch(()=>{encScanner=null;});
  }
  document.getElementById('encScanStartBtn').style.display='';
  document.getElementById('encScanStopBtn').style.display='none';
}
function readEncScanFile(input){
  const file=input.files[0];
  if(!file)return;
  if(typeof Html5Qrcode==='undefined'){showToast('扫码库未加载');return;}
  const tmp=new Html5Qrcode('encScanTmpBox');
  tmp.scanFile(file,true).then(text=>{
    tmp.clear();
    finishEncScan(text);
  }).catch(()=>{showToast('识别失败，二维码未被加密');});
}
function finishEncScan(text){
  if(!text||!text.startsWith('FLENC:')){showToast('识别失败，二维码未被加密Error');return;}
  decQrScannedData=text;
  openPage('encqrcode');
  encQrSwitchTab('decrypt');
  document.getElementById('decQrUploadArea').style.display='none';
  document.getElementById('decQrSuccess').style.display='';
  document.getElementById('decQrPreview').style.display='none';
  document.getElementById('decQrResult').style.display='none';
}

function toggleDecQrPreview(){  const img=document.getElementById('decQrPreviewImg');
  const btn=img.nextElementSibling;
  if(img.style.filter==='none'){
    img.style.filter='blur(15px)';
    btn.textContent='👁 显示图片';
  }else{
    img.style.filter='none';
    btn.textContent='🙈 隐藏图片';
  }
}
function readDecQr(input){
  const file=input.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=function(e){
    document.getElementById('decQrPreviewImg').src=e.target.result;
    document.getElementById('decQrPreview').style.display='block';
    if(typeof Html5Qrcode!=='undefined'){
      const scanner=new Html5Qrcode(/* element id */'decQrScanTmp');
      scanner.scanFile(file,true).then(text=>{
        decQrScannedData=text;
        if(text.startsWith('FLENC:')){
          document.getElementById('decQrUploadArea').style.display='none';
          document.getElementById('decQrSuccess').style.display='';
        }
      }).catch(()=>{showToast('无法识别二维码');});
    }
  };
  reader.readAsDataURL(file);
}
async function decryptQr(){
  const pwd=document.getElementById('decQrPassword').value;
  if(!decQrScannedData||!decQrScannedData.startsWith('FLENC:')){showToast('请先导入有效的加密二维码图片');return;}
  if(!pwd){showToast('请输入密码');return;}
  try{
    const b64=decQrScannedData.slice(6);
    const raw=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
    const iv=raw.slice(0,12);
    const cipher=raw.slice(12);
    const enc=new TextEncoder();
    const keyBuf=await crypto.subtle.digest('SHA-256',enc.encode(pwd));
    const key=await crypto.subtle.importKey('raw',keyBuf,{name:'AES-GCM'},false,['decrypt']);
    const dec=await crypto.subtle.decrypt({name:'AES-GCM',iv:iv},key,cipher);
    document.getElementById('decQrResultText').innerHTML='';
    const text=new TextDecoder().decode(dec);
    if(/^https?:\/\//.test(text.trim())){
      const a=document.createElement('a');
      a.href=text.trim();
      a.target='_blank';
      a.rel='noopener';
      a.textContent=text;
      a.style.color='var(--primary)';
      a.style.textDecoration='underline';
      document.getElementById('decQrResultText').appendChild(a);
    }else{
      document.getElementById('decQrResultText').textContent=text;
    }
    document.getElementById('decQrResult').style.display='block';
  }catch(e){showToast('解密失败：密码错误或内容损坏');}
}
function downloadEncQr(){
  const img=document.querySelector('#encQrImg img');
  if(!img){showToast('请先生成二维码');return;}
  const a=document.createElement('a');
  a.href=img.src;
  a.download='加密二维码.png';
  a.click();
}
async function genEncryptQr(){  const content=document.getElementById('encQrContent').value;
  const pwd=document.getElementById('encQrPassword').value;
  if(!content){showToast('请输入要加密的内容');return;}
  if(!pwd){showToast('请设置密码');return;}
  try{
    const enc=new TextEncoder();
    const keyBuf=await crypto.subtle.digest('SHA-256',enc.encode(pwd));
    const key=await crypto.subtle.importKey('raw',keyBuf,{name:'AES-GCM'},false,['encrypt']);
    const iv=crypto.getRandomValues(new Uint8Array(12));
    const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv:iv},key,enc.encode(content));
    const combined=new Uint8Array(12+cipher.byteLength);
    combined.set(iv,0);
    combined.set(new Uint8Array(cipher),12);
    let b64=btoa(String.fromCharCode(...combined));
    const encData='FLENC:'+b64;
    document.getElementById('encQrImg').innerHTML='';
    new QRCode(document.getElementById('encQrImg'),{text:encData,width:200,height:200});
    document.getElementById('encQrResult').style.display='block';
  }catch(e){showToast('生成失败：'+e.message);}
}
function aesSwitchTab(tab){
  const enc=document.getElementById('aesEncPanel');
  const dec=document.getElementById('aesDecPanel');
  const btnEnc=document.getElementById('aesTabEnc');
  const btnDec=document.getElementById('aesTabDec');
  if(tab==='enc'){
    enc.style.display='';dec.style.display='none';
    btnEnc.style.background='var(--primary)';btnEnc.style.color='#fff';
    btnDec.style.background='var(--bg-input)';btnDec.style.color='var(--text-primary)';
  }else{
    enc.style.display='none';dec.style.display='';
    btnDec.style.background='var(--primary)';btnDec.style.color='#fff';
    btnEnc.style.background='var(--bg-input)';btnEnc.style.color='var(--text-primary)';
  }
  document.getElementById('aesResult').style.display='none';
}
async function doAesEncrypt(){
  const text=document.getElementById('aesEncInput').value;
  const keyStr=document.getElementById('aesKey').value;
  if(!text){showToast('请输入要加密的内容');return;}
  if(!keyStr){showToast('请输入密钥');return;}
  try{
    const key=await aesGetKey(keyStr);
    const iv=crypto.getRandomValues(new Uint8Array(12));
    const enc=new TextEncoder();
    const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv:iv},key,enc.encode(text));
    const combined=new Uint8Array(iv.length+cipher.byteLength);
    combined.set(iv,0);
    combined.set(new Uint8Array(cipher),iv.length);
    const result=aesB64Encode(combined);
    document.getElementById('aesResultText').textContent=result;
    document.getElementById('aesResultHint').style.display='';
    document.getElementById('aesResult').style.display='block';
  }catch(e){showToast('加密失败：'+e.message);}
}
async function doAesDecrypt(){
  const text=document.getElementById('aesDecInput').value.trim();
  const keyStr=document.getElementById('aesKey').value;
  if(!text){showToast('请输入要解密的内容');return;}
  if(!keyStr){showToast('请输入密钥');return;}
  try{
    const key=await aesGetKey(keyStr);
    const combined=aesB64Decode(text);
    const iv=combined.slice(0,12);
    const cipher=combined.slice(12);
    const dec=await crypto.subtle.decrypt({name:'AES-GCM',iv:iv},key,cipher);
    const result=new TextDecoder().decode(dec);
    document.getElementById('aesResultText').textContent=result;
    document.getElementById('aesResultHint').style.display='none';
    document.getElementById('aesResult').style.display='block';
  }catch(e){showToast('解密失败：密钥错误或内容格式不正确');}
}
function aesCopyKey(){
  const key=document.getElementById('aesKey').value;
  if(!key){showToast('密钥为空');return;}
  navigator.clipboard.writeText(key).then(()=>showToast('密钥已复制')).catch(()=>showToast('复制失败'));
}
function aesRandomKey(){
  const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let key='';
  const arr=new Uint32Array(32);
  crypto.getRandomValues(arr);
  for(let i=0;i<32;i++) key+=chars[arr[i]%chars.length];
  document.getElementById('aesKey').value=key;
}
function copyAesResult(){
  const text=document.getElementById('aesResultText').textContent;
  navigator.clipboard.writeText(text).then(()=>showToast('已复制到剪贴板')).catch(()=>showToast('复制失败'));
}




