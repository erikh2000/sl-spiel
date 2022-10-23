import { findTagContents } from "../htmlParseUtil";

describe('htmlParseUtil', () => {
  describe('findTagContents()', () => {
    it('returns no match for empty html', () => {
      const html = '';
      const tagName = 'table';
      const expected:string[] = [];
      expect(findTagContents(html, tagName)).toEqual(expected);
    });

    it('returns no match for html that does not contain tag', () => {
      const html = '<p>No table here!</p>';
      const tagName = 'table';
      const expected:string[] = [];
      expect(findTagContents(html, tagName)).toEqual(expected);
    });

    it('returns no match for html that contains start but not end tag', () => {
      const html = '<table>No table here!</p>';
      const tagName = 'table';
      const expected:string[] = [];
      expect(findTagContents(html, tagName)).toEqual(expected);
    });

    it('returns no match for html that contains end but not start tag', () => {
      const html = '<p>No table here!</table>';
      const tagName = 'table';
      const expected:string[] = [];
      expect(findTagContents(html, tagName)).toEqual(expected);
    });

    it('returns a match', () => {
      const html = '<table>Finally!</table>';
      const tagName = 'table';
      const expected:string[] = ['Finally!'];
      expect(findTagContents(html, tagName)).toEqual(expected);
    });

    it('returns multiple matches', () => {
      const html = '<table>Finally!<tr>1</tr><tr>2</tr><tr>3</tr></table>';
      const tagName = 'tr';
      const expected:string[] = ['1', '2', '3'];
      expect(findTagContents(html, tagName)).toEqual(expected);
    });
    
    it('returns no match when an end tag exists but not at the same level as start tag', () => {
      const html = '<div>Hopes<p></div>dashed</p>';
      const tagName = 'div';
      const expected:string[] = [];
      expect(findTagContents(html, tagName)).toEqual(expected);
    });

    it('returns match with contents that contain other html tags', () => {
      const html = '<div>outer<p>inner</p></div>';
      const tagName = 'div';
      const expected:string[] = ['outer<p>inner</p>'];
      expect(findTagContents(html, tagName)).toEqual(expected);
    });

    it('returns outer match only when same tag is nested', () => {
      const html = '<div>outer<div>inner</div></div>';
      const tagName = 'div';
      const expected:string[] = ['outer<div>inner</div>'];
      expect(findTagContents(html, tagName)).toEqual(expected);
    });

    it('returns match with empty contents for self-closing tag', () => {
      const html = '<p/>';
      const tagName = 'p';
      const expected:string[] = [''];
      expect(findTagContents(html, tagName)).toEqual(expected);
    });

    it('returns match with contents that contain self-closing tag', () => {
      const html = '<p>Can I get a<br />break?</p>';
      const tagName = 'p';
      const expected:string[] = ['Can I get a<br />break?'];
      expect(findTagContents(html, tagName)).toEqual(expected);
    });

    it('returns match when start tag has attributes', () => {
      const html = '<p class="special">This is special.</p>';
      const tagName = 'p';
      const expected:string[] = ['This is special.'];
      expect(findTagContents(html, tagName)).toEqual(expected);
    });

    it('gracefully handles incomplete start tag', () => {
      const html = '<p>first</p><p';
      const tagName = 'p';
      const expected:string[] = ['first'];
      expect(findTagContents(html, tagName)).toEqual(expected);
    });

    it('gracefully handles incomplete end tag', () => {
      const html = '<p>first</p><p>second</p';
      const tagName = 'p';
      const expected:string[] = ['first'];
      expect(findTagContents(html, tagName)).toEqual(expected);
    });
  }); 
});