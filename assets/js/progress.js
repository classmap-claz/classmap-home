/* ============================================================
   PE — ClassMap HOME 세션·진행 상태 공통 모듈 (v2 듀얼 모드)
   - 학교 세션 없이도 진단(check/) 사용 가능
   - 코스(course/) 진입 시에만 학교 세션 필수
   ============================================================ */
(function () {
  'use strict';

  var COURSE_MODULES = ['m1', 'm2', 'm3', 'm4', 'm5'];
  var CONTENT_TITLES = {
    signs:  '학교폭력 징후 체크',
    social: '관계 습관 체크',
    mind:   '우리 아이 마음 맞히기',
    m1: '모듈1 · 징후 알아차리기',
    m2: '모듈2 · 자녀와 대화하는 법',
    m3: '모듈3 · 사이버폭력 이해하기',
    m4: '모듈4 · 사안처리 절차 이해',
    m5: '모듈5 · 가해 관련 통보를 받았을 때'
  };
  var CONTENT_LINKS = {
    signs: 'check/signs.html', social: 'check/social.html', mind: 'check/mind.html',
    m1: 'course/m1.html', m2: 'course/m2.html', m3: 'course/m3.html',
    m4: 'course/m4.html', m5: 'course/m5.html'
  };

  var PE = {
    modules: COURSE_MODULES,
    titles: CONTENT_TITLES,
    links: CONTENT_LINKS,

    school:     function () { return sessionStorage.getItem('pe_school') || ''; },
    schoolName: function () { return sessionStorage.getItem('pe_schoolName') || ''; },
    grade:      function () { return sessionStorage.getItem('pe_grade') || ''; },
    classNo:    function () { return sessionStorage.getItem('pe_class') || ''; },
    isDemo:     function () { return PE.school() === 'DEMO'; },
    hasSession: function () { return !!PE.school(); },

    requireCourseSession: function (depth) {
      if (PE.school()) return true;
      var prefix = depth === 1 ? '../' : '';
      location.replace(prefix + 'course/index.html');
      return false;
    },

    renderSchoolChip: function () {
      var el = document.querySelector('.school-chip');
      if (!el) return;
      if (PE.schoolName()) {
        el.textContent = PE.schoolName();
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    },

    markDone: function (id) {
      if (!localStorage.getItem('pe_done_' + id)) {
        localStorage.setItem('pe_done_' + id, String(Date.now()));
      }
    },
    isDone: function (id) { return !!localStorage.getItem('pe_done_' + id); },
    doneAt: function (id) {
      var t = localStorage.getItem('pe_done_' + id);
      return t ? new Date(Number(t)) : null;
    },
    courseProgress: function () {
      return COURSE_MODULES.filter(function (m) { return PE.isDone(m); }).length;
    },
    isCourseDone: function () { return PE.courseProgress() === COURSE_MODULES.length; },
    courseDoneDate: function () {
      var latest = 0;
      COURSE_MODULES.forEach(function (m) {
        var t = Number(localStorage.getItem('pe_done_' + m) || 0);
        if (t > latest) latest = t;
      });
      return latest ? new Date(latest) : null;
    },

    fmtDate: function (d) {
      if (!d) return '';
      return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0');
    }
  };

  window.PE = PE;
})();
