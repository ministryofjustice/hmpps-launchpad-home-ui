const production = process.env.NODE_ENV === 'production'

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

export class AgentConfig {
  timeout: number

  constructor(timeout = 8000) {
    this.timeout = timeout
  }
}

export interface ApiConfig {
  url: string
  timeout: {
    response: number
    deadline: number
  }
  agent: AgentConfig
}

export default {
  production,
  https: production,
  staticResourceCacheDuration: '1h',
  redis: {
    host: get('REDIS_HOST', 'localhost', requiredInProduction),
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
  },
  apis: {
    hmppsAuth: {
      url: get('HMPPS_AUTH_URL', 'http://localhost:9090/auth', requiredInProduction),
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://localhost:9090/auth')),
      timeout: {
        response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('HMPPS_AUTH_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000))),
      apiClientId: get('API_CLIENT_ID', 'clientid', requiredInProduction),
      apiClientSecret: get('API_CLIENT_SECRET', 'clientsecret', requiredInProduction),
      systemClientId: get('SYSTEM_CLIENT_ID', 'clientid', requiredInProduction),
      systemClientSecret: get('SYSTEM_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    launchpadAuth: {
      url: get('LAUNCHPAD_AUTH_URL', 'http://localhost:8080', requiredInProduction),
      externalUrl: get('LAUNCHPAD_AUTH_EXTERNAL_URL', get('LAUNCHPAD_AUTH_URL', 'http://localhost:8080')),
      timeout: {
        response: Number(get('LAUNCHPAD_AUTH_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('LAUNCHPAD_AUTH_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('LAUNCHPAD_AUTH_TIMEOUT_RESPONSE', 10000))),
      apiClientId: get('API_CLIENT_ID', 'clientid', requiredInProduction),
      apiClientSecret: get('API_CLIENT_SECRET', 'clientsecret', requiredInProduction),
      systemClientId: get('SYSTEM_CLIENT_ID', 'clientid', requiredInProduction),
      systemClientSecret: get('SYSTEM_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    tokenVerification: {
      url: get('TOKEN_VERIFICATION_API_URL', 'http://localhost:8100', requiredInProduction),
      timeout: {
        response: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000))),
      enabled: get('TOKEN_VERIFICATION_ENABLED', 'false') === 'true',
    },
    prison: {
      url: get('PRISON_API_URL', 'http://localhost:8080', requiredInProduction),
      timeout: {
        response: Number(get('PRISONER_DETAILS_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('PRISONER_DETAILS_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('PRISONER_DETAILS_API_TIMEOUT_RESPONSE', 10000))),
    },
  },
  domain: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
  establishments: {
    BWI: {
      agencyId: 'BWI',
      name: 'berwyn',
      displayName: 'HMP Berwyn',
      youth: false,
    },
    WLI: {
      agencyId: 'WLI',
      name: 'wayland',
      displayName: 'HMP Wayland',
      youth: false,
    },
    CKI: {
      agencyId: 'CKI',
      name: 'cookhamwood',
      displayName: 'HMYOI Cookham Wood',
      youth: true,
    },
    EEI: {
      agencyId: 'EEI',
      name: 'erlestoke',
      displayName: 'HMP Erlestoke',
      youth: false,
    },
    GHI: {
      agencyId: 'GHI',
      name: 'garth',
      displayName: 'HMP Garth',
      youth: false,
    },
    LHI: {
      agencyId: 'LHI',
      name: 'lindholme',
      displayName: 'HMYOI Lindholme',
      youth: true,
    },
    NHI: {
      agencyId: 'NHI',
      name: 'newhall',
      displayName: 'HMPYOI New Hall',
      youth: true,
    },
    RNI: {
      agencyId: 'RNI',
      name: 'ranby',
      displayName: 'HMP Ranby',
      youth: false,
    },
    SHI: {
      agencyId: 'SHI',
      name: 'stokeheath',
      displayName: 'HMPYOI Stoke Heath',
      youth: true,
    },
    STI: {
      agencyId: 'STI',
      name: 'styal',
      displayName: 'HMPYOI Styal',
      youth: true,
    },
    SLI: {
      agencyId: 'SLI',
      name: 'swaleside',
      displayName: 'HMP Swaleside',
      youth: false,
    },
    MTI: {
      agencyId: 'MTI',
      name: 'themount',
      displayName: 'HMP The Mount',
      youth: false,
    },
    FYI: {
      agencyId: 'FYI',
      name: 'felthama',
      displayName: 'HMYOI Feltham A',
      youth: true,
    },
    FMI: {
      agencyId: 'FMI',
      name: 'felthamb',
      displayName: 'HMYOI Feltham B',
      youth: true,
    },
    WNI: {
      agencyId: 'WNI',
      name: 'werrington',
      displayName: 'HMYOI Werrington',
      youth: true,
    },
    WYI: {
      agencyId: 'WYI',
      name: 'wetherby',
      displayName: 'HMYOI Wetherby',
      youth: true,
    },
  },
}
