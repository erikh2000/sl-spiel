import { findStatementType } from "../statementUtil";
import StatementType from "../types/StatementType";

describe('statementUtil', () => {
  describe('findLineStatementType()', () => {
    describe('no parsable statement available', () => {
      it('throws for an empty line', () => {
        expect(() => findStatementType({text:'', depth:0, statementOffset:0})).toThrow();
      });
      
      it('throws for a line that starts with a number', () => {
        expect(() => findStatementType({text:'3', depth:0, statementOffset:0})).toThrow();
      });
      
      it('throws for a line that starts with a symbol character', () => {
        expect(() => findStatementType({text:'*', depth:0, statementOffset:0})).toThrow();
      });
      
      it('throws for a line that starts with a space', () => {
        expect(() => findStatementType({text:' ', depth:0, statementOffset:0})).toThrow();
      });
    });
    
    describe('assign statement handling', () => {
      it('handles a simple assign statement', () => {
        expect(findStatementType({text:'x = 3', depth:0, statementOffset:0})).toBe(StatementType.ASSIGN);
      });
      
      it('handles an assign statement with no spaces', () => {
        expect(findStatementType({text:'x=3', depth:0, statementOffset:0})).toBe(StatementType.ASSIGN);
      });
      
      it('handles an assign statement with spaces', () => {
        expect(findStatementType({text:'x   = \n   3', depth:0, statementOffset:0})).toBe(StatementType.ASSIGN);
      });
      
      it('handles an assign statement with a complex expression', () => {
        expect(findStatementType({text:'y = (7 + 3) * 2', depth:0, statementOffset:0})).toBe(StatementType.ASSIGN);
      });
      
      it('handles an assign statement that begins with an underscore', () => {
        expect(findStatementType({text:'_x = 3', depth:0, statementOffset:0})).toBe(StatementType.ASSIGN);
      });
      
      it('handles an assign statement for a variable with multiple underscores', () => {
        expect(findStatementType({text:'x_y_z = 3', depth:0, statementOffset:0})).toBe(StatementType.ASSIGN);
      });
    });
    
    describe('function statement handling', () => {
      it('handles a simple function call', () => {
        expect(findStatementType({text:'func()', depth:0, statementOffset:0})).toBe(StatementType.CALL);
      });
      
      it('handles a function call with spaces', () => {
        expect(findStatementType({text:'func ()', depth:0, statementOffset:0})).toBe(StatementType.CALL);
      });
      
      it('handles a function call that begins with an underscore', () => {
        expect(findStatementType({text:'_func()', depth:0, statementOffset:0})).toBe(StatementType.CALL);
      });
      
      it('handles a function call for a function with multiple underscores', () => {
        expect(findStatementType({text:'func_1_2()', depth:0, statementOffset:0})).toBe(StatementType.CALL);
      });

      it('handles a function call for a function called "_if()"', () => {
        expect(findStatementType({text:'_if()', depth:0, statementOffset:0})).toBe(StatementType.CALL);
      });
      
      it('handles a function call with a single parameter', () => {
        expect(findStatementType({text:'func(3)', depth:0, statementOffset:0})).toBe(StatementType.CALL);
      });
    });
    
    describe('if statement handling', () => {
      it('handles a simple if statement', () => {
        expect(findStatementType({text:'if (', depth:0, statementOffset:0})).toBe(StatementType.IF);
      });
      
      it('handles an if statement with no spaces', () => {
        expect(findStatementType({text:'if(', depth:0, statementOffset:0})).toBe(StatementType.IF);
      });
      
      it('handles an if statement with spaces', () => {
        expect(findStatementType({text:'if  (', depth:0, statementOffset:0})).toBe(StatementType.IF);
      });
    });
  });
});