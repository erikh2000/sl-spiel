// To defend against irregularly-formatted HTML, this function checks for nested tags.
export function stripHtml(html:string):string {
  let stripped = '';
  let insideTagLevel = 0;
  for(let i = 0; i < html.length; ++i) {
    const char = html.charAt(i);
    if (char === '<') {
      ++insideTagLevel;
    } else if (char === '>') {
      --insideTagLevel;
    } else if (insideTagLevel === 0) {
      stripped += char;
    }
  }
  return stripped;
}