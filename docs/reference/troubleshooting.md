# Troubleshooting by symptom

[Learning path](../README.md)

Start with what you observed, the URL, and the shortest reproduction. Record actual console/network errors in a [learning entry](../templates/learning-entry.md).

| Symptom | Check first | Next step |
| --- | --- | --- |
| `npm` or `node` not found | Terminal path and Node installation | Install/use Node 24, reopen the terminal, check versions |
| `npm ci` rejects the lockfile | Manifest and lockfile mismatch | Identify the intended dependency change; update intentionally with npm install |
| “vite: command not found” | Dependencies installed in this directory? | Run npm ci, including development dependencies |
| Browser cannot connect | Server running? Correct printed port? | Start dev or preview and use its actual URL |
| Clicking index.html shows a broken app | Address starts `file://` | Use the HTTP development server |
| “Failed to resolve module specifier” | Is source being served without Vite/build transformation? | Use dev server or deploy dist, not raw source files |
| Wrong content at localhost | Another server owns the port | Use `--strictPort` or choose a known free port |
| CSS change appears in dev but not preview | Preview serves the last build | Rebuild and reload preview |
| Deployed JS returns HTML or wrong MIME type | Asset URL and HTTP response body | Fix base paths or host fallback rules; inspect dist/index.html |
| Direct article link fails | Is its ID registered in entries? | Check spelling, fragment, imports, and route logic |
| Blog entry opens but title is stale in a test | Did hash navigation finish? | Wait for expected heading, not a fixed short sleep |
| Test unexpectedly retains exploration | Only the fragment changed | Use a fresh page/document for a fresh-state test |
| The scene is blank | Console, WebGL support, context loss, camera direction | Test direct reading; inspect a screenshot and graphics environment |
| Three.js failed but reading works | Fallback functioning | Diagnose graphics separately from the content path |
| World looks stretched | Camera aspect and renderer dimensions | Verify resize handler and updateProjectionMatrix |
| Door looks open but cannot be crossed | Collider footprints behind/above it | Check actual X/Z gaps and lintels mistakenly marked solid |
| A moved object blocks its old position | Colliders captured at creation | Update collision representation with the transform |
| Keyboard movement is inactive | A modal open? Focus on a button? active false? | Close dialogs, focus/click scene, inspect setActive |
| Movement remains pressed after interruption | Key/pointer state not cleared | Inspect blur, visibility, pointercancel, and lost capture |
| Computer prompt missing | Distance and room checks | Use living-room shortcut, then inspect proximity conditions |
| A drag opens the blog | Click/drag threshold behavior | Verify pointer-down/up displacement and screen raycast |
| Shadows do not follow an object | Static shadow updates disabled | Request shadowMap.needsUpdate or revise shadow strategy |
| Surfaces flicker | Nearly coplanar geometry | Separate surfaces slightly; inspect depth precision |
| Changing one wave’s opacity changes all | Shared cached material | Clone material for independent mutation or use a shader |
| No sound after click | AudioContext state and browser console | Check context resume; confirm mute state and device output |
| Mobile page is wider than viewport | Fixed widths, long strings, window content | Inspect scrollWidth vs clientWidth for document and reader |
| Playwright cannot find Chromium | Browser binary not installed/matched | Run npx playwright install chromium |
| Tests pass but visuals look broken | Assertions only checked DOM behavior | Inspect scene screenshots and real hardware rendering |
| Pages serves raw source or `/src/main.js` fails | Publishing source set to “Deploy from a branch” | Select GitHub Actions; run deploy.yml to build and publish dist |
| Workflow build succeeds, site not live | Deployment job and Pages settings | Inspect deployment result and actual live URL |

## Read network failures precisely

A 404 means that URL was not found, not necessarily that the source file is absent. A leading slash can request the wrong location under project hosting. A 200 response containing HTML for a JavaScript URL can be just as broken as a 404.

If a future remote texture or API fails with CORS, inspect the remote server’s access headers and your request origin. Renaming a local JavaScript function will not change a server’s cross-origin policy.

## Avoid destructive “fixes” as a first move

Do not delete a lockfile, overwrite all changes, disable all tests, or make a repository public just to see whether an error disappears. First identify which layer is failing. Keep the evidence that tells you whether your eventual change solved the intended problem.
