import dotenv from 'dotenv'
import { test, expect } from '@playwright/test'
import axe from 'axe-core'
import acceptDataAccessModal from '../../../Framework/utils/acceptDataAccessModal'

dotenv.config()

test.describe('Launchpad Home Page Accessibility @regression', () => {
  test.use({ bypassCSP: true })

  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await acceptDataAccessModal(page)
  })

  test('has no detectable accessibility violations', async ({ page }) => {
    await page.addScriptTag({ path: require.resolve('axe-core') })

    const results = await page.evaluate(async () => {
      return (window as unknown as { axe: typeof axe }).axe.run('#main-content')
    })

    const violationCount = results.violations.length
    if (violationCount > 0) {
      // Include violation details to make failures actionable.
      // eslint-disable-next-line no-console
      console.log(
        results.violations
          .map(violation => {
            const nodes = violation.nodes.map(node => `- ${node.target.join(', ')}\n  ${node.html}`).join('\n')
            return `${violation.id}: ${violation.help}\n${nodes}`
          })
          .join('\n\n'),
      )
    }

    expect(violationCount).toBe(0)
  })
})
