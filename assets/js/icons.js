/* ============================================================
   PEIcons — ClassMap HOME 전용 SVG 아이콘 세트
   - 이모지 대신 사용하는 자체 아이콘 (stroke 기반, currentColor 상속)
   - 사용법(정적): <span data-icon="book"></span>  → 자동 치환
   - 사용법(동적): PEIcon('book')  → svg 문자열 반환
   ============================================================ */
(function () {
  'use strict';

  function svg(inner, vb) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (vb || '0 0 24 24') +
      '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      inner + '</svg>';
  }

  var I = {
    /* 코스/학습 */
    book: svg('<path d="M12 6.2C10.2 4.7 7.6 4.2 4 4.2v13.6c3.6 0 6.2.5 8 2 1.8-1.5 4.4-2 8-2V4.2c-3.6 0-6.2.5-8 2z"/><path d="M12 6.2v13.6"/>'),
    pencil: svg('<path d="M4 20l1-4L16.5 4.5a2.12 2.12 0 0 1 3 3L8 19l-4 1z"/><path d="M14.5 6.5l3 3"/>'),
    award: svg('<circle cx="12" cy="9" r="5.5"/><path d="M8.8 13.6L7 21l5-2.4L17 21l-1.8-7.4"/><path d="M10 9l1.5 1.5L14.5 7.5"/>'),
    sparkle: svg('<path d="M11 4l1.6 4.6L17.2 10.2l-4.6 1.6L11 16.4l-1.6-4.6L4.8 10.2l4.6-1.6z"/><path d="M17.8 14.6l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>'),
    clock: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 1.9"/>'),
    download: svg('<path d="M12 4.5v9.5M8.2 10.5l3.8 3.8 3.8-3.8"/><path d="M4.5 16.5V18a2.5 2.5 0 0 0 2.5 2.5h10A2.5 2.5 0 0 0 19.5 18v-1.5"/>'),
    bookmark: svg('<path d="M6.5 4.5h11V21l-5.5-3.4L6.5 21z"/>'),

    /* 점검/관찰 */
    check: svg('<circle cx="12" cy="12" r="8.5"/><path d="M8.2 12.4l2.6 2.6 5-5.4"/>'),
    search: svg('<circle cx="11" cy="11" r="6.3"/><path d="M15.6 15.6L20 20"/>'),
    heart: svg('<path d="M12 19.8S4.9 15.4 3.4 11.2C2.5 8.6 4 6 6.7 5.5c1.9-.3 3.8.6 5.3 2.6 1.5-2 3.4-2.9 5.3-2.6 2.7.5 4.2 3.1 3.3 5.7-1.5 4.2-8.6 8.6-8.6 8.6z"/>'),
    users: svg('<circle cx="9" cy="8.5" r="3.1"/><path d="M3.6 19.5c.6-3.3 2.7-5 5.4-5s4.8 1.7 5.4 5"/><circle cx="16.8" cy="9.7" r="2.5"/><path d="M16.3 14.4c2.2.2 3.7 1.6 4.2 3.9"/>'),
    eye: svg('<path d="M2.8 12S6.2 5.8 12 5.8 21.2 12 21.2 12 17.8 18.2 12 18.2 2.8 12 2.8 12z"/><circle cx="12" cy="12" r="2.9"/>'),

    /* 안내/가이드 */
    compass: svg('<circle cx="12" cy="12" r="8.5"/><path d="M15.4 8.6l-1.9 4.9-4.9 1.9 1.9-4.9z"/>'),
    bulb: svg('<path d="M9.2 18h5.6M10.2 21h3.6"/><path d="M12 3.2a5.8 5.8 0 0 1 3.4 10.5c-.8.6-1 1.3-1 2.3h-4.8c0-1-.2-1.7-1-2.3A5.8 5.8 0 0 1 12 3.2z"/>'),
    lock: svg('<rect x="5.5" y="10.5" width="13" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/><path d="M12 14.2v2.2"/>'),
    phone: svg('<path d="M7 3.8h2.8l1.5 4.3-1.9 1.5a12.6 12.6 0 0 0 5 5l1.5-1.9 4.3 1.5V17a2.1 2.1 0 0 1-2.3 2.1A16.3 16.3 0 0 1 4.9 6.1 2.1 2.1 0 0 1 7 3.8z"/>'),
    chat: svg('<path d="M6 4.5h12a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-7.5L6 19.7v-3.7a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2z"/><path d="M8.5 9h7M8.5 12h4.5"/>'),

    camera: svg('<rect x="3.5" y="7" width="17" height="13" rx="2"/><path d="M8.7 7l1.4-2.4h3.8L15.3 7"/><circle cx="12" cy="13.3" r="3.1"/>'),

    /* 상황별 (가이드 아코디언) */
    shield: svg('<path d="M12 3.2l7.3 2.9v5.7c0 4.5-3.1 7.6-7.3 8.9-4.2-1.3-7.3-4.4-7.3-8.9V6.1z"/><path d="M12 8.2v4.2M12 15.6v.3"/>'),
    doc: svg('<path d="M6.2 3.6h7.6l4 4v12.8H6.2z"/><path d="M13.8 3.6V7.8h4"/><path d="M12 10.8v3.4M12 17v.3"/>'),
    clipboard: svg('<rect x="5.5" y="4.8" width="13" height="16" rx="2"/><path d="M9.2 4.8a2.8 2.8 0 0 1 5.6 0"/><path d="M8.5 10.8h7M8.5 14.2h7M8.5 17.6h4"/>'),

    /* 정보 */
    news: svg('<rect x="3.5" y="4.8" width="17" height="14.8" rx="2"/><path d="M7 9.3h10M7 12.4h10M7 15.5h6"/>'),
    gradcap: svg('<path d="M2.8 9.4L12 5l9.2 4.4L12 13.8z"/><path d="M6.8 11.6v4.2c0 1.4 2.4 2.7 5.2 2.7s5.2-1.3 5.2-2.7v-4.2"/><path d="M20.6 10.2v4.8"/>'),
    school: svg('<path d="M4.5 20V9.2L12 4.6l7.5 4.6V20"/><path d="M2.8 20h18.4"/><path d="M9.8 20v-5.4h4.4V20"/><path d="M12 8.4v.3"/>'),
    home: svg('<path d="M4 11l8-7 8 7"/><path d="M6.2 9.4V20h11.6V9.4"/><path d="M10 20v-5.4h4V20"/>'),
    arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),

    /* 마음 맞히기 게이트: 휴대폰 → 아이 */
    handover: svg('<rect x="2.5" y="5" width="10" height="17" rx="2.2"/><path d="M6 18.8h3"/><path d="M15.5 10.5h6M19 7.5l3 3-3 3"/><circle cx="27" cy="6.8" r="3.2"/><path d="M21.8 22c.7-4.2 2.7-6.4 5.2-6.4s4.5 2.2 5.2 6.4"/>', '0 0 34 24')
  };

  function render(root) {
    (root || document).querySelectorAll('[data-icon]').forEach(function (el) {
      var name = el.getAttribute('data-icon');
      if (I[name]) {
        el.classList.add('ico-svg');
        el.innerHTML = I[name];
        el.removeAttribute('data-icon');
      }
    });
  }

  window.PEIcon = function (name, cls) {
    return '<span class="ico-svg' + (cls ? ' ' + cls : '') + '">' + (I[name] || '') + '</span>';
  };
  window.PEIcons = { render: render, defs: I };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { render(); });
  } else {
    render();
  }
})();
