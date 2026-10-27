/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagePinballShop", "<!-- pagePinballShop -->\n<div class=\"tool-page\" id=\"pagePinballShop\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🔮 弹珠商店</h3>\n      <div style=\"display:flex;gap:16px;justify-content:center;margin:12px 0 20px;flex-wrap:wrap;\">\n        <div style=\"background:linear-gradient(135deg,rgba(255,193,7,0.15),rgba(255,152,0,0.08));border:1px solid rgba(255,193,7,0.3);border-radius:14px;padding:10px 20px;text-align:center;\">\n          <div style=\"font-size:12px;color:var(--text-secondary);\">当前金币</div>\n          <div style=\"font-size:24px;font-weight:700;color:#f59e0b;\" id=\"shopCoins\">0</div>\n        </div>\n        <div style=\"background:linear-gradient(135deg,rgba(139,92,246,0.15),rgba(139,92,246,0.08));border:1px solid rgba(139,92,246,0.3);border-radius:14px;padding:10px 20px;text-align:center;\">\n          <div style=\"font-size:12px;color:var(--text-secondary);\">弹珠总数</div>\n          <div style=\"font-size:24px;font-weight:700;color:#8b5cf6;\" id=\"shopTotal\">0</div>\n        </div>\n      </div>\n      <p style=\"text-align:center;font-size:13px;color:var(--text-secondary);margin-bottom:16px;\">每颗弹珠 <b style=\"color:#f59e0b;\">1金币</b>，购买后可在打弹珠游戏中选择使用</p>\n      <div id=\"shopGrid\" style=\"display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;\"></div>\n    </div>\n  </div>");
// ==================== 弹珠库存与商店 ====================
function pinGetInv(){
  const def={};
  PIN_BALL_COLORS.forEach(function(c){def[c.id]=c.id==='silver'?5:2;});
  return lsGet('pinball_inventory',def);
}
function pinSaveInv(inv){lsSet('pinball_inventory',inv);}
function pinTotalBalls(){
  const inv=pinGetInv();
  return Object.values(inv).reduce(function(a,b){return a+b;},0);
}
function pinSelectedId(){return lsGet('pinball_selected','silver');}
function pinSelectBall(id){
  const inv=pinGetInv();
  if(!inv[id]||inv[id]<=0){showToast('该颜色弹珠已用完，先去商店购买吧~');return;}
  lsSet('pinball_selected',id);
  // 如果弹珠在发射通道中，同步更新颜色并重绘
  if(typeof pinBall!=='undefined'&&pinBall&&pinBall.inLauncher){
    pinBall.color=pinBallColor(id);
    if(typeof pinDraw==='function')pinDraw();
  }
  if(typeof pinRenderSelector==='function')pinRenderSelector();
  showToast('已选择'+pinBallName(id)+'弹珠');
}
function pinBallName(id){
  const c=PIN_BALL_COLORS.find(function(x){return x.id===id;});
  return c?c.name:id;
}
function pinBallColor(id){
  return PIN_BALL_COLORS.find(function(x){return x.id===id;})||PIN_BALL_COLORS[PIN_BALL_COLORS.length-1];
}
function pinBuyBall(id,count){
  count=count||1;
  if(!bpSpendCoins(count,'弹珠商店')){showToast('金币不足！');return;}
  const inv=pinGetInv();
  inv[id]=(inv[id]||0)+count;
  pinSaveInv(inv);
  pinUpdateShopUI();
  pinUpdateChestBadge();
  showToast('购买成功！+'+count+'颗'+pinBallName(id)+'弹珠');
}
function pinConsumeBall(){
  const id=pinSelectedId();
  const inv=pinGetInv();
  if(!inv[id]||inv[id]<=0)return false;
  inv[id]--;
  pinSaveInv(inv);
  if(typeof pinRenderSelector==='function')pinRenderSelector();
  return true;
}
function pinUpdateChestBadge(){
  const el=document.getElementById('pinChestCount');
  if(el)el.textContent=pinTotalBalls();
}
function pinUpdateShopUI(){
  const coinsEl=document.getElementById('shopCoins');
  const totalEl=document.getElementById('shopTotal');
  const grid=document.getElementById('shopGrid');
  if(!grid)return;
  if(coinsEl)coinsEl.textContent=bpGetCoins();
  if(totalEl)totalEl.textContent=pinTotalBalls();
  const inv=pinGetInv();
  grid.innerHTML=PIN_BALL_COLORS.map(function(c){
    const count=inv[c.id]||0;
    return '<div style="background:var(--bg-input);border:1px solid var(--border-color);border-radius:14px;padding:14px 10px;text-align:center;transition:all .2s;" onmouseover="this.style.borderColor=\''+c.mid+'\'" onmouseout="this.style.borderColor=\'var(--border-color)\'">'+
      '<div style="width:48px;height:48px;border-radius:50%;margin:0 auto 8px;background:radial-gradient(circle at 35% 30%,#fff,'+c.light+' 30%,'+c.mid+' 65%,'+c.dark+');box-shadow:0 4px 12px '+c.mid+'44;"></div>'+
      '<div style="font-size:14px;font-weight:600;margin-bottom:2px;">'+c.name+'</div>'+
      '<div style="font-size:12px;color:var(--text-secondary);margin-bottom:10px;">拥有 <b style="color:'+c.mid+';">'+count+'</b> 颗</div>'+
      '<div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">'+
        '<button class="common-btn" style="padding:5px 10px;font-size:12px;min-height:32px;" onclick="pinBuyBall(\''+c.id+'\',1)">+1</button>'+
        '<button class="common-btn" style="padding:5px 10px;font-size:12px;min-height:32px;" onclick="pinBuyBall(\''+c.id+'\',5)">+5</button>'+
        '<button class="common-btn" style="padding:5px 10px;font-size:12px;min-height:32px;" onclick="pinBuyBall(\''+c.id+'\',10)">+10</button>'+
      '</div>'+
    '</div>';
  }).join('');
}
function pinRenderSelector(){
  const container=document.getElementById('pinBallSelector');
  const nameEl=document.getElementById('pinSelectedName');
  const countEl=document.getElementById('pinSelectedCount');
  if(!container)return;
  const inv=pinGetInv();
  const selected=pinSelectedId();
  const selColor=pinBallColor(selected);
  if(nameEl)nameEl.textContent=selColor.name;
  if(countEl)countEl.textContent=inv[selected]||0;
  container.innerHTML=PIN_BALL_COLORS.filter(function(c){return (inv[c.id]||0)>0;}).map(function(c){
    const active=c.id===selected;
    return '<button onclick="pinSelectBall(\''+c.id+'\')" style="width:36px;height:36px;border-radius:50%;border:2px solid '+(active?c.mid:'var(--border-color)')+';background:radial-gradient(circle at 35% 30%,#fff,'+c.light+' 30%,'+c.mid+' 65%,'+c.dark+');cursor:pointer;transition:all .15s;position:relative;margin-bottom:18px;'+(active?'box-shadow:0 0 0 3px '+c.mid+'44;transform:scale(1.1);':'')+'" title="'+c.name+'（'+inv[c.id]+'颗）">'+
      (active?'<span style="position:absolute;top:-6px;right:-6px;background:'+c.mid+';color:#fff;font-size:9px;border-radius:8px;padding:0 4px;line-height:14px;">✓</span>':'')+
      '<span style="position:absolute;bottom:-16px;left:50%;transform:translateX(-50%);font-size:9px;color:var(--text-secondary);white-space:nowrap;">'+inv[c.id]+'</span>'+
    '</button>';
  }).join('');
  if(!inv[selected]||inv[selected]<=0){
    const first=PIN_BALL_COLORS.find(function(c){return (inv[c.id]||0)>0;});
    if(first){lsSet('pinball_selected',first.id);pinRenderSelector();}
  }
}
// 初始化库存（确保新颜色有默认值）
(function(){
  const inv=pinGetInv();
  let changed=false;
  PIN_BALL_COLORS.forEach(function(c){
    if(inv[c.id]===undefined){inv[c.id]=c.id==='silver'?5:2;changed=true;}
  });
  if(changed)pinSaveInv(inv);
})();
const PIN_GRAVITY=0.22,PIN_FRICTION=0.995,PIN_WALL_BOUNCE=0.85;
// 发射通道
const PIN_LAUNCH_X=338,PIN_LAUNCH_W=18;
// 排水口范围（底部中间）
const PIN_DRAIN_LEFT=125,PIN_DRAIN_RIGHT=215;
function pinInit(){
  pinCanvas=document.getElementById('pinCanvas');
  pinCtx=pinCanvas.getContext('2d');
  pinScore=0;pinLives=3;pinStarted=true;pinOver=false;pinCharging=false;pinPower=0;
  pinBest=lsGet('pinball_best',0);
  document.getElementById('pinScore').textContent='0';
  document.getElementById('pinLives').textContent='3';
  document.getElementById('pinBest').textContent=pinBest;
  // 弹柱
  pinBumpers=[
    {x:170,y:75,r:18,points:200,color:'#fbbf24',hit:0},
    {x:85,y:135,r:15,points:100,color:'#ef4444',hit:0},
    {x:255,y:135,r:15,points:100,color:'#3b82f6',hit:0},
    {x:60,y:200,r:13,points:50,color:'#10b981',hit:0},
    {x:170,y:180,r:16,points:150,color:'#8b5cf6',hit:0},
    {x:280,y:200,r:13,points:50,color:'#06b6d4',hit:0},
    {x:110,y:255,r:14,points:100,color:'#ec4899',hit:0},
    {x:230,y:255,r:14,points:100,color:'#eab308',hit:0},
    {x:170,y:315,r:15,points:200,color:'#f97316',hit:0},
    {x:95,y:375,r:12,points:50,color:'#22c55e',hit:0},
    {x:245,y:375,r:12,points:50,color:'#22c55e',hit:0}
  ];
  // 斜板障碍物（改变弹珠方向）
  pinObstacles=[
    {x1:30,y1:170,x2:70,y2:225,color:'#6366f1'},
    {x1:310,y1:170,x2:270,y2:225,color:'#6366f1'},
    {x1:105,y1:290,x2:148,y2:338,color:'#8b5cf6'},
    {x1:235,y1:290,x2:192,y2:338,color:'#8b5cf6'}
  ];
  // 挡板：枢轴点、长度、静止角度、激活角度（弧度，0=水平向右，正=向下）
  pinLeftFlipper={pivot:{x:85,y:455},length:62,restAngle:0.45,activeAngle:-0.45,angle:0.45,angVel:0};
  pinRightFlipper={pivot:{x:255,y:455},length:62,restAngle:Math.PI-0.45,activeAngle:Math.PI+0.45,angle:Math.PI-0.45,angVel:0};
  pinResetBall();
  pinDraw();
  pinRenderSelector();
}
function pinResetBall(){
  const c=pinBallColor(pinSelectedId());
  pinBall={x:PIN_LAUNCH_X,y:PIN_H-30,vx:0,vy:0,inLauncher:true,color:c};
}
function pinFlipperEnd(f){
  return {x:f.pivot.x+Math.cos(f.angle)*f.length,y:f.pivot.y+Math.sin(f.angle)*f.length};
}
function pinUpdateFlippers(){
  const speed=0.35;
  // 左挡板
  const leftTarget=pinLeftActive?pinLeftFlipper.activeAngle:pinLeftFlipper.restAngle;
  const leftDiff=leftTarget-pinLeftFlipper.angle;
  pinLeftFlipper.angVel=leftDiff*speed;
  pinLeftFlipper.angle+=pinLeftFlipper.angVel;
  // 右挡板
  const rightTarget=pinRightActive?pinRightFlipper.activeAngle:pinRightFlipper.restAngle;
  const rightDiff=rightTarget-pinRightFlipper.angle;
  pinRightFlipper.angVel=rightDiff*speed;
  pinRightFlipper.angle+=pinRightFlipper.angVel;
}
function pinCircleSegmentCollide(cx,cy,r,ax,ay,bx,by){
  // 返回最近点和距离平方
  const dx=bx-ax,dy=by-ay;
  const len2=dx*dx+dy*dy;
  let t=len2>0?((cx-ax)*dx+(cy-ay)*dy)/len2:0;
  t=Math.max(0,Math.min(1,t));
  const px=ax+t*dx,py=ay+t*dy;
  const ddx=cx-px,ddy=cy-py;
  return {x:px,y:py,dist2:ddx*ddx+ddy*ddy,dist:Math.sqrt(ddx*ddx+ddy*ddy)};
}
function pinUpdate(){
  if(pinOver)return;
  // 弹珠还在发射通道里时，挡板不响应（避免蓄力发射时误触挡板）
  if(pinBall.inLauncher){
    pinLeftActive=false;
    pinRightActive=false;
  }
  pinUpdateFlippers();
  // 蓄力
  if(pinCharging&&pinBall.inLauncher){
    pinPower=Math.min(100,pinPower+4);
  }
  // 重力
  pinBall.vy+=PIN_GRAVITY;
  // 摩擦
  pinBall.vx*=PIN_FRICTION;
  pinBall.vy*=PIN_FRICTION;
  // 限速
  const spd=Math.sqrt(pinBall.vx*pinBall.vx+pinBall.vy*pinBall.vy);
  if(spd>22){pinBall.vx=pinBall.vx/spd*22;pinBall.vy=pinBall.vy/spd*22;}
  pinBall.x+=pinBall.vx;
  pinBall.y+=pinBall.vy;
  // 发射通道内的弹珠
  if(pinBall.inLauncher){
    pinBall.vy-=0.17;  // 通道内抵消大部分重力，保证弹珠能顺利射出
    pinBall.x=PIN_LAUNCH_X;
    if(pinBall.x<PIN_LAUNCH_X-2)pinBall.x=PIN_LAUNCH_X;
    // 通道左右壁
    if(pinBall.x-PIN_BALL_R<PIN_LAUNCH_X-PIN_LAUNCH_W/2){
      pinBall.x=PIN_LAUNCH_X-PIN_LAUNCH_W/2+PIN_BALL_R;pinBall.vx=Math.abs(pinBall.vx)*PIN_WALL_BOUNCE;
    }
    if(pinBall.x+PIN_BALL_R>PIN_LAUNCH_X+PIN_LAUNCH_W/2){
      pinBall.x=PIN_LAUNCH_X+PIN_LAUNCH_W/2-PIN_BALL_R;pinBall.vx=-Math.abs(pinBall.vx)*PIN_WALL_BOUNCE;
    }
    // 通道底部
    if(pinBall.y+PIN_BALL_R>PIN_H-10){
      pinBall.y=PIN_H-10-PIN_BALL_R;pinBall.vy=-Math.abs(pinBall.vy)*0.3;
    }
    // 通道顶部出口（进入游戏区）
    if(pinBall.y-PIN_BALL_R<60){
      pinBall.inLauncher=false;
      pinBall.x=PIN_LAUNCH_X-PIN_LAUNCH_W/2-2-PIN_BALL_R-6;  // 放到右墙左侧，避免被弹回
      pinBall.vx=-3;
    }
    pinDraw();
    return;
  }
  // 游戏区域墙壁
  // 左墙
  if(pinBall.x-PIN_BALL_R<12){
    pinBall.x=12+PIN_BALL_R;pinBall.vx=Math.abs(pinBall.vx)*PIN_WALL_BOUNCE;
  }
  // 右墙（发射通道左壁，从y=60开始）
  if(pinBall.y>60&&pinBall.x+PIN_BALL_R>PIN_LAUNCH_X-PIN_LAUNCH_W/2-2){
    pinBall.x=PIN_LAUNCH_X-PIN_LAUNCH_W/2-2-PIN_BALL_R;
    pinBall.vx=-Math.abs(pinBall.vx)*PIN_WALL_BOUNCE;
  }
  // 右墙（画布最右，y<60时）
  if(pinBall.y<=60&&pinBall.x+PIN_BALL_R>PIN_W-12){
    pinBall.x=PIN_W-12-PIN_BALL_R;pinBall.vx=-Math.abs(pinBall.vx)*PIN_WALL_BOUNCE;
  }
  // 顶部弧形墙（简化为直线+圆角）
  if(pinBall.y-PIN_BALL_R<12){
    pinBall.y=12+PIN_BALL_R;pinBall.vy=Math.abs(pinBall.vy)*PIN_WALL_BOUNCE;
  }
  // 顶部左右斜角（引导弹珠向内）
  if(pinBall.y<60){
    // 左上角斜坡
    if(pinBall.x<60&&pinBall.y<60-pinBall.x*0.5){
      const nx=0.707,ny=0.707;
      const dot=pinBall.vx*nx+pinBall.vy*ny;
      if(dot<0){pinBall.vx-=2*dot*nx;pinBall.vy-=2*dot*ny;pinBall.vx*=PIN_WALL_BOUNCE;pinBall.vy*=PIN_WALL_BOUNCE;}
    }
  }
  // 弹柱碰撞
  pinBumpers.forEach(function(b){
    const dx=pinBall.x-b.x,dy=pinBall.y-b.y;
    const dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<b.r+PIN_BALL_R&&dist>0){
      const nx=dx/dist,ny=dy/dist;
      // 分离
      pinBall.x=b.x+nx*(b.r+PIN_BALL_R);
      pinBall.y=b.y+ny*(b.r+PIN_BALL_R);
      // 反弹（弹柱给额外推力）
      const dot=pinBall.vx*nx+pinBall.vy*ny;
      pinBall.vx=(pinBall.vx-2*dot*nx)*0.9+nx*4;
      pinBall.vy=(pinBall.vy-2*dot*ny)*0.9+ny*4;
      // 得分
      pinScore+=b.points;
      b.hit=8;
      document.getElementById('pinScore').textContent=pinScore;
    }
    if(b.hit>0)b.hit--;
  });
  // 斜板障碍物碰撞
  if(pinObstacles){
    pinObstacles.forEach(function(o){
      const hit=pinCircleSegmentCollide(pinBall.x,pinBall.y,PIN_BALL_R,o.x1,o.y1,o.x2,o.y2);
      if(hit.dist<PIN_BALL_R+4&&hit.dist>0){
        const nx=(pinBall.x-hit.x)/hit.dist,ny=(pinBall.y-hit.y)/hit.dist;
        pinBall.x=hit.x+nx*(PIN_BALL_R+4);
        pinBall.y=hit.y+ny*(PIN_BALL_R+4);
        const dot=pinBall.vx*nx+pinBall.vy*ny;
        if(dot<0){
          pinBall.vx=(pinBall.vx-2*dot*nx)*0.92;
          pinBall.vy=(pinBall.vy-2*dot*ny)*0.92;
        }
      }
    });
  }
  // 挡板碰撞
  [pinLeftFlipper,pinRightFlipper].forEach(function(f){
    const end=pinFlipperEnd(f);
    const hit=pinCircleSegmentCollide(pinBall.x,pinBall.y,PIN_BALL_R,f.pivot.x,f.pivot.y,end.x,end.y);
    if(hit.dist<PIN_BALL_R+5&&hit.dist>0){
      const nx=(pinBall.x-hit.x)/hit.dist,ny=(pinBall.y-hit.y)/hit.dist;
      // 分离
      pinBall.x=hit.x+nx*(PIN_BALL_R+5);
      pinBall.y=hit.y+ny*(PIN_BALL_R+5);
      // 反弹
      const dot=pinBall.vx*nx+pinBall.vy*ny;
      if(dot<0){
        pinBall.vx=(pinBall.vx-2*dot*nx)*0.9;
        pinBall.vy=(pinBall.vy-2*dot*ny)*0.9;
      }
      // 挡板向上运动时给弹珠额外推力
      const flipperUp=(f===pinLeftFlipper)?pinLeftActive:pinRightActive;
      if(flipperUp){
        // 给向上和向外的力
        const pushX=(f===pinLeftFlipper)?1.5:-1.5;
        pinBall.vx+=pushX;
        pinBall.vy-=7;
      }
    }
  });
  // 底部排水口两侧的斜面（引导弹珠向排水口）
  // 左斜面：从 (12, 400) 到 (PIN_DRAIN_LEFT, 470)
  if(pinBall.y>380&&pinBall.x<PIN_DRAIN_LEFT){
    const slopeY=400+(pinBall.x-12)*(70/(PIN_DRAIN_LEFT-12));
    if(pinBall.y+PIN_BALL_R>slopeY&&pinBall.y<480){
      const nx=0.45,ny=-0.89;
      const dot=pinBall.vx*nx+pinBall.vy*ny;
      if(dot>0){
        pinBall.vx-=2*dot*nx*0.8;
        pinBall.vy-=2*dot*ny*0.8;
      }
      pinBall.y=slopeY-PIN_BALL_R;
    }
  }
  // 右斜面：从 (PIN_DRAIN_RIGHT, 470) 到 (PIN_LAUNCH_X-20, 400)
  if(pinBall.y>380&&pinBall.x>PIN_DRAIN_RIGHT&&pinBall.x<PIN_LAUNCH_X-10){
    const slopeY=400+(PIN_LAUNCH_X-20-pinBall.x)*(70/(PIN_LAUNCH_X-20-PIN_DRAIN_RIGHT));
    if(pinBall.y+PIN_BALL_R>slopeY&&pinBall.y<480){
      const nx=-0.45,ny=-0.89;
      const dot=pinBall.vx*nx+pinBall.vy*ny;
      if(dot>0){
        pinBall.vx-=2*dot*nx*0.8;
        pinBall.vy-=2*dot*ny*0.8;
      }
      pinBall.y=slopeY-PIN_BALL_R;
    }
  }
  // 排水口检测（弹珠掉出底部）
  if(pinBall.y>PIN_H+20){
    pinLives--;
    document.getElementById('pinLives').textContent=pinLives;
    if(pinLives<=0){pinGameOver();return;}
    pinResetBall();
    showToast('弹珠掉落！剩余'+pinLives+'条命');
  }
  pinDraw();
}
function pinDraw(){
  const ctx=pinCtx,W=PIN_W,H=PIN_H;
  // 背景渐变
  const grad=ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0,'#0f0c29');
  grad.addColorStop(0.5,'#302b63');
  grad.addColorStop(1,'#24243e');
  ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
  // 背景网格点
  ctx.fillStyle='rgba(255,255,255,0.04)';
  for(let gx=20;gx<W-20;gx+=24){
    for(let gy=20;gy<H-20;gy+=24){
      ctx.beginPath();ctx.arc(gx,gy,1,0,Math.PI*2);ctx.fill();
    }
  }
  // 外边框装饰
  ctx.strokeStyle='rgba(255,215,0,0.25)';ctx.lineWidth=2;
  ctx.strokeRect(10,10,W-20,H-20);
  ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=1;
  ctx.strokeRect(14,14,W-28,H-28);
  // 左右侧灯带
  const leftGlow=ctx.createLinearGradient(10,0,30,0);
  leftGlow.addColorStop(0,'rgba(139,92,246,0.3)');leftGlow.addColorStop(1,'rgba(139,92,246,0)');
  ctx.fillStyle=leftGlow;ctx.fillRect(10,20,20,H-40);
  const rightGlow=ctx.createLinearGradient(W-30,0,W-10,0);
  rightGlow.addColorStop(0,'rgba(6,182,212,0)');rightGlow.addColorStop(1,'rgba(6,182,212,0.3)');
  ctx.fillStyle=rightGlow;ctx.fillRect(W-30,20,20,H-40);
  // 发射通道
  ctx.fillStyle='rgba(255,255,255,0.06)';
  ctx.fillRect(PIN_LAUNCH_X-PIN_LAUNCH_W/2,60,PIN_LAUNCH_W,H-70);
  ctx.strokeStyle='rgba(255,215,0,0.3)';ctx.lineWidth=1;
  ctx.strokeRect(PIN_LAUNCH_X-PIN_LAUNCH_W/2,60,PIN_LAUNCH_W,H-70);
  // 蓄力条
  if(pinBall.inLauncher){
    ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(PIN_LAUNCH_X-6,H-60,12,45);
    ctx.fillStyle=pinPower>70?'#ef4444':pinPower>40?'#f59e0b':'#22c55e';
    ctx.fillRect(PIN_LAUNCH_X-5,H-59-(pinPower*0.42),10,pinPower*0.42);
  }
  // 顶部弧形轨道（带灯带效果）
  ctx.strokeStyle='rgba(255,215,0,0.15)';ctx.lineWidth=8;
  ctx.beginPath();ctx.arc(W/2,5,150,Math.PI*0.12,Math.PI*0.88);ctx.stroke();
  ctx.strokeStyle='rgba(255,215,0,0.4)';ctx.lineWidth=3;
  ctx.beginPath();ctx.arc(W/2,5,150,Math.PI*0.12,Math.PI*0.88);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,0.6)';ctx.lineWidth=1;
  ctx.beginPath();ctx.arc(W/2,5,150,Math.PI*0.12,Math.PI*0.88);ctx.stroke();
  // 顶部轨道上的装饰灯珠
  const lampPositions=[0.15,0.25,0.35,0.5,0.65,0.75,0.85];
  lampPositions.forEach(function(t,i){
    const angle=Math.PI*(0.12+t*(0.88-0.12));
    const lx=W/2+Math.cos(angle)*150,ly=5+Math.sin(angle)*150;
    const colors=['#ef4444','#f59e0b','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6'];
    ctx.fillStyle=colors[i%colors.length];
    ctx.beginPath();ctx.arc(lx,ly,3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=colors[i%colors.length]+'44';
    ctx.beginPath();ctx.arc(lx,ly,6,0,Math.PI*2);ctx.fill();
  });
  // 弹柱
  pinBumpers.forEach(function(b){
    const scale=b.hit>0?1.15:1;
    const r=b.r*scale;
    // 光晕
    const glow=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,r*1.8);
    glow.addColorStop(0,b.color+'88');
    glow.addColorStop(1,b.color+'00');
    ctx.fillStyle=glow;ctx.beginPath();ctx.arc(b.x,b.y,r*1.8,0,Math.PI*2);ctx.fill();
    // 主体
    const bg=ctx.createRadialGradient(b.x-r*0.3,b.y-r*0.3,0,b.x,b.y,r);
    bg.addColorStop(0,'#fff');bg.addColorStop(0.3,b.color);bg.addColorStop(1,'#000');
    ctx.fillStyle=bg;ctx.beginPath();ctx.arc(b.x,b.y,r,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=1.5;ctx.stroke();
    // 分数标签
    ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
    ctx.fillText(b.points,b.x,b.y+3);
  });
  // 斜板障碍物
  if(pinObstacles){
    pinObstacles.forEach(function(o){
      // 发光底层
      ctx.strokeStyle=o.color+'33';ctx.lineWidth=14;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(o.x1,o.y1);ctx.lineTo(o.x2,o.y2);ctx.stroke();
      // 主体
      ctx.strokeStyle=o.color;ctx.lineWidth=7;
      ctx.beginPath();ctx.moveTo(o.x1,o.y1);ctx.lineTo(o.x2,o.y2);ctx.stroke();
      // 高光
      ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(o.x1,o.y1);ctx.lineTo(o.x2,o.y2);ctx.stroke();
      // 端点装饰
      ctx.fillStyle='#1e1b4b';
      ctx.beginPath();ctx.arc(o.x1,o.y1,4,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(o.x2,o.y2,4,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=o.color;ctx.lineWidth=1.5;
      ctx.beginPath();ctx.arc(o.x1,o.y1,4,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(o.x2,o.y2,4,0,Math.PI*2);ctx.stroke();
    });
  }
  // 底部斜面
  ctx.fillStyle='rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.moveTo(12,400);ctx.lineTo(PIN_DRAIN_LEFT,470);ctx.lineTo(PIN_DRAIN_LEFT,H);ctx.lineTo(12,H);ctx.closePath();ctx.fill();
  ctx.beginPath();
  ctx.moveTo(PIN_LAUNCH_X-20,400);ctx.lineTo(PIN_DRAIN_RIGHT,470);ctx.lineTo(PIN_DRAIN_RIGHT,H);ctx.lineTo(PIN_LAUNCH_X-20,H);ctx.closePath();ctx.fill();
  // 排水口标记
  ctx.fillStyle='rgba(239,68,68,0.3)';ctx.fillRect(PIN_DRAIN_LEFT,H-8,PIN_DRAIN_RIGHT-PIN_DRAIN_LEFT,8);
  ctx.fillStyle='#ef4444';ctx.font='bold 8px sans-serif';ctx.textAlign='center';
  ctx.fillText('DRAIN',(PIN_DRAIN_LEFT+PIN_DRAIN_RIGHT)/2,H-2);
  // 挡板
  [pinLeftFlipper,pinRightFlipper].forEach(function(f){
    const end=pinFlipperEnd(f);
    ctx.lineCap='round';ctx.lineWidth=10;
    ctx.strokeStyle=(f===pinLeftFlipper?pinLeftActive:pinRightActive)?'#fbbf24':'#6366f1';
    ctx.beginPath();ctx.moveTo(f.pivot.x,f.pivot.y);ctx.lineTo(end.x,end.y);ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(f.pivot.x,f.pivot.y);ctx.lineTo(end.x,end.y);ctx.stroke();
    // 枢轴点
    ctx.fillStyle='#334155';ctx.beginPath();ctx.arc(f.pivot.x,f.pivot.y,6,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=1;ctx.stroke();
  });
  // 弹珠（随机颜色）
  const bc=pinBall.color||PIN_BALL_COLORS[PIN_BALL_COLORS.length-1];
  const ballGrad=ctx.createRadialGradient(pinBall.x-3,pinBall.y-3,0,pinBall.x,pinBall.y,PIN_BALL_R);
  ballGrad.addColorStop(0,'#fff');ballGrad.addColorStop(0.3,bc.light);ballGrad.addColorStop(0.65,bc.mid);ballGrad.addColorStop(1,bc.dark);
  ctx.fillStyle=ballGrad;ctx.beginPath();ctx.arc(pinBall.x,pinBall.y,PIN_BALL_R,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.6)';ctx.lineWidth=1;ctx.stroke();
  // 游戏结束遮罩
  if(pinOver){
    ctx.fillStyle='rgba(0,0,0,0.75)';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 26px sans-serif';ctx.textAlign='center';
    ctx.fillText('游戏结束',W/2,H/2-20);
    ctx.font='16px sans-serif';ctx.fillText('得分 '+pinScore,W/2,H/2+10);
    if(pinScore>=pinBest&&pinScore>0){ctx.fillStyle='#fbbf24';ctx.font='bold 14px sans-serif';ctx.fillText('🏆 新纪录！',W/2,H/2+34);}
  }
  // 等待发射提示
  if(pinBall.inLauncher&&!pinOver&&!pinCharging){
    ctx.fillStyle='rgba(255,255,255,0.7)';ctx.font='11px sans-serif';ctx.textAlign='center';
    ctx.fillText('按住发射按钮蓄力',W/2,H/2);
  }
}
function pinChargeStart(){
  if(pinOver||!pinBall.inLauncher)return;
  pinCharging=true;pinPower=0;
}
function pinChargeEnd(){
  if(!pinCharging)return;
  pinCharging=false;
  if(pinBall.inLauncher&&pinPower>5){
    // 消耗一颗选中颜色的弹珠
    if(!pinConsumeBall()){
      showToast('弹珠用完啦！去弹珠商店购买吧~');
      pinPower=0;
      return;
    }
    const eff=Math.max(pinPower,45);
    pinBall.vy=-eff*0.26-6;
    pinBall.vx=-2;
    pinPower=0;
  }
}
function pinLeft(active){pinLeftActive=active;}
function pinRight(active){pinRightActive=active;}
function pinStart(){
  if(pinTimer)clearInterval(pinTimer);
  pinInit();
  pinTimer=setInterval(pinUpdate,16);
}
function pinGameOver(){
  pinOver=true;pinStarted=false;clearInterval(pinTimer);
  if(pinScore>pinBest){pinBest=pinScore;lsSet('pinball_best',pinBest);document.getElementById('pinBest').textContent=pinBest;}
  pinDraw();
  const reward=Math.max(5,Math.floor(pinScore/200));
  bpAddCoins(reward,'打弹珠');
  showToast('游戏结束！得分'+pinScore+'，获得'+reward+'金币');
}
// 键盘控制
document.addEventListener('keydown',function(e){
  if(!pagePinball||pagePinball.style.display!=='block')return;
  if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A'){e.preventDefault();pinLeftActive=true;}
  if(e.key==='ArrowRight'||e.key==='d'||e.key==='D'){e.preventDefault();pinRightActive=true;}
  if(e.key===' '){e.preventDefault();if(!pinCharging)pinChargeStart();}
});
document.addEventListener('keyup',function(e){
  if(!pagePinball||pagePinball.style.display!=='block')return;
  if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A'){pinLeftActive=false;}
  if(e.key==='ArrowRight'||e.key==='d'||e.key==='D'){pinRightActive=false;}
  if(e.key===' '){pinChargeEnd();}
});
// 画布触摸控制（仅底部40%区域拦截触摸控制挡板，上60%允许页面正常滑动）
document.addEventListener('touchstart',function(e){
  if(!pagePinball||pagePinball.style.display!=='block'||pinOver)return;
  // 规则弹窗显示时不拦截触摸，避免弹窗按钮无法点击
  const pinModal=document.getElementById('pinRuleModal');
  if(pinModal&&pinModal.style.display==='flex')return;
  // 弹珠还在发射通道里时，不拦截触摸，允许页面正常滑动
  if(pinBall&&pinBall.inLauncher)return;
  const touch=e.touches[0];
  const rect=pinCanvas.getBoundingClientRect();
  if(touch.clientX<rect.left||touch.clientX>rect.right||touch.clientY<rect.top||touch.clientY>rect.bottom)return;
  // 只在画布底部40%区域才控制挡板并阻止滚动
  const relY=(touch.clientY-rect.top)/rect.height;
  if(relY<0.6)return;
  e.preventDefault();
  const relX=(touch.clientX-rect.left)/rect.width;
  if(relX<0.5)pinLeftActive=true;else pinRightActive=true;
},{passive:false});
document.addEventListener('touchend',function(e){
  if(!pagePinball||pagePinball.style.display!=='block')return;
  const pinModal=document.getElementById('pinRuleModal');
  if(pinModal&&pinModal.style.display==='flex')return;
  if(pinBall&&pinBall.inLauncher)return;
  pinLeftActive=false;pinRightActive=false;
});
// 初始化（页面加载后自动启动游戏循环，使蓄力和物理生效）
setTimeout(function(){
  pinUpdateChestBadge();
  if(document.getElementById('pinCanvas'))pinStart();
},200);


/* ===== 百宝箱功能分段 ===== */

