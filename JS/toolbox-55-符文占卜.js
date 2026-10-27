/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageRunePage", "<!-- pageRunePage -->\n<div class=\"tool-page\" id=\"pageRunePage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🪨 符文占卜</h3>\n      <p style=\"text-align:center;font-size:13px;color:var(--text-secondary);margin:8px 0 16px;\">北欧卢恩符文，24枚符文+1枚空白符，点击符文石翻转揭示</p>\n      <div class=\"rune-mode-row\">\n        <button class=\"rune-mode-btn active\" data-mode=\"1\" onclick=\"runeSetMode(1)\">单枚·今日指引</button>\n        <button class=\"rune-mode-btn\" data-mode=\"3\" onclick=\"runeSetMode(3)\">三枚·过去现在未来</button>\n      </div>\n      <div style=\"text-align:center;margin:12px 0;\">\n        <button class=\"common-btn btn-primary\" id=\"runeDrawBtn\" onclick=\"runeDraw()\">🪨 抽取符文 <span style=\"font-size:11px;opacity:0.85;\">(10💰)</span></button>\n        <button class=\"common-btn\" onclick=\"runeReset()\">🔄 重新抽</button>\n      </div>\n      <div class=\"rune-stones\" id=\"runeStones\" style=\"min-height:120px;\">\n        <div style=\"color:var(--text-placeholder);font-size:13px;text-align:center;padding:40px 0;\">点击\"抽取符文\"后，点击符文石翻转</div>\n      </div>\n      <div id=\"runeInterpretation\"></div>\n    </div>\n  </div>");
// ==================== 符文占卜 ====================
const RUNE_STONES=[
  {symbol:'ᚠ',name:'Fehu 丰饶',kw:'财富·新开始·成功',meaning:'象征财富和新的开始，预示物质上的收获和事业的起步。'},
  {symbol:'ᚢ',name:'Uruz 力量',kw:'力量·健康·勇气',meaning:'象征原始的力量和生命力，预示健康恢复和勇气倍增。'},
  {symbol:'ᚦ',name:'Thurisaz 巨人',kw:'防御·冲突·突破',meaning:'象征防御和冲突，提示需要保护自己，或突破障碍。'},
  {symbol:'ᚨ',name:'Ansuz 神灵',kw:'沟通·智慧·启示',meaning:'象征沟通和智慧，预示重要的信息到来，或获得灵感启示。'},
  {symbol:'ᚱ',name:'Raido 旅程',kw:'旅行·行动·进展',meaning:'象征旅程和行动，预示事情正在推进，或有出行的机会。'},
  {symbol:'ᚲ',name:'Kenaz 火炬',kw:'创造力·热情·光明',meaning:'象征创造力和热情，预示灵感迸发，前路一片光明。'},
  {symbol:'ᚷ',name:'Gebo 礼物',kw:'礼物·交换·伙伴',meaning:'象征礼物和交换，预示会收到意外的馈赠，或遇到重要的伙伴。'},
  {symbol:'ᚹ',name:'Wunjo 喜悦',kw:'喜悦·和谐·满足',meaning:'象征喜悦和和谐，预示愿望达成，内心充满满足和快乐。'},
  {symbol:'ᚺ',name:'Hagalaz 冰雹',kw:'突变·考验·释放',meaning:'象征突发的变化和考验，提示旧模式被打破，为新生腾出空间。'},
  {symbol:'ᚾ',name:'Nauthiz 需求',kw:'需求·限制·耐心',meaning:'象征需求和限制，提示需要正视内心的渴望，耐心等待时机。'},
  {symbol:'ᛁ',name:'Isa 冰',kw:'停滞·冷静·内省',meaning:'象征停滞和冷静，提示事情暂时冻结，需要内省和等待。'},
  {symbol:'ᛃ',name:'Jera 丰收',kw:'收获·循环·耐心',meaning:'象征收获和循环，预示努力终将得到回报，但需要耐心等待。'},
  {symbol:'ᛇ',name:'Eihwaz 紫杉',kw:'转变·耐力·保护',meaning:'象征转变和耐力，提示需要坚持度过转变期，你正受到保护。'},
  {symbol:'ᛈ',name:'Perthro 秘密',kw:'秘密·命运·未知',meaning:'象征秘密和未知，提示有些事情尚未揭晓，命运的骰子正在投掷。'},
  {symbol:'ᛉ',name:'Algiz 麋鹿',kw:'保护·直觉·警觉',meaning:'象征保护和警觉，提示相信直觉，你正受到神圣力量的守护。'},
  {symbol:'ᛊ',name:'Sowilo 太阳',kw:'成功·能量·胜利',meaning:'象征太阳和成功，预示目标达成，充满正能量和胜利的曙光。'},
  {symbol:'ᛏ',name:'Tiwaz 战神',kw:'正义·勇气·牺牲',meaning:'象征正义和勇气，提示为了正义的目标需要做出牺牲和努力。'},
  {symbol:'ᛒ',name:'Berkano 桦树',kw:'新生·母性·成长',meaning:'象征新生和母性，预示新的开始，事物在滋养中茁壮成长。'},
  {symbol:'ᛖ',name:'Ehwaz 马',kw:'伙伴·信任·进展',meaning:'象征伙伴和信任，预示与他人的合作顺利，事情在信任中推进。'},
  {symbol:'ᛗ',name:'Mannaz 人',kw:'自我·关系·社会',meaning:'象征自我和人类，提示关注自身与他人的关系，在社会中找到位置。'},
  {symbol:'ᛚ',name:'Laguz 水',kw:'直觉·流动·潜意识',meaning:'象征水和直觉，提示跟随内心的流动，潜意识中有重要的信息。'},
  {symbol:'ᛜ',name:'Ingwaz 种子',kw:'完成·孕育·新开始',meaning:'象征种子和完成，预示一个阶段圆满完成，新的可能性正在孕育。'},
  {symbol:'ᛞ',name:'Dagaz 黎明',kw:'觉醒·突破·希望',meaning:'象征黎明和觉醒，预示黑暗过去，迎来突破和充满希望的新一天。'},
  {symbol:'ᛟ',name:'Othala 遗产',kw:'传承·家园·根基',meaning:'象征遗产和家园，提示关注根基和传承，家庭或传统带来支持。'},
  {symbol:'·',name:'Wyrd 空白符',kw:'未知·命运·空白',meaning:'象征命运和未知，提示答案尚未显现，一切皆有可能， trust the process。'}
];

