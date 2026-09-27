import { htmlToBlocks } from '@/utils';

describe('htmlToBlocks', () => {
  it('splits paragraphs and drops inline tags', () => {
    expect(
      htmlToBlocks('<p><strong>First</strong> line</p><p>Second</p>'),
    ).toEqual([
      { type: 'paragraph', text: 'First line' },
      { type: 'paragraph', text: 'Second' },
    ]);
  });

  it('keeps headings and images as their own blocks', () => {
    expect(
      htmlToBlocks(
        '<h2>Title</h2><p>Text<img src="https://x/a.jpg" alt=""></p>',
      ),
    ).toEqual([
      { type: 'heading', text: 'Title' },
      { type: 'paragraph', text: 'Text' },
      { type: 'image', uri: 'https://x/a.jpg' },
    ]);
  });

  it('decodes named and numeric entities', () => {
    expect(
      htmlToBlocks('<p>&laquo;Рух&raquo;&nbsp;&#8211; &#x41;&amp;B</p>'),
    ).toEqual([{ type: 'paragraph', text: '«Рух» – A&B' }]);
  });

  it('skips empty paragraphs, scripts and styles', () => {
    expect(
      htmlToBlocks(
        '<p>&nbsp;</p><script>alert(1)</script><style>p{}</style><p>Kept</p>',
      ),
    ).toEqual([{ type: 'paragraph', text: 'Kept' }]);
  });

  it('breaks lines on <br>', () => {
    expect(htmlToBlocks('One<br/>Two')).toEqual([
      { type: 'paragraph', text: 'One' },
      { type: 'paragraph', text: 'Two' },
    ]);
  });
});
