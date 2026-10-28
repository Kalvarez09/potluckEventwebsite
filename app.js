// ============================================================
// Neighbor Events – plain JavaScript, all data in localStorage
// ============================================================

// ---------- Settings ----------
const DB_KEY = "neighbor-events-v3";
const SESSION_KEY = "neighbor-events-session";
const REMINDER_MINUTES = 30;

// ---------- Food types (dropdowns + icons) ----------
// "words" are used to guess an icon for things people type themselves.
const FOOD_TYPES = [
  { name: "Salad", emoji: "🥗", words: ["salad"] },
  { name: "Main dish", emoji: "🍲", words: ["main", "stew", "curry", "casserole"] },
  { name: "Salt Dish", emoji: "🥘", words: ["salt", "savory", "savoury", "quiche"] },
  { name: "Soup", emoji: "🍜", words: ["soup", "ramen"] },
  { name: "Pasta", emoji: "🍝", words: ["pasta", "spaghetti", "lasagna", "noodle"] },
  { name: "Pizza", emoji: "🍕", words: ["pizza"] },
  { name: "Rice", emoji: "🍚", words: ["rice", "risotto", "paella"] },
  { name: "Meat", emoji: "🍗", words: ["meat", "chicken", "beef", "pork", "steak", "sausage", "bbq", "grill"] },
  { name: "Fish", emoji: "🐟", words: ["fish", "salmon", "tuna", "sushi"] },
  { name: "Vegetables", emoji: "🥦", words: ["vegetable", "veggie"] },
  { name: "Bread", emoji: "🥖", words: ["bread", "baguette", "rolls"] },
  { name: "Cheese", emoji: "🧀", words: ["cheese"] },
  { name: "Sandwiches", emoji: "🥪", words: ["sandwich", "wrap"] },
  { name: "Dessert", emoji: "🍰", words: ["dessert", "pudding", "tiramisu"] },
  { name: "Cake", emoji: "🎂", words: ["cake", "pie", "tart"] },
  { name: "Cookies", emoji: "🍪", words: ["cookie", "biscuit", "brownie"] },
  { name: "Fruits", emoji: "🍎", words: ["fruit", "apple", "banana", "berries", "melon"] },
  { name: "Chips", emoji: "🍟", words: ["chips", "fries", "crisps"] },
  { name: "Snacks", emoji: "🍿", words: ["snack", "popcorn", "nuts", "pretzel"] },
  { name: "Drinks", emoji: "🥤", words: ["drink", "soda", "water", "cola", "lemonade"] },
  { name: "Juice", emoji: "🧃", words: ["juice"] },
  { name: "Wine & beer", emoji: "🍷", words: ["wine", "beer", "alcohol", "prosecco"] },
  { name: "Coffee & tea", emoji: "☕", words: ["coffee", "tea"] },
  { name: "Ice", emoji: "🧊", words: ["ice"] },
  { name: "Plates & cups", emoji: "🍽️", words: ["plate", "cup", "cutlery", "napkin", "fork"] },
];
const OTHER_EMOJI = "🧺";

function emojiFor(name) {
  const text = name.toLowerCase();
  const type = FOOD_TYPES.find((t) => t.name.toLowerCase() === text)
    || FOOD_TYPES.find((t) => t.words.some((w) => text.includes(w)));
  return type ? type.emoji : OTHER_EMOJI;
}

const DIETS = {
  vegetarian: { label: "Vegetarian", emoji: "🥕" },
  vegan: { label: "Vegan", emoji: "🌱" },
  "gluten-free": { label: "Gluten-free", emoji: "🌾" },
  "nut-allergy": { label: "Nut allergy", emoji: "🥜" },
  other: { label: "Other", emoji: "➕" },
};

// ---------- Icons (simple line icons) ----------
const ICONS = {
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  back: '<polyline points="15 18 9 12 15 6"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
};

function icon(name) {
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
}

// ---------- Small helpers ----------
const $ = (id) => document.getElementById(id);

