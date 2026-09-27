import { youtubeId, youtubeThumbnail } from '@/utils';

describe('youtubeId', () => {
  it.each([
    ['https://www.youtube.com/watch?v=zyXF5Ez8ZqU', 'zyXF5Ez8ZqU'],
    ['https://www.youtube.com/watch?v=DcGelBte5N0&t=3s', 'DcGelBte5N0'],
    ['https://youtube.com/watch?feature=share&v=_dAxnpqV9B8', '_dAxnpqV9B8'],
    ['https://youtu.be/7yRWXbMV-kA', '7yRWXbMV-kA'],
    ['https://www.youtube.com/shorts/mvjUXemeuJM', 'mvjUXemeuJM'],
    ['https://www.youtube.com/embed/niZPL9kKWTU', 'niZPL9kKWTU'],
  ])('reads the id from %s', (url, id) => {
    expect(youtubeId(url)).toBe(id);
  });

  it('returns null for a non-YouTube link', () => {
    expect(youtubeId('https://fcruhlviv.com/video/1')).toBeNull();
  });
});

describe('youtubeThumbnail', () => {
  it('builds the preview picture url for a YouTube link', () => {
    expect(youtubeThumbnail('https://youtu.be/7yRWXbMV-kA')).toBe(
      'https://img.youtube.com/vi/7yRWXbMV-kA/hqdefault.jpg',
    );
  });

  it('returns null for other links', () => {
    expect(youtubeThumbnail('https://example.com')).toBeNull();
  });
});
