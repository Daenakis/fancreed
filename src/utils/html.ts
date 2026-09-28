export type HtmlBlock =
  | { type: 'paragraph' | 'heading'; text: string }
  | { type: 'image'; uri: string };

const ENTITIES: Record<string, string> = {
  nbsp: ' ',
  amp: '&',
  quot: '"',
  apos: "'",
  lt: '<',
  gt: '>',
  laquo: '«',
  raquo: '»',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x?[\da-f]+|\w+);/gi, (entity, code: string) => {
    if (code[0] === '#') {
      const value =
        code[1]?.toLowerCase() === 'x'
          ? parseInt(code.slice(2), 16)
          : parseInt(code.slice(1), 10);
      return Number.isNaN(value) ? entity : String.fromCodePoint(value);
    }
    return ENTITIES[code.toLowerCase()] ?? entity;
  });
}

/** Tags stripped, entities decoded, whitespace collapsed. */
export function htmlToText(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
}

// Block breaks: images, headings, closing paragraph-like tags and <br>.
const BREAKS =
  /<img\b[^>]*?\bsrc=["']([^"']+)["'][^>]*>|<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>|<\/(?:p|div|li|blockquote|ul|ol)>|<br\s*\/?>/gi;

/**
 * Turns article HTML into plain blocks for native rendering: paragraphs,
 * headings and images. Scripts, styles, tables' markup and inline
 * formatting are dropped (their text is kept).
 */
export function htmlToBlocks(html: string): HtmlBlock[] {
  const source = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '');
  const blocks: HtmlBlock[] = [];
  const pushParagraph = (chunk: string) => {
    const text = htmlToText(chunk);
    if (text) blocks.push({ type: 'paragraph', text });
  };

  let last = 0;
  for (const match of source.matchAll(BREAKS)) {
    pushParagraph(source.slice(last, match.index));
    const [, uri, heading] = match;
    if (uri) blocks.push({ type: 'image', uri: decodeEntities(uri) });
    if (heading !== undefined) {
      const text = htmlToText(heading);
      if (text) blocks.push({ type: 'heading', text });
    }
    last = match.index + match[0].length;
  }
  pushParagraph(source.slice(last));
  return blocks;
}
