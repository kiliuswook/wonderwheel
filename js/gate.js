// ── 접속 잠금: ID/PW 를 입력해야 페이지가 보인다 ──
// <head> 에서 css/style.css 다음에 불러온다. 잠금 해제 전에는 style.css 가 본문을 숨긴다.
// 정적 사이트라 화면만 가리는 간단한 잠금이다 (소스는 저장소에서 그대로 볼 수 있다).
(function gate() {
  // SHA-256("ID:PW"). 바꾸려면 새 값의 해시로 교체한다.
  const HASH = 'fc9826e6c347525408eb957dbd71149cd867e29a0673b320620ec9ab73962b71';
  const KEY = 'ww-gate';
  const root = document.documentElement;
  const mark = new URL('../assets/mark-white.png', document.currentScript.src).href;

  const stored = () => { try { return sessionStorage.getItem(KEY); } catch (e) { return null; } };
  const unlock = () => root.classList.add('is-unlocked');

  if (stored() === HASH) { unlock(); return; }

  const sha256 = async (text) => {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
  };

  document.addEventListener('DOMContentLoaded', () => {
    const el = document.createElement('div');
    el.className = 'gate';
    el.innerHTML = `
      <form class="gate__box" autocomplete="off">
        <img src="${mark}" alt="" width="44" height="48">
        <h1 class="gate__title">WonderWheel</h1>
        <p class="gate__lead">관계자 전용 페이지입니다. 계정 정보를 입력해 주세요.</p>
        <label class="gate__field"><span>ID</span><input name="id" type="text" autocapitalize="off" spellcheck="false" required></label>
        <label class="gate__field"><span>PW</span><input name="pw" type="password" required></label>
        <p class="gate__error" role="alert" hidden>ID 또는 PW 가 올바르지 않습니다.</p>
        <button class="btn btn--primary" type="submit">입장하기</button>
      </form>`;
    document.body.appendChild(el);

    const form = el.querySelector('form');
    const error = el.querySelector('.gate__error');
    form.elements.id.focus();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const hash = await sha256(`${form.elements.id.value}:${form.elements.pw.value}`);
      if (hash !== HASH) {
        error.hidden = false;
        form.elements.pw.value = '';
        form.elements.pw.focus();
        return;
      }
      try { sessionStorage.setItem(KEY, HASH); } catch (err) { /* 저장이 막혀 있으면 이번 페이지만 연다 */ }
      el.remove();
      unlock();
    });
  });
})();
