/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageWheelPage", "<!-- pageWheelPage -->\n<div class=\"tool-page\" id=\"pageWheelPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🎡 幸运转盘</h3>\n      <div style=\"font-size:13px;color:var(--text-secondary);margin-bottom:16px;\">选择你想要的转盘，每次抽奖消耗对应金币~</div>\n      <div style=\"display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px;margin-top:16px;\">\n        <div onclick=\"openPage('coinWheelPage')\" style=\"background:#fff;border-radius:16px;padding:20px 12px;text-align:center;cursor:pointer;box-shadow:0 2px 12px rgba(0,0,0,0.08);border:2px solid transparent;transition:all 0.2s;\" onmouseover=\"this.style.borderColor='rgba(245,158,11,0.4)';this.style.transform='translateY(-2px)'\" onmouseout=\"this.style.borderColor='transparent';this.style.transform='translateY(0)'\">\n          <div style=\"font-size:36px;margin-bottom:8px;\">💰</div>\n          <div style=\"font-size:15px;font-weight:600;color:#333;margin-bottom:4px;\">金币转盘</div>\n          <div style=\"font-size:11px;color:#999;\">免费抽金币</div>\n        </div>\n        <div onclick=\"openPage('itemWheelPage')\" style=\"background:#fff;border-radius:16px;padding:20px 12px;text-align:center;cursor:pointer;box-shadow:0 2px 12px rgba(0,0,0,0.08);border:2px solid transparent;transition:all 0.2s;\" onmouseover=\"this.style.borderColor='rgba(139,92,246,0.4)';this.style.transform='translateY(-2px)'\" onmouseout=\"this.style.borderColor='transparent';this.style.transform='translateY(0)'\">\n          <div style=\"font-size:36px;margin-bottom:8px;\">🎁</div>\n          <div style=\"font-size:15px;font-weight:600;color:#333;margin-bottom:4px;\">道具转盘</div>\n          <div style=\"font-size:11px;color:#999;\">10金币抽道具</div>\n        </div>\n        <div onclick=\"openPage('cardWheelPage')\" style=\"background:#fff;border-radius:16px;padding:20px 12px;text-align:center;cursor:pointer;box-shadow:0 2px 12px rgba(0,0,0,0.08);border:2px solid transparent;transition:all 0.2s;\" onmouseover=\"this.style.borderColor='rgba(59,130,246,0.4)';this.style.transform='translateY(-2px)'\" onmouseout=\"this.style.borderColor='transparent';this.style.transform='translateY(0)'\">\n          <div style=\"font-size:36px;margin-bottom:8px;\">🎴</div>\n          <div style=\"font-size:15px;font-weight:600;color:#333;margin-bottom:4px;\">卡牌转盘</div>\n          <div style=\"font-size:11px;color:#999;\">15金币抽卡牌</div>\n        </div>\n        <div onclick=\"openPage('pinballWheelPage')\" style=\"background:#fff;border-radius:16px;padding:20px 12px;text-align:center;cursor:pointer;box-shadow:0 2px 12px rgba(0,0,0,0.08);border:2px solid transparent;transition:all 0.2s;\" onmouseover=\"this.style.borderColor='rgba(239,68,68,0.4)';this.style.transform='translateY(-2px)'\" onmouseout=\"this.style.borderColor='transparent';this.style.transform='translateY(0)'\">\n          <div style=\"font-size:36px;margin-bottom:8px;\">🔮</div>\n          <div style=\"font-size:15px;font-weight:600;color:#333;margin-bottom:4px;\">弹珠转盘</div>\n          <div style=\"font-size:11px;color:#999;\">8金币抽弹珠</div>\n        </div>\n      </div>\n    </div>\n  </div>");
window.flRegisterToolPage("pageCoinWheelPage", "<!-- pageCoinWheelPage -->\n<div class=\"tool-page\" id=\"pageCoinWheelPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('wheelPage')\"><span>←</span> 返回转盘</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>💰 金币转盘</h3>\n      <div style=\"text-align:center;margin:16px 0;\">\n        <div id=\"coinWheelWrap\" style=\"display:inline-block;position:relative;\">\n          <canvas id=\"coinWheelCanvas\" width=\"500\" height=\"500\" style=\"width:320px;height:320px;\"></canvas>\n          <div style=\"position:absolute;top:-8px;left:50%;transform:translateX(-50%);font-size:32px;z-index:2;\">📍</div>\n        </div>\n      </div>\n      <div style=\"text-align:center;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;\">\n        <button class=\"common-btn btn-primary\" onclick=\"spinWheel('coin','single')\">🎯 免费单抽</button>\n        <button class=\"common-btn btn-primary\" onclick=\"spinWheel('coin','batch')\">🎊 免费十连</button>\n        <button class=\"common-btn btn-primary\" onclick=\"spinWheel('coin','huge')\">💥 免费百连</button>\n      </div>\n      <div id=\"coinWheelResult\" style=\"margin-top:12px;text-align:center;font-size:15px;font-weight:600;min-height:24px;\"></div>\n      <div style=\"text-align:center;margin-top:8px;font-size:13px;color:var(--text-secondary);\">当前金币：<b id=\"coinWheelCoins\" style=\"color:var(--primary);\"></b></div>\n    </div>\n  </div>");
window.flRegisterToolPage("pageItemWheelPage", "<!-- pageItemWheelPage -->\n<div class=\"tool-page\" id=\"pageItemWheelPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('wheelPage')\"><span>←</span> 返回转盘</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🎁 道具转盘</h3>\n      <div style=\"text-align:center;margin:16px 0;\">\n        <div id=\"itemWheelWrap\" style=\"display:inline-block;position:relative;\">\n          <canvas id=\"itemWheelCanvas\" width=\"500\" height=\"500\" style=\"width:320px;height:320px;\"></canvas>\n          <div style=\"position:absolute;top:-8px;left:50%;transform:translateX(-50%);font-size:32px;z-index:2;\">📍</div>\n        </div>\n      </div>\n      <div style=\"text-align:center;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;\">\n        <button class=\"common-btn btn-primary\" onclick=\"spinWheel('item','single')\">🎯 单抽（2金币）</button>\n        <button class=\"common-btn btn-primary\" onclick=\"spinWheel('item','batch')\">🎊 十连抽（15金币）</button>\n      </div>\n      <div id=\"itemWheelResult\" style=\"margin-top:12px;text-align:center;font-size:15px;font-weight:600;min-height:24px;\"></div>\n      <div style=\"text-align:center;margin-top:8px;font-size:13px;color:var(--text-secondary);\">当前金币：<b id=\"itemWheelCoins\" style=\"color:var(--primary);\"></b></div>\n    </div>\n  </div>");
window.flRegisterToolPage("pageCardWheelPage", "<!-- pageCardWheelPage -->\n<div class=\"tool-page\" id=\"pageCardWheelPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('wheelPage')\"><span>←</span> 返回转盘</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🎴 卡牌转盘</h3>\n      <div style=\"text-align:center;margin:16px 0;\">\n        <div id=\"cardWheelWrap\" style=\"display:inline-block;position:relative;\">\n          <canvas id=\"cardWheelCanvas\" width=\"500\" height=\"500\" style=\"width:320px;height:320px;\"></canvas>\n          <div style=\"position:absolute;top:-8px;left:50%;transform:translateX(-50%);font-size:32px;z-index:2;\">📍</div>\n        </div>\n      </div>\n      <div style=\"text-align:center;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;\">\n        <button class=\"common-btn btn-primary\" onclick=\"spinWheel('card','single')\">🎯 单抽（2金币）</button>\n        <button class=\"common-btn btn-primary\" onclick=\"spinWheel('card','batch')\">🎊 十连抽（15金币）</button>\n      </div>\n      <div id=\"cardWheelResult\" style=\"margin-top:12px;text-align:center;font-size:15px;font-weight:600;min-height:24px;\"></div>\n      <div style=\"text-align:center;margin-top:8px;font-size:13px;color:var(--text-secondary);\">当前金币：<b id=\"cardWheelCoins\" style=\"color:var(--primary);\"></b></div>\n    </div>\n  </div>");
window.flRegisterToolPage("pagePinballWheelPage", "<!-- pagePinballWheelPage -->\n<div class=\"tool-page\" id=\"pagePinballWheelPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('wheelPage')\"><span>←</span> 返回转盘</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🔮 弹珠转盘</h3>\n      <div style=\"text-align:center;margin:16px 0;\">\n        <div id=\"pinballWheelWrap\" style=\"display:inline-block;position:relative;\">\n          <canvas id=\"pinballWheelCanvas\" width=\"500\" height=\"500\" style=\"width:320px;height:320px;\"></canvas>\n          <div style=\"position:absolute;top:-8px;left:50%;transform:translateX(-50%);font-size:32px;z-index:2;\">📍</div>\n        </div>\n      </div>\n      <div style=\"text-align:center;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;\">\n        <button class=\"common-btn btn-primary\" onclick=\"spinWheel('pinball','single')\">🎯 单抽（1金币）</button>\n        <button class=\"common-btn btn-primary\" onclick=\"spinWheel('pinball','batch')\">🎊 十连抽（8金币）</button>\n      </div>\n      <div id=\"pinballWheelResult\" style=\"margin-top:12px;text-align:center;font-size:15px;font-weight:600;min-height:24px;\"></div>\n      <div style=\"text-align:center;margin-top:8px;font-size:13px;color:var(--text-secondary);\">当前金币：<b id=\"pinballWheelCoins\" style=\"color:var(--primary);\"></b></div>\n    </div>\n  </div>");
// ==================== 新增工具：幸运转盘（多转盘版） ====================
const WHEEL_CONFIGS={
  coin:{
    canvasId:'coinWheelCanvas',resultId:'coinWheelResult',coinsId:'coinWheelCoins',
    singleCost:0,batchCost:0,batchCount:10,hugeCost:0,hugeCount:100,name:'金币转盘',
    segments:[
      {label:'+5金币',type:'coins',value:5},
      {label:'谢谢参与',type:'none',value:0},
      {label:'+10金币',type:'coins',value:10},
      {label:'再来一次',type:'respin',value:0},
      {label:'+20金币',type:'coins',value:20},
      {label:'差一点',type:'none',value:0},
      {label:'+50金币',type:'coins',value:50},
      {label:'+100金币',type:'coins',value:100}
    ],
    colors:['#f87171','#fbbf24','#4ade80','#60a5fa','#c084fc','#f472b6','#34d399','#fb923c']
  },
  item:{
    canvasId:'itemWheelCanvas',resultId:'itemWheelResult',coinsId:'itemWheelCoins',
    singleCost:2,batchCost:15,batchCount:10,name:'道具转盘',
    segments:[
      {label:'🌟经验药水',type:'item',value:'exp_potion'},
      {label:'💰金币袋',type:'item',value:'coin_bag'},
      {label:'🍀幸运符',type:'item',value:'lucky_charm'},
      {label:'谢谢参与',type:'none',value:0},
      {label:'🎁神秘宝箱',type:'item',value:'mystery_box'},
      {label:'📜魔法卷轴',type:'item',value:'magic_scroll'},
      {label:'💎能量水晶',type:'item',value:'energy_crystal'},
      {label:'⏳时光沙漏',type:'item',value:'time_hourglass'}
    ],
    colors:['#fbbf24','#f59e0b','#22c55e','#9ca3af','#ef4444','#8b5cf6','#06b6d4','#6b7280']
  },
  card:{
    canvasId:'cardWheelCanvas',resultId:'cardWheelResult',coinsId:'cardWheelCoins',
    singleCost:2,batchCost:15,batchCount:10,name:'卡牌转盘',
    segments:[
      {label:'N卡',type:'card',value:'n'},
      {label:'R卡',type:'card',value:'r'},
      {label:'SR卡',type:'card',value:'sr'},
      {label:'谢谢参与',type:'none',value:0},
      {label:'N卡×2',type:'card_multi',value:'n',count:2},
      {label:'R卡',type:'card',value:'r'},
      {label:'SSR卡',type:'card',value:'ssr'},
      {label:'再来一次',type:'respin',value:0}
    ],
    colors:['#9ca3af','#60a5fa','#c084fc','#9ca3af','#9ca3af','#60a5fa','#f59e0b','#34d399']
  },
  pinball:{
    canvasId:'pinballWheelCanvas',resultId:'pinballWheelResult',coinsId:'pinballWheelCoins',
    singleCost:1,batchCost:8,batchCount:10,name:'弹珠转盘',
    segments:[
      {label:'🔴红弹珠',type:'pinball',value:'red'},
      {label:'🟠橙弹珠',type:'pinball',value:'orange'},
      {label:'🟡黄弹珠',type:'pinball',value:'yellow'},
      {label:'谢谢参与',type:'none',value:0},
      {label:'🟢绿弹珠',type:'pinball',value:'green'},
      {label:'🔵蓝弹珠',type:'pinball',value:'blue'},
      {label:'🟣紫弹珠',type:'pinball',value:'purple'},
      {label:'⚪银弹珠×2',type:'pinball_multi',value:'silver',count:2}
    ],
    colors:['#ef4444','#f97316','#eab308','#9ca3af','#22c55e','#3b82f6','#8b5cf6','#d1d5db']
  }
};
const wheelAngles={coin:0,item:0,card:0,pinball:0};
let wheelSpinning=false;

