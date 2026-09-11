import { expect, type Locator, type Page as PlaywrightPage } from '@playwright/test'
import TransactionsLocators from './TransactionsLocators'

export default class TransactionsPage {
  readonly page: PlaywrightPage

  readonly title: Locator

  readonly balance: Locator

  readonly table: Locator

  constructor(page: PlaywrightPage) {
    this.page = page
    this.title = page.locator(TransactionsLocators.pageTitle)
    this.balance = page.locator(TransactionsLocators.balance)
    this.table = page.locator(TransactionsLocators.table)
  }

  async open(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'networkidle' })
  }

  async expectTitle(expected: string): Promise<void> {
    await this.title.waitFor({ state: 'visible' })
    await expect(this.title).toHaveText(expected)
  }

  async expectBalance(expected: string): Promise<void> {
    await this.balance.waitFor({ state: 'visible' })
    await expect(this.balance).toHaveText(expected)
  }

  async expectTableContains(...values: string[]): Promise<void> {
    await Promise.all(values.map(value => expect(this.table).toContainText(value)))
  }
}
