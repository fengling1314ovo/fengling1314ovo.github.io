// ==================== 节日弹窗系统（API驱动） ====================
async function checkFestivalPopup(){
  const now=new Date();
  const today=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
  const year=now.getFullYear();
  if(localStorage.getItem('festival_popup_all_'+today))return;
  try{
    const r=await fetch('https://api.fengling1314ovo.top/api/holidays?year='+year).then(r=>r.json());
    if(!r||!r.ok||!r.data)return;
    for(const h of r.data){
      if(h.date===today && h.title){
        showFestivalPopup(h);
        return;
      }
    }
  }catch(e){/* API不可用时不弹窗 */}
}
function showFestivalPopup(h){
  document.getElementById('festivalPopupEmoji').textContent=h.emoji||'🎉';
  document.getElementById('festivalPopupTitle').textContent=h.title;
  document.getElementById('festivalPopupDesc').textContent=h.desc||'';
  document.getElementById('festivalPopupDontShowToday').checked=false;
  const btn=document.getElementById('festivalPopupActionBtn');
  if(h.action_text&&h.action_url){
    btn.style.display='inline-block';
    btn.textContent=h.action_text;
    btn.onclick=()=>{ window.open(h.action_url,'_blank'); closeFestivalPopup(); };
  }else{
    btn.style.display='none';
  }
  const mask=document.getElementById('festivalPopupMask');
  mask.style.display='flex';
  mask.style.alignItems='center';
  mask.style.justifyContent='center';
}
function closeFestivalPopup(){
  const mask=document.getElementById('festivalPopupMask');
  const box=document.getElementById('festivalPopupBox');
  const dontShow=document.getElementById('festivalPopupDontShowToday').checked;
  if(dontShow){
    const now=new Date();
    const today=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
    localStorage.setItem('festival_popup_all_'+today,'1');
  }
  box.style.transition='opacity .2s, transform .2s';
  box.style.opacity='0';
  box.style.transform='scale(.85)';
  mask.style.transition='opacity .2s';
  mask.style.opacity='0';
  setTimeout(()=>{
    mask.style.display='none';
    mask.style.opacity='';
    box.style.opacity='';
    box.style.transform='';
    box.style.transition='';
    mask.style.transition='';
  },200);
}
setTimeout(checkFestivalPopup,1000);

