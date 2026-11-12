// pkgGDC unit test: old and new gdsDash2024 on sol's 11 reply lines of run 35296 and on planted forms
const fs=require('fs');const fnOf=f=>{const X=JSON.parse(fs.readFileSync(f,'utf8'));const W=X.data&&X.data.nodes?X.data:X;const c=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const L=JSON.parse(c.slice(c.indexOf('\n/*LIB*/')+8,c.lastIndexOf('\n/*MAP*/')));const i=L.findIndex(l=>/^function gdsDash2024/.test(l));return new Function(L.slice(i,i+3).join('\n')+'\nreturn gdsDash2024;')();};
const O=fnOf('/mnt/project-files/wall2024/fetchback_live_s147.json'),N=fnOf('/mnt/project-files/wall2024/parent_s147_GDC.json');
const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35296_full.json','utf8')).data.resultData.runData;
const row=rd['Send Back Record'].slice(-1)[0].data.main.flat()[0].json.sb_rows.find(r=>r.seat==='sol'&&r.full_reply);
const lines=String(JSON.parse(row.full_reply).reasoning).split('\n').filter(l=>/^SENDBACK/.test(l));
const P=[ // plants: [line, expected 'to' end]
 ['SENDBACK: S1 -- KEEP -- "the words" decide it.','KEEP'],
 ['SENDBACK: S1 || CHANGE TO: ANSWER CHECK: X 1:1 -- [CR3] -- MEANS: "a" -- ANSWER: "b" -- MEETS -- why || reason','(has ||: null)'],
 ['SENDBACK: S2 -- CHANGE TO: CONCEDED LINKS: 2 -- Premise 4 UNEXHIBITED (x); premise 6 UNEXHIBITED (y) -- The block shows "z".','UNEXHIBITED (y)'],
 ['SENDBACK: S3 -- CHANGE TO: KEYSTONE: D5 -- BROKEN -- D2 is broken by "the words" -- The record says "the words".','D2 is broken by "the words"'],
 ['SENDBACK: S4 -- CHANGE TO: Challenger-listed-against premise 1: VOID (Commitment 6) -- The charge\'s "x" is beyond "y".','(no marker: old rule)'],
 ['GATE: G6 -- CHANGE TO: D1 vs C2 (Luke 1:35): DEFENDER LINK BROKEN -- [L1] Luke 1:35 "that holy thing" | [L3] Matthew 1:20 "of the Holy Ghost" -- The record says "that holy thing".','| [L3] Matthew 1:20 "of the Holy Ghost"'],
];
const show=(f,l)=>{const r=f(l);if(r==null)return 'null';const p=r.split(' || ');return 'TO=['+(p[1]||'').slice(-70)+']  REASON=['+(p[2]||'').slice(0,50)+']';};
for(const l of lines){console.log(l.slice(0,22));console.log('  old',show(O,l));console.log('  new',show(N,l));}
console.log('--- plants');for(const [l,x] of P){console.log(l.slice(0,30),'| expected to end:',x);console.log('  old',show(O,l));console.log('  new',show(N,l));}
