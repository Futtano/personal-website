# 5. Three.js fundamentals

[Previous](04-state-and-navigation.md) · [Learning path](../README.md) · [Next](06-building-the-world.md)

**Goal:** understand how data describing objects becomes an image.

**Read alongside:** the beginning of `initWorld()` in [scene.js](../../src/scene.js).

## The core objects

| Object | Question it answers | Our implementation |
| --- | --- | --- |
| Scene | What belongs in the world? | Meshes, lights, fog, background |
| Camera | From where are we looking? | `PerspectiveCamera` |
| Geometry | What shape is this? | Boxes, cylinders, icosahedrons, roof triangles |
| Material | How does the surface appear? | Mostly `MeshStandardMaterial` |
| Mesh | Which shape and material exist at this position? | A wall, cushion, key, rock |
| Renderer | How do we draw the scene through the camera? | `WebGLRenderer` |

Three.js handles many low-level WebGL details. The foundational scene/camera/renderer relationship is also explained in the [official r180 fundamentals source](https://github.com/mrdoob/three.js/blob/r180/manual/en/fundamentals.html), matching our installed release.

A mesh has a transform: position, rotation, and scale. Making geometry alone does not display it. It must be used by a renderable object that belongs to the scene graph, and fall within the camera’s visible region.

## Coordinates and the camera

Our convention treats one world unit roughly as one meter. Three.js does not enforce physical units for mesh dimensions.

- X: left/right across the house.
- Y: height above the beach.
- Z: depth; the house front is at Z = 2 and the back at Z = -8.
- An unrotated camera looks along its local negative Z axis.

The arrival camera is `(18, 5.5, 22)` looking toward `(-1, 1.1, -1.6)`. Entering moves it to roughly eye level `(0.1, 1.65, 12)` on the path.

The camera constructor is:

```js
new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.08, 240);
```

Its parameters mean vertical field of view in degrees, aspect ratio, near clipping distance, and far clipping distance. Objects outside that visible volume are clipped. A large field of view shows more surroundings but exaggerates perspective. Very small near values combined with distant far values can reduce depth precision.

When the viewport changes, the code updates `camera.aspect`, calls `camera.updateProjectionMatrix()`, and resizes the renderer. Resizing just the CSS box would stretch the old image.

## Geometry plus material

A simplified **excerpt** of the construction pattern:

```js
const geometry = new THREE.BoxGeometry(width, height, depth);
const material = new THREE.MeshStandardMaterial({
  color: '#e0d8bb',
  roughness: 1,
});
const wall = new THREE.Mesh(geometry, material);
wall.position.set(x, y, z);
scene.add(wall);
```

These geometries are centered on their own local origin. A wall three units tall placed at Y = 1.5 spans Y = 0 through Y = 3. This is why object centers are often half their height above the floor.

Our `mat()` helper caches materials by color and options. Reusing a material reduces duplication, but changes to the shared material affect every mesh using it. Geometry is not similarly cached yet: most calls create a new geometry.

## Light and color

`MeshStandardMaterial` responds to lighting. High roughness gives plaster and cloth a matte appearance. The sea uses lower roughness and a small metalness value as a stylistic approximation, not a physically accurate water model.

The scene has:

- A hemisphere light giving different ambient colors to upward and downward surfaces.
- A directional sun casting shadows.
- Warm point lights inside the house.
- A small colored point light near the CRT.

A `MeshBasicMaterial`, used for text planes, does not need those lights to be visible. This helps the screen retain its graphic appearance.

The renderer uses sRGB output and ACES filmic tone mapping. Tone mapping maps the scene’s lighting range into displayable values; exposure scales its brightness. These settings help shape the pale, sunlit look but do not replace sensible lighting.

## Shadows are another rendering job

The sun renders a shadow map from its viewpoint. Meshes opt into casting and receiving shadows. The 2048×2048 shadow map and its camera bounds control coverage and detail.

`normalBias` offsets shadow sampling to reduce self-shadow artifacts. Too little bias can create speckles; too much makes shadows appear detached.

Our static world disables automatic shadow-map updates and requests an initial update. This saves repeated work. If a later feature moves a shadow-casting object or the sun, that feature must request a shadow update or change the strategy.

## The animation loop

`renderer.setAnimationLoop(callback)` schedules repeated updates. Every visible frame eventually calls:

```js
renderer.render(scene, camera);
```

The browser does not need to reload to move the camera. JavaScript changes the scene’s data, and the next render uses it. Lesson 7 explains the elapsed-time calculation inside this loop.

## Try it

Change the camera FOV from 58 to 70, reload, and compare how the room feels. Restore it. Then change one material color and predict which surfaces will change if they share that material.

**Expected:** perspective changes with FOV; object dimensions do not. Material sharing may affect multiple objects if you mutate a cached material rather than choosing a new color for one mesh.

## Checkpoint

Why does a three-unit wall use a center height of 1.5? What is the difference between a material and a mesh? Why must the camera projection change when the browser becomes narrower?
