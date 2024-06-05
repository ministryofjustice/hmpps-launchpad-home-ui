/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'

initialiseAppInsights()
buildAppInsightsClient()

import HmppsAuthClient from './api/hmppsAuth/client'
import { createRedisClient } from './redisClient'
import TokenStore from './tokenStore'
import PrisonApiClient from './api/prisonApi/client'
import IncentivesApiClient from './api/incentivesApi/client'
import AdjudicationsApiClient from './api/adjudicationsApi/client'

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => ({
  hmppsAuthClient: new HmppsAuthClient(new TokenStore(createRedisClient())),
  prisonApiClientBuilder: ((token: string) => new PrisonApiClient(token)) as RestClientBuilder<PrisonApiClient>,
  incentivesApiClientBuilder: ((token: string) =>
    new IncentivesApiClient(token)) as RestClientBuilder<IncentivesApiClient>,
  adjudicationsApiClientBuilder: ((token: string) =>
    new AdjudicationsApiClient(token)) as RestClientBuilder<AdjudicationsApiClient>,
})

export type DataAccess = ReturnType<typeof dataAccess>

export { HmppsAuthClient, RestClientBuilder, PrisonApiClient, IncentivesApiClient, AdjudicationsApiClient }
