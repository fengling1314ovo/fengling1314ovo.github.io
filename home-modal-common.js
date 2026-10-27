
/* 所有弹窗每次重新打开时，外层和内部滚动区域都回到顶部。 */
(function(){
  const modalSelector='.modal-mask,.bp-modal-overlay,.ty-result-overlay';
  const openState=new WeakMap();
  let openModalCount=0;
  let backgroundScrollLocked=false;
  let savedScrollX=0;
  let savedScrollY=0;

  function unifyConfirmButton(button){
    if(!button || button.tagName!=='BUTTON' || button.classList.contains('personal-modal-confirm')) return;
    const rawLabel=String(button.textContent || '').trim();
    const label=rawLabel.replace(/^[\s✓✔✅🔄📄📦📥🏠🎨]+/,'').replace(/\s+/g,'');
    if(!/^(确认|确定).{0,24}$/.test(label)){
      if(button.classList.contains('fl-confirm-action-button')) button.classList.remove('fl-confirm-action-button');
      if(Object.prototype.hasOwnProperty.call(button.dataset,'flConfirmHasCheck')) delete button.dataset.flConfirmHasCheck;
      return;
    }
    const hasCheck=/^[\s]*[✓✔✅]/.test(rawLabel);
    if(hasCheck){
      if(button.dataset.flConfirmHasCheck!=='true') button.dataset.flConfirmHasCheck='true';
    }else if(Object.prototype.hasOwnProperty.call(button.dataset,'flConfirmHasCheck')){
      delete button.dataset.flConfirmHasCheck;
    }
    if(!button.classList.contains('fl-confirm-action-button')) button.classList.add('fl-confirm-action-button');
  }

  function unifyCancelButton(button){
    if(!button || button.tagName!=='BUTTON' || button.classList.contains('personal-modal-confirm')) return;
    const label=String(button.textContent || '').trim()
      .replace(/^[\s×✕✖❌🔄📄📦📥🏠🎨]+/,'')
      .replace(/\s+/g,'');
    const isCancel=/^取消[。.!！?？：:]?$/.test(label);
    if(isCancel){
      if(!button.classList.contains('fl-cancel-action-button')) button.classList.add('fl-cancel-action-button');
    }else if(button.classList.contains('fl-cancel-action-button')){
      button.classList.remove('fl-cancel-action-button');
    }
  }

  function unifyConfirmButtonsIn(node){
    if(!node || node.nodeType!==1) return;
    if(node.matches('button')){unifyConfirmButton(node);unifyCancelButton(node);}
    node.querySelectorAll('button').forEach(function(button){unifyConfirmButton(button);unifyCancelButton(button);});
  }

  document.querySelectorAll('button').forEach(function(button){unifyConfirmButton(button);unifyCancelButton(button);});

  function syncBackgroundScrollLock(){
    const root=document.documentElement;
    const shouldLock=openModalCount>0;
    if(shouldLock){
      if(!backgroundScrollLocked){
        savedScrollX=window.scrollX;
        savedScrollY=window.scrollY;
        backgroundScrollLocked=true;
      }
      if(!root.classList.contains('fl-modal-scroll-locked')) root.classList.add('fl-modal-scroll-locked');
      if(document.body.style.overflow!=='hidden') document.body.style.overflow='hidden';
      return;
    }
    if(!backgroundScrollLocked) return;
    backgroundScrollLocked=false;
    if(root.classList.contains('fl-modal-scroll-locked')) root.classList.remove('fl-modal-scroll-locked');
    if(document.body.style.overflow) document.body.style.overflow='';
    requestAnimationFrame(function(){ window.scrollTo(savedScrollX,savedScrollY); });
  }

  function hasScrollableModalArea(target){
    let element=target;
    while(element && element!==document.body && !element.matches(modalSelector)){
      const style=window.getComputedStyle(element);
      if(/auto|scroll|overlay/.test(style.overflowY) && element.scrollHeight>element.clientHeight+1) return true;
      element=element.parentElement;
    }
    return false;
  }

  document.addEventListener('touchmove',function(event){
    if(!backgroundScrollLocked) return;
    const target=event.target instanceof Element?event.target:null;
    if(!target || !target.closest(modalSelector) || !hasScrollableModalArea(target)) event.preventDefault();
  },{passive:false});

  function isModalOpen(modal){
    const style=window.getComputedStyle(modal);
    return style.display!=='none' && style.visibility!=='hidden' && modal.getAttribute('aria-hidden')!=='true';
  }

  function resetModalScroll(modal){
    const reset=function(){
      modal.scrollTop=0;
      modal.querySelectorAll('*').forEach(function(element){
        if(element.scrollTop!==0) element.scrollTop=0;
      });
      syncModalHeaders(modal);
    };
    requestAnimationFrame(function(){
      reset();
      requestAnimationFrame(reset);
    });
  }

  const modalHeaderSelector='.personal-modal-header,.fl-account-modal-header,.fl-about-modal-header,.fav-modal-header,.bp-modal-header,.modal-glass-sticky-head,.image-viewer-modal-header';
  function getHeaderScrollArea(header){
    if(header.matches('.personal-modal-header')) return header.closest('.personal-modal-scroll');
    if(header.matches('.fl-account-modal-header')) return header.closest('.fl-account-modal-box')?.querySelector('.fl-account-modal-scroll');
    if(header.matches('.fl-about-modal-header')) return header.closest('.fl-about-modal-box')?.querySelector('.fl-about-modal-scroll');
    if(header.matches('.fav-modal-header')) return header.closest('#favModalMask')?.querySelector('.fav-modal-scroll');
    if(header.matches('.bp-modal-header')) return header.closest('.bp-modal-content')?.querySelector('.bp-modal-body');
    if(header.matches('.image-viewer-modal-header')) return header.closest('#imageViewerMask')?.querySelector('#imageViewerContent');
    if(header.matches('.modal-glass-sticky-head')){
      const ruleModal=header.closest('#ruleModalMask');
      if(ruleModal){
        return Array.from(ruleModal.querySelectorAll('.rule-tab-content')).find(function(area){
          return window.getComputedStyle(area).display!=='none';
        }) || null;
      }
      return header.closest('.modal-box,.pin-rule-card');
    }
    return null;
  }

  function syncModalHeaders(modal){
    if(!modal || !modal.querySelectorAll) return;
    modal.querySelectorAll(modalHeaderSelector).forEach(function(header){
      const scrollArea=getHeaderScrollArea(header);
      const isScrolled=!!scrollArea && scrollArea.scrollTop>2;
      if(header.classList.contains('is-scrolled')!==isScrolled) header.classList.toggle('is-scrolled',isScrolled);
    });
  }

  document.addEventListener('scroll',function(event){
    const target=event.target;
    if(!target || !target.closest) return;
    const modal=target.closest(modalSelector);
    if(modal) syncModalHeaders(modal);
  },true);

  function syncModal(modal){
    if(!modal || !modal.matches(modalSelector)) return;
    const isOpen=isModalOpen(modal);
    const wasOpen=openState.get(modal)===true;
    if(isOpen!==wasOpen) openModalCount=Math.max(0,openModalCount+(isOpen?1:-1));
    openState.set(modal,isOpen);
    syncBackgroundScrollLock();
    if(isOpen && wasOpen!==true) resetModalScroll(modal);
  }

  function releaseModalTree(node){
    if(!node || node.nodeType!==1) return;
    const release=function(modal){
      if(openState.get(modal)===true){
        openState.set(modal,false);
        openModalCount=Math.max(0,openModalCount-1);
      }
    };
    if(node.matches(modalSelector)) release(node);
    node.querySelectorAll(modalSelector).forEach(release);
  }

  function syncModalTree(node){
    if(!node || node.nodeType!==1) return;
    if(node.matches(modalSelector)){syncModal(node);syncModalHeaders(node);}
    node.querySelectorAll(modalSelector).forEach(function(modal){syncModal(modal);syncModalHeaders(modal);});
  }

  document.querySelectorAll(modalSelector).forEach(function(modal){
    const isOpen=isModalOpen(modal);
    openState.set(modal,isOpen);
    if(isOpen) openModalCount++;
    syncModalHeaders(modal);
  });
  syncBackgroundScrollLock();

  const observer=new MutationObserver(function(records){
    records.forEach(function(record){
      if(record.type==='attributes'){
        if(record.attributeName==='class' && record.target.matches && record.target.matches('button')){
          unifyConfirmButton(record.target);
          unifyCancelButton(record.target);
        }
        const modal=record.target.matches(modalSelector)
          ? record.target
          : record.target.closest(modalSelector);
        if(modal){syncModal(modal);syncModalHeaders(modal);}
        return;
      }

      const parentModal=record.target.closest && record.target.closest(modalSelector);
      if(parentModal){syncModal(parentModal);syncModalHeaders(parentModal);}
      const parentButton=record.target.closest && record.target.closest('button');
      if(parentButton){unifyConfirmButton(parentButton);unifyCancelButton(parentButton);}
      record.removedNodes.forEach(releaseModalTree);
      record.addedNodes.forEach(function(node){syncModalTree(node);unifyConfirmButtonsIn(node);});
    });
    syncBackgroundScrollLock();
  });
  observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['style','class','aria-hidden']});
})();
