// W1 plants for pkgRCH: the heading test of cecReclaim, live s130 vs RCH, after the code's own strip.
const st=x=>x.replace(/[*_]+/g,'').replace(/^[\s>#-]+/,'').trim();
const OLD=/^LINK\s+(\d+)\s*:\s*(NARROWED TO|CONCEDED?|WITHDRAWN|DROPPED)\b.*$/i, NEW=/^LINK\s+(\d+)\s*(?:\[[^\]\n]*\]|\([^)\n]*\))?\s*:\s*(NARROWED TO|CONCEDED?|WITHDRAWN|DROPPED)\b.*$/i;
const P=[
['Y','LINK 2 [premise 3]: NARROWED TO: Matthew 1:25 ...','2 narrowed'],['Y','LINK 13 [§VII]: CONCEDED — it floats free.','13 conceded'],['Y','LINK 4 (Premise 4): CONCEDED','4'],
['Y','LINK 4 (premise 4, D2): CONCEDED as to the clause','4'],['Y','LINK 5 (D5): CONCEDED as written','5'],['Y','LINK 2 ("carried by the woman"): CONCEDED.','2'],
['Y','LINK 4 (Galatians 4:4): NARROWED TO: made of a woman','4'],['Y','**LINK 3 [premise 2]:** NARROWED TO: x','3'],['Y','- LINK 3 [p 2] : WITHDRAWN','3'],['Y','### LINK 6 (D6): DROPPED','6'],
['Y','LINK 1: NARROWED TO: plain form','1'],['Y','link 2 [premise 3]: narrowed to: lower case','2'],['Y','LINK 2 []: CONCEDED','2 (empty bracket)'],
['N','LINK 2 [premise 3] holds: NARROWED TO x','text after bracket'],['N','LINK 2 holds because: NARROWED TO x','prose'],['N','LINK 2 (premise 3): SUPPORTED','not a drop kind'],
['N','LINK 2 (not CONCEDED): SUPPORTED','kind word inside parens only'],['N','The defender says LINK 2 [premise 3]: NARROWED TO x','not at line start'],['N','LINK 2 [premise 3: NARROWED TO x','unclosed bracket'],
['N','LINK 2 (see LINK 3): SUPPORTED','pointer'],['N','LINK 2 [a] [b]: CONCEDED','two groups (miss expected)'],['N','LINK 2 (premise (a)): CONCEDED','nested parens (miss expected)'],
['N','LINK 2 [premise 3]\n: CONCEDED','colon on the next line'],['N','LINKS 2 and 3 [premise 3]: CONCEDED','plural'],['N','LINK 2 (premise 3): CONCEDING nothing','CONCEDING'],
['?','LINK 2 (the challenger says: CONCEDED): NARROWED TO x','colon and kind inside parens'],['?','LINK 2 (premise 3) — CONCEDED','dash instead of colon']];
let bad=0;for(const [exp,l,note] of P){const s=st(l.split('\n')[0]);const o=s.match(OLD),n=s.match(NEW);const got=n?'match link '+n[1]+' '+n[2]:'no match';const ok=exp==='?'||(exp==='Y')===!!n;if(!ok)bad++;console.log((ok?'ok  ':'BAD ')+exp,'| old',o?'match':'-','| new',got,'|',JSON.stringify(l).slice(0,60),'|',note);}
console.log('plants',P.length,'unexpected',bad);
