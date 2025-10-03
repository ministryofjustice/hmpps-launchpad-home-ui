// Centralized locators for Launchpad UI tests

const launchpadExternalLinksLocators = {
  headerLink:
    'a.launchpad-home-header__link.launchpad-home-header__title__service-name.govuk-!-font-weight-bold[href="/"]',
  timetableLink: 'a.govuk-link#view-timetable-link[href="/timetable"]',
  profileTile: 'div.internal-link-tile#internal-link-tile-profile',
  profileLink: 'a[href="/profile"][rel="noreferrer noopener"]',
  profileHeading: 'h2.govuk-!-font-size-24.govuk-!-margin-top-0',
  profileDescription: 'p',
  contentHubLink: 'a[href="/external/content-hub"][rel="noreferrer noopener"][target="_blank"]',
  contentHubImg: 'img[alt="link tile image"]',
  contentHubHeading: 'h3.govuk-heading-m',
  contentHubDescription: 'p.govuk-body',
  prisonRadioLink: 'a[href="/external/prison-radio"][rel="noreferrer noopener"][target="_blank"]',
  prisonRadioImg: 'img[alt="link tile image"]',
  prisonRadioHeading: 'h3.govuk-heading-m',
  prisonRadioDescription: 'p.govuk-body',
  insideTimeLink: 'a[href="/external/inside-time"][rel="noreferrer noopener"][target="_blank"]',
  insideTimeImg: 'img[alt="link tile image"]',
  insideTimeHeading: 'h3.govuk-heading-m',
  insideTimeDescription: 'p.govuk-body',
}
export default launchpadExternalLinksLocators
