// Centralized locators for Launchpad Portal UI tests

const launchpadPortalLocators = {
  // Timetable module
  timetableLink: 'a.govuk-link#view-timetable-link[href="/timetable"]',

  // Profile module
  profileTile: 'div.internal-link-tile#internal-link-tile-profile',
  profileLink: 'a[href="/profile"][rel="noreferrer noopener"]',
  profileHeading: 'h2:has-text("Profile")',
  profileDescription: 'p',

  // Events summary section
  eventsSummaryWrapper: '#events-summary-wrapper',
  eventsSummary: '.events-summary.govuk-\\!-padding-4',
  todaysEventsHeading: 'h2.govuk-heading-s:has-text("Today\'s events")',
  eventDetails: '.event-details',
  eventDetail1: '[data-test="event-detail-1"]',
  eventDetail2: '[data-test="event-detail-2"]',
  eventDetail3: '[data-test="event-detail-3"]',
  eventDetail4: '[data-test="event-detail-4"]',
  eventDetail5: '[data-test="event-detail-5"]',
  eventTime: '.event-details .time',
  eventDescription: '.event-details .description',

  // Profile page - Today's Timetable section
  todayTimetable: 'h2.govuk-heading-m:has-text("Today\'s timetable")',
  timetableContainer: '[data-test="timetable-container"]',
  viewMyTimetableLink: 'a.card__content.govuk-link[href="/timetable"]:has-text("View my timetable")',
  learningSkillsLink: '[data-test="learningSkillsLink"]',

  // Profile page - Visits section
  visitsSection: 'h2.govuk-heading-m:has-text("Visits")',
  visitsContainer: '[data-test="visits-container"]',
  nextVisitCard: 'h3:has-text("Next visit")',
  visitsLeftCard: 'h3:has-text("Visits I\'ve got left")',
  visitsLink: '[data-test="visitsLink"]',
}

export default launchpadPortalLocators
