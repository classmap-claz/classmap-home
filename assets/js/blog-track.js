/* blog-track.js — 블로그 조회수를 학교별로 Firebase에 기록 */
(function () {
  'use strict';
  var slug = location.pathname.split('/').pop().replace('.html', '');
  if (!slug || slug === 'index') return;

  function ready() {
    if (typeof HomeDB !== 'undefined' && HomeDB.hasSchool()) {
      HomeDB.logBlogView(slug);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
