
let flAccountScriptPromise = null;
function flEnsureAccountScript(){
  if(window.__flAccountScriptLoaded) return Promise.resolve();
  if(!flAccountScriptPromise){
    flAccountScriptPromise = window.flLoadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js')
      .then(()=>window.flLoadScriptOnce('./js/account.js?v=20261026-account-markup'))
      .then(()=>{ window.__flAccountScriptLoaded=true; })
      .catch(error=>{ flAccountScriptPromise=null; throw error; });
  }
  return flAccountScriptPromise;
}function flOpenAccountFeature(){
  flEnsureAccountScript()
    .then(()=>flOpenAccountModal())
    .catch(error=>{
      if(typeof showToast==='function') showToast(error.message);
    });
}
