import { stripHtml } from "../htmlFormatUtil";

describe('stripHtml()', () => {
  it('returns empty string for empty html', () => {
    const html = '';
    const expected = '';
    const stripped = stripHtml(html);
    expect(stripped).toEqual(expected);
  });

  it('returns unchanged string for text with no tags', () => {
    const html = 'plain old text';
    const expected = 'plain old text';
    const stripped = stripHtml(html);
    expect(stripped).toEqual(expected);
  });

  it('strips out an html tag', () => {
    const html = 'make <it> safe';
    const expected = 'make  safe';
    const stripped = stripHtml(html);
    expect(stripped).toEqual(expected);
  });

  it('strips un unclosed html tag', () => {
    const html = 'make <it safe';
    const expected = 'make ';
    const stripped = stripHtml(html);
    expect(stripped).toEqual(expected);
  });

  it('strips out nested tags', () => {
    const html = 'make<it <itchild> >safe';
    const expected = 'makesafe';
    const stripped = stripHtml(html);
    expect(stripped).toEqual(expected);
  });
});