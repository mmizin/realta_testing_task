# CLAUDE.md

## Project context

This repo is a take-home SDET technical challenge ("Shady Meadows B&B") completed after an
interview. Target system under test: https://automationintesting.online/

The task has two independent deliverables:

1. **API tests (Karate DSL)** — in `backend-tests/`
2. **UI tests (Playwright, TS/JS)** — in `frontend-tests/`

## Required test coverage

### Karate (API)
- `GET /branding/` — `name` must equal exactly `"Shady Meadows B&B"`; contact email must match an
  email regex.
- `GET /room/` — response is an array; at least one room has `roomPrice > 0`.
- `POST /booking/` — look up a valid `roomid` first (from `GET /room/`), then create a booking
  with `firstname`, `lastname`, `depositpaid` (boolean), and a `bookingdates` object. Send
  `Content-Type: application/json`.

### Playwright (UI)
- Homepage: "Contact" form visible, "Book this room" buttons present for each listed room type.
- Admin (`/admin`, admin/password): log in, confirm redirect to Dashboard/Inboxes, verify
  "Logout" button. Bonus: cross-check a room's details in the admin "Rooms" tab against the
  public homepage.

## Conventions / tips from the task brief

- **Atomicity**: tests must not depend on data created by other tests/runs — the platform's data
  resets periodically. Any booking/room data a test needs must be created within that test.
- **Matchers**: use Karate's type matchers (`#string`, `#number`, `#array`, `#regex`, etc.) rather
  than hardcoding dynamic values like IDs.
- **Playwright selectors**: prefer user-facing locators (`getByRole`, `getByText`) over CSS/XPath,
  especially for the React-based admin panel.

## Current repo state

- Both suites are implemented and runnable:
  - `backend-tests/` — Maven project (`pom.xml`), Karate config in
    `src/test/java/karate-config.js`, feature files under `src/test/java/{branding,room,booking}/`.
  - `frontend-tests/` — Playwright project (`package.json`, `playwright.config.ts`), Page Object
    Model under `src/pages/`, fixtures under `src/fixtures/`, specs under `tests/`.
- `REPORTING.md` (repo root) documents how to run both suites and generate/view their reports;
  linked from `README.md`.

## Submission requirements (keep in mind while building)

- Clean repo structure for both Karate and Playwright configs.
- `REPORTING.md` instructions for running tests and generating/viewing test reports.
- README explanation of approach and CI/CD integration plan.
