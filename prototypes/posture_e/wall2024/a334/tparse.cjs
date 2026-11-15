// E-ASSUME premise parser regexes copied from live Assume Check Build (s221)
const txt=`LINK 3: the Davidic descent of the child -- Quote [CR2]: "The record states Mary of the house of David as the line of the child."
STEP: the child is of David through Mary -- ASSUMES: Mary is of the house of David -- ROWS GIVE: Luke 1:27 "to a virgin espoused to a man whose name was Joseph, of the house of David"
PRESSED WITH:
Romans 1:3 "which was made of the seed of David according to the flesh" -- MEANS: x -- [L2] sperma (seed)`;
const a=txt.match(/ASSUMES\s*:\s*([\s\S]*?)\s*(?:ROWS GIVE\s*:|\nPRESSED WITH|$)/i);
const r=txt.match(/ROWS GIVE\s*:\s*([\s\S]*?)\s*(?:\nPRESSED WITH|$)/i);
const q=String(txt).split(/ASSUMES\s*:/i)[0].match(/["“]([^"”]{12,})["”]/);
console.log('assumes=',a&&a[1]);console.log('rows_give=',r&&r[1]);console.log('quote=',q&&q[1]);
