/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageCharDivPage", "<!-- pageCharDivPage -->\n<div class=\"tool-page\" id=\"pageCharDivPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🔤 测字</h3>\n      <label style=\"display:block;font-size:13px;font-weight:600;color:var(--text-secondary);margin:16px 0 8px;\">输入一个汉字</label>\n      <input id=\"charDivInput\" maxlength=\"1\" placeholder=\"例如：福\" onkeydown=\"if(event.key==='Enter')charDiv()\">\n      <div style=\"text-align:center;margin-top:12px;\">\n        <button class=\"common-btn\" onclick=\"charDiv()\">🔮 测一测</button>\n      </div>\n      <div id=\"charDivResult\" style=\"margin-top:16px;\"></div>\n      <p style=\"text-align:center;font-size:12px;color:var(--text-placeholder);margin-top:14px;\">※ 纯娱乐，请勿当真</p>\n    </div>\n  </div>");
// ==================== 新增工具：测字 ====================
const CHAR_ELEMENTS=['金','木','水','火','土'];
function charDiv(){
  const ch=document.getElementById('charDivInput').value.trim();
  if(!ch){showToast('请输入一个汉字');return;}
  const seed=hashString('chardiv_'+ch+'_'+getTodaySeed());
  const element=CHAR_ELEMENTS[seed%5];
  const aspects={
    '事业':seed%41+60,
    '财运':(seed>>3)%41+60,
    '爱情':(seed>>5)%41+60,
    '健康':(seed>>7)%41+60
  };
  let total=0;for(const k in aspects)total+=aspects[k];
  total=Math.round(total/4);
  let overall='',color='';
  if(total>=85){overall='大吉';color='#10b981';}
  else if(total>=70){overall='吉';color='#22c55e';}
  else if(total>=55){overall='平';color='#f59e0b';}
  else{overall='小凶';color='#ef4444';}
  const luckWord=['顺遂','如意','安康','富贵','美满'][seed%5];
  document.getElementById('charDivResult').innerHTML=
    '<div class="quiz-result-card">'+
    '<div style="font-size:40px;color:var(--primary);font-weight:bold;">'+ch+'</div>'+
    '<div style="font-size:17px;font-weight:bold;color:'+color+';margin:8px 0;">五行属 '+element+' · 今日卦象：'+overall+'</div>'+
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin:12px 0;">'+
    Object.keys(aspects).map(k=>'<div style="background:var(--bg-input);padding:10px;border-radius:10px;text-align:center;"><div style="font-size:13px;color:var(--text-secondary);">'+k+'</div><div style="font-size:20px;font-weight:bold;color:var(--primary);">'+aspects[k]+'</div></div>').join('')+
    '</div>'+
    '<div class="qr-desc">「'+ch+'」今日运势整体<span style="color:'+color+';font-weight:bold;">'+overall+'</span>，宜保持平常心，愿'+luckWord+'。</div>'+
    '<div style="margin-top:8px;font-size:12px;color:var(--text-placeholder);">※ 纯娱乐，请勿当真</div>'+
    '</div>';
}

