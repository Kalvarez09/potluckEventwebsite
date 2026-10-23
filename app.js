// ---------- Mock data ----------
const STORAGE_KEY = "neighbor-events-v2";
const DEFAULT_EMOJI = "🍽️";

const DIET_LABELS = {
  vegetarian: "vegetarian",
  vegan: "vegan",
  "gluten-free": "gluten-free",
  "nut-allergy": "nut allergy",
  other: "other",
};

// baseGoing / baseMaybe / baseDiet / bringers are the other neighbors (not the current user).
// "bringers" are the neighbors who already claimed a portion (1 name = 1 portion).
const MOCK_EVENTS = [
  {
    id: "potluck",
    title: "Dinner Potluck",
    date: "2027-01-17",
    start: "13:00",
    end: "18:30",
    location: "Somewhereweg 27",
    vibe: "Music, drinks, about 30 people expected",
    capacity: 30,
    portions: 10,
    baseGoing: 20,
    baseMaybe: 1,
    baseDiet: { vegetarian: 4, vegan: 0, "gluten-free": 2, "nut-allergy": 1, other: 0 },
    items: [
      { id: "salad", name: "Salad", emoji: "🥗",
        bringers: ["Anna", "Ben", "Carla", "David", "Emma", "Farid", "Greta", "Hugo"] },
      { id: "dessert", name: "Dessert", emoji: "🍰",
        bringers: ["Ines", "Jonas", "Kim", "Lena"] },
      { id: "salt-dish", name: "Salt Dish", emoji: "🍲",
        bringers: ["Mia", "Noah", "Olga", "Paul", "Quinn", "Rosa", "Sami", "Tara", "Umut", "Vera"] },
      { id: "drinks", name: "Drinks", emoji: "🥤",
        bringers: ["Wim"] },
      { id: "fruits", name: "Fruits", emoji: "🍎",
        bringers: ["Xenia", "Yusuf", "Zoe", "Alex", "Bea", "Chris"] },
      { id: "chips", name: "Chips", emoji: "🍟",
        bringers: [] },
    ],
  },
];

// ---------- State (events the user created + the user's answers per event) ----------
function defaultState() {
  return { createdEvents: [], answers: {} };
}

function defaultAnswer() {
  return { rsvp: null, claims: [], diet: [], otherText: "" };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...defaultState(), ...saved };
  } catch {
    return defaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be blocked (e.g. private mode); the app still works for this visit.
  }
}

let state = loadState();
let currentId = null; // id of the event that is open
const openWhoLists = new Set(); // which "See who's bringing it" lists are expanded

function allEvents() {
  return [...MOCK_EVENTS, ...state.createdEvents]
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
}

function currentEvent() {
  return allEvents().find((ev) => ev.id === currentId);
}

function answerFor(eventId) {
  return state.answers[eventId] || defaultAnswer();
}

// Changes the user's answer for the open event and saves it.
function updateAnswer(changes) {
  state.answers[currentId] = { ...answerFor(currentId), ...changes };
  saveState();
}

// ---------- Derived numbers ----------
// Counts are always base + the user's own answer, so changing the answer never double counts.
function goingCount(ev) {
  return ev.baseGoing + (answerFor(ev.id).rsvp === "going" ? 1 : 0);
}

function maybeCount(ev) {
  return ev.baseMaybe + (answerFor(ev.id).rsvp === "maybe" ? 1 : 0);
}

function isMine(ev, item) {
  return answerFor(ev.id).claims.includes(item.id);
}

function claimedCount(ev, item) {
  return item.bringers.length + (isMine(ev, item) ? 1 : 0);
}

// ---------- Formatting ----------
const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

// "2027-01-17" -> "17th January 2027"
function formatDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  const suffix = day % 10 === 1 && day !== 11 ? "st"
    : day % 10 === 2 && day !== 12 ? "nd"
    : day % 10 === 3 && day !== 13 ? "rd" : "th";
  return `${day}${suffix} ${MONTHS[month - 1]} ${year}`;
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

// User-typed text is put into HTML, so escape it first.
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

// ---------- Elements ----------
const $ = (id) => document.getElementById(id);
const createForm = $("create-form");
const dietForm = $("diet-form");
const otherCheck = $("other-check");
const otherWrap = $("other-wrap");
const otherText = $("other-text");
const bringList = $("bring-list");
const infoDialog = $("info-dialog");

// ---------- Render: event list ----------
const RSVP_LABELS = { going: "You're going", maybe: "You said maybe", cant: "You can't go" };

