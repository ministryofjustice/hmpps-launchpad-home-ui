import type { Locator, Page as PlaywrightPage } from '@playwright/test'

export type PageElement = Locator

export default abstract class Page {
  protected readonly page: PlaywrightPage

  static verifyOnPage<T>(constructor: new (page: PlaywrightPage) => T, page: PlaywrightPage): T {
    return new constructor(page)
  }

  constructor(
    page: PlaywrightPage,
    private readonly title: string,
  ) {
    this.page = page
    this.checkOnPage().catch(() => {})
  }

  protected async checkOnPage(): Promise<void> {
    await this.page.locator('h1').filter({ hasText: this.title }).waitFor({ state: 'visible' })
  }

  signOut = (): PageElement => this.page.locator('[data-qa=signOut]')

  manageDetails = (): PageElement => this.page.locator('[data-qa=manageDetails]')
}
