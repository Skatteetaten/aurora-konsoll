# Aurora Konsoll

## Getting started

1. `npm ci`

### Local development

For local development using react-scripts.

1. Log in to OpenShift.
2. `npm start`.
3. Click the http://localhost:3000 printed in the terminal.

### Local development with Single SPA

For local development with single spa.

1. `npm run start:spa`
2. Start aurora-konsoll-spa with `npm start`

## IntelliJ Setup

### Prettier

The project source code is formatted with the [Prettier](https://prettier.io/) code formatter.

Install the [prettier-plugin](https://plugins.jetbrains.com/plugin/10456-prettier) via the plugin manager and complete the setup in the Prettier configuration pane. Code can now be formatted with ctrl+alt+shift+P.

You can also install the File Watcher plugin and make prettier run on save.
