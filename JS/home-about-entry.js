
window.flOpenAboutModalAtTop=function(){
  if(typeof window.flOpenAboutModal==="function") window.flOpenAboutModal();
  const resetAboutScroll=function(){
    const modal=document.getElementById("flAboutModal");
    const box=modal&&modal.querySelector(".fl-about-modal-box");
    const content=modal&&modal.querySelector(".fl-about-modal-scroll");
    if(box) box.scrollTop=0;
    if(content) content.scrollTop=0;
  };
  resetAboutScroll();
  requestAnimationFrame(function(){
    resetAboutScroll();
    requestAnimationFrame(resetAboutScroll);
  });
};
