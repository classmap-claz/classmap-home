/* ============================================================
   HomeDB — ClassMap HOME Firebase 연동 모듈 (v2 듀얼 모드)
   - 학교 세션이 없으면 모든 쓰기 함수는 조용히 no-op (열린 모드)
   - 학교 세션이 있으면 기존과 동일하게 Firebase 기록
   - DEMO(체험) 진입은 어떤 집계에도 기록하지 않는다
   - 개인정보 원칙:
     · events에는 개인 식별 정보 없음 (deviceId = 익명 랜덤 UUID)
     · check_done 이벤트에는 반(classNo)을 절대 기록하지 않음
     · certs에는 deviceId를 절대 넣지 않음
     · guide/ 열람은 어떤 기록도 남기지 않음
   ============================================================ */
(function () {
  'use strict';

  var SDK_BASE = 'https://www.gstatic.com/firebasejs/8.10.1/';
  var _initPromise = null;
  var _db = null;

  function hasConfig() {
    var c = window.PE_FIREBASE_CONFIG;
    return !!(c && c.databaseURL && c.apiKey);
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function ensureInit() {
    if (_initPromise) return _initPromise;
    _initPromise = (function () {
      if (!hasConfig()) return Promise.resolve(null);
      return loadScript(SDK_BASE + 'firebase-app.js')
        .then(function () { return loadScript(SDK_BASE + 'firebase-database.js'); })
        .then(function () {
          if (!firebase.apps.length) firebase.initializeApp(window.PE_FIREBASE_CONFIG);
          _db = firebase.database();
          return _db;
        })
        .catch(function (e) {
          console.warn('[HomeDB] Firebase 초기화 실패 — 로컬 모드로 동작', e);
          return null;
        });
    })();
    return _initPromise;
  }

  function school()   { return sessionStorage.getItem('pe_school') || ''; }
  function isDemo()   { return school() === 'DEMO'; }
  function grade()    { return sessionStorage.getItem('pe_grade') || ''; }
  function classNo()  { return sessionStorage.getItem('pe_class') || ''; }
  function hasSchool(){ return !!school() && !isDemo(); }

  function deviceId() {
    var id = localStorage.getItem('pe_device');
    if (!id) {
      id = (crypto.randomUUID) ? crypto.randomUUID()
        : 'd-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem('pe_device', id);
    }
    return id;
  }

  function logEvent(type, opts) {
    opts = opts || {};
    if (!hasSchool()) return Promise.resolve(false);
    if (opts.once) {
      if (localStorage.getItem(opts.once)) return Promise.resolve(false);
      localStorage.setItem(opts.once, String(Date.now()));
    }
    return ensureInit().then(function (db) {
      if (!db) return false;
      var ev = { type: type, grade: grade(), deviceId: deviceId(), ts: firebase.database.ServerValue.TIMESTAMP };
      if (opts.contentId) ev.contentId = opts.contentId;
      if (opts.withClass && classNo() && classNo() !== 'none') ev.classNo = classNo();
      return db.ref('parentEdu/events/' + school()).push(ev).then(function () { return true; });
    }).catch(function () { return false; });
  }

  function bumpCounter(path) {
    if (!hasSchool()) return Promise.resolve(false);
    return ensureInit().then(function (db) {
      if (!db) return false;
      return db.ref(path).transaction(function (n) { return (n || 0) + 1; }).then(function () { return true; });
    }).catch(function () { return false; });
  }

  var HomeDB = {
    isLive: hasConfig,
    isDemo: isDemo,
    hasSchool: hasSchool,
    deviceId: deviceId,

    verifySchool: function (code) {
      code = (code || '').trim().toUpperCase();
      if (!code) return Promise.resolve(null);
      if (code === 'DEMO') return Promise.resolve({ name: '체험 학교', demo: true });
      return ensureInit().then(function (db) {
        if (!db) return null;
        return db.ref('parentEdu/schools/' + code).once('value').then(function (snap) {
          var v = snap.val();
          return v ? { name: v.name || code, level: v.level || '', totalParents: v.totalParents || null } : null;
        });
      }).catch(function () { return null; });
    },

    logEnter: function () {
      if (sessionStorage.getItem('pe_entered')) return Promise.resolve(false);
      sessionStorage.setItem('pe_entered', '1');
      var p = logEvent('enter', { withClass: true });
      var firstKey = 'pe_first_enter_' + school();
      if (hasSchool() && !localStorage.getItem(firstKey)) {
        localStorage.setItem(firstKey, '1');
        bumpCounter('parentEdu/stats/' + school() + '/enterCount');
      }
      return p;
    },

    logCheckDone: function (contentId) {
      if (!hasSchool()) return Promise.resolve(false);
      var p = logEvent('check_done', { contentId: contentId, withClass: false, once: 'pe_evt_' + contentId });
      if (!localStorage.getItem('pe_cnt_' + contentId)) {
        localStorage.setItem('pe_cnt_' + contentId, '1');
        bumpCounter('parentEdu/content/' + school() + '/' + contentId);
      }
      return p;
    },

    logModuleDone: function (contentId) {
      var p = logEvent('module_done', { contentId: contentId, withClass: true, once: 'pe_evt_' + contentId });
      if (!localStorage.getItem('pe_cnt_' + contentId)) {
        localStorage.setItem('pe_cnt_' + contentId, '1');
        bumpCounter('parentEdu/content/' + school() + '/' + contentId);
      }
      return p;
    },

    logCourseDone: function () {
      var key = 'pe_evt_course_done';
      if (localStorage.getItem(key)) return Promise.resolve(false);
      var p = logEvent('course_done', { withClass: true, once: key });
      bumpCounter('parentEdu/stats/' + school() + '/courseDoneCount');
      return p;
    },

    pushSurvey: function (q1, q2, q3) {
      if (!hasSchool()) return Promise.resolve(false);
      return ensureInit().then(function (db) {
        if (!db) return false;
        var row = { q1: q1, q2: q2, ts: firebase.database.ServerValue.TIMESTAMP };
        if (q3 && q3.trim()) row.q3 = q3.trim().slice(0, 100);
        return db.ref('parentEdu/survey/' + school()).push(row).then(function () { return true; });
      }).catch(function () { return false; });
    },

    logCert: function (data, consent) {
      if (!hasSchool()) return Promise.resolve(false);
      bumpCounter('parentEdu/stats/' + school() + '/certCount');
      if (!consent) return Promise.resolve(true);
      return ensureInit().then(function (db) {
        if (!db) return false;
        var row = {
          parentName: data.parentName,
          childGrade: data.childGrade,
          childClass: data.childClass || '',
          completedAt: data.completedAt,
          consentAt: firebase.database.ServerValue.TIMESTAMP
        };
        if (data.childName) row.childName = data.childName;
        return db.ref('parentEdu/certs/' + school()).push(row).then(function () { return true; });
      }).catch(function () { return false; });
    },

    getStats: function (code) {
      code = code || school();
      if (!code || code === 'DEMO') return Promise.resolve(null);
      return ensureInit().then(function (db) {
        if (!db) return null;
        return db.ref('parentEdu/stats/' + code).once('value').then(function (s) { return s.val(); });
      }).catch(function () { return null; });
    },

    getContentCounts: function (code) {
      code = code || school();
      if (!code || code === 'DEMO') return Promise.resolve(null);
      return ensureInit().then(function (db) {
        if (!db) return null;
        return db.ref('parentEdu/content/' + code).once('value').then(function (s) { return s.val(); });
      }).catch(function () { return null; });
    },

    verifyAdmin: function (code, tokenHash) {
      return ensureInit().then(function (db) {
        if (!db) return false;
        return db.ref('parentEdu/schools/' + code + '/adminToken').once('value').then(function (s) {
          var stored = s.val();
          return !!stored && stored === tokenHash;
        });
      }).catch(function () { return false; });
    },
    getEvents: function (code) {
      return ensureInit().then(function (db) {
        if (!db) return null;
        return db.ref('parentEdu/events/' + code).once('value').then(function (s) { return s.val(); });
      }).catch(function () { return null; });
    },
    getCerts: function (code) {
      return ensureInit().then(function (db) {
        if (!db) return null;
        return db.ref('parentEdu/certs/' + code).once('value').then(function (s) { return s.val(); });
      }).catch(function () { return null; });
    },
    getSurveys: function (code) {
      return ensureInit().then(function (db) {
        if (!db) return null;
        return db.ref('parentEdu/survey/' + code).once('value').then(function (s) { return s.val(); });
      }).catch(function () { return null; });
    },
    getSchoolInfo: function (code) {
      return ensureInit().then(function (db) {
        if (!db) return null;
        return db.ref('parentEdu/schools/' + code).once('value').then(function (s) { return s.val(); });
      }).catch(function () { return null; });
    }
  };

  window.HomeDB = HomeDB;
})();
