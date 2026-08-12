import { Router } from 'express'
import logger from '../../../logger'
import { getEstablishmentData } from '../../utils/utils'
import config from '../../config'
import { AUDIT_EVENTS, auditService } from '../../services/audit/auditService'
import { Establishment } from '../../@types/launchpad'

export default function routes(): Router {
  const router = Router()

  const {
    prisonRadio,
    adjudications,
    incentives,
    learningAndSkills,
    moneyAndDebt,
    visits,
    privacyPolicy,
    transactionsHelp,
  } = config.contentHubUrls

  const redirections: { [path: string]: (e: Establishment) => string } = {
    '/manage-apps': () => config.apis.manageApps.url,
    '/pin-phone': () => config.apis.pinPhones.url,
    '/self-service': ({ selfServiceURL }) => selfServiceURL,
    '/content-hub-legacy': ({ prisonerContentHubURL }) => prisonerContentHubURL,
    '/content-hub': () => config.apis.contentHub.url,
    '/prison-radio': ({ prisonerContentHubURL }) => `${prisonerContentHubURL}/${prisonRadio}`,
    '/inside-time': () => config.externalUrls.insideTime,
    '/adjudications': ({ prisonerContentHubURL }) => `${prisonerContentHubURL}/${adjudications}`,
    '/incentives': ({ prisonerContentHubURL }) => `${prisonerContentHubURL}/${incentives}`,
    '/learning-and-skills': ({ prisonerContentHubURL }) => `${prisonerContentHubURL}/${learningAndSkills}`,
    '/money-and-debt': ({ prisonerContentHubURL }) => `${prisonerContentHubURL}/${moneyAndDebt}`,
    '/visits': ({ prisonerContentHubURL }) => `${prisonerContentHubURL}/${visits}`,
    '/privacy-policy': ({ prisonerContentHubURL }) => `${prisonerContentHubURL}/${privacyPolicy}`,
    '/transactions-help': ({ prisonerContentHubURL }) => `${prisonerContentHubURL}/${transactionsHelp}`,
    '/think-through-nutrition': () => config.externalUrls.thinkThroughNutrition,
  }

  router.get(Object.keys(redirections), async (req, res) => {
    const { idToken } = res.locals.user
    const {
      establishment: { agency_id: agencyId },
      sub: prisonerId,
    } = idToken

    const establishment = getEstablishmentData(agencyId)
    const redirectUrl = redirections[req.path](establishment)

    logger.info(`Redirecting ${prisonerId} to ${redirectUrl}`)

    await auditService.audit({
      what: AUDIT_EVENTS.VIEW_EXTERNAL_PAGE,
      idToken,
      details: { pageUrl: req.originalUrl, redirectUrl },
    })

    res.redirect(redirectUrl)
  })

  return router
}
