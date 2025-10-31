# Regression Tests Configuration

## Overview

UI regression tests are tagged with `@regression` and can be controlled via the `REGRESSION` environment variable or GitHub Actions workflow inputs.

## Test Categories

### Healthcheck Tests (Always Run)
- Located in: `integration_tests/playwright/test/Features/e2e/healthcheck/`
- **3 tests** that verify system health endpoints
- Run by default in all environments

### UI Regression Tests (@regression)
- Located in: `integration_tests/playwright/test/Features/e2e/`
- **43 tests** covering UI functionality
- Disabled by default, must be explicitly enabled
- Tagged with `@regression` in test descriptions

## Running Tests Locally

### Run only healthcheck tests (default)
```bash
npm run int-test
```

### Run only UI regression tests
```bash
REGRESSION=true npm run int-test
```

### Run specific regression test file
```bash
REGRESSION=true npm run int-test -- integration_tests/playwright/test/Features/e2e/Profile_e2e/launchpad_profile.spec.ts
```

## CI/CD Configuration

### Default Behavior
By default, **only healthcheck tests run in CI** (UI tests are disabled).

### Enabling UI Tests in CI

#### Option 1: Manual Workflow Dispatch
1. Go to GitHub Actions
2. Select "Integration tests" workflow
3. Click "Run workflow"
4. Check the "Enable UI regression tests" option

#### Option 2: Enable for Specific Branch
Edit `.github/workflows/pipeline.yml`:

```yaml
node_integration_tests:
  name: node integration tests
  uses: ./.github/workflows/node_integration_tests_redis.yml
  needs: [node_build]
  secrets: inherit
  with:
    run_regression_tests: true  # Enable UI tests
```

#### Option 3: Conditional Based on Branch
Edit `.github/workflows/pipeline.yml`:

```yaml
node_integration_tests:
  name: node integration tests
  uses: ./.github/workflows/node_integration_tests_redis.yml
  needs: [node_build]
  secrets: inherit
  with:
    # Enable regression tests only on main branch
    run_regression_tests: ${{ github.ref == 'refs/heads/main' }}
```

## Test Files with @regression Tag

### Launchpad Tests
- `launchpad_webapp.spec.ts` - Main web app functionality
- `launchpad_contenthub.spec.ts` - Content Hub integration
- `launchpad_InsideTime.spec.ts` - Inside Time module
- `launchpad_NationalPrisonRadio.spec.ts` - National Prison Radio
- `launchpad_Timetable.spec.ts` - Timetable events
- `login_webapp.spec.ts` - SSO login

### Profile Tests
- `launchpad_profile.spec.ts` - User profile functionality

### Timetable Tests
- `timetable_e2e.spec.ts` - Timetable functionality
- `timetable_navigation_grid.spec.ts` - Timetable navigation
- `profiles_timetable.spec.ts` - Profile timetable view

### Transaction Tests
- `Transactions.spec.ts` - Transaction functionality

## Configuration Files

### playwright.config.ts
Controls test filtering based on `REGRESSION` environment variable:
```typescript
grep: process.env.REGRESSION === 'true' ? /@regression/ : undefined,
grepInvert: process.env.REGRESSION === 'true' ? undefined : /@regression/,
```

### Workflow Files
- `.github/workflows/node_integration_tests_redis.yml` - Main test workflow
- `.github/workflows/pipeline.yml` - Main pipeline that calls test workflow

## Why This Setup?

1. **Fast CI by default** - Only 3 healthcheck tests run, completing in seconds
2. **Flexibility** - UI tests can be enabled when needed
3. **Cost-effective** - Reduces CI minutes by not running 43 UI tests on every commit
4. **Debugging** - UI tests can be run locally or manually triggered in CI when investigating issues

## Future Considerations

- Consider enabling UI tests for releases or specific branches
- Add scheduled runs of UI tests (e.g., nightly)
- Create separate test suites for smoke tests vs full regression
