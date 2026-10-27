(function(){
  let wrapper=null,section=null,page=null,original=null,observer=null,control=null;
  function sync(){
    if(!wrapper||!section||!page)return;
    const visible=getComputedStyle(page).display!=='none'&&getComputedStyle(section).display!=='none';
    window.flSetDockVisible(wrapper,visible);
    if(visible)requestAnimationFrame(function(){
      const selected=original.querySelector('.hot-tab.is-active,.hot-tab.active');
      control.flSegmentedSync?.(selected?.dataset.type||'weibo');
    });
  }
  window.addEventListener('fl:tool-page-enter',function(event){
    if(event.detail?.name!=='introHot')return;
    const nextPage=document.getElementById('pageIntroPage');
    const nextSection=document.getElementById('sectionHot');
    const nextOriginal=nextSection?.querySelector('.fl-hot-segmented-control');
    if(!nextPage||!nextSection||!nextOriginal)return;
    nextOriginal.querySelector('[data-type="zhihu"]')?.remove();
    if(!wrapper){
      wrapper=document.createElement('nav');wrapper.className='home-category-dock hot-category-dock';
      wrapper.setAttribute('aria-label','热搜平台');wrapper.hidden=true;document.body.appendChild(wrapper);
    }
    if(original!==nextOriginal){
      original=nextOriginal;original.style.display='none';
      control=original.cloneNode(true);control.style.display='';
      control.querySelectorAll('.fl-segmented-option').forEach(function(button){button.removeAttribute('onclick');});
      wrapper.replaceChildren(control);
      window.flInitSegmentedControl(control,{
        getValue:function(){return control.querySelector('.hot-tab.is-active,.hot-tab.active')?.dataset.type||'weibo';},
        getOptionValue:function(button){return button.dataset.type;},
        handleClick:true,
        onChange:function(value){
          const source=original.querySelector('.hot-tab[data-type="'+value+'"]');
          if(source&&typeof window.loadHot==='function')window.loadHot(value,source);
        }
      });
    }
    if(section!==nextSection||page!==nextPage){
      if(observer)observer.disconnect();section=nextSection;page=nextPage;
      observer=new MutationObserver(sync);
      observer.observe(section,{attributes:true,attributeFilter:['style','class']});
      observer.observe(page,{attributes:true,attributeFilter:['style','class']});
    }
    sync();
  });
})();
