# Glossary

[Learning path](../README.md)

## Browser and interface

| Term | Meaning in this project |
| --- | --- |
| DOM | Browser’s object tree representing HTML elements |
| CSS | Rules that style and lay out the DOM interface |
| Canvas | A drawing surface; our visible one uses WebGL, offscreen text canvases use 2D drawing |
| WebGL | Browser graphics API that Three.js uses to draw with the GPU |
| GPU | Processor optimized for graphics and other parallel work |
| Viewport | The visible area of the browser page |
| Event listener | A function registered to respond to input or browser state changes |
| Pointer capture | Keeps a drag associated with its element beyond the original hit area |
| Modal | An interface that temporarily makes the rest of the document noninteractive |
| Top layer | Browser-managed layer used by modal dialogs, separate from normal z-index ordering |
| Fragment/hash | The `#...` part of the URL, interpreted locally for blog navigation |
| Origin | A scheme, host, and port combination; different origins can have different browser permissions |
| CORS | HTTP rules governing some cross-origin access; relevant if future assets/APIs come from another origin |
| Accessibility | Making content and interaction usable across abilities and input methods |

## Tools and delivery

| Term | Meaning in this project |
| --- | --- |
| Node.js | JavaScript runtime executing development/build/test tools |
| npm | Package installer and script runner |
| Dependency | A package our code or tools use |
| Transitive dependency | A package required by one of our dependencies |
| Lockfile | The resolved package graph used for reproducible installation |
| ES module | A file exposing/importing code through `export` and `import` |
| Module graph | The network of imports starting at an entry point |
| Dev server | Serves source through development transformations and reload support |
| HMR | Hot module replacement: update selected modules without always reloading the whole document |
| Build | Transformation from source and dependencies into deployable files |
| Bundle/chunk | Emitted JavaScript containing modules grouped by the bundler |
| Tree shaking | Removing eligible unused module exports/code during bundling |
| Minification | Reducing output size by shortening syntax and removing unnecessary text |
| Source map | Mapping transformed code back to source for debugging; production maps are not enabled here |
| Artifact | Output preserved by automation, such as the packaged `dist/` directory |
| Static hosting | Serving prebuilt files without executing our application on a server per request |
| CI | Continuous integration: automated checks associated with code changes |
| CD | Continuous delivery/deployment: preparing or performing publication through automation |
| CDN | Distributed infrastructure that can serve cached assets near visitors |
| DNS | System connecting domain names to hosting destinations |
| TLS/HTTPS | Encrypted, authenticated transport for browser/server communication |
| Cache | Reuse of a previous response or computation instead of repeating work |
| Environment variable | Process configuration; client-exposed build variables are not secrets |

## 3D and application architecture

| Term | Meaning in this project |
| --- | --- |
| Scene graph | Hierarchy of objects and their transforms |
| Geometry | Vertices and related data defining a shape |
| Material | Rules describing how a surface appears |
| Mesh | Renderable geometry paired with a material |
| Transform | Position, rotation, and scale |
| World/local space | Coordinates relative to the whole scene or an object’s parent |
| Normal | Surface direction used in lighting calculations |
| Texture | Image-like data sampled by a material |
| Frustum | Camera’s visible 3D volume between near and far planes |
| FOV | Camera field of view, measured in degrees for the constructor used here |
| Yaw/pitch | Horizontal turning and vertical looking |
| Delta time | Time elapsed since the previous animation step |
| AABB | Axis-aligned bounding box; our collisions use its X/Z footprint |
| Raycasting | Testing a ray for intersections, used to pick the monitor screen |
| Draw call | A rendering submission; many small meshes can create many calls |
| Instancing | Rendering repeated geometry efficiently with per-instance transforms |
| Z-fighting | Flickering/unstable overlap between surfaces at nearly identical depth |
| Tone mapping | Mapping scene lighting values into a displayable range |
| Context loss | Browser/GPU rendering context becomes unavailable |
| State | Values representing the application’s current situation |
| Callback | Function supplied to another component for it to invoke on an event |
| Disposal | Explicitly releasing resources and listeners when their owner is finished |
