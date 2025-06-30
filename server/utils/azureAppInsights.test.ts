import { DataTelemetry, EnvelopeTelemetry } from 'applicationinsights/out/Declarations/Contracts'
import { addUserDataToRequests, ContextObject } from './azureAppInsights'

const user = {
  idToken: {
    establishment: {
      agency_id: 'LII',
    },
    sub: 'test-user',
  },
}

const createEnvelope = (properties: Record<string, string | boolean>, baseType = 'RequestData') =>
  ({
    data: {
      baseType,
      baseData: { properties },
    } as DataTelemetry,
  }) as EnvelopeTelemetry

const createContext = (userObject: object) =>
  ({
    'http.ServerRequest': {
      res: {
        locals: {
          user: userObject,
        },
      },
    },
  }) as ContextObject

const context = createContext(user)

describe('azure-appinsights', () => {
  describe('addUserDataToRequests', () => {
    it('adds user data to properties when present', () => {
      const envelope = createEnvelope({ other: 'things' })

      addUserDataToRequests(envelope, context)

      expect(envelope.data.baseData.properties).toStrictEqual({
        activeCaseLoadId: 'LII',
        other: 'things',
        username: 'test-user',
      })
    })

    it('handles absent user data', () => {
      const envelope = createEnvelope({ other: 'things' })

      addUserDataToRequests(
        envelope,
        createContext({
          idToken: {
            establishment: {
              agency_id: 'LII',
            },
            sub: undefined,
          },
        }),
      )

      expect(envelope.data.baseData.properties).toStrictEqual({ other: 'things' })
    })

    it('returns true when not RequestData type', () => {
      const envelope = createEnvelope({}, 'NOT_REQUEST_DATA')

      const response = addUserDataToRequests(envelope, context)

      expect(response).toStrictEqual(true)
    })

    it('handles when no properties have been set', () => {
      const envelope = createEnvelope(undefined)

      addUserDataToRequests(envelope, context)

      expect(envelope.data.baseData.properties).toStrictEqual({
        activeCaseLoadId: 'LII',
        username: 'test-user',
      })
    })

    it('handles missing user details', () => {
      const envelope = createEnvelope({ other: 'things' })

      addUserDataToRequests(envelope, {
        'http.ServerRequest': {},
      } as ContextObject)

      expect(envelope.data.baseData.properties).toEqual({
        other: 'things',
      })
    })
  })
})
