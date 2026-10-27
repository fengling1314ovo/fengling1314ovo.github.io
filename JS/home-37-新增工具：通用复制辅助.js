// ==================== 新增工具：通用复制辅助 ====================
function toastCopy(txt){
  if(!txt){showToast('没有可复制的内容');return;}
  copyText(txt).then(()=>showToast('已复制'));
}

