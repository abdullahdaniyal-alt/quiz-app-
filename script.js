(function () {
  var questions = [
    { cat: "HTML", q: "What does HTML stand for?",
      a: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Link", "Home Tool Markup Language"], c: 0,
      why: "HTML is the standard markup language that describes the structure of web pages." },
    { cat: "CSS", q: "Which CSS property changes the text colour?",
      a: ["font-style", "color", "text-align", "background"], c: 1,
      why: "The color property sets the colour of text. background sets the background instead." },
    { cat: "JavaScript", q: "Which tag is used to link a JavaScript file to an HTML page?",
      a: ["<js>", "<link>", "<script>", "<style>"], c: 2,
      why: "Use a script tag with a src attribute that points to your file. The link tag is for stylesheets." },
    { cat: "JavaScript", q: "How do you declare a variable that cannot be reassigned?",
      a: ["var", "let", "const", "static"], c: 2,
      why: "const creates a binding that cannot be reassigned after it is set." },
    { cat: "CSS", q: "Which CSS layout module is built for one-dimensional rows and columns?",
      a: ["Flexbox", "Float", "Table", "Position"], c: 0,
      why: "Flexbox lays items out along one axis. CSS Grid handles two dimensions." },
    { cat: "JavaScript", q: "What does the === operator check?",
      a: ["Value only", "Type only", "Value and type", "Reference only"], c: 2,
      why: "Strict equality compares both value and type, with no type conversion." },
    { cat: "JavaScript", q: "Which array method adds an element to the end?",
      a: ["pop()", "shift()", "unshift()", "push()"], c: 3,
      why: "push() appends to the end. pop() removes from the end." },
    { cat: "CSS", q: "Which CSS unit is relative to the width of the viewport?",
      a: ["px", "vw", "pt", "cm"], c: 1,
      why: "1vw equals 1% of the viewport width." }
  ];

  var L = ["A", "B", "C", "D"];
  var ICON = {
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    cross: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    redo:  '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"/></svg>',
    list:  '<svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>'
  };

  var index = 0, score = 0, answered = false, answers = [];
  var box = document.getElementById("screen");
  var bar = document.getElementById("bar");
  var meta = document.getElementById("meta");
  var pill = document.getElementById("pill");
  var progressWrap = document.getElementById("progressWrap");

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function swap(fn) { box.classList.add("out"); setTimeout(fn, 200); }
  function show(html) { box.innerHTML = html; box.className = "screen"; }

  function renderStart() {
    index = 0; score = 0; answers = [];
    pill.classList.add("hide"); progressWrap.style.display = "none"; meta.style.display = "none";
    show('<div class="intro">' +
      '<div class="badge"><svg viewBox="0 0 24 24"><path d="M9.5 9a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1 1-1.1 1.8M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg></div>' +
      '<h1>Front-End Basics Quiz</h1>' +
      '<p>Test your knowledge of HTML, CSS and JavaScript. You get instant feedback and a full review at the end.</p>' +
      '<div class="facts"><span class="fact">' + questions.length + ' questions</span><span class="fact">Multiple choice</span><span class="fact">About 3 minutes</span></div>' +
      '<button type="button" class="btn" id="startBtn">Start quiz ' + ICON.arrow + '</button></div>');
  }

  function renderQuestion() {
    var item = questions[index];
    answered = false;
    pill.classList.remove("hide"); progressWrap.style.display = ""; meta.style.display = "";
    pill.textContent = "Score " + score;
    meta.innerHTML = '<span>Question ' + (index + 1) + ' of ' + questions.length + '</span><span class="chip">' + item.cat + '</span>';
    bar.style.width = (index / questions.length * 100) + "%";

    var html = '<h2 class="question">' + esc(item.q) + '</h2><div class="options">';
    item.a.forEach(function (t, i) {
      html += '<button type="button" class="option" data-i="' + i + '"><span class="letter">' + L[i] + '</span><span>' + esc(t) + '</span><span class="mark"></span></button>';
    });
    html += '</div><div class="explain" id="explain" aria-live="polite"></div>' +
      '<div class="actions"><span class="hint">Tip: press A–D to answer, Enter to continue</span>' +
      '<button type="button" class="btn" id="nextBtn" disabled>' + (index === questions.length - 1 ? "Submit" : "Next") + ' ' + ICON.arrow + '</button></div>';
    show(html);
  }

  function choose(i) {
    if (answered) return;
    answered = true;
    var item = questions[index], right = i === item.c;
    answers[index] = i;
    if (right) score++;
    box.querySelectorAll(".option").forEach(function (o, k) {
      o.disabled = true;
      if (k === item.c) { o.classList.add("correct"); o.querySelector(".mark").innerHTML = ICON.check; }
      else if (k === i) { o.classList.add("wrong"); o.querySelector(".mark").innerHTML = ICON.cross; }
    });
    var ex = document.getElementById("explain");
    ex.innerHTML = '<b>' + (right ? "Correct. " : "Not quite. ") + '</b>' + esc(item.why);
    ex.classList.add("show");
    pill.textContent = "Score " + score;
    bar.style.width = ((index + 1) / questions.length * 100) + "%";
    var nb = document.getElementById("nextBtn");
    nb.disabled = false; nb.focus({ preventScroll: true });
  }

  function next() {
    if (!answered) return;
    swap(function () { index++; index < questions.length ? renderQuestion() : renderResult(); });
  }

  function renderResult() {
    var total = questions.length, pct = Math.round(score / total * 100);
    var title = pct === 100 ? "Perfect score!" : pct >= 70 ? "Great job!" : pct >= 40 ? "Good effort!" : "Keep practising!";
    var msg = pct >= 70 ? "You have a solid grasp of the front-end basics." : "Review the explanations below and try again to improve.";
    bar.style.width = "100%"; progressWrap.style.display = ""; meta.style.display = "none";
    pill.classList.remove("hide"); pill.textContent = "Score " + score;

    var rv = "";
    questions.forEach(function (item, k) {
      var ok = answers[k] === item.c;
      rv += '<div class="rv ' + (ok ? "ok" : "bad") + '"><span class="ic">' + (ok ? ICON.check : ICON.cross) + '</span><div>' +
        '<h3>' + (k + 1) + '. ' + esc(item.q) + '</h3>' +
        '<p>Your answer: <b>' + esc(item.a[answers[k]]) + '</b>' + (ok ? "" : ' &nbsp;•&nbsp; Correct: <b>' + esc(item.a[item.c]) + '</b>') + '</p></div></div>';
    });

    show('<div class="result"><div class="ring" id="ring"><span>' + pct + '%</span></div>' +
      '<h2>' + title + '</h2><p>' + msg + '</p>' +
      '<div class="stats"><div class="stat ok"><b>' + score + '</b><small>Correct</small></div>' +
      '<div class="stat bad"><b>' + (total - score) + '</b><small>Wrong</small></div>' +
      '<div class="stat"><b>' + total + '</b><small>Total</small></div></div>' +
      '<div class="btn-row"><button type="button" class="btn" id="restartBtn">' + ICON.redo + ' Restart quiz</button>' +
      '<button type="button" class="btn btn-ghost" id="reviewBtn">' + ICON.list + ' Review answers</button></div>' +
      '<div class="review" id="review">' + rv + '</div></div>');

    var ring = document.getElementById("ring"), n = 0;
    var t = setInterval(function () { n += 2; if (n >= pct) { n = pct; clearInterval(t); } ring.style.setProperty("--p", n); }, 15);
  }

  box.addEventListener("click", function (e) {
    var t = e.target;
    var opt = t.closest(".option");
    if (opt) return choose(Number(opt.dataset.i));
    if (t.closest("#startBtn")) return swap(renderQuestion);
    if (t.closest("#nextBtn")) return next();
    if (t.closest("#restartBtn")) return swap(renderStart);
    if (t.closest("#reviewBtn")) {
      var r = document.getElementById("review");
      var open = r.classList.toggle("show");
      if (open) r.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });

  document.addEventListener("keydown", function (e) {
    var k = e.key.toUpperCase(), i = L.indexOf(k);
    if (i < 0 && /^[1-4]$/.test(k)) i = Number(k) - 1;
    if (i >= 0 && box.querySelector(".option") && !answered) { choose(i); return; }
    if (e.key === "Enter" && answered && document.activeElement !== document.getElementById("nextBtn")) { e.preventDefault(); next(); }
  });

  renderStart();
})();
