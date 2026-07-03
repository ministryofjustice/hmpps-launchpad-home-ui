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

### Running integration tests

For local running, start a test db, redis, and wiremock instance by:

`docker-compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with nodemon)

And then either, run tests in headless mode with:

`npm run int-test`

Or run tests with the cypress UI:

`npm run int-test-ui`


## Maintenance page
See the [maintenance page README](./maintenance_page/README.md) for how to turn this on/off and update the content.
