import { addDays, subDays } from 'date-fns'
import { Request, Response, Router } from 'express'
import i18next from 'i18next'

import type { Services } from '../../services'
import { asyncHandler } from '../../middleware/asyncHandler'
import auditPageViewMiddleware from '../../middleware/auditPageViewMiddleware'
import { AUDIT_PAGE_NAMES } from '../../constants/audit'

export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    '/',
    auditPageViewMiddleware(AUDIT_PAGE_NAMES.TIMETABLE),
    asyncHandler(async (req: Request, res: Response) => {
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

      const fromDate = new Date()
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

      return res.render('pages/timetable', {
        givenName: user.idToken.given_name,
        config,
        events,
        errors: req.flash('errors'),
        message: req.flash('message'),
      })
    }),
  )

  router.get(
    '/last-week',
    auditPageViewMiddleware(AUDIT_PAGE_NAMES.TIMETABLE),
    asyncHandler(async (req: Request, res: Response) => {
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

      const today = new Date()
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

      return res.render('pages/timetable', {
        givenName: user.idToken.given_name,
        title: 'Timetable',
        config,
        events,
        errors: req.flash('errors'),
        message: req.flash('message'),
      })
    }),
  )

  router.get(
    '/next-week',
    auditPageViewMiddleware(AUDIT_PAGE_NAMES.TIMETABLE),
    asyncHandler(async (req: Request, res: Response) => {
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

      const today = new Date()
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

      return res.render('pages/timetable', {
        givenName: user.idToken.given_name,
        title: 'Timetable',
        config,
        events,
        errors: req.flash('errors'),
        message: req.flash('message'),
      })
    }),
  )

  return router
}
