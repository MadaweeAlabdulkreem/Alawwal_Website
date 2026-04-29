/* ========================================================
   منصة الأول v2 — script.js
   ======================================================== */

/* ── Header scroll ── */
(function(){
  const h = document.querySelector('.hdr');
  if(!h) return;
  const fn = () => h.classList.toggle('solid', window.scrollY > 60);
  window.addEventListener('scroll', fn, {passive:true}); fn();
})();

/* ── Hamburger ── */
(function(){
  const b = document.querySelector('.burger');
  const n = document.querySelector('.nav');
  if(!b||!n) return;
  b.addEventListener('click', () => { b.classList.toggle('open'); n.classList.toggle('open'); });
  n.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    b.classList.remove('open'); n.classList.remove('open');
  }));
})();

/* ── Team card lift on click ── */
(function(){
  document.addEventListener('mouseenter', function(e){
    const card = e.target.closest('.team-card');
    if(!card) return;
    card.classList.remove('lifting');
    void card.offsetWidth;
    card.classList.add('lifting');
    card.addEventListener('animationend', () => card.classList.remove('lifting'), {once:true});
  }, true);
})();

/* ── Scroll reveal ── */
(function(){
  const els = document.querySelectorAll('.reveal');
  if(!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, {threshold:.12});
  els.forEach(el => obs.observe(el));
})();


/* ── Marquee duplicate for seamless loop ── */
(function(){
  const track = document.querySelector('.ticker-track');
  if(!track) return;
  const clone = track.innerHTML;
  track.innerHTML = clone + clone; // duplicate for seamless
})();

/* ======================== CAROUSEL (infinite loop) ======================== */
(() => {
  const track   = document.getElementById('carouselTrack');
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');
  if (!track || !nextBtn || !prevBtn) return;

  const N = track.querySelectorAll('.item').length; // عدد العناصر الأصليين
  track.innerHTML = track.innerHTML.repeat(3);       // ثلاث نسخ

  const GAP = 20;
  let idx  = N;    // نبدأ من المجموعة الوسطى
  let busy = false;

  const cardW = () => {
    const c = track.querySelector('.item');
    return c ? c.offsetWidth + GAP : 200;
  };

  function setPos(i, anim) {
    if (!anim) {
      track.style.transition = 'none';
      void track.offsetWidth; // force reflow
      busy = false;
    } else {
      track.style.transition = 'transform .5s ease';
    }
    track.style.transform = `translateX(${-i * cardW()}px)`;
    idx = i;
  }

  setPos(N, false);

  // بعد كل حركة: إذا خرجنا عن النسخة الوسطى → ارجع بصمت
  track.addEventListener('transitionend', () => {
    if      (idx < N)       setPos(idx + N, false);
    else if (idx >= N * 2)  setPos(idx - N, false);
    else                    busy = false;
  });

  nextBtn.addEventListener('click', () => { if (!busy) { busy = true; setPos(idx + 1, true); } });
  prevBtn.addEventListener('click', () => { if (!busy) { busy = true; setPos(idx - 1, true); } });
  window.addEventListener('resize', () => setPos(idx, false));
})();

/* ======================== TYPEWRITER ======================== */
(function(){
  const sec   = document.querySelector('.anim-sec');
  if(!sec) return;
  const logo  = sec.querySelector('.anim-logo');
  const tw    = sec.querySelector('.tw');
  if(!logo||!tw) return;

  const phrases = [
    {t:'كن الأول',             c:'c-Y'},
    {t:'اكتشف شغفك',           c:'c-T'},
    {t:'رحلة التعلم تبدأ معنا', c:'c-W'},
    {t:'القمة تنتظرك',         c:'c-Y'},
  ];
  let pi=0, ci=0, timer;
  const LOGO_DUR=1700, TYP=90, PAUSE=2200, ERASE=45;

  function showLogo(){
    tw.classList.remove('show'); tw.innerHTML='';
    logo.classList.remove('hide');
    timer = setTimeout(typing, LOGO_DUR);
  }
  function typing(){
    logo.classList.add('hide');
    const p = phrases[pi];
    tw.className = `tw ${p.c}`;
    tw.innerHTML = '<span class="cursor"></span>';
    ci = 0; setTimeout(typeChar, 300);
  }
  function typeChar(){
    const p = phrases[pi];
    if(ci <= p.t.length){
      const cur = tw.querySelector('.cursor');
      tw.textContent = p.t.slice(0,ci);
      tw.appendChild(cur);
      tw.classList.add('show');
      ci++; timer = setTimeout(typeChar, TYP);
    } else { timer = setTimeout(erase, PAUSE); }
  }
  function erase(){
    const p = phrases[pi]; ci = p.t.length;
    function step(){
      if(ci>0){
        const cur = tw.querySelector('.cursor');
        tw.textContent = p.t.slice(0,ci-1); tw.appendChild(cur); ci--;
        timer = setTimeout(step, ERASE);
      } else {
        tw.classList.remove('show');
        pi = (pi+1) % phrases.length;
        timer = setTimeout(showLogo, 350);
      }
    }
    step();
  }

  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ showLogo(); obs.unobserve(e.target); } });
  },{threshold:.4});
  obs.observe(sec);
})();