function renderEventList() {
  $("event-list").innerHTML = allEvents().map((ev) => {
    const rsvp = answerFor(ev.id).rsvp;
    return `
      <li>
        <button type="button" class="event-card" data-open="${ev.id}">
          <span class="event-card-title">${escapeHtml(ev.title)}</span>
          <span class="muted">${formatDate(ev.date)} · ${ev.start}–${ev.end}</span>
          <span class="muted">${escapeHtml(ev.location)}</span>
          <span class="event-card-count">
            ${goingCount(ev)} of ${ev.capacity} going${rsvp ? ` · ${RSVP_LABELS[rsvp]}` : ""}
          </span>
        </button>
      </li>`;
  }).join("");
}

// ---------- Render: event page ----------
function renderHeader(ev) {
  $("event-title").textContent = ev.title;
  $("event-date").textContent = formatDate(ev.date);
  $("event-time").innerHTML =
    `${ev.start}–${ev.end} <span class="muted">(${formatDuration(ev.start, ev.end)})</span>`;
  $("event-location").textContent = ev.location;
  $("event-vibe").textContent = ev.vibe;
  $("event-vibe-row").hidden = !ev.vibe;
}

function renderHeadcount(ev) {
  const going = goingCount(ev);
  $("going-count").textContent = going;
  $("capacity").textContent = ev.capacity;
  $("progress-fill").style.width = Math.min(100, (going / ev.capacity) * 100) + "%";
  const progress = $("progress");
  progress.setAttribute("aria-valuemax", ev.capacity);
  progress.setAttribute("aria-valuenow", going);
  progress.setAttribute("aria-valuetext", `${going} of ${ev.capacity} spots taken`);
}

function renderRsvp(ev) {
  const rsvp = answerFor(ev.id).rsvp;
  document.querySelectorAll("[data-rsvp]").forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.dataset.rsvp === rsvp);
  });
  $("edit-diet-btn").hidden = rsvp !== "going";
}

function renderDietSummary(ev) {
  const answer = answerFor(ev.id);
  const counts = { ...ev.baseDiet };
  // Only count the user's needs if they are actually coming.
  if (answer.rsvp === "going") {
    answer.diet.forEach((key) => { counts[key] += 1; });
  }
  const parts = Object.keys(counts)
    .filter((key) => counts[key] > 0)
    .map((key) => `${counts[key]} ${DIET_LABELS[key]}`);
  $("diet-summary").textContent = "Dietary needs so far: " + (parts.join(", ") || "none");
}

function renderBringList(ev) {
  $("bring-empty").hidden = ev.items.length > 0;
  bringList.innerHTML = ev.items.map((item) => {
    const mine = isMine(ev, item);
    const claimed = claimedCount(ev, item);
    const full = claimed >= ev.portions;
    const whoOpen = openWhoLists.has(item.id);
    const names = mine ? [...item.bringers, "You"] : item.bringers;

    // The user can always undo their own claim, even if their portion filled the item.
    let buttonText = "I'll bring this";
    if (mine) buttonText = "You're bringing this";
    else if (full) buttonText = "This item is full";

    return `
      <li class="item-card ${full ? "is-full" : ""} ${mine ? "is-mine" : ""}">
        <h3 class="item-title"><span class="emoji" aria-hidden="true">${item.emoji}</span>${escapeHtml(item.name)}</h3>
        <button type="button" class="claim-btn" data-claim="${item.id}"
                aria-pressed="${mine}" ${full && !mine ? "disabled" : ""}>
          ${buttonText}
        </button>
        <p class="portions">${claimed} of ${ev.portions} portions claimed</p>
        ${full && mine ? `<p class="full-note">This item is full</p>` : ""}
        <button type="button" class="link-btn" data-who="${item.id}"
                aria-expanded="${whoOpen}" aria-controls="who-${item.id}">
          See who's bringing it
        </button>
        <ul id="who-${item.id}" class="who-list" ${whoOpen ? "" : "hidden"}>
          ${names.length ? names.map((n) => `<li>${n}</li>`).join("") : "<li>Nobody yet</li>"}
        </ul>
      </li>`;
  }).join("");
}

function renderEvent() {
  const ev = currentEvent();
  renderHeader(ev);
  renderHeadcount(ev);
  renderRsvp(ev);
  renderDietSummary(ev);
  renderBringList(ev);
}

// ---------- Screens ----------
const SCREENS = ["list", "create", "event", "diet"];

function showScreen(name, focusId) {
  SCREENS.forEach((s) => { $(`${s}-screen`).hidden = s !== name; });
  window.scrollTo(0, 0);
  if (focusId) $(focusId).focus();
}

