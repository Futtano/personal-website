# 2. Tools and your local workflow

[Previous](01-browser-and-project.md) · [Learning path](../README.md) · [Next](03-html-css-and-interface.md)

**Goal:** understand every command needed to run the existing project.

**Read alongside:** [package.json](../../package.json), [package-lock.json](../../package-lock.json), and [vite.config.js](../../vite.config.js).

## Node, npm, and Vite have different jobs

**Node.js** executes JavaScript outside the browser. Install Node 24 using the official installer or your preferred version manager; this matches our CI configuration. Check `node --version` in the same terminal that will run the project.

**npm** comes with the usual Node installation. It installs packages and executes named scripts. It is not the web server.

**Vite** is our development server and production build tool. In development it understands our module graph, resolves package imports such as `'three'`, and transforms imports the browser cannot handle directly, such as Markdown with `?raw`.

Saving a file usually updates the page through hot module replacement or a full reload, depending on what changed. HMR is a development convenience, not a feature sent to production. See the [Vite guide](https://vite.dev/guide/) for the tool’s two main roles; our repository uses Vite 7, so check the major version before copying newer configuration.

## Read the package manifest

`package.json` contains:

- `name`: the package identity, `futtano`.
- `private: true`: prevents accidental publication to the npm registry. It does **not** make the website private or control GitHub repository visibility.
- `type: "module"`: `.js` files in this package use ECMAScript module syntax when interpreted by Node.
- `scripts`: command aliases for local development, building, and previewing.
- `dependencies`: libraries used by application code.
- `devDependencies`: tools used to develop, build, or test it.

| Package | Installed version at documentation time | Responsibility |
| --- | --- | --- |
| `three` | 0.180.0 | 3D scene, materials, cameras, rendering, raycasting |
| `marked` | 16.4.2 | Turn trusted Markdown strings into HTML |
| `vite` | 7.3.6 | Development server and production bundling |
| `@playwright/test` | 1.63.0 | Browser automation and test assertions |

These values are from the lockfile, not promises about future installations. Inspect your actual installation with:

```sh
npm ls --depth=0
```

A development dependency can be essential to a production **build**, even though it does not run in the visitor’s browser. Do not omit development dependencies on a machine that needs to run Vite.

## Dependency ranges and the lockfile

`^7.1.7` allows compatible 7.x versions, while `^0.180.0` is constrained to the 0.180.x line. Zero-major ranges are narrower than the corresponding `^1.x` pattern. A range expresses what may be installed; the lockfile records the specific resolution, including transitive packages.

- Use `npm ci` to reproduce the checked-in dependency graph. It requires a compatible lockfile, replaces an existing installation, and does not repair mismatched dependency declarations. [npm’s `ci` documentation](https://docs.npmjs.com/cli/v11/commands/npm-ci/) explains this reproducible-install workflow.
- Use `npm install` when intentionally adding or updating dependencies. Review and commit the resulting manifest and lockfile changes together.
- Do not fix a mismatch by deleting the lockfile without understanding why it changed.

`node_modules/` can be regenerated and is not committed. The lockfile should be committed.

## Your normal development session

```sh
npm ci
npm run dev
```

Keep the process running. Open the printed Local URL. The default port is usually 5173, but Vite can choose another if it is occupied. The printed URL is the source of truth.

Our `dev` script includes `--host 0.0.0.0`: listen on network interfaces, useful for testing from a phone on the same reachable network. It does not automatically create a public deployment. Firewalls and your network still govern reachability. To bind only to the local machine:

```sh
npm run dev -- --host 127.0.0.1
```

The extra `--` tells npm to pass the remaining arguments through to Vite.

Stop the process with Ctrl+C. Changing source files does not require reinstalling packages. Changing dependencies does.

## Git as a learning safety net

Before an experiment, inspect your working tree:

```sh
git status
git diff
```

Once you have a baseline commit, a branch such as `learning/first-room-detail` gives the experiment a name. A branch does not automatically save changes; commits do. On an empty repository, first create a baseline commit after reviewing the files.

For a documentation change, a focused commit might be:

```sh
git add docs README.md
git diff --cached
git commit -m "Document the futtano learning path"
```

Review what is staged before committing. A commit saves a local snapshot; a push sends commits to a remote. In this repository, pushing `main` can trigger the deployment workflow. Learning locally does not require pushing.

## Try it

Run the dev server, change one sentence in `index.html`, and save. Observe whether the browser reloads. Restore the sentence manually and check the diff.

**Expected:** source changes appear locally without `npm install` or a production build.

## Checkpoint

What does `private: true` protect? Why can installing only runtime dependencies break the CI build? Which files should change when you add a package?
