/* 百宝箱页面入口与路由 */
function openChestToolLoaded(pageId, title){
  openPage(pageId);
  if(pageId==='pinballShopPage'){setTimeout(pinUpdateShopUI,50);}
  if(pageId==='chestHome'){setTimeout(pinUpdateChestBadge,50);}
}