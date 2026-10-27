// ==================== 主题色 ====================
const bodyEl = document.body;
const colorBtnsAll = document.querySelectorAll('.modal-box .color-btn');
let savedTheme = localStorage.getItem("qqtool_theme");
function hexToRgba(hex, alpha){
  var r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
  return 'rgba('+r+', '+g+', '+b+', '+alpha+')';
}
function setPrimary(c1,c2){
  document.documentElement.style.setProperty('--primary', c1);
  const switchColor = '#' + [1,3,5].map(i=>Math.round(parseInt(c1.slice(i,i+2),16)*0.82).toString(16).padStart(2,'0')).join('');
  document.documentElement.style.setProperty('--fl-switch-on', switchColor);
  document.documentElement.style.setProperty('--primary-light', c2);
  document.documentElement.style.setProperty('--primary-bg', hexToRgba(c1, 0.12));
  var themeBg = 'radial-gradient(circle at 15% 15%,' + hexToRgba(c1, 0.16) + ',transparent 32%),' +
                'radial-gradient(circle at 85% 85%,' + hexToRgba(c2, 0.14) + ',transparent 32%),' +
                'radial-gradient(circle at 50% 100%,' + hexToRgba(c1, 0.08) + ',transparent 45%),' +
                'linear-gradient(160deg,#f8faff 0%,#eef1ff 50%,#eaf6ff 100%)';
  bodyEl.style.background = themeBg;
  bodyEl.style.backgroundAttachment = 'fixed';
  localStorage.setItem("qqtool_theme",JSON.stringify({p1:c1,p2:c2}));
}
if(savedTheme){
  const t = JSON.parse(savedTheme);
  setPrimary(t.p1,t.p2);
  colorBtnsAll.forEach(b=>{ if(b.dataset.p1===t.p1) b.classList.add('active'); else b.classList.remove('active'); });
}
colorBtnsAll.forEach(btn=>{
  btn.onclick=()=>{
    colorBtnsAll.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    setPrimary(btn.dataset.p1,btn.dataset.p2);
  };
});

