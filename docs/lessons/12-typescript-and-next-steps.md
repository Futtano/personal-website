# 12. Evolving the architecture

[Previous](11-build-and-deployment.md) · [Learning path](../README.md) · Next: [Choose a follow-up lab](../reference/roadmap.md)

**Goal:** make future improvements easier without rewriting the whole prototype at once.

**Read alongside:** [main.js](../../src/main.js), [scene.js](../../src/scene.js), and [the roadmap](../reference/roadmap.md).

## What we have and what we do not

The current source is plain JavaScript with native browser APIs and Three.js. There is no `tsconfig.json`, TypeScript compiler, formatter, linter, React, or backend. The course examples introduce browser tests, but they are not wired into deployment.

Those are explicit architectural facts, not defects that all need fixing immediately. Add a tool to solve a named problem and learn how to verify it.

## A gradual refactor

A useful proposed structure is:

```text
src/
├── main.ts
├── content/posts.ts
├── ui/desktop.ts
├── ui/navigation.ts
├── audio/ambience.ts
└── world/
    ├── create-world.ts
    ├── materials.ts
    ├── environment.ts
    ├── house.ts
    ├── furniture.ts
    ├── controller.ts
    └── interaction.ts
```

These files do not exist yet. First extract one responsibility while preserving its behavior. For example, move only the sound graph into a module, run the existing checks, and record what became clearer. Avoid mixing a rendering redesign, a type migration, and a routing change in one step.

A `THREE.Group` can make a desk’s pieces move together. It does not automatically repair our collider coordinates. Decide whether collision is represented in local or world space before turning collidable furniture into movable groups.

## TypeScript at the module boundary

This is a **proposed type design**, not current code:

```ts
type Place = 'shore' | 'living' | 'kitchen' | 'bedroom';

type WorldCallbacks = {
  onComputer: () => void;
  onLocation: (label: string) => void;
  onNearComputer: (near: boolean) => void;
  onFailure: () => void;
};

type WorldController = {
  visit: (place: Place) => void;
  setActive: (active: boolean) => void;
  dispose: () => void; // Proposed lifecycle; not implemented today.
};
```

These types make invalid destination names and callback arguments visible during development. They do not prove a doorway is passable or a material is visually correct.

`dispose()` would need real behavior: remove listeners, stop the loop, dispose GPU resources with shared ownership in mind, and release audio resources in the audio module. Adding a signature is not implementing cleanup.

## A migration lab, when you are ready

Do this on a separate branch after the earlier lessons. These commands deliberately change development dependencies:

```sh
npm install --save-dev typescript @types/three@0.180
```

The type package version is aligned with our current Three.js 0.180 line. If Three.js has changed, check the corresponding types before copying that command. Review the resulting lockfile.

Start with one extracted module. A proposed initial `tsconfig.json` for gradual conversion:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "noEmit": true,
    "allowJs": true,
    "checkJs": false,
    "types": ["vite/client"],
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

`allowJs` supports a mixed project during migration; `checkJs: false` leaves unconverted JavaScript unchecked. This is an incremental step, not full coverage. `vite/client` supplies declarations for Vite-specific features such as raw asset imports. `noEmit` leaves the production emission to Vite.

Rename modules deliberately and update their import paths. When converting the entry point, update the module script in `index.html`. Extensionless local imports can help resolve either `.js` or `.ts` through the toolchain. Do not paste type annotations into a `.js` file and expect the current setup to accept them.

Add a proposed script:

```json
"typecheck": "tsc --noEmit"
```

Run `npm run typecheck` separately from `npm run build`. Vite can transform TypeScript syntax without acting as a full type checker. When the migration is complete, remove the temporary JavaScript allowance if it no longer serves a purpose.

## DOM types reveal real assumptions

The current `$` helper can return null. JavaScript callers assume the markup contains the expected element. In TypeScript, narrow it instead of hiding the problem with `any`:

```ts
const desktop = document.querySelector('#desktop');
if (!(desktop instanceof HTMLDialogElement)) {
  throw new Error('Expected the desktop dialog in index.html');
}
desktop.showModal();
```

This checks both existence and element kind. It documents a real dependency between markup and behavior.

## When would a framework or backend help?

A component framework may become useful if the DOM grows into many independently updating views. It is not required merely because the scene is interactive. A backend may become useful for authenticated editing, private API operations, or comments; the current trusted Markdown publishing model does not need one.

Search indexing, RSS, and per-post metadata might be solved with build-time generation instead of a server that runs continuously. Match the architecture to the feature’s data lifecycle.

## Try it

Before installing anything, write a type for an article entry and a type for one collider. Compare the fields with actual objects in the source. Record one mistake the types would catch and one they would not.

## Checkpoint

Why are type checking, building, and browser testing separate? What responsibility would you extract first, and how would you prove that the extraction preserved behavior?
