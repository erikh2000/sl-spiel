import {
  createMatchRulesetFromCriterion, 
  createWordPositionMap,
  matchesRulesetInWordPositionMap,
  IMatchRuleset, 
  WordPositionMap 
} from '../matchUtil';

describe('matchUtil', () => {
  describe('createMatchRulesetFromCriterion()', () => {
    it('returns ruleset for empty criteria', () => {
      const criteria = '';
      const expected:IMatchRuleset = {phrases:[], matchFromStart:false, matchToEnd:false};
      const ruleset = createMatchRulesetFromCriterion(criteria);
      expect(ruleset).toEqual(expected);
    });
    
    it('returns ruleset for a single one-word phrase', () => {
      const criteria = 'thanks';
      const expected:IMatchRuleset = {phrases:[['thanks']], matchFromStart:false, matchToEnd:false};
      const ruleset = createMatchRulesetFromCriterion(criteria);
      expect(ruleset).toEqual(expected);
    });

    it('returns ruleset for a single two-word phrase', () => {
      const criteria = 'thank you';
      const expected:IMatchRuleset = {phrases:[['thank','you']], matchFromStart:false, matchToEnd:false};
      const ruleset = createMatchRulesetFromCriterion(criteria);
      expect(ruleset).toEqual(expected);
    });

    it('returns ruleset reflecting match-from-start criteria', () => {
      const criteria = '[thank you';
      const expected:IMatchRuleset = {phrases:[['thank','you']], matchFromStart:true, matchToEnd:false};
      const ruleset = createMatchRulesetFromCriterion(criteria);
      expect(ruleset).toEqual(expected);
    });

    it('returns ruleset reflecting match-to-end criteria', () => {
      const criteria = 'thank you]';
      const expected:IMatchRuleset = {phrases:[['thank','you']], matchFromStart:false, matchToEnd:true};
      const ruleset = createMatchRulesetFromCriterion(criteria);
      expect(ruleset).toEqual(expected);
    });

    it('returns ruleset reflecting both match-from-start and match-to-end criteria', () => {
      const criteria = '[thank you]';
      const expected:IMatchRuleset = {phrases:[['thank','you']], matchFromStart:true, matchToEnd:true};
      const ruleset = createMatchRulesetFromCriterion(criteria);
      expect(ruleset).toEqual(expected);
    });

    it('trims whitespace outside of [ and ]', () => {
      const criteria = ' [thank you] ';
      const expected:IMatchRuleset = {phrases:[['thank','you']], matchFromStart:true, matchToEnd:true};
      const ruleset = createMatchRulesetFromCriterion(criteria);
      expect(ruleset).toEqual(expected);
    });

    it('trims whitespace inside of [ and ]', () => {
      const criteria = '[ thank you ]';
      const expected:IMatchRuleset = {phrases:[['thank','you']], matchFromStart:true, matchToEnd:true};
      const ruleset = createMatchRulesetFromCriterion(criteria);
      expect(ruleset).toEqual(expected);
    });
    
    it('treats all whitespace as empty criteria', () => {
      const criteria = '     ';
      const expected:IMatchRuleset = {phrases:[], matchFromStart:false, matchToEnd:false};
      const ruleset = createMatchRulesetFromCriterion(criteria);
      expect(ruleset).toEqual(expected);
    });

    it('treats all whitespace inside of [ and ] as empty criteria', () => {
      const criteria = '[     ]';
      const expected:IMatchRuleset = {phrases:[], matchFromStart:true, matchToEnd:true};
      const ruleset = createMatchRulesetFromCriterion(criteria);
      expect(ruleset).toEqual(expected);
    });
    
    it('returns ruleset with two phrases', () => {
      const criteria = 'thank...you';
      const expected:IMatchRuleset = {phrases:[['thank'],['you']], matchFromStart:false, matchToEnd:false};
      const ruleset = createMatchRulesetFromCriterion(criteria);
      expect(ruleset).toEqual(expected);
    });

    it('returns ruleset with two phrases stripping whitespace between', () => {
      const criteria = ' thank ... you ';
      const expected:IMatchRuleset = {phrases:[['thank'],['you']], matchFromStart:false, matchToEnd:false};
      const ruleset = createMatchRulesetFromCriterion(criteria);
      expect(ruleset).toEqual(expected);
    });

    it('returns ruleset with two phrases stripping whitespace between', () => {
      const criteria = ' thank ... you ';
      const expected:IMatchRuleset = {phrases:[['thank'],['you']], matchFromStart:false, matchToEnd:false};
      const ruleset = createMatchRulesetFromCriterion(criteria);
      expect(ruleset).toEqual(expected);
    });
  });
  
  describe('createWordPositionMap()', () => {
    it('returns map for empty text', () => {
      const text = '';
      const expected:WordPositionMap = { __positionRange:[0,-1] };
      const map = createWordPositionMap(text);
      expect(map).toEqual(expected);
    });

    it('returns map for all whitespace text (same as empty)', () => {
      const text = '  ';
      const expected:WordPositionMap = { __positionRange:[0,-1] };
      const map = createWordPositionMap(text);
      expect(map).toEqual(expected);
    });

    it('returns map for one word', () => {
      const text = 'dog';
      const expected:WordPositionMap = { __positionRange:[0,0], dog:[0] };
      const map = createWordPositionMap(text);
      expect(map).toEqual(expected);
    });

    it('returns map for sentence with all unique words', () => {
      const text = 'man bites dog';
      const expected:WordPositionMap = { __positionRange:[0,2], man:[0], bites:[1], dog:[2] };
      const map = createWordPositionMap(text);
      expect(map).toEqual(expected);
    });

    it('returns map for sentence with repeating words', () => {
      const text = 'man bites man bytes dog bites man';
      const expected:WordPositionMap = { __positionRange:[0,6], man:[0,2,6], bites:[1,5], bytes:[3], dog:[4] };
      const map = createWordPositionMap(text);
      expect(map).toEqual(expected);
    });

    it('returns map with whitespace between words removed', () => {
      const text = 'man   bites   dog';
      const expected:WordPositionMap = { __positionRange:[0,2], man:[0], bites:[1], dog:[2] };
      const map = createWordPositionMap(text);
      expect(map).toEqual(expected);
    });
  });
  
  describe('matchesRulesetInWordPositionMap()', () => {
    it('returns false for a ruleset with no phrases', () => {
      const wordPositionMap = createWordPositionMap('ibexes are social climbers');
      const ruleset = createMatchRulesetFromCriterion('');
      expect(matchesRulesetInWordPositionMap(ruleset, wordPositionMap)).toBeFalsy();
    });

    it('returns false when matching from start and phrase is not at start', () => {
      const wordPositionMap = createWordPositionMap('ibexes are social climbers');
      const ruleset = createMatchRulesetFromCriterion('[are social');
      expect(matchesRulesetInWordPositionMap(ruleset, wordPositionMap)).toBeFalsy();
    });

    it('returns true when matching from start and phrase is at start', () => {
      const wordPositionMap = createWordPositionMap('ibexes are social climbers');
      const ruleset = createMatchRulesetFromCriterion('[ibexes are');
      expect(matchesRulesetInWordPositionMap(ruleset, wordPositionMap)).toBeTruthy();
    });

    it('returns false when matching to end and phrase is not at end', () => {
      const wordPositionMap = createWordPositionMap('ibexes are social climbers');
      const ruleset = createMatchRulesetFromCriterion('are social]');
      expect(matchesRulesetInWordPositionMap(ruleset, wordPositionMap)).toBeFalsy();
    });

    it('returns false when matching to end with no phrases', () => {
      const wordPositionMap = createWordPositionMap('ibexes are social climbers');
      const ruleset = createMatchRulesetFromCriterion(']');
      expect(matchesRulesetInWordPositionMap(ruleset, wordPositionMap)).toBeFalsy();
    });

    it('returns false when matching from start with no phrases', () => {
      const wordPositionMap = createWordPositionMap('ibexes are social climbers');
      const ruleset = createMatchRulesetFromCriterion('[');
      expect(matchesRulesetInWordPositionMap(ruleset, wordPositionMap)).toBeFalsy();
    });

    it('returns true when matching to end and phrase is at end', () => {
      const wordPositionMap = createWordPositionMap('ibexes are social climbers');
      const ruleset = createMatchRulesetFromCriterion('social climbers]');
      expect(matchesRulesetInWordPositionMap(ruleset, wordPositionMap)).toBeTruthy();
    });

    it('matches for single phrase at both start and end', () => {
      const wordPositionMap = createWordPositionMap('ibexes are social climbers');
      const ruleset = createMatchRulesetFromCriterion('[ibexes are social climbers]');
      expect(matchesRulesetInWordPositionMap(ruleset, wordPositionMap)).toBeTruthy();
    });

    it('returns false when only first word of phrase is in text', () => {
      const wordPositionMap = createWordPositionMap('ibexes are social climbers');
      const ruleset = createMatchRulesetFromCriterion('are not');
      expect(matchesRulesetInWordPositionMap(ruleset, wordPositionMap)).toBeFalsy();
    });

    it('returns true for two matched phrases', () => {
      const wordPositionMap = createWordPositionMap('ibexes are social climbers');
      const ruleset = createMatchRulesetFromCriterion('ibexes...climbers');
      expect(matchesRulesetInWordPositionMap(ruleset, wordPositionMap)).toBeTruthy();
    });

    it('returns false for two matching, but out-of-sequence, phrases', () => {
      const wordPositionMap = createWordPositionMap('ibexes are social climbers');
      const ruleset = createMatchRulesetFromCriterion('climbers...ibexes');
      expect(matchesRulesetInWordPositionMap(ruleset, wordPositionMap)).toBeFalsy();
    });

    it('returns false for two matched phrases and one not', () => {
      const wordPositionMap = createWordPositionMap('ibexes are social climbers');
      const ruleset = createMatchRulesetFromCriterion('ibexes...not...climbers');
      expect(matchesRulesetInWordPositionMap(ruleset, wordPositionMap)).toBeFalsy();
    });
  });
});