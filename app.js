const PREVIEW_ACCESS_CODE = 'yami1234';
const state = { method: 'qr', phone: '', timer: null, seconds: 120, sessionId: '' };
const views = ['access', 'method', 'pairing', 'session'];
const titles = { access: 'Enter the access code', method: 'Choose your pairing route', pairing: 'Pair your WhatsApp', session: 'Your session is ready' };
const indexes = { access: '01', method: '02', pairing: '03', session: '04' };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function setStep(step) {
  $$('.step').forEach((item) => {
    const itemStep = Number(item.dataset.step);
    item.classList.toggle('is-active', itemStep === step);
    item.classList.toggle('is-done', itemStep < step);
  });
}

function showView(name) {
  views.forEach((view) => {
    const element = $(`#${view}-view`);
    const visible = view === name;
    element.hidden = !visible;
    element.classList.toggle('is-visible', visible);
  });
  $('#panel-title').textContent = titles[name];
  $('#panel-index').textContent = indexes[name];
  setStep(views.indexOf(name) + 1);
}

function makePairingCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, (_, index) => alphabet[(index * 7 + 4) % alphabet.length]).join('');
}

function startTimer() {
  clearInterval(state.timer);
  state.seconds = 120;
  const tick = () => {
    const minutes = String(Math.floor(state.seconds / 60)).padStart(2, '0');
    const seconds = String(state.seconds % 60).padStart(2, '0');
    $('#expires-label').textContent = `EXPIRES IN ${minutes}:${seconds}`;
    if (state.seconds <= 0) {
      clearInterval(state.timer);
      $('#pairing-status-label').textContent = 'ROUTE EXPIRED';
      $('#pairing-status-pill').classList.remove('is-waiting');
    }
    state.seconds -= 1;
  };
  tick();
  state.timer = setInterval(tick, 1000);
}

function updateMethod() {
  const isQr = state.method === 'qr';
  $$('.method-tab').forEach((tab) => {
    const selected = tab.dataset.method === state.method;
    tab.classList.toggle('is-selected', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
  $('#continue-method').innerHTML = `Continue with ${isQr ? 'QR' : 'phone number'} <span>↗</span>`;
  $('#method-note-text').textContent = isQr
    ? 'Open WhatsApp on your phone and scan the code shown on the next screen.'
    : 'Enter your number in international format. WhatsApp will generate the actual pairing code.';
}

function openPairing() {
  showView('pairing');
  const isQr = state.method === 'qr';
  $('#qr-card').hidden = !isQr;
  $('#qr-instructions').hidden = !isQr;
  $('#code-card').hidden = isQr;
  $('#whatsapp-code').textContent = isQr ? '— — — —' : makePairingCode().replace(/(.{4})/g, '$1 ');
  $('#pairing-status-pill').classList.remove('is-linked');
  $('#pairing-status-label').textContent = isQr ? 'WAITING FOR SCAN' : 'WAITING FOR CODE';
  $('#bridge-label').textContent = 'PAIRING ROUTE OPEN';
  startTimer();
}

function makeSessionId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seed = Array.from({ length: 12 }, (_, index) => chars[(Date.now() + index * 11) % chars.length]).join('');
  return `YAMI-SESSION-${seed.slice(0, 4)}-${seed.slice(4, 8)}-${seed.slice(8)}`;
}

function completePairing() {
  clearInterval(state.timer);
  state.sessionId = makeSessionId();
  $('#session-value').textContent = state.sessionId;
  $('#pairing-status-pill').classList.add('is-linked');
  $('#pairing-status-label').textContent = 'LINKED';
  $('#bridge-label').textContent = 'SESSION READY';
  showView('session');
}

$('#reveal-code').addEventListener('click', () => {
  const input = $('#access-code');
  const showing = input.type === 'text';
  input.type = showing ? 'password' : 'text';
  $('#reveal-code').textContent = showing ? 'SHOW' : 'HIDE';
});

$('#access-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = $('#access-code');
  const error = $('#access-error');
  if (input.value.trim() !== PREVIEW_ACCESS_CODE) {
    error.textContent = 'That gate code does not match. Check with your Captain and try again.';
    input.focus();
    return;
  }
  error.textContent = '';
  showView('method');
});

$$('.method-tab').forEach((tab) => tab.addEventListener('click', () => {
  state.method = tab.dataset.method;
  updateMethod();
}));
$('#continue-method').addEventListener('click', openPairing);
$('#back-to-access').addEventListener('click', () => showView('access'));
$('#restart-pairing').addEventListener('click', openPairing);
$('#demo-complete').addEventListener('click', completePairing);
$('#pair-another').addEventListener('click', () => {
  $('#access-code').value = '';
  showView('method');
});
$('#copy-session').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(state.sessionId);
    $('#copy-icon').textContent = '✓';
    $('#copy-label').textContent = 'Copied to clipboard';
    setTimeout(() => { $('#copy-icon').textContent = '▣'; $('#copy-label').textContent = 'Copy session ID'; }, 1800);
  } catch {
    $('#copy-label').textContent = 'Select and copy manually';
  }
});

updateMethod();
showView('access');
