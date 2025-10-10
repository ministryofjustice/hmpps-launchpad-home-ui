# Playwright E2E Testing

This directory contains Playwright end-to-end tests with support for multiple environments.

## Environment Setup

Set up your `.env` file in the project root with the required environment variables:

```bash
# Authentication (required)
MS_USERNAME=your-test-account@justice.gov.uk
MS_PASSWORD=your-secure-password

# Environment-specific URLs (optional - defaults to localhost:3000)
TEST_INGRESS_URL=http://localhost:3000
DEV_INGRESS_URL=
STAGING_INGRESS_URL=
```

## Local Development Testing

For local testing, start the required services:

```bash
# Start test dependencies
docker-compose -f docker-compose-test.yml up

# Start the server in test mode
npm run start-feature
```

Then run Playwright tests:

```bash
# Run all tests locally
npx playwright test

# Run specific test file
npx playwright test integration_tests/playwright/test/Features/e2e/healthcheck/health-stub.spec.ts

# Run with different reporters
npx playwright test --reporter=html
npx playwright test --reporter=line
```

## Multi-Environment Testing

Run tests against different environments using the `TEST_ENV` variable:

```bash
# Test against DEV environment
TEST_ENV=dev npx playwright test

# Test against STAGING environment
TEST_ENV=staging npx playwright test

# Run specific test against staging
TEST_ENV=staging npx playwright test integration_tests/playwright/test/Features/e2e/healthcheck/health-stub.spec.ts --reporter=line
```

## Test Structure

```
playwright/
├── test/
│   ├── Features/
│   │   └── e2e/
│   │       ├── healthcheck/          # Basic connectivity tests
│   │       ├── Launchpad_e2e/        # Main portal functionality
│   │       ├── Profile_e2e/          # Profile management tests
│   │       └── Timetable_e2e/        # Schedule and timetable tests
│   ├── pages/                        # Page object models
│   │   ├── Launchpad_Portal/         # Launchpad locators and actions
│   │   ├── Profile_Portal/           # Profile locators and actions
│   │   └── Timetable_Portal/         # Timetable locators and actions
│   └── mockApis/                     # API mocking utilities
└── README.md                         # This file
```

## Test Coverage

The test suite includes:

### Health Checks
- Basic connectivity and authentication
- Environment-specific URL resolution
- Microsoft SSO integration

### Profile Functionality
- User profile management and navigation
- Profile data display and interaction
- Cross-portal navigation from profile

### Timetable Features
- Schedule viewing and dynamic content
- Date-based navigation and filtering
- Dynamic content handling with position-based selectors

### Navigation Testing
- Cross-portal navigation and routing
- Link validation and accessibility
- Page load performance and reliability

### External Links Integration
- Integration with external services
- Link validation and target verification
- External service connectivity

## Dynamic Content Handling

The tests use sophisticated dynamic content handling:

- **Position-based selectors** for flexible content matching
- **Date calculations** for timetable navigation
- **Content-agnostic assertions** for varying data
- **Retry mechanisms** for async content loading

## CircleCI Integration

Tests can be triggered in CircleCI with environment selection:

### Manual Trigger
1. Go to CircleCI Dashboard → Your Project → "Trigger Pipeline"
2. Add Parameters:
   ```json
   {
     "test-environment": "dev"
   }
   ```
   or
   ```json
   {
     "test-environment": "staging"
   }
   ```

### Required CircleCI Environment Variables

Set these in your CircleCI project contexts or environment variables:

```bash
# Authentication
MS_USERNAME=your-test-account
MS_PASSWORD=your-password

# Environment URLs
DEV_INGRESS_URL=https://launchpad-home-dev.hmpps.service.justice.gov.uk
STAGING_INGRESS_URL=https://launchpad-home-staging.hmpps.service.justice.gov.uk

# Fallback
INGRESS_URL=http://localhost:3000
```

## Configuration Files

- **`playwright.config.ts`** - Main Playwright configuration with environment URL resolution
- **`support/playwright.global-setup.js`** - Global setup with Microsoft authentication and environment logging
- **`.env`** - Local environment variables (not committed to git)

## Best Practices

1. **Environment Variables**: Always use environment variables for sensitive data
2. **Page Objects**: Use centralized locators in the `pages/` directory
3. **Dynamic Selectors**: Prefer position-based and content-agnostic selectors
4. **Error Handling**: Include proper wait conditions and retry mechanisms
5. **Logging**: Use the enhanced logging to debug environment issues

## Troubleshooting

### Common Issues

1. **Authentication Failures**: Verify `MS_USERNAME` and `MS_PASSWORD` are set correctly
2. **Environment Resolution**: Check the console logs for environment URL resolution
3. **Dynamic Content**: Use position-based selectors for varying content
4. **Network Issues**: Increase timeout values for slower environments

### Debug Commands

```bash
# Run with debug output
DEBUG=pw:api npx playwright test

# Run in headed mode for visual debugging
npx playwright test --headed

# Generate test report
npx playwright test --reporter=html
```

## Contributing

When adding new tests:

1. Use the existing page object patterns
2. Add appropriate locators to the relevant `*Locators.ts` files
3. Follow the established directory structure
4. Include both positive and negative test cases
5. Ensure tests work across all target environments