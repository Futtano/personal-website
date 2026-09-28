# 2026-09-28 — Starting point

Status: reference baseline, not a claim of learner completion

## What exists

The project is a JavaScript/Vite static application. Three.js generates a small coastal world and furnished house. A first-person controller supports walking, dragging to look, simple collision, room shortcuts, and computer interaction. The blog is trusted Markdown rendered into a native HTML dialog styled as a nostalgic desktop.

The world has an arrival fade, optional generated ambience, reduced-motion handling, and a graphics-failure route to reading. There is no backend, CMS, authentication, imported model pipeline, or persistent saved player state.

## What was verified while building the prototype

The production build succeeded. One-off Chromium checks exercised entry, walking from the shore into the house, the living-room computer, an article, the bedroom shortcut, narrow-screen reading, direct article links, and graphics fallback. Visual inspection covered the arrival, living room, and desktop. The automated environment used software graphics where necessary.

Those checks do not establish exhaustive collision coverage, complete accessibility, or real-device frame rates. The course now adds [repeatable example tests](../examples/README.md); the application’s deployment workflow has not been changed to execute them.

## Deployment status

No public release is claimed. The GitHub Pages setup attempt was rejected for the private repository under the account’s current plan. A hosting choice remains open; repository visibility has not been changed for this documentation task.

## Questions to start with

- Which JavaScript runs in Node, and which runs in the browser?
- How does a click on a 3D object lead to an HTML article?
- What does `npm run build` actually produce?
- Why can an object look correct while blocking the wrong part of the room?

## Suggested first experiment

Complete lesson 1’s Network-panel observation, then write a separate entry explaining why a fragment change does not request a new HTML page.
