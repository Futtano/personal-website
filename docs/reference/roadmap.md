# Follow-up labs and open project questions

[Learning path](../README.md)

These are proposed learning opportunities, not already implemented features or a promise to do them all next. Choose one based on what you want to understand.

| Order | Lab | New concept | Evidence of completion |
| --- | --- | --- | --- |
| A | Publish your first real local post | Content pipeline and stable IDs | Direct link, index link, preview build all show it |
| B | Add one personal object to a room | Transforms and composition | Correct placement from multiple angles, no blocked path |
| C | Turn the desk into a group | Local vs world coordinates | Move it once; screen, keyboard, light, and interaction position stay aligned |
| D | Make a bedside book interactive | Interaction data model | E/click open its reading note; computer still works |
| E | Extract the audio module | Module ownership and lifecycle | Toggle works; cleanup is explicit; behavior unchanged |
| F | Convert one module to TypeScript | Types, checking, build separation | Type error caught by tsc, build still works |
| G | Improve collision bounds | Geometry vs physics representation | Moved/rotated furniture blocks its real position |
| H | Measure and reduce repeated draw calls | Profiling and instancing | Same visual result with recorded before/after frame data |
| I | Load the world only on demand | Async lifecycle and failure UI | Direct reading does not fetch scene/Three.js until needed |
| J | Add better coastal surfaces | Textures, UVs, asset size and licensing | Documented asset source, correct color space, acceptable loading cost |
| K | Generate static post pages and RSS | Build-time content generation | Individual HTML metadata and a validated feed |
| L | Publish through the chosen host | CI/CD, paths, HTTPS | Verified live URL tied to a known source commit |

## Known prototype boundaries to revisit

- App state uses several flags and dialog states; transitions can race with other actions.
- `enter()` does not explicitly pause active movement for its entire fade.
- The scene is imported immediately and renders behind the reading dialog.
- The collider list is static and two-dimensional; many decorative objects are non-solid.
- Screen picking checks only the screen, not occlusion by other objects.
- The single look-drag state does not fully manage simultaneous touch pointers.
- The shared wave material means opacity changes are shared, not per wave.
- Rock color selection currently picks one color because of the loop condition/index combination.
- The noise loop is a simple approximation and may have a loop-boundary discontinuity.
- Graphics loss offers reading fallback but not automatic scene reconstruction.
- GPU resources and listeners have no public cleanup lifecycle yet.
- Touch controls are displayed by viewport width rather than input capability.
- Blog content is manually registered, trusted source; labels still identify sample content.
- Posts lack individual server-delivered HTML metadata, dates, draft handling, search, and a feed.
- The prototype has not received a comprehensive accessibility audit or real-device performance survey.
- The GitHub workflow has no automated test/typecheck gate yet, and hosting remains unresolved.

These are useful limits to understand, not reasons to postpone learning or writing. Pick an improvement with a small, observable result.

## Before adding a large dependency

Write down the feature, the current obstacle, the smallest alternative, and how you will verify the result. Use the [decision template](../templates/decision.md) when the choice affects future architecture—for example a physics library, a UI framework, a CMS, or a hosting provider.
