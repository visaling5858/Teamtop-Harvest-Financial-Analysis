(function () {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const brand = sidebar.querySelector('.brand');
  if (brand && !sidebar.querySelector('.brand-caption')) {
    const oldCaption = brand.querySelector('span');
    const caption = document.createElement('div');
    caption.className = 'brand-caption';
    caption.innerHTML = '<span>财务分析看板</span><small>MONTHLY BUSINESS REVIEW</small>';
    oldCaption?.remove();
    brand.insertAdjacentElement('afterend', caption);
  }

  const card = sidebar.querySelector('.sidebar-card, .source-note');
  if (!card) return;

  card.className = 'sidebar-card sidebar-period-card';

  function renderPeriod() {
    const select = document.querySelector('.period-select');
    const period = select?.value === '202606' ? '202606' : '202607';
    const month = period.slice(0, 4) + '-' + period.slice(4);
    card.innerHTML = [
      `<b>当前数据期 <strong>${period}</strong></b>`,
      `<span>月度财务分析报告基础数据<br>（${month}）.xlsx</span>`,
      '<small>源表已复核 · 单位：万元</small>'
    ].join('');
  }

  renderPeriod();
  document.querySelector('.period-select')?.addEventListener('change', function () {
    window.setTimeout(renderPeriod, 0);
  });
})();
