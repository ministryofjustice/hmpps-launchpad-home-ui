# HMPPS Launchpad

### Dependencies
The app requires:
* hmpps-auth - for authentication
* redis - session store and token caching

## Running the app for development

### Set up environment variables

1. copy `example.env` into `.env`
2. External urls are already present for the dev environment. To configure for another environment, values can be copied from the `values-<env>.yaml` files in `helm_deploy`
3. the client secrets can be copied from the `hmpps-launchpad-home-ui` kubernetes secret in the corresponding launchpad namespace
    - if `cloud-platform-cli` is installed you can decode the secret with `cloud-platform decode-secret -n hmpps-launchpad-dev -s hmpps-launchpad-home-ui`
    - alternatively with kubectl: `kubectl get secret hmpps-launchpad-home-ui -n hmpps-launchpad-dev -o json | jq '.data | map_values(@base64d)'`

**N.B** Secrets should never be committed to the codebase

### Set up local dependencies

The only local dependency required in order to run LaunchPad is Redis.  The easiest way to achieve this is to run the `local` docker-compose profile via:

`docker compose --profile local up -d`

### Run application

`npm start:dev`

The application will then be available on port 3000

### Run linter

`npm run lint`

### Run tests

`npm run test`

### Running WireMock and Playwright tests

This project uses WireMock to stub the external services and a mock auth setup so the app can be exercised in a predictable local/test environment.

1. Start the local test services (Redis + WireMock):

   `docker compose -f docker-compose-test.yml up -d`

2. Build the app if needed:

   `npm run build`

3. Start the app in mock mode using the project startup script:

   `npm run start-mock-app`

   This script waits for WireMock to be available and then starts the app with the mock env file (`feature.env`) so it does not point at the live dev services.

4. Run the Playwright suite in headless mode:

   `npm run int-test`

   To run the regression-focused suite:

   `REGRESSION=true npm run int-test`

5. To run the UI mode locally:

   `npm run int-test-ui`

6. To run a single test file or browser test:

   `npx playwright test integration_tests/playwright/test/Features/e2e/Timetable_e2e/timetable_e2e.spec.ts`

> The app should be started via the mock script above before running Playwright tests. This keeps the mock configuration contained to the test harness and avoids relying on the production server to know about local WireMock stubs.


## Adding tiles to launchpad home

[Please read here](./server/services/links/README.md) for instructions on how to add a tile to launchpad home.

## Maintenance page
See the [maintenance page README](./maintenance_page/README.md) for how to turn this on/off and update the content.
