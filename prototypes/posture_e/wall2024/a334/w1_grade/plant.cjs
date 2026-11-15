const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2]));const d=W.workflow||W;
const src=d.nodes.find(n=>n.name==='Assume Check Build').parameters.jsCode;
const i=src.indexOf('const vp4List=');const j=src.indexOf('\n',src.indexOf('return out;};',i));eval(src.slice(i,j+1).replace('const vp4List','globalThis.vp4List'));
const head='UNSUPPORTED-L4 PREMISES\n';
const sameLine=head+'1. LINK 3: The Davidic descent: "The record states Mary of the house of David as the line of the child."\nSTEP: the child is of David through Mary -- ASSUMES: Mary is of the house of David -- ROWS GIVE: Luke 1:27 "to a virgin espoused to a man whose name was Joseph, of the house of David" PRESSED WITH:\nRomans 1:3 "which was made of the seed of David according to the flesh" -- MEANS: x -- PROVEN IN [DR1]\n2. LINK 4: other "a second premise quote that is long enough here." PRESSED WITH:\nMatthew 1:25 "And knew her not" -- MEANS: y -- PROVEN IN [DR1]\n\nPREMISE COUNT: 2';
const ownLine=sameLine.replace('of the house of David" PRESSED WITH:','of the house of David"\nPRESSED WITH:');
for(const [k,t] of [['P-sameline (37510 habit)',sameLine],['P-ownline',ownLine]]){console.log(k,JSON.stringify(vp4List(t,'DEFENDER'),null,0));}
