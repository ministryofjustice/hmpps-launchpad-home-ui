// Centralized locators for Launchpad Portal UI tests

const launchpadPortalLocators = {
  // Timetable module
  timetableLink: 'a.govuk-link#view-timetable-link[href="/timetable"]',

  // Profile module
  profileTile: 'div.internal-link-tile#internal-link-tile-profile',
  profileLink: 'a[href="/profile"][rel="noreferrer noopener"]',
  profileHeading: 'h2:has-text("Profile")',
  profileDescription: 'p',
}

export default launchpadPortalLocators