// User-typed text is put into HTML, so escape it first.
function esc(text) {
  return String(text).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Prototype only: a real app must check passwords on a server.
function hashPassword(text) {
  let hash = 2166136261;
  for (const ch of text) {
    hash ^= ch.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

// Only allow normal web links (no "javascript:" links).
function safeUrl(url) {
  return /^https?:\/\//i.test(url || "") ? url : "";
}

// ---------- Mock data ----------
const DEMO_ORGANIZER = {
  id: "u-maria", name: "Maria", email: "maria@demo.com", password: hashPassword("demo123"),
};

function seedDb() {
  const goingNames = ["Maria", "Anna", "Ben", "Carla", "David", "Emma", "Farid", "Greta", "Hugo", "Ines",
    "Jonas", "Kim", "Lena", "Mia", "Noah", "Olga", "Paul", "Rosa", "Sami", "Tara"];
  const diets = {
    Anna: ["vegetarian"], Ben: ["vegetarian", "gluten-free"], Carla: ["vegetarian"],
    David: ["vegetarian"], Emma: ["gluten-free"], Farid: ["nut-allergy"],
  };
  const guest = (name, status) => ({
    userId: name === "Maria" ? DEMO_ORGANIZER.id : null,
    name, status, diet: diets[name] || [], other: "",
  });
  // Each claim = 1 portion. [name, what exactly]
  const claims = (list) => list.map(([name, note = ""]) => ({ userId: null, name, note }));

  const potluck = {
    id: "potluck",
    ownerId: DEMO_ORGANIZER.id,
    ownerName: DEMO_ORGANIZER.name,
    title: "Dinner Potluck",
    date: "2027-01-17",
    start: "13:00",
    end: "18:30",
    location: "Somewhereweg 27",
    mapsUrl: "",
    vibe: "Music, drinks, about 30 people expected",
    capacity: 30,
    portions: 10,
    guests: [
      ...goingNames.map((name) => guest(name, "going")),
      guest("Lukas", "maybe"),
      guest("Sofia", "cant"),
      guest("Tom", "cant"),
    ],
    items: [
      { id: "salad", name: "Salad", emoji: "🥗", claims: claims([["Anna", "Greek salad"], ["Ben", "Pasta salad"],
        ["Carla"], ["David", "Caesar salad"], ["Emma"], ["Farid", "Tabbouleh"], ["Greta"], ["Hugo"]]) },
      { id: "dessert", name: "Dessert", emoji: "🍰", claims: claims([["Ines", "Tiramisu"], ["Jonas"],
        ["Kim", "Brownies"], ["Lena"]]) },
      { id: "salt-dish", name: "Salt Dish", emoji: "🥘", claims: claims([["Mia", "Quiche"], ["Noah"],
        ["Olga", "Empanadas"], ["Paul"], ["Rosa"], ["Sami", "Börek"], ["Tara"], ["Kim"], ["Lena"], ["Jonas"]]) },
      { id: "drinks", name: "Drinks", emoji: "🥤", claims: claims([["Hugo", "Homemade lemonade"]]) },
      { id: "fruits", name: "Fruits", emoji: "🍎", claims: claims([["Ines"], ["Emma"], ["Farid"],
        ["Carla"], ["Ben"], ["Anna", "Watermelon"]]) },
      { id: "chips", name: "Chips", emoji: "🍟", claims: [] },
    ],
  };

  // "reminded" remembers which reminders were already sent, so they only appear once.
  return { users: [DEMO_ORGANIZER], events: [potluck], reminded: [] };
}

// ---------- Database + session (localStorage) ----------
function loadDb() {
  try {
    const saved = JSON.parse(localStorage.getItem(DB_KEY));
    if (saved && Array.isArray(saved.users)) return saved;
  } catch {
    // Broken or blocked storage: start with fresh mock data.
  }
  return seedDb();
}

function saveDb() {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    // Storage may be blocked (e.g. private mode); the app still works for this visit.
  }
}

function loadSession() {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function setSession(userId) {
  sessionUserId = userId;
  try {
    if (userId) localStorage.setItem(SESSION_KEY, userId);
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

let db = loadDb();
let sessionUserId = loadSession();

function currentUser() {
  return db.users.find((u) => u.id === sessionUserId) || null;
}

// ---------- Event helpers ----------
function findEvent(id) {
  return db.events.find((ev) => ev.id === id);
}

function isAdmin(ev) {
  return ev.ownerId === sessionUserId;
}

function myGuest(ev) {
  return ev.guests.find((g) => g.userId === sessionUserId);
}

function myStatus(ev) {
  const guest = myGuest(ev);
  return guest ? guest.status : null;
}

// Counts come from the guest list, so changing an answer never double counts.
function countStatus(ev, status) {
  return ev.guests.filter((g) => g.status === status).length;
}

function myClaim(item) {
  return item.claims.find((c) => c.userId === sessionUserId);
}

function dietCounts(ev) {
  const counts = {};
  ev.guests.filter((g) => g.status === "going").forEach((g) => {
    g.diet.forEach((key) => { counts[key] = (counts[key] || 0) + 1; });
  });
  return counts;
}

// ---------- Dates and times ----------
const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const pad = (n) => String(n).padStart(2, "0");

function eventStart(ev) {
  return new Date(`${ev.date}T${ev.start}`);
}

function eventEnd(ev) {
  return new Date(`${ev.date}T${ev.end}`);
}

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// "2027-01-17" -> "Sunday, 17th January 2027"
function formatDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()];
  const suffix = day % 10 === 1 && day !== 11 ? "st"
    : day % 10 === 2 && day !== 12 ? "nd"
    : day % 10 === 3 && day !== 13 ? "rd" : "th";
  return `${weekday}, ${day}${suffix} ${MONTHS[month - 1]} ${year}`;
}

// "2027-01-17" -> "Sun 17 Jan"
function formatShortDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()];
  return `${weekday.slice(0, 3)} ${day} ${MONTHS[month - 1].slice(0, 3)}`;
}

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// "13:00", "18:30" -> "5½ hours"
function formatDuration(start, end) {
  const minutes = toMinutes(end) - toMinutes(start);
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (rest === 0) return hours === 1 ? "1 hour" : `${hours} hours`;
  if (rest === 30) return `${hours || ""}½ hours`;
  return hours ? `${hours} h ${rest} min` : `${rest} min`;
}

function minutesUntilStart(ev) {
  return (eventStart(ev) - Date.now()) / 60000;
}

function isPast(ev) {
  return eventEnd(ev) <= Date.now();
}

// "In 81 days", "Tomorrow at 13:00", "Starts in 25 min", ...
function whenLabel(ev) {
  const now = Date.now();
  if (now >= eventEnd(ev)) return "Ended";
  if (now >= eventStart(ev)) return "Happening now";
  const minutes = Math.ceil(minutesUntilStart(ev));
  if (minutes <= 60) return `Starts in ${minutes} min`;
  const today = new Date(`${todayIso()}T00:00`);
  const days = Math.round((new Date(`${ev.date}T00:00`) - today) / 86400000);
  if (days === 0) return `Today at ${ev.start}`;
  if (days === 1) return `Tomorrow at ${ev.start}`;
  return `In ${days} days`;
}

function mapsLink(ev) {
  return safeUrl(ev.mapsUrl)
    || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location)}`;
}

// ---------- Small render pieces ----------
const AVATAR_COLORS = ["#f6d9c9", "#d7e8d0", "#d5e3f0", "#efe0b9", "#e6d6ee", "#f3d3d8"];

function avatar(name) {
  const color = AVATAR_COLORS[name.length % AVATAR_COLORS.length];
  return `<span class="avatar" style="background:${color}" aria-hidden="true">${esc(name.charAt(0).toUpperCase())}</span>`;
}

function avatarStack(guests) {
  const shown = guests.slice(0, 4).map((g) => avatar(g.name)).join("");
  const more = guests.length > 4 ? `<span class="avatar avatar-more" aria-hidden="true">+${guests.length - 4}</span>` : "";
  return `<span class="avatar-stack">${shown}${more}</span>`;
}

function statusChip(ev) {
  if (isAdmin(ev)) return `<span class="chip chip-accent">${icon("star")} Organizer</span>`;
  const status = myStatus(ev);
  if (status === "going") return `<span class="chip chip-accent">${icon("check")} Going</span>`;
  if (status === "maybe") return `<span class="chip">${icon("help")} Maybe</span>`;
  if (status === "cant") return `<span class="chip">${icon("x")} Can't go</span>`;
  return `<span class="chip chip-warn">Please answer</span>`;
}

