import { defineConfig } from "cypress";
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'
import { options } from "./scripts/esbuild";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', createBundler(options));
    },
    supportFile: 'cypress/support/index.ts',
  }
});
