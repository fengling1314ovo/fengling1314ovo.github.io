/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageAstrodicePage", "<!-- pageAstrodicePage -->\n<div class=\"tool-page\" id=\"pageAstrodicePage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🎲 占星骰子</h3>\n      <p style=\"text-align:center;font-size:13px;color:var(--text-secondary);margin:8px 0 16px;\">三颗骰子：行星 · 星座 · 宫位，组合解读你的问题</p>\n      <div class=\"astrodice-area\">\n        <div class=\"astrodice-row\">\n          <div class=\"astrodice astrodice-planet\" id=\"adPlanet\">\n            <div class=\"ad-icon\">☀️</div>\n            <div class=\"ad-label\">行星</div>\n            <div class=\"ad-name\" id=\"adPlanetName\">—</div>\n          </div>\n          <div class=\"astrodice astrodice-sign\" id=\"adSign\">\n            <div class=\"ad-icon\">♈</div>\n            <div class=\"ad-label\">星座</div>\n            <div class=\"ad-name\" id=\"adSignName\">—</div>\n          </div>\n          <div class=\"astrodice astrodice-house\" id=\"adHouse\">\n            <div class=\"ad-icon\">🏠</div>\n            <div class=\"ad-label\">宫位</div>\n            <div class=\"ad-name\" id=\"adHouseName\">—</div>\n          </div>\n        </div>\n        <button class=\"common-btn btn-primary\" onclick=\"astrodiceRoll()\" id=\"adRollBtn\">🎲 掷骰子</button>\n        <button class=\"common-btn\" onclick=\"astrodiceReset()\">🔄 重置</button>\n      </div>\n      <div id=\"astrodiceResult\"></div>\n      <div class=\"history-list\" id=\"adHistory\" style=\"margin-top:16px;\">\n        <div class=\"history-empty\">暂无投掷记录</div>\n      </div>\n    </div>\n  </div>");
// ==================== 占星骰子 ====================
const AD_PLANETS=[
  {name:'太阳',icon:'☀️',kw:'自我·意志·生命力',meaning:'代表核心自我、意志力和生命力，暗示问题的核心在于展现自我和发挥创造力。'},
  {name:'月亮',icon:'🌙',kw:'情绪·直觉·潜意识',meaning:'代表情绪、直觉和内心需求，暗示需要关注内心感受和情感变化。'},
  {name:'水星',icon:'☿',kw:'沟通·思维·学习',meaning:'代表沟通、思维和信息交流，暗示问题涉及表达、学习或信息传递。'},
  {name:'金星',icon:'♀',kw:'爱情·美感·关系',meaning:'代表爱情、美感和人际关系，暗示问题与感情、审美或合作关系相关。'},
  {name:'火星',icon:'♂',kw:'行动·勇气·冲突',meaning:'代表行动力、勇气和竞争，暗示需要主动出击，但也要注意冲突。'},
  {name:'木星',icon:'♃',kw:'扩张·幸运·成长',meaning:'代表扩张、幸运和成长，暗示问题有积极发展的空间，适合拓展。'},
  {name:'土星',icon:'♄',kw:'责任·限制·成熟',meaning:'代表责任、限制和考验，暗示需要耐心和责任感，面对限制逐步成长。'},
  {name:'天王星',icon:'♅',kw:'变革·突破·自由',meaning:'代表变革、突破和自由，暗示问题会有突发变化，需要打破常规。'},
  {name:'海王星',icon:'♆',kw:'梦想·直觉·迷幻',meaning:'代表梦想、直觉和灵性，暗示问题涉及想象、灵感或需要保持清醒。'},
  {name:'冥王星',icon:'♇',kw:'转化·重生·深层',meaning:'代表转化、重生和深层力量，暗示问题涉及深刻的转变和重生。'},
  {name:'北交点',icon:'☊',kw:'方向·使命·成长',meaning:'代表人生方向和灵魂使命，暗示问题指向未来的成长方向和目标。'},
  {name:'凯龙星',icon:'⚷',kw:'疗愈·伤口·智慧',meaning:'代表疗愈和伤痛，暗示问题涉及过去的伤口，通过面对获得疗愈和智慧。'}
];
const AD_SIGNS=[
  {name:'白羊座',icon:'♈',kw:'主动·勇敢·开创',meaning:'以主动和开创的方式表达，充满勇气但可能冲动。'},
  {name:'金牛座',icon:'♉',kw:'稳定·务实·感官',meaning:'以稳定和务实的方式表达，注重物质和感官享受。'},
  {name:'双子座',icon:'♊',kw:'沟通·灵活·好奇',meaning:'以灵活多变的方式表达，注重沟通和信息交流。'},
  {name:'巨蟹座',icon:'♋',kw:'情感·保护·家庭',meaning:'以情感和关怀的方式表达，注重家庭和安全感。'},
  {name:'狮子座',icon:'♌',kw:'自信·创造·表现',meaning:'以自信和热情的方式表达，注重创造和自我展现。'},
  {name:'处女座',icon:'♍',kw:'细致·分析·服务',meaning:'以细致和分析的方式表达，注重细节和服务。'},
  {name:'天秤座',icon:'♎',kw:'平衡·和谐·合作',meaning:'以平衡和优雅的方式表达，注重关系和合作。'},
  {name:'天蝎座',icon:'♏',kw:'深刻·转化·洞察',meaning:'以深刻和强烈的方式表达，注重洞察和转化。'},
  {name:'射手座',icon:'♐',kw:'自由·乐观·探索',meaning:'以自由和乐观的方式表达，注重探索和意义。'},
  {name:'摩羯座',icon:'♑',kw:'务实·自律·成就',meaning:'以务实和自律的方式表达，注重目标和成就。'},
  {name:'水瓶座',icon:'♒',kw:'独立·创新·人道',meaning:'以独立和创新的方式表达，注重理念和群体。'},
  {name:'双鱼座',icon:'♓',kw:'敏感·共情·梦幻',meaning:'以敏感和共情的方式表达，注重想象和灵性。'}
];
const AD_HOUSES=[
  {num:1,name:'第一宫',kw:'自我·外表·人格',meaning:'关于自我认知、外在形象和个人特质的领域。'},
  {num:2,name:'第二宫',kw:'金钱·价值·物质',meaning:'关于财务、物质资源和个人价值观的领域。'},
  {num:3,name:'第三宫',kw:'沟通·学习·短途',meaning:'关于沟通、学习、兄弟姐妹和短途旅行的领域。'},
  {num:4,name:'第四宫',kw:'家庭·根基·内心',meaning:'关于家庭、根基、内心安全感和房产的领域。'},
  {num:5,name:'第五宫',kw:'恋爱·创造·娱乐',meaning:'关于恋爱、创造力、娱乐和子女的领域。'},
  {num:6,name:'第六宫',kw:'工作·健康·日常',meaning:'关于工作、健康、日常事务和服务的领域。'},
  {num:7,name:'第七宫',kw:'伴侣·合作·关系',meaning:'关于伴侣、合作关系和重要他人的领域。'},
  {num:8,name:'第八宫',kw:'转化·共享·深层',meaning:'关于转化、共享资源、亲密和深层心理的领域。'},
  {num:9,name:'第九宫',kw:'远方·哲学·高等',meaning:'关于远方、哲学、高等教育和信仰的领域。'},
  {num:10,name:'第十宫',kw:'事业·地位·成就',meaning:'关于事业、社会地位和公众成就的领域。'},
  {num:11,name:'第十一宫',kw:'朋友·群体·理想',meaning:'关于朋友、群体、社交网络和理想的领域。'},
  {num:12,name:'第十二宫',kw:'潜意识·隐秘·灵性',meaning:'关于潜意识、隐秘事务、灵性和自我超越的领域。'}
];

