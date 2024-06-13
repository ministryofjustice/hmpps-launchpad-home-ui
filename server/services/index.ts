import { dataAccess } from '../data'
import LinksService from './linksService'
import PrisonerProfileService from './prisonerProfileService'
import UserService from './userService'

export const services = () => {
  const {
    adjudicationsApiClientBuilder,
    hmppsAuthClient,
    prisonApiClientBuilder,
    incentivesApiClientBuilder,
    prisonerContactRegistryApiClientBuilder,
  } = dataAccess()

  const userService = new UserService(hmppsAuthClient)

  const prisonerProfileService = new PrisonerProfileService(
    hmppsAuthClient,
    prisonApiClientBuilder,
    incentivesApiClientBuilder,
    adjudicationsApiClientBuilder,
    prisonerContactRegistryApiClientBuilder,
  )

  const linksService = new LinksService()

  return {
    userService,
    prisonerProfileService,
    linksService,
  }
}

export type Services = ReturnType<typeof services>

export { LinksService, PrisonerProfileService, UserService }
