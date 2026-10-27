/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageTarotPage", "<!-- pageTarotPage -->\n<div class=\"tool-page\" id=\"pageTarotPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🔮 塔罗牌占卜</h3>\n      <div class=\"tarot-spread-tabs\" id=\"tarotSpreadTabs\">\n        <button class=\"tarot-spread-tab active\" data-spread=\"1\" onclick=\"tarotSetSpread(1)\">单牌·每日运势</button>\n        <button class=\"tarot-spread-tab\" data-spread=\"3\" onclick=\"tarotSetSpread(3)\">三牌·过去现在未来</button>\n        <button class=\"tarot-spread-tab\" data-spread=\"4\" onclick=\"tarotSetSpread(4)\">四牌·现状障碍建议</button>\n      </div>\n      <div style=\"text-align:center;margin:12px 0;\">\n        <button class=\"common-btn btn-primary\" id=\"tarotDrawBtn\" onclick=\"tarotDraw()\">✨ 开始抽牌 <span style=\"font-size:11px;opacity:0.85;\">(10💰)</span></button>\n        <button class=\"common-btn\" onclick=\"tarotReset()\">🔄 重新抽</button>\n      </div>\n      <div class=\"tarot-cards-area\" id=\"tarotCardsArea\" style=\"min-height:200px;\">\n        <div style=\"color:var(--text-placeholder);font-size:13px;text-align:center;padding:40px 0;\">选择牌阵后点击\"开始抽牌\"，点击牌背翻牌揭示</div>\n      </div>\n      <div id=\"tarotReading\"></div>\n      <p class=\"tarot-daily-note\">※ 塔罗占卜纯属娱乐，请理性看待</p>\n    </div>\n  </div>");

