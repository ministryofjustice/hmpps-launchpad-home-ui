import { configureAllowedScripts } from '@ministryofjustice/hmpps-npm-script-allowlist'

export default configureAllowedScripts({
  allowlist: {
    // Needed for watching files during development
    'node_modules/@parcel/watcher@2.5.1': 'ALLOW',
    // CPU profiler and native binaries used by @sentry
    'node_modules/@sentry-internal/node-cpu-profiler@2.2.0': 'ALLOW',
    // Needed by Cypress for pulling in the Cypress binary
    'node_modules/cypress@15.9.0': 'ALLOW',
    // Provides native integration, supporting the ability to write dtrace probes for bunyan
    'node_modules/dtrace-provider@0.8.8': 'ALLOW',
    // Needed by jest for running tests in watch mode
    'node_modules/fsevents@2.3.3': 'ALLOW',
    // Needed by playwright for detecting file system changes during test runs
    'node_modules/playwright/node_modules/fsevents@2.3.2': 'ALLOW',
    // Native solution to quickly resolve module paths, used by jest and eslint
    'node_modules/unrs-resolver@1.9.0': 'ALLOW',
  },
})
