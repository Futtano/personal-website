# 10. Debugging and testing

[Previous](09-atmosphere-and-performance.md) · [Learning path](../README.md) · [Next](11-build-and-deployment.md)

**Goal:** replace “it seems broken” with an observed failure at a specific boundary.

**Read alongside:** [troubleshooting](../reference/troubleshooting.md) and [the runnable examples](../examples/README.md).

## Four different kinds of evidence

1. **Syntax/build checks:** can the toolchain parse and assemble the application?
2. **Behavior checks:** does an action produce the intended state?
3. **Visual inspection:** does the house, screen, or layout actually look correct?
4. **Performance/accessibility checks:** can different people and devices use it comfortably?

One cannot substitute for all the others. A successful build does not prove that a doorway is passable. A `<canvas>` element existing does not prove that its graphics context rendered the house. A screenshot does not prove that a keyboard interaction works.

## Use the browser tools deliberately

| DevTools area | Useful question |
| --- | --- |
| Console | Did an exception interrupt initialization? |
| Network | Did JavaScript, CSS, or a font fail to load? What was its status and MIME type? |
| Elements | Is a dialog open? Is `hidden` set? Which CSS rule wins? |
| Sources | What values do the flags and camera coordinates have at this breakpoint? |
| Performance | Is time spent in JavaScript, layout, or rendering? |
| Device emulation | Does the layout fit a narrow viewport? |

Reproduce the smallest failing sequence. “Start fresh, enter, open the computer, close it, hold W” is more actionable than “movement sometimes stops.” Distinguish a fresh document load from a hash change within the current document.

Useful breakpoints include `route()`, `openDesktop()`, `setActive()`, and `collision()`. Pausing on every animation frame is usually overwhelming; use a conditional breakpoint or inspect one state transition.

## Real bugs and test mistakes from this prototype

- A divider behind the entrance blocked the path even though the doorway looked open. A real walk revealed the geometry/collision problem.
- The first living-room shortcut was outside the computer’s interaction radius. Rendering the workstation correctly did not prove that E would work.
- A headless browser displayed a blank graphics surface. Software-rendering configuration helped distinguish its GPU environment from application logic.
- A test waited for `#hud` to have visible dimensions, although all its children were fixed-positioned. Testing `#location` matched the actual UI.
- A test changed only a URL fragment and assumed it had reset the whole page. It had not. Existing exploration state remained.
- A screenshot or immediate text read happened before a `hashchange` handler ran. The test needed to wait for the resulting heading.

These examples show why a failing test needs diagnosis, not an automatic production-code patch.

## Repeatable browser tests

The project already depended on `@playwright/test`. Before this course, verification used one-off scripts. The [examples directory](../examples/README.md) now contains a small repeatable educational suite and its own configuration. There is still no root `npm test` script, and the deployment workflow does not run this suite yet.

From the repository root, install the matching browser once:

```sh
npx playwright install chromium
```

Start the application in another terminal, then run:

```sh
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

```sh
npx playwright test --config docs/examples/playwright.config.js
```

The configuration expects a server to be running; it does not start one or install packages automatically. See the examples README for a preview-server URL or optional browser overrides.

The tests cover direct article links, entering the living room and using E, a narrow reading layout, and reading when WebGL creation fails. They are deliberately not a claim that every room, collision, mobile gesture, or browser is covered.

## Assertions should wait for outcomes

Existing example pattern:

```js
await page.locator('.entry').first().click();
await expect(page.locator('#page-content h1'))
  .toHaveText('A small place on the internet');
```

Playwright’s locator assertions retry until the expected state or timeout. This is more reliable than sleeping 100ms and assuming navigation is done. See [Playwright’s assertion documentation](https://playwright.dev/docs/test-assertions).

Use sleeps only when elapsed duration itself is the subject, such as holding movement input for an interval. For room arrival, prefer waiting for the room label. Give a fresh page to each test so one test’s hash and exploration state do not leak into another.

## Manual checks that remain valuable

- Walk through every actual doorway; shortcuts do not validate the route.
- Slide along walls and release keys after switching applications.
- Click the physical CRT and verify that dragging does not open it accidentally.
- Try a phone, a wide touch tablet, keyboard-only reading, and browser zoom.
- Inspect the scene visually with hardware rendering when possible.
- Try muted/unmuted audio and reduced motion.
- Read long content, follow external links, and exercise browser Back/Forward.

## Try it

Run the examples unchanged. Then, on your learning branch, intentionally rename one article title and predict which assertion fails. Update the assertion only if the new title is the intended behavior; restore both changes afterward if this was only an experiment.

## Checkpoint

Why can a test report “canvas exists” while the screen is blank? Why is a fixed sleep weaker than waiting for an article heading? What can the example suite tell you, and what can it not?
