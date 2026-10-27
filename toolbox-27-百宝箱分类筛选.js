// ==================== 百宝箱分类筛选 ====================
function filterChest(cat){
  const control = document.getElementById('chestCategories');
  const buttons = Array.from(document.querySelectorAll('#chestCategories .chest-cat-btn'));
  buttons.forEach(button => {
    const active = button.dataset.cat === cat;
    button.classList.toggle('active', active);
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (control && control.flSegmentedSync) control.flSegmentedSync(cat);
  document.querySelectorAll('.chest-grid .chest-card').forEach(card=>{
    card.style.display = (cat==='all'||card.dataset.cat===cat)?'block':'none';
  });
}
function initChestCategoryControl(){
  const control = document.getElementById('chestCategories');
  if (!control || typeof window.flInitSegmentedControl !== 'function') return;
  window.flInitSegmentedControl(control, {
    getValue: function(){
      const active = control.querySelector('.fl-segmented-option.is-active, .fl-segmented-option.active');
      return active ? active.dataset.cat : 'all';
    },
    getOptionValue: function(button){ return button.dataset.cat; },
    handleClick: true,
    onChange: function(cat){ filterChest(cat); }
  });
}
window.addEventListener('fl:tool-page-enter', function(event){
  if (event.detail && event.detail.name === 'chestHome') initChestCategoryControl();
});


