# Learning to build futtano

A guided tour of the website we are building together: an imagined Sardinian beach, an explorable house, and a nostalgic computer containing a personal blog.

This course assumes you can write JavaScript or TypeScript, understand functions, objects, promises, and modules, and use a terminal. It teaches the web application toolchain and graphics architecture from the beginning. You do not need React, a game engine, or previous deployment experience.

The lessons describe the **current beach-house prototype**, inspected on **2026-09-28**. They explain real functions and files. Suggested improvements are explicitly labeled as exercises or future work. The source currently uses **JavaScript**, not TypeScript.

## The learning path

Work through the lessons in order. Each has a source reading assignment, a practical experiment, and a checkpoint. A session can be one small experiment; completing a chapter is not a deadline.

| Step | Lesson | What you will be able to explain |
| --- | --- | --- |
| 1 | [The browser and the project](lessons/01-browser-and-project.md) | What runs where, and what each directory contains |
| 2 | [Tools and your local workflow](lessons/02-tools-and-local-development.md) | Node, npm, dependencies, versions, and the development server |
| 3 | [HTML, CSS, and the interface](lessons/03-html-css-and-interface.md) | How the scenery and accessible interface share a screen |
| 4 | [Application state and navigation](lessons/04-state-and-navigation.md) | How entering, reading, closing, and hash links work |
| 5 | [Three.js fundamentals](lessons/05-threejs-fundamentals.md) | Scenes, cameras, meshes, coordinates, lighting, and rendering |
| 6 | [Building the beach and house](lessons/06-building-the-world.md) | How simple shapes become a coherent environment |
| 7 | [Movement, collisions, and interaction](lessons/07-movement-and-interaction.md) | Input, frame timing, first-person movement, and picking objects |
| 8 | [The computer and the blog](lessons/08-computer-and-content.md) | Canvas textures, HTML reading, Markdown, and content boundaries |
| 9 | [Atmosphere, accessibility, and performance](lessons/09-atmosphere-and-performance.md) | The fade, audio, reduced motion, fallback, and GPU costs |
| 10 | [Debugging and testing](lessons/10-debugging-and-testing.md) | How to find faults and verify behavior in a real browser |
| 11 | [Builds and deployment](lessons/11-build-and-deployment.md) | How source becomes a hosted application, including GitHub Actions |
| 12 | [Evolving the architecture](lessons/12-typescript-and-next-steps.md) | How to introduce TypeScript and split the prototype into modules |

## Start here

From the repository root:

```sh
node --version
npm --version
npm ci
npm run dev
```

Use Node 24 for this course, matching our deployment workflow. Open the URL printed by Vite. Leave the terminal running while exploring. Stop the server with Ctrl+C.

Open [lesson 1](lessons/01-browser-and-project.md) beside the source in your editor. You can explore the house before understanding all of its code.

## How to use the material

1. **Predict:** write down what a component should do before changing it.
2. **Inspect:** find the named function or selector in the linked source file.
3. **Change:** perform one bounded experiment on a learning branch.
4. **Observe:** compare the browser behavior with your prediction.
5. **Explain:** answer the checkpoint in your own words.
6. **Record:** copy the [learning-entry template](templates/learning-entry.md) into [the journal](journal/README.md).

Snippets labeled **excerpt** show existing code, sometimes expanded for readability. Snippets labeled **exercise** or **proposed** do not already exist in the app. Do not paste several exercises at once: understanding the effect of one change is the point.

The app code is deliberately compact in places. These lessons unpack it. Formatting and modularizing that code is part of the later learning path, not something you have to solve before lesson 1.

## Keep these references nearby

- [Component and source map](reference/component-map.md): where to look for a feature.
- [Glossary](reference/glossary.md): vocabulary used throughout the course.
- [Troubleshooting](reference/troubleshooting.md): symptoms, likely causes, and checks.
- [Further reading](reference/resources.md): official documentation, grouped by topic.
- [Learning journal](journal/README.md): your explanations and experiments.
- [Next lessons and project gaps](reference/roadmap.md): improvements we have not implemented.
- [Runnable browser examples](examples/README.md): small tests used in lesson 10.

## What this course does not assume

The site has no framework, backend, database, CMS, authentication, or physics library. It is a static application with rich behavior in the browser. The lessons explain when those other pieces would become useful, without pretending we already use them.

The repository is now **public**, and GitHub Pages is configured to publish the Vite build through **GitHub Actions**. The site address is [futtano.github.io/personal-website](https://futtano.github.io/personal-website/). The earlier private-repository restriction is resolved. Read the [deployment lesson](lessons/11-build-and-deployment.md) and [deployment learning entry](journal/2026-09-29-github-pages.md) for the configuration and verification process.

## How we will maintain this course

Whenever a feature changes, update its lesson and the component map in the same change. Add a journal entry containing the problem, prediction, implementation, verification, and remaining questions. When a new concept is needed, add a focused lesson or lab and link it from this index. Record an important architectural choice with the [decision template](templates/decision.md).

Do not mark a concept “learned” merely because the feature works. Mark it understood when you can explain it and make a small variation without copying blindly.
