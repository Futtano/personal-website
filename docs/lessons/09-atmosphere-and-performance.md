# 9. Atmosphere, accessibility, and performance

[Previous](08-computer-and-content.md) · [Learning path](../README.md) · [Next](10-debugging-and-testing.md)

**Goal:** understand how small visual and audio choices interact with usability and rendering cost.

**Read alongside:** [style.css](../../src/style.css), audio and `unavailable()` in [main.js](../../src/main.js), and lighting/loop code in [scene.js](../../src/scene.js).

## The dreamlike feeling is several simple systems

The scene uses muted material colors, a warm sun, cool ambient light, distance fog, and a pale background. Fog blends distant objects toward the background between 38 and 145 units, softening the far coastline.

CSS adds a faint grain generated with SVG turbulence and gradients over the image. The arrival uses a translucent pale wash. The dream transition fades a full-screen pale overlay with blur across a camera teleport.

There is no bloom pass, depth-of-field shader, or postprocessing composer. Before adding those, identify the visual problem they should solve and measure their cost.

## The water is an illusion, too

The sea consists of colored flat boxes. Narrow transparent strips translate gently using sine waves. They suggest foam but do not simulate fluid or deform a surface mesh.

All strips currently request the same cached material. Mutating `w.material.opacity` in the loop therefore changes one shared material repeatedly; its final value affects all strips. Their positions still vary individually. To animate opacity independently, clone the material for each strip or design a suitable shader. This is a concrete lesson in shared mutable objects, not just a graphics issue.

## The audio graph

Audio starts only after clicking Sound. It is generated locally, not downloaded from a sound library.

```text
AudioBufferSourceNode (looping noise)
        → BiquadFilterNode (low-pass at 450 Hz)
        → GainNode (volume 0.25)
        → AudioContext destination (speakers)
```

The app fills four seconds of mono samples with smoothed random values. The low-pass filter further reduces high-frequency noise. The result suggests distant surf; it is not a field recording or spatialized ocean simulation.

The source starts once. Subsequent button clicks suspend or resume the `AudioContext`. This avoids trying to restart a one-shot source node. The [Web Audio API overview](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) explains the graph of connected audio nodes.

Current limitations include a possible discontinuity where the buffer loops, no distance-dependent sound, no fade at mute boundaries, and no explicit audio suspension on tab visibility changes. Browser behavior also affects when a context is allowed to run. These are suitable focused improvements later.

## Accessibility is a second route through the experience

The direct-reading link, semantic buttons, native dialogs, visible focus outlines, and Escape behavior make the content usable without walking. The canvas has an accessible name, but that label does not make every object in the 3D world understandable to a screen reader.

Reduced-motion settings skip the timed arrival fade, disable CSS transitions, and stop the decorative wave motion. User-controlled walking still works. There is no camera bob.

The scene reads a media query object during rendering; CSS responds to the preference too. This is different from permanently deciding at startup that every user wants motion.

We still need broader screen-reader testing, keyboard-only world navigation alternatives, high zoom checks, touch-tablet checks, and contrast review across changing backgrounds. Do not interpret these initial accommodations as a completed accessibility audit.

## Failure is part of the interface

The dynamic import catches loading or initialization failures. A `webglcontextlost` listener stops the animation loop and activates the same reading fallback.

The world has no automatic recovery procedure after context loss. Reloading is the current way to retry. Markdown reading still requires JavaScript, so “works without WebGL” is not the same promise as “works without JavaScript.”

## Where the frame time goes

| Cost | What causes it here | Existing mitigation |
| --- | --- | --- |
| Pixel processing | Full-screen canvas, high-density displays | Device pixel ratio capped at 1.5 |
| Draw calls | Many separate boxes, keys, plants, tiles | No instancing yet; materials are shared |
| Shadows | Another view of shadow-casting geometry | Static shadow map computed initially |
| JavaScript updates | Input, collisions, waves, room checks | Simple formulas; DOM callbacks only on changes |
| Hidden-tab work | Rendering a view nobody can see | Loop returns early when `document.hidden` |
| Network/startup | Three.js and other code | Separate chunks; geometry requires no model downloads |

Doubling both buffer dimensions means approximately four times as many pixels. A low-poly model can still be expensive if hundreds of individual meshes require many draw calls.

The scene continues rendering behind the desktop because `setActive(false)` only disables movement. It also downloads at startup even for readers. Both are opportunities for improvement. Inspect `renderer.info.render.calls`, frame timing, and the Network panel before choosing an optimization.

Static shadows need invalidation when objects move. Cached materials need care when mutated. New scene lifecycles would need disposal of geometries, textures, materials, the renderer, and event listeners; current initialization assumes one world per page load.

## Try it

Enable reduced motion in your browser’s rendering tools. Reload, enter, and observe the transition and water. Then block WebGL through the example test in lesson 10 and verify that the article remains reachable.

**Expected:** decorative motion changes, while the reader still works. Disabling movement for the desktop is not equivalent to stopping rendering.

## Checkpoint

Why does reducing pixel ratio help? Why would a moving door need a shadow update? What is the difference between a graphics fallback and a JavaScript-free page?
