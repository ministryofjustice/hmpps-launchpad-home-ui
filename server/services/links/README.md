# Adding a new tile on Launchpad Home

## Define tile in server/services/links/index.ts

Add your new tile to the links array, the order of the array elements will be the order the tiles are rendered to the user.

Please also create a test within `server/services/links/index.test.ts` to ensure the tile works as expected going forwards.

### Things to know

#### Helper methods

- `i18n` takes a string of a translation key. Locales can be found at `server/locales`
- `ifWithinActiveAgency` allows the tile to show / hide based on the active agency system (see below for more explanation.)

#### Your URL

Please define the URL as a relative path staying within Launchpad home.

It should be in the format `/external/<your-slug-here>`.

This slug will be used later to redirect the user to your actual service.

This is necessary as we need to audit the user visiting external sites.

#### Active Agency System

This allows you to control whether a tile should be visible to the user based on their current establishment / agency.

It is done by exposing an `activeAgencies` key from your digital services `/info` endpoint.

The value of `activeAgencies` will be compared with the logged in user's agency to allow Launchpad home to determine whether to show the tile or not.

Acceptable values for `activeAgencies` are either an array of prison codes or to enable for all prisons, an array with a wildcard of three astrisks can be used.

| Example          | Agencies that will see this tab      |
|------------------|--------------------------------------|
| `[]`             | None                                 |
| `['CKI]`         | Cookham Wood (Single prison)         |
| `['CKI', 'RNI']` | Cookham Wood and Ranby (Many prisons)|
| `['***']`        | All prisons |

If for whatever reason there is a failure calling your `/info` endpoint, our service will take that as no agancies avaialble and the tile will not show.

## Define external link in server/routes/external/index.ts

Add a redirect to the redirections map, the key of this map will be the slug you defined within `server/services/links/index.ts` and the value will be the external URL of your system.

Please define your URLs as ENV variables within the `helm_deploy/values-XXX.yml` files.

Please also add any new ENV variables to `.example.env` with sane development values to help out future devs.
