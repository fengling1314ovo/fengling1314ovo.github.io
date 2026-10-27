/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagemorsePage", "<!-- pagemorsePage -->\n<div class=\"tool-page\" id=\"pagemorsePage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>📡 摩斯密码</h3>\n      <label>输入文本（英文/数字）</label>\n      <textarea id=\"morseInput\" rows=\"3\" placeholder=\"输入文本或摩斯密码（用空格分隔）\"></textarea>\n      <br>\n      <button class=\"common-btn\" onclick=\"morseEncode()\">📡 文本→摩斯</button>\n      <button class=\"common-btn\" onclick=\"morseDecode()\">📡 摩斯→文本</button>\n      <button class=\"common-btn\" onclick=\"morsePlay()\">🔊 播放</button>\n      <button class=\"common-btn\" onclick=\"morseCopyResult()\">📋 复制结果</button>\n      <label style=\"margin-top:12px;\">结果</label>\n      <div class=\"morse-display\" id=\"morseOutput\"></div>\n    </div>\n  </div>");
// ==================== 百宝箱：摩斯密码 ====================
const MORSE_MAP={'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','.':'.-.-.-',',':'--..--','?':'..--..','!':'-.-.--','/':'-..-.','(':'-.--.',')':'-.--.-','&':'.-...',':':'---...',';':'-.-.-.','=':'-...-','+':'.-.-.','-':'-....-','_':'..--.-','"':'.-..-.','$':'...-..-','@':'.--.-.'};
const MORSE_REVERSE={};
Object.entries(MORSE_MAP).forEach(([k,v])=>MORSE_REVERSE[v]=k);
function morseEncode(){
  const text=document.getElementById('morseInput').value.toUpperCase();
  const result=text.split('').map(ch=>ch===' '?'/':(MORSE_MAP[ch]||'')).filter(s=>s!=='').join(' ');
  document.getElementById('morseOutput').textContent=result;
  showToast('编码完成');
}
function morseDecode(){
  const text=document.getElementById('morseInput').value.trim();
  const result=text.split(' ').map(code=>code==='/'?' ':(MORSE_REVERSE[code]||'?')).join('');
  document.getElementById('morseOutput').textContent=result;
  showToast('解码完成');
}
let morseAudioCtx=null;
function morsePlay(){
  const text=document.getElementById('morseOutput').textContent;
  if(!text){showToast('请先生成摩斯密码');return;}
  if(!morseAudioCtx)morseAudioCtx=new(window.AudioContext||window.webkitAudioContext)();
  let t=morseAudioCtx.currentTime;
  const dot=0.1;
  text.split('').forEach(ch=>{
    if(ch==='.'){const o=morseAudioCtx.createOscillator();const g=morseAudioCtx.createGain();o.frequency.value=800;o.connect(g);g.connect(morseAudioCtx.destination);g.gain.setValueAtTime(0.3,t);g.gain.setValueAtTime(0,t+dot);o.start(t);o.stop(t+dot);t+=dot*2;}
    else if(ch==='-'){const o=morseAudioCtx.createOscillator();const g=morseAudioCtx.createGain();o.frequency.value=800;o.connect(g);g.connect(morseAudioCtx.destination);g.gain.setValueAtTime(0.3,t);g.gain.setValueAtTime(0,t+dot*3);o.start(t);o.stop(t+dot*3);t+=dot*4;}
    else if(ch===' '){t+=dot*2;}
    else if(ch==='/'){t+=dot*4;}
  });
  showToast('正在播放');
}
function morseCopyResult(){
  const text=document.getElementById('morseOutput').textContent;
  if(!text){ showToast('结果是空的'); return; }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(()=>showToast('✅ 已复制到剪贴板')).catch(()=>{
      const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta); showToast('✅ 已复制到剪贴板');
    });
  }else{
    const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta); showToast('✅ 已复制到剪贴板');
  }
}

