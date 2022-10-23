const NOT_FOUND = -1;

function _findStartTag(html:string, tagName:string, searchFromI:number):number {
  let foundI = html.indexOf(`<${tagName} `, searchFromI);
  if (foundI !== NOT_FOUND) return foundI;
  foundI = html.indexOf(`<${tagName}>`, searchFromI);
  if (foundI !== NOT_FOUND) return foundI;
  return html.indexOf(`<${tagName}/>`, searchFromI);
}

function _findIndexAfterTag(html:string, startTagI:number):number {
  let i = startTagI + 1;
  while(i < html.length && html[i] !== '>') {
    ++i;
  }
  return i === html.length ? NOT_FOUND : i + 1;
}

function _findEndTag(html:string, tagName:string, startTagI:number):number {
  let i = _findIndexAfterTag(html, startTagI);
  /* istanbul ignore next */ // Next line has a check for catching debug errors, but won't currently be called with functions under test.
  if (i === NOT_FOUND) return NOT_FOUND;
  if (i >= 2 && html[i-2] === '/') return i; // Self-closing tag, e.g. <p/>
  
  // Find end tag.
  const endTag = `</${tagName}>`;
  ++i;
  let indentLevel = 0;
  while(i < html.length - 1) {
    if (html[i] !== '<') {
      ++i;
      continue;
    }
      
    if (indentLevel === 0 && html.indexOf(endTag, i) === i) return i;

    const afterTagI = _findIndexAfterTag(html, i);
    if (afterTagI === NOT_FOUND) return NOT_FOUND;
    const isClosingTag = html[i+1] === '/';
    const isSelfClosingTag = html[afterTagI - 2] === '/';
    if (!isSelfClosingTag) {
      if (isClosingTag) { --indentLevel; } else { ++indentLevel; }
    }
    i = afterTagI;
  }
  
  return NOT_FOUND;
}

function _getContentsBetweenTags(html:string, startTagI:number, endTagI:number):string {
  const startContentI = _findIndexAfterTag(html, startTagI);
  return startContentI >= endTagI ? '' : html.substring(startContentI, endTagI);
}

export function findTagContents(html:string, tagName:string):string[] {
  const results:string[] = [];
  let searchFromI = 0;
  while(searchFromI !== NOT_FOUND && searchFromI < html.length) {
    const startTagI = _findStartTag(html, tagName, searchFromI);
    if (startTagI === NOT_FOUND) break;
    const endTagI = _findEndTag(html, tagName, startTagI);
    if (endTagI === NOT_FOUND) break;
    results.push(_getContentsBetweenTags(html, startTagI, endTagI));
    searchFromI = _findIndexAfterTag(html, endTagI);
  }
  return results;
}