/* ======================== QUIZ ======================== */
const Qs = [
  {
    text:'ما الذي يثيرك أكثر عند التفكير في المستقبل؟',
    opts:['استكشاف الكواكب والفضاء الخارجي','علاج الأمراض وإنقاذ الأرواح','نقل الأخبار والتواصل مع الناس','ابتكار تقنيات تغيّر العالم'],
  },
  {
    text:'كيف تصف نفسك في وقت الفراغ؟',
    opts:['أراقب النجوم وأقرأ عن الكون','أهتم بصحتي وصحة من حولي','أحب التصوير وسرد القصص','أبني وأجرّب وأصنع أشياء'],
  },
  {
    text:'ما الإنجاز الذي تتمنى أن يُذكر به اسمك؟',
    opts:['اكتشاف كوكب أو ظاهرة كونية','اختراع علاج لمرض خطير','تقديم برنامج إعلامي يؤثر في الملايين','تصميم جهاز تقني ثوري'],
  },
];
const LTR = ['أ','ب','ج','د'];

(function(){
  const questionEl = document.getElementById('quizQuestion');
  const optsEl    = document.getElementById('quizOpts');
  if(!questionEl || !optsEl) return;
  let cur = 0;

  function render(){
    const q = Qs[cur];
    document.querySelectorAll('.qdot').forEach((d,i)=>{
      d.className = 'qdot' + (i===cur?' active':i<cur?' done':'');
    });
    questionEl.style.opacity='0'; questionEl.style.transform='translateY(20px)';
    optsEl.style.opacity='0';     optsEl.style.transform='translateY(30px)';
    setTimeout(()=>{
      questionEl.innerHTML = `<h1>${q.text}</h1>`;
      optsEl.innerHTML = q.opts.map((o,i)=>`
        <button class="q-tri-btn" data-i="${i}">
          <div class="q-tri-bg"></div>
          <div class="q-tri-content">${o}</div>
        </button>`).join('');
      optsEl.querySelectorAll('.q-tri-btn').forEach(b=>b.addEventListener('click',next));
      questionEl.style.transition='opacity .4s ease,transform .4s ease';
      optsEl.style.transition='opacity .5s ease .1s,transform .5s ease .1s';
      questionEl.style.opacity='1'; questionEl.style.transform='translateY(0)';
      optsEl.style.opacity='1';     optsEl.style.transform='translateY(0)';
    },220);
  }
  function next(){
    if(cur < Qs.length-1){ cur++; render(); }
    else window.location.href='loading.html';
  }
  render();
})();

/* ===== CLEAN LOADING SCRIPT ===== */

document.addEventListener('DOMContentLoaded', () => {

  const page = document.querySelector('.load-custom');
  if(!page) return;

  const fill  = document.querySelector('.ring .fill');
  const pctEl = document.getElementById('pct');
  const msgEl = document.getElementById('msg');

  const msgs = [
    'نحلل شخصيتك...',
    'نكتشف مجالك...',
    'جاري تجهيز النتيجة...'
  ];

  let pct = 0;
  let i   = 0;

  const C = 440;

  function update(p){
    if(fill) fill.style.strokeDashoffset = C - (C * p / 100);
    if(pctEl) pctEl.textContent = Math.round(p) + '%';
  }

  /* تغيير النص */
  setInterval(()=>{
    if(!msgEl) return;
    msgEl.style.opacity = 0;

    setTimeout(()=>{
      msgEl.textContent = msgs[i++ % msgs.length];
      msgEl.style.opacity = 1;
    }, 300);

  }, 1200);

  /* التقدم */
  const duration = 6000; // مدة التحميل (6 ثواني)
  const start = Date.now();

const timer = setInterval(() => {
  const elapsed = Date.now() - start;
  let progress = (elapsed / duration) * 100;

  if(progress >= 100){
    progress = 100;
    update(progress);
    clearInterval(timer);

    setTimeout(()=>{
      window.location.href = 'result.html';
    }, 600);

  } else {
    update(progress);
  }

}, 50);

});

