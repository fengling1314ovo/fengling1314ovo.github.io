/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagePinball", "<!-- pagePinball -->\n<div class=\"tool-page\" id=\"pagePinball\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n      <button class=\"back-btn\" style=\"margin-left:auto;background:var(--primary-bg);color:var(--primary);font-weight:600;\" onclick=\"pinShowRule()\">❓</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🔮 打弹珠</h3>\n      <div class=\"game-info\">\n        <span>分数 <b id=\"pinScore\">0</b></span>\n        <span>生命 <b id=\"pinLives\">3</b></span>\n        <span>最高分 <b id=\"pinBest\">0</b></span>\n      </div>\n      <div class=\"game-canvas-wrap\"><canvas id=\"pinCanvas\" class=\"game-canvas\" width=\"360\" height=\"520\"></canvas></div>\n      <div style=\"margin:10px 0 4px;text-align:center;\">\n        <div style=\"font-size:12px;color:var(--text-secondary);margin-bottom:6px;\">🎨 选择弹珠（当前：<b id=\"pinSelectedName\" style=\"color:var(--primary);\">经典银</b>，剩余 <b id=\"pinSelectedCount\" style=\"color:var(--primary);\">0</b> 颗）</div>\n        <div id=\"pinBallSelector\" style=\"display:flex;gap:6px;justify-content:center;flex-wrap:wrap;\"></div>\n      </div>\n      <div class=\"game-controls\">\n        <button class=\"common-btn\" id=\"pinLaunchBtn\" onmousedown=\"pinChargeStart()\" onmouseup=\"pinChargeEnd()\" ontouchstart=\"event.preventDefault();pinChargeStart()\" ontouchend=\"event.preventDefault();pinChargeEnd()\">🚀 按住发射</button>\n        <button class=\"common-btn\" onclick=\"pinStart()\">🔄 重新开始</button>\n      </div>\n      <div style=\"display:flex;gap:10px;justify-content:center;margin-top:8px;\">\n        <button class=\"common-btn\" id=\"pinLeftBtn\" onmousedown=\"pinLeft(true)\" onmouseup=\"pinLeft(false)\" ontouchstart=\"event.preventDefault();pinLeft(true)\" ontouchend=\"event.preventDefault();pinLeft(false)\" style=\"min-width:100px;\">⬅️ 左挡板</button>\n        <button class=\"common-btn\" id=\"pinRightBtn\" onmousedown=\"pinRight(true)\" onmouseup=\"pinRight(false)\" ontouchstart=\"event.preventDefault();pinRight(true)\" ontouchend=\"event.preventDefault();pinRight(false)\" style=\"min-width:100px;\">右挡板 ➡️</button>\n      </div>\n      <p class=\"game-tip\">← → 键或按钮控制挡板，按住\"发射\"蓄力后松开弹出弹珠，撞击弹柱得分</p>\n    </div>\n  </div>");
// ==================== 打弹珠 ====================
let pinCanvas,pinCtx,pinBall,pinBumpers,pinLeftFlipper,pinRightFlipper;
let pinScore,pinLives,pinTimer,pinStarted,pinOver,pinCharging,pinPower,pinBest;
let pinLeftActive=false,pinRightActive=false;
const PIN_W=360,PIN_H=520,PIN_BALL_R=8;
const PIN_BALL_COLORS=[
  {id:'red',name:'烈焰红',light:'#fca5a5',mid:'#ef4444',dark:'#991b1b'},
  {id:'orange',name:'活力橙',light:'#fdba74',mid:'#f97316',dark:'#9a3412'},
  {id:'yellow',name:'阳光黄',light:'#fde047',mid:'#eab308',dark:'#854d0e'},
  {id:'green',name:'翡翠绿',light:'#86efac',mid:'#22c55e',dark:'#166534'},
  {id:'cyan',name:'冰晶青',light:'#67e8f9',mid:'#06b6d4',dark:'#155e75'},
  {id:'blue',name:'星空蓝',light:'#93c5fd',mid:'#3b82f6',dark:'#1e40af'},
  {id:'purple',name:'梦幻紫',light:'#c4b5fd',mid:'#8b5cf6',dark:'#5b21b6'},
  {id:'pink',name:'樱花粉',light:'#f9a8d4',mid:'#ec4899',dark:'#9d174d'},
  {id:'silver',name:'经典银',light:'#ffffff',mid:'#e2e8f0',dark:'#64748b'}
];
// 打弹珠规则弹窗在首次打开时创建。
function pinEnsureRuleModal(){
  let modal=document.getElementById('pinRuleModal');
  if(modal)return modal;
  document.body.insertAdjacentHTML('beforeend', `
<div class="modal-mask" id="pinRuleModal" style="padding:20px;box-sizing:border-box;" onclick="if(event.target===this)pinHideRule()">
    <div class="pin-rule-card" style="background:var(--bg-card,#ffffff);border-radius:18px;padding:24px;max-width:420px;width:100%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);border:1px solid var(--border-color,#e5e7eb);">
      <div class="modal-glass-sticky-head" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <h3 style="margin:0;font-size:18px;">📖 打弹珠规则</h3>
        <button class="modal-close-btn" aria-label="关闭打弹珠规则" onclick="pinHideRule()">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;gap:12px;align-items:flex-start;">
          <div style="min-width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;">1</div>
          <div style="font-size:14px;line-height:1.6;padding-top:3px;">每发射一次弹珠消耗 <b style="color:#ef4444;">1颗</b> 当前选中颜色的弹珠</div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;">
          <div style="min-width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;">2</div>
          <div style="font-size:14px;line-height:1.6;padding-top:3px;">弹珠需要从<b style="color:#f59e0b;">百宝箱右上角的弹珠商店</b>购买，每颗1金币</div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;">
          <div style="min-width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;">3</div>
          <div style="font-size:14px;line-height:1.6;padding-top:3px;">可以在画布<b style="color:#8b5cf6;">下方的弹珠选择器</b>中选择需要使用哪种颜色的弹珠</div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;">
          <div style="min-width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#06b6d4,#0891b2);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;">4</div>
          <div style="font-size:14px;line-height:1.6;padding-top:3px;">开始游戏需要<b style="color:#06b6d4;">向上滑动页面</b>才能看到完整的游戏画布和控制按钮</div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;">
          <div style="min-width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;">5</div>
          <div style="font-size:14px;line-height:1.6;padding-top:3px;">如果画布区域无法上滑，可以尝试<b style="color:#22c55e;">滑动左右两边的空白部分</b>来滚动页面</div>
        </div>
      </div>
      <div style="margin-top:20px;padding:12px;background:rgba(139,92,246,0.08);border-radius:10px;font-size:12px;color:var(--text-secondary,#6b7280);line-height:1.6;">
        💡 小提示：撞击不同颜色的弹柱可获得 50~200 分不等，游戏结束后按得分获得金币奖励～
      </div>
    </div>
  </div>
`);
  modal=document.getElementById('pinRuleModal');
  if(!modal)throw new Error('打弹珠规则弹窗创建失败');
  return modal;
}
function pinShowRule(){
  const modal=pinEnsureRuleModal();
  modal.classList.remove('closing');
  modal.style.display='flex';
  document.body.style.overflow='hidden';
}
function pinHideRule(){
  const modal=document.getElementById('pinRuleModal');
  if(modal)closeModalAnimated(modal);
}
