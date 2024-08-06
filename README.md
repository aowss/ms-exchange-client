# ms-exchange-client

Building an MS Exchange email client using:
* [`shadcn-vue`](https://www.shadcn-vue.com/)
* [Microsoft Graph API](https://developer.microsoft.com/en-us/graph)

This is based on the [`shadcn-vue` Mail example](https://www.shadcn-vue.com/examples/mail.html).  
The code for that example is located [here](https://github.com/radix-vue/shadcn-vue/tree/dev/apps/www/src/examples/mail).

## Setup

We follow the [Vite installation instructions for `shadcn-vue`](https://www.shadcn-vue.com/docs/installation/vite.html).

* Use [`create-vue` package](https://github.com/vuejs/create-vue) to scaffold the project as described in [Vue's tooling documentation page](https://vuejs.org/guide/scaling-up/tooling.html#vite).

This will use [Vite](https://vitejs.dev/) as the build tool and development environment.

![](Scaffolding.png)

* Add [Tailwind](https://tailwindcss.com/) and its configuration
* Edit `tsconfig.json`
* Update `vite.config.ts`
* Delete default Vite styles
* Set up the project to use `shadcn-vue`:

![](Setup.png)

* Update `main.ts` to use Tailwind styles

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
