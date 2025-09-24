import { Page } from '@playwright/test'
import BasePage, { PageElement } from './page'

export default class IndexPage extends BasePage {
  constructor(page: Page) {
    super(page, 'This site is under construction...')
  }

  headerUserName = (): PageElement => this.page.locator('[data-qa=header-user-name]')

  courtRegisterLink = (): PageElement => this.page.locator('[href="/court-register"]')
}
