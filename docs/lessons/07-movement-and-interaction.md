# 7. Movement, collisions, and interaction

[Previous](06-building-the-world.md) · [Learning path](../README.md) · [Next](08-computer-and-content.md)

**Goal:** follow a keypress all the way to a changed camera position and a computer interaction.

**Read alongside:** [scene.js](../../src/scene.js), starting with `const keys = new Set()`.

## Store input; consume it every frame

`keydown` adds a key code to a set. `keyup` removes it. The render loop reads that set to decide whether movement is requested.

This avoids depending on the operating system’s key-repeat rate. Holding W should produce smooth continuous movement, not one step per repeated keydown event.

The code uses `event.code`, such as `KeyW`, for physical key positions. Arrow keys provide another option. Handlers ignore movement while inactive and avoid hijacking events from UI controls. Relevant keys use `preventDefault()` so arrows do not scroll the page.

Losing window focus, changing visibility, opening the computer, or choosing a destination clears input. Otherwise releasing a key while another application has focus could leave the character walking indefinitely.

## Time-based movement

The animation callback receives a timestamp in milliseconds. Existing calculation:

```js
const dt = Math.min((now - last) / 1000, 0.05);
last = now;
```

`dt` is the elapsed time in seconds, capped at 50ms. Speed is 2.65 units per second, so a 60fps frame normally moves approximately `2.65 / 60 = 0.044` units.

The cap avoids huge movement jumps after a stall. It also means movement slows on very low frame rates: a real 200ms frame still advances only 50ms of simulated motion. This is a deliberate simplification, not a full fixed-step simulation.

## Walking relative to the camera

`forward` and `right` are assembled from the key set. Opposite directions cancel. The pair is normalized so holding W+D is not faster than holding only W.

The world-space displacement is:

```js
const speed = 2.65 * dt;
const dx = (-Math.sin(yaw) * forward + Math.cos(yaw) * right) * speed;
const dz = (-Math.cos(yaw) * forward - Math.sin(yaw) * right) * speed;
```

At yaw = 0, forward moves toward negative Z and right moves toward positive X. Looking upward does not make the player fly because pitch is not included in the walking vector. Eye height stays fixed; there is no gravity, jumping, or staircase support.

## Looking with the pointer

Pointer-down records a starting point and captures the pointer. Pointer-move converts pixel deltas into yaw and pitch changes, using a sensitivity factor of 0.003 radians per pixel. Pitch is clamped between -1.25 and 1.25 radians to prevent flipping upside down.

The camera uses Euler order `YXZ`. Rotation order matters because 3D rotations do not generally commute; this order supports the yaw/pitch arrangement here.

Pointer events cover mouse, touch, and pen. Capture keeps a drag associated with its element even if the pointer moves outside its bounds. The touch buttons likewise capture their pointers and clear pressed state on release, cancellation, or lost capture. [MDN’s pointer events documentation](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) explains this shared input model.

There is no pointer lock. The cursor remains a browser cursor, and you drag to look. A multi-touch look controller would need more explicit pointer-ID tracking than the current single `dragging` flag.

## Collision is a 2D footprint test

Each solid box contributes minimum and maximum X/Z coordinates. `collision(x,z)` expands those bounds by a player radius of 0.23, then tests the candidate camera position. World bounds limit the explorable beach too.

Movement tests X and Z separately:

```js
if (!collision(camera.position.x + dx, camera.position.z)) {
  camera.position.x += dx;
}
if (!collision(camera.position.x, camera.position.z + dz)) {
  camera.position.z += dz;
}
```

This lets the player slide along a wall when one direction is blocked.

Limitations matter:

- These are axis-aligned footprints, not full 3D physics.
- The expansion is a conservative square approximation, not an exact circle-vs-box corner test.
- Collider bounds are captured at creation; later mesh transforms do not update them.
- Rotated or parent-transformed solid boxes need a better bounds calculation.
- Only selected furniture is solid; cylinders and many decorations have no colliders.
- Candidate-position checks are not swept collision detection; high speeds or thin obstacles need more care.

The door gaps and low speed make this enough for a first small environment.

## Knowing where you are and what you can use

Room labels come from camera coordinates, not raycasts. Crossing Z = -4.5 separates front and rear rooms; X = 0 separates left and right. These labels do not prove the camera is inside a physically valid region.

The computer prompt appears when the player is inside the living side, in front of the rear divider, and within 2.5 units of a fixed screen position. E and the HTML interaction button use this proximity condition; looking directly at the screen is not required.

Clicking the screen additionally uses a `Raycaster`. Pointer pixels become normalized device coordinates in [-1, 1], and the ray is checked against `pcScreen`. The Y coordinate is inverted because browser pixels grow downward. A drag longer than six pixels is not treated as a click.

The conversion assumes the canvas fills the viewport. An embedded canvas would need `getBoundingClientRect()`. The ray only checks the screen, not occluding objects, so this is not a general line-of-sight interaction system yet.

## Try it

Compare forward movement with diagonal movement, then walk diagonally into a wall. Temporarily reduce walking speed to 1.5 and repeat. Restore 2.65 afterward.

**Expected:** diagonal travel is not faster; a blocked axis can still allow sliding along the other axis.

## Checkpoint

Why store keys in a set? Why normalize movement? What would break if you moved a solid cabinet after its collider had been recorded?
