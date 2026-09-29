import { localized, localizeEvent } from '@/utils';

import type { AppEvent } from '@/types/api';

describe('localized', () => {
  it('returns the text in the app language', () => {
    expect(localized({ en: 'Hello', uk: 'Привіт' }, 'uk')).toBe('Привіт');
  });

  it('falls back to English for a missing language', () => {
    expect(localized({ en: 'Hello', uk: '' }, 'uk')).toBe('Hello');
    expect(localized({ en: 'Hello', uk: 'Привіт' }, 'pl')).toBe('Hello');
  });

  it('returns an empty string without a text', () => {
    expect(localized(undefined, 'en')).toBe('');
  });
});

describe('localizeEvent', () => {
  const event: AppEvent = {
    _id: 'e',
    type: 'matchDay',
    time: '18:00',
    title: 'Після перемоги',
    location: 'Арена Львів',
  };

  it('uses the translated title and place in the app language', () => {
    const translated = localizeEvent(
      {
        ...event,
        translations: { en: { title: 'After a win', location: 'Arena Lviv' } },
      },
      'en',
    );

    expect(translated).toMatchObject({
      title: 'After a win',
      location: 'Arena Lviv',
    });
  });

  it('keeps the original texts without translations', () => {
    expect(localizeEvent(event, 'en')).toBe(event);
  });

  it('keeps the original place when only the title is translated', () => {
    expect(
      localizeEvent(
        { ...event, translations: { en: { title: 'After a win' } } },
        'en',
      ).location,
    ).toBe('Арена Львів');
  });
});
