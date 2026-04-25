const STORAGE_KEY = "finance-calendar-events-v2";

const seedEvents = [
  { id: "seed-1", date: "2026-04-10", title: "3月CPI公布", type: "past", note: "关注通胀趋势" },
  { id: "seed-2", date: "2026-04-20", title: "LPR报价", type: "upcoming", note: "观察融资成本变化" },
];

const monthLabel = document.getElementById("monthLabel");
const calendarGrid = document.getElementById("calendarGrid");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const monthPicker = document.getElementById("monthPicker");

let currentDate = new Date();
let events = loadEvents();

function generateEventId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadEvents() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedEvents));
    return [...seedEvents];
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...seedEvents];
    return parsed.map((item) => ({
      ...item,
      id: item.id || generateEventId(),
      type: item.type === "past" ? "past" : "upcoming",
      note: item.note || "",
    }));
  } catch {
    return [...seedEvents];
  }
}

function saveEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatMonthTitle(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}年 ${month}月`;
}

function getMonthRange(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const mondayStartOffset = (first.getDay() + 6) % 7;
  const totalVisible = Math.ceil((mondayStartOffset + last.getDate()) / 7) * 7;
  return { first, mondayStartOffset, totalVisible };
}

function eventsByDate(dateKey) {
  return events.filter((item) => item.date === dateKey);
}

function askType(defaultType = "upcoming") {
  const answer = window.prompt("事件类型：输入 past(已发生) 或 upcoming(将发生)", defaultType);
  if (!answer) return null;
  const normalized = answer.trim().toLowerCase();
  if (normalized !== "past" && normalized !== "upcoming") {
    window.alert("类型仅支持 past 或 upcoming");
    return null;
  }
  return normalized;
}

function addEventForDate(dateKey) {
  const title = window.prompt(`为 ${dateKey} 添加事件：请输入事件名称`);
  if (!title || !title.trim()) return;

  const type = askType("upcoming");
  if (!type) return;

  const note = window.prompt("备注（可选，不用精确到时间）", "") || "";

  events.push({
    id: generateEventId(),
    date: dateKey,
    title: title.trim(),
    type,
    note: note.trim(),
  });
  saveEvents();
  renderCalendar();
}

function editEvent(eventId) {
  const target = events.find((item) => item.id === eventId);
  if (!target) return;

  const title = window.prompt("修改事件名称", target.title);
  if (!title || !title.trim()) return;

  const type = askType(target.type);
  if (!type) return;

  const note = window.prompt("修改备注（可选）", target.note || "") || "";

  target.title = title.trim();
  target.type = type;
  target.note = note.trim();
  saveEvents();
  renderCalendar();
}

function deleteEvent(eventId) {
  const target = events.find((item) => item.id === eventId);
  if (!target) return;

  const ok = window.confirm(`确认删除事件：${target.title} ?`);
  if (!ok) return;

  events = events.filter((item) => item.id !== eventId);
  saveEvents();
  renderCalendar();
}

function createEventRow(item) {
  const li = document.createElement("li");
  li.className = "event-tag";
  li.dataset.type = item.type;

  const dot = document.createElement("span");
  dot.className = "dot";

  const text = document.createElement("span");
  text.className = "text";
  text.textContent = item.note ? `${item.title}（${item.note}）` : item.title;

  const actions = document.createElement("span");
  actions.className = "event-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "mini-btn";
  editBtn.type = "button";
  editBtn.textContent = "编辑";
  editBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    editEvent(item.id);
  });

  const delBtn = document.createElement("button");
  delBtn.className = "mini-btn danger";
  delBtn.type = "button";
  delBtn.textContent = "删除";
  delBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    deleteEvent(item.id);
  });

  actions.append(editBtn, delBtn);
  li.append(dot, text, actions);
  return li;
}

function renderCalendar() {
  const { first, mondayStartOffset, totalVisible } = getMonthRange(currentDate);
  monthLabel.textContent = formatMonthTitle(currentDate);
  monthPicker.value = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
  calendarGrid.innerHTML = "";

  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - mondayStartOffset);

  const todayKey = toDateKey(new Date());

  for (let i = 0; i < totalVisible; i += 1) {
    const cellDate = new Date(gridStart);
    cellDate.setDate(gridStart.getDate() + i);

    const cellDateKey = toDateKey(cellDate);
    const isCurrentMonth = cellDate.getMonth() === currentDate.getMonth();

    const cell = document.createElement("article");
    cell.className = "day-cell";
    if (!isCurrentMonth) cell.classList.add("muted");
    if (cellDateKey === todayKey) cell.classList.add("today");

    const dateNum = document.createElement("div");
    dateNum.className = "date-num";
    dateNum.textContent = String(cellDate.getDate());

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "add-event-btn";
    addBtn.textContent = "+ 添加";
    addBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      addEventForDate(cellDateKey);
    });

    const list = document.createElement("ul");
    list.className = "event-list";

    eventsByDate(cellDateKey)
      .sort((a, b) => a.title.localeCompare(b.title, "zh-Hans-CN"))
      .forEach((item) => list.appendChild(createEventRow(item)));

    cell.append(dateNum, addBtn, list);
    calendarGrid.appendChild(cell);
  }
}

prevMonthBtn.addEventListener("click", () => {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  renderCalendar();
});

monthPicker.addEventListener("change", (event) => {
  const value = event.target.value;
  if (!value) return;
  const [y, m] = value.split("-").map(Number);
  currentDate = new Date(y, m - 1, 1);
  renderCalendar();
});

renderCalendar();
