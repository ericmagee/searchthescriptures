/* pkgEOR (W1 2881 D7 option A): a side's own out-of-round marker ends its close round. A line that opens (after any *, _, > or spaces) with
   "Note, outside the round" or "outside the round" starts the out-of-round tail; the words from there on are not close-round words. */
const EOR_MARK=/^[ \t>*_]*(?:note,?[ \t]+)?outside the round\b/im;
function eorHead(t){const s=String(t||'');const m=s.match(EOR_MARK);return m?s.slice(0,m.index):s;}
function eorTail(t){const s=String(t||'');const m=s.match(EOR_MARK);return m?s.slice(m.index):'';}
