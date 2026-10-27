/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageAvatarMaker", "<!-- pageAvatarMaker -->\n<div class=\"tool-page\" id=\"pageAvatarMaker\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🇨🇳 国庆头像生成器</h3>\n      <p style=\"font-size:13px;color:var(--text-secondary);margin:0 0 16px;text-align:center;\">上传头像，选择喜欢的国庆装饰样式，一键生成专属国庆头像。</p>\n\n      <!-- 预览区域（默认显示白色底图） -->\n      <div id=\"avatarPreviewWrap\" style=\"text-align:center;margin-bottom:16px;\">\n        <div style=\"display:inline-block;padding:10px;background:var(--bg-card);border-radius:20px;border:1px solid var(--border-color);box-shadow:var(--shadow-card);\">\n          <canvas id=\"avatarCanvas\" width=\"400\" height=\"400\" style=\"width:100%;max-width:300px;border-radius:14px;display:block;\"></canvas>\n        </div>\n      </div>\n\n      <!-- 操作按钮 -->\n      <div style=\"text-align:center;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:20px;\">\n        <button class=\"common-btn\" onclick=\"document.getElementById('avatarInput').click()\" style=\"background:#3b82f6;border-color:#3b82f6;color:#fff;\">📤 上传您的头像</button>\n        <button class=\"common-btn\" onclick=\"avatarDownload()\" style=\"background:#10b981;border-color:#10b981;color:#fff;\">✨ 生成新头像</button>\n        <input type=\"file\" id=\"avatarInput\" accept=\"image/*\" style=\"display:none;\" onchange=\"avatarHandleUpload(event)\">\n      </div>\n\n      <!-- 样式选择 -->\n      <div>\n        <div style=\"font-size:14px;font-weight:600;margin-bottom:10px;text-align:center;\">🎨 选择装饰样式</div>\n        <div id=\"avatarStyleList\" style=\"display:grid;grid-template-columns:repeat(3,1fr);gap:10px;\"></div>\n      </div>\n    </div>\n  </div>");
// ==================== 国庆头像生成器 ====================
const AVATAR_STYLES = [
  { name:'国旗渐变(大)', icon:'🇨🇳', desc:'大区域红色渐变' },
  { name:'国旗渐变(小)', icon:'🇨🇳', desc:'小区域红色渐变' },
  { name:'圆形角标', icon:'🔴', desc:'右下角圆形国旗' },
  { name:'国庆快乐', icon:'🎉', desc:'底部国庆快乐横幅' },
  { name:'中国加油', icon:'💪', desc:'底部中国加油横幅' },
  { name:'无装饰', icon:'🖼️', desc:'仅裁剪为正方形' }
];
let avatarImg = null;
let avatarSelected = 0;

// 生成纯白色默认头像
function avatarDefaultImage(){
  const c = document.createElement('canvas');
  c.width = 400; c.height = 400;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0,0,400,400);
  const img = new Image();
  img.src = c.toDataURL();
  return img;
}

function avatarInit(){
  avatarRenderStyles();
  avatarImg = avatarDefaultImage();
  avatarImg.onload = function(){ avatarDraw(); };
}
if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',avatarInit); }else{ avatarInit(); }

function avatarRenderStyles(){
  const list = document.getElementById('avatarStyleList');
  if(!list) return;
  list.innerHTML = AVATAR_STYLES.map(function(s,i){
    const active = i===avatarSelected ? 'background:var(--primary);color:#fff;border-color:var(--primary);box-shadow:0 2px 8px rgba(99,102,241,0.3);' : '';
    return '<div class="avatar-style-item" data-index="'+i+'" onclick="avatarSelectStyle('+i+')" style="padding:10px 6px;border-radius:12px;border:1px solid var(--border-color);background:var(--bg-card);cursor:pointer;text-align:center;transition:all .15s;'+active+'">' +
      '<div style="font-size:22px;margin-bottom:4px;">'+s.icon+'</div>' +
      '<div style="font-size:12px;font-weight:600;">'+s.name+'</div>' +
      '</div>';
  }).join('');
}

function avatarSelectStyle(i){
  avatarSelected = i;
  avatarRenderStyles();
  avatarDraw();
}