function initWheel(type){
  const cfg=WHEEL_CONFIGS[type];
  const canvas=document.getElementById(cfg.canvasId);
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const size=500,cx=250,cy=250,r=235;
  ctx.clearRect(0,0,size,size);
  const n=cfg.segments.length;
  const step=2*Math.PI/n;
  for(let i=0;i<n;i++){
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,i*step,(i+1)*step);
    ctx.closePath();
    ctx.fillStyle=cfg.colors[i%cfg.colors.length];
    ctx.fill();
    ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.stroke();
    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(i*step+step/2);
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle='#fff';ctx.font='bold 20px sans-serif';
    ctx.shadowColor='rgba(0,0,0,0.3)';ctx.shadowBlur=4;ctx.shadowOffsetX=1;ctx.shadowOffsetY=1;
    ctx.fillText(cfg.segments[i].label,140,0);
    ctx.restore();
  }
  // 中心圆
  ctx.beginPath();ctx.arc(cx,cy,35,0,2*Math.PI);ctx.fillStyle='#fff';ctx.fill();
  ctx.strokeStyle='#e5e7eb';ctx.lineWidth=3;ctx.stroke();
  ctx.beginPath();ctx.arc(cx,cy,18,0,2*Math.PI);ctx.fillStyle='#333';ctx.fill();
}

