import { EventsData } from '../../@types/launchpad'

// eslint-disable-next-line import/prefer-default-export
export const eventsSummary: EventsData = {
  isTomorrow: false,
  error: false,
  prisonerEvents: [
    {
      timeString: '10:00 AM',
      description: 'Morning Exercise',
      location: 'Gymnasium',
    },
    {
      timeString: '12:00 PM',
      description: 'Lunch',
      location: 'Cafeteria',
    },
    {
      timeString: '2:00 PM',
      description: 'Educational Program',
      location: 'Classroom A',
    },
  ],
}
