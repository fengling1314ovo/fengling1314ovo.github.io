/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageCapsulePage", "<!-- pageCapsulePage -->\n<div class=\"tool-page\" id=\"pageCapsulePage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3 style=\"display:flex;align-items:center;justify-content:space-between;\">🥚 扭蛋机 <button onclick=\"openCapsuleRule()\" style=\"background:var(--primary);color:#fff;border:none;padding:6px 14px;border-radius:20px;font-size:13px;cursor:pointer;font-weight:600;\">? 规则</button></h3>\n      <div class=\"fortune-today-card\" style=\"text-align:center;\">\n        <div style=\"font-size:64px;margin:12px 0;\" id=\"capsuleIcon\">🥚</div>\n        <div style=\"font-size:14px;color:var(--text-secondary);\">每次扭蛋消耗 <b style=\"color:var(--primary);\">5</b> 金币，有机会获得稀有卡牌、金币返还或道具！</div>\n        <div style=\"display:flex;gap:10px;justify-content:center;margin-top:16px;flex-wrap:wrap;\">\n          <button class=\"common-btn\" onclick=\"capsuleSpin()\">🥚 扭一次（5金币）</button>\n          <button class=\"common-btn\" onclick=\"capsuleSpin5()\">🎉 扭五次（25金币）</button>\n        </div>\n        <div style=\"margin-top:12px;font-size:13px;color:var(--text-secondary);\">当前金币：<b id=\"capsuleCoins\" style=\"color:var(--primary);\"></b></div>\n      </div>\n      <div id=\"capsuleResult\" style=\"margin-top:16px;\"></div>\n    </div>\n  </div>");
// ==================== 新增工具：扭蛋机 ====================
const CAPSULE_COST=5;
function capsuleRender(){
  const el=document.getElementById('capsuleCoins');
  if(el)el.textContent=bpGetCoins();
}
function capsuleSpinOne(){
  if(bpGetCoins()<CAPSULE_COST){showToast('金币不足！去玩小游戏赚金币吧');return null;}
  bpSpendCoins(CAPSULE_COST,'capsule');
  const r=Math.random();
  if(r<0.30){
    const rr=Math.random();
    const rarity=rr<0.03?'ssr':(rr<0.15?'sr':(rr<0.45?'r':'n'));
    const name=bpAddCard(rarity);
    const icon=BP_CARD_ICONS[rarity];
    const color=rarity==='ssr'?'#f59e0b':(rarity==='sr'?'#a855f7':(rarity==='r'?'#3b82f6':'#6b7280'));
    return '<div style="font-size:34px;">'+icon+'</div><div style="font-weight:bold;font-size:15px;color:'+color+';margin:6px 0;">稀有卡牌：'+name+'</div><div style="font-size:12px;color:var(--text-secondary);">已收入背包</div>';
  }else if(r<0.75){
    const back=Math.floor(Math.random()*4)+1;
    bpAddCoins(back,'capsule');
    return '<div style="font-size:34px;">💰</div><div style="font-weight:bold;font-size:15px;color:var(--primary);margin:6px 0;">返还金币 +'+back+'</div>';
  }else if(r<0.9){
    const item=capsuleGetRandomItem();
    bpAddItem(item.id);
    return '<div style="font-size:34px;">'+item.icon+'</div><div style="font-weight:bold;font-size:15px;color:'+item.color+';margin:6px 0;">道具：'+item.name+'</div><div style="font-size:12px;color:var(--text-secondary);">'+ITEM_RARITY_NAMES[item.rarity]+' · 已收入背包</div>';
  }else{
    return '<div style="font-size:34px;">😢</div><div style="font-weight:bold;font-size:15px;margin:6px 0;">什么都没有</div><div style="font-size:12px;color:var(--text-secondary);">下次好运！</div>';
  }
}
function capsuleSpin(){
  const res=capsuleSpinOne();
  if(res===null)return;
  document.getElementById('capsuleResult').innerHTML='<div class="quiz-result-card" style="text-align:center;">'+res+'</div>';
  capsuleRender();
  // 每日任务进度
  if(typeof updateDailyTask === 'function') updateDailyTask('daily_gacha', 1);
}
function capsuleSpin5(){
  if(bpGetCoins()<CAPSULE_COST*5){showToast('金币不足！');return;}
  const results=[];
  for(let i=0;i<5;i++){
    const r=capsuleSpinOne();
    if(r)results.push(r);
  }
  document.getElementById('capsuleResult').innerHTML='<div style="display:flex;flex-wrap:wrap;gap:10px;">'+results.map(r=>'<div class="quiz-result-card" style="flex:1 1 120px;min-width:0;text-align:center;">'+r+'</div>').join('')+'</div>';
  capsuleRender();
}

