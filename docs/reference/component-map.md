# Component and source map

[Learning path](../README.md)

Search for the symbols below in your editor. Symbol names are more stable than line numbers as we improve the prototype. “Component” means a responsibility here, not a framework-specific object.

## Entry points and tooling

| File | Responsibility | Lesson |
| --- | --- | --- |
| [index.html](../../index.html) | Browser document, metadata, controls, dialogs, module entry | [1](../lessons/01-browser-and-project.md), [3](../lessons/03-html-css-and-interface.md) |
| [package.json](../../package.json) | Scripts and direct dependency declarations | [2](../lessons/02-tools-and-local-development.md) |
| [package-lock.json](../../package-lock.json) | Exact resolved package graph | [2](../lessons/02-tools-and-local-development.md) |
| [vite.config.js](../../vite.config.js) | Relative base and separate Three.js chunk | [11](../lessons/11-build-and-deployment.md) |
| [.gitignore](../../.gitignore) | Ignore dependencies, builds, test artifacts, local environment files | [2](../lessons/02-tools-and-local-development.md) |
| [deploy.yml](../../.github/workflows/deploy.yml) | Pages build and publication jobs | [11](../lessons/11-build-and-deployment.md) |

## Application coordinator: `src/main.js`

[Open source](../../src/main.js)

| Symbol or code block | Inputs and output | Role |
| --- | --- | --- |
| `$` | CSS selector → element or null | DOM lookup shorthand |
| `entries` | Imported Markdown + metadata | Manual article catalog |
| `setTab(tab, article)` | Selected content → DOM and title | Renders blog views, updates active navigation, resets scroll |
| `openDesktop()` | Tab/article → modal reader | Disables world input and opens the desktop |
| `route()` | Current fragment → selected view | Handles direct links and hash changes |
| `closeDesktop()` | User close → cleared fragment and input state | Removes the current fragment without adding a history entry |
| `enter(place)` | Destination → fade, HUD, camera visit | Guards transitions and starts exploration |
| `closeGuide()` | Guide dismissal → prior input mode | Closes help and restores eligible movement |
| Sound click handler | Gesture → audio context state | Creates or toggles generated ambience |
| Dynamic scene import | Loaded module → `world` controller | Wires world callbacks to UI and enables Enter |
| `unavailable()` | Graphics failure → readable fallback | Keeps the direct computer route usable |

State lives in `world`, `exploring`, `transitioning`, `sound`, the URL fragment, and native dialog state. It is not centralized in a store.

## The world: `src/scene.js`

[Open source](../../src/scene.js)

| Symbol or section | Responsibility |
| --- | --- |
| `initWorld(callbacks)` | Creates and owns the scene for one page lifetime |
| `renderer`, `scene`, `camera` | GPU output, object hierarchy, and viewpoint |
| `mat()` / `mats` | Cache standard materials by color and options |
| `box()` / `colliders` | Construct box meshes and optional static X/Z collision footprints |
| `cylinder()` | Construct cups, lamps, posts, and circular surfaces |
| `sphere()` | Construct scaled icosahedrons for angular organic details |
| `textPlane()` | Draw text on a 2D canvas and use it as a plane texture |
| Hemisphere, sun, and point lights | Ambient color, direct sunlight, interior warmth, CRT glow |
| Sand/sea/waves | Layered coastal surfaces and animated strips |
| `random()` and scatter loops | Repeatable plants, rocks, and hill placement |
| `wall()` | Solid plaster boxes around openings |
| Roof/gable `BufferGeometry` | Explicit triangles and normals for pitched surfaces |
| Furniture sections | Living room, workstation, kitchen, bedroom, studio |
| `lookAt()` | Synchronize camera orientation with yaw/pitch controller variables |
| `visit(place)` | Move the camera to a known position and look target |
| `setActive()` | Enable/disable movement, clear input, manage canvas focus |
| `collision(x,z)` | Check world bounds and expanded static footprints |
| Keyboard/pointer listeners | Update input state and camera orientation |
| `Raycaster` in pointer-up | Pick the CRT for a short click near it |
| Animation loop | Time step, waves, movement, room/proximity updates, rendering |
| Resize listener | Update camera projection and renderer size |
| Context-loss listener | Stop rendering and report failure |

`visit` and `setActive` are returned publicly. `dispose`, a physics engine, and a general interaction registry do not exist yet.

## Styling: `src/style.css`

[Open source](../../src/style.css)

| Selector family | Responsibility |
| --- | --- |
| `#world`, `#world canvas` | Viewport coverage and direct pointer interaction |
| `.grain`, `body::before` | Decorative atmosphere, without input interception |
| `.topbar`, `.wordmark`, `.world-footer` | Persistent navigation and identity |
| `#arrival`, `.arrival-*` | Introduction and entry actions |
| `#dream`, `#dream.active` | Arrival/teleport fade |
| `.location`, `#crosshair`, `#interact`, `.walk-help` | Exploration feedback |
| `.touch-controls` | Narrow-screen movement buttons |
| `#guide`, `.destinations` | Help and room shortcuts |
| `#desktop`, `.desktop-wallpaper`, `.desktop-icons` | Simulated operating-system shell |
| `.retro-window`, `.titlebar`, `.addressbar`, `.taskbar` | Simulated browser and desktop chrome |
| `.browser-page`, `.retro-nav`, `#page-content`, `.entry` | Readable website inside the shell |
| Width/height media queries | Responsive layouts |
| Reduced-motion query | Disable CSS transitions and fade blur |

## Content and educational code

- [content/beginning.md](../../content/beginning.md): sample personal-web note.
- [content/making.md](../../content/making.md): sample note about the house.
- [content/reading.md](../../content/reading.md): sample reading prompts.
- [examples/site.spec.js](../examples/site.spec.js): browser behavior examples.
- [examples/playwright.config.js](../examples/playwright.config.js): learning test environment.

The blog content and learning journal have different purposes. Adding a learning entry under `docs/journal/` does not automatically publish it as a blog post.
