import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import type { RoomData } from '../types/room';

export class AdminDashboardPage extends BasePage {
  readonly roomsLink: Locator;
  readonly reportLink: Locator;
  readonly brandingLink: Locator;
  readonly messagesLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.roomsLink = page.getByRole('link', { name: 'Rooms' });
    this.reportLink = page.getByRole('link', { name: 'Report' });
    this.brandingLink = page.getByRole('link', { name: 'Branding' });
    this.messagesLink = page.getByRole('link', { name: /^Messages/ });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  get path(): string {
    return '/admin/rooms';
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await this.logoutButton.waitFor();
  }

  get roomListings(): Locator {
    return this.page.locator('[data-testid="roomlisting"]');
  }

  async getRoomListingsData(): Promise<RoomData[]> {
    await this.roomListings.first().waitFor();

    const rows = await this.roomListings.all();

    return Promise.all(
      rows.map(async (row) => {
        const [type, priceText, detailsText] = await Promise.all([
          row.locator('p[id^="type"]').innerText(),
          row.locator('p[id^="roomPrice"]').innerText(),
          row.locator('p[id^="details"]').innerText(),
        ]);

        return {
          type: type.trim(),
          price: Number(priceText),
          amenities: detailsText
            .split(',')
            .map((amenity) => amenity.trim())
            .sort(),
        };
      }),
    );
  }
}
