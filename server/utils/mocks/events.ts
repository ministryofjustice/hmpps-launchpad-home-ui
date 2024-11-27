import { EventsData } from '../../@types/launchpad'

// eslint-disable-next-line import/prefer-default-export
export const eventsSummary: EventsData = {
  isTomorrow: false,
  error: false,
  prisonerEvents: [
    {
      timeString: '8:30am to 11:45am',
      description: 'Morning Exercise',
      location: 'Gymnasium',
    },
    {
      timeString: '1:45pm to 4:45pm',
      description: 'Lunch',
      location: 'Cafeteria',
    },
    {
      timeString: '6:30pm to 7:45pm',
      description: 'Educational Program',
      location: 'Classroom A',
    },
  ],
}
