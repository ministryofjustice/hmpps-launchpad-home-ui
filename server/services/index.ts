import { dataAccess } from '../data'
import UserService from './userService'
import PrisonerProfileService from './prisonerProfileService'
import LinksService from './linksService'

export const services = () => {
  const { hmppsAuthClient, prisonApiClientBuilder, incentivesApiClientBuilder } = dataAccess()

  const userService = new UserService(hmppsAuthClient)

  const prisonerProfileService = new PrisonerProfileService(
    hmppsAuthClient,
    prisonApiClientBuilder,
    incentivesApiClientBuilder,
  )

  const linksService = new LinksService()

  return {
    userService,
    prisonerProfileService,
    linksService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService, PrisonerProfileService, LinksService }
