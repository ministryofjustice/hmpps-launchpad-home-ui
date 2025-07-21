import { Request, Response, Router } from 'express'
import { asyncHandler } from '../../middleware/asyncHandler'
import auditPageViewMiddleware from '../../middleware/auditPageViewMiddleware'
import { AUDIT_PAGE_NAMES } from '../../constants/audit'
import logger from '../../../logger'
import { getEstablishmentData } from '../../utils/utils'

export default function routes(): Router {
  const router = Router()

  router.get(
    '/:target(self\\-service|content\\-hub|prison\\-radio|inside\\-time)',
    auditPageViewMiddleware(AUDIT_PAGE_NAMES.EXTERNAL),
    asyncHandler(async (req: Request, res: Response) => {
      const { user } = res.locals
      const { target } = req.params

      const { prisonerContentHubURL, selfServiceURL } = getEstablishmentData(user.idToken.establishment.agency_id)

      const links: { [key: string]: string } = {
        'self-service': selfServiceURL,
        'content-hub': prisonerContentHubURL,
        'prison-radio': `${prisonerContentHubURL}/tags/785`,
        'inside-time': 'https://insidetimeprison.org/',
      }

      const redirectUrl = links[target]

      logger.info(`Redirecting ${user.idToken.sub} to ${redirectUrl}`)

      res.redirect(redirectUrl)
    }),
  )

  return router
}
