// 시간 업데이트
const sb_time = document.getElementById('sb-time');
const lock_clock = document.getElementById('lock-clock');
const lock_date = document.getElementById('lock-date');

const pad = n => n.toString().padStart(2,'0');
function tick(){
  const now = new Date();
  const days=['일','월','화','수','목','금','토'];
  sb_time.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  lock_clock.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  lock_date.textContent = `${now.getFullYear()}년 ${now.getMonth()+1}월 ${now.getDate()}일 (${days[now.getDay()]})`;
}
setInterval(tick,1000); tick();

// 잠금 → 홈
const lockEl = document.getElementById('lock');
const homeEl = document.getElementById('home');
lockEl.addEventListener('click', () => {
  lockEl.style.display = 'none';
  homeEl.hidden = false;
});
