/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageKipperPage", "<!-- pageKipperPage -->\n<div class=\"tool-page\" id=\"pageKipperPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🃏 基博卡</h3>\n      <p style=\"text-align:center;font-size:13px;color:var(--text-secondary);margin:8px 0 16px;\">德国传统卡牌，聚焦现实生活层面</p>\n      <div class=\"tarot-spread-tabs\">\n        <button class=\"tarot-spread-tab active\" data-spread=\"1\" onclick=\"kipperSetSpread(1)\">单牌·今日指引</button>\n        <button class=\"tarot-spread-tab\" data-spread=\"3\" onclick=\"kipperSetSpread(3)\">三牌·现状建议结果</button>\n      </div>\n      <div style=\"text-align:center;margin:12px 0;\">\n        <button class=\"common-btn btn-primary\" id=\"kipperDrawBtn\" onclick=\"kipperDraw()\">🃏 开始抽牌 <span style=\"font-size:11px;opacity:0.85;\">(10💰)</span></button>\n        <button class=\"common-btn\" onclick=\"kipperReset()\">🔄 重新抽</button>\n      </div>\n      <div id=\"kipperCardsArea\" style=\"display:flex;flex-wrap:wrap;gap:16px;justify-content:center;margin:20px 0;min-height:100px;\">\n        <div style=\"color:var(--text-placeholder);font-size:13px;text-align:center;padding:40px 0;width:100%;\">点击\"开始抽牌\"后，点击牌背翻牌</div>\n      </div>\n      <div id=\"kipperReading\"></div>\n    </div>\n  </div>");
// ==================== 基博卡 ====================
const KIPPER_CARDS=[
  {num:1,name:'年轻男子',icon:'👦',kw:'新男性·消息·开始',meaning:'一个年轻男性可能出现在你的生活中，带来新的消息或开始。关注新出现的男性人物或阳刚能量。'},
  {num:2,name:'年轻女子',icon:'👧',kw:'新女性·直觉·情感',meaning:'一个年轻女性可能带来新的情感或直觉指引，关注女性人物和感性的一面。'},
  {num:3,name:'成熟男子',icon:'👨',kw:'权威·父亲·事业',meaning:'权威男性或父亲形象相关，涉及事业和责任，可能需要听取有经验男性的建议。'},
  {num:4,name:'成熟女子',icon:'👩',kw:'母亲·家庭·关怀',meaning:'母亲或成熟女性形象，关注家庭和关怀，可能涉及女性长辈的智慧和照顾。'},
  {num:5,name:'孩子',icon:'🧒',kw:'新开始·纯真·小',meaning:'新的开始，保持纯真，事情还处在初期阶段，需要细心呵护和培养。'},
  {num:6,name:'老人',icon:'👴',kw:'智慧·经验·传统',meaning:'智慧和经验，传统的方式可能更有效，听取长辈的建议，尊重过往的经验。'},
  {num:7,name:'朋友',icon:'🤝',kw:'友谊·帮助·信任',meaning:'朋友会提供帮助和支持，信任你的社交圈，在需要时不要犹豫向朋友求助。'},
  {num:8,name:'敌人',icon:'😠',kw:'障碍·竞争·警惕',meaning:'可能有竞争对手或障碍，保持警惕，但不要树敌，用智慧化解冲突。'},
  {num:9,name:'工作',icon:'💼',kw:'事业·职业·任务',meaning:'工作和事业相关，关注你的职业发展和当前任务，脚踏实地做好本职工作。'},
  {num:10,name:'金钱',icon:'💰',kw:'财富·财务·资源',meaning:'财务和资源相关，关注金钱流动，可能有收入或支出，合理规划财务。'},
  {num:11,name:'家',icon:'🏡',kw:'家庭·住所·安全',meaning:'家庭和住所，安全感的来源，关注家庭事务和居住环境，家是你的港湾。'},
  {num:12,name:'爱情',icon:'💕',kw:'感情·浪漫·关系',meaning:'爱情和感情关系，浪漫的氛围，关注你的情感生活和亲密关系。'},
  {num:13,name:'健康',icon:'🏥',kw:'身体·身心·疗愈',meaning:'健康和身心状态，关注身体发出的信号，必要时寻求医疗建议，照顾好自己。'},
  {num:14,name:'旅行',icon:'✈️',kw:'远行·变化·探索',meaning:'旅行或远行，可能有地理上的移动或心态上的转变，探索新的领域。'},
  {num:15,name:'消息',icon:'📨',kw:'沟通·信息·通知',meaning:'重要的消息或通知，保持通讯畅通，注意信息的传递和接收，可能有意外消息。'},
  {num:16,name:'礼物',icon:'🎁',kw:'惊喜·收获·馈赠',meaning:'意外的礼物或收获，可能有惊喜到来，保持感恩之心，也考虑给予他人。'},
  {num:17,name:'成功',icon:'🏆',kw:'成就·胜利·达成',meaning:'成功和成就，目标即将达成，庆祝你的胜利，这是你努力应得的回报。'},
  {num:18,name:'失败',icon:'📉',kw:'挫折·延迟·学习',meaning:'暂时的挫折或延迟，不要气馁，失败是成功之母，从中学习并调整策略。'},
  {num:19,name:'开始',icon:'🚀',kw:'起点·启动·新',meaning:'新的起点，项目或计划即将启动，抓住开始的势头，勇敢迈出第一步。'},
  {num:20,name:'结束',icon:'🔚',kw:'终点·完成·收尾',meaning:'一个阶段即将结束，做好收尾工作，总结经验，为下一个阶段做准备。'},
  {num:21,name:'等待',icon:'⏰',kw:'延迟·耐心·暂停',meaning:'需要等待和耐心，事情可能有些延迟，不要急于推进，时机成熟时自然会有进展。'},
  {num:22,name:'行动',icon:'🏃',kw:'前进·执行·主动',meaning:'需要主动行动，不要等待，执行你的计划，行动力会带来想要的结果。'},
  {num:23,name:'思考',icon:'🤔',kw:'内省·分析·理性',meaning:'需要深入思考和分析，理性看待问题，内省自己的动机和目标，谋定而后动。'},
  {num:24,name:'沟通',icon:'🗣️',kw:'对话·表达·理解',meaning:'沟通和对话很重要，清晰表达你的想法，也倾听他人的观点，良好的沟通解决大部分问题。'},
  {num:25,name:'选择',icon:'🔀',kw:'决定·选项·权衡',meaning:'面临选择和决定，认真权衡各个选项，倾听内心，做出最适合你的选择。'},
  {num:26,name:'改变',icon:'🔄',kw:'转变·调整·适应',meaning:'改变和调整，适应新的情况，不要抗拒变化，改变往往带来成长和新机会。'},
  {num:27,name:'稳定',icon:'🏔️',kw:'安全·坚持·稳固',meaning:'稳定和安全，坚持你的立场和目标，稳固的基础让你能够应对任何风浪。'},
  {num:28,name:'冒险',icon:'🎲',kw:'风险·机遇·勇气',meaning:'需要冒一点风险，高风险高回报，但要评估好风险，用勇气抓住机遇。'},
  {num:29,name:'幸运',icon:'🍀',kw:'好运·机遇·顺',meaning:'好运降临，事情进展顺利，抓住眼前的机遇，幸运偏爱有准备的人。'},
  {num:30,name:'挑战',icon:'⚔️',kw:'困难·考验·成长',meaning:'面临挑战和困难，这是成长的机会，勇敢面对，你会变得更强大。'},
  {num:31,name:'浪漫',icon:'🌹',kw:'爱情·甜蜜·诗意',meaning:'浪漫的氛围，爱情甜蜜，生活需要一些诗意和仪式感，享受美好的情感时刻。'},
  {num:32,name:'社交',icon:'👥',kw:'人际·聚会·人脉',meaning:'社交和人际，可能有聚会或活动，拓展人脉，真诚的连接带来机会和快乐。'},
  {num:33,name:'亲情',icon:'👨‍👩‍👧',kw:'家人·血缘·温暖',meaning:'亲情和家人，关注家庭关系，家人的支持是你最温暖的后盾，珍惜在一起的时光。'},
  {num:34,name:'事业',icon:'📊',kw:'工作·晋升·发展',meaning:'事业发展，可能有晋升或新的工作机会，专注职业规划，你的努力会被看到。'},
  {num:35,name:'身心',icon:'🧘',kw:'健康·平衡·修行',meaning:'身心健康，保持工作和生活的平衡，关注内在修行，身心和谐是一切的基础。'},
  {num:36,name:'财富',icon:'💎',kw:'富足·积累·价值',meaning:'财富和富足，长期积累会有回报，关注自我价值的提升，你值得拥有丰盛的人生。'}
];
let kipperSpread=1,kipperDrawn=[],kipperFlipped=0;
function kipperSetSpread(n){
  kipperSpread=n;
  document.querySelectorAll('#pageKipperPage .tarot-spread-tab').forEach(t=>t.classList.toggle('active',parseInt(t.dataset.spread)===n));
  const cost=n*10;
  document.getElementById('kipperDrawBtn').innerHTML='🃏 开始抽牌 <span style="font-size:11px;opacity:0.85;">('+cost+'💰)</span>';
  kipperReset();
}
function kipperDraw(){
  const cost=kipperSpread*10;
  if(!bpSpendCoins(cost,'kipper')){ showToast('💰 金币不足，需要'+cost+'金币'); return; }
  kipperDrawn=[];kipperFlipped=0;
  const pool=[...KIPPER_CARDS];
  for(let i=0;i<kipperSpread&&pool.length;i++){
    const idx=Math.floor(Math.random()*pool.length);
    kipperDrawn.push(pool.splice(idx,1)[0]);
  }
  const posLabels=kipperSpread===1?['今日指引']:['现状','建议','结果'];
  const area=document.getElementById('kipperCardsArea');
  area.innerHTML=kipperDrawn.map((c,i)=>
    '<div class="kipper-card" onclick="kipperFlip(this,'+i+')">'+
      '<div class="kc-face kc-back"><span>✦</span></div>'+
      '<div class="kc-face kc-front">'+
        '<div class="kc-num">'+c.num+'</div>'+
        '<div class="kc-icon">'+c.icon+'</div>'+
        '<div class="kc-name">'+c.name+'</div>'+
        '<div class="kc-pos">'+posLabels[i]+'</div>'+
      '</div>'+
    '</div>'
  ).join('');
  document.getElementById('kipperReading').innerHTML='';
  showToast('🃏 点击牌背翻牌揭示');
}
function kipperFlip(el,idx){
  if(el.classList.contains('flipped'))return;
  el.classList.add('flipped');kipperFlipped++;
  if(kipperFlipped===kipperDrawn.length)setTimeout(kipperRenderReading,500);
}
function kipperRenderReading(){
  const posLabels=kipperSpread===1?['今日指引']:['现状','建议','结果'];
  let html='';
  kipperDrawn.forEach((c,i)=>{
    html+='<div class="tarot-reading">'+
      '<div class="tr-card-title">'+posLabels[i]+' · '+c.icon+' '+c.num+' '+c.name+'</div>'+
      '<div class="tr-keywords">关键词：'+c.kw+'</div>'+
      '<div class="tr-meaning">'+c.meaning+'</div>'+
    '</div>';
  });
  document.getElementById('kipperReading').innerHTML=html;
  // 保存到背包收藏
  const savedKipper=lsGet('backpack_kipper',[]);
  kipperDrawn.forEach((c,i)=>{
    savedKipper.unshift({
      id:c.num+'_'+Date.now()+'_'+i,
      num:c.num, name:c.name, icon:c.icon, kw:c.kw, meaning:c.meaning,
      pos:posLabels[i], spread:kipperSpread, time:Date.now()
    });
  });
  lsSet('backpack_kipper',savedKipper.slice(0,200));
}
function kipperReset(){
  kipperDrawn=[];kipperFlipped=0;
  document.getElementById('kipperCardsArea').innerHTML='<div style="color:var(--text-placeholder);font-size:13px;text-align:center;padding:40px 0;width:100%;">点击"开始抽牌"后，点击牌背翻牌</div>';
  document.getElementById('kipperReading').innerHTML='';
}

