# Runnable browser examples

These are learning examples for [lesson 10](../lessons/10-debugging-and-testing.md). They do not modify the application or publish anything. They exercise the actual page, not a mock implementation.

## Run

From the repository root, after `npm ci`:

```sh
npx playwright install chromium
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Keep the server running and use a second terminal:

```sh
npx playwright test --config docs/examples/playwright.config.js
```

Read [the configuration](playwright.config.js) and [the tests](site.spec.js) before changing them. There are four tests. The world test requires a functioning WebGL implementation. A failure there on a headless machine may need graphics-environment diagnosis; do not simply skip it and claim the world works.

The server is intentionally separate so the distinction between serving an app and testing it remains visible. If a server already occupies the port, use it only if it serves this project; otherwise choose another port and set `SITE_URL`.

## Test a build instead

Start preview after building:

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Then in the second terminal (POSIX-shell syntax):

```sh
SITE_URL=http://127.0.0.1:4173/ npx playwright test --config docs/examples/playwright.config.js
```

For a subpath, include it and a trailing slash in `SITE_URL`. Tests use relative navigation so they can retain that base path.

## Optional graphics-environment overrides

Normally use Playwright’s matching downloaded Chromium. If diagnosing a machine with no hardware graphics, the config accepts:

```sh
SOFTWARE_WEBGL=1 npx playwright test --config docs/examples/playwright.config.js
```

This asks Chromium to use software rendering for the test. These flags belong to local automation, not the website or instructions for regular visitors. Software rendering does not prove real-device performance.

`PLAYWRIGHT_CHROMIUM_EXECUTABLE` can point to an existing browser executable when a managed environment requires it. This is an escape hatch, not the preferred reproducible setup: browser and Playwright versions can differ.

## Read a failure

The configuration stores screenshots and traces for failures in the ignored `test-results/learning-examples/` directory. The CLI prints the affected test and paths. To inspect a trace, pass its actual path to:

```sh
npx playwright show-trace path/to/trace.zip
```

The tests use reduced motion for repeatability and wait for state changes instead of arbitrary delays. They do not validate the full walking route, every collision, live audio, appearance, screen-reader behavior, or every supported browser. Keep the manual checks in lesson 10.
