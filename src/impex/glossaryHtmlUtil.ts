import Spiel from 'types/Spiel';
import { findTagContents } from "common/htmlParseUtil";
import {stripHtml} from "../common/htmlFormatUtil";
import {splitAndTrimText, splitByMultipleSeparators} from "../common/textFormatUtil";

function _isGlossaryTableHtml(tableHtml:string) {
  const thHtmls = findTagContents(tableHtml, 'th');
  return (thHtmls.length >= 2 && thHtmls[0].toLowerCase().includes('term') && 
    thHtmls[1].toLowerCase().includes('definition'));
}

// Examples:
// aggregate demand --> ['aggregate demand']
// aggregate demand (AD, domestic final demand, DFD, effective demand) --> ['aggregate demand', 'ad', ...]
// aggregate demand, AD, domestic final demand, DFD, effective demand ---> ['aggregate demand', 'ad', ...]
// aggregate demand / AD / domestic final demand / DFD / effective demand ---> ['aggregate demand', 'ad', ...]
const SEPARATORS = ['/', '(', ')', ','];
function _termCellToMatchCriteria(termCell:string):string[] {
  const fields = splitByMultipleSeparators(termCell.toLowerCase(), SEPARATORS);
  return fields
    .map(field => field.trim())
    .filter(field => field.length > 0);
}

function _definitionCellToDialogue(definitionCell:string):string[] {
  return splitAndTrimText(definitionCell, '/');
}

export function importGlossaryHtml(text:string):Spiel {
  const spiel = new Spiel();
  let tableHtmls = findTagContents(text, 'table');
  tableHtmls = tableHtmls.filter(tableHtml => _isGlossaryTableHtml(tableHtml));
  tableHtmls.forEach(tableHtml => {
    const rowHtmls = findTagContents(tableHtml, 'tr');
    rowHtmls.forEach(rowHtml => {
      const cells = findTagContents(rowHtml, 'td');
      if (cells.length >= 2) {
        const termCell = stripHtml(cells[0]);
        const definitionCell = stripHtml(cells[1]);
        const matchCriteria = _termCellToMatchCriteria(termCell);
        const dialogue = _definitionCellToDialogue(definitionCell);
        if (matchCriteria.length && dialogue.length) spiel.addRootReply(matchCriteria, dialogue);
      }
    })
  });
  
  return spiel;
}