let adHistory=[];

function astrodiceRoll(){
  const btn=document.getElementById('adRollBtn');
  btn.disabled=true;btn.textContent='🎲 投掷中...';
  const planet=AD_PLANETS[Math.floor(Math.random()*AD_PLANETS.length)];
  const sign=AD_SIGNS[Math.floor(Math.random()*AD_SIGNS.length)];
  const house=AD_HOUSES[Math.floor(Math.random()*AD_HOUSES.length)];
  ['adPlanet','adSign','adHouse'].forEach(id=>{
    const el=document.getElementById(id);
    el.classList.remove('rolling');void el.offsetWidth;el.classList.add('rolling');
  });
  setTimeout(()=>{
    document.getElementById('adPlanetName').textContent=planet.name;
    document.getElementById('adSignName').textContent=sign.name;
    document.getElementById('adHouseName').textContent=house.num+'宫';
    document.querySelector('#adPlanet .ad-icon').textContent=planet.icon;
    document.querySelector('#adSign .ad-icon').textContent=sign.icon;
    document.querySelector('#adHouse .ad-icon').textContent='🏛️';
    const result=document.getElementById('astrodiceResult');
    result.innerHTML='<div class="astrodice-result">'+
      '<div class="ar-title">🎲 骰子组合解读</div>'+
      '<div class="ar-combo">'+planet.icon+' '+planet.name+' · '+sign.icon+' '+sign.name+' · '+house.num+'宫</div>'+
      '<div class="ar-text"><b>行星（动力）：</b>'+planet.meaning+'</div>'+
      '<div class="ar-text" style="margin-top:6px;"><b>星座（方式）：</b>'+sign.meaning+'</div>'+
      '<div class="ar-text" style="margin-top:6px;"><b>宫位（领域）：</b>'+house.meaning+'</div>'+
      '<div class="ar-text" style="margin-top:10px;padding-top:10px;border-top:1px dashed var(--border-color);"><b>综合解读：</b>你在'+house.name+'（'+house.kw+'）的领域中，以'+sign.name+'（'+sign.kw+'）的方式，展现出'+planet.name+'（'+planet.kw+'）的能量。'+planet.meaning+'</div>'+
    '</div>';
    adHistory.unshift({planet:planet.name,sign:sign.name,house:house.num,time:new Date().toLocaleTimeString()});
    if(adHistory.length>10)adHistory.pop();
    adRenderHistory();
    btn.disabled=false;btn.textContent='🎲 再掷一次';
  },700);
}

function adRenderHistory(){
  const el=document.getElementById('adHistory');
  if(adHistory.length===0){el.innerHTML='<div class="history-empty">暂无投掷记录</div>';return;}
  el.innerHTML=adHistory.map(h=>
    '<div class="h-item"><span>'+h.planet+'·'+h.sign+'·第'+h.house+'宫</span><span class="h-time">'+h.time+'</span></div>'
  ).join('');
}

function astrodiceReset(){
  document.getElementById('adPlanetName').textContent='—';
  document.getElementById('adSignName').textContent='—';
  document.getElementById('adHouseName').textContent='—';
  document.querySelector('#adPlanet .ad-icon').textContent='☀️';
  document.querySelector('#adSign .ad-icon').textContent='♈';
  document.querySelector('#adHouse .ad-icon').textContent='🏠';
  document.getElementById('astrodiceResult').innerHTML='';
  document.getElementById('adRollBtn').textContent='🎲 掷骰子';
}

