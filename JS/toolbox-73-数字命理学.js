(function(){
  if(document.getElementById('flNumerologyStyles')) return;
  /* Styles moved to css/toolbox-73-数字命理学.css. */
})();
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageNumerologyPage", "<!-- pageNumerologyPage -->\n<div class=\"tool-page\" id=\"pageNumerologyPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🔢 数字命理学</h3>\n      <p style=\"text-align:center;font-size:13px;color:var(--text-secondary);margin:8px 0 16px;\">根据出生日期计算生命数字与运势</p>\n      <div style=\"max-width:400px;margin:0 auto;\">\n        <label>你的出生日期</label>\n        <input type=\"date\" id=\"numerologyBirth\" style=\"margin-bottom:12px;\">\n        <div style=\"text-align:center;\">\n          <button class=\"common-btn btn-primary\" onclick=\"numerologyCalculate()\">🔢 开始计算 <span style=\"font-size:11px;opacity:0.85;\">(10💰)</span></button>\n        </div>\n      </div>\n      <div id=\"numerologyResult\" style=\"margin-top:20px;\"></div>\n    </div>\n  </div>");
// ==================== 数字命理学 ====================
const NUMEROLOGY_MEANINGS={
  1:{name:'领袖数',kw:'独立·领导·创新',meaning:'你是天生的领导者，具有独立、创新和进取的精神。你不喜欢被约束，喜欢按照自己的方式做事。适合从事需要独立决策和开创性的工作，比如企业家、管理者、创业者。要注意不要过于自我中心，学会倾听他人的意见。'},
  2:{name:'平衡数',kw:'合作·敏感·温和',meaning:'你是天生的合作者，具有温和、敏感和善于协调的特质。你喜欢和谐的环境，善于处理人际关系。适合从事需要合作和协调的工作，比如外交官、顾问、人力资源、心理咨询。要注意不要过于依赖他人，学会独立做决定。'},
  3:{name:'表达数',kw:'创意·沟通·乐观',meaning:'你是天生的表达者，具有创意、沟通和乐观的特质。你喜欢表达自己，善于社交，充满活力。适合从事需要创意和表达的工作，比如作家、演员、设计师、教师、营销。要注意不要过于分散精力，学会专注和坚持。'},
  4:{name:'稳定数',kw:'踏实·秩序·勤奋',meaning:'你是天生的建设者，具有踏实、有秩序和勤奋的特质。你做事认真负责，注重细节和规则。适合从事需要稳定和秩序的工作，比如工程师、会计师、建筑师、公务员。要注意不要过于固执，学会灵活变通和接受变化。'},
  5:{name:'自由数',kw:'自由·冒险·多变',meaning:'你是天生的自由追求者，具有热爱自由、冒险和多变的特质。你不喜欢被束缚，喜欢尝试新事物，适应能力强。适合从事需要自由和变化的工作，比如旅行家、记者、销售、自由职业者。要注意不要过于浮躁，学会坚持和承担责任。'},
  6:{name:'关爱数',kw:'责任·关怀·和谐',meaning:'你是天生的照顾者，具有责任感、关怀和追求和谐的特质。你重视家庭和感情，乐于帮助他人。适合从事需要关怀和服务的工作，比如护士、教师、社工、厨师、家庭主妇。要注意不要过于牺牲自己，学会关爱自己。'},
  7:{name:'智慧数',kw:'分析·内省·神秘',meaning:'你是天生的思考者，具有分析、内省和追求真理的特质。你喜欢深入思考，追求知识和智慧。适合从事需要研究和分析的工作，比如科学家、研究员、哲学家、心理学家、程序员。要注意不要过于孤僻，学会与人交流和分享。'},
  8:{name:'财富数',kw:'权力·财富·效率',meaning:'你是天生的事业家，具有追求权力、财富和效率的特质。你有商业头脑，善于管理和组织，目标明确。适合从事商业和管理工作，比如企业家、金融家、高管、律师。要注意不要过于追求物质，学会平衡工作和生活。'},
  9:{name:'博爱数',kw:'慈悲·理想·奉献',meaning:'你是天生的人道主义者，具有慈悲、理想主义和奉献的特质。你关心他人，追求普世价值，有艺术天赋。适合从事需要奉献和创意的工作，比如艺术家、慈善家、医生、志愿者、作家。要注意不要过于理想化，学会脚踏实地。'}
};
function numerologyCalculate(){
  if(!bpSpendCoins(10,'numerology')){ showToast('💰 金币不足，需要10金币'); return; }
  const birth=document.getElementById('numerologyBirth').value;
  if(!birth){ showToast('请先选择出生日期'); return; }
  const [y,m,d]=birth.split('-').map(Number);
  // 计算生命数字：生日所有数字相加，直到个位数
  const sumDigits=(n)=>String(n).split('').reduce((a,b)=>a+Number(b),0);
  let lifePath=sumDigits(y)+sumDigits(m)+sumDigits(d);
  while(lifePath>9)lifePath=sumDigits(lifePath);
  // 计算个人年：当年数字+生日月+生日日
  const now=new Date();
  let personalYear=sumDigits(now.getFullYear())+sumDigits(m)+sumDigits(d);
  while(personalYear>9)personalYear=sumDigits(personalYear);
  const lp=NUMEROLOGY_MEANINGS[lifePath];
  const py=NUMEROLOGY_MEANINGS[personalYear];
  document.getElementById('numerologyResult').innerHTML=
    '<div class="numerology-result">'+
      '<div class="num-card">'+
        '<div class="num-value">'+lifePath+'</div>'+
        '<div class="num-name">生命数字 · '+lp.name+'</div>'+
        '<div class="num-keywords">'+lp.kw+'</div>'+
        '<div class="num-meaning">'+lp.meaning+'</div>'+
      '</div>'+
      '<div class="num-card">'+
        '<div class="num-value">'+personalYear+'</div>'+
        '<div class="num-name">'+now.getFullYear()+'年个人年 · '+py.name+'</div>'+
        '<div class="num-keywords">'+py.kw+'</div>'+
        '<div class="num-meaning">'+py.meaning+'</div>'+
      '</div>'+
    '</div>';
}

