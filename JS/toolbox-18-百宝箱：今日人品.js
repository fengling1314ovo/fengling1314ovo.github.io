/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageJinriPage", "<!-- pageJinriPage -->\n<div class=\"tool-page\" id=\"pageJinriPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🍀 今日人品检测</h3>\n      <div id=\"jinriContent\"><div style=\"text-align:center;color:var(--text-placeholder);padding:30px;\">加载中...</div></div>\n      <div style=\"text-align:center;margin-top:12px;\">\n        <button class=\"common-btn\" onclick=\"renderJinri()\">🔄 重新检测</button>\n      </div>\n    </div>\n  </div>");
// ==================== 百宝箱：今日人品 ====================
function renderJinri(){
  const seed=hashString('jinri_'+getTodaySeed());
  const score=seed%101;
  let level='',advice='',color='';
  if(score>=90){level='人品爆发';advice='今天运气爆棚！做什么都顺利，快去买彩票吧！';color='#10b981';}
  else if(score>=70){level='人品不错';advice='运气挺好，诸事顺利，保持好心情！';color='#22c55e';}
  else if(score>=50){level='人品一般';advice='运气平平，正常发挥就好，不要强求。';color='#f59e0b';}
  else if(score>=30){level='人品较差';advice='运气不太好，做事需谨慎，低调为妙。';color='#f97316';}
  else{level='人品欠费';advice='今天人品已欠费，建议躺平，别做重大决定！';color='#ef4444';}
  const yiList=['微笑','助人','学习','早睡','运动','喝水','读书','听歌','散步','冥想'];
  const jiList=['熬夜','生气','冒险','冲动','拖延','抱怨','暴饮暴食','长时间玩手机','空腹喝咖啡','久坐不动'];
  const yi=yiList[seed%yiList.length]+'、'+yiList[(seed>>3)%yiList.length];
  const ji=jiList[(seed>>2)%jiList.length]+'、'+jiList[(seed>>5)%jiList.length];
  document.getElementById('jinriContent').innerHTML=
    `<div class="fortune-today-card">
      <div class="ft-title">${getTodaySeed()} 人品检测</div>
      <div class="ft-overall" style="font-size:48px;">${score}</div>
      <div class="ft-level" style="color:${color};">${level}</div>
      <div style="margin-top:12px;font-size:14px;color:var(--text-secondary);line-height:1.6;">${advice}</div>
      <div class="fortune-extra" style="margin-top:16px;">
        <span class="fe-tag" style="color:#10b981;">✅ 宜：${yi}</span>
        <span class="fe-tag" style="color:#ef4444;">❌ 忌：${ji}</span>
      </div>
    </div>`;
}
renderJinri();



// 神秘代码
let codeModalViewportPin = null;
let codeModalViewportReleaseTimer = 0;

function pinCodeModalPosition(){
  const mask=document.getElementById('codeModalMask');
  const box=mask?.querySelector('.modal-box');
  if(!mask||!box||mask.style.display!=='flex')return;
  clearTimeout(codeModalViewportReleaseTimer);
  if(codeModalViewportPin)return;

  const rect=box.getBoundingClientRect();
  const viewport=window.visualViewport;
  codeModalViewportPin={
    mask,box,
    viewportTop:viewport?.offsetTop||0,
    viewportLeft:viewport?.offsetLeft||0,
    maskStyles:{
      alignItems:mask.style.alignItems,
      justifyContent:mask.style.justifyContent,
      padding:mask.style.padding
    },
    boxStyles:{top:box.style.top,left:box.style.left}
  };

  // Keep the panel at its pre-keyboard coordinates while the mobile viewport resizes.
  mask.style.alignItems='flex-start';
  mask.style.justifyContent='flex-start';
  mask.style.padding=`${rect.top}px 0 0 ${rect.left}px`;
  updateCodeModalViewportPin();
}

function updateCodeModalViewportPin(){
  if(!codeModalViewportPin)return;
  const viewport=window.visualViewport;
  const top=(viewport?.offsetTop||0)-codeModalViewportPin.viewportTop;
  const left=(viewport?.offsetLeft||0)-codeModalViewportPin.viewportLeft;
  codeModalViewportPin.box.style.top=`${top}px`;
  codeModalViewportPin.box.style.left=`${left}px`;
}

function releaseCodeModalPositionPin(){
  clearTimeout(codeModalViewportReleaseTimer);
  const pin=codeModalViewportPin;
  if(!pin)return;
  pin.mask.style.alignItems=pin.maskStyles.alignItems;
  pin.mask.style.justifyContent=pin.maskStyles.justifyContent;
  pin.mask.style.padding=pin.maskStyles.padding;
  pin.box.style.top=pin.boxStyles.top;
  pin.box.style.left=pin.boxStyles.left;
  codeModalViewportPin=null;
}

function scheduleCodeModalPositionRelease(){
  clearTimeout(codeModalViewportReleaseTimer);
  codeModalViewportReleaseTimer=setTimeout(releaseCodeModalPositionPin,260);
}

const codeModalInput=document.getElementById('codeInput');
codeModalInput?.addEventListener('pointerdown',pinCodeModalPosition);
codeModalInput?.addEventListener('focus',pinCodeModalPosition);
codeModalInput?.addEventListener('blur',scheduleCodeModalPositionRelease);
window.addEventListener('resize',updateCodeModalViewportPin);
window.visualViewport?.addEventListener('resize',updateCodeModalViewportPin);
window.visualViewport?.addEventListener('scroll',updateCodeModalViewportPin);

