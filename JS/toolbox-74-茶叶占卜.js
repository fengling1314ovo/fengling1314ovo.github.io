(function(){
  if(document.getElementById('flTealeafStyles')) return;
  /* Styles moved to css/toolbox-74-茶叶占卜.css. */
})();
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageTealeafPage", "<!-- pageTealeafPage -->\n<div class=\"tool-page\" id=\"pageTealeafPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🍵 茶叶占卜</h3>\n      <p style=\"text-align:center;font-size:13px;color:var(--text-secondary);margin:8px 0 16px;\">喝完茶后，观察茶杯底茶叶的形状</p>\n      <div style=\"text-align:center;margin:20px 0;\">\n        <div id=\"teacup\" style=\"font-size:80px;margin-bottom:16px;min-height:100px;\">🍵</div>\n        <button class=\"common-btn btn-primary\" onclick=\"tealeafRead()\">🍵 倒茶看相 <span style=\"font-size:11px;opacity:0.85;\">(10💰)</span></button>\n        <button class=\"common-btn\" onclick=\"tealeafReset()\">🔄 再泡一杯</button>\n      </div>\n      <div id=\"tealeafResult\" style=\"margin-top:20px;\"></div>\n    </div>\n  </div>");
// ==================== 茶叶占卜 ====================
const TEALEAF_PATTERNS=[
  {icon:'❤️',name:'心形',meaning:'爱情和感情即将来临，或当前的感情会有好的发展。单身者可能会遇到心仪的对象，有伴侣者感情会更加甜蜜。'},
  {icon:'⭐',name:'星形',meaning:'希望和梦想即将实现，你所期待的事情会有好的结果。保持信心，继续努力，幸运之星正在照耀着你。'},
  {icon:'🌙',name:'月形',meaning:'直觉和潜意识增强，你会有一些灵感和预感。相信你的直觉，它会指引你做出正确的决定。夜晚可能会有特别的感悟。'},
  {icon:'☀️',name:'日形',meaning:'成功和快乐即将到来，运势旺盛，一切都会向好的方向发展。这是非常吉祥的图案，预示着光明的未来。'},
  {icon:'🌳',name:'树形',meaning:'成长和稳定，你的事业或生活会稳步发展，根基越来越稳固。像树一样扎根生长，最终会开花结果。'},
  {icon:'🏔️',name:'山形',meaning:'眼前有一些障碍和挑战，需要付出努力才能克服。但只要坚持不懈，最终会登上山顶，看到更美的风景。'},
  {icon:'🌊',name:'波浪形',meaning:'情绪有些起伏，生活可能会有一些波动。保持内心的平静，像大海一样包容一切，波动之后会恢复平静。'},
  {icon:'🔑',name:'钥匙形',meaning:'找到了解决问题的关键，困扰你的事情即将有答案。把握这个关键，打开新的大门，机会就在眼前。'},
  {icon:'💍',name:'环形',meaning:'圆满和完成，一个重要的阶段即将圆满结束。可能会有承诺或契约，比如订婚、结婚、合作协议等。'},
  {icon:'🐦',name:'鸟形',meaning:'消息和自由，可能会收到远方的消息，或者有出行的机会。像鸟一样自由飞翔，放下束缚，去追求你想要的生活。'},
  {icon:'🐍',name:'蛇形',meaning:'智慧和转变，你会经历一次重要的转变，像蛇蜕皮一样获得新生。运用你的智慧，处理好眼前的复杂局面。'},
  {icon:'🐢',name:'龟形',meaning:'长寿和稳定，慢慢来比较快。不要急于求成，像乌龟一样稳步前进，虽然慢但最终会到达目标。健康方面也会很好。'},
  {icon:'🦋',name:'蝶形',meaning:'蜕变和美丽，你正在经历一次美丽的蜕变，从内到外都会有积极的变化。破茧成蝶，展现你最美的一面。'},
  {icon:'🌸',name:'花形',meaning:'美好和绽放，你的生活将会充满美好和快乐。像花一样绽放，展示你的魅力，会有很多人欣赏你。'},
  {icon:'🍀',name:'草形',meaning:'幸运和新生，好运即将降临，新的机会正在萌芽。保持积极的心态，抓住这个幸运的机会。'}
];
function tealeafRead(){
  if(!bpSpendCoins(10,'tealeaf')){ showToast('💰 金币不足，需要10金币'); return; }
  const pattern=TEALEAF_PATTERNS[Math.floor(Math.random()*TEALEAF_PATTERNS.length)];
  document.getElementById('teacup').textContent='🍵';
  setTimeout(()=>{
    document.getElementById('teacup').textContent=pattern.icon;
    document.getElementById('tealeafResult').innerHTML=
      '<div class="tealeaf-result">'+
        '<div class="teacup-pattern">'+pattern.icon+'</div>'+
        '<div class="tealeaf-name">茶叶呈现「'+pattern.name+'」</div>'+
        '<div class="tealeaf-meaning">'+pattern.meaning+'</div>'+
      '</div>';
  },800);
}
function tealeafReset(){
  document.getElementById('teacup').textContent='🍵';
  document.getElementById('tealeafResult').innerHTML='';
}