// Banner for events that start within 30 minutes (only for people who are coming).
function reminderBanner(events) {
  const soon = events.filter((ev) => {
    const minutes = minutesUntilStart(ev);
    return minutes > 0 && minutes <= REMINDER_MINUTES && ["going", "maybe"].includes(myStatus(ev));
  });
  return soon.map((ev) => `
    <div class="banner" role="status">
      <span class="banner-emoji" aria-hidden="true">⏰</span>
      <span><strong>${esc(ev.title)}</strong> starts in ${Math.ceil(minutesUntilStart(ev))} minutes
      at ${esc(ev.location)}. See you there!</span>
    </div>`).join("");
}

// ---------- Screens + routing ----------
// Routes: #/home, #/create, #/event/<id>, #/event/<id>/edit, #/event/<id>/diet
const SCREENS = ["auth", "home", "form", "event", "diet"];
let shownRoute = null; // the route that is on screen now
let currentEventId = null;
const openWhoLists = new Set(); // which "See who's bringing" lists are open

function parseHash() {
  const [path, query = ""] = location.hash.slice(1).split("?");
  return { parts: path.split("/").filter(Boolean).map(decodeURIComponent), params: new URLSearchParams(query) };
}

function isNewRoute() {
  return location.hash !== shownRoute;
}

function showScreen(name, focusId) {
  SCREENS.forEach((s) => { $(`${s}-screen`).hidden = s !== name; });
  if (isNewRoute()) {
    shownRoute = location.hash;
    window.scrollTo(0, 0);
    if (focusId && $(focusId)) $(focusId).focus();
  }
}

function render() {
  const user = currentUser();
  $("topbar").hidden = !user;
  if (!user) {
    showScreen("auth", "auth-title");
    return;
  }
  $("topbar-name").textContent = user.name;
  $("topbar-avatar").textContent = user.name.charAt(0).toUpperCase();
  checkReminders();

  const { parts, params } = parseHash();
  if (parts[0] === "event" && parts[1]) {
    const id = parts[1];
    if (params.has("data")) {
      importSharedEvent(id, params.get("data"));
      history.replaceState(null, "", `#/event/${encodeURIComponent(id)}`);
    }
    const ev = findEvent(id);
    if (!ev) {
      showToast("This event doesn't exist (anymore).");
      location.hash = "#/home";
      return;
    }
    if (currentEventId !== id) openWhoLists.clear();
    currentEventId = id;
    if (parts[2] === "edit" && isAdmin(ev)) return renderForm(ev);
    if (parts[2] === "diet") return renderDiet(ev);
    return renderEvent(ev);
  }

  currentEventId = null;
  if (parts[0] === "create") return renderForm(null);
  renderHome();
}

// Re-render the same screen after a change and keep keyboard focus on the same button.
function refresh() {
  const active = document.activeElement;
  const action = active && active.dataset ? active.dataset.action : null;
  const id = active && active.dataset ? active.dataset.id : null;
  render();
  if (action) focusAction(action, id);
}

function focusAction(action, id) {
  let selector = `[data-action="${action}"]`;
  if (id) selector += `[data-id="${CSS.escape(id)}"]`;
  const el = document.querySelector(selector);
  if (el) el.focus();
}

let toastTimer;
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

// ---------- Home ----------
function renderHome() {
  const user = currentUser();
  const events = [...db.events].sort((a, b) => eventStart(a) - eventStart(b));
  const upcoming = events.filter((ev) => !isPast(ev));
  const past = events.filter(isPast).reverse();
  const goingTo = upcoming.filter((ev) => myStatus(ev) === "going").length;
  const organizing = upcoming.filter(isAdmin).length;

  $("home-content").innerHTML = `
    <section class="hero">
      <div class="hero-text">
        <p class="hero-hello">Hi ${esc(user.name)} 👋</p>
        <h1 id="home-title" tabindex="-1">What's happening in your building</h1>
        <p>Join an event and say what you bring. No more guessing in the group chat.</p>
      </div>
      <div class="hero-art" aria-hidden="true"><span>🏠</span><span>🎉</span><span>🍲</span></div>
    </section>

    <ul class="stats" aria-label="Your overview">
      <li class="stat">${icon("calendar")}<strong>${upcoming.length}</strong><span>upcoming</span></li>
      <li class="stat">${icon("check")}<strong>${goingTo}</strong><span>you're going</span></li>
      <li class="stat">${icon("star")}<strong>${organizing}</strong><span>you organize</span></li>
    </ul>

    ${reminderBanner(upcoming)}

    <button type="button" class="primary-btn big" data-action="create">${icon("plus")} Create an event</button>

    <h2 class="section-title">Upcoming events</h2>
    ${upcoming.length
      ? `<ul class="event-list">${upcoming.map(eventCard).join("")}</ul>`
      : `<div class="empty"><span aria-hidden="true">🗓️</span><p>No events yet. Be the first and create one!</p></div>`}

    ${past.length ? `
      <h2 class="section-title">Past events</h2>
      <ul class="event-list">${past.map(eventCard).join("")}</ul>` : ""}
  `;
  showScreen("home", "home-title");
}

function eventCard(ev) {
  const [, month, day] = ev.date.split("-").map(Number);
  const goingGuests = ev.guests.filter((g) => g.status === "going");
  const emojis = ev.items.slice(0, 4).map((i) => esc(i.emoji)).join(" ");
  return `
    <li>
      <button type="button" class="event-card ${isPast(ev) ? "is-past" : ""}" data-action="open-event" data-id="${esc(ev.id)}">
        <span class="date-badge" aria-hidden="true">
          <span>${MONTHS[month - 1].slice(0, 3)}</span><strong>${day}</strong>
        </span>
        <span class="event-card-body">
          <span class="event-card-top">
            <span class="event-card-title">${esc(ev.title)}</span>
            ${statusChip(ev)}
          </span>
          <span class="meta">${icon("clock")} ${formatShortDate(ev.date)} · ${ev.start}–${ev.end}</span>
          <span class="meta">${icon("pin")} ${esc(ev.location)}</span>
          ${emojis ? `<span class="meta food-row"><span class="visually-hidden">Bring-list: </span>${emojis}</span>` : ""}
          <span class="event-card-footer">
            ${avatarStack(goingGuests)}
            <span><strong>${goingGuests.length}</strong> of ${ev.capacity} going</span>
            <span class="when">${whenLabel(ev)}</span>
          </span>
        </span>
      </button>
    </li>`;
}

