import { dataAccess } from '../data'
import LinksService from './linksService'
import PrisonerProfileService from './prisonerProfileService'
import UserService from './userService'

export const services = () => {
  const { hmppsAuthClient, prisonApiClientBuilder, incentivesApiClientBuilder, adjudicationsApiClientBuilder } =
    dataAccess()

  const userService = new UserService(hmppsAuthClient)

  const prisonerProfileService = new PrisonerProfileService(
    hmppsAuthClient,
    prisonApiClientBuilder,
    incentivesApiClientBuilder,
    adjudicationsApiClientBuilder,
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
