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

const serviceName = 'hmpps-launchpad-home-ui'

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
      systemClientId: get('SYSTEM_CLIENT_ID', 'clientid', requiredInProduction),
      systemClientSecret: get('SYSTEM_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    launchpadAuth: {
      url: get('LAUNCHPAD_AUTH_URL', 'http://localhost:8080', requiredInProduction),
      externalUrl: get('LAUNCHPAD_AUTH_URL', 'http://localhost:8080'),
      timeout: {
        response: Number(get('LAUNCHPAD_AUTH_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('LAUNCHPAD_AUTH_TIMEOUT_DEADLINE', 10000)),
      },
      refreshCheckTimeInMinutes: Number(get('REFRESH_CHECK_TIMEOUT_IN_MINUTES', 5, requiredInProduction)),
      agent: new AgentConfig(Number(get('LAUNCHPAD_AUTH_TIMEOUT_RESPONSE', 10000))),
      apiClientId: get('LAUNCHPAD_API_CLIENT_ID', 'clientid', requiredInProduction),
      apiClientSecret: get('LAUNCHPAD_API_CLIENT_SECRET', 'clientsecret', requiredInProduction),
      scopes: [
        {
          type: 'user.basic.read',
          accessGranted: 'Grants permission to read basic user information like firstName and lastName.',
          permittedImplicitly: true,
          humanReadableDescription: 'Your name',
        },
        {
          type: 'user.establishment.read',
          accessGranted: 'Grants permission to read details about the establishment or prison the user is located.',
          permittedImplicitly: false,
          humanReadableDescription: 'Details of your prison',
        },
        {
          type: 'user.booking.read',
          accessGranted: 'Grants permission to read the booking details of the user.',
          permittedImplicitly: false,
          humanReadableDescription: 'Prison booking details',
        },
        {
          type: 'user.clients.read',
          accessGranted: 'Grants permission to read information about clients that a user has approved.',
          permittedImplicitly: false,
          humanReadableDescription: "Apps you've allowed access to",
        },
        {
          type: 'user.clients.delete',
          accessGranted: 'Grants permission to delete clients that a user has approved.',
          permittedImplicitly: false,
          humanReadableDescription: "Apps you've removed access to",
        },
      ],
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
    incentives: {
      url: get('INCENTIVES_API_URL', 'http://localhost:8080', requiredInProduction),
      timeout: {
        response: Number(get('PRISONER_DETAILS_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('PRISONER_DETAILS_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('PRISONER_DETAILS_API_TIMEOUT_RESPONSE', 10000))),
    },
    adjudications: {
      url: get('ADJUDICATIONS_API_URL', 'http://localhost:8080', requiredInProduction),
      timeout: {
        response: Number(get('PRISONER_DETAILS_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('PRISONER_DETAILS_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('PRISONER_DETAILS_API_TIMEOUT_RESPONSE', 10000))),
    },
    prisonerContactRegistry: {
      url: get('PRISONER_CONTACT_REGISTRY_API_URL', 'http://localhost:8080', requiredInProduction),
      timeout: {
        response: Number(get('PRISONER_DETAILS_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('PRISONER_DETAILS_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('PRISONER_DETAILS_API_TIMEOUT_RESPONSE', 10000))),
    },
    location: {
      url: get('LOCATION_API_URL', 'http://localhost:8080', requiredInProduction),
      timeout: {
        response: Number(get('PRISONER_DETAILS_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('PRISONER_DETAILS_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('PRISONER_DETAILS_API_TIMEOUT_RESPONSE', 10000))),
    },
    nomisMapping: {
      url: get('NOMIS_MAPPING_API_URL', 'http://localhost:8080', requiredInProduction),
      timeout: {
        response: Number(get('PRISONER_DETAILS_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('PRISONER_DETAILS_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('PRISONER_DETAILS_API_TIMEOUT_RESPONSE', 10000))),
    },
    audit: {
      enabled: get('AUDIT_ENABLED', 'false', requiredInProduction),
      serviceName: get('AUDIT_SERVICE_NAME', serviceName, requiredInProduction),
    },
  },
  domain: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
  establishments: [
    {
      agencyId: 'BNI',
      prisonerContentHubURL: 'https://bullingdon.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://bniclient.unilink.prisoner.service.justice.gov.uk:1128',
      hideThinkThroughNutrition: true,
    },
    {
      agencyId: 'BWI',
      prisonerContentHubURL: 'https://berwyn.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://bwiclient.unilink.prisoner.service.justice.gov.uk:1108',
      hideHomepageEventsSummaryAndProfileLinkTile: true,
      hideThinkThroughNutrition: false,
    },
    {
      agencyId: 'CDI',
      prisonerContentHubURL: 'https://chelmsford.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://cdiclient.unilink.prisoner.service.justice.gov.uk:1126',
      hideThinkThroughNutrition: true,
    },
    {
      agencyId: 'CFI',
      prisonerContentHubURL: 'https://cardiff.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://cficlient.unilink.prisoner.service.justice.gov.uk:1132',
      hideThinkThroughNutrition: true,
    },
    {
      agencyId: 'CKI',
      prisonerContentHubURL: 'https://cookhamwood.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://ckiclient.unilink.prisoner.service.justice.gov.uk:82',
      hideThinkThroughNutrition: true,
    },
    {
      agencyId: 'EEI',
      prisonerContentHubURL: 'https://erlestoke.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://eeiclient.unilink.prisoner.service.justice.gov.uk:1118',
      hideThinkThroughNutrition: true,
    },
    {
      agencyId: 'FYI',
      prisonerContentHubURL: 'https://felthama.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://fyiclient.unilink.prisoner.service.justice.gov.uk:1106',
      hideThinkThroughNutrition: true,
    },
    {
      agencyId: 'FMI',
      prisonerContentHubURL: 'https://felthamb.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://fmiclient.unilink.prisoner.service.justice.gov.uk:1104',
      hideThinkThroughNutrition: true,
    },
    {
      agencyId: 'GHI',
      prisonerContentHubURL: 'https://garth.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://ghiclient.unilink.prisoner.service.justice.gov.uk:1120',
      hideThinkThroughNutrition: true,
    },
    {
      agencyId: 'LHI',
      prisonerContentHubURL: 'https://lindholme.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://lhiclient.unilink.prisoner.service.justice.gov.uk:84',
      hideThinkThroughNutrition: true,
    },
    {
      agencyId: 'MTI',
      prisonerContentHubURL: 'https://themount.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://mticlient.unilink.prisoner.service.justice.gov.uk:1110',
      hideThinkThroughNutrition: true,
    },
    {
      agencyId: 'NHI',
      prisonerContentHubURL: 'https://newhall.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://nhiclient.unilink.prisoner.service.justice.gov.uk:96',
      hideThinkThroughNutrition: false,
    },
    {
      agencyId: 'RNI',
      prisonerContentHubURL: 'https://ranby.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://rniclient.unilink.prisoner.service.justice.gov.uk:1112',
      hideThinkThroughNutrition: true,
    },
    {
      agencyId: 'SHI',
      prisonerContentHubURL: 'https://stokeheath.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://shiclient.unilink.prisoner.service.justice.gov.uk:1122',
      hideThinkThroughNutrition: true,
    },
    {
      agencyId: 'SLI',
      prisonerContentHubURL: 'https://swaleside.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://sliclient.unilink.prisoner.service.justice.gov.uk:1116',
      hideThinkThroughNutrition: true,
    },
    {
      agencyId: 'STI',
      prisonerContentHubURL: 'https://styal.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://sticlient.unilink.prisoner.service.justice.gov.uk:1102',
      hideThinkThroughNutrition: false,
    },
    {
      agencyId: 'WHI',
      prisonerContentHubURL: 'https://woodhill.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://whiclient.unilink.prisoner.service.justice.gov.uk:1124',
      hideThinkThroughNutrition: true,
    },
    {
      agencyId: 'WLI',
      prisonerContentHubURL: 'https://wayland.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://wliclient.unilink.prisoner.service.justice.gov.uk:1114',
      hideThinkThroughNutrition: false,
    },
    {
      agencyId: 'WNI',
      prisonerContentHubURL: 'https://werrington.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://wniclient.unilink.prisoner.service.justice.gov.uk:98',
      hideThinkThroughNutrition: true,
    },
    {
      agencyId: 'WYI',
      prisonerContentHubURL: 'https://wetherby.content-hub.prisoner.service.justice.gov.uk',
      selfServiceURL: 'https://wyiclient.unilink.prisoner.service.justice.gov.uk:1100',
      hideThinkThroughNutrition: true,
    },
  ],
  contentHubUrls: {
    prisonRadio: 'tags/785',
    adjudications: 'content/4193',
    incentives: 'tags/1417',
    learningAndSkills: 'tags/1341',
    moneyAndDebt: 'tags/872',
    visits: 'tags/1133',
    privacyPolicy: 'content/4856',
    transactionsHelp: 'content/8534',
  },
  externalUrls: {
    insideTime: 'https://insidetimeprison.org/',
    thinkThroughNutrition: 'https://lanah.org/hmpps',
  },
  analytics: {
    // use staging GA4 tag as fallback
    ga4SiteId: get('GA4_SITE_ID', 'G-4VW039LBEF', requiredInProduction),
  },
}
