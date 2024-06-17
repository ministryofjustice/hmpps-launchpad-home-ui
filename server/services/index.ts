import { dataAccess } from '../data'

import AdjudicationsService from './adjudications'
import IncentivesService from './incentives'
import LinksService from './links'
import PrisonService from './prison'
import PrisonerContactRegistryService from './prisonerContactRegistry'
import UserService from './user'

export type Services = ReturnType<typeof services>

export const services = () => {
  const {
    hmppsAuthClient,
    adjudicationsApiClientBuilder,
    incentivesApiClientBuilder,
    prisonApiClientBuilder,
    prisonerContactRegistryApiClientBuilder,
  } = dataAccess()

  const adjudicationsService = new AdjudicationsService(hmppsAuthClient, adjudicationsApiClientBuilder)
  const incentivesService = new IncentivesService(hmppsAuthClient, incentivesApiClientBuilder)
  const prisonService = new PrisonService(hmppsAuthClient, prisonApiClientBuilder)
  const prisonerContactRegistryService = new PrisonerContactRegistryService(
    hmppsAuthClient,
    prisonerContactRegistryApiClientBuilder,
  )
  const userService = new UserService(hmppsAuthClient)

  const linksService = new LinksService()

  return {
    adjudicationsService,
    incentivesService,
    linksService,
    prisonerContactRegistryService,
    prisonService,
    userService,
  }
}

export {
  AdjudicationsService,
  IncentivesService,
  LinksService,
  PrisonerContactRegistryService,
  PrisonService,
  UserService,
}
