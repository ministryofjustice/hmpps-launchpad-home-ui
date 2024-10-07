import { dataAccess } from '../data'

import AdjudicationsService from './adjudications'
import IncentivesService from './incentives'
import LaunchpadAuthService from './launchpadAuth'
import LinksService from './links'
import PrisonService from './prison'
import PrisonerContactRegistryService from './prisonerContactRegistry'

export type Services = ReturnType<typeof services>

export const services = () => {
  const {
    hmppsAuthClient,
    adjudicationsApiClientBuilder,
    incentivesApiClientBuilder,
    launchpadAuthClientBuilder,
    prisonApiClientBuilder,
    prisonerContactRegistryApiClientBuilder,
  } = dataAccess()

  const adjudicationsService = new AdjudicationsService(hmppsAuthClient, adjudicationsApiClientBuilder)
  const incentivesService = new IncentivesService(hmppsAuthClient, incentivesApiClientBuilder)
  const launchpadAuthService = new LaunchpadAuthService(hmppsAuthClient, launchpadAuthClientBuilder)
  const prisonService = new PrisonService(hmppsAuthClient, prisonApiClientBuilder)
  const prisonerContactRegistryService = new PrisonerContactRegistryService(
    hmppsAuthClient,
    prisonerContactRegistryApiClientBuilder,
  )

  const linksService = new LinksService()

  return {
    adjudicationsService,
    incentivesService,
    launchpadAuthService,
    linksService,
    prisonerContactRegistryService,
    prisonService,
  }
}

export {
  AdjudicationsService,
  IncentivesService,
  LaunchpadAuthService,
  LinksService,
  PrisonerContactRegistryService,
  PrisonService,
}