// ---------- Event page ----------
const STATUS_HINTS = {
  going: "🎉 Great, you're going! The organizer can plan food and space for you.",
  maybe: "You said maybe. Please decide soon, it helps the organizer plan.",
  cant: "Thanks for letting us know. Maybe next time!",
};

function renderEvent(ev) {
  const status = myStatus(ev);
  const guest = myGuest(ev);
  const admin = isAdmin(ev);
  const going = countStatus(ev, "going");
  const maybe = countStatus(ev, "maybe");
  const spotsLeft = Math.max(0, ev.capacity - going);
  const percent = Math.min(100, (going / ev.capacity) * 100);
  const coming = status === "going" || status === "maybe";
  const remindOn = guest && guest.remind !== false;

  $("event-content").innerHTML = `
    ${reminderBanner([ev])}

    <article class="card event-hero">
      <div class="hero-chips">
        <span class="chip chip-accent">${icon("clock")} ${whenLabel(ev)}</span>
        ${admin ? `<span class="chip">${icon("star")} You organize this</span>` : ""}
      </div>
      <h1 id="event-title" tabindex="-1">${esc(ev.title)}</h1>
      <p class="organizer">${avatar(ev.ownerName)} Organized by <strong>${esc(ev.ownerName)}</strong></p>

      <ul class="facts">
        <li>${icon("calendar")}<div><span class="fact-label">Date</span>${formatDate(ev.date)}</div></li>
        <li>${icon("clock")}<div><span class="fact-label">Time</span>${ev.start} – ${ev.end}
          <span class="muted">(${formatDuration(ev.start, ev.end)})</span></div></li>
        <li>${icon("pin")}<div><span class="fact-label">Location</span>${esc(ev.location)}<br>
          <a href="${esc(mapsLink(ev))}" target="_blank" rel="noopener noreferrer" class="maps-link">
            Open in Google Maps ${icon("external")}<span class="visually-hidden">(opens in a new tab)</span></a></div></li>
        ${ev.vibe ? `<li>${icon("music")}<div><span class="fact-label">Vibe</span>${esc(ev.vibe)}</div></li>` : ""}
      </ul>

      <div class="action-row">
        ${admin ? `
          <button type="button" class="secondary-btn" data-action="edit">${icon("edit")} Edit event</button>
          <button type="button" class="secondary-btn" data-action="copy-link">${icon("link")} Copy invite link</button>
          ${navigator.share ? `<button type="button" class="secondary-btn" data-action="share">${icon("share")} Share</button>` : ""}` : ""}
        <button type="button" class="secondary-btn" data-action="calendar">${icon("calendar")} Add to calendar</button>
        ${coming ? `
          <button type="button" class="secondary-btn" data-action="remind" aria-pressed="${remindOn}">
            ${icon("bell")} ${remindOn ? "Reminder on" : "Remind me"}
          </button>` : ""}
      </div>
    </article>

    <section class="card" aria-labelledby="count-heading">
      <div class="card-head">
        <h2 id="count-heading">Who's coming</h2>
        <button type="button" class="icon-btn" data-action="info" aria-label="Show headcount details" aria-haspopup="dialog">${icon("info")}</button>
      </div>
      <ul class="count-tiles">
        <li><strong>${going}</strong><span>going</span></li>
        <li><strong>${maybe}</strong><span>maybe</span></li>
        <li><strong>${spotsLeft}</strong><span>${spotsLeft === 1 ? "spot" : "spots"} left</span></li>
      </ul>
      <div class="progress" role="progressbar" aria-label="People going compared to capacity"
           aria-valuemin="0" aria-valuemax="${ev.capacity}" aria-valuenow="${going}"
           aria-valuetext="${going} of ${ev.capacity} spots taken">
        <div class="progress-fill" style="width:${percent}%"></div>
      </div>
      <p class="progress-label">${going} of ${ev.capacity} spots taken</p>

      <h2 id="rsvp-heading" class="rsvp-heading">Will you come?</h2>
      <div class="rsvp" role="group" aria-labelledby="rsvp-heading">
        <button type="button" data-action="rsvp" data-id="going" aria-pressed="${status === "going"}">${icon("check")} Going</button>
        <button type="button" data-action="rsvp" data-id="maybe" aria-pressed="${status === "maybe"}">${icon("help")} Maybe</button>
        <button type="button" data-action="rsvp" data-id="cant" aria-pressed="${status === "cant"}">${icon("x")} Can't go</button>
      </div>
      <p class="status-hint">${STATUS_HINTS[status] || "Please answer, so the organizer knows how much food and space to plan."}</p>

      ${dietSummary(ev)}
      ${status === "going" ? `<button type="button" class="link-btn" data-action="diet">Edit my dietary info</button>` : ""}
    </section>

    ${admin ? guestListCard(ev) : ""}

    <section aria-labelledby="bring-heading">
      <h2 id="bring-heading" class="section-title">What to bring</h2>
      <p class="muted section-hint">Each dish needs <strong>${ev.portions} portions</strong>.
        Pick one that still needs portions, so we get variety.</p>
      <ul class="grid">
        ${ev.items.map((item) => itemCard(ev, item)).join("")}
        <li>
          <button type="button" class="add-card" data-action="add-item">
            <span class="add-plus" aria-hidden="true">${icon("plus")}</span>
            Add something else to bring
          </button>
        </li>
      </ul>
    </section>
  `;
  showScreen("event", "event-title");
}

function dietSummary(ev) {
  const counts = dietCounts(ev);
  const keys = Object.keys(DIETS).filter((key) => counts[key]);
  return `
    <div class="diet-summary">
      <h3>Dietary needs of the guests</h3>
      ${keys.length
        ? `<ul class="chips">${keys.map((key) =>
            `<li class="chip"><span aria-hidden="true">${DIETS[key].emoji}</span> ${counts[key]} ${DIETS[key].label.toLowerCase()}</li>`).join("")}</ul>`
        : `<p class="muted">No dietary needs so far.</p>`}
    </div>`;
}

