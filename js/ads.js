/*
 * Рекламный слот.
 * Пока сеть не подключена, блок скрыт и ничего не загружает.
 * Включается здесь: enabled = true и scriptUrl от рекламной сети.
 *
 * Офлайн: слот автоматически скрывается, а рекламные скрипты
 * service worker не кэширует — в офлайне рекламы нет.
 */
(function () {
  'use strict';

  var config = {
    enabled: false,        // включает показ блока
    provider: 'none',      // 'rsya' | 'adsense' | 'custom'
    scriptUrl: '',         // адрес скрипта сети
    blockId: '',           // номер рекламного места в сети
    minHeight: 96,         // резерв высоты, чтобы не дёргался макет
  };

  var slot = document.getElementById('ad-slot');
  var body = document.getElementById('ad-slot-body');
  if (!slot || !body) return;

  var mounted = false;

  function isOnline() {
    return window.navigator.onLine !== false;
  }

  function shouldShow() {
    return config.enabled && isOnline();
  }

  function apply() {
    var show = shouldShow();
    slot.hidden = !show;
    body.style.minHeight = show ? config.minHeight + 'px' : '';
    mount();
  }

  function mount() {
    if (!shouldShow() || mounted) return;
    if (!config.scriptUrl) return;

    mounted = true;

    var script = document.createElement('script');
    script.src = config.scriptUrl;
    script.async = true;
    script.onerror = function () {
      // сеть не загрузилась — просто убираем блок, макет не ломаем
      slot.hidden = true;
    };
    document.head.appendChild(script);
  }

  window.addEventListener('online', apply);
  window.addEventListener('offline', apply);

  // Небольшая ручка для отладки и для кода рекламной сети.
  window.PGTU_ADS = {
    config: config,
    refresh: apply,
  };

  apply();
})();
