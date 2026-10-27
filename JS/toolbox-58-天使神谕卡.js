(function(){
  if(document.getElementById('flOracleCardStyles')) return;
  /* Styles moved to css/toolbox-58-天使神谕卡.css. */
})();
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageOraclePage", "<!-- pageOraclePage -->\n<div class=\"tool-page\" id=\"pageOraclePage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>👼 天使神谕卡</h3>\n      <p style=\"text-align:center;font-size:13px;color:var(--text-secondary);margin:8px 0 16px;\">治愈系神谕卡，聆听天使的指引</p>\n      <div style=\"text-align:center;margin:12px 0;\">\n        <button class=\"common-btn btn-primary\" onclick=\"oracleDraw()\">👼 抽取神谕卡 <span style=\"font-size:11px;opacity:0.85;\">(10💰)</span></button>\n        <button class=\"common-btn\" onclick=\"oracleReset()\">🔄 再抽一张</button>\n      </div>\n      <div id=\"oracleCardArea\" style=\"margin:20px 0;min-height:100px;\"></div>\n    </div>\n  </div>");
// ==================== 天使神谕卡 ====================
const ORACLE_CARDS=[
  {icon:'👼',name:'守护天使',kw:'你被守护着',message:'你的守护天使一直在你身边，保护着你前行的道路。无论遇到什么困难，都不是你一个人在面对。放下恐惧，相信你被深深爱着。',action:'今天可以对自己说："我是安全的，我被守护着。"'},
  {icon:'💚',name:'治愈',kw:'疗愈正在发生',message:'你正在经历一个疗愈的过程，无论是身体还是心灵。过去的伤痛正在慢慢愈合，给自己时间和耐心，不要急于求成。',action:'今天做一件让自己感到被照顾的小事。'},
  {icon:'🦁',name:'勇气',kw:'拿出勇气前进',message:'你比自己想象的更勇敢。眼前的挑战正是你展现力量的机会，不要退缩，相信自己有能力克服一切困难。',action:'今天做一件你一直想做但不敢做的小事。'},
  {icon:'🕊️',name:'平静',kw:'内心平静',message:'在喧嚣的世界中，为自己寻找一片宁静。深呼吸，让焦虑随风而去。内心的平静是你最强大的力量。',action:'今天花5分钟静坐冥想，专注呼吸。'},
  {icon:'🌈',name:'希望',kw:'保持希望',message:'风雨之后必有彩虹。即使现在看起来有些暗淡，也要相信美好的事情正在路上。希望是照亮黑夜的光。',action:'今天写下三个让你心怀希望的理由。'},
  {icon:'💗',name:'爱',kw:'爱是答案',message:'无论遇到什么问题，爱都是最终的答案。爱自己，爱他人，爱这个世界。当你心中充满爱，一切都会变得美好。',action:'今天对三个人表达你的善意和爱。'},
  {icon:'🦋',name:'转变',kw:'正在经历转变',message:'你正在经历一个重要的转变，就像毛毛虫变成蝴蝶。这个过程可能有些不适，但蜕变之后你将迎来全新的自己。',action:'今天拥抱一个变化，不管它看起来多小。'},
  {icon:'🌱',name:'新开始',kw:'新的循环开始',message:'一个全新的循环正在开启，过去的已经过去。现在是播种新种子的好时机，你想要什么未来，现在就开始创造。',action:'今天开始一个新的小习惯或新项目。'},
  {icon:'🍂',name:'放下',kw:'放下过去',message:'是时候放下那些不再服务于你的人和事了。放手不是失去，而是为新的美好腾出空间。轻装上阵，才能走得更远。',action:'今天放下一件让你纠结很久的事。'},
  {icon:'🙏',name:'感恩',kw:'感恩所拥有的',message:'感恩是吸引更多美好的磁石。当你真心感谢现在拥有的一切，宇宙会给你更多值得感恩的事物。',action:'今天写下五件你感恩的事。'},
  {icon:'🔮',name:'直觉',kw:'相信你的直觉',message:'你的直觉是天使给你的信号。那个一闪而过的念头、那种说不出的感觉，都值得你认真倾听。相信内心的声音。',action:'今天跟随一个直觉的指引行动。'},
  {icon:'⏳',name:'耐心',kw:'耐心等待',message:'好的事情需要时间发酵，不要急于求成。就像酿酒，时间越久越醇香。相信宇宙的 timing，一切都会在最合适的时候到来。',action:'今天对一件等待中的事保持耐心。'},
  {icon:'⚡',name:'行动',kw:'采取行动',message:'想法只有付诸行动才有意义。不要再犹豫和等待了，迈出第一步，哪怕很小。行动是治愈焦虑的最好良药。',action:'今天为你的目标采取一个具体行动。'},
  {icon:'😴',name:'休息',kw:'好好休息',message:'你已经很努力了，是时候停下来休息了。休息不是浪费时间，而是为了走更远的路。照顾好自己的身体和心灵。',action:'今天早点休息，保证充足的睡眠。'},
  {icon:'💬',name:'沟通',kw:'表达你的想法',message:'把你的想法和感受说出来，不要憋在心里。有效的沟通是解决问题的关键，也是建立连接的桥梁。',action:'今天和一个人进行一次真诚的对话。'},
  {icon:'🤍',name:'原谅',kw:'原谅自己和他人',message:'原谅是给自己的礼物，不是给别人的。放下怨恨和愧疚，你才能自由。每个人都在自己的认知里做到了最好。',action:'今天原谅一个人，包括你自己。'},
  {icon:'🌊',name:'接受',kw:'接受现状',message:'接受你无法改变的事情，改变你能改变的。接受现状不是放弃，而是理性看待现实后再做选择。',action:'今天接受一件你一直抗拒的事。'},
  {icon:'🎨',name:'创造',kw:'发挥创造力',message:'你天生就是创造者，不要让生活磨灭了你的想象力。用你独特的方式去表达和创造，世界需要你的礼物。',action:'今天做一件有创意的事。'},
  {icon:'🎢',name:'冒险',kw:'尝试新事物',message:'生活需要一些冒险和惊喜。走出舒适区，尝试一些你从未做过的事。你会发现自己比想象中更强大。',action:'今天尝试一件全新的事物。'},
  {icon:'🏆',name:'圆满',kw:'圆满完成',message:'恭喜你！一个重要的阶段即将圆满完成。回顾你走过的路，为自己的成长和成就感到骄傲。这是你应得的。',action:'今天庆祝一下你的一个成就。'}
];
function oracleDraw(){
  if(!bpSpendCoins(10,'oracle')){ showToast('💰 金币不足，需要10金币'); return; }
  const card=ORACLE_CARDS[Math.floor(Math.random()*ORACLE_CARDS.length)];
  const area=document.getElementById('oracleCardArea');
  area.innerHTML='<div class="oracle-card">'+
    '<div class="oc-icon">'+card.icon+'</div>'+
    '<div class="oc-name">'+card.name+'</div>'+
    '<div class="oc-keyword">「'+card.kw+'」</div>'+
    '<div class="oc-message">'+card.message+'</div>'+
    '<div class="oc-action">✨ '+card.action+'</div>'+
  '</div>';
  // 保存到背包收藏
  const savedOracle=lsGet('backpack_oracle',[]);
  savedOracle.unshift({
    id:card.name+'_'+Date.now(),
    icon:card.icon, name:card.name, kw:card.kw, message:card.message, action:card.action,
    time:Date.now()
  });
  lsSet('backpack_oracle',savedOracle.slice(0,200));
}
function oracleReset(){
  document.getElementById('oracleCardArea').innerHTML='';
}