function renderWheel(type){
  const cfg=WHEEL_CONFIGS[type];
  const el=document.getElementById(cfg.coinsId);
  if(el)el.textContent=bpGetCoins();
}

function spinWheel(type,mode){
  if(wheelSpinning)return;
  const cfg=WHEEL_CONFIGS[type];
  const isHuge=mode==='huge'&&cfg.hugeCount>1;
  const isBatch=mode==='batch'&&cfg.batchCount>1;
  const cost=isHuge?cfg.hugeCost:(isBatch?cfg.batchCost:cfg.singleCost);
  const count=isHuge?cfg.hugeCount:(isBatch?cfg.batchCount:1);
  const isMulti=isBatch||isHuge;
  if(cost>0){
    if(bpGetCoins()<cost){showToast('💰 金币不足！');return;}
    bpSpendCoins(cost,'wheel');
  }
  wheelSpinning=true;
  const resultEl=document.getElementById(cfg.resultId);
  resultEl.textContent=isHuge?'百连抽转动中...':(isBatch?'十连抽转动中...':'转盘转动中...');
  const extra=Math.floor(Math.random()*360*5)+360*6;
  wheelAngles[type]+=extra;
  const canvas=document.getElementById(cfg.canvasId);
  canvas.style.transition='transform 4.2s cubic-bezier(0.15,0.6,0.15,1)';
  canvas.style.transform='rotate('+wheelAngles[type]+'deg)';
  setTimeout(()=>{
    canvas.style.transition='';
    wheelSpinning=false;
    if(isMulti){
      // 批量抽奖：随机生成count个结果
      const results=[];
      for(let i=0;i<count;i++){
        const idx=Math.floor(Math.random()*cfg.segments.length);
        const seg=cfg.segments[idx];
        results.push(seg);
        handleWheelReward(type,seg,true);
      }
      // 显示批量结果
      showBatchResults(type,results,isHuge);
    }else{
      const norm=((wheelAngles[type]%360)+360)%360;
      const n=cfg.segments.length;
      const stepDeg=360/n;
      const idx=Math.floor((((270-norm)%360+360)%360)/stepDeg)%n;
      const seg=cfg.segments[idx];
      handleWheelReward(type,seg);
    }
    renderWheel(type);
  },4300);
}

