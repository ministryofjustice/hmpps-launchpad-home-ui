import { Page, Locator } from '@playwright/test'

export type PageElement = Locator

export default abstract class BasePage {
  constructor(
    protected readonly page: Page,
    private readonly title: string,
  ) {
    // Page verification can be done in specific implementations
  }

  async checkOnPage(): Promise<void> {
    await this.page.locator('h1').filter({ hasText: this.title }).waitFor()
  }

  signOut = (): PageElement => this.page.locator('[data-qa=signOut]')

  manageDetails = (): PageElement => this.page.locator('[data-qa=manageDetails]')
}
