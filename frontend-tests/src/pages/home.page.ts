import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  readonly contactHeading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.contactHeading = page.getByRole('heading', { name: 'Send Us a Message' });
    this.nameInput = page.getByRole('textbox', { name: 'Name' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone' });
    this.subjectInput = page.getByRole('textbox', { name: 'Subject' });
    this.messageInput = page.locator('#description');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  get path(): string {
    return '/';
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await this.contactHeading.waitFor();
    await this.roomCards.first().waitFor();
  }

  get roomsSection(): Locator {
    return this.page.locator('#rooms');
  }

  get roomCards(): Locator {
    return this.roomsSection.locator('.room-card');
  }

  roomCard(roomType: string): Locator {
    return this.roomsSection
      .locator('.room-card')
      .filter({ has: this.page.getByRole('heading', { level: 5, name: roomType, exact: true }) });
  }

  bookNowButtonIn(card: Locator): Locator {
    return card.getByRole('link', { name: 'Book now', exact: true });
  }

  async getRoomPrice(roomType: string): Promise<number> {
    const priceText = await this.roomCard(roomType).getByText(/£\d+/).innerText();
    const match = priceText.match(/\d+/);

    if (!match) {
      throw new Error(`Could not parse price from "${priceText}"`);
    }

    return Number(match[0]);
  }

  async getRoomAmenities(roomType: string): Promise<string[]> {
    const amenities = await this.roomCard(roomType).locator('.badge').allInnerTexts();

    return amenities.map((amenity) => amenity.trim()).sort();
  }
}
