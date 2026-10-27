
(function(){
  const modal=document.getElementById('flAuthorQQModal');
  const trigger=document.getElementById('flAuthorQQButton');
  const confirmButton=document.getElementById('flAuthorQQConfirm');
  let closeTimer=null;
  function focusWithoutScroll(element){
    if(!element||typeof element.focus!=='function')return;
    try{element.focus({preventScroll:true});}catch(error){element.focus();}
  }
  window.flOpenAuthorQQModal=function(){
    if(!modal)return;
    if(closeTimer){clearTimeout(closeTimer);closeTimer=null;}
    document.body.appendChild(modal);
    modal.classList.remove('closing');
    modal.style.display='flex';
    focusWithoutScroll(confirmButton);
  };
  window.flCloseAuthorQQModal=function(){
    if(!modal)return;
    if(closeTimer)clearTimeout(closeTimer);
    modal.classList.add('closing');
    closeTimer=setTimeout(function(){
      modal.style.display='none';
      modal.classList.remove('closing');
      closeTimer=null;
      focusWithoutScroll(trigger);
    },200);
  };
  if(confirmButton)confirmButton.addEventListener('click',window.flCloseAuthorQQModal);
  if(modal){
    modal.addEventListener('click',function(event){
      if(!(event.target instanceof Element&&event.target.closest('#flAuthorQQConfirm'))){
        event.preventDefault();event.stopPropagation();
      }
    });
    modal.addEventListener('wheel',function(event){event.preventDefault();},{passive:false});
    modal.addEventListener('touchmove',function(event){event.preventDefault();},{passive:false});
    modal.addEventListener('keydown',function(event){
      if(event.key==='Escape'){event.preventDefault();window.flCloseAuthorQQModal();}
      else if(event.key==='Tab'){event.preventDefault();focusWithoutScroll(confirmButton);}
    });
  }
})();
