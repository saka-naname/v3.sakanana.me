# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Image warnings and browser tests

Works gallery images support an optional `warning: {}` for the default warning,
or `warning: { message: "作品の結末を含みます。" }` for a custom message.
Keep messages around 40 characters. See [the image warning design](./docs/works-image-warning-design.md).

```sh
npm run check
npx playwright install chromium
npm test
```

Browser tests cover desktop and mobile viewports. The test runner adds temporary
fixtures, starts Astro with `astro dev --background` on port 4322, and cleans up
the fixtures and server afterward. Stop any existing dev server in this worktree
before running tests. To run one file, use `npm test -- image-warning.spec.ts`.

## Troubleshooting

If pages or routes remain stale after resolving a duplicate Work `slug` error, restart the background development server:

```sh
astro dev stop
astro dev --background
```

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
