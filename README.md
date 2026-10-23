# Dinner Potluck – Neighbor Event App (Prototype)

A mobile-first web app prototype that helps neighbors in an apartment building plan and join events together. It comes with a mock **Dinner Potluck**, and residents can create their own events.

## The problem

In apartment buildings, event planning is mostly guessing. Announcements go on paper notices, and everything else is spread over many WhatsApp groups. Organizers keep asking "are you coming?", but still don't know the headcount, so they can't plan space, food or special diets. Polls show who brings what, but not who will really come, so people bring the same dish. Guests don't know how long the event is, how crowded it will be, or what the vibe is.

In two user interviews, the biggest pain point was the same: **"nobody knows how many people are coming."**

## What the app does

- **Event list**: all events in the building, with date, location, headcount and your own answer.
- **Create event**: title, date, start and end time, location, vibe, capacity, bring-list items (comma separated) and portions per item. New events start with 0 people going and an empty bring-list.
- **Event header**: date, time (with duration), location and vibe ("Music, drinks, about 30 people expected"), so guests know what to expect before they decide.
- **Live headcount**: "20 going" with a progress bar against the capacity of 30. The info button opens a popup with going and maybe counts.
- **RSVP**: Going / Maybe / Can't go. Changing the answer updates the count correctly (no double counting).
- **Allergy & Diet screen**: after choosing Going, guests tick their dietary needs (Vegetarian, Vegan, Gluten-free, Nut allergy, Other). A summary on the event page shows the totals.
- **Bring-list**: six items with "X of 10 portions claimed". When an item is full, the card turns grey and the button is disabled, so people pick something else and the food stays varied. "See who's bringing it" shows the names.
- **Saved state**: created events and, per event, your RSVP, claimed items and diet choices are stored in `localStorage`, so they survive a page refresh. "Reset demo data" on the event list clears them.

All other data (the 20 neighbors of the potluck, names on the bring-list, diet totals) is mock data. Created events are only visible in your own browser. There is no backend and no login.

## Tech

Plain HTML, CSS and JavaScript. No build step, no dependencies.

```
index.html   – structure of all screens (list, create, event, diet), popup and toast
styles.css   – mobile-first styles (designed for 390px width)
app.js       – mock data, state, rendering and event handling
```

## How to run

**Option 1:** Double-click `index.html` to open it in a browser.

**Option 2 (local server):** in this folder run

```
npx serve .
```

and open the URL it prints (e.g. http://localhost:3000).

To test the phone layout, open the browser dev tools and choose a device size of 390px wide (e.g. iPhone 14).

## How to deploy

It is a static site, so no build settings are needed.

- **Netlify**: drag and drop this folder onto https://app.netlify.com/drop, or connect the Git repo with an empty build command and publish directory `.`.
- **Vercel**: import the Git repo (framework preset "Other", no build command, output directory `.`), or run `npx vercel` in this folder.
# potluckEventwebsite
