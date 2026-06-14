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
      await expect.soft(pages.adminDashboard.logoutButton).toBeVisible();
      await expect.soft(pages.adminDashboard.roomsLink).toBeVisible();
      await expect.soft(pages.adminDashboard.messagesLink).toBeVisible();
    },
  );

  test(
    "every room's price and amenities in the admin Rooms tab match the homepage",
    featureTag(Tags.Regression, Tags.Admin),
    async ({ homePage, pages, appConfig }) => {
      const homeRooms = await homePage.getRoomCardsData();
      expect(homeRooms.length).toBeGreaterThan(0);

      await pages.adminLogin.goto();
      await pages.adminLogin.waitForReady();

      const { username, password } = appConfig.adminCredentials;
      await pages.adminLogin.login(username, password);
      await pages.adminDashboard.waitForReady();

      await pages.adminDashboard.roomsLink.click();

      const adminRooms = await pages.adminDashboard.getRoomListingsData();

      // Multiset match: each admin room must correspond to exactly one homepage
      // card with the same type, price and amenities (duplicates included).
      const unmatchedHomeRooms = [...homeRooms];
      const unmatchedAdminRooms: typeof adminRooms = [];

      for (const adminRoom of adminRooms) {
        const matchIndex = unmatchedHomeRooms.findIndex(
          (homeRoom) =>
            homeRoom.type === adminRoom.type &&
            homeRoom.price === adminRoom.price &&
            JSON.stringify(homeRoom.amenities) === JSON.stringify(adminRoom.amenities),
        );

        if (matchIndex === -1) {
          unmatchedAdminRooms.push(adminRoom);
        } else {
          unmatchedHomeRooms.splice(matchIndex, 1);
        }
      }

      expect.soft(unmatchedAdminRooms, 'admin room listings with no matching homepage card').toEqual(
        [],
      );
      expect.soft(unmatchedHomeRooms, 'homepage cards with no matching admin room listing').toEqual([]);
    },
  );
});
