const $ = (id) => document.getElementById(id);

const controls = {
  enabled: $('enabled'),
  voice: $('voice'),
  rate: $('rate'),
  pitch: $('pitch'),
  volume: $('volume'),
  stop: $('stop'),
};

function send(type, payload) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type, payload }, (res) => resolve(res));
  });
}

function renderVoices(voiceOptions = [], selectedVoice = '') {
  controls.voice.innerHTML = '';

  if (!voiceOptions.length) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = '系统默认中文语音';
    controls.voice.appendChild(option);
    return;
  }

  voiceOptions.forEach((voice) => {
    const option = document.createElement('option');
    option.value = voice.voiceName;
    option.textContent = `${voice.voiceName} (${voice.lang}${voice.remote ? ' / 远程' : ''})`;
    controls.voice.appendChild(option);
  });

  controls.voice.value = selectedVoice || voiceOptions[0].voiceName;
}

async function init() {
  const settings = await send('GET_SETTINGS');

  controls.enabled.checked = !!settings.enabled;
  controls.rate.value = String(settings.rate ?? 1);
  controls.pitch.value = String(settings.pitch ?? 1);
  controls.volume.value = String(settings.volume ?? 1);
  renderVoices(settings.voiceOptions || [], settings.voiceName || '');

  controls.enabled.addEventListener('change', () => {
    send('UPDATE_SETTINGS', { enabled: controls.enabled.checked });
  });

  controls.voice.addEventListener('change', () => {
    send('UPDATE_SETTINGS', { voiceName: controls.voice.value });
  });

  controls.rate.addEventListener('change', () => {
    send('UPDATE_SETTINGS', { rate: Number(controls.rate.value) });
  });

  controls.pitch.addEventListener('change', () => {
    send('UPDATE_SETTINGS', { pitch: Number(controls.pitch.value) });
  });

  controls.volume.addEventListener('change', () => {
    send('UPDATE_SETTINGS', { volume: Number(controls.volume.value) });
  });

  controls.stop.addEventListener('click', () => {
    send('STOP_SPEECH');
  });
}

init();
