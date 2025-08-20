// ── 상태바/잠금 시계
const sb_time = document.getElementById('sb-time');
const lock_clock = document.getElementById('lock-clock');
const lock_date = document.getElementById('lock-date');
const pad = n => n.toString().padStart(2,'0');

function tick(){
  const now = new Date();
  const days=['일','월','화','수','목','금','토'];
  const hhmm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  sb_time.textContent = hhmm;
  lock_clock.textContent = hhmm;
  lock_date.textContent =
    `${now.getFullYear()}년 ${now.getMonth()+1}월 ${now.getDate()}일 (${days[now.getDay()]})`;
}
setInterval(tick,1000); tick();

// ── 뷰 전환
const lockEl = document.getElementById('lock');
const homeEl = document.getElementById('home');
const qaBack = document.getElementById('qaBack');

function show(v){
  // v: 'lock' | 'home'
  lockEl.style.display = (v === 'lock') ? '' : 'none';
  homeEl.hidden = (v !== 'home');
}

lockEl.addEventListener('click', () => show('home')); // 잠금 → 홈
qaBack?.addEventListener('click', () => {              // QA 버튼: 홈 → 잠금
  if (!homeEl.hidden) show('lock');
});

show('lock');
