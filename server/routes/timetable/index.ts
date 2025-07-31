import { addDays, subDays } from 'date-fns'
import { Request, Response, Router } from 'express'
import i18next from 'i18next'
import type { Services } from '../../services'
import { AUDIT_EVENTS, auditService } from '../../services/audit/auditService'

export default function routes(services: Services): Router {
  const router = Router()

  router.get('/', async (req: Request, res: Response) => {
    const language = req.language || i18next.language
    const { user } = res.locals

    const config = {
      content: false,
      header: false,
      postscript: true,
      detailsType: 'small',
      lastWeek: false,
      nextWeek: false,
    }

    const fromDate = new Date(Date.now())
    const toDate = addDays(fromDate, 6)

    const events = await Promise.all([
      services.prisonService.getEventsFor(
        user.idToken.booking.id,
        fromDate,
        toDate,
        language,
        user.idToken.sub,
        user.idToken.establishment.agency_id,
      ),
    ])

    await auditService.audit({
      what: AUDIT_EVENTS.VIEW_TIMETABLE,
      idToken: user.idToken,
      details: { fromDate, toDate },
    })

    return res.render('pages/timetable', {
      givenName: user.idToken.given_name,
      config,
      events,
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  router.get('/last-week', async (req: Request, res: Response) => {
    const language = req.language || i18next.language
    const { user } = res.locals

    const config = {
      content: false,
      header: false,
      postscript: true,
      detailsType: 'small',
      lastWeek: true,
      nextWeek: false,
    }

    const today = new Date(Date.now())
    const fromDate = subDays(today, 7)
    const toDate = subDays(today, 1)

    const events = await Promise.all([
      services.prisonService.getEventsFor(
        user.idToken.booking.id,
        fromDate,
        toDate,
        language,
        user.idToken.sub,
        user.idToken.establishment.agency_id,
      ),
    ])

    await auditService.audit({
      what: AUDIT_EVENTS.VIEW_TIMETABLE,
      idToken: user.idToken,
      details: { fromDate, toDate },
    })

    return res.render('pages/timetable', {
      givenName: user.idToken.given_name,
      title: 'Timetable',
      config,
      events,
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  router.get('/next-week', async (req: Request, res: Response) => {
    const language = req.language || i18next.language
    const { user } = res.locals

    const config = {
      content: false,
      header: false,
      postscript: true,
      detailsType: 'small',
      lastWeek: false,
      nextWeek: true,
    }

    const today = new Date(Date.now())
    const fromDate = addDays(today, 7)
    const toDate = addDays(fromDate, 6)

    const events = await Promise.all([
      services.prisonService.getEventsFor(
        user.idToken.booking.id,
        fromDate,
        toDate,
        language,
        user.idToken.sub,
        user.idToken.establishment.agency_id,
      ),
    ])

    await auditService.audit({
      what: AUDIT_EVENTS.VIEW_TIMETABLE,
      idToken: user.idToken,
      details: { fromDate, toDate },
    })

    return res.render('pages/timetable', {
      givenName: user.idToken.given_name,
      title: 'Timetable',
      config,
      events,
      errors: req.flash('errors'),
      message: req.flash('message'),
    })
  })

  return router
}
