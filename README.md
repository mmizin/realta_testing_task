# realta_testing_task

SDET technical challenge for Shady Meadows B&B — automated testing of both the API layer (Karate DSL) and the web UI (Playwright).

**Target system under test:** https://automationintesting.online/

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

*Placeholder for Playwright test documentation. To be implemented.*

---

## Project Notes

- The target API automatically resets data periodically, so tests create their own test data
- No external test data dependencies or database fixtures are required
- All tests follow REST API best practices and validate response contracts
