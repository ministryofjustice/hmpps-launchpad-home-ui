import { expect, type Locator, type Page as PlaywrightPage } from '@playwright/test'
import launchpadExternalLinksLocators from './launchpadExternalLinksLocators'

type DashboardTile = {
  name: string
  linkSelector: string
  imageSelector: string
  headingSelector: string
  expectedHeading: string
  screenshotPath: string
}

export default class LaunchpadDashboardPage {
  readonly page: PlaywrightPage

  constructor(page: PlaywrightPage) {
    this.page = page
  }

  async open(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'networkidle' })
  }

  private tileLink(selector: string): Locator {
    return this.page.locator(selector).first()
  }

  async assertAndCaptureRequestedTiles(): Promise<void> {
    const requestedTiles: DashboardTile[] = [
      {
        name: 'Self-service',
        linkSelector: launchpadExternalLinksLocators.selfServiceLink,
        imageSelector: launchpadExternalLinksLocators.selfServiceImg,
        headingSelector: launchpadExternalLinksLocators.selfServiceHeading,
        expectedHeading: 'Self-service',
        screenshotPath: 'test_results/self-service-tile.png',
      },
      {
        name: 'Content Hub',
        linkSelector: launchpadExternalLinksLocators.contentHubLink,
        imageSelector: launchpadExternalLinksLocators.contentHubImg,
        headingSelector: launchpadExternalLinksLocators.contentHubHeading,
        expectedHeading: 'Content Hub',
        screenshotPath: 'test_results/content-hub-tile.png',
      },
      {
        name: 'National Prison Radio',
        linkSelector: launchpadExternalLinksLocators.prisonRadioLink,
        imageSelector: launchpadExternalLinksLocators.prisonRadioImg,
        headingSelector: launchpadExternalLinksLocators.prisonRadioHeading,
        expectedHeading: 'National Prison Radio',
        screenshotPath: 'test_results/national-prison-radio-tile.png',
      },
      {
        name: 'PIN Phone',
        linkSelector: launchpadExternalLinksLocators.pinPhoneLink,
        imageSelector: launchpadExternalLinksLocators.pinPhoneImg,
        headingSelector: launchpadExternalLinksLocators.pinPhoneHeading,
        expectedHeading: 'PIN Phone',
        screenshotPath: 'test_results/pin-phone-tile.png',
      },
      {
        name: 'Think Through Nutrition',
        linkSelector: launchpadExternalLinksLocators.thinkThroughNutritionLink,
        imageSelector: launchpadExternalLinksLocators.thinkThroughNutritionImg,
        headingSelector: launchpadExternalLinksLocators.thinkThroughNutritionHeading,
        expectedHeading: 'Think Through Nutrition',
        screenshotPath: 'test_results/think-through-nutrition-tile.png',
      },
    ]

    await Promise.all(
      requestedTiles.map(async tile => {
        const link = this.tileLink(tile.linkSelector)
        await expect(link, `${tile.name} tile should be visible on the dashboard`).toBeVisible()

        const image = link.locator(tile.imageSelector)
        await expect(image, `${tile.name} image should be visible`).toBeVisible()

        const heading = link.locator(tile.headingSelector)
        await expect(heading, `${tile.name} heading should match expected text`).toHaveText(tile.expectedHeading)

        await link.screenshot({ path: tile.screenshotPath })
      }),
    )
  }
}
