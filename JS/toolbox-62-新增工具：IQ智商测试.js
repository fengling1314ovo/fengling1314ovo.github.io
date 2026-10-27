/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageIqPage", "<!-- pageIqPage -->\n<div class=\"tool-page\" id=\"pageIqPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🧠 IQ智商测试</h3>\n      <div id=\"iqQuiz\"></div>\n      <div id=\"iqResult\" style=\"display:none;\"></div>\n    </div>\n  </div>");
// ==================== 新增工具：IQ智商测试 ====================
const IQ_QUESTIONS=[
  {q:'找规律：1, 2, 4, 8, 16, ?',opts:['24','28','32','64'],a:2},
  {q:'找规律：2, 3, 5, 8, 13, ?',opts:['18','21','22','20'],a:1},
  {q:'一个水龙头灌满浴缸要6小时，另一个要3小时，两个一起开要多久？',opts:['1.5小时','2小时','3小时','4小时'],a:1},
  {q:'哪个词和其它三个不同类？',opts:['苹果','香蕉','橘子','土豆'],a:3},
  {q:'如果所有的A都是B，有些B是C，那么？',opts:['有些A是C','所有A都是C','A和C无关','无法确定'],a:3},
  {q:'100的一半的一半是多少？',opts:['25','50','75','12.5'],a:0},
  {q:'把一根绳子对折3次后剪一刀，会分成几段？',opts:['8段','9段','7段','16段'],a:1},
  {q:'小明比小红大3岁，5年后小明比小红大几岁？',opts:['3岁','5岁','8岁','2岁'],a:0},
  {q:'下列哪个图形和其它三个不同类？',opts:['三角形','正方形','圆形','五边形'],a:2},
  {q:'如果一个钟敲6下用6秒，那么敲12下用多少秒？',opts:['12秒','11秒','13.2秒','13秒'],a:2}
];
let iqAnswers=[];
function iqRender(){
  iqAnswers=[];
  let html='';
  IQ_QUESTIONS.forEach((q,i)=>{
    html+='<div class="quiz-question">'+(i+1)+'. '+q.q+'</div><div class="quiz-options">'+
      q.opts.map((o,j)=>'<button class="quiz-option" onclick="iqAnswer('+i+','+j+',this)">'+o+'</button>').join('')+
      '</div>';
  });
  document.getElementById('iqQuiz').innerHTML=html;
  document.getElementById('iqResult').style.display='none';
}
function iqAnswer(qi,oi,btn){
  iqAnswers[qi]=oi;
  btn.parentElement.querySelectorAll('.quiz-option').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  if(iqAnswers.filter(a=>a!==undefined).length===IQ_QUESTIONS.length)setTimeout(iqShowResult,300);
}
function iqShowResult(){
  let score=0;
  IQ_QUESTIONS.forEach((q,i)=>{if(iqAnswers[i]===q.a)score++;});
  let level='',color='',desc='';
  if(score>=9){level='🧠 天才级别';color='#8b5cf6';desc='你的逻辑思维和推理能力超群，堪称人形计算器！';}
  else if(score>=7){level='👍 非常聪明';color='#3b82f6';desc='你的智力水平相当优秀，学习能力强，反应敏捷。';}
  else if(score>=5){level='😊 聪明过人';color='#10b981';desc='你的思维能力在平均水准之上，继续保持！';}
  else if(score>=3){level='🙂 中等偏上';color='#f59e0b';desc='你的智力处于正常范围，多动脑会越来越聪明。';}
  else{level='🤗 潜力无限';color='#ef4444';desc='分数仅供参考，智力有很多维度，别被数字定义！';}
  document.getElementById('iqQuiz').innerHTML='';
  document.getElementById('iqResult').style.display='block';
  document.getElementById('iqResult').innerHTML=
    '<div class="quiz-result-card">'+
    '<div style="font-size:40px;font-weight:bold;color:'+color+';">'+score+'/10</div>'+
    '<div style="font-size:18px;font-weight:bold;margin:8px 0;color:'+color+';">'+level+'</div>'+
    '<div class="qr-desc">'+desc+'</div>'+
    '<div style="margin-top:10px;font-size:12px;color:var(--text-placeholder);">※ 趣味测试仅供参考，智商包含多维度能力</div>'+
    '<button class="common-btn" style="margin-top:16px;" onclick="iqRender()">🔄 重新测试</button>'+
    '</div>';
}
iqRender();

