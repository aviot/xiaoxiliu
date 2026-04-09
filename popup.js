const $ = (id) => document.getElementById(id);

const controls = {
  enabled: $('enabled'),
  voice: $('voice'),
  rate: $('rate'),
  pitch: $('pitch'),
  volume: $('volume'),
  stop: $('stop'),
  tips: $('tips'),
};

const LANG_LABEL = {
  'zh-CN': '普通话（中国）',
  'zh-TW': '中文（台湾）',
  'zh-HK': '中文（香港）',
  cmn: '普通话',
  'cmn-CN': '普通话（中国）',
};

function send(type, payload) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type, payload }, (res) => resolve(res));
  });
}

function toLangLabel(lang = '') {
  const normalized = lang.trim();
  return LANG_LABEL[normalized] || (normalized ? `语言 ${normalized}` : '未知语言');
}

function optionLabel(voice, index) {
  const langLabel = toLangLabel(voice.lang);
  const typeLabel = voice.remote ? '云端' : '本地';
  const group = voice.isChinese ? '中文' : '非中文';
  return `候选语音 ${index + 1}（${group} / ${typeLabel}）：${langLabel}`;
}

function renderVoices(voiceOptions = [], selectedVoice = '') {
  controls.voice.innerHTML = '';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '系统默认中文语音（自动选择）';
  controls.voice.appendChild(defaultOption);

  voiceOptions.forEach((voice, index) => {
    const option = document.createElement('option');
    option.value = voice.voiceName;
    option.textContent = optionLabel(voice, index);
    controls.voice.appendChild(option);
  });

  controls.voice.value = selectedVoice || '';
}

function renderTips(settings) {
  if (settings.lastSpeakIssue) {
    controls.tips.textContent = settings.lastSpeakIssue;
    controls.tips.style.color = '#b54708';
    return;
  }

  if (!settings.hasChineseVoice) {
    controls.tips.textContent = '当前未发现中文语音，系统可能会读成英文。请安装系统中文语音包后重启浏览器。';
    controls.tips.style.color = '#b54708';
    return;
  }

  controls.tips.textContent = '打开金十网页后，插件会自动朗读新增快讯。';
  controls.tips.style.color = '#555';
}

async function init() {
  const settings = await send('GET_SETTINGS');

  controls.enabled.checked = !!settings.enabled;
  controls.rate.value = String(settings.rate ?? 1);
  controls.pitch.value = String(settings.pitch ?? 1);
  controls.volume.value = String(settings.volume ?? 1);
  renderVoices(settings.voiceOptions || [], settings.voiceName || '');
  renderTips(settings);

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
