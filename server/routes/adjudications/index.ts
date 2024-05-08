import { Request, Response, Router } from 'express'

import type { Services } from '../../services'
import { formatReportedAdjudication } from '../../utils/adjudications/formatReportedAdjudication'
import { asyncHandler } from '../../utils/asyncHandler'
import { getEstablishmentLinksData } from '../../utils/utils'

export default function routes(services: Services): Router {
  const router = Router()

  const renderAdjudicationsPage = async (req: Request, res: Response) => {
    const { prisonerContentHubURL } = await getEstablishmentLinksData(res.locals.user.idToken.establishment.agency_id)
    const reportedAdjudications = await services.prisonerProfileService.getReportedAdjudicationsFor(res.locals.user)
    const displayPagination: boolean = reportedAdjudications.totalPages > 1

    res.render('pages/adjudications', {
      givenName: res.locals.user.idToken.given_name,
      title: 'Adjudications',
      config: getConfig(),
      data: {
        reportedAdjudications,
        displayPagination,
        adjudicationsReadMoreURL: `${prisonerContentHubURL}/content/4193`,
      },
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  }

  const renderAdjudicationPage = async (req: Request, res: Response) => {
    const { prisonerContentHubURL } = await getEstablishmentLinksData(res.locals.user.idToken.establishment.agency_id)
    const { reportedAdjudication } = await services.prisonerProfileService.getReportedAdjudication(
      req.params.chargeNumber,
      res.locals.user.idToken.establishment.agency_id,
    )
    const formattedAdjudication = await formatReportedAdjudication(reportedAdjudication, services)

    res.render('pages/adjudication', {
      givenName: res.locals.user.idToken.given_name,
      title: `View details of ${reportedAdjudication.chargeNumber}`,
      config: getConfig(),
      data: {
        adjudication: formattedAdjudication,
        adjudicationsReadMoreURL: `${prisonerContentHubURL}/content/4193`,
      },
    })

    console.log({ renderAdjudication: JSON.stringify(reportedAdjudication, null, 2) })
    console.log({ formattedAdjudication: JSON.stringify(formattedAdjudication, null, 2) })
  }

  router.get('/', asyncHandler(renderAdjudicationsPage))
  router.get('/:chargeNumber', asyncHandler(renderAdjudicationPage))

  return router
}

function getConfig() {
  return {
    content: false,
    header: false,
    postscript: true,
    detailsType: 'small',
  }
}
