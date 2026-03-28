const DEFAULT_SETTINGS = {
  enabled: true,
  rate: 1,
  pitch: 1,
  volume: 1,
  dedupeSize: 200,
  minLength: 6,
};

const state = {
  queue: [],
  speaking: false,
  dedupe: new Set(),
  dedupeOrder: [],
  settings: { ...DEFAULT_SETTINGS },
  selectedVoiceName: null,
};

async function loadSettings() {
  const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  state.settings = { ...DEFAULT_SETTINGS, ...stored };
}

async function saveSettings(next) {
  state.settings = { ...state.settings, ...next };
  await chrome.storage.sync.set(next);
}

function normalizeText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function rememberFingerprint(fp) {
  state.dedupe.add(fp);
  state.dedupeOrder.push(fp);
  while (state.dedupeOrder.length > state.settings.dedupeSize) {
    const oldest = state.dedupeOrder.shift();
    state.dedupe.delete(oldest);
  }
}

function isDuplicate(fp) {
  return state.dedupe.has(fp);
}

function pickChineseVoice(voices) {
  const zhVoices = voices.filter((v) => /zh|cmn|chinese/i.test(`${v.lang} ${v.voiceName}`));
  if (!zhVoices.length) return null;

  const cnVoice = zhVoices.find((v) => /zh-CN|cmn-CN/i.test(v.lang));
  return cnVoice || zhVoices[0];
}

async function ensureVoiceSelected() {
  if (state.selectedVoiceName) return state.selectedVoiceName;

  const voices = await new Promise((resolve) => chrome.tts.getVoices(resolve));
  const voice = pickChineseVoice(voices);
  state.selectedVoiceName = voice ? voice.voiceName : null;
  return state.selectedVoiceName;
}

function speakNext() {
  if (state.speaking || !state.queue.length) return;

  const text = state.queue.shift();
  state.speaking = true;

  ensureVoiceSelected().then((voiceName) => {
    chrome.tts.speak(text, {
      voiceName,
      lang: "zh-CN",
      rate: state.settings.rate,
      pitch: state.settings.pitch,
      volume: state.settings.volume,
      enqueue: false,
      onEvent: (event) => {
        if (["end", "interrupted", "cancelled", "error"].includes(event.type)) {
          state.speaking = false;
          speakNext();
        }
      },
    });
  });
}

function enqueueText(raw) {
  if (!state.settings.enabled) return;

  const text = normalizeText(raw);
  if (!text || text.length < state.settings.minLength) return;

  const fp = text.slice(0, 160);
  if (isDuplicate(fp)) return;

  rememberFingerprint(fp);
  state.queue.push(text);
  speakNext();
}

chrome.runtime.onInstalled.addListener(async () => {
  await loadSettings();
});

chrome.runtime.onStartup.addListener(async () => {
  await loadSettings();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "JIN10_FLASH") {
    enqueueText(message.text || "");
    sendResponse({ ok: true });
    return;
  }

  if (message?.type === "GET_SETTINGS") {
    sendResponse({ ...state.settings, voiceName: state.selectedVoiceName });
    return;
  }

  if (message?.type === "UPDATE_SETTINGS") {
    saveSettings(message.payload || {}).then(() => sendResponse({ ok: true }));
    return true;
  }

  if (message?.type === "STOP_SPEECH") {
    chrome.tts.stop();
    state.queue = [];
    state.speaking = false;
    sendResponse({ ok: true });
  }
});

loadSettings();
