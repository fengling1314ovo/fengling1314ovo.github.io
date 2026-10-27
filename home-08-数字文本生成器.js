/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageNumgen", "<!-- pageNumgen -->\n<div class=\"tool-page\" id=\"pageNumgen\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🔢 数字文本生成器</h3>\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;\">\n        <div>\n          <label style=\"display:block;font-size:13px;font-weight:600;color:var(--text-secondary);margin:6px 0;\">序列类型</label>\n          <select id=\"ngType\" onchange=\"ngOnTypeChange()\" style=\"width:100%;padding:10px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-main);outline:none;min-height:40px;\">\n            <option value=\"num\">数字序列</option>\n            <option value=\"upper\">大写字母 A-Z</option>\n            <option value=\"lower\">小写字母 a-z</option>\n          </select>\n        </div>\n        <div>\n          <label style=\"display:block;font-size:13px;font-weight:600;color:var(--text-secondary);margin:6px 0;\">步长</label>\n          <input id=\"ngStep\" value=\"1\" type=\"number\" style=\"width:100%;padding:10px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-main);outline:none;min-height:40px;\">\n        </div>\n        <div>\n          <label id=\"ngStartLabel\" style=\"display:block;font-size:13px;font-weight:600;color:var(--text-secondary);margin:6px 0;\">开始数字</label>\n          <input id=\"ngStart\" value=\"1\" style=\"width:100%;padding:10px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-main);outline:none;min-height:40px;\">\n        </div>\n        <div>\n          <label id=\"ngEndLabel\" style=\"display:block;font-size:13px;font-weight:600;color:var(--text-secondary);margin:6px 0;\">结束数字</label>\n          <input id=\"ngEnd\" value=\"100\" style=\"width:100%;padding:10px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-main);outline:none;min-height:40px;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-size:13px;font-weight:600;color:var(--text-secondary);margin:6px 0;\">前缀</label>\n          <input id=\"ngPrefix\" placeholder=\"可选\" style=\"width:100%;padding:10px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-main);outline:none;min-height:40px;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-size:13px;font-weight:600;color:var(--text-secondary);margin:6px 0;\">后缀</label>\n          <input id=\"ngSuffix\" placeholder=\"可选\" style=\"width:100%;padding:10px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-main);outline:none;min-height:40px;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-size:13px;font-weight:600;color:var(--text-secondary);margin:6px 0;\">补零位数（留空=自动，0=不补）</label>\n          <input id=\"ngPad\" placeholder=\"自动\" style=\"width:100%;padding:10px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-main);outline:none;min-height:40px;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-size:13px;font-weight:600;color:var(--text-secondary);margin:6px 0;\">分隔符</label>\n          <select id=\"ngSep\" onchange=\"ngOnSepChange()\" style=\"width:100%;padding:10px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-main);outline:none;min-height:40px;\">\n            <option value=\"nl\">换行</option>\n            <option value=\"space\">空格</option>\n            <option value=\"comma\">逗号</option>\n            <option value=\"dunhao\">顿号</option>\n            <option value=\"custom\">自定义</option>\n          </select>\n        </div>\n      </div>\n      <div id=\"ngCustomSepWrap\" style=\"margin-top:10px;display:none;\">\n        <label style=\"display:block;font-size:13px;font-weight:600;color:var(--text-secondary);margin:6px 0;\">自定义分隔符</label>\n        <input id=\"ngCustomSep\" placeholder=\"如 | 或 -\" style=\"width:100%;padding:10px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-main);outline:none;min-height:40px;\">\n      </div>\n      <div style=\"margin-top:14px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;\">\n        <label style=\"display:flex;align-items:center;gap:6px;cursor:pointer;font-size:14px;\">\n          <input type=\"checkbox\" id=\"ngShuffle\" style=\"width:16px;height:16px;accent-color:var(--primary);\"> 打乱顺序\n        </label>\n        <button class=\"common-btn\" onclick=\"ngGenerate()\">✨ 生成</button>\n        <button class=\"common-btn\" onclick=\"ngCopy()\">📋 复制结果</button>\n        <button class=\"common-btn\" onclick=\"ngExport()\">💾 导出 TXT</button>\n      </div>\n      <div style=\"margin-top:14px;font-size:13px;color:var(--text-secondary);\">\n        生成数量：<span id=\"ngCount\" style=\"font-weight:600;color:var(--primary);\">0</span>\n      </div>\n      <textarea id=\"ngResult\" readonly rows=\"10\" style=\"margin-top:8px;width:100%;padding:10px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-main);outline:none;resize:vertical;font-family:monospace;font-size:13px;\" placeholder=\"点击生成后显示结果...\"></textarea>\n    </div>\n  </div>");
// ==================== 数字文本生成器 ====================
function ngOnTypeChange(){
  const t = document.getElementById('ngType').value;
  const sl = document.getElementById('ngStartLabel'), el = document.getElementById('ngEndLabel');
  const s = document.getElementById('ngStart'), e = document.getElementById('ngEnd');
  if(t==='num'){
    sl.textContent='开始数字'; el.textContent='结束数字';
    if(!/^-?\d+$/.test(s.value)) s.value='1';
    if(!/^-?\d+$/.test(e.value)) e.value='100';
  }else{
    sl.textContent='开始字母'; el.textContent='结束字母';
    if(!/^[A-Za-z]$/.test(s.value)) s.value = t==='upper'?'A':'a';
    if(!/^[A-Za-z]$/.test(e.value)) e.value = t==='upper'?'Z':'z';
  }
}
function ngOnSepChange(){
  document.getElementById('ngCustomSepWrap').style.display = document.getElementById('ngSep').value==='custom'?'block':'none';
}
function ngGenerate(){
  const t = document.getElementById('ngType').value;
  const step = Math.max(1, parseInt(document.getElementById('ngStep').value)||1);
  const prefix = document.getElementById('ngPrefix').value;
  const suffix = document.getElementById('ngSuffix').value;
  const padRaw = document.getElementById('ngPad').value.trim();
  const shuffle = document.getElementById('ngShuffle').checked;
  const sepMap = {nl:'\n', space:' ', comma:',', dunhao:'、'};
  let sepVal = sepMap[document.getElementById('ngSep').value];
  if(sepVal===undefined) sepVal = document.getElementById('ngCustomSep').value;
  let items=[];
  if(t==='num'){
    let a = parseInt(document.getElementById('ngStart').value), b = parseInt(document.getElementById('ngEnd').value);
    if(isNaN(a)||isNaN(b)){ showToast('请输入有效数字'); return; }
    let pad = 0;
    if(padRaw==='') pad = String(Math.max(Math.abs(a),Math.abs(b))).length;
    else { pad = parseInt(padRaw)||0; }
    if(a<=b){ for(let i=a;i<=b;i+=step) items.push(prefix+String(i).padStart(pad,'0')+suffix); }
    else { for(let i=a;i>=b;i-=step) items.push(prefix+String(i).padStart(pad,'0')+suffix); }
  }else{
    let a = document.getElementById('ngStart').value.toUpperCase().charCodeAt(0);
    let b = document.getElementById('ngEnd').value.toUpperCase().charCodeAt(0);
    if(isNaN(a)||isNaN(b)||a<65||a>90||b<65||b>90){ showToast('请输入 A-Z 字母'); return; }
    const lower = t==='lower';
    if(a<=b){ for(let i=a;i<=b;i+=step){ const c=String.fromCharCode(i); items.push(prefix+(lower?c.toLowerCase():c)+suffix); } }
    else { for(let i=a;i>=b;i-=step){ const c=String.fromCharCode(i); items.push(prefix+(lower?c.toLowerCase():c)+suffix); } }
  }
  if(shuffle){ for(let i=items.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const tmp=items[i]; items[i]=items[j]; items[j]=tmp; } }
  document.getElementById('ngResult').value = items.join(sepVal);
  document.getElementById('ngCount').textContent = items.length;
  if(items.length===0) showToast('未生成任何内容，请检查参数');
}
async function ngCopy(){
  const v = document.getElementById('ngResult').value;
  if(!v){ showToast('请先生成内容'); return; }
  if(await copyText(v)) showToast('已复制结果'); else showToast('复制失败');
}
function ngExport(){
  const v = document.getElementById('ngResult').value;
  if(!v){ showToast('请先生成内容'); return; }
  const blob = new Blob([v], {type:'text/plain;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = '数字文本生成结果.txt';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('已导出 TXT');
}
