/* ============================================================
   nav.js — ClassMap HOME 공통 네비게이션 렌더러
   모든 페이지에서 <div id="site-nav"></div> 위치에 헤더 삽입
   depth: 0 = 루트, 1 = 하위폴더 (check/, course/, guide/, blog/, school/)
   ============================================================ */
(function () {
  'use strict';

  var NAV_ITEMS = [
    { label: '홈', href: 'index.html' },
    { label: '블로그', href: 'blog/index.html' },
    { label: '진단', href: 'check/mind.html' },
    { label: '예방교육', href: 'course/index.html' },
    { label: '대응 가이드', href: 'guide/index.html' }
  ];

  function renderNav(depth) {
    var prefix = depth === 1 ? '../' : '';
    var mount = document.getElementById('site-nav');
    if (!mount) return;

    var currentPath = location.pathname;

    var linksHtml = NAV_ITEMS.map(function (item) {
      var href = prefix + item.href;
      var isActive = currentPath.indexOf(item.href.replace('index.html', '')) > -1;
      return '<a href="' + href + '" class="nav-link' + (isActive ? ' active' : '') + '">' + item.label + '</a>';
    }).join('');

    var schoolChip = '<span class="school-chip" style="display:none"></span>';

    mount.innerHTML =
      '<header class="top-header">' +
        '<div class="inner">' +
          '<div class="nav-left">' +
            '<a href="' + prefix + 'index.html" class="brand">ClassMap <span class="home-mark">HOME</span></a>' +
            '<button class="nav-toggle" aria-label="메뉴 열기" id="navToggle">' +
              '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
            '</button>' +
          '</div>' +
          '<nav class="nav-links" id="navLinks">' + linksHtml + '</nav>' +
          schoolChip +
        '</div>' +
      '</header>';

    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        links.classList.toggle('open');
        toggle.setAttribute('aria-label', links.classList.contains('open') ? '메뉴 닫기' : '메뉴 열기');
      });
      links.addEventListener('click', function (e) {
        if (e.target.classList.contains('nav-link')) {
          links.classList.remove('open');
        }
      });
    }

    if (window.PE) PE.renderSchoolChip();
  }

  function renderFooter(depth) {
    var prefix = depth === 1 ? '../' : '';
    var mount = document.getElementById('site-footer');
    if (!mount) return;

    mount.innerHTML =
      '<footer class="site-footer">' +
        '<div class="f-brand">CLAZ | ClassMap</div>' +
        '문의: <a href="mailto:classmap@claz.kr">classmap@claz.kr</a>' +
      '</footer>';
  }

  window.HomeNav = { render: renderNav, renderFooter: renderFooter };
})();
