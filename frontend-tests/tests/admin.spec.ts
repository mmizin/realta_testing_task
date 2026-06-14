import { test, expect, Tags, featureTag } from '../src/fixtures';

test.describe('Admin authentication & dashboard', () => {
  test(
    'logs in and lands on the admin dashboard with a Logout button',
    featureTag(Tags.Smoke, Tags.Admin),
    async ({ pages, appConfig }) => {
      await pages.adminLogin.goto();
      await pages.adminLogin.waitForReady();

      const { username, password } = appConfig.adminCredentials;
      await pages.adminLogin.login(username, password);
      await pages.adminDashboard.waitForReady();

      await expect(pages.page).toHaveURL(/\/admin/);
      await expect(pages.adminDashboard.logoutButton).toBeVisible();
      await expect(pages.adminDashboard.roomsLink).toBeVisible();
      await expect(pages.adminDashboard.messagesLink).toBeVisible();
    },
  );

  test(
    "a room's price and amenities in the admin Rooms tab match the homepage",
    featureTag(Tags.Regression, Tags.Admin),
    async ({ homePage, pages, appConfig }) => {
      const roomType = 'Single';

      const homePagePrice = await homePage.getRoomPrice(roomType);
      const homePageAmenities = await homePage.getRoomAmenities(roomType);

      await pages.adminLogin.goto();
      await pages.adminLogin.waitForReady();

      const { username, password } = appConfig.adminCredentials;
      await pages.adminLogin.login(username, password);
      await pages.adminDashboard.waitForReady();

      await pages.adminDashboard.roomsLink.click();
      await expect(pages.adminDashboard.roomRow(roomType)).toBeVisible();

      const adminPrice = await pages.adminDashboard.getRoomPrice(roomType);
      const adminAmenities = await pages.adminDashboard.getRoomAmenities(roomType);

      expect(adminPrice).toBe(homePagePrice);
      expect(adminAmenities).toEqual(homePageAmenities);
    },
  );
});
