/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageTypingPage", "<!-- pageTypingPage -->\n<div class=\"tool-page\" id=\"pageTypingPage\">\n  <div class=\"tool-header\">\n    <button class=\"back-btn\" id=\"tyBackBtn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n  </div>\n  <div class=\"breadcrumb\"></div>\n  <div class=\"common-block\" style=\"padding:0 28px 32px\">\n    <!-- 课程选择视图 -->\n    <div id=\"tyCourseView\">\n      <h3>⌨️ 打字通</h3>\n      <p style=\"font-size:13px;color:var(--text-placeholder);margin:8px 0 16px;\">从键位到文章，循序渐进提升打字速度与正确率</p>\n      <div class=\"ty-course-grid\" id=\"tyCourseGrid\"></div>\n    </div>\n    <!-- 关卡选择视图 -->\n    <div id=\"tyLevelView\" style=\"display:none;\">\n      <h3 id=\"tyLevelTitle\" style=\"margin:0 0 14px;\">课程</h3>\n      <div class=\"ty-level-list\" id=\"tyLevelList\"></div>\n    </div>\n    <!-- 练习视图 -->\n    <div id=\"tyPracticeView\" style=\"display:none;\" onclick=\"document.getElementById('tyHiddenInput').focus()\">\n      <input type=\"text\" id=\"tyHiddenInput\" style=\"position:fixed;opacity:0;width:1px;height:1px;top:0;left:0;border:none;padding:0;\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n      <div class=\"ty-practice-header\">\n        <div class=\"ty-practice-title\" id=\"tyPracticeTitle\">练习</div>\n        <div class=\"ty-stats\">\n          <span class=\"stat-item\">速度 <span class=\"stat-val\" id=\"tySpeed\">0</span>/分</span>\n          <span class=\"stat-item\">正确率 <span class=\"stat-val\" id=\"tyAcc\">100</span>%</span>\n          <span class=\"stat-item\">进度 <span class=\"stat-val\" id=\"tyProgress\">0</span>%</span>\n        </div>\n      </div>\n      <div class=\"ty-text-display\" id=\"tyTextDisplay\"></div>\n      <div class=\"ty-keyboard\" id=\"tyKeyboard\"></div>\n      <div class=\"ty-finger-guide\" id=\"tyFingerGuide\"></div>\n      <div class=\"game-controls\" style=\"margin-top:14px;\">\n        <button class=\"common-btn\" onclick=\"tyRestart()\">🔄 重新开始</button>\n        <button class=\"common-btn\" onclick=\"tyBackToLevels()\">📋 关卡列表</button>\n      </div>\n      <p style=\"text-align:center;font-size:13px;color:var(--text-placeholder);margin-top:8px;\">直接用键盘输入，屏幕键盘会高亮提示当前应按的键；退格可修正</p>\n    </div>\n  </div>\n</div>");
// ==================== 3. 打字通 typing ====================
// 手指分区映射
const TY_FINGER_MAP = {
  '`':'lpinky','1':'lpinky','q':'lpinky','a':'lpinky','z':'lpinky',
  '2':'lring','w':'lring','s':'lring','x':'lring',
  '3':'lmiddle','e':'lmiddle','d':'lmiddle','c':'lmiddle',
  '4':'lindex','5':'lindex','r':'lindex','t':'lindex','f':'lindex','g':'lindex','v':'lindex','b':'lindex',
  '6':'rindex','7':'rindex','y':'rindex','u':'rindex','h':'rindex','j':'rindex','n':'rindex','m':'rindex',
  '8':'rmiddle','i':'rmiddle','k':'rmiddle',',':'rmiddle',
  '9':'rring','o':'rring','l':'rring','.':'rring',
  '0':'rpinky','-':'rpinky','=':'rpinky','p':'rpinky','[':'rpinky',']':'rpinky',';':'rpinky',"'":'rpinky','/':'rpinky','\\':'rpinky',
  ' ':'thumb'
};
// 键盘布局
const TY_KEYBOARD_LAYOUT = [
  [{k:'`',w:1},{k:'1',w:1},{k:'2',w:1},{k:'3',w:1},{k:'4',w:1},{k:'5',w:1},{k:'6',w:1},{k:'7',w:1},{k:'8',w:1},{k:'9',w:1},{k:'0',w:1},{k:'-',w:1},{k:'=',w:1},{k:'Backspace',w:2,label:'⌫'}],
  [{k:'Tab',w:1.5,label:'Tab'},{k:'q',w:1},{k:'w',w:1},{k:'e',w:1},{k:'r',w:1},{k:'t',w:1},{k:'y',w:1},{k:'u',w:1},{k:'i',w:1},{k:'o',w:1},{k:'p',w:1},{k:'[',w:1},{k:']',w:1},{k:'\\',w:1.5}],
  [{k:'Caps',w:1.75,label:'Caps'},{k:'a',w:1},{k:'s',w:1},{k:'d',w:1},{k:'f',w:1},{k:'g',w:1},{k:'h',w:1},{k:'j',w:1},{k:'l',w:1},{k:';',w:1},{k:"'",w:1},{k:'Enter',w:2.25,label:'Enter'}],
  [{k:'Shift',w:2.25,label:'Shift'},{k:'z',w:1},{k:'x',w:1},{k:'c',w:1},{k:'v',w:1},{k:'b',w:1},{k:'n',w:1},{k:'m',w:1},{k:',',w:1},{k:'.',w:1},{k:'/',w:1},{k:'Shift',w:2.75,label:'Shift'}],
  [{k:'Ctrl',w:1.5,label:'Ctrl'},{k:'Win',w:1.5,label:'Win'},{k:'Alt',w:1.5,label:'Alt'},{k:' ',w:6,label:'Space',isSpace:true},{k:'Alt',w:1.5,label:'Alt'},{k:'Win',w:1.5,label:'Win'},{k:'Menu',w:1.5,label:'Menu'},{k:'Ctrl',w:1.5,label:'Ctrl'}]
];
// 课程数据
const TY_COURSES = [
  {id:'keys',name:'键位练习',icon:'⌨️',desc:'熟悉键盘布局，掌握正确指法',levels:[
    {name:'基准键位',desc:'asdf jkl; 双手基准键',text:'asdf jkl; asdf jkl; asdf jkl; fjdk sla; fjdk sla; asdf jkl; fjdk sla; asdf jkl; fjdk sla;'},
    {name:'上排字母',desc:'qwerty uiop 上排键位',text:'qwer tyui qwer tyui qwerty uiop qwerty uiop qwer tyui qwerty uiop; qwer tyui qwerty uiop;'},
    {name:'下排字母',desc:'zxcv bnm 下排键位',text:'zxcv bnm zxcv bnm zxcvbnm zxcvbnm zxcv bnm zxcv bnm zxcvbnm; zxcv bnm zxcvbnm;'},
    {name:'数字键位',desc:'1234567890 数字行',text:'1234 5678 1234 5678 1234567890 1234567890 1234 5678 90 1234567890; 1357 2468 0246 13579;'},
    {name:'符号键位',desc:'!@#$%^&*() 常用符号',text:'!@#$ %^&* ()!@ #$%^ &*() !@#$%^&*() @#$% ^&*! ()@# $%^& *!() @#$%^&*();'},
    {name:'大小写混合',desc:'AbCdEfG 大小写交替',text:'AbCd EfGh IjKl MnOp QrSt UvWx YzAb CdEf GhIj KlMn OpQr StUv WxYz; AbC dEf gHi jKl mNo pQr sTu vWx yZa;'},
    {name:'综合键位',desc:'全键盘字母综合练习',text:'the quick brown fox jumps over the lazy dog pack my box with five dozen liquor jugs how vexingly quick daft zebras jump sphinx of black quartz judge my vow'},
    {name:'极速盲打',desc:'随机字母快速挑战',text:'qkjm zxwp vbnr tyui asdf ghjl qwer zxcv tyui opas dfgh jklz xcvb nmqw erty uiop asdf ghjk lzxc vbnm qwer tyui op;'},
  ]},
  {id:'words',name:'单词练习',icon:'📝',desc:'常用英文单词，提升输入流畅度',levels:[
    {name:'短单词',desc:'3-4字母常用词',text:'the and for are but not you all any can had her was one our out day get has him his how man new now old see two way who boy did its let put say she too use'},
    {name:'中等单词',desc:'5-6字母常用词',text:'about after again being could every first found great house large learn never other place plant point right small sound spell still study their there these thing think three water where which world would write'},
    {name:'长单词',desc:'7字母以上进阶词',text:'another because between country develop example however include question remember sentence together understand different important knowledge beautiful wonderful experience'},
    {name:'常用动词',desc:'be have do go make 等',text:'be have do say go get make know think take see come want look use give find tell ask work seem feel leave call keep let begin seem help talk turn start show hear play run move live believe'},
    {name:'常用形容词',desc:'good big happy 等',text:'good new first last long great little own other old right big high different small large next early young important few public bad same able basic early free full hard high low open'},
    {name:'编程关键词',desc:'if else function return 等',text:'if else for while do switch case break continue return function var let const class extends new this super import export default from async await try catch throw finally typeof instanceof void delete in of'},
  ]},
  {id:'sentences',name:'句子练习',icon:'📖',desc:'完整句子，训练连贯输入',levels:[
    {name:'简单短句',desc:'日常简单英文句子',text:'I am a student. She is my friend. We go to school. He likes apples. The cat is cute. I love my family. Today is sunny. We are happy. It is a book. You are kind.'},
    {name:'中等句子',desc:'中等长度英文句子',text:'The quick brown fox jumps over the lazy dog. Practice makes perfect in every skill. Technology changes the world every single day. A journey of a thousand miles begins with one step. Knowledge is power and practice is key.'},
    {name:'中文句子',desc:'中文句子输入练习',text:'今天天气很好，适合出去走走。编程是一门需要耐心和创造力的艺术。春天来了，花儿开了，鸟儿在枝头歌唱。读书破万卷，下笔如有神。千里之行，始于足下。'},
    {name:'英文名言',desc:'经典英文名言警句',text:'Stay hungry, stay foolish. The only way to do great work is to love what you do. In the middle of difficulty lies opportunity. Life is what happens when you are busy making other plans. Be the change you wish to see in the world.'},
    {name:'古诗词',desc:'经典唐诗宋词',text:'床前明月光，疑是地上霜。举头望明月，低头思故乡。春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。白日依山尽，黄河入海流。欲穷千里目，更上一层楼。'},
    {name:'代码行',desc:'常见代码行输入',text:'const sum = a + b; function hello(){ return "world"; } if(x > 0){ y = x * 2; } for(let i=0;i<10;i++){ arr.push(i); } const obj = {name:"tom", age:18}; let result = await fetch(url);'},
  ]},
  {id:'articles',name:'文章练习',icon:'📚',desc:'长篇文章，挑战极限速度',levels:[
    {name:'短文精选',desc:'100字左右英文短文',text:'Learning to type well is a valuable skill that can save you countless hours over your lifetime. Start slowly, focus on accuracy first, and speed will come naturally with practice. Keep your fingers on the home keys and never look down at the keyboard.'},
    {name:'长文挑战',desc:'200字以上进阶文章',text:'The art of touch typing is built on muscle memory and consistent practice. When you first begin, it may feel awkward and slow, but with dedication, your fingers will learn to find the keys without conscious thought. The key is to maintain proper finger placement at all times. Each finger has its own territory on the keyboard, and respecting these boundaries ensures maximum efficiency. Over time, you will find yourself typing faster and with fewer errors. Remember that consistency matters more than speed in the early stages. So be patient, practice regularly, and watch your skills improve day by day.'},
    {name:'中文散文',desc:'经典中文散文片段',text:'燕子去了，有再来的时候；杨柳枯了，有再青的时候；桃花谢了，有再开的时候。但是，聪明的，你告诉我，我们的日子为什么一去不复返呢？是有人偷了他们罢：那是谁？又藏在何处呢？是他们自己逃走了罢：现在又到了哪里呢？'},
    {name:'技术文章',desc:'编程技术类英文文章',text:'JavaScript is a versatile programming language that powers the interactive web. Originally created in just ten days, it has evolved into one of the most widely used languages in the world. Modern JavaScript features like arrow functions, template literals, and destructuring make code cleaner and more readable. Asynchronous programming with promises and async await allows developers to handle complex workflows with ease. Whether you are building web applications, server side tools, or mobile apps, JavaScript has something to offer.'},
  ]},
  {id:'poems',name:'古诗抄写',icon:'🏮',desc:'经典古诗词，边打字边欣赏文学之美',levels:[
    {name:'咏鹅',desc:'骆宾王 · 五言古诗',text:'鹅，鹅，鹅，曲项向天歌。白毛浮绿水，红掌拨清波。'},
    {name:'静夜思',desc:'李白 · 五言绝句',text:'床前明月光，疑是地上霜。举头望明月，低头思故乡。'},
    {name:'春晓',desc:'孟浩然 · 五言绝句',text:'春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。'},
    {name:'登鹳雀楼',desc:'王之涣 · 五言绝句',text:'白日依山尽，黄河入海流。欲穷千里目，更上一层楼。'},
    {name:'悯农',desc:'李绅 · 五言绝句',text:'锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。'},
    {name:'江雪',desc:'柳宗元 · 五言绝句',text:'千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。'},
    {name:'望庐山瀑布',desc:'李白 · 七言绝句',text:'日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。'},
    {name:'绝句',desc:'杜甫 · 七言绝句',text:'两个黄鹂鸣翠柳，一行白鹭上青天。窗含西岭千秋雪，门泊东吴万里船。'},
    {name:'游子吟',desc:'孟郊 · 五言古诗',text:'慈母手中线，游子身上衣。临行密密缝，意恐迟迟归。谁言寸草心，报得三春晖。'},
    {name:'水调歌头',desc:'苏轼 · 宋词',text:'明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。'},
    {name:'鹿柴',desc:'王维 · 五言绝句',text:'空山不见人，但闻人语响。返景入深林，复照青苔上。'},
    {name:'咏柳',desc:'贺知章 · 七言绝句',text:'碧玉妆成一树高，万条垂下绿丝绦。不知细叶谁裁出，二月春风似剪刀。'},
    {name:'回乡偶书',desc:'贺知章 · 七言绝句',text:'少小离家老大回，乡音无改鬓毛衰。儿童相见不相识，笑问客从何处来。'},
    {name:'出塞',desc:'王昌龄 · 七言绝句',text:'秦时明月汉时关，万里长征人未还。但使龙城飞将在，不教胡马度阴山。'},
    {name:'九月九日忆山东兄弟',desc:'王维 · 七言绝句',text:'独在异乡为异客，每逢佳节倍思亲。遥知兄弟登高处，遍插茱萸少一人。'},
    {name:'望天门山',desc:'李白 · 七言绝句',text:'天门中断楚江开，碧水东流至此回。两岸青山相对出，孤帆一片日边来。'},
    {name:'早发白帝城',desc:'李白 · 七言绝句',text:'朝辞白帝彩云间，千里江陵一日还。两岸猿声啼不住，轻舟已过万重山。'},
    {name:'赠汪伦',desc:'李白 · 七言绝句',text:'李白乘舟将欲行，忽闻岸上踏歌声。桃花潭水深千尺，不及汪伦送我情。'},
    {name:'山行',desc:'杜牧 · 七言绝句',text:'远上寒山石径斜，白云生处有人家。停车坐爱枫林晚，霜叶红于二月花。'},
    {name:'清明',desc:'杜牧 · 七言绝句',text:'清明时节雨纷纷，路上行人欲断魂。借问酒家何处有，牧童遥指杏花村。'},
    {name:'枫桥夜泊',desc:'张继 · 七言绝句',text:'月落乌啼霜满天，江枫渔火对愁眠。姑苏城外寒山寺，夜半钟声到客船。'},
    {name:'题西林壁',desc:'苏轼 · 七言绝句',text:'横看成岭侧成峰，远近高低各不同。不识庐山真面目，只缘身在此山中。'},
    {name:'饮湖上初晴后雨',desc:'苏轼 · 七言绝句',text:'水光潋滟晴方好，山色空蒙雨亦奇。欲把西湖比西子，淡妆浓抹总相宜。'},
    {name:'春夜喜雨',desc:'杜甫 · 五言律诗',text:'好雨知时节，当春乃发生。随风潜入夜，润物细无声。野径云俱黑，江船火独明。晓看红湿处，花重锦官城。'},
  ]}
];
// 状态
let tyCurrentCourse = null, tyCurrentLevel = 0, tyText = '', tyPos = 0, tyCorrectCount = 0, tyTotalTyped = 0, tyStartTime = 0, tyProgress = {}, tyInputBound = false, tyLastInputLen = 0;

