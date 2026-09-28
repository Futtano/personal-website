# futtano — a house by the sea

A playable personal-homepage prototype: a dreamlike arrival at an imagined Sardinian beach, a furnished house, and a late-1990s computer containing a Markdown blog.

## Learn how it works

Start with the [guided learning path](docs/README.md): twelve lessons covering the browser, tooling, interface, Three.js world, interaction, content, testing, builds, deployment, and future TypeScript migration. It includes exercises, runnable browser examples, a component map, and a learning journal we can grow with the project.

## Run

```sh
npm ci
npm run dev
```

Node 22.12+ (24 recommended). Build with `npm run build`; preview the static `dist/` output with `npm run preview`.

## Explore

- Enter the world, then walk with WASD or arrow keys and drag to look.
- On mobile, use the direction buttons and drag the scene.
- Approach the CRT in the living room and press E or choose “Use the computer”.
- Explore / help offers direct visits to the shore, living room, kitchen, and bedroom.
- “Just here to read” opens the blog without requiring WebGL or walking.
- Sound is optional, generated locally, and starts only after a click.
- Escape closes the computer or help. Movement pauses while either is open.

The house has collidable walls, doorways, furniture, a living room, kitchen, bedroom, and small studio. All assets are procedural Three.js geometry; this is a stylized prototype, not a photorealistic reconstruction. Reduced motion skips the arrival fade and wave animation. No camera bob, pointer lock, analytics, or account system.

## Writing

Edit trusted Markdown in `content/`. Register entries in `src/main.js`. Article links use `#note-<id>`. Website sections use `#journal`, `#work`, `#reading`, and `#about`. The current posts are explicitly sample content. Do not supply untrusted HTML to the Markdown renderer.

Edit `src/scene.js` for the environment, `src/style.css` for the interface, and `index.html` for arrival copy and metadata. Fonts use Google Fonts with local fallbacks.

## Deploy

A GitHub Pages workflow is provided in `.github/workflows/deploy.yml`; it builds and publishes `dist/` on pushes to `main`. Set Settings → Pages → Source to GitHub Actions.

**Current deployment blocker:** GitHub reported that the account plan does not support Pages for this private repository. The owner has not approved changing repository visibility. Keep the source private until explicitly instructed otherwise, or choose another static host. The site is not publicly deployed.

Relative asset paths support root hosting and GitHub Pages project subpaths. See [Vite deployment documentation](https://vite.dev/guide/static-deploy.html).
