import { dataAccess } from '../data'

import AdjudicationsService from './adjudicationsService'
import IncentivesService from './incentivesService'
import LinksService from './linksService'
import PrisonService from './prisonService'
import PrisonerContactRegistryService from './prisonerContactRegistryService'
import UserService from './userService'

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