// ==================== 塔罗牌占卜（优化版） ====================
const TAROT_CARDS=[
  {num:'0',name:'愚者',icon:'🃏',kwUpright:'新开始·冒险·自由·纯真',kwReversed:'鲁莽·冒险过度·不负责任',
    loveUpright:'一段充满新鲜感的感情即将开始，保持开放心态去拥抱。',loveReversed:'感情中过于冲动，需要三思而后行，避免一时兴起。',
    careerUpright:'适合尝试新事物或开启新项目，勇敢迈出第一步。',careerReversed:'工作中缺乏规划，容易因冲动而犯错，建议稳扎稳打。',
    advice:'保持好奇心和勇气，但也要注意脚下的路，别只顾仰望星空。'},
  {num:'I',name:'魔术师',icon:'🪄',kwUpright:'创造力·行动力·技能·意志力',kwReversed:'操纵·欺骗·能力未发挥',
    loveUpright:'你有能力创造想要的感情，主动出击会有好结果。',loveReversed:'感情中可能存在欺骗或操纵，需要保持清醒。',
    careerUpright:'发挥你的才能和创造力，现在是展现实力的好时机。',careerReversed:'能力没有得到充分发挥，或有人在暗中阻挠。',
    advice:'你拥有所需的一切资源和能力，专注目标并付诸行动。'},
  {num:'II',name:'女祭司',icon:'🌙',kwUpright:'直觉·智慧·神秘·内省',kwReversed:'秘密·压抑直觉·忽视内心',
    loveUpright:'倾听内心的声音，直觉会告诉你这段感情的方向。',loveReversed:'感情中存在隐瞒或秘密，沟通不够坦诚。',
    careerUpright:'依靠直觉和洞察力做决策，适合研究和思考类工作。',careerReversed:'忽视了内心的警告信号，或信息不透明。',
    advice:'安静下来倾听内心，答案早已在你心中。'},
  {num:'III',name:'皇后',icon:'👑',kwUpright:'丰盛·母性·自然·创造力',kwReversed:'依赖·过度保护·创造力受阻',
    loveUpright:'感情甜蜜丰盛，适合培养关系或迎接新生命。',loveReversed:'感情中过度依赖或被过度束缚，需要找到平衡。',
    careerUpright:'工作成果丰硕，创意源源不断，适合创意和艺术领域。',careerReversed:'创造力受阻，或在工作中感到被忽视。',
    advice:'善待自己，滋养身心，丰盛会自然流淌。'},
  {num:'IV',name:'皇帝',icon:'🏛️',kwUpright:'权威·稳定·领导·规则',kwReversed:'专制·僵化·控制欲过强',
    loveUpright:'感情中需要担当和责任，稳定的关系正在建立。',loveReversed:'感情中一方过于强势或控制，需要平等沟通。',
    careerUpright:'适合担任领导角色，建立规则和秩序会带来成功。',careerReversed:'工作中过于僵化或遇到强势的上级，需要灵活应对。',
    advice:'建立秩序和边界，但也要保持灵活和同理心。'},
  {num:'V',name:'教皇',icon:'📿',kwUpright:'指引·信念·传统·精神追求',kwReversed:'叛逆·打破常规·寻求新路径',
    loveUpright:'感情中寻求精神层面的契合，可能得到长辈指引。',loveReversed:'感情中不愿遵循传统，或与长辈观念冲突。',
    careerUpright:'适合向有经验的人请教，遵循传统方法会有收获。',careerReversed:'是时候打破常规，尝试新的方法和路径。',
    advice:'寻求智慧的指引，但也要保持独立思考。'},
  {num:'VI',name:'恋人',icon:'💞',kwUpright:'爱情·选择·和谐·价值观',kwReversed:'失衡·错误选择·价值观冲突',
    loveUpright:'爱情运势极佳，重要的关系出现转机或新恋情到来。',loveReversed:'感情中出现分歧或面临艰难选择，需要慎重。',
    careerUpright:'工作中需要做出重要选择，跟随内心的价值观。',careerReversed:'工作中可能做了错误的选择，或与合作伙伴价值观不合。',
    advice:'听从内心，做出符合自己价值观的选择。'},
  {num:'VII',name:'战车',icon:'🏇',kwUpright:'意志·胜利·决心·掌控',kwReversed:'失控·方向不明·缺乏自律',
    loveUpright:'主动出击会赢得感情，坚定的意志能克服障碍。',loveReversed:'感情中过于强势或失去方向，需要冷静思考。',
    careerUpright:'勇往直前，掌控方向，胜利就在前方。',careerReversed:'工作中失去方向或动力不足，需要重新规划。',
    advice:'明确目标，集中意志，你有能力驾驭一切。'},
  {num:'VIII',name:'力量',icon:'🦁',kwUpright:'勇气·耐心·温柔·内在力量',kwReversed:'软弱·自我怀疑·缺乏耐心',
    loveUpright:'用温柔和耐心经营感情，内在的力量最有魅力。',loveReversed:'感情中缺乏自信或耐心，容易情绪化。',
    careerUpright:'以柔克刚，耐心和坚持会帮你克服困难。',careerReversed:'工作中自我怀疑或急于求成，需要调整心态。',
    advice:'真正的力量来自内心，温柔而坚定。'},
  {num:'IX',name:'隐者',icon:'🏮',kwUpright:'内省·寻找·独处·智慧',kwReversed:'孤立·退缩·拒绝帮助',
    loveUpright:'需要独处思考感情方向，或遇到精神契合的人。',loveReversed:'感情中过于封闭自己，或感到孤独。',
    careerUpright:'适合独立思考和深度工作，答案在独处中浮现。',careerReversed:'工作中过于孤立，或拒绝他人的建议和帮助。',
    advice:'暂时退一步，在安静中寻找答案。'},
  {num:'X',name:'命运之轮',icon:'🎡',kwUpright:'转折·机遇·命运·循环',kwReversed:'厄运·抗拒变化·恶性循环',
    loveUpright:'感情迎来转机，好运正在到来，把握机会。',loveReversed:'感情中遭遇不顺，或抗拒必要的变化。',
    careerUpright:'工作中出现新机遇，命运的齿轮开始转动。',careerReversed:'工作中遇到挫折，或陷入恶性循环需要打破。',
    advice:'顺应变化，把握机遇，命运掌握在自己手中。'},
  {num:'XI',name:'正义',icon:'⚖️',kwUpright:'公正·因果·真相·平衡',kwReversed:'不公·偏见·逃避责任',
    loveUpright:'感情中需要公平和诚实，真相会浮出水面。',loveReversed:'感情中存在不公或欺骗，需要正视问题。',
    careerUpright:'付出终有回报，公正的评价和结果即将到来。',careerReversed:'工作中遭遇不公，或需要为过去的决定负责。',
    advice:'坚持真相和公正，因果自有公道。'},
  {num:'XII',name:'倒吊人',icon:'🙃',kwUpright:'换位思考·牺牲·等待·新视角',kwReversed:'徒劳·抗拒改变·无谓牺牲',
    loveUpright:'换个角度看感情，暂时的等待会带来新领悟。',loveReversed:'感情中做了无谓的牺牲，或拒绝换个角度思考。',
    careerUpright:'工作中需要暂停和反思，换个视角会有新发现。',careerReversed:'工作中努力方向不对，或抗拒必要的调整。',
    advice:'停下来换个角度，答案往往在相反的方向。'},
  {num:'XIII',name:'死神',icon:'💀',kwUpright:'结束·新生·转变·放下',kwReversed:'抗拒结束·停滞·无法放下',
    loveUpright:'一段关系结束或迎来蜕变，放下过去才有新开始。',loveReversed:'无法放下过去的感情，或抗拒关系的变化。',
    careerUpright:'工作中一个阶段结束，新的机会正在孕育。',careerReversed:'工作中 stuck 在旧模式，无法接受必要的改变。',
    advice:'勇敢告别过去，结束是为了更好的开始。'},
  {num:'XIV',name:'节制',icon:'⚗️',kwUpright:'平衡·调和·耐心·适度',kwReversed:'失衡·过度·缺乏耐心',
    loveUpright:'感情中保持平衡和适度，细水长流的关系最稳固。',loveReversed:'感情中失衡或过度，需要调整节奏。',
    careerUpright:'工作中劳逸结合，稳步前进会有好结果。',careerReversed:'工作中过度劳累或节奏混乱，需要调整。',
    advice:'找到平衡点，适度和耐心是成功的关键。'},
  {num:'XV',name:'恶魔',icon:'😈',kwUpright:'欲望·束缚·诱惑·物质',kwReversed:'解脱·觉醒·打破束缚',
    loveUpright:'感情中存在执念或不健康的依赖，需要审视。',loveReversed:'正在从一段束缚性的关系中解脱出来。',
    careerUpright:'工作中被物质或欲望驱动，或陷入不健康的模式。',careerReversed:'工作中打破了束缚，或摆脱了不良习惯。',
    advice:'认清束缚你的是什么，你有能力挣脱。'},
  {num:'XVI',name:'高塔',icon:'🗼',kwUpright:'突变·重建·危机·觉醒',kwReversed:'避免灾难·恐惧变化·内部动摇',
    loveUpright:'感情中突发变故，但危机中孕育着新的可能。',loveReversed:'正在避免一场危机，或内心深处已有动摇。',
    careerUpright:'工作中遭遇突变，但旧的结构崩塌后才能重建。',careerReversed:'勉强维持摇摇欲坠的局面，需要主动改变。',
    advice:'接受突变，废墟之上可以建更坚固的城堡。'},
  {num:'XVII',name:'星星',icon:'✨',kwUpright:'希望·疗愈·灵感·平静',kwReversed:'绝望·失去信心·灵感枯竭',
    loveUpright:'感情充满希望和治愈，一切都会好起来。',loveReversed:'感情中感到失望或失去信心，需要重新找回希望。',
    careerUpright:'工作中灵感涌现，前景光明，保持信心。',careerReversed:'工作中感到迷茫或灵感枯竭，需要调整状态。',
    advice:'保持希望，黑夜之后必有星光。'},
  {num:'XVIII',name:'月亮',icon:'🌕',kwUpright:'迷惘·直觉·潜意识·不安',kwReversed:'迷雾散去·真相显现·恢复平静',
    loveUpright:'感情中有些迷茫和不安，相信直觉但也要核实。',loveReversed:'感情中的迷雾正在散去，真相逐渐清晰。',
    careerUpright:'工作中信息不透明，需要谨慎判断，相信直觉。',careerReversed:'工作中的困惑得到解决，方向逐渐清晰。',
    advice:'在迷雾中保持冷静，直觉会指引你走出黑暗。'},
  {num:'XIX',name:'太阳',icon:'☀️',kwUpright:'成功·快乐·活力·光明',kwReversed:'暂时阴霾·过度乐观·延迟成功',
    loveUpright:'感情阳光明媚，快乐和温暖充满关系。',loveReversed:'感情中暂时遇到阴霾，但阳光终将到来。',
    careerUpright:'工作成功顺利，充满活力和创造力，前景光明。',careerReversed:'工作中暂时不顺，但不要失去信心。',
    advice:'享受阳光，分享快乐，光明就在眼前。'},
  {num:'XX',name:'审判',icon:'📯',kwUpright:'觉醒·重生·决定·召唤',kwReversed:'自我怀疑·逃避决定·拖延',
    loveUpright:'感情中是时候做出重要决定，倾听内心的召唤。',loveReversed:'感情中逃避做决定，或自我怀疑。',
    careerUpright:'工作中迎来觉醒和重生的机会，是时候做决定了。',careerReversed:'工作中拖延重要决定，或对自己缺乏信心。',
    advice:'听从内心的召唤，是时候做出决定了。'},
  {num:'XXI',name:'世界',icon:'🌍',kwUpright:'圆满·完成·成就·整合',kwReversed:'未完成·缺乏闭环·延迟',
    loveUpright:'感情达到圆满的阶段，一个美好周期的完成。',loveReversed:'感情中还差最后一步，或一个阶段迟迟无法结束。',
    careerUpright:'工作取得圆满成功，一个阶段的完美收官。',careerReversed:'工作中项目接近完成但还差最后一步。',
    advice:'庆祝你的成就，一个周期的圆满结束意味着新的开始。'}
];

