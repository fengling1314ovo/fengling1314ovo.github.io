/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageLenormandPage", "<!-- pageLenormandPage -->\n<div class=\"tool-page\" id=\"pageLenormandPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🎴 雷诺曼卡牌</h3>\n      <p style=\"text-align:center;font-size:13px;color:var(--text-secondary);margin:8px 0 16px;\">36张雷诺曼牌，简单直接的日常占卜</p>\n      <div class=\"tarot-spread-tabs\">\n        <button class=\"tarot-spread-tab active\" data-spread=\"1\" onclick=\"lenormandSetSpread(1)\">单牌·今日指引</button>\n        <button class=\"tarot-spread-tab\" data-spread=\"3\" onclick=\"lenormandSetSpread(3)\">三牌·过去现在未来</button>\n      </div>\n      <div style=\"text-align:center;margin:12px 0;\">\n        <button class=\"common-btn btn-primary\" id=\"lenormandDrawBtn\" onclick=\"lenormandDraw()\">🎴 开始抽牌 <span style=\"font-size:11px;opacity:0.85;\">(10💰)</span></button>\n        <button class=\"common-btn\" onclick=\"lenormandReset()\">🔄 重新抽</button>\n      </div>\n      <div class=\"tarot-cards-area\" id=\"lenormandCardsArea\" style=\"display:flex;flex-wrap:wrap;gap:16px;justify-content:center;margin:20px 0;min-height:100px;\">\n        <div style=\"color:var(--text-placeholder);font-size:13px;text-align:center;padding:40px 0;width:100%;\">点击\"开始抽牌\"后，点击牌背翻牌</div>\n      </div>\n      <div id=\"lenormandReading\"></div>\n    </div>\n  </div>");
// ==================== 雷诺曼卡牌 ====================
const LENORMAND_CARDS=[
  {num:1,name:'骑士',icon:'🏇',kw:'消息·新开始·旅行',meaning:'代表新的消息和动态，可能有远方的人或事即将到来，保持开放心态迎接变化。'},
  {num:2,name:'三叶草',icon:'🍀',kw:'幸运·小确幸·机会',meaning:'小幸运降临，可能有意外的小惊喜或机会，抓住眼前的小确幸。'},
  {num:3,name:'船',icon:'⛵',kw:'旅行·远方·商业',meaning:'涉及旅行、远方或商业事务，可能有出行计划或远距离的合作机会。'},
  {num:4,name:'房子',icon:'🏠',kw:'家庭·稳定·住所',meaning:'家庭和住所相关，代表稳定和安全感，关注家庭事务和居住环境。'},
  {num:5,name:'树',icon:'🌳',kw:'健康·成长·生命力',meaning:'健康和成长相关，生命力旺盛，关注身心健康和长期发展。'},
  {num:6,name:'云',icon:'☁️',kw:'困惑·不确定性·迷雾',meaning:'眼前有些困惑和不确定性，事情还不明朗，需要耐心等待迷雾散去。'},
  {num:7,name:'蛇',icon:'🐍',kw:'智慧·诱惑·复杂',meaning:'事情有些复杂，需要运用智慧处理，警惕诱惑或背后的暗流。'},
  {num:8,name:'棺材',icon:'⚰️',kw:'结束·转变·新开始',meaning:'一个阶段即将结束，旧的不去新的不来，这是转变的契机。'},
  {num:9,name:'花束',icon:'💐',kw:'礼物·祝福·美好',meaning:'美好的事物即将到来，可能收到礼物或祝福，保持感恩之心。'},
  {num:10,name:'镰刀',icon:'🌾',kw:'突然改变·决定·切断',meaning:'需要做出果断的决定，可能有突然的变化，该切断的就要切断。'},
  {num:11,name:'鞭子',icon:'🪢',kw:'冲突·重复·争论',meaning:'可能有冲突或争论，事情反复出现，需要沟通解决而非激化矛盾。'},
  {num:12,name:'鸟',icon:'🐦',kw:'沟通·对话·焦虑',meaning:'涉及沟通和对话，可能有些焦虑或紧张，保持冷静交流。'},
  {num:13,name:'小孩',icon:'👶',kw:'纯真·新开始·小',meaning:'新的开始，保持纯真和好奇心，事情可能还处在初期小阶段。'},
  {num:14,name:'狐狸',icon:'🦊',kw:'狡猾·工作·警觉',meaning:'工作相关，需要保持警觉，运用智慧和策略处理事务。'},
  {num:15,name:'熊',icon:'🐻',kw:'力量·权威·财富',meaning:'有力量和权威的人或事，可能涉及财富和资源，稳健行事。'},
  {num:16,name:'星星',icon:'⭐',kw:'希望·梦想·指引',meaning:'希望和梦想闪耀，有明确的指引方向，相信自己的目标。'},
  {num:17,name:'鹳',icon:'🦩',kw:'变化·迁移·新开始',meaning:'变化和迁移，可能有环境或状态的转变，迎接新的开始。'},
  {num:18,name:'狗',icon:'🐕',kw:'忠诚·朋友·信任',meaning:'忠诚的朋友或伙伴，信任和支持在身边，珍惜真挚的友谊。'},
  {num:19,name:'塔',icon:'🗼',kw:'孤独·机构·隔离',meaning:'可能感到孤独或隔离，涉及官方机构或权威，保持独立思考。'},
  {num:20,name:'花园',icon:'🌷',kw:'社交·公开·聚会',meaning:'社交和公开场合，可能有聚会或活动，拓展人脉和社交圈。'},
  {num:21,name:'山',icon:'⛰️',kw:'障碍·挑战·延迟',meaning:'眼前有障碍和挑战，事情可能延迟，需要耐心和毅力克服。'},
  {num:22,name:'十字路口',icon:'🚦',kw:'选择·决定·方向',meaning:'面临选择和决定，需要认真思考方向，权衡利弊再行动。'},
  {num:23,name:'老鼠',icon:'🐭',kw:'损失·焦虑·消耗',meaning:'可能有小的损失或消耗，有些焦虑，注意细节避免资源流失。'},
  {num:24,name:'心',icon:'❤️',kw:'爱情·感情·热情',meaning:'爱情和感情相关，心中充满热情，关注情感生活和内心感受。'},
  {num:25,name:'戒指',icon:'💍',kw:'承诺·关系·契约',meaning:'承诺和契约关系，可能涉及合作或感情的承诺，重视责任。'},
  {num:26,name:'书',icon:'📖',kw:'秘密·知识·学习',meaning:'涉及秘密或未知的知识，需要学习和探索，有些信息还未公开。'},
  {num:27,name:'信',icon:'✉️',kw:'消息·沟通·文件',meaning:'重要的消息或文件，涉及书面沟通，注意信息的传递和接收。'},
  {num:28,name:'男人',icon:'👨',kw:'男性·问卜者·行动',meaning:'代表男性角色或问卜者本人，需要主动行动，发挥阳刚力量。'},
  {num:29,name:'女人',icon:'👩',kw:'女性·直觉·接纳',meaning:'代表女性角色，相信直觉和感受，以柔克刚，接纳和包容。'},
  {num:30,name:'百合花',icon:'🌸',kw:'纯洁·智慧·家庭',meaning:'纯洁和智慧，家庭和谐，保持内心的平静和清明。'},
  {num:31,name:'太阳',icon:'☀️',kw:'成功·快乐·活力',meaning:'成功和快乐，充满活力和正能量，事情向好的方向发展。'},
  {num:32,name:'月亮',icon:'🌙',kw:'直觉·潜意识·名誉',meaning:'相信直觉和潜意识，关注名誉和情感，夜晚可能有灵感。'},
  {num:33,name:'钥匙',icon:'🔑',kw:'答案·解决·机会',meaning:'找到答案和解决方案，机会之门即将打开，把握关键。'},
  {num:34,name:'鱼',icon:'🐟',kw:'财富·事业·独立',meaning:'财富和事业相关，独立自主，关注财务状况和职业发展。'},
  {num:35,name:'锚',icon:'⚓',kw:'稳定·坚持·安全',meaning:'稳定和安全，坚持目标不放松，找到可以依靠的支点。'},
  {num:36,name:'十字',icon:'✝️',kw:'挑战·信仰·命运',meaning:'面临挑战和考验，相信信仰和命运，这是成长的必经之路。'}
];
let lenormandSpread=1,lenormandDrawn=[],lenormandFlipped=0;
function lenormandSetSpread(n){
  lenormandSpread=n;
  document.querySelectorAll('#pageLenormandPage .tarot-spread-tab').forEach(t=>t.classList.toggle('active',parseInt(t.dataset.spread)===n));
  const cost=n*10;
  document.getElementById('lenormandDrawBtn').innerHTML='🎴 开始抽牌 <span style="font-size:11px;opacity:0.85;">('+cost+'💰)</span>';
  lenormandReset();
}
function lenormandDraw(){
  const cost=lenormandSpread*10;
  if(!bpSpendCoins(cost,'lenormand')){ showToast('💰 金币不足，需要'+cost+'金币'); return; }
  lenormandDrawn=[];lenormandFlipped=0;
  const pool=[...LENORMAND_CARDS];
  for(let i=0;i<lenormandSpread&&pool.length;i++){
    const idx=Math.floor(Math.random()*pool.length);
    lenormandDrawn.push(pool.splice(idx,1)[0]);
  }
  const posLabels=lenormandSpread===1?['今日指引']:['过去','现在','未来'];
  const area=document.getElementById('lenormandCardsArea');
  area.innerHTML=lenormandDrawn.map((c,i)=>
    '<div class="lenormand-card" onclick="lenormandFlip(this,'+i+')">'+
      '<div class="lc-face lc-back"><span>✦</span></div>'+
      '<div class="lc-face lc-front">'+
        '<div class="lc-num">'+c.num+'</div>'+
        '<div class="lc-icon">'+c.icon+'</div>'+
        '<div class="lc-name">'+c.name+'</div>'+
        '<div class="lc-pos">'+posLabels[i]+'</div>'+
      '</div>'+
    '</div>'
  ).join('');
  document.getElementById('lenormandReading').innerHTML='';
  showToast('🎴 点击牌背翻牌揭示');
}
function lenormandFlip(el,idx){
  if(el.classList.contains('flipped'))return;
  el.classList.add('flipped');lenormandFlipped++;
  if(lenormandFlipped===lenormandDrawn.length)setTimeout(lenormandRenderReading,500);
}
function lenormandRenderReading(){
  const posLabels=lenormandSpread===1?['今日指引']:['过去','现在','未来'];
  let html='';
  lenormandDrawn.forEach((c,i)=>{
    html+='<div class="tarot-reading">'+
      '<div class="tr-card-title">'+posLabels[i]+' · '+c.icon+' '+c.num+' '+c.name+'</div>'+
      '<div class="tr-keywords">关键词：'+c.kw+'</div>'+
      '<div class="tr-meaning">'+c.meaning+'</div>'+
    '</div>';
  });
  document.getElementById('lenormandReading').innerHTML=html;
  // 保存到背包收藏
  const savedLen=lsGet('backpack_lenormand',[]);
  lenormandDrawn.forEach((c,i)=>{
    savedLen.unshift({
      id:c.num+'_'+Date.now()+'_'+i,
      num:c.num, name:c.name, icon:c.icon, kw:c.kw, meaning:c.meaning,
      pos:posLabels[i], spread:lenormandSpread, time:Date.now()
    });
  });
  lsSet('backpack_lenormand',savedLen.slice(0,200));
}
function lenormandReset(){
  lenormandDrawn=[];lenormandFlipped=0;
  document.getElementById('lenormandCardsArea').innerHTML='<div style="color:var(--text-placeholder);font-size:13px;text-align:center;padding:40px 0;width:100%;">点击"开始抽牌"后，点击牌背翻牌</div>';
  document.getElementById('lenormandReading').innerHTML='';
}