function guestListCard(ev) {
  const groups = [["going", "Going", "check"], ["maybe", "Maybe", "help"], ["cant", "Can't go", "x"]];
  return `
    <section class="card" aria-labelledby="guests-heading">
      <div class="card-head">
        <h2 id="guests-heading">${icon("users")} Guest list</h2>
        <span class="chip">Only you see this</span>
      </div>
      ${groups.map(([status, label, iconName]) => {
        const list = ev.guests.filter((g) => g.status === status);
        return `
          <h3 class="guest-group">${icon(iconName)} ${label} <span class="muted">(${list.length})</span></h3>
          <ul class="guest-list">
            ${list.length ? list.map((g) => `
              <li>
                ${avatar(g.name)}
                <span class="guest-name">${esc(g.name)}${g.userId === sessionUserId ? " (you)" : ""}</span>
                ${g.diet.map((key) => `<span class="tag">${DIETS[key].emoji} ${key === "other" && g.other ? esc(g.other) : DIETS[key].label}</span>`).join("")}
              </li>`).join("") : `<li class="muted">Nobody yet</li>`}
          </ul>`;
      }).join("")}
    </section>`;
}

function itemCard(ev, item) {
  const mine = myClaim(item);
  const taken = item.claims.length;
  const needed = Math.max(0, ev.portions - taken);
  const full = needed === 0;
  const whoOpen = openWhoLists.has(item.id);
  const id = esc(item.id);

  // The user can always change or undo their own claim, even if their portion filled the dish.
  let button;
  if (mine) {
    button = `<button type="button" class="claim-btn" data-action="claim" data-id="${id}" aria-pressed="true">
      ${icon("check")} You bring${mine.note ? `: ${esc(mine.note)}` : " this"}</button>`;
  } else if (full) {
    button = `<button type="button" class="claim-btn" disabled>Enough already</button>`;
  } else {
    button = `<button type="button" class="claim-btn" data-action="claim" data-id="${id}" aria-pressed="false">I'll bring this</button>`;
  }

  return `
    <li class="item-card ${full ? "is-full" : ""} ${mine ? "is-mine" : ""}">
      <span class="item-emoji" aria-hidden="true">${esc(item.emoji)}</span>
      <h3>${esc(item.name)}</h3>
      <p class="needed">${full
        ? `✅ All ${ev.portions} portions covered`
        : `<strong>${needed}</strong> more ${needed === 1 ? "portion" : "portions"} needed`}</p>
      <div class="mini-bar" aria-hidden="true"><div style="width:${Math.min(100, (taken / ev.portions) * 100)}%"></div></div>
      <p class="bringing">${taken === 0 ? "Nobody is bringing this yet" : `${taken} ${taken === 1 ? "neighbor is" : "neighbors are"} bringing it`}</p>
      ${full && !mine ? `<p class="full-note">This item is full, please choose something else.</p>` : ""}
      ${button}
      ${taken ? `
        <button type="button" class="link-btn" data-action="who" data-id="${id}"
                aria-expanded="${whoOpen}" aria-controls="who-${id}">
          ${whoOpen ? "Hide" : "See"} who's bringing it
        </button>
        <ul id="who-${id}" class="who-list" ${whoOpen ? "" : "hidden"}>
          ${item.claims.map((c) => `<li><strong>${c.userId === sessionUserId ? "You" : esc(c.name)}</strong>${c.note ? `: ${esc(c.note)}` : ""}</li>`).join("")}
        </ul>` : ""}
    </li>`;
}

// ---------- RSVP ----------
function setRsvp(ev, status) {
  const user = currentUser();
  let guest = myGuest(ev);
  const alreadyGoing = guest && guest.status === "going";
  if (status === "going" && !alreadyGoing && countStatus(ev, "going") >= ev.capacity) {
    showToast("Sorry, this event is full. You can answer Maybe instead.");
    return;
  }
  if (guest) {
    guest.status = status;
  } else {
    guest = { userId: user.id, name: user.name, status, diet: [], other: "", remind: true };
    ev.guests.push(guest);
  }
  saveDb();
  if (status !== "cant") askNotificationPermission();
  if (status === "going") location.hash = `#/event/${encodeURIComponent(ev.id)}/diet`;
  else refresh();
}

// ---------- Bring-list: claim with "what exactly" ----------
let bringItemId = null;

function openBringDialog(ev, itemId) {
  const item = ev.items.find((i) => i.id === itemId);
  const mine = myClaim(item);
  bringItemId = itemId;
  $("bring-title").textContent = mine ? `You bring ${item.name} ${item.emoji}` : `Bring ${item.name} ${item.emoji}`;
  $("bring-note").value = mine ? mine.note : "";
  $("bring-confirm").textContent = mine ? "Save" : "Yes, I'll bring it";
  $("bring-remove").hidden = !mine;
  $("bring-dialog").showModal();
}

$("bring-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const ev = findEvent(currentEventId);
  const item = ev.items.find((i) => i.id === bringItemId);
  const mine = myClaim(item);
  const note = $("bring-note").value.trim();

  if (event.submitter && event.submitter.value === "remove") {
    item.claims = item.claims.filter((c) => c !== mine);
    showToast(`Okay, you're not bringing ${item.name}.`);
  } else if (mine) {
    mine.note = note;
    showToast("Saved!");
  } else if (item.claims.length >= ev.portions) {
    showToast(`Sorry, ${item.name} just got full. Please choose something else.`);
  } else {
    item.claims.push({ userId: sessionUserId, name: currentUser().name, note });
    showToast(`Thanks! You're bringing ${note || item.name}.`);
  }
  saveDb();
  $("bring-dialog").close();
  render();
  focusAction("claim", item.id);
});

// ---------- Bring-list: add something else ----------
function fillFoodSelect(select, placeholder, withOther) {
  select.innerHTML = `<option value="">${placeholder}</option>`
    + FOOD_TYPES.map((t) => `<option value="${esc(t.name)}">${t.emoji} ${esc(t.name)}</option>`).join("")
    + (withOther ? `<option value="other">${OTHER_EMOJI} Something else…</option>` : "");
}

