// pkgKBL fold probe (W1, 11-09). Run from wall2024/: node pkgKBL/fold/probe_KBF.cjs  (lbFoot from Cure_Check, base strip_KBL = live s72, patched strip_KBF)
const get=require('../lbfoot_probe.cjs');const o=get('pkgLIB/strip_KBL/patched/Cure_Check.js'),n=get('pkgLIB/strip_KBF/patched/Cure_Check.js');
const W=[['[L2] synerchomai (G4905, Cohabit conjugally)','["L2"]'],['[L2] synerchomai (Cohabit conjugally, G4905)','["L2"]'],['[L2] ginosko (G1097, "To know")','["L2"]'],['[L2] chen (H2580, grace)','["L2"]'],
 ['[L2] chen (H2580)','[]'],['with (G1097, To know)','[]'],['Jesus (G2424, Saviour)','[]'],
 ['[L2] eido (G1492, L1)','[]'],['[L2] see (G1492, LINK 3)','[]'],['[L2] word (G1, NONE)','[]'],['[L2] agape (Greek, G26)','[]'],["[L2] agape (Strong's, G26)",'[]'],
 ['[L2] parthenos (G3933, Virgin)','["L2"]'],['[L2] almah (H5959, Young woman)','["L2"]'],['Mary (G3137, Mary)','[]'],['[L2] agape (Hebrew H157, love)','[]'],['[L2] word (G1, None given)','[]'],['[L2] chen (H2580, Root of favour)','["L2"]']];let ok=0,bad=0;
for(const [t,want] of W){const a=JSON.stringify(o(t,true)),b=JSON.stringify(n(t,true));const g=b===want;g?ok++:bad++;console.log((g?'OK ':'FAIL ')+a+' -> '+b+' | '+t);}console.log('TOTAL '+ok+' OK, '+bad+' FAIL');
