/* ============================================================
   منصة الأول — Auth Page Logic
   ============================================================ */

/* ── Tab switching ── */
function switchTab(tab) {
  const slider   = document.getElementById('tabSlider');
  const loginBtn = document.getElementById('tab-login');
  const signupBtn= document.getElementById('tab-signup');
  const loginPanel  = document.getElementById('panel-login');
  const signupPanel = document.getElementById('panel-signup');

  if (tab === 'login') {
    loginBtn.classList.add('active');
    signupBtn.classList.remove('active');
    loginPanel.classList.add('active');
    signupPanel.classList.remove('active');
    slider.classList.remove('moved');
    loginBtn.setAttribute('aria-selected', 'true');
    signupBtn.setAttribute('aria-selected', 'false');
  } else {
    signupBtn.classList.add('active');
    loginBtn.classList.remove('active');
    signupPanel.classList.add('active');
    loginPanel.classList.remove('active');
    slider.classList.add('moved');
    signupBtn.setAttribute('aria-selected', 'true');
    loginBtn.setAttribute('aria-selected', 'false');
  }
  clearAllErrors();
}

/* ── Eye toggle ── */
function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.querySelector('.eye-open').style.display  = isHidden ? 'none'  : '';
  btn.querySelector('.eye-close').style.display = isHidden ? ''      : 'none';
}

/* ── Validation helpers ── */
function showErr(fieldId, msg) {
  const input = document.getElementById(fieldId);
  const err   = document.getElementById(fieldId + '-err');
  if (!input || !err) return;
  input.classList.add('error');
  input.classList.remove('valid');
  err.textContent = msg;
  err.classList.add('show');
}

function clearErr(fieldId) {
  const input = document.getElementById(fieldId);
  const err   = document.getElementById(fieldId + '-err');
  if (!input || !err) return;
  input.classList.remove('error');
  err.textContent = '';
  err.classList.remove('show');
}

function markValid(fieldId) {
  const input = document.getElementById(fieldId);
  if (!input) return;
  input.classList.remove('error');
  input.classList.add('valid');
  clearErr(fieldId);
}

function clearAllErrors() {
  document.querySelectorAll('.err-msg').forEach(el => {
    el.textContent = '';
    el.classList.remove('show');
  });
  document.querySelectorAll('input').forEach(el => {
    el.classList.remove('error', 'valid');
  });
}

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRx = /^[+\d\s\-()]{7,15}$/;

/* ── Password strength ── */
function checkStrength(val) {
  const meter = document.getElementById('strengthMeter');
  const label = document.getElementById('strengthLabel');
  const bars  = [
    document.getElementById('sb1'),
    document.getElementById('sb2'),
    document.getElementById('sb3'),
    document.getElementById('sb4')
  ];

  const hasLen = val.length >= 8;
  const hasNum = /\d/.test(val);
  const hasSym = /[^a-zA-Z0-9؀-ۿ]/.test(val);
  const hasUpp = /[A-Z]/.test(val);

  /* Rule indicators */
  toggleRule('rule-len', hasLen);
  toggleRule('rule-num', hasNum);
  toggleRule('rule-sym', hasSym);

  if (!val) {
    meter.classList.remove('visible');
    bars.forEach(b => b.className = 'sbar');
    return;
  }

  meter.classList.add('visible');

  let score = 0;
  if (hasLen) score++;
  if (hasNum) score++;
  if (hasSym) score++;
  if (hasUpp) score++;

  bars.forEach(b => b.className = 'sbar');

  if (score <= 1) {
    bars[0].classList.add('weak');
    label.textContent = 'ضعيفة';
    label.className = 'strength-label weak';
  } else if (score === 2) {
    bars[0].classList.add('medium');
    bars[1].classList.add('medium');
    label.textContent = 'متوسطة';
    label.className = 'strength-label medium';
  } else if (score === 3) {
    bars[0].classList.add('strong');
    bars[1].classList.add('strong');
    bars[2].classList.add('strong');
    label.textContent = 'جيدة';
    label.className = 'strength-label strong';
  } else {
    bars.forEach(b => b.classList.add('strong'));
    label.textContent = 'قوية';
    label.className = 'strength-label strong';
  }
}