let tarotCurrentSpread=1;
let tarotDrawnCards=[];
let tarotFlippedCount=0;

function tarotSetSpread(n){
  tarotCurrentSpread=n;
  document.querySelectorAll('.tarot-spread-tab').forEach(t=>{
    t.classList.toggle('active',parseInt(t.dataset.spread)===n);
  });
  // 更新按钮金币提示
  const cost=n*10;
  const btn=document.getElementById('tarotDrawBtn');
  if(btn)btn.innerHTML='✨ 开始抽牌 <span style="font-size:11px;opacity:0.85;">('+cost+'💰)</span>';
  tarotReset();
}

function tarotDraw(){
  const cost=tarotCurrentSpread*10;
  if(!bpSpendCoins(cost,'tarot')){ showToast('💰 金币不足，需要'+cost+'金币'); return; }
  tarotDrawnCards=[];
  tarotFlippedCount=0;
  const pool=[...TAROT_CARDS];
  for(let i=0;i<tarotCurrentSpread&&pool.length;i++){
    const idx=Math.floor(Math.random()*pool.length);
    const card=pool.splice(idx,1)[0];
    const reversed=Math.random()<0.3;
    tarotDrawnCards.push({...card,reversed});
  }
  const posLabels=tarotCurrentSpread===1?['今日指引']:
    tarotCurrentSpread===3?['过去','现在','未来']:
    ['现状','障碍','建议','结果'];
  const area=document.getElementById('tarotCardsArea');
  area.innerHTML=tarotDrawnCards.map((c,i)=>
    '<div class="tarot-card'+(c.reversed?' reversed':'')+'" onclick="tarotFlipCard(this,'+i+')" style="margin-bottom:24px;">'+
      '<div class="tc-face tc-back"><span>✦</span></div>'+
      '<div class="tc-face tc-front">'+
        '<div class="tc-num">'+c.num+'</div>'+
        '<div class="tc-icon">'+c.icon+'</div>'+
        '<div class="tc-name">'+c.name+'</div>'+
        '<div class="tc-orient">'+(c.reversed?'逆位':'正位')+'</div>'+
      '</div>'+
      '<div class="tc-pos-label">'+posLabels[i]+'</div>'+
    '</div>'
  ).join('');
  document.getElementById('tarotReading').innerHTML='';
  showToast('🃏 点击牌背翻牌揭示');
}

