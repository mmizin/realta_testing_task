import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import type { RoomData } from '../types/room';

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

  bookNowButtonIn(card: Locator): Locator {
    return card.getByRole('link', { name: 'Book now', exact: true });
  }

  async getRoomCardsData(): Promise<RoomData[]> {
    await this.roomCards.first().waitFor();

    const cards = await this.roomCards.all();

    return Promise.all(
      cards.map(async (card) => {
        const [type, priceText, amenities] = await Promise.all([
          card.getByRole('heading', { level: 5 }).innerText(),
          card.getByText(/£\d+/).innerText(),
          card.locator('.badge').allInnerTexts(),
        ]);

        const priceMatch = priceText.match(/\d+/);

        if (!priceMatch) {
          throw new Error(`Could not parse price from "${priceText}"`);
        }

        return {
          type: type.trim(),
          price: Number(priceMatch[0]),
          amenities: amenities.map((amenity) => amenity.trim()).sort(),
        };
      }),
    );
  }
}
