import {SNAPSHOT as MEDIAWIKI_HTML} from '../__snapshots__/mediawikiGlossary';
import {importGlossaryHtml} from "../glossaryHtmlUtil";
import SpielReply from '../../types/SpielReply';

function _replyContains(reply:SpielReply|null, checkText:string) {
  if (!reply) { console.error('Reply is null'); return false;}
  const dialogue:string = reply.line.dialogue[0];
  if (dialogue.includes(checkText)) return true;
  console.error('Expected: "${checkText}", Actual: "${dialogue}".');
  return false;
}

describe('glossaryHtmlUtil', () => {
  describe('importGlossaryHtml()', () => {
    it('imports MediaWiki-based glossary table', () => {
      const spiel = importGlossaryHtml(MEDIAWIKI_HTML);
      let reply = spiel.checkForMatch('absolute advantage');
      expect(_replyContains(reply, 'The ability of a party')).toBeTruthy();
      reply = spiel.checkForMatch('resource cost advantage')
      expect(_replyContains(reply, 'The ability of a party')).toBeTruthy();
      reply = spiel.checkForMatch('abandonment of the gold standard');
      expect(_replyContains(reply, 'The decision by a government')).toBeTruthy();
      reply = spiel.checkForMatch('adaptive expectations');
      expect(_replyContains(reply, 'A hypothetical process by which people')).toBeTruthy();
      reply = spiel.checkForMatch('aggregate demand');
      expect(_replyContains(reply, 'The total demand for goods')).toBeTruthy();
      reply = spiel.checkForMatch('ad');
      expect(_replyContains(reply, 'The total demand for goods')).toBeTruthy();
      reply = spiel.checkForMatch('domestic final demand');
      expect(_replyContains(reply, 'The total demand for goods')).toBeTruthy();
      reply = spiel.checkForMatch('dfd');
      expect(_replyContains(reply, 'The total demand for goods')).toBeTruthy();
      reply = spiel.checkForMatch('effective demand');
      expect(_replyContains(reply, 'The total demand for goods')).toBeTruthy();
    });
  });
});