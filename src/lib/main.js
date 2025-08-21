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
const notifStack = document.getElementById('notifStack'); // 알림 영역

// 잠금 해제 함수
function unlock() {
  if (lockEl.classList.contains('unlocking')) return; // 중복 실행 방지

  // 애니메이션: 잠금화면 위로 사라지고 홈은 페이드-인
  lockEl.classList.add('unlocking');
  setTimeout(() => {
    lockEl.style.display = 'none';
    homeEl.hidden = false;
    // requestAnimationFrame을 사용해 부드러운 애니메이션 시작을 보장
    requestAnimationFrame(() => homeEl.classList.add('show'));
  }, 320); // CSS 애니메이션 시간과 맞춤
}

// 1. 알림 영역 이외 클릭 시 해제
if (lockEl) {
  lockEl.addEventListener('click', (e) => {
    // 클릭된 곳이 알림 스택 내부이면 아무것도 하지 않음
    if (e.target.closest('#notifStack')) return; 
    unlock();
  });
}

// 2. 위로 스와이프하여 해제
let startY = null;
if (lockEl) {
  lockEl.addEventListener('touchstart', e => startY = e.touches[0].clientY, { passive: true });
  lockEl.addEventListener('touchmove', e => {
    if (startY === null) return;
    const dy = startY - e.touches[0].clientY; // 이동 거리 계산
    if (dy > 40) { // 40px 이상 위로 움직이면
      unlock();
      startY = null; // 중복 실행 방지
    }
  }, { passive: true });
  lockEl.addEventListener('touchend', () => startY = null);
}


// QA 뒤로가기 버튼 기능
if (qaBack) {
  qaBack.addEventListener('click', () => {
    // QA 기능은 나중에 필요할 때 복원할 수 있도록 남겨둡니다.
    // 현재 홈 화면이라면 잠금화면으로 돌아가는 로직 (예시)
    if (homeEl && !homeEl.hidden) {
       window.location.reload(); // 간단하게 페이지 새로고침으로 초기화
    }
  });
}

// 초기 화면 설정
if (lockEl) lockEl.style.display = 'flex';
if (homeEl) homeEl.hidden = true;


/* ====== 더미 알림 생성(더미 텍스트 수정 가능) ====== */
// 👇 위에서 이미 선언했으므로, 여기서는 const를 삭제했습니다.
const DUMMY_NOTIFICATIONS = [
  {t:'더미1', d:'텍스트1'},
  {t:'더미2', d:'텍스트2'},
  {t:'더미3', d:'텍스트3'},
  {t:'더미4', d:'텍스트4'},
  {t:'더미5', d:'텍스트5'},
  {t:'더미6', d:'텍스트6'},
  {t:'더미7', d:'텍스트7'},
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