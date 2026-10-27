(function(){
  let wrapper=null,page=null,observer=null;
  function sync(){
    if(!wrapper||!page)return;
    const visible=getComputedStyle(page).display!=='none';
    window.flSetDockVisible(wrapper,visible);
    if(visible)requestAnimationFrame(function(){
      const control=wrapper.querySelector('#chestCategories');
      const active=control?.querySelector('.fl-segmented-option.is-active,.fl-segmented-option.active');
      if(control&&active)control.flSegmentedSync?.(active.dataset.cat);
    });
  }
  window.addEventListener('fl:tool-page-enter',function(event){
    if(event.detail?.name!=='chestHome')return;
    const nextPage=document.getElementById('pageChestHome');
    const control=document.getElementById('chestCategories');
    if(!nextPage||!control)return;
    if(!wrapper){
      wrapper=document.createElement('nav');wrapper.className='home-category-dock chest-category-dock';
      wrapper.setAttribute('aria-label','百宝箱分类');wrapper.hidden=true;document.body.appendChild(wrapper);
    }
    if(control.parentElement!==wrapper)wrapper.appendChild(control);
    if(page!==nextPage){
      if(observer)observer.disconnect();page=nextPage;
      observer=new MutationObserver(sync);observer.observe(page,{attributes:true,attributeFilter:['style','class']});
    }
    sync();
  });
})();
