/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageMindReadingPage", "<!-- pageMindReadingPage -->\n<div class=\"tool-page\" id=\"pageMindReadingPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🃏 读心术</h3>\n      <div class=\"fortune-today-card\">\n        <div style=\"font-size:14px;color:var(--text-secondary);line-height:2;\">\n          1️⃣ 在心里想一个 <b>两位数</b>（10~99）<br>\n          2️⃣ 把它的 <b>十位数和个位数相加</b><br>\n          3️⃣ 用原来的两位数 <b>减去这个和</b><br>\n          4️⃣ 在下面符号表里找到结果对应的符号并记住\n        </div>\n        <div style=\"text-align:center;margin-top:16px;\">\n          <button class=\"common-btn\" onclick=\"mindReadingShow()\">🔮 生成符号表</button>\n        </div>\n      </div>\n      <div id=\"mindReadingResult\" style=\"margin-top:16px;\"></div>\n    </div>\n  </div>");
// ==================== 新增工具：读心术 ====================
let mindSymbol='';
function mindReadingShow(){
  const symbols=['★','◆','●','▲','♣','☺','✿','♬','☘','♥','♞','✦'];
  mindSymbol=symbols[Math.floor(Math.random()*symbols.length)];
  let table='<div style="font-size:13px;color:var(--text-secondary);margin-bottom:10px;">在下面符号表里找到你算出的数字对应的符号并记住</div>';
  table+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:6px;background:var(--bg-input);padding:12px;border-radius:12px;border:1px solid var(--border-color);">';
  for(let n=1;n<=99;n++){
    const s=(n%9===0)?mindSymbol:symbols[n%symbols.length];
    table+='<div style="text-align:center;font-size:14px;padding:4px;">'+n+' <span style="font-size:18px;">'+s+'</span></div>';
  }
  table+='</div>';
  table+='<div style="text-align:center;margin-top:16px;"><button class="common-btn" onclick="mindReadingReveal()">🔮 猜你记住的符号</button></div>';
  document.getElementById('mindReadingResult').innerHTML=table;
}
function mindReadingReveal(){
  document.getElementById('mindReadingResult').innerHTML=
    '<div class="quiz-result-card">'+
    '<div style="font-size:22px;font-weight:bold;color:var(--primary);">你记住的符号是「'+mindSymbol+'」！</div>'+
    '<div class="qr-desc" style="margin-top:10px;line-height:1.8;">对吗？其实无论你想哪个两位数，用原数减去十位+个位之后，结果一定是 9 的倍数（9、18、27…），所以符号表里 9 的倍数全都用同一个符号——这就是"读心术"的秘密！</div>'+
    '<button class="common-btn" style="margin-top:14px;" onclick="mindReadingShow()">🔄 再玩一次</button>'+
    '</div>';
}

