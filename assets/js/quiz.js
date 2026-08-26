/* ============================================================
   quiz.js — ClassMap HOME 공용 렌더러
   1) ScaleCheck  : 4점 척도 진단 (1페이지 스크롤형, 클라이언트 계산 전용)
   2) ModuleQuiz  : 코스 확인 문항 (객관식, 즉시 채점, 오답 해설 후 재시도)
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- ScaleCheck ----------------
     opts: {
       mount: '#id', items: ['문항', ...],
       labels: ['전혀 없다','가끔 있다','자주 있다','거의 항상'],  // 0~3점
       submitText: '결과 보기',
       onResult: function(answers[], total) {}
     } */
  function ScaleCheck(opts) {
    var mount = document.querySelector(opts.mount);
    var labels = opts.labels || ['전혀 아니다', '아니다', '그렇다', '매우 그렇다'];
    var answers = new Array(opts.items.length).fill(null);

    var html = opts.items.map(function (q, i) {
      var btns = labels.map(function (lb, v) {
        return '<button type="button" class="scale-btn" data-q="' + i + '" data-v="' + v + '">' + lb + '</button>';
      }).join('');
      return '<div class="q-item"><div class="q-text"><span class="q-no">' + (i + 1) + '</span>' + q + '</div>' +
             '<div class="scale-row">' + btns + '</div></div>';
    }).join('');

    html += '<div class="mt16"><button type="button" class="btn btn-primary" id="scSubmit" disabled>' +
            (opts.submitText || '결과 보기') + '</button>' +
            '<p class="small tc mt8" id="scRemain">' + opts.items.length + '개 문항에 모두 답해주세요</p></div>';
    mount.innerHTML = html;

    var submitBtn = mount.querySelector('#scSubmit');
    var remainEl = mount.querySelector('#scRemain');

    mount.addEventListener('click', function (e) {
      var btn = e.target.closest('.scale-btn');
      if (!btn) return;
      var q = Number(btn.dataset.q), v = Number(btn.dataset.v);
      answers[q] = v;
      mount.querySelectorAll('.scale-btn[data-q="' + q + '"]').forEach(function (b) {
        b.classList.toggle('on', Number(b.dataset.v) === v);
      });
      var remain = answers.filter(function (a) { return a === null; }).length;
      if (remain === 0) {
        submitBtn.disabled = false;
        remainEl.textContent = '';
      } else {
        remainEl.textContent = remain + '개 문항이 남았어요';
      }
    });

    submitBtn.addEventListener('click', function () {
      var total = answers.reduce(function (s, a) { return s + a; }, 0);
      opts.onResult(answers.slice(), total);
    });
  }

  /* ---------------- ModuleQuiz ----------------
     opts: {
       mount: '#id',
       questions: [{ q, options: [...], answer: idx, explain: '해설' }, ...],
       onComplete: function() {}   // 전 문항 정답 시 1회 호출
     } */
  function ModuleQuiz(opts) {
    var mount = document.querySelector(opts.mount);
    var solved = new Array(opts.questions.length).fill(false);
    var completed = false;

    var ic = window.PEIcon || function () { return ''; };
    var html = '<div class="quiz-title">' + ic('pencil') + ' 확인 문항 (' + opts.questions.length + '개)</div>';
    html += opts.questions.map(function (item, qi) {
      var optsHtml = item.options.map(function (op, oi) {
        return '<button type="button" class="quiz-opt" data-q="' + qi + '" data-o="' + oi + '">' +
               String.fromCharCode(9312 + oi) + ' ' + op + '</button>';
      }).join('');
      return '<div class="quiz-q-block" data-block="' + qi + '" style="margin-bottom:20px;">' +
             '<div class="quiz-q">Q' + (qi + 1) + '. ' + item.q + '</div>' + optsHtml +
             '<div class="quiz-feedback" data-fb="' + qi + '"></div></div>';
    }).join('');
    mount.innerHTML = html;

    mount.addEventListener('click', function (e) {
      var btn = e.target.closest('.quiz-opt');
      if (!btn) return;
      var qi = Number(btn.dataset.q), oi = Number(btn.dataset.o);
      if (solved[qi]) return;
      var item = opts.questions[qi];
      var fb = mount.querySelector('[data-fb="' + qi + '"]');
      var blockBtns = mount.querySelectorAll('.quiz-opt[data-q="' + qi + '"]');

      if (oi === item.answer) {
        solved[qi] = true;
        blockBtns.forEach(function (b) {
          b.classList.remove('wrong');
          if (Number(b.dataset.o) === oi) b.classList.add('correct');
        });
        fb.className = 'quiz-feedback good show';
        fb.innerHTML = (window.PEIcon ? window.PEIcon('check') : '') + ' 맞았어요! ' + (item.explain || '');
        if (!completed && solved.every(Boolean)) {
          completed = true;
          opts.onComplete();
        }
      } else {
        btn.classList.add('wrong');
        fb.className = 'quiz-feedback bad show';
        fb.textContent = '다시 한번 생각해 보세요. ' + (item.explain || '');
      }
    });
  }

  window.ScaleCheck = ScaleCheck;
  window.ModuleQuiz = ModuleQuiz;
})();
