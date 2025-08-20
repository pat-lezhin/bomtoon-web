/* ====== 모바일 뷰포트/스케일 보정 ====== */
const BASE_W = 390, BASE_H = 844;   // 폰 프레임 기준 사이즈
const OUTER_PADDING =16;           // 화면 가장자리 여백

function setAppHeightVar() {
  const vv = window.visualViewport;
  const h = vv ? vv.height : window.innerHeight;
  document.documentElement.style.setProperty('--app-h', `${h}px`);
}

function fitPhoneToViewport() {
  const vv = window.visualViewport;
  const vw = (vv ? vv.width  : window.innerWidth)  - OUTER_PADDING * 2;
  const vh = (vv ? vv.height : window.innerHeight) - OUTER_PADDING * 2;
  const s = Math.min(vw / BASE_W, vh / BASE_H);
  document.documentElement.style.setProperty('--phone-scale', String(s));
}

const reflow = () => { setAppHeightVar(); fitPhoneToViewport(); };
window.addEventListener('resize', reflow, { passive: true });
window.addEventListener('orientationchange', reflow, { passive: true });
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', reflow, { passive: true });
  window.visualViewport.addEventListener('scroll', reflow, { passive: true });
}
reflow();
/* ====== /뷰포트 보정 ====== */


/* ====== 상태바/잠금 시계 ====== */
const sb_time   = document.getElementById('sb-time');
const lock_clock= document.getElementById('lock-clock');
const lock_date = document.getElementById('lock-date');
const pad = n => n.toString().padStart(2,'0');

function tick(){
  const now = new Date();
  const days = ['일','월','화','수','목','금','토'];
  const hhmm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  if (sb_time)    sb_time.textContent = hhmm;
  if (lock_clock) lock_clock.textContent = hhmm;
  if (lock_date)  lock_date.textContent =
    `${now.getFullYear()}년 ${now.getMonth()+1}월 ${now.getDate()}일 (${days[now.getDay()]})`;
}
setInterval(tick, 1000); tick();
/* ====== /시계 ====== */


/* ====== 뷰 전환 (잠금 → 홈, QA ← 버튼) ====== */
const lockEl = document.getElementById('lock');
const homeEl = document.getElementById('home');
const qaBack = document.getElementById('qaBack');

function show(view){
  if (!lockEl || !homeEl) return;
  lockEl.style.display = (view === 'lock') ? '' : 'none';
  homeEl.hidden = (view !== 'home');
}

if (lockEl) lockEl.addEventListener('click', () => show('home'));
if (qaBack) qaBack.addEventListener('click', () => {
  if (homeEl && !homeEl.hidden) show('lock');
});

show('lock');
/* ====== /뷰 전환 ====== */
