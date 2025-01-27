import { dataAccess } from '../data'

import AdjudicationsService from './adjudications'
import IncentivesService from './incentives'
import LaunchpadAuthService from './launchpadAuth'
import LinksService from './links'
import LocationService from './location'
import PrisonService from './prison'
import PrisonerContactRegistryService from './prisonerContactRegistry'

export type Services = ReturnType<typeof services>

export const services = () => {
  const {
    hmppsAuthClient,
    adjudicationsApiClientBuilder,
    incentivesApiClientBuilder,
    launchpadAuthClientBuilder,
    locationApiClientBuilder,
    prisonApiClientBuilder,
    prisonerContactRegistryApiClientBuilder,
  } = dataAccess()

  const adjudicationsService = new AdjudicationsService(hmppsAuthClient, adjudicationsApiClientBuilder)
  const incentivesService = new IncentivesService(hmppsAuthClient, incentivesApiClientBuilder)
  const launchpadAuthService = new LaunchpadAuthService(hmppsAuthClient, launchpadAuthClientBuilder)
  const locationService = new LocationService(hmppsAuthClient, locationApiClientBuilder)
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
    locationService,
    prisonerContactRegistryService,
    prisonService,
  }
}

export {
  AdjudicationsService,
  IncentivesService,
  LaunchpadAuthService,
  LinksService,
  LocationService,
  PrisonerContactRegistryService,
  PrisonService,
}
