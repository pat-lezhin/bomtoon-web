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

/* ====== 더미 알림 생성 ====== */
const notifStack = document.getElementById('notifStack');
const DUMMY_NOTIFICATIONS = [
  {t:'김준완 연차', d:'8월18일 이사'},
  {t:'구내 시당', d:'이번주는 어떨까?'},
  {t:'톡', d:'[공지] 굿즈 예판 링크 안내'},
  {t:'News', d:'티저 이미지 티징 (클릭 불가)'},
  {t:'BOM TV', d:'PV 공개 D-3 · 홈에서 확인'},
  {t:'Calendar', d:'4/23–26 POP-UP'},
  {t:'Notes', d:'“home is where the heart is”'},
];

if (notifStack) {
  DUMMY_NOTIFICATIONS.forEach(n => {
    const el = document.createElement('div');
    el.className = 'notif';
    el.innerHTML = `<div class="t">${n.t}</div><div class="d">${n.d}</div>`;
    // 알림 클릭 시 잠금 해제되지 않도록 이벤트 전파를 막습니다.
    el.addEventListener('click', e => e.stopPropagation()); 
    notifStack.appendChild(el);
  });
}