function toggleRule(id, ok) {
  const li = document.getElementById(id);
  if (!li) return;
  li.classList.toggle('ok', ok);
}

/* ── Login submit ── */
function submitLogin(e) {
  e.preventDefault();
  let valid = true;

  const email = document.getElementById('l-email').value.trim();
  const pass  = document.getElementById('l-pass').value;

  clearErr('l-email');
  clearErr('l-pass');

  if (!email) {
    showErr('l-email', 'البريد الإلكتروني مطلوب');
    valid = false;
  } else if (!emailRx.test(email)) {
    showErr('l-email', 'صيغة البريد الإلكتروني غير صحيحة');
    valid = false;
  } else {
    markValid('l-email');
  }

  if (!pass) {
    showErr('l-pass', 'كلمة المرور مطلوبة');
    valid = false;
  } else if (pass.length < 6) {
    showErr('l-pass', 'كلمة المرور قصيرة جداً');
    valid = false;
  } else {
    markValid('l-pass');
  }

  if (!valid) return;

  setLoading('loginForm', true);

  /* Simulate async — replace with real API call */
  setTimeout(() => {
    setLoading('loginForm', false);
    showSuccessScreen(null, true);
  }, 1800);
}

/* ── Sign up submit ── */
function submitSignup(e) {
  e.preventDefault();
  let valid = true;

  const name    = document.getElementById('s-name').value.trim();
  const email   = document.getElementById('s-email').value.trim();
  const phone   = document.getElementById('s-phone').value.trim();
  const pass    = document.getElementById('s-pass').value;
  const confirm = document.getElementById('s-confirm').value;

  ['s-name','s-email','s-phone','s-pass','s-confirm'].forEach(clearErr);

  if (!name || name.length < 3) {
    showErr('s-name', 'يرجى إدخال اسمك الكامل (٣ أحرف على الأقل)');
    valid = false;
  } else {
    markValid('s-name');
  }

  if (!email) {
    showErr('s-email', 'البريد الإلكتروني مطلوب');
    valid = false;
  } else if (!emailRx.test(email)) {
    showErr('s-email', 'صيغة البريد الإلكتروني غير صحيحة');
    valid = false;
  } else {
    markValid('s-email');
  }

  if (!phone) {
    showErr('s-phone', 'رقم الهاتف مطلوب');
    valid = false;
  } else if (!phoneRx.test(phone)) {
    showErr('s-phone', 'رقم الهاتف غير صحيح (أرقام فقط، ٧-١٥ خانة)');
    valid = false;
  } else {
    markValid('s-phone');
  }

  const hasLen = pass.length >= 8;
  const hasNum = /\d/.test(pass);
  const hasSym = /[^a-zA-Z0-9؀-ۿ]/.test(pass);

  if (!pass) {
    showErr('s-pass', 'كلمة المرور مطلوبة');
    valid = false;
  } else if (!hasLen) {
    showErr('s-pass', 'يجب أن تكون كلمة المرور ٨ أحرف على الأقل');
    valid = false;
  } else if (!hasNum) {
    showErr('s-pass', 'يجب أن تحتوي على رقم واحد على الأقل');
    valid = false;
  } else if (!hasSym) {
    showErr('s-pass', 'يجب أن تحتوي على رمز خاص (! @ # ...)');
    valid = false;
  } else {
    markValid('s-pass');
  }

  if (!confirm) {
    showErr('s-confirm', 'يرجى تأكيد كلمة المرور');
    valid = false;
  } else if (confirm !== pass) {
    showErr('s-confirm', 'كلمتا المرور غير متطابقتين');
    valid = false;
  } else {
    markValid('s-confirm');
  }

  if (!valid) return;

  setLoading('signupForm', true);

  /* Simulate async — replace with real API call */
  setTimeout(() => {
    setLoading('signupForm', false);
    showSuccessScreen(name, false);
  }, 2000);
}

/* ── Loading state ── */
function setLoading(formId, state) {
  const btn = document.querySelector(`#${formId} .auth-btn`);
  if (!btn) return;
  btn.classList.toggle('loading', state);
}

