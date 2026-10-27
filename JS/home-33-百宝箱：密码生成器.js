/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagePasswordPage", "<!-- pagePasswordPage -->\n<div class=\"tool-page\" id=\"pagePasswordPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🔑 密码生成器</h3>\n      <label>密码长度</label>\n      <input id=\"pwLength\" type=\"number\" value=\"16\" min=\"4\" max=\"64\" inputmode=\"numeric\">\n      <div class=\"pw-options\">\n        <label class=\"pw-option\"><input type=\"checkbox\" id=\"pwLower\" checked> 小写字母 a-z</label>\n        <label class=\"pw-option\"><input type=\"checkbox\" id=\"pwUpper\" checked> 大写字母 A-Z</label>\n        <label class=\"pw-option\"><input type=\"checkbox\" id=\"pwNumber\" checked> 数字 0-9</label>\n        <label class=\"pw-option\"><input type=\"checkbox\" id=\"pwSymbol\"> 特殊符号 !@#$</label>\n      </div>\n      <div style=\"text-align:center;\">\n        <button class=\"common-btn\" onclick=\"generatePassword()\">🔑 生成密码</button>\n      </div>\n      <div class=\"pw-result-box\">\n        <input id=\"pwResult\" readonly placeholder=\"生成的密码将显示在这里\">\n        <button class=\"common-btn\" onclick=\"copyPassword()\">📋 复制</button>\n      </div>\n      <div id=\"pwStrength\" style=\"margin-top:8px;font-size:13px;color:var(--text-secondary);\"></div>\n    </div>\n  </div>");
// ==================== 百宝箱：密码生成器 ====================
const pwLengthEl=document.getElementById('pwLength'), pwLowerEl=document.getElementById('pwLower'),
  pwUpperEl=document.getElementById('pwUpper'), pwNumberEl=document.getElementById('pwNumber'),
  pwSymbolEl=document.getElementById('pwSymbol'), pwResultEl=document.getElementById('pwResult'),
  pwStrengthEl=document.getElementById('pwStrength');
const PW_SETS={lower:'abcdefghijklmnopqrstuvwxyz',upper:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',number:'0123456789',symbol:'!@#$%^&*()_+-=[]{}|;:,.<>?'};
function generatePassword(){
  const len=Number(pwLengthEl.value);
  if(isNaN(len)||len<4||len>64){ showToast('密码长度范围4-64'); return; }
  let chars='';
  if(pwLowerEl.checked)chars+=PW_SETS.lower;
  if(pwUpperEl.checked)chars+=PW_SETS.upper;
  if(pwNumberEl.checked)chars+=PW_SETS.number;
  if(pwSymbolEl.checked)chars+=PW_SETS.symbol;
  if(!chars){ showToast('请至少选择一种字符类型'); return; }
  let pw='';
  const arr=new Uint32Array(len);
  crypto.getRandomValues(arr);
  for(let i=0;i<len;i++) pw+=chars[arr[i]%chars.length];
  pwResultEl.value=pw;
  // 强度评估
  let score=0;
  if(len>=8)score++; if(len>=12)score++; if(len>=16)score++;
  if(pwLowerEl.checked)score++; if(pwUpperEl.checked)score++;
  if(pwNumberEl.checked)score++; if(pwSymbolEl.checked)score+=2;
  let level='', color='';
  if(score<=3){ level='弱'; color='#ef4444'; }
  else if(score<=5){ level='中等'; color='#f59e0b'; }
  else if(score<=7){ level='强'; color='#10b981'; }
  else{ level='非常强'; color='#3b82f6'; }
  pwStrengthEl.innerHTML=`强度：<b style="color:${color}">${level}</b>（${len}位，${[pwLowerEl.checked&&'小写',pwUpperEl.checked&&'大写',pwNumberEl.checked&&'数字',pwSymbolEl.checked&&'符号'].filter(Boolean).join('/')}）`;
  showToast('密码已生成');
}
async function copyPassword(){ if(!pwResultEl.value){ showToast('请先生成密码'); return; } if(await copyText(pwResultEl.value)) showToast('已复制密码'); else showToast('复制失败'); }

