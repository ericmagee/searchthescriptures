// W1 grade of pkgPLT (W2): plants D1-D12 (w1_plants/plants_DS1_F1_F2_w1.json, recorded before the build) run through the library lines entry/blocksOf/answerFor of live s116 and the candidate.
const fs=require('fs');const W='/mnt/project-files/wall2024/';
const libOf=f=>{const L=JSON.parse(fs.readFileSync(W+f));const w=(L.data||L).workflow||L.data||L;const lib=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return JSON.parse(lib.slice(lib.indexOf('/*LIB*/')+7,lib.indexOf('/*MAP*/')).trim().replace(/;$/,''));};
const mkFn=a=>{const R0=a[3271],src=[a[3153],a[3272],a[3273],a[3274]].join('\n');return (LIST,ANS)=>new Function('LIST','ANS',src+'\nreturn {entry,answerFor};')(LIST,ANS);};
const LV=mkFn(libOf('fetchback_live_s116.json')),CD=mkFn(libOf('parent_s116_PLT.json'));
const lv=libOf('fetchback_live_s116.json'),cd=libOf('parent_s116_PLT.json');const ch=lv.map((l,i)=>l!==cd[i]?i:-1).filter(i=>i>=0);console.log('library lines changed:',ch.join(', '),'| line count',lv.length,cd.length);
const body=h=>h+'\nThe reading of this link is answered here with [L1] and [L2].';
const C=[
 ['D1','D','4. LINK 1: that the timing rows enclose the whole pregnancy.',['## LINK 1: SUPPORTED','## LINK 2: SUPPORTED'],'LINK 1'],
 ['D2','D','4. LINK 2: the naming follows the taking.',['## LINK 2: SUPPORTED','## LINK 4: SUPPORTED'],'LINK 2'],
 ['D3','D','4. LINK 4: the same link.',['## LINK 4: SUPPORTED'],'LINK 4'],
 ['D4','D','4. The inference that the till clause bounds the abstinence.',['## LINK 4: SUPPORTED'],'LINK 4'],
 ['D5','D','4. LINK 1: tagged elsewhere.',['## LINK 1 [premise 4]: SUPPORTED'],'LINK 1 [premise 4]'],
 ['D6','D','4. LINK 1: tag wins.',['## LINK 3 [premise 4]: SUPPORTED','## LINK 1: SUPPORTED'],'LINK 3 [premise 4]'],
 ['D7','D','4. LINK 7: an absent link.',['## LINK 1: SUPPORTED','## LINK 4: SUPPORTED'],'NONE'],
 ['D8','D','4. **LINK 1:** bold tag.',['**LINK 1: SUPPORTED**'],'LINK 1'],
 ['D9','D','4) LINK 1 - paren and dash.',['## LINK 1: SUPPORTED'],'LINK 1|RECORD'],
 ['D10','D','4. LINKS 1 and 2: two links.',['## LINK 1: SUPPORTED','## LINK 2: SUPPORTED'],'RECORD'],
 ['D11','D','4. LINK 1: duplicate block.',['## LINK 1: NARROWED TO: the taking','## LINK 1: SUPPORTED'],'RECORD'],
 ['D12','C','2. LINK 3: challenger side.',['## LINK 3: SUPPORTED','## LINK 2: SUPPORTED'],'LINK 3'],
 ['D13','D','4. The premise rests on LINK 1 and the till clause.',['## LINK 1: SUPPORTED','## LINK 4: SUPPORTED'],'LINK 4 (LINK not at start: old lookup)'],
 ['D14','D','4. LINK 01: leading zero.',['## LINK 1: SUPPORTED','## LINK 4: SUPPORTED'],'RECORD'],
 ['D15','D','4. Link 1: lower-case tag.',['## LINK 1: SUPPORTED','## LINK 4: SUPPORTED'],'RECORD'],
];
const show=a=>a?a.t.split('\n')[0]+' ['+a.by+']':'NONE (no block text shown)';
for(const [id,sd,ent,heads,exp] of C){const n=+ent.match(/^\W*(\d+)/)[1];const list='\n'+(n>1?'1. LINK 1: first.\n':'')+ent+'\n9. other.';const ans='Opening.\n'+heads.map(body).join('\n');
 const LIST={D:null,C:null},ANS={D:'',C:''};LIST[sd]=list;ANS[sd]=ans;const L=LV(LIST,ANS),Cn=CD(LIST,ANS);const e=Cn.entry(sd,n);
 console.log(id,'| entry',JSON.stringify(e).slice(0,40),'| live:',show(L.answerFor(sd,n)),'| cand:',show(Cn.answerFor(sd,n,e)),'| expected',exp);}