function showBatchResults(type,results,isHuge){
  const cfg=WHEEL_CONFIGS[type];
  const resultEl=document.getElementById(cfg.resultId);
  const title=isHuge?'💥 百连抽结果统计：':'🎊 十连抽结果：';
  
  if(isHuge){
    // 百连抽：统计每种结果的数量
    const stats={};
    let totalCoins=0;
    results.forEach(seg=>{
      const key=seg.label;
      stats[key]=(stats[key]||0)+1;
      if(seg.type==='coins')totalCoins+=seg.value;
    });
    let html='<div style="margin-top:12px;"><div style="font-size:16px;font-weight:700;margin-bottom:12px;color:#333;text-align:center;">'+title+'</div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;max-height:280px;overflow-y:auto;padding:12px;background:#f9fafb;border-radius:12px;">';
    Object.entries(stats).sort((a,b)=>b[1]-a[1]).forEach(([label,count])=>{
      const seg=cfg.segments.find(s=>s.label===label);
      const isNone=seg&&seg.type==='none';
      html+='<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:'+(isNone?'#f3f4f6':'#fff')+';border-radius:10px;border:1px solid '+(isNone?'#e5e7eb':'#fde68a')+';font-size:13px;color:'+(isNone?'#6b7280':'#92400e')+';font-weight:600;">';
      html+='<span>'+label+'</span><span style="background:'+(isNone?'#d1d5db':'#fbbf24')+';color:'+(isNone?'#4b5563':'#78350f')+';padding:2px 8px;border-radius:12px;font-size:12px;font-weight:700;">×'+count+'</span>';
      html+='</div>';
    });
    html+='</div>';
    if(totalCoins>0){
      html+='<div style="margin-top:14px;font-size:16px;font-weight:700;color:#f59e0b;text-align:center;">💰 累计获得 '+totalCoins+' 金币！</div>';
    }
    html+='</div>';
    resultEl.innerHTML=html;
    showToast('💥 百连抽完成！累计获得'+totalCoins+'金币');
  }else{
    // 十连抽：逐个展示
    let html='<div style="margin-top:8px;"><div style="font-size:14px;font-weight:600;margin-bottom:8px;color:#333;">'+title+'</div><div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;">';
    results.forEach((seg,i)=>{
      let display=seg.label;
      if(seg.type==='none')display='❌ '+seg.label;
      else if(seg.type==='coins')display='💰 '+seg.label;
      html+='<span style="display:inline-block;padding:4px 8px;background:'+(seg.type==='none'?'#f3f4f6':'#fef3c7')+';border-radius:8px;font-size:11px;color:'+(seg.type==='none'?'#9ca3af':'#92400e')+';font-weight:500;">'+display+'</span>';
    });
    html+='</div></div>';
    resultEl.innerHTML=html;
    showToast('🎊 十连抽完成！');
  }
}

