# realta_testing_task

SDET technical challenge for Shady Meadows B&B — automated testing of both the API layer (Karate DSL) and the web UI (Playwright).

**Target system under test:** https://automationintesting.online/

See [REPORTING.md](./REPORTING.md) for instructions on generating and viewing test execution reports.

---

## Part 1: API Automation (Karate DSL)

### Requirements

Before running the API tests, ensure the following are installed:

- **Java Development Kit (JDK) 17 or higher**
  - Verify: `java -version`
  - Download: https://adoptium.net/ or https://www.oracle.com/java/technologies/downloads/

- **Apache Maven 3.6.0 or higher**
  - Verify: `mvn -version`
  - Download: https://maven.apache.org/download.cgi
  - Installation guide: https://maven.apache.org/install.html

- **Karate Framework 1.4.1** (automatically managed by Maven)

### Project Structure

```
backend-tests/
├── pom.xml                          # Maven project configuration
├── openapi.yaml                     # OpenAPI specification for the API
├── src/test/java/
│   ├── TestRunner.java              # Test runner class that orchestrates feature files
│   ├── karate-config.js            # Global Karate configuration
│   ├── branding/
│   │   └── branding.feature        # Branding endpoint tests
│   ├── room/
│   │   └── room.feature            # Room endpoint tests
│   ├── booking/
│   │   └── booking.feature         # Booking endpoint tests
│   └── utils/
│       ├── data-validation.js      # Shared validation utilities
│       └── date-helper.js          # Shared date-generation utilities
└── target/                          # Build output (generated)
```

### How to Run Tests

#### Run All Tests

```bash
cd backend-tests
mvn test
```

#### Run Tests for a Specific Feature

```bash
# Branding tests only
mvn test -Dtest=TestRunner#testBranding

# Room tests only
mvn test -Dtest=TestRunner#testRoom

# Booking tests only
mvn test -Dtest=TestRunner#testBooking
```

#### Generate Test Reports

After running tests, HTML reports are generated at:

```
backend-tests/target/karate-reports/karate-summary.html
```

Open this file in a browser to view detailed test results, execution times, and pass/fail status.

### Test Coverage

#### 1. **Branding API** (`GET /branding/`)
- Validates company name equals exactly `"Shady Meadows B&B"`
- Confirms contact email matches a valid email regex pattern
- Validates response contains description and directions fields

#### 2. **Room API** (`GET /room/`)
- Verifies response is an array of rooms
- Confirms at least one room has `roomPrice > 0`
- Validates room object structure and required fields

#### 3. **Booking API** (`POST /booking/`)
- Creates a booking with valid roomId retrieved from the Room API
- Validates request body includes: `firstname`, `lastname`, `depositpaid`, `bookingdates`
- Confirms correct `Content-Type: application/json` header
- Verifies successful booking creation with HTTP 201 response

### Test Design Principles

- **Atomicity**: Each test is independent and does not rely on data from other tests
- **Type Matchers**: Uses Karate's type matchers (`#string`, `#number`, `#array`, `#regex`) instead of hardcoding dynamic values
- **Reusable Utilities**: Common validation logic in `data-validation.js` and randomized stay-date generation in `date-helper.js` prevent duplication
- **Data Reset**: Tests account for periodic API data resets by creating necessary test data within each test

### Configuration

The base URL for all API requests is configured in `src/test/java/karate-config.js`:

```javascript
baseUrl: 'https://automationintesting.online/api'
```

**API Specification**

The OpenAPI/Swagger specification for the API is documented in `openapi.yaml`. This file describes all available endpoints, request/response schemas, and can be used with tools like Swagger UI for interactive API documentation.

### Troubleshooting

**Tests fail with connection error:**
- Verify the target API is accessible: `curl https://automationintesting.online/api/branding`
- Check your internet connection

**Maven command not found:**
- Ensure Maven is installed and added to your system PATH
- Verify: `mvn -version`

**Java version mismatch:**
- Ensure Java 17+ is installed
- Verify: `java -version`

---

## Part 2: UI Automation (Playwright)

### Requirements

- **Node.js 18+** and **npm**
  - Verify: `node -v` and `npm -v`

### Project Structure

```
frontend-tests/
├── playwright.config.ts        # Playwright configuration (baseURL, reporter, projects)
├── tsconfig.json                # TypeScript configuration
├── src/
│   ├── pages/                   # Page Object Model classes
│   │   ├── base.page.ts         # Shared base class (goto/waitForReady)
│   │   ├── home.page.ts         # Public homepage (contact form, room cards)
│   │   ├── admin-login.page.ts  # Admin login form
│   │   └── admin-dashboard.page.ts # Admin dashboard & Rooms tab
│   ├── fixtures/                # Custom Playwright fixtures
│   │   ├── index.ts             # Composed `test`/`expect` export used by all specs
│   │   ├── pages.fixture.ts     # Provides POM instances + ready-to-use homePage
│   │   └── app-config.fixture.ts # Admin credentials (env-overridable)
│   └── utils/
│       └── tags.ts              # Test tag enum + featureTag() helper
└── tests/
    ├── homepage.spec.ts         # Homepage sanity tests
    └── admin.spec.ts            # Admin auth + Rooms cross-check tests
```

### Setup

```bash
cd frontend-tests
npm install
npx playwright install chromium   # downloads the browser binary used by tests
```

