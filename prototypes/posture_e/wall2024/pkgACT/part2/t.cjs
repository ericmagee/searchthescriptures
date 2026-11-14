const fs=require('fs');const D='/tmp/claude-0/-home-user/86d59483-62fd-5fa0-b8c4-6322500f4823/scratchpad/';
const src=fs.readFileSync(D+'act274/kcnt.js','utf8');const W=JSON.parse(fs.readFileSync(D+'act/target.json','utf8')).nodes.find(n=>n.name==='C4 Extract').parameters.jsCode;const i=W.indexOf('const REFP'),j=W.indexOf('const C4P');
const K=new Function(W.slice(i,j)+'\n'+src+'\nreturn __kcnt;')();
const t=fs.readFileSync(D+'scr/luna_1181.txt','utf8');const body=t.replace(/\\n/g,'\n');
// rp from SUPERSEDED: ORIGINAL -> current line of same kind/verse
const lines=body.split('\n');const sup=[...body.matchAll(/\[AUDIT v27: SUPERSEDED LINE -- SEAT: luna; LABEL: ([^;]*); ORIGINAL: ([\s\S]*?) ; END\]/g)];
const cut=body.indexOf('\n[AUDIT');const main=body.slice(0,cut).split('\n');
const rp=[];for(const s of sup){const o=s[2];const key=o.match(/^(ANSWER CHECK: [^-]+?) --|^(D\d+ vs C\d+)/);if(!key)continue;const k=key[1]||key[2];const n=main.find(l=>l.startsWith(k)&&l!==o)||'';rp.push([o,n,'S?']);}
console.log('rp',rp.length);console.log(K(rp,t,'luna')||'(none)');
// negative: if answer check still MISSES
console.log('neg:',K(rp.map(([o,n,i])=>[o,o,i]),t,'luna')||'(none)');
for(const [o,n] of rp)if(/Luke 1:13/.test(o))console.log('O:',o.slice(0,120),'\nN:',n.slice(0,160));
console.log(main.filter(l=>/Luke 1:13/.test(l)).map(l=>l.slice(0,140)).join('\n'));
