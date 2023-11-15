import config from '../config'

export default function generateOauthClientToken(
  clientId: string = config.apis.launchpadAuth.apiClientId,
  clientSecret: string = config.apis.launchpadAuth.apiClientSecret,
): string {
  const token = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  return `Basic ${token}`
}
