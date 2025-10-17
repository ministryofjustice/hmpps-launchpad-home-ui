// Centralized locators for Timetable Portal UI tests

const TimetableLocators = {
  // Main timetable container
  timetableDayContainer: '.govuk-width-container.govuk-body.timetable-day[data-test="timetable-day-data"]',

  // Timetable navigation
  timetableNav: '.timetable-nav',
  lastWeekLink: '.timetable-nav a[href="/timetable/last-week"]',
  thisWeekLink: '.timetable-nav a[href="/timetable"]',
  nextWeekSpan: '.timetable-nav span',

  // Date headers - dynamic selectors
  dateHeaders: '[data-test="date"]',
  todayHeader: 'h3[data-test="date"]:has-text("Today")',
  firstDateHeader: 'h3[data-test="date"]:first-of-type',
  secondDateHeader: 'h3[data-test="date"]:nth-of-type(2)',
  thirdDateHeader: 'h3[data-test="date"]:nth-of-type(3)',
  fourthDateHeader: 'h3[data-test="date"]:nth-of-type(4)',
  fifthDateHeader: 'h3[data-test="date"]:nth-of-type(5)',

  // Day blocks - dynamic selectors
  timetableDayBlocks: '.timetable-day-blocks',
  todayDayBlocks: '[data-test="Today"]',
  firstDayBlocks: '.timetable-day-blocks:first-of-type',
  secondDayBlocks: '.timetable-day-blocks:nth-of-type(2)',
  thirdDayBlocks: '.timetable-day-blocks:nth-of-type(3)',
  fourthDayBlocks: '.timetable-day-blocks:nth-of-type(4)',
  fifthDayBlocks: '.timetable-day-blocks:nth-of-type(5)',

  // Time period blocks
  morningTimeSlot: '[data-test="8.30am to 12.00pm"]',
  afternoonTimeSlot: '[data-test="12.00pm to 5.00pm"]',
  eveningTimeSlot: '[data-test="5.00pm to 7.30pm"]',

  // Day block status
  dayBlockFinished: '.day-block-finished',
  dayBlockRegular: '.govuk-body:not(.day-block-finished)',

  // Individual activity elements
  timetableTime: '.timetable-time',
  timetableDescription: '.timetable-desc',
  activityTitle: '.timetable-desc strong',
  activityLocation: '.timetable-desc',

  // Dynamic day selectors by position
  nthDateHeader: (n: number) => `h3[data-test="date"]:nth-of-type(${n})`,
  nthDayBlocks: (n: number) => `.timetable-day-blocks:nth-of-type(${n})`,

  // Flexible day selectors - for when you need to match partial text
  dayHeaderContaining: (text: string) => `h3[data-test="date"]:has-text("${text}")`,
  dayBlocksContaining: (text: string) => `[data-test*="${text}"]`,

  // Time-based activity selectors
  morningActivities: '[data-test="Today"] [data-test="8.30am to 12.00pm"]',
  afternoonActivities: '[data-test="Today"] [data-test="12.00pm to 5.00pm"]',
  eveningActivities: '[data-test="Today"] [data-test="5.00pm to 7.30pm"]',

  // Activity content selectors
  higherFuncSkillsActivities: '.timetable-desc:has-text("HIGHER FUNC. SKILLS")',
  gymActivities: '.timetable-desc:has-text("GYM")',
  cleaningActivities: '.timetable-desc:has-text("ED CLEANING ORD.")',

  // Specific activity selectors for better targeting
  todayGymActivities: '[data-test="Today"] .timetable-desc:has-text("GYM")',
  todayHigherFuncSkills: '[data-test="Today"] .timetable-desc:has-text("HIGHER FUNC. SKILLS")',
  todayCleaningActivities: '[data-test="Today"] .timetable-desc:has-text("ED CLEANING ORD.")',

  // Dynamic activity selectors by day position
  nthDayGymActivities: (n: number) => `.timetable-day-blocks:nth-of-type(${n}) .timetable-desc:has-text("GYM")`,
  nthDayHigherFuncSkills: (n: number) =>
    `.timetable-day-blocks:nth-of-type(${n}) .timetable-desc:has-text("HIGHER FUNC. SKILLS")`,
  nthDayCleaningActivities: (n: number) =>
    `.timetable-day-blocks:nth-of-type(${n}) .timetable-desc:has-text("ED CLEANING ORD.")`,

  // Helper functions for dynamic date handling
  getDateForDaysFromNow: (daysFromNow: number) => {
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow)
    return date
  },

  formatDateForSelector: (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const dayName = days[date.getDay()]
    const day = date.getDate()
    const month = months[date.getMonth()]
    return `${dayName} ${day} ${month}`
  },
}

export default TimetableLocators