function avatarHandleUpload(e){
  const file = e.target.files[0];
  if(!file) return;
  if(!file.type.startsWith('image/')){ showToast('⚠️ 请上传图片文件'); return; }
  const reader = new FileReader();
  reader.onload = function(ev){
    const img = new Image();
    img.onload = function(){
      avatarImg = img;
      avatarDraw();
      showToast('✅ 头像已上传');
    };
    img.onerror = function(){ showToast('⚠️ 图片加载失败'); };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function avatarDraw(){
  const canvas = document.getElementById('avatarCanvas');
  if(!canvas || !avatarImg) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);
  // 居中裁剪为正方形
  const iw = avatarImg.width, ih = avatarImg.height;
  const scale = Math.max(W/iw, H/ih);
  const dw = iw*scale, dh = ih*scale;
  ctx.drawImage(avatarImg, (W-dw)/2, (H-dh)/2, dw, dh);
  // 绘制装饰
  switch(avatarSelected){
    case 0: avatarDrawFlagGradient(ctx,W,H); break;
    case 1: avatarDrawFlagGradientSmall(ctx,W,H); break;
    case 2: avatarDrawCircleBadge(ctx,W,H); break;
    case 3: avatarDrawBanner(ctx,W,H,'国庆快乐'); break;
    case 4: avatarDrawBanner(ctx,W,H,'中国加油'); break;
    case 5: break;
  }
}

function avatarDrawStar(ctx, cx, cy, r, color){
  ctx.fillStyle = color;
  ctx.beginPath();
  for(let i=0;i<5;i++){
    const angle = (i*4*Math.PI/5) - Math.PI/2;
    const x = cx + r*Math.cos(angle);
    const y = cy + r*Math.sin(angle);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.closePath();
  ctx.fill();
}

function avatarDrawFlagGradient(ctx,W,H){
  const grad = ctx.createLinearGradient(0,0,W*0.60,H*0.60);
  grad.addColorStop(0,'rgba(222,29,31,0.98)');
  grad.addColorStop(0.35,'rgba(222,29,31,0.8)');
  grad.addColorStop(0.7,'rgba(222,29,31,0.35)');
  grad.addColorStop(1,'rgba(222,29,31,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,W,H);
  // 大五角星
  avatarDrawStar(ctx, W*0.18, H*0.24, W*0.11, '#FFDE00');
  // 四颗小五角星（大星右侧弧形排列）
  const sr = W*0.038;
  [[W*0.36,H*0.11],[W*0.43,H*0.20],[W*0.43,H*0.32],[W*0.36,H*0.40]].forEach(function(p){ avatarDrawStar(ctx,p[0],p[1],sr,'#FFDE00'); });
}

function avatarDrawFlagGradientSmall(ctx,W,H){
  const grad = ctx.createLinearGradient(0,0,W*0.45,H*0.45);
  grad.addColorStop(0,'rgba(222,29,31,0.98)');
  grad.addColorStop(0.4,'rgba(222,29,31,0.7)');
  grad.addColorStop(0.8,'rgba(222,29,31,0.2)');
  grad.addColorStop(1,'rgba(222,29,31,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,W,H);
  // 大五角星（比大区域小）
  avatarDrawStar(ctx, W*0.13, H*0.16, W*0.075, '#FFDE00');
  // 四颗小五角星
  const sr = W*0.026;
  [[W*0.25,H*0.08],[W*0.30,H*0.14],[W*0.30,H*0.22],[W*0.25,H*0.27]].forEach(function(p){ avatarDrawStar(ctx,p[0],p[1],sr,'#FFDE00'); });
}

function avatarDrawSmallFlag(ctx,W,H){
  const fw = W*0.32, fh = fw*0.66;
  const fx = W-fw-W*0.04, fy = H-fh-H*0.04;
  ctx.fillStyle = '#DE1D1F';
  ctx.fillRect(fx,fy,fw,fh);
  avatarDrawStar(ctx, fx+fw*0.22, fy+fh*0.32, fw*0.1, '#FFDE00');
  const sr = fw*0.035;
  [[fx+fw*0.45,fy+fh*0.15],[fx+fw*0.55,fy+fh*0.3],[fx+fw*0.55,fy+fh*0.5],[fx+fw*0.45,fy+fh*0.65]].forEach(function(p){ avatarDrawStar(ctx,p[0],p[1],sr,'#FFDE00'); });
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 2;
  ctx.strokeRect(fx,fy,fw,fh);
}

function avatarDrawCircleBadge(ctx,W,H){
  const r = W*0.16;
  const cx = W-r-W*0.04, cy = H-r-H*0.04;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx,cy,r,0,Math.PI*2);
  ctx.clip();
  ctx.fillStyle = '#DE1D1F';
  ctx.fillRect(cx-r,cy-r,r*2,r*2);
  avatarDrawStar(ctx, cx-r*0.3, cy-r*0.2, r*0.3, '#FFDE00');
  const sr = r*0.1;
  [[cx+r*0.1,cy-r*0.55],[cx+r*0.4,cy-r*0.3],[cx+r*0.4,cy+r*0.05],[cx+r*0.1,cy+r*0.3]].forEach(function(p){ avatarDrawStar(ctx,p[0],p[1],sr,'#FFDE00'); });
  ctx.restore();
  ctx.beginPath();
  ctx.arc(cx,cy,r,0,Math.PI*2);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function avatarDrawBanner(ctx,W,H,text){
  const bh = H*0.22;
  const by = H-bh;
  const grad = ctx.createLinearGradient(0,by,0,H);
  grad.addColorStop(0,'rgba(222,29,31,0.9)');
  grad.addColorStop(1,'rgba(180,20,20,0.95)');
  ctx.fillStyle = grad;
  ctx.fillRect(0,by,W,bh);
  for(let i=0;i<6;i++){
    avatarDrawStar(ctx, (i+0.5)*W/6, by+bh*0.2, W*0.018, 'rgba(255,222,0,0.7)');
  }
  ctx.fillStyle = '#FFDE00';
  ctx.font = 'bold '+Math.floor(W*0.1)+'px "Microsoft YaHei",sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, W/2, by+bh*0.62);
}

function avatarDownload(){
  const canvas = document.getElementById('avatarCanvas');
  if(!canvas) return;
  const link = document.createElement('a');
  link.download = '国庆头像_'+Date.now()+'.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('✅ 头像已下载');
}

function avatarReset(){
  avatarSelected = 0;
  document.getElementById('avatarInput').value = '';
  avatarImg = avatarDefaultImage();
  avatarImg.onload = function(){ avatarDraw(); };
  avatarRenderStyles();
  showToast('🔄 已恢复默认白底');
}