function openAddDialog() {
  $("add-form").reset();
  $("add-name-wrap").hidden = true;
  $("add-error").textContent = "";
  $("add-dialog").showModal();
}

$("add-type").addEventListener("change", () => {
  const isOther = $("add-type").value === "other";
  $("add-name-wrap").hidden = !isOther;
  if (isOther) $("add-name").focus();
});

$("add-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const ev = findEvent(currentEventId);
  const type = $("add-type").value;
  const name = type === "other" ? $("add-name").value.trim() : type;
  const error = $("add-error");

  if (!name) {
    error.textContent = type === "other" ? "Please type a name." : "Please choose what it is.";
    return;
  }
  if (ev.items.some((i) => i.name.toLowerCase() === name.toLowerCase())) {
    error.textContent = `"${name}" is already on the list. You can bring it there.`;
    return;
  }

  const item = { id: uid(), name, emoji: emojiFor(name), claims: [] };
  if ($("add-bring").checked) {
    item.claims.push({ userId: sessionUserId, name: currentUser().name, note: $("add-note").value.trim() });
  }
  ev.items.push(item);
  saveDb();
  $("add-dialog").close();
  render();
  focusAction("claim", item.id);
  showToast(`${item.emoji} ${name} was added to the bring-list.`);
});

// Cancel buttons inside dialogs
document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", () => $(btn.dataset.close).close());
});

// ---------- Create / edit event ----------
let formEventId = null; // null = creating a new event
let formItems = []; // [{ id (null for new), name, emoji }]

function renderForm(ev) {
  if (isNewRoute()) {
    formEventId = ev ? ev.id : null;
    $("event-form").reset();
    $("form-title").textContent = ev ? "Edit event" : "Create an event";
    $("form-submit").textContent = ev ? "Save changes" : "Create event";
    $("f-date").min = ev ? "" : todayIso(); // no new events in the past

    if (ev) {
      $("f-title").value = ev.title;
      $("f-vibe").value = ev.vibe;
      $("f-date").value = ev.date;
      $("f-start").value = ev.start;
      $("f-end").value = ev.end;
      $("f-location").value = ev.location;
      $("f-maps").value = ev.mapsUrl;
      $("f-capacity").value = ev.capacity;
      $("f-portions").value = ev.portions;
    }
    formItems = ev
      ? ev.items.map((i) => ({ id: i.id, name: i.name, emoji: i.emoji }))
      : ["Salad", "Main dish", "Dessert", "Drinks"].map((name) => ({ id: null, name, emoji: emojiFor(name) }));
    renderChips();
  }
  showScreen("form", "form-title");
}

function renderChips() {
  $("food-chips").innerHTML = formItems.length
    ? formItems.map((item, i) => `
        <li class="chip food-chip">
          <span aria-hidden="true">${esc(item.emoji)}</span> ${esc(item.name)}
          <button type="button" class="chip-remove" data-remove="${i}" aria-label="Remove ${esc(item.name)}">${icon("x")}</button>
        </li>`).join("")
    : `<li class="muted">Nothing yet. Add dishes from the list or type your own.</li>`;
}

function hasFormItem(name) {
  return formItems.some((i) => i.name.toLowerCase() === name.toLowerCase());
}

$("food-add-btn").addEventListener("click", () => {
  const name = $("food-select").value;
  if (!name) {
    showToast("Choose a dish from the list first.");
    return;
  }
  if (hasFormItem(name)) {
    showToast(`${name} is already on the list.`);
  } else {
    formItems.push({ id: null, name, emoji: emojiFor(name) });
    renderChips();
  }
  $("food-select").value = "";
});

$("food-chips").addEventListener("click", (event) => {
  const btn = event.target.closest("[data-remove]");
  if (!btn) return;
  const index = Number(btn.dataset.remove);
  const item = formItems[index];
  const ev = formEventId && findEvent(formEventId);
  const existing = ev && item.id && ev.items.find((i) => i.id === item.id);
  if (existing && existing.claims.length
      && !confirm(`${existing.claims.length} people already bring ${item.name}. Remove it anyway?`)) {
    return;
  }
  formItems.splice(index, 1);
  renderChips();
  $("food-select").focus();
});

$("f-end").addEventListener("input", () => $("f-end").setCustomValidity(""));
$("f-maps").addEventListener("input", () => $("f-maps").setCustomValidity(""));

$("event-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const endInput = $("f-end");
  if (toMinutes(endInput.value) <= toMinutes($("f-start").value)) {
    endInput.setCustomValidity("The event must end after it starts.");
    endInput.reportValidity();
    return;
  }
  const mapsInput = $("f-maps");
  if (mapsInput.value.trim() && !safeUrl(mapsInput.value.trim())) {
    mapsInput.setCustomValidity("Please paste a link that starts with https://");
    mapsInput.reportValidity();
    return;
  }

  // Add the typed extras ("Lemonade, Plates") to the chosen dishes.
  $("food-custom").value.split(",").map((s) => s.trim()).filter(Boolean).forEach((name) => {
    if (!hasFormItem(name)) formItems.push({ id: null, name, emoji: emojiFor(name) });
  });

  const fields = {
    title: $("f-title").value.trim(),
    vibe: $("f-vibe").value.trim(),
    date: $("f-date").value,
    start: $("f-start").value,
    end: endInput.value,
    location: $("f-location").value.trim(),
    mapsUrl: mapsInput.value.trim(),
    capacity: Number($("f-capacity").value),
    portions: Number($("f-portions").value),
  };

  const user = currentUser();
  let ev = formEventId ? findEvent(formEventId) : null;
  if (ev) {
    Object.assign(ev, fields);
    // Keep existing dishes (with their claims), add the new ones.
    ev.items = formItems.map((fi) => (fi.id && ev.items.find((i) => i.id === fi.id))
      || { id: uid(), name: fi.name, emoji: fi.emoji, claims: [] });
    showToast("Changes saved.");
  } else {
    ev = {
      id: uid(),
      ownerId: user.id,
      ownerName: user.name,
      ...fields,
      // The organizer is going to their own event.
      guests: [{ userId: user.id, name: user.name, status: "going", diet: [], other: "", remind: true }],
      items: formItems.map((fi) => ({ id: uid(), name: fi.name, emoji: fi.emoji, claims: [] })),
    };
    db.events.push(ev);
    showToast("Event created! Use “Copy invite link” to invite your neighbors.");
  }
  saveDb();
  location.hash = `#/event/${encodeURIComponent(ev.id)}`;
});