/* ── Toast notification ── */
let toastTimer;
function showToast(msg) {
  let toast = document.getElementById('authToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'authToast';
    toast.className = 'auth-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  clearTimeout(toastTimer);
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ── Live inline validation on blur ── */
document.addEventListener('DOMContentLoaded', () => {
  /* Login */
  addBlur('l-email', () => {
    const v = document.getElementById('l-email').value.trim();
    if (v && !emailRx.test(v)) showErr('l-email', 'صيغة البريد الإلكتروني غير صحيحة');
    else if (v) markValid('l-email');
  });

  addBlur('l-pass', () => {
    const v = document.getElementById('l-pass').value;
    if (v && v.length < 6) showErr('l-pass', 'كلمة المرور قصيرة جداً');
    else if (v) markValid('l-pass');
  });

  /* Sign up */
  addBlur('s-name', () => {
    const v = document.getElementById('s-name').value.trim();
    if (v && v.length < 3) showErr('s-name', 'الاسم قصير جداً');
    else if (v) markValid('s-name');
  });

  addBlur('s-email', () => {
    const v = document.getElementById('s-email').value.trim();
    if (v && !emailRx.test(v)) showErr('s-email', 'صيغة البريد الإلكتروني غير صحيحة');
    else if (v) markValid('s-email');
  });

  addBlur('s-phone', () => {
    const v = document.getElementById('s-phone').value.trim();
    if (v && !phoneRx.test(v)) showErr('s-phone', 'رقم الهاتف غير صحيح');
    else if (v) markValid('s-phone');
  });

  addBlur('s-pass', () => {
    const v = document.getElementById('s-pass').value;
    if (!v) return;
    const hasLen = v.length >= 8;
    const hasNum = /\d/.test(v);
    const hasSym = /[^a-zA-Z0-9؀-ۿ]/.test(v);
    if (!hasLen) showErr('s-pass', 'يجب أن تكون كلمة المرور ٨ أحرف على الأقل');
    else if (!hasNum) showErr('s-pass', 'يجب أن تحتوي على رقم واحد على الأقل');
    else if (!hasSym) showErr('s-pass', 'يجب أن تحتوي على رمز خاص');
    else markValid('s-pass');
  });

  addBlur('s-confirm', () => {
    const v  = document.getElementById('s-confirm').value;
    const p  = document.getElementById('s-pass').value;
    if (v && v !== p) showErr('s-confirm', 'كلمتا المرور غير متطابقتين');
    else if (v) markValid('s-confirm');
  });

  /* Phone: digits-only filter */
  document.getElementById('s-phone').addEventListener('input', function () {
    this.value = this.value.replace(/[^\d+\s\-()]/g, '');
  });
});

function addBlur(id, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener('blur', fn);
}

/* ── Success screen (login=true → welcome back, login=false → new signup) ── */
function showSuccessScreen(name, isLogin) {
  const firstName = name ? name.split(' ')[0] : '';
  const heading   = isLogin ? 'أهلاً بك مجدداً!' : 'تم التسجيل بنجاح!';
  const subtext   = isLogin
    ? 'يسعدنا عودتك إلى منصة الأول'
    : `أهلاً بك في منصة الأول<br><strong>${firstName}</strong>`;

  const overlay = document.createElement('div');
  overlay.id = 'successOverlay';
  overlay.innerHTML = `
    <div class="success-card">
      <div class="success-check">
        <svg viewBox="0 0 52 52" fill="none">
          <circle cx="26" cy="26" r="25" stroke="currentColor" stroke-width="2" class="check-circle"/>
          <path d="M14 26l9 9 15-15" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round" class="check-path"/>
        </svg>
      </div>
      <h2>${heading}</h2>
      <p>${subtext}</p>
      <div class="redirect-bar">
        <div class="redirect-fill" id="redirectFill"></div>
      </div>
      <span class="redirect-hint">سيتم تحويلك للصفحة الرئيسية...</span>
    </div>
  `;
  document.body.appendChild(overlay);

  requestAnimationFrame(() => overlay.classList.add('show'));

  /* Animate the progress bar then redirect */
  setTimeout(() => {
    const fill = document.getElementById('redirectFill');
    if (fill) fill.style.width = '100%';
  }, 50);

  setTimeout(() => {
    overlay.classList.add('fade-out');
    setTimeout(() => window.location.href = 'index.html', 500);
  }, 2800);
}
