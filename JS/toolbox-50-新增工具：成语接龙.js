/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageIdiomChainPage", "<!-- pageIdiomChainPage -->\n<div class=\"tool-page\" id=\"pageIdiomChainPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🐲 成语接龙</h3>\n      <div class=\"fortune-today-card\">\n        <div style=\"text-align:center;font-size:26px;font-weight:bold;color:var(--primary);margin:12px 0;\" id=\"idiomCurrent\">—</div>\n        <div style=\"text-align:center;font-size:13px;color:var(--text-secondary);\">接一个以「<span id=\"idiomNeedChar\" style=\"color:var(--primary);font-weight:bold;\">?</span>」开头的四字成语</div>\n        <div style=\"display:flex;gap:8px;margin-top:16px;\">\n          <input id=\"idiomInput\" placeholder=\"输入成语\" style=\"flex:1;\" onkeydown=\"if(event.key==='Enter')idiomSubmit()\">\n          <button class=\"common-btn\" onclick=\"idiomSubmit()\">✅ 接</button>\n        </div>\n        <div style=\"display:flex;gap:8px;margin-top:10px;\">\n          <button class=\"common-btn\" style=\"flex:1;\" onclick=\"idiomSkip()\">⏭️ 换一个</button>\n          <button class=\"common-btn\" style=\"flex:1;\" onclick=\"idiomReset()\">🔄 重新开始</button>\n        </div>\n        <div style=\"text-align:center;margin-top:12px;font-size:14px;\">已接 <span id=\"idiomCount\" style=\"color:var(--primary);font-weight:bold;\">0</span> 个</div>\n        <div id=\"idiomHistory\" style=\"margin-top:8px;font-size:13px;color:var(--text-secondary);text-align:center;line-height:1.7;\"></div>\n      </div>\n    </div>\n  </div>");
// ==================== 新增工具：成语接龙 ====================
const IDIOM_LIST=[
  '一心一意','意气风发','发扬光大','大公无私','私心杂念','念念不忘','忘恩负义','义不容辞','辞旧迎新','新年快乐',
  '乐善好施','施仁布德','德高望重','重于泰山','山清水秀','秀外慧中','中流砥柱','坚持不懈','持之以恒','横冲直撞',
  '壮志凌云','云开雾散','散兵游勇','勇往直前','前功尽弃','弃暗投明','明察秋毫','毫不动摇','摇摇欲坠','坠入爱河',
  '心想事成','成竹在胸','胸怀大志','志同道合','合二为一','一鸣惊人','人山人海','海阔天空','空前绝后','后来居上',
  '上天入地','地大物博','博古通今','今非昔比','比比皆是','是非曲直','直言不讳','讳莫如深','深不可测','测字问卜',
  '步步高升','升堂入室','室迩人远','远走高飞','飞黄腾达','达官贵人','人定胜天','天经地义','义薄云天','天长地久',
  '久别重逢','逢凶化吉','吉人天相','相依为命','命途多舛','出类拔萃','华而不实','实事求是','是是非非','非同小可',
  '可歌可泣','泣不成声','声东击西','西窗剪烛','烛影摇红','红红火火','火树银花','花好月圆','圆圆满满','满载而归',
  '归心似箭','箭在弦上','上天入地','地久天长','长驱直入','入木三分','分秒必争','争分夺秒','妙手回春','春风化雨',
  '雨过天晴','晴天霹雳','厉兵秣马','马到成功','功德无量','量力而行','行云流水','水到渠成','成人之美','美不胜收'
];
let idiomCount=0;
let idiomLastChar='';
function idiomReset(){
  const start=Math.floor(Math.random()*IDIOM_LIST.length);
  idiomCount=0;
  idiomLastChar=IDIOM_LIST[start][3];
  document.getElementById('idiomCurrent').textContent=IDIOM_LIST[start];
  document.getElementById('idiomNeedChar').textContent=idiomLastChar;
  document.getElementById('idiomCount').textContent='0';
  document.getElementById('idiomHistory').textContent='';
  document.getElementById('idiomInput').value='';
}
function idiomSubmit(){
  const v=document.getElementById('idiomInput').value.trim();
  if(v.length!==4){showToast('请输入四字成语');return;}
  if(v[0]!==idiomLastChar){showToast('必须以「'+idiomLastChar+'」开头');return;}
  if(!IDIOM_LIST.includes(v)){showToast('不在词库中，换个试试');return;}
  idiomCount++;
  document.getElementById('idiomCount').textContent=idiomCount;
  document.getElementById('idiomCurrent').textContent=v;
  idiomLastChar=v[3];
  document.getElementById('idiomNeedChar').textContent=idiomLastChar;
  const hist=document.getElementById('idiomHistory');
  hist.textContent=(hist.textContent?hist.textContent+' → ':'')+v;
  document.getElementById('idiomInput').value='';
  document.getElementById('idiomInput').focus();
  if(idiomCount===5){bpAddCoins(8,'idiomChain');showToast('🎉 连续接龙5个！+8金币');}
}
function idiomSkip(){
  const list=IDIOM_LIST.filter(x=>x[0]===idiomLastChar);
  if(list.length===0){showToast('词库中没有以「'+idiomLastChar+'」开头的成语，重新开始');idiomReset();return;}
  const picked=list[Math.floor(Math.random()*list.length)];
  document.getElementById('idiomCurrent').textContent=picked;
  idiomLastChar=picked[3];
  document.getElementById('idiomNeedChar').textContent=idiomLastChar;
  document.getElementById('idiomInput').value='';
}
idiomReset();