function showListScreen() {
  renderEventList();
  showScreen("list", "list-title");
}

function openEvent(id) {
  currentId = id;
  openWhoLists.clear();
  renderEvent();
  showScreen("event", "event-title");
}

function showCreateScreen() {
  createForm.reset();
  $("new-date").min = new Date().toISOString().slice(0, 10); // no events in the past
  showScreen("create", "create-title");
}

function showDietScreen() {
  // Pre-fill the form with what the user saved before.
  const answer = answerFor(currentId);
  dietForm.querySelectorAll('input[name="diet"]').forEach((box) => {
    box.checked = answer.diet.includes(box.value);
  });
  otherText.value = answer.otherText;
  otherWrap.hidden = !otherCheck.checked;
  showScreen("diet", "diet-title");
}

let toastTimer;
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

// ---------- Events: list + create ----------
$("event-list").addEventListener("click", (event) => {
  const card = event.target.closest("[data-open]");
  if (card) openEvent(card.dataset.open);
});

$("create-btn").addEventListener("click", showCreateScreen);
$("create-back-btn").addEventListener("click", showListScreen);
$("event-back-btn").addEventListener("click", showListScreen);

$("new-end").addEventListener("input", (event) => event.target.setCustomValidity(""));

createForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const start = $("new-start").value;
  const endInput = $("new-end");
  if (toMinutes(endInput.value) <= toMinutes(start)) {
    endInput.setCustomValidity("End time must be after the start time.");
    endInput.reportValidity();
    return;
  }

  const itemNames = $("new-items").value.split(",").map((s) => s.trim()).filter(Boolean);
  const newEvent = {
    id: "event-" + Date.now(),
    title: $("new-title").value.trim(),
    date: $("new-date").value,
    start,
    end: endInput.value,
    location: $("new-location").value.trim(),
    vibe: $("new-vibe").value.trim(),
    capacity: Number($("new-capacity").value),
    portions: Number($("new-portions").value),
    baseGoing: 0,
    baseMaybe: 0,
    baseDiet: { vegetarian: 0, vegan: 0, "gluten-free": 0, "nut-allergy": 0, other: 0 },
    items: itemNames.map((name, i) => ({ id: "item-" + i, name, emoji: DEFAULT_EMOJI, bringers: [] })),
  };

  state.createdEvents.push(newEvent);
  saveState();
  openEvent(newEvent.id);
  showToast("Event created!");
});

// ---------- Events: event page ----------
document.querySelectorAll("[data-rsvp]").forEach((btn) => {
  btn.addEventListener("click", () => {
    updateAnswer({ rsvp: btn.dataset.rsvp });
    renderEvent();
    if (btn.dataset.rsvp === "going") showDietScreen();
  });
});

$("info-btn").addEventListener("click", () => {
  const ev = currentEvent();
  $("info-text").textContent = `${goingCount(ev)} going, ${maybeCount(ev)} maybe`;
  infoDialog.showModal();
});

$("edit-diet-btn").addEventListener("click", showDietScreen);

bringList.addEventListener("click", (event) => {
  const claimBtn = event.target.closest("[data-claim]");
  const whoBtn = event.target.closest("[data-who]");
  const ev = currentEvent();

  if (claimBtn) {
    const id = claimBtn.dataset.claim;
    const claims = answerFor(ev.id).claims;
    updateAnswer({ claims: claims.includes(id) ? claims.filter((c) => c !== id) : [...claims, id] });
    renderBringList(ev);
    bringList.querySelector(`[data-claim="${id}"]`).focus(); // keep keyboard focus
  }

  if (whoBtn) {
    const id = whoBtn.dataset.who;
    if (openWhoLists.has(id)) openWhoLists.delete(id);
    else openWhoLists.add(id);
    renderBringList(ev);
    bringList.querySelector(`[data-who="${id}"]`).focus();
  }
});

// ---------- Events: diet screen ----------
otherCheck.addEventListener("change", () => {
  otherWrap.hidden = !otherCheck.checked;
  if (otherCheck.checked) otherText.focus();
});

$("back-btn").addEventListener("click", () => showScreen("event", "event-title"));

dietForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateAnswer({
    diet: [...dietForm.querySelectorAll('input[name="diet"]:checked')].map((box) => box.value),
    otherText: otherCheck.checked ? otherText.value.trim() : "",
  });
  renderEvent();
  showScreen("event", "event-title");
  showToast("Thanks! Your dietary info is saved.");
});

$("reset-btn").addEventListener("click", () => {
  state = defaultState();
  saveState();
  renderEventList();
  showToast("Demo data reset.");
});

renderEventList();