// 扭蛋机规则弹窗：由扭蛋机模块按需挂载。
(function mountCapsuleRuleModal(){
  if(!document.body)return;
  if(!document.getElementById('capsuleRuleModalStyles')){
    /* Styles moved to css/toolbox-67-新增工具：扭蛋机.css. */
  }
  if(!document.getElementById('capsuleRuleModal')){
    document.body.insertAdjacentHTML('beforeend', `<!-- 扭蛋机规则弹窗 -->
  <div class="modal-mask" id="capsuleRuleModal" style="padding:20px;box-sizing:border-box;">
    <div class="modal-box" style="background:var(--bg-card,#ffffff);border-radius:18px;padding:24px;max-width:420px;width:100%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);border:1px solid var(--border-color,#e5e7eb);">
      <div class="modal-glass-sticky-head" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <h3 style="margin:0;font-size:18px;">📖 扭蛋机道具规则</h3>
        <button class="modal-close-btn" aria-label="关闭扭蛋机规则" onclick="closeCapsuleRule()">✕</button>
      </div>
      <div style="font-size:14px;font-weight:600;margin-bottom:10px;color:var(--text,#1f2937);">🎁 8种道具效果一览</div>
      <div style="display:flex;flex-direction:column;gap:5px;">
        <div style="display:flex;align-items:center;gap:6px;padding:5px 8px;background:rgba(251,191,36,0.08);border-radius:6px;border:1px solid rgba(251,191,36,0.2);">
          <span style="font-size:14px;">🌟</span>
          <div style="flex:1;"><b style="font-size:11px;">经验药水</b><div style="font-size:10px;color:var(--text-secondary,#6b7280);">随机获得 10-30 金币</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;padding:5px 8px;background:rgba(245,158,11,0.08);border-radius:6px;border:1px solid rgba(245,158,11,0.2);">
          <span style="font-size:14px;">💰</span>
          <div style="flex:1;"><b style="font-size:11px;">金币袋</b><div style="font-size:10px;color:var(--text-secondary,#6b7280);">随机获得 10-30 金币</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;padding:5px 8px;background:rgba(34,197,94,0.08);border-radius:6px;border:1px solid rgba(34,197,94,0.2);">
          <span style="font-size:14px;">🍀</span>
          <div style="flex:1;"><b style="font-size:11px;">幸运符</b><div style="font-size:10px;color:var(--text-secondary,#6b7280);">接下来3次抽卡/扭蛋概率提升</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;padding:5px 8px;background:rgba(239,68,68,0.08);border-radius:6px;border:1px solid rgba(239,68,68,0.2);">
          <span style="font-size:14px;">🎁</span>
          <div style="flex:1;"><b style="font-size:11px;">神秘宝箱</b><div style="font-size:10px;color:var(--text-secondary,#6b7280);">随机开出金币或道具</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;padding:5px 8px;background:rgba(139,92,246,0.08);border-radius:6px;border:1px solid rgba(139,92,246,0.2);">
          <span style="font-size:14px;">📜</span>
          <div style="flex:1;"><b style="font-size:11px;">魔法卷轴</b><div style="font-size:10px;color:var(--text-secondary,#6b7280);">固定获得 50 金币</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;padding:5px 8px;background:rgba(6,182,212,0.08);border-radius:6px;border:1px solid rgba(6,182,212,0.2);">
          <span style="font-size:14px;">💎</span>
          <div style="flex:1;"><b style="font-size:11px;">能量水晶</b><div style="font-size:10px;color:var(--text-secondary,#6b7280);">随机获得 30-60 金币</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;padding:5px 8px;background:rgba(156,163,175,0.08);border-radius:6px;border:1px solid rgba(156,163,175,0.2);">
          <span style="font-size:14px;">⏳</span>
          <div style="flex:1;"><b style="font-size:11px;">时光沙漏</b><div style="font-size:10px;color:var(--text-secondary,#6b7280);">固定获得 25 金币</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;padding:5px 8px;background:rgba(245,158,11,0.12);border-radius:6px;border:1px solid rgba(245,158,11,0.3);">
          <span style="font-size:14px;">⭐</span>
          <div style="flex:1;"><b style="font-size:11px;">星星碎片</b><div style="font-size:10px;color:var(--text-secondary,#6b7280);">集齐5颗可兑换 100 金币</div></div>
        </div>
      </div>
    </div>
  </div>`);
  }
})();
