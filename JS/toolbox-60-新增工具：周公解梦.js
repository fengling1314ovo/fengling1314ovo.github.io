/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageDreamPage", "<!-- pageDreamPage -->\n<div class=\"tool-page\" id=\"pageDreamPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>💤 周公解梦</h3>\n      <label style=\"display:block;font-size:13px;font-weight:600;color:var(--text-secondary);margin:16px 0 8px;\">输入梦境关键词</label>\n      <input id=\"dreamInput\" placeholder=\"例如：蛇、水、掉牙、飞翔\" onkeydown=\"if(event.key==='Enter')dreamSearch()\">\n      <div style=\"text-align:center;margin-top:12px;\">\n        <button class=\"common-btn\" onclick=\"dreamSearch()\">🔍 解梦</button>\n      </div>\n      <div id=\"dreamResult\" style=\"margin-top:16px;\"></div>\n      <p style=\"text-align:center;font-size:12px;color:var(--text-placeholder);margin-top:14px;\">※ 梦境解读仅供参考娱乐</p>\n    </div>\n  </div>");
// ==================== 新增工具：周公解梦 ====================
const DREAM_MAP=[
  {k:['蛇'],t:'梦见蛇：通常象征智慧、转变或潜在的危险，也预示好运即将来临。'},
  {k:['水','大海','河','游泳'],t:'梦见水：代表财运和情绪，清水主财，浊水需留意情绪波动。'},
  {k:['掉牙','牙齿','牙'],t:'梦见掉牙：预示家人健康或近期有口舌之事，不必过分担心。'},
  {k:['飞','飞翔','天上','飞起来'],t:'梦见飞翔：象征自由和理想，预示事业将有大突破。'},
  {k:['掉','坠落','摔'],t:'梦见坠落：暗示近期压力较大，需注意放松和休息。'},
  {k:['考试','考'],t:'梦见考试：预示近期会有挑战，也代表对自我能力的检验。'},
  {k:['钱','钞票','金币','发财'],t:'梦见钱：主财运，暗示近期有进财的机会，也提醒勿贪。'},
  {k:['死人','去世','尸体','棺材'],t:'梦见死人：在传统文化中多预示转运，旧事将了结。'},
  {k:['结婚','婚礼','新娘','婚纱'],t:'梦见结婚：象征新的开始与结合，事业感情都有好消息。'},
  {k:['猫'],t:'梦见猫：代表直觉与神秘，也可能提示身边有需要提防的人。'},
  {k:['狗'],t:'梦见狗：象征忠诚与朋友，预示贵人或友人相助。'},
  {k:['龙'],t:'梦见龙：大吉之兆，预示事业腾飞、喜事临门。'},
  {k:['鱼'],t:'梦见鱼：年年有余，主财运亨通、收入增加。'},
  {k:['血','流血'],t:'梦见血：象征生命力和付出，预示付出会有回报。'},
  {k:['房子','家','搬家'],t:'梦见房子：代表内心世界，房子整洁主心安，破旧则需调整心态。'},
  {k:['被追','追','逃跑'],t:'梦见被追赶：暗示现实中有压力或逃避的事情，勇敢面对。'},
  {k:['迷路','找不到'],t:'梦见迷路：代表对未来方向感到迷茫，静下心来做规划。'},
  {k:['下雨','雨'],t:'梦见下雨：主贵人与财源，雨越大越吉利。'},
  {k:['手机','手机丢'],t:'梦见手机：代表社交与沟通，预示近期人际往来频繁。'},
  {k:['工作','上班','老板'],t:'梦见工作：反映日常压力，也暗示事业上的机遇。'}
];
function dreamSearch(){
  const kw=document.getElementById('dreamInput').value.trim();
  if(!kw){showToast('请输入梦境关键词');return;}
  const hits=DREAM_MAP.filter(d=>d.k.some(k=>kw.includes(k)));
  if(hits.length===0){
    document.getElementById('dreamResult').innerHTML='<div class="quiz-result-card"><div class="qr-desc">词库里没有找到「'+kw+'」相关的解梦，换个关键词试试，例如：蛇、水、掉牙、飞翔。</div></div>';
    return;
  }
  document.getElementById('dreamResult').innerHTML=hits.map(d=>
    '<div class="record-item" style="padding:12px;margin-bottom:8px;font-size:14px;line-height:1.7;">'+d.t+'</div>'
  ).join('');
}