### How to Run Tests

```bash
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

The suite is configured with Playwright's built-in HTML reporter. After a run, an HTML report is written to `frontend-tests/playwright-report/`.

```bash
# Open the most recent HTML report in a browser
npm run report
```

Traces (for failed tests on retry, useful in CI) are saved under `frontend-tests/test-results/` and can be opened with `npx playwright show-trace <path-to-trace.zip>`.

### Test Coverage

#### 1. Homepage sanity (`tests/homepage.spec.ts`)
- "Contact" / "Send Us a Message" form and all its fields are visible.
- A "Book now" button is present for each listed room type (Single, Double, Suite).

#### 2. Admin authentication & dashboard (`tests/admin.spec.ts`)
- Logs in with `admin` / `password`, asserts navigation to the admin area and that a "Logout" button, "Rooms" link, and "Messages" link are visible.
- **Bonus — Rooms cross-check**: reads a room's price and amenities from the public homepage card, then logs into the admin "Rooms" tab and asserts the same room's price and amenities (sorted, order-independent) match.

### Design Notes

- **Page Object Model**: each page/area of the app is wrapped in a class under `src/pages/` exposing locators and intent-revealing methods (e.g. `getRoomPrice`, `getRoomAmenities`, `login`).
- **Fixture composition**: `src/fixtures/index.ts` merges a `pages` fixture (bundles all POMs + the raw `page`), an `appConfig` fixture (admin credentials, overridable via `ADMIN_USERNAME`/`ADMIN_PASSWORD` env vars), and a `homePage` fixture (navigates to `/` and waits until ready). All specs import `test`/`expect` from this single module.
- **Selectors**: user-facing locators (`getByRole`, `getByText`) are preferred over CSS/XPath. `exact: true` is used where labels collide (e.g. "Book now" vs the hero's "Book Now" CTA). The room price is read via `getByText(/£\d+/)` rather than styling classes. The few remaining attribute selectors (`[data-testid="roomlisting"]`, `.badge`, `#type<RoomType>`/`p[id^="roomPrice"]`/`p[id^="details"]`) target elements that have no accessible role or name (Bootstrap grid `<div>`/`<p>`/`<span>` cells and amenity badges) — these are stable `data-testid`/`id` hooks rather than brittle structural CSS.
- **Tagging**: `Tags`/`featureTag()` in `src/utils/tags.ts` attach Playwright-native tags (`@smoke`, `@regression`, `@homepage`, `@admin`) so suites can be filtered with `--grep`.
- **Atomicity**: no test depends on data created by another test or a previous run — credentials are fixed/admin-provided, and the Rooms cross-check reads whatever room data currently exists rather than assuming a fixed catalog.

---

## Approach, Bugs Found & CI/CD Plan

### Approach

Both suites validate the target system's contracts and core user journeys against live data rather than fixtures:

- **Karate (API)**: feature files assert response *shapes and types* (`#string`, `#number`, `#regex`, `#array`) instead of hardcoding values that the platform resets periodically. Shared JS helpers (`date-helper.js`, `data-validation.js`) keep date generation and assertions DRY across features.
- **Playwright (UI)**: a Page Object Model + fixture-composition setup keeps specs declarative — `src/fixtures/index.ts` exposes ready-to-use POMs, app config, and a pre-navigated `homePage` so specs only contain test logic.

### CI/CD Integration Plan

Both API (Karate) and UI (Playwright) test suites are executed in a staged CI/CD pipeline. The
pipeline follows a progressive validation strategy: fast feedback on PR, full validation in QA,
and production-like verification in pre-production.

#### Test Strategy (Single Source of Truth)

- `@smoke` — critical business flows (API + UI)
- `@regression` — full functional coverage
- `@integration` — service-to-service validation
- `@e2e` — full user journeys
- `@performance` — load / long-running checks
- `@prod-safe` — safe for production execution

> Smoke is a subset of regression.

#### Environments & Pipeline Flow

| Stage | Environment Role | Trigger | Tests Run | Purpose |
|---|---|---|---|---|
| PR / Merge | CI validation | Pull request merge | `@smoke` | Fast validation of core functionality |
| Staging (QA / Integration) | Unstable QA environment | Deploy to staging | Full API regression + integration + limited UI smoke | Validate system integration and correctness |
| Sandbox (Pre-production) | Production-like environment | Deploy release candidate | Full regression + full UI + E2E + performance | Final validation before production release |
| Production | Live system | Post-deploy / scheduled | `@smoke` + `@prod-safe` | Verify production stability |

#### Execution Rules

**PR / Merge**
- Run `@smoke`
- Fail fast (stop pipeline immediately on failure)

**Staging (QA / Integration)**
- Full API regression
- Integration tests (service interactions)
- Minimal UI smoke only
- No performance or heavy E2E tests
- Purpose: validate system wiring and backend correctness

**Sandbox (Pre-production)**
- Full API regression
- Full UI regression
- Full E2E suite
- Performance / load tests
- Optional long-running checks
- Purpose: production-like validation before release

**Production**
- Only safe smoke tests
- `@prod-safe` validation suite
- Read-only checks on critical flows
- Strictly non-invasive

---

## Project Notes

- The target API automatically resets data periodically, so tests create their own test data
- No external test data dependencies or database fixtures are required
- All tests follow REST API best practices and validate response contracts
