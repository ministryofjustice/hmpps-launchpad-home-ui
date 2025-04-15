import { Request, Response, NextFunction } from 'express'
import { getEstablishmentData } from '../utils/utils'

// eslint-disable-next-line import/prefer-default-export
export async function setPrisonerContentHubUrl(req: Request, res: Response, next: NextFunction) {
  const { user } = res.locals

  if (user) {
    const { prisonerContentHubURL } = (await getEstablishmentData(user.idToken.establishment.agency_id)) || {}

    res.locals.prisonerContentHubUrl = prisonerContentHubURL
  }

  next()
}