function tarotFlipCard(el,idx){
  if(el.classList.contains('flipped'))return;
  el.classList.add('flipped');
  tarotFlippedCount++;
  if(tarotFlippedCount===tarotDrawnCards.length){
    setTimeout(tarotRenderReading,500);
  }
}

function tarotRenderReading(){
  const posLabels=tarotCurrentSpread===1?['今日指引']:
    tarotCurrentSpread===3?['过去','现在','未来']:
    ['现状','障碍','建议','结果'];
  let html='';
  tarotDrawnCards.forEach((c,i)=>{
    const kw=c.reversed?c.kwReversed:c.kwUpright;
    const love=c.reversed?c.loveReversed:c.loveUpright;
    const career=c.reversed?c.careerReversed:c.careerUpright;
    html+='<div class="tarot-reading">'+
      '<div class="tr-card-title">'+posLabels[i]+' · '+c.icon+' '+c.name+'（'+(c.reversed?'逆位':'正位')+'）</div>'+
      '<div class="tr-keywords">关键词：'+kw+'</div>'+
      '<div class="tr-meaning">'+c.advice+'</div>'+
      '<div class="tr-section"><div class="tr-section-label">💕 感情</div><div class="tr-meaning">'+love+'</div></div>'+
      '<div class="tr-section"><div class="tr-section-label">💼 事业</div><div class="tr-meaning">'+career+'</div></div>'+
    '</div>';
  });
  document.getElementById('tarotReading').innerHTML=html;
  // 保存到背包收藏
  const saved=lsGet('backpack_tarot',[]);
  tarotDrawnCards.forEach((c,i)=>{
    saved.unshift({
      id:c.num+'_'+(c.reversed?'rev':'up')+'_'+Date.now()+'_'+i,
      num:c.num, name:c.name, icon:c.icon, reversed:c.reversed,
      spread:tarotCurrentSpread, time:Date.now()
    });
  });
  lsSet('backpack_tarot',saved.slice(0,200));
}

function tarotReset(){
  tarotDrawnCards=[];
  tarotFlippedCount=0;
  document.getElementById('tarotCardsArea').innerHTML='<div style="color:var(--text-placeholder);font-size:13px;text-align:center;padding:40px 0;">选择牌阵后点击"开始抽牌"，点击牌背翻牌揭示</div>';
  document.getElementById('tarotReading').innerHTML='';
}


/* ===== 百宝箱功能分段 ===== */

