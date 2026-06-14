import { test, expect, Tags, featureTag } from '../src/fixtures';

test.describe('Homepage sanity', () => {
  test(
    'Contact form is visible',
    featureTag(Tags.Smoke, Tags.Homepage),
    async ({ homePage }) => {
      await expect.soft(homePage.contactHeading).toBeVisible();
      await expect.soft(homePage.nameInput).toBeVisible();
      await expect.soft(homePage.emailInput).toBeVisible();
      await expect.soft(homePage.phoneInput).toBeVisible();
      await expect.soft(homePage.subjectInput).toBeVisible();
      await expect.soft(homePage.messageInput).toBeVisible();
      await expect.soft(homePage.submitButton).toBeVisible();
    },
  );

  test(
    '"Book now" button is present for each listed room type',
    featureTag(Tags.Smoke, Tags.Homepage),
    async ({ homePage }) => {
      const cards = await homePage.roomCards.all();

      expect(cards.length).toBeGreaterThan(0);

      for (const card of cards) {
        await expect(homePage.bookNowButtonIn(card)).toBeVisible();
      }
    },
  );
});
