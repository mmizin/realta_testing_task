# Test Execution Reports

Instructions for generating and viewing test reports for both suites.

---

## API Tests (Karate)

### How to Run Tests

```bash
cd backend-tests
mvn test

# Run a specific feature
mvn test -Dtest=TestRunner#testBranding
mvn test -Dtest=TestRunner#testRoom
mvn test -Dtest=TestRunner#testBooking
```

### Generate Test Reports

After running tests (`cd backend-tests && mvn test`), HTML reports are generated at:

```
backend-tests/target/karate-reports/karate-summary.html
```

Open this file in a browser to view detailed test results, execution times, and pass/fail status.

---

## UI Tests (Playwright)

### How to Run Tests

```bash
cd frontend-tests
npm install
npx playwright install chromium   # downloads the browser binary used by tests

# Run the full suite (headless, Chromium)
npm test

# Run a specific spec file
npx playwright test tests/homepage.spec.ts

# Run by tag (e.g. smoke tests only)
npx playwright test --grep @smoke

# Debug interactively with the Playwright UI runner
npm run test:ui

# Run with a visible browser window
npx playwright test --headed
```

### Generate & View Test Reports

The suite is configured with Playwright's built-in HTML reporter. After a run
(`cd frontend-tests && npm test`), an HTML report is written to `frontend-tests/playwright-report/`.

```bash
# Open the most recent HTML report in a browser
npm run report
```

Traces (for failed tests on retry, useful in CI) are saved under `frontend-tests/test-results/`
and can be opened with `npx playwright show-trace <path-to-trace.zip>`.