let runeCurrentMode=1;
let runeDrawn=[];

function runeSetMode(m){
  runeCurrentMode=m;
  document.querySelectorAll('.rune-mode-btn').forEach(b=>b.classList.toggle('active',parseInt(b.dataset.mode)===m));
  // 更新按钮金币提示
  const cost=m*10;
  const btn=document.getElementById('runeDrawBtn');
  if(btn)btn.innerHTML='🪨 抽取符文 <span style="font-size:11px;opacity:0.85;">('+cost+'💰)</span>';
  runeReset();
}

function runeDraw(){
  const cost=runeCurrentMode*10;
  if(!bpSpendCoins(cost,'rune')){ showToast('💰 金币不足，需要'+cost+'金币'); return; }
  runeDrawn=[];
  const pool=[...RUNE_STONES];
  for(let i=0;i<runeCurrentMode;i++){
    const idx=Math.floor(Math.random()*pool.length);
    runeDrawn.push(pool.splice(idx,1)[0]);
  }
  const posLabels=runeCurrentMode===1?['今日指引']:['过去','现在','未来'];
  const runeColors=['rune-gold','rune-rose','rune-sky','rune-emerald','rune-violet','rune-orange','rune-teal'];
  // 随机打乱颜色顺序，确保单抽也有多种颜色，三抽不重复
  const shuffled=[...runeColors].sort(()=>Math.random()-0.5);
  const area=document.getElementById('runeStones');
  area.innerHTML=runeDrawn.map((r,i)=>
    '<div class="rune-stone" onclick="runeFlip(this,'+i+')" style="margin-bottom:28px;">'+
      '<div class="stone-front"><span>🪨</span></div>'+
      '<div class="stone-back '+shuffled[i % shuffled.length]+'">'+
        '<div class="rune-symbol">'+r.symbol+'</div>'+
        '<div class="rune-name">'+r.name.split(' ')[0]+'</div>'+
        '<div class="rune-pos">'+posLabels[i]+'</div>'+
      '</div>'+
    '</div>'
  ).join('');
  document.getElementById('runeInterpretation').innerHTML='';
  showToast('🪨 点击符文石翻转揭示');
}

function runeFlip(el,idx){
  if(el.classList.contains('flipped'))return;
  el.classList.add('flipped');
  const flipped=document.querySelectorAll('.rune-stone.flipped').length;
  if(flipped===runeDrawn.length){
    setTimeout(runeRenderInterpretation,500);
  }
}

function runeRenderInterpretation(){
  const posLabels=runeCurrentMode===1?['今日指引']:['过去','现在','未来'];
  let html='';
  runeDrawn.forEach((r,i)=>{
    html+='<div class="rune-interpretation">'+
      '<div class="ri-item">'+
        '<div class="ri-label">'+posLabels[i]+'</div>'+
        '<div class="ri-name"><span style="font-size:24px;margin-right:8px;">'+r.symbol+'</span>'+r.name+'</div>'+
        '<div class="ri-keywords">关键词：'+r.kw+'</div>'+
        '<div class="ri-meaning">'+r.meaning+'</div>'+
      '</div>'+
    '</div>';
  });
  document.getElementById('runeInterpretation').innerHTML=html;
  // 保存到背包收藏
  const savedRunes=lsGet('backpack_runes',[]);
  runeDrawn.forEach((r,i)=>{
    savedRunes.unshift({
      id:r.name+'_'+Date.now()+'_'+i,
      symbol:r.symbol, name:r.name, kw:r.kw, meaning:r.meaning,
      pos:posLabels[i], mode:runeCurrentMode, time:Date.now()
    });
  });
  lsSet('backpack_runes',savedRunes.slice(0,200));
}

function runeReset(){
  runeDrawn=[];
  document.getElementById('runeStones').innerHTML='<div style="color:var(--text-placeholder);font-size:13px;text-align:center;padding:40px 0;">点击"抽取符文"后，点击符文石翻转</div>';
  document.getElementById('runeInterpretation').innerHTML='';
}

// 符文占卜专属样式按需随符文模块加载。
(function installRuneStyles(){
  if(document.getElementById('flRuneStyles'))return;
  /* Styles moved to css/toolbox-55-符文占卜.css. */
})();
