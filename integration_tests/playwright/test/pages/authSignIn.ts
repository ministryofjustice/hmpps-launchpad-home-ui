import { Page } from '@playwright/test'
import BasePage from './page'

export default class AuthSignInPage extends BasePage {
  constructor(page: Page) {
    super(page, 'Sign in')
  }
}
