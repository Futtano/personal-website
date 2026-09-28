# 6. Building the beach and house

[Previous](05-threejs-fundamentals.md) · [Learning path](../README.md) · [Next](07-movement-and-interaction.md)

**Goal:** read the environment as a composition of small reusable construction patterns.

**Read alongside:** [scene.js](../../src/scene.js), from the helper functions through the towel line and fence.

## Procedural modeling

The current world has no imported GLTF models, scanned textures, terrain editor, or external image assets. JavaScript constructs its geometry. “Procedural” here means generated through code; it does not mean random or infinitely large.

Four helpers do most of the work:

| Helper | Inputs | Typical use |
| --- | --- | --- |
| `box(w,h,d,x,y,z,color,solid,parent)` | Dimensions, center, appearance, optional collision flag | Walls, cabinets, cushions, keyboard keys |
| `cylinder(rt,rb,h,x,y,z,color,n)` | Top/bottom radii, height, center, segment count | Cups, plates, lamps, fence posts |
| `sphere(r,x,y,z,color,scale,detail)` | Radius, center, nonuniform scale, detail | Actually an icosahedron: rocks, shrubs, mouse |
| `textPlane(text,w,h,x,y,z,...)` | Text, plane size, position, canvas colors | House sign, posters, CRT screen |

The name `sphere()` is convenient but imprecise: low-detail icosahedrons provide the angular style. `box()` can also add a footprint to the collider list. It does not automatically make every visible object solid.

## Read the world in construction order

1. Create renderer, camera, materials, and lights.
2. Lay down sand, sea, shallow water, and wave strips.
3. Scatter rocks and plants, preserving the house and entrance area.
4. Add stepping stones and house floors.
5. Build walls around openings, then roof and gables.
6. Add exterior trim and furniture room by room.
7. Install movement and interaction logic after the scene exists.

This order is useful for understanding the file, but the renderer mainly cares about the resulting scene graph, not whether the sofa was created before the cooker.

## A map of the house

```text
                  BACK / Z = -8
          X = -5        X = 0        X = 5
             +------------+------------+
             |   studio   |  bedroom   |
             |            | bed / lamp |
     Z=-4.5  +-- opening -+-- opening -+
             | CRT / desk | cabinets   |
             |            |            |
             | living room| kitchen    |
             | sofa       | table      |
      Z=2    +------- front opening ---+
                         |
                    stepping stones
                         |
                player starts Z = 12

       Sea lies to the negative-X side of the house.
```

This is a conceptual map, not an architectural drawing. The source dimensions determine the exact gaps and furnishings.

## Openings are empty space

We do not cut holes out of a solid wall with boolean geometry. We build separate wall pieces around a door or window. The front wall has left and right blocks plus an overhead lintel. Internal doors work the same way.

This also simplifies collision. A low sill has a collision footprint; an overhead lintel does not. Our collision system ignores height, so marking a lintel as solid would block the doorway at ground level. An earlier prototype placed a divider directly behind the entrance; inspecting the actual walking path revealed that mistake.

## Roofs require a few triangles

The roof uses `BufferGeometry` with a position attribute. Every three vertices describe one triangle. Two triangles make a rectangular roof slope; both slopes form the pitched roof.

`Float32BufferAttribute` stores the numeric data in a GPU-friendly format. `computeVertexNormals()` calculates directions used for lighting. `DoubleSide` makes these thin surfaces visible from inside and outside. It does not give them physical thickness.

Thin boxes repeated along the roof suggest tile rows. They are geometry, not a photographed roof texture. Gable triangles close the front and rear ends.

## Small objects establish scale and occupation

The living room combines sofa blocks, cushions, a striped rug, a low table, stacked books, and a cup. The computer’s keyboard uses nested loops to create rows and columns of keys.

The kitchen combines cabinet boxes, darker sink surfaces, stove rings, shelf jars, plates, and a table. The bedroom uses a bed frame, mattress, layered fabric-colored boxes, pillows, a lamp, and a mat. “Rumpled cotton” is an artistic intention expressed with simple layers; there is no cloth simulation.

Objects use world coordinates directly. Most furniture is not organized into `THREE.Group` objects yet. Moving a whole desk therefore requires moving several coordinates—a good motivation for the later module/group refactor.

## Controlled randomness

The seeded generator starts with `seed = 23`. The same sequence produces the same scenery on reload, making bugs and screenshots reproducible. Using `Math.random()` everywhere would rearrange the beach each time.

A rectangular exclusion condition keeps vegetation away from the house and main approach. This is placement logic, not collision avoidance for every object. Most outdoor decorations do not block walking.

There are small prototype quirks to learn from: the rock branch runs only when `i % 3 === 0`, so indexing its color palette with `i % 3` always picks the first color. Read the condition and the palette expression together before assuming variety.

## Try it: leave a book on the table

Inside `initWorld()`, near the living-room table section, try this **exercise**:

```js
const notebook = box(0.28, 0.04, 0.20, -3.4, 0.62, -0.5, '#697e87');
notebook.rotation.y = 0.2;
```

Here `box()` already exists in scope. The table top is around Y = 0.59, so a thin book centered at 0.62 rests above it. Inspect it from multiple angles, then adjust its position if it overlaps another object.

**Expected:** a small rotated notebook appears. Walking does not change because the default `solid` argument is false.

## Checkpoint

How would you widen a door without a modeling library? Why should decorative trim and overhead beams not automatically be colliders? What would a group buy us when moving the whole workstation?
