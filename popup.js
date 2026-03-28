const $ = (id) => document.getElementById(id);

const controls = {
  enabled: $('enabled'),
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

async function init() {
  const settings = await send('GET_SETTINGS');

  controls.enabled.checked = !!settings.enabled;
  controls.rate.value = String(settings.rate ?? 1);
  controls.pitch.value = String(settings.pitch ?? 1);
  controls.volume.value = String(settings.volume ?? 1);

  controls.enabled.addEventListener('change', () => {
    send('UPDATE_SETTINGS', { enabled: controls.enabled.checked });
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
