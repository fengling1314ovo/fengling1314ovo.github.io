/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagePwcheck", "<!-- pagePwcheck -->\n<div class=\"tool-page\" id=\"pagePwcheck\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🛡️ 密码强度检测</h3>\n      <div style=\"margin-top:12px;\">\n        <label style=\"display:block;font-size:13px;font-weight:600;color:var(--text-secondary);margin:6px 0;\">输入密码</label>\n        <div style=\"display:flex;gap:8px;\">\n          <input id=\"pwInput\" type=\"password\" placeholder=\"输入要检测的密码\" oninput=\"pwCheck()\" style=\"flex:1;padding:10px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-main);outline:none;min-height:40px;\">\n          <button class=\"common-btn\" onclick=\"pwToggle()\" style=\"white-space:nowrap;\">👁 显示</button>\n        </div>\n      </div>\n      <div style=\"margin-top:18px;\">\n        <div style=\"display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;\">\n          <span>强度评分</span>\n          <span id=\"pwScoreText\" style=\"font-weight:600;\">—</span>\n        </div>\n        <div style=\"height:10px;background:var(--bg-input);border-radius:5px;overflow:hidden;border:1px solid var(--border-color);\">\n          <div id=\"pwBar\" style=\"height:100%;width:0%;transition:width .3s,background .3s;border-radius:5px;\"></div>\n        </div>\n      </div>\n      <div style=\"margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:13px;\">\n        <div>熵值：<span id=\"pwEntropy\" style=\"font-weight:600;\">—</span></div>\n        <div>估算破解时间：<span id=\"pwCrack\" style=\"font-weight:600;\">—</span></div>\n      </div>\n      <div style=\"margin-top:18px;\">\n        <div style=\"font-size:13px;font-weight:600;margin-bottom:8px;\">📊 检测项</div>\n        <div id=\"pwChecks\" style=\"display:flex;flex-direction:column;gap:6px;font-size:13px;\"></div>\n      </div>\n      <div style=\"margin-top:18px;\">\n        <div style=\"font-size:13px;font-weight:600;margin-bottom:8px;\">💡 改进建议</div>\n        <div id=\"pwTips\" style=\"font-size:13px;color:var(--text-secondary);line-height:1.8;\"></div>\n      </div>\n      <div class=\"tip\" style=\"margin-top:20px;\">所有检测均在本地浏览器完成，不会上传或存储你的密码。</div>\n    </div>\n  </div>");
// ==================== 密码强度检测 ====================
const COMMON_PASSWORDS = ['123456','password','12345678','qwerty','abc123','111111','1234567','1234567890','123123','admin','letmein','welcome','monkey','dragon','iloveyou','1q2w3e4r','000000','666666','888888','5201314','woaini','asdfgh','zxcvbn','qazwsx','1qaz2wsx','password1','qwerty123','123qwe','a123456','123456a','654321','112233','123321','11111111','00000000','121212','1314520','520520','147258','147258369','789456','741852','963852','987654','987654321','321321','321654','654987','159357','159753','123654','123456789','102030','202020','20212021','20222022','20232023','20242024','20252025','20262026'];
function pwToggle(){
  const inp = document.getElementById('pwInput');
  const btn = inp.nextElementSibling;
  if(inp.type==='password'){ inp.type='text'; btn.textContent='🙈 隐藏'; }
  else { inp.type='password'; btn.textContent='👁 显示'; }
}
function pwCheck(){
  const pw = document.getElementById('pwInput').value;
  const checksEl = document.getElementById('pwChecks');
  const tipsEl = document.getElementById('pwTips');
  if(!pw){
    document.getElementById('pwScoreText').textContent='—';
    document.getElementById('pwScoreText').style.color='';
    document.getElementById('pwEntropy').textContent='—';
    document.getElementById('pwCrack').textContent='—';
    const bar=document.getElementById('pwBar'); bar.style.width='0%'; bar.style.background='var(--bg-input)';
    checksEl.innerHTML=''; tipsEl.innerHTML='';
    return;
  }
  const len = pw.length;
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasDigit = /[0-9]/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);
  const isCommon = COMMON_PASSWORDS.includes(pw.toLowerCase());
  const hasRepeat = /(.)\1{2,}/.test(pw);
  const hasSeq = /(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|qwe|wer|ert|rty|tyu|yui|uio|iop|asd|sdf|dfg|fgh|ghj|hjk|jkl|zxc|xcv|cvb|vbn|bnm)/i.test(pw);
  let score = 0;
  if(len>=8) score+=20; else if(len>=6) score+=10;
  if(len>=12) score+=10;
  if(hasLower) score+=10; if(hasUpper) score+=15; if(hasDigit) score+=15; if(hasSymbol) score+=20;
  if(isCommon) score=Math.min(score,15);
  if(hasRepeat) score-=10; if(hasSeq) score-=5;
  score = Math.max(0, Math.min(100, score));
  let level, color;
  if(score<25){ level='极弱'; color='#ef4444'; }
  else if(score<45){ level='弱'; color='#f97316'; }
  else if(score<65){ level='中等'; color='#eab308'; }
  else if(score<85){ level='强'; color='#22c55e'; }
  else { level='极强'; color='#10b981'; }
  document.getElementById('pwScoreText').textContent = score+' 分 · '+level;
  document.getElementById('pwScoreText').style.color = color;
  const bar = document.getElementById('pwBar'); bar.style.width=score+'%'; bar.style.background=color;
  let pool = 0;
  if(hasLower) pool+=26; if(hasUpper) pool+=26; if(hasDigit) pool+=10; if(hasSymbol) pool+=33;
  const entropy = pool>0 ? Math.round(len * Math.log2(pool)) : 0;
  document.getElementById('pwEntropy').textContent = entropy + ' bits';
  let guesses = pool>0 ? Math.pow(pool, len) : 0;
  let seconds = guesses / 1e10;
  let crackText;
  if(!isFinite(seconds) || seconds > 31536000*1e9) crackText='极长时间（实际不可破解）';
  else if(seconds < 1) crackText='瞬间';
  else if(seconds < 60) crackText=Math.round(seconds)+' 秒';
  else if(seconds < 3600) crackText=Math.round(seconds/60)+' 分钟';
  else if(seconds < 86400) crackText=Math.round(seconds/3600)+' 小时';
  else if(seconds < 31536000) crackText=Math.round(seconds/86400)+' 天';
  else crackText=Math.round(seconds/31536000)+' 年';
  document.getElementById('pwCrack').textContent = crackText;
  const items = [
    {ok: len>=8, text:'长度至少 8 位（当前 '+len+' 位）'},
    {ok: hasUpper, text:'包含大写字母'},
    {ok: hasLower, text:'包含小写字母'},
    {ok: hasDigit, text:'包含数字'},
    {ok: hasSymbol, text:'包含特殊字符'},
    {ok: !isCommon, text:'非常见弱密码'},
    {ok: !hasRepeat, text:'无连续重复字符'},
    {ok: !hasSeq, text:'无明显键盘/字母序列'}
  ];
  checksEl.innerHTML = items.map(function(it){
    return '<div style=\'display:flex;align-items:center;gap:8px;\'><span style=\'color:'+(it.ok?'#22c55e':'#ef4444')+';font-weight:600;\'>'+(it.ok?'✓':'✗')+'</span><span style=\'color:'+(it.ok?'var(--text-main)':'var(--text-secondary)')+';\'>'+it.text+'</span></div>';
  }).join('');
  const tips = [];
  if(len<8) tips.push('• 增加长度到至少 8 位，建议 12 位以上');
  if(!hasUpper) tips.push('• 加入大写字母');
  if(!hasLower) tips.push('• 加入小写字母');
  if(!hasDigit) tips.push('• 加入数字');
  if(!hasSymbol) tips.push('• 加入特殊字符（如 !@#$%^&*）');
  if(isCommon) tips.push('• 当前密码在常见弱密码列表中，请更换');
  if(hasRepeat) tips.push('• 避免连续重复字符（如 aaa、111）');
  if(hasSeq) tips.push('• 避免键盘序列（如 qwerty、123456、abcdef）');
  if(tips.length===0) tips.push('• 密码强度优秀，继续保持！');
  tipsEl.innerHTML = tips.join('<br>');
}
