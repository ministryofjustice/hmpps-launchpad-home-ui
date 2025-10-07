import { Page } from '@playwright/test'
import BasePage from './page'

export default class AuthManageDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page, 'Your account details')
  }
}
