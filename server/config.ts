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
      externalUrl: get('LAUNCHPAD_AUTH_URL', get('LAUNCHPAD_AUTH_URL', 'http://localhost:8080')),
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
  establishments: [
    {
      agencyId: 'BWI',
      prisonerContentHubURL: 'https://berwyn.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://bwiclient.unilink.prisoner.service.justice.gov.uk:1108',
    },
    {
      agencyId: 'CKI',
      prisonerContentHubURL: 'https://cookhamwood.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://ckiclient.unilink.prisoner.service.justice.gov.uk:82',
    },
    {
      agencyId: 'EEI',
      prisonerContentHubURL: 'https://erlestoke.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://eeiclient.unilink.prisoner.service.justice.gov.uk:1118',
    },
    {
      agencyId: 'FYI',
      prisonerContentHubURL: 'https://felthama.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://fyiclient.unilink.prisoner.service.justice.gov.uk:1106',
    },
    {
      agencyId: 'FMI',
      prisonerContentHubURL: 'https://felthamb.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://fmiclient.unilink.prisoner.service.justice.gov.uk:1104',
    },
    {
      agencyId: 'GHI',
      prisonerContentHubURL: 'https://garth.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://ghiclient.unilink.prisoner.service.justice.gov.uk:1120',
    },
    {
      agencyId: 'LHI',
      prisonerContentHubURL: 'https://lindholme.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://lhiclient.unilink.prisoner.service.justice.gov.uk:84',
    },
    {
      agencyId: 'MTI',
      prisonerContentHubURL: 'https://themount.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://mticlient.unilink.prisoner.service.justice.gov.uk:1110',
    },
    {
      agencyId: 'NHI',
      prisonerContentHubURL: 'https://newhall.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://nhiclient.unilink.prisoner.service.justice.gov.uk:96',
    },
    {
      agencyId: 'RNI',
      prisonerContentHubURL: 'https://ranby.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://rniclient.unilink.prisoner.service.justice.gov.uk:1112',
    },
    {
      agencyId: 'SHI',
      prisonerContentHubURL: 'https://stokeheath.content-hub.prisoner.service.justice.gov.uk',
      selfServicekURL: 'https://shiclient.unilink.prisoner.service.justice.gov.uk:1122',
    },
    {
      agencyId: 'SLI',
      prisonerContentHubURL: 'https://swaleside.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://sliclient.unilink.prisoner.service.justice.gov.uk:1116',
    },
    {
      agencyId: 'STI',
      prisonerContentHubURL: 'https://styal.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://sticlient.unilink.prisoner.service.justice.gov.uk:1102',
    },
    {
      agencyId: 'WHI',
      prisonerContentHubURL: 'https://woodhill.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://whiclient.unilink.prisoner.service.justice.gov.uk:1124',
    },
    {
      agencyId: 'WLI',
      prisonerContentHubURL: 'https://wayland.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://wliclient.unilink.prisoner.service.justice.gov.uk:1114',
    },
    {
      agencyId: 'WNI',
      prisonerContentHubURL: 'https://werrington.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://wniclient.unilink.prisoner.service.justice.gov.uk:98',
    },
    {
      agencyId: 'WYI',
      prisonerContentHubURL: 'https://wetherby.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://wyiclient.unilink.prisoner.service.justice.gov.uk:1100',
    },
  ],
}
