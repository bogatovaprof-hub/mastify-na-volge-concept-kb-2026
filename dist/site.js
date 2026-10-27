'use strict';
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-nav');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    menu.hidden = !open;
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
  });
  const narrow = matchMedia('(max-width: 650px)');
  narrow.addEventListener('change', () => setMenu(false));
  const type = document.getElementById('visit-type');
  document.querySelectorAll('[data-visit]').forEach(link => {
    link.addEventListener('click', () => {
      type.value = link.dataset.visit;
      document.getElementById('message-result').hidden = true;
      document.getElementById('prepared-message').value = '';
      document.getElementById('form-status').textContent = '';
    });
  });
  const form = document.getElementById('visit-form');
  const result = document.getElementById('message-result');
  const prepared = document.getElementById('prepared-message');
  const status = document.getElementById('form-status');
  form.addEventListener('input', () => { result.hidden = true; prepared.value = ''; status.textContent = ''; });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const fields = new FormData(form);
    const name = String(fields.get('name') || '').trim();
    const date = String(fields.get('date') || '');
    const company = String(fields.get('company') || '').trim();
    const comment = String(fields.get('comment') || '').trim();
    const lines = ['Екатерина, здравствуйте!', 'Хочу обсудить визит: ' + type.selectedOptions[0].textContent.replace(/[.]+$/u, '') + '.'];
    if (name) lines.push('Меня зовут ' + name + '.');
    if (date) lines.push('Желаемая дата: ' + date.split('-').reverse().join('.') + '.');
    if (company) lines.push('Планируем приехать: ' + company + '.');
    if (comment) lines.push('Пожелания: ' + comment);
    lines.push('Подскажите, пожалуйста, доступна ли дата и какие условия визита.');
    prepared.value = lines.join('\n');
    result.hidden = false;
    status.textContent = 'Текст подготовлен. Ничего не отправлено, дата не забронирована.';
    prepared.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
  });
  document.getElementById('copy-message').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(prepared.value);
      status.textContent = 'Текст скопирован. Отправка не выполнялась.';
    } catch {
      prepared.focus(); prepared.select();
      status.textContent = 'Текст выделен. Нажмите Ctrl+C или выберите «Копировать» на телефоне.';
    }
  });
})();
