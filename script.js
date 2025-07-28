let nes;
let audioCtx;
const ROM_BYTES = (() => {
  const binary = atob(ROM_BASE64.trim());
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
})();

function initNes() {
  nes = new jsnes.NES({
    onFrame: onFrame,
    onAudioSample: onAudioSample
  });
  const canvas = document.getElementById('screen');
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, 256, 240);
  const buffer = new Uint32Array(imageData.data.buffer);
  function onFrame(frameBuffer) {
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = 0xff000000 | frameBuffer[i];
    }
    ctx.putImageData(imageData, 0, 0);
  }
  let audioSamplesL = new Float32Array(4096);
  let audioSamplesR = new Float32Array(4096);
  let writeCursor = 0;
  let readCursor = 0;
  function onAudioSample(l, r) {
    audioSamplesL[writeCursor] = l;
    audioSamplesR[writeCursor] = r;
    writeCursor = (writeCursor + 1) & 4095;
  }
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const scriptNode = audioCtx.createScriptProcessor(1024, 0, 2);
  scriptNode.onaudioprocess = function(e) {
    const outL = e.outputBuffer.getChannelData(0);
    const outR = e.outputBuffer.getChannelData(1);
    for (let i = 0; i < 1024; i++) {
      const idx = (readCursor + i) & 4095;
      outL[i] = audioSamplesL[idx];
      outR[i] = audioSamplesR[idx];
    }
    readCursor = (readCursor + 1024) & 4095;
  };
  scriptNode.connect(audioCtx.destination);
}

function loadRom() {
  nes.loadROM(String.fromCharCode.apply(null, ROM_BYTES));
  requestAnimationFrame(onAnimationFrame);
  console.log('Juego cargado correctamente');
}

function onAnimationFrame() {
  nes.frame();
  requestAnimationFrame(onAnimationFrame);
}

function keyAction(key, isPressed) {
  const player = 1;
  const action = isPressed ? 'buttonDown' : 'buttonUp';
  switch (key) {
    case 'UP': nes[action](player, jsnes.Controller.BUTTON_UP); break;
    case 'DOWN': nes[action](player, jsnes.Controller.BUTTON_DOWN); break;
    case 'LEFT': nes[action](player, jsnes.Controller.BUTTON_LEFT); break;
    case 'RIGHT': nes[action](player, jsnes.Controller.BUTTON_RIGHT); break;
    case 'A': nes[action](player, jsnes.Controller.BUTTON_A); break;
    case 'B': nes[action](player, jsnes.Controller.BUTTON_B); break;
    case 'START': nes[action](player, jsnes.Controller.BUTTON_START); break;
    case 'SELECT': nes[action](player, jsnes.Controller.BUTTON_SELECT); break;
  }
}

function setupControls() {
  document.querySelectorAll('[data-key]').forEach(btn => {
    btn.addEventListener('touchstart', e => {
      e.preventDefault();
      keyAction(btn.dataset.key, true);
      console.log('Boton ' + btn.dataset.key + ' presionado');
    });
    btn.addEventListener('touchend', e => {
      e.preventDefault();
      keyAction(btn.dataset.key, false);
    });
  });
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  document.getElementById(id).classList.add('active');
}

document.getElementById('start-btn').addEventListener('click', () => {
  showScreen('console-screen');
});

document.querySelector('.play-console').addEventListener('click', () => {
  showScreen('skin-screen');
});

document.querySelectorAll('.set-skin').forEach(btn => {
  btn.addEventListener('click', () => {
    document.body.className = btn.dataset.skin;
    showScreen('game-screen');
  });
});

document.querySelector('.play-game').addEventListener('click', () => {
  showScreen('emulator-screen');
  if (!nes) {
    initNes();
    setupControls();
  }
  loadRom();
  if (audioCtx) audioCtx.resume();
});
