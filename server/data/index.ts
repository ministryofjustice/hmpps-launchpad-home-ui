/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { buildAppInsightsClient, initialiseAppInsights } from '../utils/azureAppInsights'

initialiseAppInsights()
buildAppInsightsClient()

import HmppsAuthClient from './api/hmppsAuth/client'
import IncentivesApiClient from './api/incentivesApi/client'
import PrisonApiClient from './api/prisonApi/client'
import PrisonerContactRegistryApiClient from './api/prisonerContactRegistryApi/client'

import { createRedisClient } from './redisClient'
import TokenStore from './tokenStore'

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => ({
  hmppsAuthClient: new HmppsAuthClient(new TokenStore(createRedisClient())),
  prisonApiClientBuilder: ((token: string) => new PrisonApiClient(token)) as RestClientBuilder<PrisonApiClient>,
  incentivesApiClientBuilder: ((token: string) =>
    new IncentivesApiClient(token)) as RestClientBuilder<IncentivesApiClient>,
  prisonerContactRegistryApiClientBuilder: ((token: string) =>
    new PrisonerContactRegistryApiClient(token)) as RestClientBuilder<PrisonerContactRegistryApiClient>,
})

export type DataAccess = ReturnType<typeof dataAccess>

export { HmppsAuthClient, IncentivesApiClient, PrisonApiClient, PrisonerContactRegistryApiClient, RestClientBuilder }
