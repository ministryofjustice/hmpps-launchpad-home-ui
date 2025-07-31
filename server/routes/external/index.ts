import { Request, Response, Router } from 'express'
import logger from '../../../logger'
import { getEstablishmentData } from '../../utils/utils'
import config from '../../config'
import { AUDIT_EVENTS, auditService } from '../../services/audit/auditService'

export default function routes(): Router {
  const router = Router()

  router.get(
    [
      '/self-service',
      '/content-hub',
      '/prison-radio',
      '/inside-time',
      '/adjudications',
      '/incentives',
      '/learning-and-skills',
      '/money-and-debt',
      '/visits',
      '/privacy-policy',
      '/transactions-help',
    ],
    async (req: Request, res: Response) => {
      const { idToken } = res.locals.user
      const agencyId = idToken.establishment?.agency_id
      const prisonerId = idToken.sub
      const target = req.path

      const { prisonerContentHubURL, selfServiceURL } = getEstablishmentData(agencyId)

      const links: { [key: string]: string } = {
        '/self-service': selfServiceURL,
        '/content-hub': prisonerContentHubURL,
        '/prison-radio': `${prisonerContentHubURL}/${config.contentHubUrls.prisonRadio}`,
        '/inside-time': config.externalUrls.insideTime,
        '/adjudications': `${prisonerContentHubURL}/${config.contentHubUrls.adjudications}`,
        '/incentives': `${prisonerContentHubURL}/${config.contentHubUrls.incentives}`,
        '/learning-and-skills': `${prisonerContentHubURL}/${config.contentHubUrls.learningAndSkills}`,
        '/money-and-debt': `${prisonerContentHubURL}/${config.contentHubUrls.moneyAndDebt}`,
        '/visits': `${prisonerContentHubURL}/${config.contentHubUrls.visits}`,
        '/privacy-policy': `${prisonerContentHubURL}/${config.contentHubUrls.privacyPolicy}`,
        '/transactions-help': `${prisonerContentHubURL}/${config.contentHubUrls.transactionsHelp}`,
      }

      const redirectUrl = links[target]

      logger.info(`Redirecting ${prisonerId} to ${redirectUrl}`)

      await auditService.audit({
        what: AUDIT_EVENTS.VIEW_EXTERNAL_PAGE,
        idToken,
        details: {
          pageUrl: req.originalUrl,
          redirectUrl,
        },
      })

      res.redirect(redirectUrl)
    },
  )

  return router
}
