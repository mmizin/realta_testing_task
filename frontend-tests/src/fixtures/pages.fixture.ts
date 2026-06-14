import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { AdminLoginPage } from '../pages/admin-login.page';
import { AdminDashboardPage } from '../pages/admin-dashboard.page';

export type AppPages = {
  page: Page;
  home: HomePage;
  adminLogin: AdminLoginPage;
  adminDashboard: AdminDashboardPage;
};

export type PagesFixtures = {
  pages: AppPages;
};

export const pagesFixture: Parameters<typeof base.extend<PagesFixtures>>[0] = {
  pages: async ({ page }: { page: Page }, use: (value: AppPages) => Promise<void>) => {
    await use({
      page,
      home: new HomePage(page),
      adminLogin: new AdminLoginPage(page),
      adminDashboard: new AdminDashboardPage(page),
    });
  },
};

export type HomePageReadyFixtures = {
  homePage: HomePage;
};

export const homePageFixture: Parameters<
  typeof base.extend<HomePageReadyFixtures & PagesFixtures>
>[0] = {
  homePage: async ({ pages }, use) => {
    await pages.home.goto();
    await pages.home.waitForReady();

    await use(pages.home);
  },
};
