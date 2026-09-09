import dotenv from 'dotenv'
import { test } from '../../../Framework/utils/authenticatedTest'
import LaunchpadDashboardPage from '../../../Framework/pages/LaunchPad_Portal/LaunchpadDashboardPage'
import acceptDataAccessModal from '../../../Framework/utils/acceptDataAccessModal'

dotenv.config()

test.describe('Launchpad Dashboard Tile Capture @regression', () => {
  test.beforeEach(async ({ page }) => {
    const launchpadDashboardPage = new LaunchpadDashboardPage(page)
    await launchpadDashboardPage.open()
    await acceptDataAccessModal(page)
  })

  test('Capture Pin Phone, National Prison Radio, Self-service, Content Hub and Think Through Nutrition tiles', async ({
    page,
  }) => {
    const launchpadDashboardPage = new LaunchpadDashboardPage(page)
    await launchpadDashboardPage.assertAndCaptureRequestedTiles()
  })
})