function tyLoadProgress() {
  try { const s = localStorage.getItem('typingProgress'); tyProgress = s ? JSON.parse(s) : {}; } catch(e) { tyProgress = {}; }
}
function tySaveProgress() {
  try { localStorage.setItem('typingProgress', JSON.stringify(tyProgress)); } catch(e) {}
}
function tyRenderCourses() {
  const grid = document.getElementById('tyCourseGrid');
  grid.innerHTML = TY_COURSES.map(c => {
    const total = c.levels.length, done = c.levels.filter((_,i) => tyProgress[c.id+'_'+i]).length, pct = Math.round(done/total*100);
    return '<div class="ty-course-card" onclick="tySelectCourse(\''+c.id+'\')"><div class="icon">'+c.icon+'</div><div class="name">'+c.name+'</div><div class="desc">'+c.desc+'</div><div class="progress"><div class="progress-bar" style="width:'+pct+'%"></div></div></div>';
  }).join('');
}
function tySelectCourse(courseId) {
  tyCurrentCourse = TY_COURSES.find(c => c.id === courseId);
  document.getElementById('tyLevelTitle').textContent = tyCurrentCourse.icon + ' ' + tyCurrentCourse.name;
  tyRenderLevels();
  tyShowView('level');
}
function tyRenderLevels() {
  const list = document.getElementById('tyLevelList');
  list.innerHTML = tyCurrentCourse.levels.map((lv, i) => {
    const key = tyCurrentCourse.id+'_'+i, done = tyProgress[key];
    const locked = i > 0 && !tyProgress[tyCurrentCourse.id+'_'+(i-1)];
    const stars = done ? (done.acc >= 95 ? '⭐⭐⭐' : done.acc >= 85 ? '⭐⭐' : '⭐') : '';
    const desc = lv.desc + (done ? ' · 最高 '+done.speed+'字/分 '+done.acc+'%' : '');
    return '<div class="ty-level-item '+(locked?'locked':'')+'" onclick="'+(locked?'':'tyStartLevel('+i+')')+'"><div class="lv-num">'+(locked?'🔒':i+1)+'</div><div class="lv-info"><div class="lv-name">'+lv.name+'</div><div class="lv-desc">'+desc+'</div></div><div class="lv-stars">'+stars+'</div></div>';
  }).join('');
}
function tyStartLevel(levelIdx) {
  tyCurrentLevel = levelIdx;
  const lv = tyCurrentCourse.levels[levelIdx];
  tyText = lv.text; tyPos = 0; tyCorrectCount = 0; tyTotalTyped = 0; tyStartTime = Date.now(); tyLastInputLen = 0;
  document.getElementById('tyPracticeTitle').textContent = tyCurrentCourse.name+' - '+lv.name;
  const input = document.getElementById('tyHiddenInput');
  if (input) { input.value = ''; setTimeout(() => input.focus(), 50); }
  tyRenderText(); tyRenderKeyboard(); tyRenderFingerGuide(); tyUpdateStats();
  tyShowView('practice');
}
function tyRenderText() {
  const display = document.getElementById('tyTextDisplay');
  display.innerHTML = tyText.split('').map((ch, i) => {
    let cls = 'pending';
    if (i === tyPos) cls = 'current';
    const show = ch === ' ' ? '&nbsp;' : ch;
    return '<span class="char '+cls+'" data-idx="'+i+'">'+show+'</span>';
  }).join('');
}
function tyRenderKeyboard() {
  const kb = document.getElementById('tyKeyboard');
  kb.innerHTML = TY_KEYBOARD_LAYOUT.map(row => {
    return '<div class="ty-kb-row">'+row.map(key => {
      const finger = TY_FINGER_MAP[key.k.toLowerCase()] || '';
      const label = key.label || key.k;
      let wc = '';
      if (key.isSpace) wc = 'space';
      else if (key.w >= 2) wc = 'xwide';
      else if (key.w >= 1.5) wc = 'wide';
      return '<div class="ty-kb-key f-'+finger+' '+wc+'" data-key="'+key.k.toLowerCase()+'">'+label+'</div>';
    }).join('')+'</div>';
  }).join('');
  tyHighlightCurrentKey();
}
function tyHighlightCurrentKey() {
  document.querySelectorAll('.ty-kb-key').forEach(k => k.classList.remove('active'));
  if (tyPos >= tyText.length) return;
  const ch = tyText[tyPos].toLowerCase();
  const el = document.querySelector('.ty-kb-key[data-key="'+ch+'"]');
  if (el) el.classList.add('active');
}
function tyRenderFingerGuide() {
  const guide = document.getElementById('tyFingerGuide');
  const fingers = [
    {n:'左手小指',c:'#f9a8d4'},{n:'左手无名指',c:'#93c5fd'},{n:'左手中指',c:'#6ee7b7'},{n:'左手食指',c:'#fdba74'},
    {n:'右手食指',c:'#fde047'},{n:'右手中指',c:'#c4b5fd'},{n:'右手无名指',c:'#fca5a5'},{n:'右手小指',c:'#d1d5db'}
  ];
  guide.innerHTML = fingers.map(f => '<div class="fg-item"><div class="fg-dot" style="background:'+f.c+'"></div>'+f.n+'</div>').join('');
}
function tyOnInput() {
  if (document.getElementById('tyPracticeView').style.display === 'none') return;
  const input = document.getElementById('tyHiddenInput');
  if (!input) return;
  let val = input.value;
  // 防止输入超过目标文本长度
  if (val.length > tyText.length) {
    val = val.substring(0, tyText.length);
    input.value = val;
  }
  // 累计总输入字符数（只算新增的，退格不重复计）
  if (val.length > tyLastInputLen) {
    tyTotalTyped += val.length - tyLastInputLen;
  }
  tyLastInputLen = val.length;
  tyPos = val.length;
  // 逐字符比对并更新显示
  let correct = 0;
  const spans = document.querySelectorAll('#tyTextDisplay .char');
  for (let i = 0; i < tyText.length; i++) {
    const sp = spans[i];
    if (!sp) continue;
    if (i < val.length) {
      if (val[i] === tyText[i]) { sp.className = 'char correct'; correct++; }
      else sp.className = 'char wrong';
    } else if (i === val.length) {
      sp.className = 'char current';
    } else {
      sp.className = 'char pending';
    }
  }
  tyCorrectCount = correct;
  tyHighlightCurrentKey();
  tyUpdateStats();
  if (val.length >= tyText.length) tyFinish();
}
function tyUpdateStats() {
  const minutes = (Date.now() - tyStartTime) / 60000;
  const speed = minutes > 0 ? Math.round(tyPos / minutes) : 0;
  const acc = tyTotalTyped > 0 ? Math.round(tyCorrectCount / tyTotalTyped * 100) : 100;
  const progress = Math.round(tyPos / tyText.length * 100);
  document.getElementById('tySpeed').textContent = speed;
  document.getElementById('tyAcc').textContent = acc;
  document.getElementById('tyProgress').textContent = progress;
}
function tyFinish() {
  const minutes = Math.max((Date.now() - tyStartTime) / 60000, 0.01);
  const speed = Math.round(tyText.length / minutes);
  const acc = Math.round(tyCorrectCount / tyTotalTyped * 100);
  const key = tyCurrentCourse.id+'_'+tyCurrentLevel;
  const prev = tyProgress[key];
  if (!prev || speed > prev.speed) { tyProgress[key] = { speed, acc }; tySaveProgress(); }
  // 完成关卡奖励1314金币（任意模式任意关卡，每次完成都奖励）
  if (typeof bpAddCoins === 'function') bpAddCoins(1314, 'typing');
  tyShowResult(speed, acc);
}
function tyShowResult(speed, acc) {
  const stars = acc >= 95 ? '⭐⭐⭐' : acc >= 85 ? '⭐⭐' : '⭐';
  const ov = document.createElement('div');
  ov.className = 'ty-result-overlay'; ov.id = 'tyResultOverlay';
  const hasNext = tyCurrentLevel < tyCurrentCourse.levels.length - 1;
  ov.innerHTML = '<div class="ty-result-card"><button class="ty-result-close" onclick="tyCloseResult()" title="关闭">✕</button><div class="result-icon">🎉</div><div class="result-title">练习完成！</div><div style="font-size:24px;margin:8px 0;">'+stars+'</div><div style="background:linear-gradient(135deg,#fef3c7,#fde68a);border:1px solid #f59e0b;border-radius:12px;padding:10px 16px;margin:10px 0;display:flex;align-items:center;justify-content:center;gap:8px;"><span style="font-size:20px;">💰</span><span style="font-weight:700;color:#92400e;font-size:16px;">+1314 金币</span></div><div class="ty-result-stats"><div class="rs-item"><div class="rs-val">'+speed+'</div><div class="rs-label">速度 (字/分)</div></div><div class="rs-item"><div class="rs-val">'+acc+'%</div><div class="rs-label">正确率</div></div></div><div style="display:flex;gap:10px;justify-content:center;margin-top:8px;"><button class="common-btn" onclick="tyRestart()">🔄 再来一次</button>'+(hasNext?'<button class="common-btn" onclick="tyNextLevel()">➡️ 下一关</button>':'')+'</div><button class="common-btn" style="margin-top:10px;width:100%;" onclick="tyBackToLevels()">📋 关卡列表</button></div>';
  document.body.appendChild(ov);
}
function tyCloseResult() {
  tyBackToLevels();
}
function tyDismissResult(afterClose){
  const overlay = document.getElementById('tyResultOverlay');
  if(!overlay){afterClose();return;}
  if(overlay.classList.contains('closing'))return;
  overlay.classList.add('closing');
  setTimeout(()=>{overlay.remove();afterClose();},200);
}
function tyNextLevel() {
  tyDismissResult(()=>{
    if (tyCurrentLevel < tyCurrentCourse.levels.length - 1) tyStartLevel(tyCurrentLevel + 1);
    else { tyBackToLevels(); if (typeof showToast === 'function') showToast('🎉 已完成本课程全部关卡！'); }
  });
}
function tyRestart() {
  tyDismissResult(()=>tyStartLevel(tyCurrentLevel));
}
function tyBackToLevels() {
  tyDismissResult(()=>{
    tyRenderLevels();
    tyShowView('level');
  });
}
function tyBackToCourses() {
  tyRenderCourses();
  tyShowView('course');
}
function tyUpdateCrumb(view) {
  const crumb = document.getElementById('tyCrumb');
  if (!crumb) return;
  if (view === 'course') {
    crumb.innerHTML = '<span class="current">打字通</span>';
  } else if (view === 'level') {
    crumb.innerHTML = '<a onclick="tyBackToCourses()">打字通</a><span class="sep">/</span><span class="current">'+tyCurrentCourse.name+'</span>';
  } else if (view === 'practice') {
    const lvName = tyCurrentCourse.levels[tyCurrentLevel].name;
    crumb.innerHTML = '<a onclick="tyBackToCourses()">打字通</a><span class="sep">/</span><a onclick="tyBackToLevels()">'+tyCurrentCourse.name+'</a><span class="sep">/</span><span class="current">'+lvName+'</span>';
  }
}
function tyUpdateBackBtn(view) {
  const btn = document.getElementById('tyBackBtn');
  if (!btn) return;
  if (view === 'course') {
    btn.innerHTML = '<span>←</span> 返回百宝箱';
    btn.onclick = function() { openPage('chestHome'); };
  } else if (view === 'level') {
    btn.innerHTML = '<span>←</span> 返回打字通';
    btn.onclick = tyBackToCourses;
  } else if (view === 'practice') {
    btn.innerHTML = '<span>←</span> 返回' + tyCurrentCourse.name;
    btn.onclick = tyBackToLevels;
  }
}
function tyShowView(view) {
  const views = {
    course: document.getElementById('tyCourseView'),
    level: document.getElementById('tyLevelView'),
    practice: document.getElementById('tyPracticeView')
  };
  Object.keys(views).forEach(k => { views[k].style.display = k === view ? '' : 'none'; });
  // 重新触发页面切换动画（跟随个性化设置）
  const activeEl = views[view];
  activeEl.style.animation = 'none';
  void activeEl.offsetWidth;
  activeEl.style.animation = '';
  tyUpdateCrumb(view);
  tyUpdateBackBtn(view);
}
function initTyping() {
  tyLoadProgress();
  tyRenderCourses();
  tyShowView('course');
  if (!tyInputBound) {
    const input = document.getElementById('tyHiddenInput');
    if (input) input.addEventListener('input', tyOnInput);
    tyInputBound = true;
  }
  // 首次打开提示
  if (!localStorage.getItem('typingTipShown')) {
    tyShowFirstTip();
  }
}
function tyShowFirstTip() {
  const ov = document.createElement('div');
  ov.className = 'ty-result-overlay'; ov.id = 'tyFirstTipOverlay';
  ov.innerHTML = '<div class="ty-result-card" style="max-width:420px;text-align:left;">' +
    '<button class="ty-result-close" onclick="tyCloseFirstTip()" title="关闭">✕</button>' +
    '<div style="text-align:center;font-size:36px;margin-bottom:8px;">💡</div>' +
    '<div class="result-title" style="margin-bottom:16px;">温馨提示</div>' +
    '<div style="font-size:14px;line-height:1.8;color:var(--text-secondary);">' +
    '<p style="margin:8px 0;">🖥️ 建议使用<b style="color:var(--text-primary);">电脑</b>来使用此工具</p>' +
    '<p style="margin:8px 0;">⌨️ 也不完全算是游戏，参考的某打字通</p>' +
    '<p style="margin:8px 0;">📱 手机版使用此工具毫无体验</p>' +
    '<p style="margin:8px 0;">💰 但是通关可获得<b style="color:#f59e0b;">大量金币</b>（每关1314金币）</p>' +
    '<p style="margin:8px 0;">⏰ 一次别玩太久哦，容易累死</p>' +
    '</div>' +
    '</div>';
  document.body.appendChild(ov);
}
function tyCloseFirstTip() {
  localStorage.setItem('typingTipShown', '1');
  const ov = document.getElementById('tyFirstTipOverlay');
  if (ov) {
    ov.classList.add('closing');
    setTimeout(() => ov.remove(), 200);
  }
}

// 游戏专属样式按需随游戏模块加载。
(function installGameStyles(){
  if(document.getElementById('flTypingStyles'))return;
  /* Styles moved to css/toolbox-94-3.-打字通-typing.css. */
})();
// 打字通结果弹窗的全站弹窗适配样式单独跟随本工具加载。
(function installTypingResultModalStyles(){
  if(document.getElementById('flTypingResultModalStyles'))return;
  /* Styles moved to css/toolbox-94-3.-打字通-typing.css. */
})();
