const STORAGE_KEY = "finance-calendar-events-v1";

const seedEvents = [
  { date: "2026-02-10", title: "1月CPI数据公布", type: "past", note: "关注通胀走势" },
  { date: "2026-02-14", title: "央行货币政策报告", type: "past", note: "评估流动性导向" },
  { date: "2026-02-19", title: "LPR报价发布", type: "upcoming", note: "影响房贷与企业融资成本" },
  { date: "2026-02-26", title: "美联储会议纪要", type: "upcoming", note: "观察降息预期变化" },
];

const monthLabel = document.getElementById("monthLabel");
const calendarGrid = document.getElementById("calendarGrid");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const eventForm = document.getElementById("eventForm");
const eventTagTemplate = document.getElementById("eventTagTemplate");

let currentDate = new Date();
let events = loadEvents();

function loadEvents() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedEvents));
    return [...seedEvents];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...seedEvents];
  } catch {
    return [...seedEvents];
  }
}

function saveEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
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

  return { first, last, mondayStartOffset, totalVisible };
}

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function eventsByDate(dateKey) {
  return events.filter((item) => item.date === dateKey);
}

function makeEventTag(item) {
  const node = eventTagTemplate.content.firstElementChild.cloneNode(true);
  node.dataset.type = item.type;
  const text = node.querySelector(".text");
  text.textContent = item.note ? `${item.title}（${item.note}）` : item.title;
  return node;
}

function renderCalendar() {
  const { first, mondayStartOffset, totalVisible } = getMonthRange(currentDate);
  monthLabel.textContent = formatMonthTitle(currentDate);
  calendarGrid.innerHTML = "";

  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - mondayStartOffset);

  const todayKey = toDateKey(new Date());

  for (let i = 0; i < totalVisible; i += 1) {
    const cellDate = new Date(gridStart);
    cellDate.setDate(gridStart.getDate() + i);

    const isCurrentMonth = cellDate.getMonth() === currentDate.getMonth();
    const cellDateKey = toDateKey(cellDate);

    const cell = document.createElement("article");
    cell.className = "day-cell";
    if (!isCurrentMonth) cell.classList.add("muted");
    if (cellDateKey === todayKey) cell.classList.add("today");

    const dateNum = document.createElement("div");
    dateNum.className = "date-num";
    dateNum.textContent = String(cellDate.getDate());

    const list = document.createElement("ul");
    list.className = "event-list";

    eventsByDate(cellDateKey)
      .sort((a, b) => a.title.localeCompare(b.title, "zh-Hans-CN"))
      .forEach((item) => {
        list.appendChild(makeEventTag(item));
      });

    cell.append(dateNum, list);
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

eventForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const date = document.getElementById("eventDate").value;
  const title = document.getElementById("eventTitle").value.trim();
  const type = document.getElementById("eventType").value;
  const note = document.getElementById("eventNote").value.trim();

  if (!date || !title) return;

  events.push({ date, title, type, note });
  saveEvents();
  eventForm.reset();

  const [y, m] = date.split("-").map(Number);
  currentDate = new Date(y, m - 1, 1);
  renderCalendar();
});

renderCalendar();
