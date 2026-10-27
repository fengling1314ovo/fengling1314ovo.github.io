(function () {
  'use strict';

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cardSelector = '.page-home .home-buttons > .home-btn, .page-chest-home .chest-card, .fav-grid .home-btn';
  if (!document.querySelector(cardSelector)) return;

  if (!('IntersectionObserver' in window)) return;

  const cardParents = new Set();

  function assignRowDelays(parent) {
    const cards = Array.from(parent.children).filter(function (card) {
      return card.classList.contains('fl-reveal-card') && card.getClientRects().length > 0;
    });
    let rowIndex = -1;
    let rowTop = null;
    cards.forEach(function (card) {
      const top = card.getBoundingClientRect().top;
      if (rowTop === null || Math.abs(top - rowTop) > 2) {
        rowIndex += 1;
        rowTop = top;
      }
      card.style.setProperty('--fl-reveal-delay', (rowIndex % 3) * 55 + 'ms');
    });
  }

  const revealObserver = new IntersectionObserver(function (entries) {
    const visibleParents = new Set();
    entries.forEach(function (entry) {
      if (entry.isIntersecting && entry.target.parentElement) visibleParents.add(entry.target.parentElement);
    });
    visibleParents.forEach(assignRowDelays);
    entries.forEach(function (entry) {
      entry.target.classList.toggle('fl-reveal-visible', entry.isIntersecting);
    });
  }, { threshold: 0.1, rootMargin: '0px' });

  function prepareCard(card) {
    if (card.classList.contains('fl-reveal-ready')) return;
    if (card.parentElement) cardParents.add(card.parentElement);
    card.classList.add('fl-reveal-card', 'fl-reveal-ready');
    revealObserver.observe(card);
  }

  window.addEventListener('resize', function () {
    cardParents.forEach(assignRowDelays);
  }, { passive: true });

  function collectCards(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.matches(cardSelector)) prepareCard(node);
    node.querySelectorAll(cardSelector).forEach(prepareCard);
  }

  document.querySelectorAll(cardSelector).forEach(prepareCard);

  const contentObserver = new MutationObserver(function (records) {
    records.forEach(function (record) {
      record.addedNodes.forEach(collectCards);
    });
  });
  contentObserver.observe(document.body, { childList: true, subtree: true });
})();