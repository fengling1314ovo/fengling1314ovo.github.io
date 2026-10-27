/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageCrystalballPage", "<!-- pageCrystalballPage -->\n<div class=\"tool-page\" id=\"pageCrystalballPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🔮 水晶球占卜</h3>\n      <p style=\"text-align:center;font-size:13px;color:var(--text-secondary);margin:8px 0 16px;\">凝视水晶球，心中默念问题，等待启示浮现</p>\n      <div style=\"max-width:400px;margin:0 auto;\">\n        <label>你的问题（可选）</label>\n        <input type=\"text\" id=\"crystalballQuestion\" placeholder=\"例如：我最近适合换工作吗？\" style=\"margin-bottom:12px;\">\n        <div style=\"text-align:center;\">\n          <div id=\"crystalball\" style=\"font-size:80px;margin-bottom:16px;min-height:100px;\">🔮</div>\n          <button class=\"common-btn btn-primary\" onclick=\"crystalballGaze()\">🔮 凝视水晶球 <span style=\"font-size:11px;opacity:0.85;\">(10💰)</span></button>\n          <button class=\"common-btn\" onclick=\"crystalballReset()\">🔄 重新凝视</button>\n        </div>\n      </div>\n      <div id=\"crystalballResult\" style=\"margin-top:20px;\"></div>\n    </div>\n  </div>");
// ==================== 水晶球占卜 ====================
const CRYSTAL_VISIONS=[
  {icon:'🌅',title:'曙光初现',text:'你所期待的事情即将迎来新的转机，黑暗正在过去，光明就在前方。保持希望，继续前行，你会看到曙光。',action:'今天做一件让自己充满希望的事。'},
  {icon:'🌊',title:'海浪起伏',text:'你的情绪和生活正在经历一些起伏，这是正常的。像大海一样包容一切，波动之后会恢复平静。不要被暂时的起伏影响判断。',action:'今天花10分钟静坐，让内心平静下来。'},
  {icon:'🔥',title:'火焰燃烧',text:'你的热情和能量正在燃烧，这是采取行动的好时机。像火焰一样充满活力，去追求你想要的目标，但也要注意不要灼伤自己。',action:'今天为你的目标采取一个具体行动。'},
  {icon:'🌙',title:'月光如水',text:'你的直觉和潜意识正在增强，夜晚会有特别的灵感。相信你的直觉，它会指引你做出正确的决定。有些答案需要在安静中寻找。',action:'今天在睡前记录下你的直觉和感悟。'},
  {icon:'⭐',title:'星光闪耀',text:'你是独一无二的，像星星一样闪耀。不要隐藏自己的光芒，勇敢地展示你的才华。会有人看到你的价值，给你机会。',action:'今天做一件展示你才华的事。'},
  {icon:'🌸',title:'花开满园',text:'你的努力即将开花结果，美好的事情正在发生。像花一样绽放，享受这个美好的时刻。你的付出得到了回报。',action:'今天庆祝一下你的一个小成就。'},
  {icon:'🍂',title:'落叶归根',text:'是时候放下一些东西了，旧的不去新的不来。像落叶一样，放下过去的负担，回归内心的平静。这是为新的开始做准备。',action:'今天放下一件让你纠结很久的事。'},
  {icon:'❄️',title:'冰雪覆盖',text:'现在可能有些停滞和寒冷，但这只是暂时的。像冰雪覆盖下的种子，在沉默中积蓄力量。等到春天来临，你会破土而出。',action:'今天休息一下，给自己充电。'},
  {icon:'🌈',title:'彩虹桥现',text:'风雨之后必有彩虹，你经历的困难即将过去，美好的结果正在显现。保持信心，你会看到彩虹。这是希望和承诺的象征。',action:'今天写下三个让你感恩的事。'},
  {icon:'🦋',title:'蝴蝶破茧',text:'你正在经历一次重要的蜕变，像蝴蝶破茧一样。这个过程可能有些痛苦，但蜕变之后你会变得更加美丽和自由。相信这个过程。',action:'今天尝试一件你一直想做但不敢做的事。'},
  {icon:'🌳',title:'大树扎根',text:'你正在建立稳固的基础，像大树一样扎根。虽然表面看起来变化不大，但地下的根系正在不断扩展。这个基础会支撑你未来的发展。',action:'今天为你的长期目标做一件基础工作。'},
  {icon:'🔮',title:'水晶启示',text:'答案就在你心中，只是你还没有看到。向内寻找，你会找到你需要的答案。水晶球只是一个媒介，真正的智慧在你自己心里。',action:'今天问自己一个问题，然后倾听内心的答案。'}
];
function crystalballGaze(){
  if(!bpSpendCoins(10,'crystalball')){ showToast('💰 金币不足，需要10金币'); return; }
  const question=document.getElementById('crystalballQuestion').value.trim();
  const vision=CRYSTAL_VISIONS[Math.floor(Math.random()*CRYSTAL_VISIONS.length)];
  const ball=document.getElementById('crystalball');
  ball.style.animation='none';
  setTimeout(()=>{ball.style.animation='crystalGlow 2s ease-in-out infinite';},10);
  let count=0;
  const icons=['✨','💫','🌟','⚡','🔮'];
  const interval=setInterval(()=>{
    ball.textContent=icons[Math.floor(Math.random()*icons.length)];
    count++;
    if(count>=8){
      clearInterval(interval);
      ball.textContent=vision.icon;
      document.getElementById('crystalballResult').innerHTML=
        '<div class="crystalball-result">'+
          (question?'<div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;">你问：「'+question+'」</div>':'')+
          '<div class="crystal-message">'+
            '<div class="cm-title">'+vision.icon+' '+vision.title+'</div>'+
            '<div class="cm-text">'+vision.text+'</div>'+
            '<div class="cm-action">✨ '+vision.action+'</div>'+
          '</div>'+
        '</div>';
    }
  },150);
}
function crystalballReset(){
  document.getElementById('crystalballQuestion').value='';
  document.getElementById('crystalball').textContent='🔮';
  document.getElementById('crystalballResult').innerHTML='';
}


/* ===== 百宝箱功能分段 ===== */

// 工具专属样式按需随对应模块加载。
(function installToolStyles(){
  if(document.getElementById('flCrystalballStyles'))return;
  /* Styles moved to css/toolbox-75-水晶球占卜.css. */
})();
