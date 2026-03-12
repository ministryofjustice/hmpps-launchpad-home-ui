import rootConfig from '../playwright.config'

export default {
	...rootConfig,
	testDir: './playwright/test/Features/e2e',
}