/* ======================== PIONEERS DETAIL ======================== */
const PIOS=[
  {n:'جمال العنزي',   f:'إعلامي متميز',         ph:'assets/p1.png'},
  {n:'عمادة الشريف',  f:'رائد أعمال',             ph:'assets/p2.png'},
  {n:'سارة الطيار',   f:'طبيبة متخصصة',           ph:'assets/p3.png'},
  {n:'خالد المانع',   f:'علوم الفضاء',             ph:'assets/p4.png'},
  {n:'نورة الدوسري',  f:'إعلامية',                ph:'assets/p5.png'},
  {n:'أحمد المالكي',  f:'باحث في الطب',           ph:'assets/p6.png'},
  {n:'هيفاء محمود',   f:'مهندسة مشاريع',          ph:'assets/p7.png'},
  {n:'فيصل الغامدي',  f:'فضاء وتكنولوجيا',        ph:'assets/p8.png'},
  {n:'منيرة العتيبي', f:'طبيبة وباحثة',            ph:'assets/p9.png'},
  {n:'رائد المطيري',  f:'ريادة أعمال',             ph:'assets/p10.png'},
];

const bios=[
  'شخصية إعلامية سعودية بارزة أسهمت في تطوير المشهد الإعلامي العربي وإلهام الأجيال الشابة عبر مسيرة احترافية طويلة.',
  'رائد أعمال سعودي ناجح حقق إنجازات استثنائية في مجاله وأصبح مرجعاً للشباب الطموح الساعي نحو بناء مستقبل مشرق.',
  'طبيبة متخصصة جمعت بين التميز الأكاديمي والعمل الميداني، وأسهمت في تطوير بروتوكولات طبية تُنقذ حياة المرضى.',
  'باحث في علوم الفضاء والفلك ساهم في مشاريع علمية متقدمة تدفع الطموح العربي نحو استكشاف الكون.',
  'إعلامية سعودية متميزة تحمل رسالة توعوية قوية وتُلهم الشباب بمحتوى هادف يصنع الفارق.',
  'طبيب باحث يجمع بين الكفاءة العلمية والإنسانية، ويسعى إلى تقديم حلول طبية مبتكرة في مجال اختصاصه.',
  'مهندسة مشاريع تقنية تمكّنت من قيادة فرق عمل متعددة وتحقيق نتائج ملموسة في بيئات عمل تنافسية.',
  'خبير في تكنولوجيا الفضاء والاتصالات يعمل على ربط التقنية الحديثة باحتياجات التنمية الوطنية.',
  'طبيبة وباحثة في المجال الصحي أثبتت حضوراً علمياً قوياً على الصعيدين المحلي والدولي.',
  'رائد أعمال شاب نجح في تأسيس شركات ناشئة ويُعدّ نموذجاً ملهماً لجيل التحول والإنجاز.',
];

(function(){
  const list=document.getElementById('pioList');
  const detail=document.getElementById('pioDetail');
  if(!list||!detail) return;

  PIOS.forEach((p,i)=>{
    const el=document.createElement('div');
    el.className='pio-thumb'+(i===0?' active':'');
    el.innerHTML=`<img class="pio-t-photo" src="${p.ph}" alt="${p.n}" loading="lazy"><div class="pio-t-info"><h4>${p.n}</h4><span>${p.f}</span></div>`;
    el.addEventListener('click',()=>{ document.querySelectorAll('.pio-thumb').forEach(t=>t.classList.remove('active')); el.classList.add('active'); renderDetail(i); });
    list.appendChild(el);
  });

  function renderDetail(i){
    const p=PIOS[i];
    detail.style.opacity='0';
    setTimeout(()=>{
      detail.innerHTML=`
        <img class="pio-d-photo" src="${p.ph}" alt="${p.n}">
        <div class="pio-d-name">${p.n}</div>
        <div class="pio-d-field">${p.f}</div>
        <p class="pio-d-bio">${bios[i]}</p>
        <button class="btn-Y" onclick="alert('ميزة الحوار مع ${p.n} قيد التطوير 🚀')">جرّب مع ${p.n}</button>`;
      detail.style.transition='opacity .4s ease';
      detail.style.opacity='1';
    },200);
  }
  renderDetail(0);
})();


const track = document.getElementById("carouselTrack");
const items = document.querySelectorAll(".item");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

let index = 0;
const visible = 4;

function getStep() {
  const item = items[0];
  const style = getComputedStyle(track);
  const gap = parseInt(style.gap) || 30;

  return item.getBoundingClientRect().width + gap;
}

function update() {
  track.style.transform = `translateX(${-index * getStep()}px)`;
}

function nextSlide() {
  const max = items.length - visible;

  if (index >= max) {
    index = 0; // يرجع للبداية
  } else {
    index++;
  }

  update();
}

function prevSlide() {
  const max = items.length - visible;

  if (index <= 0) {
    index = max;
  } else {
    index--;
  }

  update();
}

next.addEventListener("click", nextSlide);
prev.addEventListener("click", prevSlide);

window.addEventListener("resize", update);

update();