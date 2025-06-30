/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { buildAppInsightsClient, initialiseAppInsights } from '../utils/azureAppInsights'

initialiseAppInsights()
const appInsightsClient = buildAppInsightsClient()

import AdjudicationsApiClient from './api/adjudicationsApi/client'
import HmppsAuthClient from './api/hmppsAuth/client'
import IncentivesApiClient from './api/incentivesApi/client'
import LaunchpadAuthClient from './api/launchpadAuth/client'
import LocationApiClient from './api/locationApi/client'
import NomisMappingApiClient from './api/nomisMappingApi/client'
import PrisonApiClient from './api/prisonApi/client'
import PrisonerContactRegistryApiClient from './api/prisonerContactRegistryApi/client'

import { createRedisClient } from './redisClient'
import TokenStore from './tokenStore'

export type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => ({
  hmppsAuthClient: new HmppsAuthClient(new TokenStore(createRedisClient())),
  prisonApiClientBuilder: ((token: string) => new PrisonApiClient(token)) as RestClientBuilder<PrisonApiClient>,
  incentivesApiClientBuilder: ((token: string) =>
    new IncentivesApiClient(token)) as RestClientBuilder<IncentivesApiClient>,
  adjudicationsApiClientBuilder: ((token: string) =>
    new AdjudicationsApiClient(token)) as RestClientBuilder<AdjudicationsApiClient>,
  prisonerContactRegistryApiClientBuilder: ((token: string) =>
    new PrisonerContactRegistryApiClient(token)) as RestClientBuilder<PrisonerContactRegistryApiClient>,
  launchpadAuthClientBuilder: ((token: string) =>
    new LaunchpadAuthClient(token)) as RestClientBuilder<LaunchpadAuthClient>,
  locationApiClientBuilder: ((token: string) => new LocationApiClient(token)) as RestClientBuilder<LocationApiClient>,
  nomisMappingApiClientBuilder: ((token: string) =>
    new NomisMappingApiClient(token)) as RestClientBuilder<NomisMappingApiClient>,
  applicationInsightsClient: appInsightsClient,
})

export type DataAccess = ReturnType<typeof dataAccess>

export {
  AdjudicationsApiClient,
  HmppsAuthClient,
  IncentivesApiClient,
  LaunchpadAuthClient,
  LocationApiClient,
  NomisMappingApiClient,
  PrisonApiClient,
  PrisonerContactRegistryApiClient,
}