// ---------- Allergy & Diet ----------
const dietForm = $("diet-form");
const otherCheck = $("other-check");

function renderDiet(ev) {
  if (isNewRoute()) {
    const guest = myGuest(ev) || { diet: [], other: "" };
    $("diet-event-name").textContent = ev.title;
    dietForm.querySelectorAll('input[name="diet"]').forEach((box) => {
      box.checked = guest.diet.includes(box.value);
    });
    $("other-text").value = guest.other;
    $("other-wrap").hidden = !otherCheck.checked;
  }
  showScreen("diet", "diet-title");
}

otherCheck.addEventListener("change", () => {
  $("other-wrap").hidden = !otherCheck.checked;
  if (otherCheck.checked) $("other-text").focus();
});

dietForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const ev = findEvent(currentEventId);
  const guest = myGuest(ev);
  if (guest) {
    guest.diet = [...dietForm.querySelectorAll('input[name="diet"]:checked')].map((box) => box.value);
    guest.other = otherCheck.checked ? $("other-text").value.trim() : "";
    saveDb();
    showToast("Thanks! Your dietary info is saved.");
  }
  location.hash = `#/event/${encodeURIComponent(ev.id)}`;
});

// ---------- Invite link ----------
// There is no server, so the link carries the event details. Opening it adds the event on that device.
function inviteLink(ev) {
  const data = {
    title: ev.title, vibe: ev.vibe, date: ev.date, start: ev.start, end: ev.end,
    location: ev.location, mapsUrl: ev.mapsUrl, capacity: ev.capacity, portions: ev.portions,
    ownerId: ev.ownerId, ownerName: ev.ownerName,
    items: ev.items.map(({ id, name, emoji }) => ({ id, name, emoji })),
  };
  const base = location.href.split("#")[0];
  return `${base}#/event/${encodeURIComponent(ev.id)}?data=${encodeURIComponent(JSON.stringify(data))}`;
}

function importSharedEvent(id, raw) {
  if (findEvent(id)) return;
  try {
    const d = JSON.parse(raw);
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(d.date);
    const validTimes = /^\d{2}:\d{2}$/.test(d.start) && /^\d{2}:\d{2}$/.test(d.end);
    if (!validDate || !validTimes) return;
    db.events.push({
      id,
      ownerId: String(d.ownerId),
      ownerName: String(d.ownerName || "A neighbor"),
      title: String(d.title || "Event"),
      vibe: String(d.vibe || ""),
      date: d.date,
      start: d.start,
      end: d.end,
      location: String(d.location || ""),
      mapsUrl: String(d.mapsUrl || ""),
      capacity: Number(d.capacity) || 30,
      portions: Number(d.portions) || 10,
      guests: [],
      items: (d.items || []).map((i) => ({
        id: String(i.id), name: String(i.name), emoji: String(i.emoji || OTHER_EMOJI), claims: [],
      })),
    });
    saveDb();
  } catch {
    // Broken link: the "event doesn't exist" message will show.
  }
}

async function copyInviteLink(ev) {
  const link = inviteLink(ev);
  try {
    await navigator.clipboard.writeText(link);
    showToast("Invite link copied! Paste it in your building's WhatsApp group.");
  } catch {
    // Clipboard not allowed (e.g. opened as a file): show the link to copy by hand.
    $("link-input").value = link;
    $("link-dialog").showModal();
    $("link-input").select();
  }
}

