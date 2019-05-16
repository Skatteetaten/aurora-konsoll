# Aurora Konsoll

## Getting started

1. `npm ci`

2. Add a local file `.env.local` and add configuration to it. If this file is not added, default configuration will be used.

   ```
     INTEGRATIONS_GOBO_URL=http://gobo // Url to your gobo instance or remove to use default
     INTEGRATIONS_DBH_URL=http://dbh // Will enable database screen
     INTEGRATIONS_SKAP_URL=http://skap // Will enable certificate and Webseal screen
   ```

   This file will be sourced during npm start. Don't commit this file.

3. `npm start`

## IntelliJ Setup

### Prettier

The project source code is formatted with the [Prettier](https://prettier.io/) code formatter.

Install the [prettier-plugin](https://plugins.jetbrains.com/plugin/10456-prettier) via the plugin manager and complete the setup in the Prettier configuration pane. Code can now be formatted with ctrl+alt+shift+P.

You can also install the File Watcher plugin and make prettier run on save.
