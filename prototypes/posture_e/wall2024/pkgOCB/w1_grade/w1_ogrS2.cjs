// W1 grade note: C4/C4G/C4B Extract keep a local __ogrS2 (GRANTS only) for the record field new_press; B3 did not reach it.
const p=require('../parent_s83_OCB.json');
const t="Close.\nOPPONENT'S GRANTS:\nG1 [CR2] \"Luke 1:34 shows\"\n\nOPPONENT'S CONTRADICTIONS:\nX1 LINK 6 | EARLIER [CR3] \"For this birth Matthew 1:18 states a different order\" | CLOSING [CR4] \"Christ had no biological father.\" | why\n";
for(const nm of ['C4 Extract','C4G Extract','C4B Extract']){const c=p.nodes.find(x=>x.name===nm).parameters.jsCode;
 const m=c.match(/const __ogrS2=t=>\{.*?\}; \/\*/s)[0].replace(/; \/\*$/,'').replace('const __ogrS2','globalThis.__ogrS2');(0,eval)(m);
 const o=__ogrS2(t);console.log(nm,'| X quote blanked:',!/Matthew 1:18/.test(o),'| G quote blanked:',!/Luke 1:34/.test(o));}
