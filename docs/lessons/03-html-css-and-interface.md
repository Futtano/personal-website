# 3. HTML, CSS, and the interface

[Previous](02-tools-and-local-development.md) · [Learning path](../README.md) · [Next](04-state-and-navigation.md)

**Goal:** separate the 3D image from the browser interface layered over it.

**Read alongside:** [index.html](../../index.html) and [style.css](../../src/style.css).

## Two rendering systems share the viewport

Three.js draws pixels into a canvas inside `#world`. It does not create an HTML element for each chair or tree. CSS cannot select a Three.js chair with `.chair`.

The arrival text, controls, navigation, and blog are ordinary HTML. They remain crisp, selectable, and usable with browser interaction mechanisms. The camera can turn without rotating the HTML interface.

| Element | Purpose |
| --- | --- |
| `#world` | Fixed container for the WebGL canvas; gradient background is a basic fallback |
| `.grain`, `body::before` | Decorative grain and color overlays |
| `.topbar` | Identity and direct-reading link |
| `#arrival` | Title, introduction, and entry buttons |
| `#dream` | Pale fade covering a camera position change |
| `#hud` | Room label, crosshair, interaction prompt, movement hints |
| `#guide` | Native dialog with controls and room shortcuts |
| `#desktop` | Native dialog containing the simulated computer desktop |

## Positioning, layers, and input

`position: fixed` attaches an element to the viewport. `inset: 0` stretches the world over all four sides. Overlay `z-index` values place text above the canvas.

The grain and fade use `pointer-events: none`, so their pixels do not block clicks on controls or the canvas. An invisible full-screen overlay with pointer events enabled is a common cause of “the page looks fine but nothing clicks.”

The `hidden` attribute is the programmatic switch for arrival and HUD visibility. Our CSS includes `[hidden] { display: none !important; }` to prevent layout rules from accidentally making hidden controls visible.

A subtle testing consequence: `#hud` itself has no normal-flow size because its children are fixed-positioned. Test a visible child such as `#location`, not the container’s bounding rectangle.

## Layout choices

Flexbox arranges toolbars and action rows. Grid arranges room destinations and mobile direction buttons. The full page does not scroll; the blog’s `.browser-page` does. This keeps the retro window frame and close control on screen while the article scrolls.

`box-sizing: border-box` makes a declared width include padding and borders. Without it, the many desktop window borders would complicate sizing.

The mobile desktop uses `100dvh`, the dynamic viewport height. This accounts for changing mobile browser chrome more usefully than assuming a fixed physical screen size.

At widths up to 700px, the stylesheet hides decorative desktop icons, expands the reading dialog, and shows touch movement controls. This is currently a **width-based** choice, not a complete input-capability detector: a wide touch tablet deserves testing too.

## Native dialogs

`<dialog>` plus `showModal()` provides a browser-managed modal layer. Its backdrop is styled with `::backdrop`; content outside the modal becomes inert. This top layer is distinct from ordinary `z-index` stacking. See [MDN’s `showModal()` reference](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal).

Native dialog behavior is a foundation, not proof that our whole experience is accessible. We still label controls, handle closing, pause movement, and test focus. The `cancel` listener handles Escape through our application cleanup rather than allowing dialog visibility and movement state to disagree.

## The nostalgic interface is CSS

The desktop uses teal wallpaper, outset and inset borders, compact Arial labels, a blue title bar, and a cream Georgia reading page. Those are HTML/CSS choices, not textures projected onto the CRT.

Some details are decorative: the File/Edit/View menu labels do not implement an operating system menu, and `19:99` is deliberately impossible display text rather than a real clock. Real interactions are buttons and links: navigation, article selection, closing the window, and returning to the house.

Fonts are loaded with a Google Fonts CSS import. Local font stacks remain available if that request fails. No image-generation or downloaded model pipeline is required for this version.

## Try it

In DevTools, inspect `#desktop`, then open the blog and temporarily change `.browser-page`’s background color. Compare a normal viewport with a 390px-wide viewport. Find the rule that hides `.desktop-icons`.

Then tab through the interface without using the mouse. Can you reach direct reading, open an article, and close the computer?

**Expected:** the article scrolls within the browser window; the viewport should not scroll sideways.

## Checkpoint

Why is the blog HTML rather than text drawn into the world’s canvas? Why does `pointer-events: none` matter for the grain? Which part of the layout should scroll on mobile?