function openCodeModal(){
  releaseCodeModalPositionPin();
  document.getElementById('codeModalMask').style.display='flex';
  document.body.style.overflow='hidden';
  document.getElementById('codeInput').value='';

}
function closeCodeModal(){
  closeModalAnimated('codeModalMask');
  scheduleCodeModalPositionRelease();
}
function redeemCode(){
  const code=document.getElementById('codeInput').value.trim();
  if(code==='20110925'){
    bpAddCoins(520,'code');
    showToast('🎉 兑换成功！获得520金币');
    closeCodeModal();
  }else if(code==='fengling1314ovo.github.io'){
    bpAddCoins(13140,'code');
    showToast('🎉 兑换成功！获得13140金币');
    closeCodeModal();
  }else if(code==='fengling1314ovo.top'){
    bpAddCoins(5200,'code');
    showToast('🎉 兑换成功！获得5200金币');
    closeCodeModal();
  }else if(code==='fengling.baby'){
    bpAddCoins(1314,'code');
    showToast('🎉 兑换成功！获得1314金币');
    closeCodeModal();
  }else if(code==='增加战力'){
    // 增加1000战力
    const currentPower = parseInt(lsGet('pet_power', 0)) || 0;
    lsSet('pet_power', currentPower + 1000);
    showToast('⚔️ 兑换成功！小橘战力+1000');
    closeCodeModal();
    // 刷新状态页
    if(typeof updateStatusPage === 'function') updateStatusPage();
    if(typeof updatePetDisplay === 'function') updatePetDisplay();
  }else if(code.startsWith('毕业')){
    // 毕业学校代码：毕业幼儿园、毕业小学、毕业初中、毕业高中、毕业大学
    const schoolName = code.substring(2); // 去掉"毕业"
    const schoolMap = {
      '幼儿园': 'kindergarten',
      '小学': 'primary',
      '初中': 'middle',
      '高中': 'high',
      '大学': 'university'
    };
    const schoolId = schoolMap[schoolName];
    if(!schoolId){
      showToast('❌ 学校名称错误，请输入：毕业幼儿园/毕业小学/毕业初中/毕业高中/毕业大学');
      return;
    }
    // 获取毕业次数
    const counts = lsGet('pet_school_counts', {});
    
    if(schoolId === 'university'){
      // 毕业大学：自动解锁前面所有学校
      counts['kindergarten'] = Math.max(counts['kindergarten'] || 0, 3);
      counts['primary'] = Math.max(counts['primary'] || 0, 10);
      counts['middle'] = Math.max(counts['middle'] || 0, 20);
      counts['high'] = Math.max(counts['high'] || 0, 25);
      lsSet('pet_school_counts', counts);
      showToast('🎓 兑换成功！已解锁全部学校（小学→初中→高中→大学）');
    }else{
      // 找到当前学校的下一级学校
      const nextSchoolMap = {
        'kindergarten': {next: 'primary', need: 3, nextName: '小学'},
        'primary': {next: 'middle', need: 10, nextName: '初中'},
        'middle': {next: 'high', need: 20, nextName: '高中'},
        'high': {next: 'university', need: 25, nextName: '大学'}
      };
      const nextInfo = nextSchoolMap[schoolId];
      if(!nextInfo){
        showToast('❌ 幼儿园已经是最初级啦，不需要解锁');
        return;
      }
      // 设置当前学校毕业次数达到解锁要求
      counts[schoolId] = Math.max(counts[schoolId] || 0, nextInfo.need);
      lsSet('pet_school_counts', counts);
      showToast(`🎓 兑换成功！${schoolName}已毕业，解锁${nextInfo.nextName}！`);
    }
    closeCodeModal();
    // 刷新上学页面和状态页
    if(typeof renderSchoolList === 'function') renderSchoolList();
    if(typeof updateStatusPage === 'function') updateStatusPage();
  }else if(code==='解锁打字'){
    // 解锁所有打字关卡
    try {
      const typingCourses = [
        {id:'keys', count:8},
        {id:'words', count:6},
        {id:'sentences', count:6},
        {id:'articles', count:4},
        {id:'poems', count:25}
      ];
      let progress = {};
      try {
        const saved = localStorage.getItem('typingProgress');
        progress = saved ? JSON.parse(saved) : {};
      } catch(e) {}
      typingCourses.forEach(c => {
        for(let i = 0; i < c.count; i++) {
          progress[c.id + '_' + i] = { speed: 999, acc: 100 };
        }
      });
      localStorage.setItem('typingProgress', JSON.stringify(progress));
      showToast('🎉 兑换成功！已解锁全部打字关卡');
      closeCodeModal();
    } catch(e) {
      showToast('❌ 解锁失败');
    }
  }else{
    showToast('❌ 神秘代码错误');
  }
}
// 回车兑换
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&document.getElementById('codeModalMask').style.display==='flex'){
    redeemCode();
  }
});
// 点击遮罩关闭
document.getElementById('codeModalMask').addEventListener('click',e=>{
  if(e.target.id==='codeModalMask')closeCodeModal();
});




