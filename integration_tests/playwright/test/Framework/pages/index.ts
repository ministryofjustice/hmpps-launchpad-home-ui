import type { Locator, Page as PlaywrightPage } from '@playwright/test'
import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor(page: PlaywrightPage) {
    super(page, 'This site is under construction...')
  }

  headerUserName = (): PageElement => this.page.locator('[data-qa=header-user-name]')

  courtRegisterLink = (): PageElement => this.page.locator('[href="/court-register"]')

  override signOut = (): Locator => this.page.locator('[data-qa=signOut]')
}
