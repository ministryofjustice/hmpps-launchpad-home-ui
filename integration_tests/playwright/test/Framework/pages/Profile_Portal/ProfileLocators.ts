// Centralized locators for Launchpad Portal UI tests

const ProfileLocators = {
  // Timetable module
  timetableLink: 'a.govuk-link#view-timetable-link[href="/timetable"]',

  // Profile module
  profileTile: 'div.internal-link-tile#internal-link-tile-profile',
  profileLink: 'a[href="/profile"][rel="noreferrer noopener"]',
  profileHeading: 'h2:has-text("Profile")',
  profileDescription: 'p',

  // Profile page - Today's Timetable section
  todayTimetable: 'h2.govuk-heading-m:has-text("Today\'s timetable")',
  timetableContainer: '[data-test="timetable-container"]',
  viewMyTimetableLink: 'a.card__content.govuk-link[href="/timetable"]:has-text("View my timetable")',
  learningSkillsLink: '[data-test="learningSkillsLink"]',

  // Profile page - Account sections (placeholders for existing tests)
  incentivesHeading: 'h2.govuk-heading-m:has-text("Incentives (IEP)")',
  incentivesContainer: '[data-test="incentives-container"]',
  currentLevel: '[data-test="currentLevel"]',
  incentiveLevel: 'h3:has-text("Current level:")',
  incentivesLink: '[data-test="incentivesLink"]',

  // Profile page - Money section
  moneyHeading: 'h2.govuk-heading-m:has-text("Money")',
  transactionsContainer: '[data-test="transactions-container"]',
  accountBalance: 'h2.govuk-heading-m:has-text("Money")',
  moneySpends: '[data-test="money-spends"]',
  transactionsLink: '[data-test="transactions"]',
  moneyLink: '[data-test="moneyLink"]',

  // Money section expandable cards
  spendsSection: 'a[href="/transactions/spends"]:has-text("Spends")',
  spendsCard: 'div.card:has(a[href="/transactions/spends"])',
  spendsExpandBtn: 'div.card:has(a[href="/transactions/spends"]) .card__heading',
  spendsDetails: 'div.card:has(a[href="/transactions/spends"]) .sensitive',

  privateSection: 'a[href="/transactions/private"]:has-text("Private")',
  privateCard: 'div.card:has(a[href="/transactions/private"])',
  privateExpandBtn: 'div.card:has(a[href="/transactions/private"]) .card__heading',
  privateDetails: 'div.card:has(a[href="/transactions/private"]) .sensitive',

  savingsSection: 'a[href="/transactions/savings"]:has-text("Savings")',
  savingsCard: 'div.card:has(a[href="/transactions/savings"])',
  savingsExpandBtn: 'div.card:has(a[href="/transactions/savings"]) .card__heading',
  savingsDetails: 'div.card:has(a[href="/transactions/savings"]) .sensitive',

  // Profile page - Visits section
  visitsSection: 'h2.govuk-heading-m:has-text("Visits")',
  visitsContainer: '[data-test="visits-container"]',
  nextVisitCard: 'h3:has-text("Next visit")',
  visitsLeftCard: 'h3:has-text("Visits I\'ve got left")',
  visitsLink: '[data-test="visitsLink"]',
}

export default ProfileLocators
