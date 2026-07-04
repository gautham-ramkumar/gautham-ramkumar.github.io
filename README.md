# Portfolio — Video Game Main Menu Prototype

A robotics portfolio styled as a sci-fi game's main menu: NEW GAME, RESUME,
OPTIONS, and EXIT — each backed by a solid, lit 3D object instead of a
scrolling page.

| Menu Item | 3D Object | Section |
|---|---|---|
| NEW GAME | Rotating identity core (gem + orbiting rings) | About + Experience |
| RESUME | Articulated robotic arm | Projects (click a "save slot") |
| OPTIONS | Fully clickable 3D game controller | Skills (click D-pad/sticks/buttons) |
| EXIT | Signal beacon with pulsing rings | Contact |

Navigate with mouse clicks, or like an actual game: **↑ / ↓** to move
through the menu, **Enter** to select, **Esc** to back out of a section.

## Structure

```
index.html         Page structure only
css/style.css       All styling (menu list, HUD framing, panels, detail drawer)
js/main.js          Entry point — wires scene + ui together
js/scene.js         All Three.js: lighting, the 4 hero objects, the
                    interactive controller, camera flight, raycasting
js/ui.js            All DOM logic: menu list, keyboard nav, panels,
                    detail drawer, status console
js/data.js          Your content — projects, experience, skills, menu labels
```

`scene.js` never touches the DOM; `ui.js` never touches THREE directly —
they only talk through the API returned by `createScene()`. Redesign the
3D world or the UI independently without breaking the other.

## Running locally

`index.html` loads ES modules, which browsers block over `file://`. Run a
local server from **inside this folder**:

```bash
cd site-v2          # make sure you're inside the folder, not your home dir
python3 -m http.server 8000
# then open http://localhost:8000
```

or, with Node: `npx serve .`

## Deploying to GitHub Pages

Push this folder's contents to the root of your `gautham-ramkumar.github.io`
repo. No build step needed.

## What's a prototype vs. production-ready

- **Content**: `data.js` has a reduced project set to prove the mechanic —
  add your full list there. No resume-download link yet.
- **Performance**: a live WebGL scene renders continuously; test on your
  actual target devices. Lower `PARTICLE_COUNT` in `scene.js` if needed.
- **Accessibility**: `prefers-reduced-motion` handling isn't wired in yet,
  and the whole site currently depends on JS + WebGL to function (no
  fallback for browsers without either).
