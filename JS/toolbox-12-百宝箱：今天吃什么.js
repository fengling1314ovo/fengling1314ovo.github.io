/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageEatPage", "<!-- pageEatPage -->\n<div class=\"tool-page\" id=\"pageEatPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🍔 今天吃什么</h3>\n      <button class=\"common-btn\" onclick=\"randomFood()\">🍽 随机选择美食</button>\n      <button class=\"common-btn\" onclick=\"copyFoodResult()\">📋 复制结果</button>\n      <div id=\"foodResult\" style=\"margin-top:12px;font-size:20px;font-weight:bold;min-height:28px;\"></div>\n      <div class=\"custom-list-area\">\n        <h4 style=\"font-size:14px;color:var(--text-secondary);margin:16px 0 8px;\">🍴 自定义美食列表</h4>\n        <div class=\"custom-input-row\">\n          <input id=\"foodInput\" placeholder=\"输入美食名称，回车添加\" onkeydown=\"if(event.key==='Enter')addFood()\">\n          <button class=\"common-btn\" onclick=\"addFood()\">添加</button>\n        </div>\n        <div class=\"custom-tags\" id=\"foodTags\"></div>\n      </div>\n    </div>\n  </div>");
// ==================== 百宝箱：今天吃什么 ====================
const foodResultEl=document.getElementById('foodResult'), foodInputEl=document.getElementById('foodInput'), foodTagsEl=document.getElementById('foodTags');
const DEFAULT_FOODS=['火锅','烧烤','奶茶','麻辣烫','炸鸡','汉堡','螺蛳粉','米线','炒饭','披萨','寿司','牛肉面','小龙虾','饺子','冒菜','烤肉','盖浇饭','馄饨'];
let foodList=lsGet('food_list',DEFAULT_FOODS);
function renderFoodTags(){
  if(!foodList.length){ foodTagsEl.innerHTML='<span class="recent-empty">列表为空，请添加美食</span>'; return; }
  foodTagsEl.innerHTML=foodList.map((f,i)=>`<span class="custom-tag">${f}<span class="tag-del" onclick="removeFood(${i})">×</span></span>`).join('');
}
renderFoodTags();
function addFood(){
  const v=foodInputEl.value.trim();
  if(!v){ showToast('请输入美食名称'); return; }
  if(foodList.includes(v)){ showToast('已存在该美食'); return; }
  foodList.push(v); lsSet('food_list',foodList); renderFoodTags(); foodInputEl.value='';
  showToast('已添加：'+v);
}
function removeFood(i){ foodList.splice(i,1); lsSet('food_list',foodList); renderFoodTags(); }
let foodRolling=false;
function randomFood(){
  if(foodRolling)return;
  if(!foodList.length){ showToast('美食列表为空，请先添加'); return; }
  foodRolling=true; let ticks=0;
  const anim=setInterval(()=>{
    foodResultEl.textContent='🍽 '+foodList[Math.floor(Math.random()*foodList.length)];
    ticks++; if(ticks>=10){ clearInterval(anim);
      const pick=foodList[Math.floor(Math.random()*foodList.length)];
      foodResultEl.textContent='🍽 就吃：'+pick; foodRolling=false; showToast('就决定是：'+pick);
    }
  },70);
}
function copyFoodResult(){ if(!foodResultEl.textContent){ showToast('暂无结果'); return; } copyText(foodResultEl.textContent).then(ok=>showToast(ok?'已复制':'复制失败')); }

