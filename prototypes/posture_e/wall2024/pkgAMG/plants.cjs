// pkgAMG plants: enf428Cure (live s141 vs the parent) on planted E-ANS send-back answers. Expected status beside each.
const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflowData||j.workflow||j;};
const lib=w=>{const T=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/');return JSON.parse(T.slice(a+8,b));};
const mk=Lb=>{const def=name=>{const i=Lb.findIndex(l=>new RegExp('(?:function |const |let )'+name+'\\b').test(l));let j=i,src='';while(j<Lb.length){src+=Lb[j]+'\n';try{new Function(src);return src;}catch(e){j++;}}};
 let src=def('enf428Cure');for(let k=0;k<30;k++){try{const f=new Function(src+';return enf428Cure;')();f({rule:'E-ANS',line:'ANSWER CHECK: Luke 1:1 -- [CR3] -- MEANS: "a b c" -- ANSWER: "a b c d" -- FAILS -- x'},{ans:'CHANGE',to:'ANSWER CHECK: Luke 1:1 -- [CR3] -- MEANS: "a b c" -- ANSWER: "a b c d" -- MEETS -- x'},{CR3:'a b c d'});return f;}catch(e){const m=String(e.message).match(/(\w+) is not defined/);if(!m)throw e;src=def(m[1])+src;}}};
const O=mk(lib(load('/mnt/project-files/wall2024/fetchback_live_s141.json'))),G=mk(lib(load(process.argv[2])));
const R={CR3:'The word names the reckoning by law and usage, as the law counts a son by his fathers house.',DR3:'Luke himself marks son of Joseph as supposed in the verse.'};
const L=(g,ans)=>'ANSWER CHECK: Luke 3:23 -- [CR3] -- MEANS: "Luke himself marks son of Joseph as supposed" -- ANSWER: "'+ans+'" -- '+g+' -- x';
const A1='The word names the reckoning by law and usage',A2='as the law counts a son by his fathers house';
const P=[ // [flagged line, enforcer reason, answer, expected new status]
 [L('FAILS',A1),'(right: MEETS): fits',{ans:'CHANGE',to:L('MEETS',A1)},'CURED','FAILS, right MEETS, CHANGE TO MEETS on the same answer'],
 [L('MISSES',A1),'(right: MEETS): fits',{ans:'CHANGE',to:L('MEETS','names the reckoning by law and usage')},'CURED','MISSES, right MEETS, CHANGE TO MEETS on a shorter cut of it'],
 [L('MEETS',A1),'(right: MISSES): no fit',{ans:'CHANGE',to:L('MEETS',A1)},'UNCURED','MEETS, right MISSES, CHANGE TO MEETS on the same answer (old test kept)'],
 [L('FAILS',A1),'(right: MISSES): misses',{ans:'CHANGE',to:L('MEETS',A1)},'UNCURED','FAILS, right MISSES, CHANGE TO MEETS on the same answer'],
 [L('FAILS',A1),'(right: MEETS): fits',{ans:'CHANGE',to:L('MEETS','words that stand in no round of the side')},'UNCURED','FAILS, right MEETS, CHANGE TO MEETS on words not in the round'],
 [L('FAILS',A1),'(right: MEETS): fits',{ans:'CHANGE',to:L('MISSES',A1)},'CURED','FAILS, right MEETS, CHANGE TO MISSES (unchanged rule)'],
 [L('FAILS',A1),'(right: MEETS): fits',{ans:'CHANGE',to:L('MEETS',A1+'. '+A2).replace('" -- MEETS','" -- MEETS')},'CURED','FAILS, right MEETS, CHANGE TO MEETS on a fuller answer (unchanged)'],
];
let ok=0;for(const [line,reason,a,want,d] of P){const it={rule:'E-ANS',line,reason};const o=O(it,a,R).status,n=G(it,a,R);const r=n.status===want?'OK':'WRONG';if(r==='OK')ok++;console.log(r.padEnd(6),'old',o.padEnd(8),'new',n.status.padEnd(8),'want',want.padEnd(8),'|',d,'|',n.why.slice(0,90));}
console.log('plants',P.length,'right',ok);
