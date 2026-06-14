import { test as base } from '@playwright/test';

export type AdminCredentials = {
  username: string;
  password: string;
};

export type AppConfig = {
  adminCredentials: AdminCredentials;
};

export type AppConfigFixtures = {
  appConfig: AppConfig;
};

export const appConfigFixture: Parameters<typeof base.extend<AppConfigFixtures>>[0] = {
  appConfig: async ({}, use) => {
    await use({
      adminCredentials: {
        username: process.env.ADMIN_USERNAME ?? 'admin',
        password: process.env.ADMIN_PASSWORD ?? 'password',
      },
    });
  },
};