// ---------- Calendar file (.ics) with reminders ----------
function downloadIcs(ev) {
  const icsText = (s) => String(s).replace(/\\/g, "\\\\").replace(/[,;]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");
  const localTime = (time) => `${ev.date.replace(/-/g, "")}T${time.replace(":", "")}00`;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const alarm = (trigger, text) =>
    ["BEGIN:VALARM", `TRIGGER:${trigger}`, "ACTION:DISPLAY", `DESCRIPTION:${icsText(text)}`, "END:VALARM"];

  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Neighbor Events//EN",
    "BEGIN:VEVENT",
    `UID:${ev.id}@neighbor-events`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${localTime(ev.start)}`,
    `DTEND:${localTime(ev.end)}`,
    `SUMMARY:${icsText(ev.title)}`,
    `LOCATION:${icsText(ev.location)}`,
    `DESCRIPTION:${icsText(`${ev.vibe ? ev.vibe + "\n" : ""}Map: ${mapsLink(ev)}`)}`,
    ...alarm("-P1D", `${ev.title} is tomorrow`),
    ...alarm(`-PT${REMINDER_MINUTES}M`, `${ev.title} starts in ${REMINDER_MINUTES} minutes`),
    "END:VEVENT", "END:VCALENDAR",
  ];

  const url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${ev.title.replace(/[^\w-]+/g, "-").toLowerCase() || "event"}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("Calendar file downloaded. Open it to add the event with reminders.");
}

// ---------- Notifications + reminders ----------
// Reminders: 1 day before and 30 minutes before, for people who are going or maybe.
// Without a server they only fire while the app is open. The calendar file works always.
let swRegistration = null;
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").then((reg) => { swRegistration = reg; }).catch(() => {});
}

function askNotificationPermission() {
  if (!("Notification" in window) || Notification.permission !== "default") {
    return Promise.resolve("Notification" in window ? Notification.permission : "unsupported");
  }
  return Notification.requestPermission();
}

function notify(title, body) {
  showToast(`${title}: ${body}`);
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  if (swRegistration) {
    swRegistration.showNotification(title, { body });
  } else {
    try { new Notification(title, { body }); } catch { /* not supported here */ }
  }
}

async function toggleReminder(ev) {
  const guest = myGuest(ev);
  guest.remind = guest.remind === false;
  saveDb();
  refresh();
  if (!guest.remind) {
    showToast("Reminder turned off.");
    return;
  }
  const permission = await askNotificationPermission();
  showToast(permission === "granted"
    ? "We'll remind you 1 day and 30 minutes before."
    : "Reminders will show in the app. Allow notifications in your browser to get them on your phone.");
}

function checkReminders() {
  const user = currentUser();
  if (!user) return;
  let sent = false;

  db.events.forEach((ev) => {
    const guest = myGuest(ev);
    if (!guest || guest.status === "cant" || guest.remind === false) return;
    const minutes = minutesUntilStart(ev);
    const reminders = [
      { key: "30min", due: minutes > 0 && minutes <= REMINDER_MINUTES,
        text: `Starts in ${Math.ceil(minutes)} minutes at ${ev.location}` },
      { key: "1day", due: minutes > REMINDER_MINUTES && minutes <= 24 * 60,
        text: `${whenLabel(ev)} at ${ev.location}` },
    ];
    reminders.forEach((r) => {
      const key = `${user.id}:${ev.id}:${r.key}`;
      if (!r.due || db.reminded.includes(key)) return;
      db.reminded.push(key);
      sent = true;
      notify(`⏰ ${ev.title}`, r.text);
    });
  });

  if (sent) saveDb();
}

// Check every 30 seconds; also update countdowns and the "starts soon" banner.
setInterval(() => {
  checkReminders();
  const onLiveScreen = !$("home-screen").hidden || !$("event-screen").hidden;
  if (onLiveScreen && !document.querySelector("dialog[open]")) refresh();
}, 30000);

// ---------- Login / Sign up ----------
function setAuthMode(mode) {
  document.querySelectorAll("[data-auth]").forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.dataset.auth === mode);
  });
  $("login-form").hidden = mode !== "login";
  $("signup-form").hidden = mode !== "signup";
  $("login-error").textContent = "";
  $("signup-error").textContent = "";
}

document.querySelectorAll("[data-auth]").forEach((btn) => {
  btn.addEventListener("click", () => setAuthMode(btn.dataset.auth));
});

function logIn(user, message) {
  setSession(user.id);
  shownRoute = null;
  if (!location.hash || location.hash === "#") location.hash = "#/home";
  render();
  checkReminders();
  showToast(message);
}

$("login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = $("login-email").value.trim().toLowerCase();
  const password = $("login-password").value;
  const user = db.users.find((u) => u.email === email);
  if (!email || !password) {
    $("login-error").textContent = "Please fill in your email and password.";
  } else if (!user || user.password !== hashPassword(password)) {
    $("login-error").textContent = "Wrong email or password. No account yet? Choose “Sign up”.";
  } else {
    event.target.reset();
    logIn(user, `Welcome back, ${user.name}!`);
  }
});

$("signup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("signup-name").value.trim();
  const email = $("signup-email").value.trim().toLowerCase();
  const password = $("signup-password").value;
  const error = $("signup-error");
  if (!name || !email || !password) {
    error.textContent = "Please fill in all fields.";
  } else if (!$("signup-email").checkValidity()) {
    error.textContent = "Please enter a valid email address.";
  } else if (password.length < 6) {
    error.textContent = "Your password needs at least 6 characters.";
  } else if (db.users.some((u) => u.email === email)) {
    error.textContent = "There is already an account with this email. Please log in.";
  } else {
    const user = { id: uid(), name, email, password: hashPassword(password) };
    db.users.push(user);
    saveDb();
    event.target.reset();
    logIn(user, `Welcome, ${name}! 🎉`);
  }
});

// ---------- Buttons with data-action ----------
const actions = {
  home: () => { location.hash = "#/home"; },
  create: () => { location.hash = "#/create"; },
  "open-event": (el) => { location.hash = `#/event/${encodeURIComponent(el.dataset.id)}`; },
  logout: () => {
    setSession(null);
    shownRoute = null;
    setAuthMode("login");
    location.hash = "#/home";
    render();
    showToast("You're logged out.");
  },
  reset: () => {
    if (!confirm("Reset all demo data? Created events and accounts will be deleted.")) return;
    db = seedDb();
    saveDb();
    actions.logout();
  },
  "form-back": () => {
    location.hash = formEventId ? `#/event/${encodeURIComponent(formEventId)}` : "#/home";
  },
  "diet-back": (el, ev) => { location.hash = `#/event/${encodeURIComponent(ev.id)}`; },
  rsvp: (el, ev) => setRsvp(ev, el.dataset.id),
  info: (el, ev) => {
    $("info-text").textContent = `${countStatus(ev, "going")} going, ${countStatus(ev, "maybe")} maybe`;
    $("info-dialog").showModal();
  },
  edit: (el, ev) => { location.hash = `#/event/${encodeURIComponent(ev.id)}/edit`; },
  "copy-link": (el, ev) => copyInviteLink(ev),
  share: (el, ev) => {
    navigator.share({ title: ev.title, text: `Join "${ev.title}" in our building!`, url: inviteLink(ev) })
      .catch(() => {}); // user closed the share sheet
  },
  calendar: (el, ev) => downloadIcs(ev),
  remind: (el, ev) => toggleReminder(ev),
  diet: (el, ev) => { location.hash = `#/event/${encodeURIComponent(ev.id)}/diet`; },
  claim: (el, ev) => openBringDialog(ev, el.dataset.id),
  who: (el) => {
    const id = el.dataset.id;
    if (openWhoLists.has(id)) openWhoLists.delete(id);
    else openWhoLists.add(id);
    refresh();
  },
  "add-item": () => openAddDialog(),
};

document.addEventListener("click", (event) => {
  const el = event.target.closest("[data-action]");
  if (!el || !actions[el.dataset.action]) return;
  const ev = currentEventId ? findEvent(currentEventId) : null;
  actions[el.dataset.action](el, ev);
});

// ---------- Start ----------
document.querySelectorAll("[data-icon]").forEach((el) => { el.outerHTML = icon(el.dataset.icon); });
fillFoodSelect($("food-select"), "Choose a dish…", false);
fillFoodSelect($("add-type"), "Choose…", true);
window.addEventListener("hashchange", render);
render();
checkReminders();
