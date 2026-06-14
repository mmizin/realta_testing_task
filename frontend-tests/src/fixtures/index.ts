import { test as base } from '@playwright/test';
import { pagesFixture, homePageFixture } from './pages.fixture';
import type { PagesFixtures, HomePageReadyFixtures } from './pages.fixture';
import { appConfigFixture } from './app-config.fixture';
import type { AppConfigFixtures } from './app-config.fixture';
import { Tags, featureTag } from '../utils/tags';

type Fixtures = PagesFixtures & AppConfigFixtures & HomePageReadyFixtures;

export const test = base.extend<Fixtures>({
  ...pagesFixture,
  ...appConfigFixture,
  ...homePageFixture,
});

export { Tags, featureTag };
export const expect = test.expect;
