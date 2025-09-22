# Playwright Integration Tests

## How to Install, Setup, and Run

### 1. Install Dependencies

Run the following command in your project root:

```bash
npm install
```

### 2. Install Playwright Browsers

Run:

```bash
npx playwright install
```

### 3. Run Playwright Tests

To run all Playwright tests:

```bash
npx playwright test integration_tests/playwright
```

To run a specific test file:

```bash
npx playwright test integration_tests/playwright/health.spec.ts
```

## Running Playwright tests

- To run tests in headed mode (browser UI visible):
  ```sh
  npx playwright test --headed
  ```

- To run tests in headless mode (default, no browser UI):
  ```sh
  npx playwright test
  ```

### 4. Test Structure

- All Playwright tests are located in `integration_tests/playwright/`
- Example test: `health.spec.ts` covers health endpoint scenarios

### 5. Customising Base URL

Edit `playwright.config.ts` to change the `baseURL` for your environment.

---
For more Playwright documentation, see: https://playwright.dev/docs/intro