function handleWheelReward(type,seg,silent){
  const cfg=WHEEL_CONFIGS[type];
  const resultEl=document.getElementById(cfg.resultId);
  if(seg.type==='coins'){
    bpAddCoins(seg.value,'wheel');
    if(!silent){
      resultEl.innerHTML='🎉 恭喜获得 <span style="color:var(--primary);">'+seg.value+'</span> 金币！';
      showToast('🎉 转盘奖励 +'+seg.value+'金币');
    }
  }else if(seg.type==='item'){
    const item=bpAddItem(seg.value);
    if(!silent){
      if(item){
        resultEl.innerHTML='🎁 获得道具：<b style="color:#8b5cf6;">'+item.icon+' '+item.name+'</b>（已存入背包）';
        showToast('🎁 获得'+item.name);
      }else{
        resultEl.innerHTML='😅 道具获取失败，请重试！';
      }
    }
  }else if(seg.type==='card'||seg.type==='card_multi'){
    const count=seg.count||1;
    const rarityNames={n:'N',r:'R',sr:'SR',ssr:'SSR'};
    const cardNames={n:'普通卡牌',r:'稀有卡牌',sr:'史诗卡牌',ssr:'传说卡牌'};
    for(let i=0;i<count;i++){
      const card={id:'card_'+Date.now()+'_'+Math.random().toString(36).substr(2,5),name:cardNames[seg.value]+(count>1?' '+(i+1):''),rarity:seg.value,time:Date.now()};
      const cards=lsGet('backpack_cards',[]);cards.push(card);lsSet('backpack_cards',cards);
    }
    if(!silent){
      resultEl.innerHTML='🎴 获得 <b style="color:#3b82f6;">'+rarityNames[seg.value]+'</b> 卡牌'+(count>1?'×'+count:'')+'（已存入背包）';
      showToast('🎴 获得'+rarityNames[seg.value]+'卡牌');
    }
  }else if(seg.type==='pinball'||seg.type==='pinball_multi'){
    const count=seg.count||1;
    const colorNames={red:'红色',orange:'橙色',yellow:'黄色',green:'绿色',cyan:'青色',blue:'蓝色',purple:'紫色',pink:'粉色',silver:'银色'};
    const inv=lsGet('pinball_inventory',{});
    inv[seg.value]=(inv[seg.value]||0)+count;
    lsSet('pinball_inventory',inv);
    if(!silent){
      resultEl.innerHTML='🔮 获得 <b style="color:#ef4444;">'+colorNames[seg.value]+'</b> 弹珠×'+count+'（已存入弹珠商店）';
      showToast('🔮 获得'+colorNames[seg.value]+'弹珠×'+count);
    }
  }else if(seg.type==='respin'){
    if(!silent){
      resultEl.textContent='🍀 再来一次！';
      setTimeout(()=>spinWheel(type,'single'),700);
    }
  }else{
    if(!silent){
      resultEl.innerHTML='😅 '+seg.label+'，再接再厉！';
    }
  }
}

// 转盘在打开对应页面时初始化

