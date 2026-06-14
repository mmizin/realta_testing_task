import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

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

  roomRow(roomType: string): Locator {
    return this.page
      .locator('[data-testid="roomlisting"]')
      .filter({ has: this.page.locator(`#type${roomType}`) });
  }

  async getRoomPrice(roomType: string): Promise<number> {
    const priceText = await this.roomRow(roomType).locator('p[id^="roomPrice"]').innerText();

    return Number(priceText);
  }

  async getRoomAmenities(roomType: string): Promise<string[]> {
    const detailsText = await this.roomRow(roomType).locator('p[id^="details"]').innerText();

    return detailsText
      .split(',')
      .map((amenity) => amenity.trim())
      .sort();
  }
}
