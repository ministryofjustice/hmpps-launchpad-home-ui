# HMPPS Launchpad
## Running the app
The easiest way to run the app is to use docker compose to create the service and all dependencies.

`docker-compose pull`

`docker-compose up`

### Dependencies
The app requires:
* hmpps-auth - for authentication
* redis - session store and token caching

## Running the app for development

### Set up environment variables

1. copy `example.env` into `.env`
2. the external urls on lines 8 through 20 can be configured by copy and pasting the values from the `values-dev.yaml` files found in the `helm deploy` folder
3. the client secrets from line 23 onwards can be copied from the `hmpps-launchpad-home-ui` kubernetes secret in the corresponding launchpad namespace
    - switch to the namespace with `kubectl config set-context --current --namespace=hmpps-launchpad-dev`
    - read and decode the secrets with `kubectl get secret hmpps-launchpad-home-ui -o json | jq '.data | map_values(@base64d)'`

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
