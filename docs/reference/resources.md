# Official resources

[Learning path](../README.md)

Use these after the corresponding lesson, with the project open beside them. Our lockfile is the authority for installed versions; a documentation site can describe a newer release.

## Tools and builds

- [Vite introduction](https://vite.dev/guide/): what the dev server and build tool do. Current major versions may differ from this project.
- [Vite 7.3.6 build guide source](https://github.com/vitejs/vite/blob/v7.3.6/docs/guide/build.md): version-matched build documentation for our Rollup-era configuration.
- [Vite static deployment](https://vite.dev/guide/static-deploy.html): deployment patterns; verify version-specific details before adopting examples.
- [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/): repeatable dependency installation.
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages): build artifacts, permissions, and deployment jobs.

## Browser APIs and content

- [MDN: showModal](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal): native modal behavior and the top layer.
- [MDN: pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events): input across mouse, pen, and touch.
- [MDN: Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API): connected audio nodes and browser audio architecture.
- [Marked documentation](https://marked.js.org/): Markdown rendering and the need to handle HTML trust explicitly.

## Graphics

- [Three.js r180 fundamentals source](https://github.com/mrdoob/three.js/blob/r180/manual/en/fundamentals.html): foundational scene/camera/renderer explanation tied to our installed release.
- [Three.js API reference](https://threejs.org/docs/): look up the exact classes used in `scene.js`; compare with r180 if a current API differs.
- [Three.js r180 source](https://github.com/mrdoob/three.js/tree/r180/src): use this to resolve version-specific questions rather than assuming a modern tutorial matches the project.

## Testing

- [Playwright assertions](https://playwright.dev/docs/test-assertions): waiting for observable outcomes.
- [Playwright documentation](https://playwright.dev/docs/intro): test runner, browser installation, locators, traces, and configuration.

For a new feature, add the specific primary documentation you actually used to its learning entry. Record the relevant installed version and avoid accumulating unrelated tutorial links.
