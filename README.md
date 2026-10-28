# Neighbor Events – Plan and join events in your building (Prototype)

A mobile-first web app prototype that helps neighbors in an apartment building plan and join events together. It comes with a mock **Dinner Potluck**, and every resident can create their own events.

## The problem

In apartment buildings, event planning is mostly guessing. Announcements go on paper notices, and everything else is spread over many WhatsApp groups. Organizers keep asking "are you coming?", but still don't know the headcount, so they can't plan space, food or special diets. Polls show who brings what, but not who will really come, so people bring the same dish. Guests don't know how long the event is, how crowded it will be, or what the vibe is.

In two user interviews, the biggest pain point was the same: **"nobody knows how many people are coming."**

## What the app does

**Accounts**
- Sign up with name, email and password, then log in and out.
- Whoever creates an event is its **organizer (admin)**.
- Demo organizer account for the Dinner Potluck: **maria@demo.com / demo123**.

**Home**
- A greeting, overview numbers (upcoming events, events you go to, events you organize) and event cards with a date badge, time, place, food icons, guest avatars, headcount and a countdown ("In 81 days").

**Event page (everyone)**
- Clear details with icons: date with weekday, time with duration, location with an **Open in Google Maps** link, and the vibe.
- Headcount: going / maybe / spots left, a progress bar and an info popup.
- RSVP: Going / Maybe / Can't go. Counts come from the guest list, so they never double count. "Going" is blocked when the event is full.
- Dietary and allergy screen after choosing Going, plus a summary of all guests' needs.
- Bring-list with a food icon per dish and clear text such as "2 more portions needed" and "8 neighbors are bringing it". Full dishes turn grey and are disabled.
- When claiming a dish you can say **what exactly** you bring ("Caesar salad"). "See who's bringing it" shows the names and notes.
- **Add something else to bring**: choose a food type from a dropdown or type your own.
- **Add to calendar**: downloads an `.ics` file with reminders 1 day and 30 minutes before.
- **Reminders**: a banner and a browser notification 1 day and 30 minutes before the event (can be turned off per event).

**Organizer only**
- **Guest list** with the names of who is going, maybe or can't go, and their dietary needs.
- **Edit event** (time, location, Google Maps link, dishes, etc.). Existing claims are kept.
- **Copy invite link** (and **Share** on phones) to send in the WhatsApp group.

**Create event**
- Title, vibe, date, start/end time, address, optional Google Maps link, capacity, portions per dish, and the bring-list: pick dishes from a dropdown and/or type extra items separated by commas. Food icons are chosen automatically.

## Limits of this prototype (no backend)

- All data (accounts, events, answers) lives in the browser's `localStorage`. Different phones don't share data.
- The **invite link contains the event details**, so a neighbor opening it on their phone gets the event and can RSVP there. Their answer is only saved on their own phone, though; the organizer won't see it without a real server.
- Passwords are only hashed in the browser. This is **not secure**. A real app needs a server for login.
- Browser notifications only fire while the app is open. The calendar file (`.ics`) gives reliable reminders. On iPhone, web notifications only work for apps added to the home screen.
- "Reset demo data" at the bottom of the home screen restores the mock data and deletes created events and accounts.

## Tech

Plain HTML, CSS and JavaScript. No build step, no dependencies.

```
index.html   – all screens (login, home, create/edit, event, diet), dialogs and toast
styles.css   – mobile-first styles (designed for 390px width)
app.js       – mock data, accounts, routing, rendering, reminders, localStorage
sw.js        – tiny service worker so phones can show notifications
```

Screens use hash routes, so the browser back button works: `#/home`, `#/create`, `#/event/<id>`, `#/event/<id>/edit`, `#/event/<id>/diet`.

## How to run

**Option 1:** Double-click `index.html` to open it in a browser. (Copying the link and notifications may be limited when opened as a file.)

**Option 2 (recommended, local server):** in this folder run

```
npx serve .
```

and open the URL it prints (e.g. http://localhost:3000).

To test the phone layout, open the browser dev tools and choose a device size of 390px wide (e.g. iPhone 14).

To test the 30-minute reminder, create an event that starts in about 20 minutes.

## How to deploy

It is a static site, so no build settings are needed.

- **Netlify**: drag and drop this folder onto https://app.netlify.com/drop, or connect the Git repo with an empty build command and publish directory `.`.
- **Vercel**: import the Git repo (framework preset "Other", no build command, output directory `.`), or run `npx vercel` in this folder.
