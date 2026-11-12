const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const LV=load('/mnt/project-files/wall2024/fetchback_live_s147.json'),PK=load('/mnt/project-files/wall2024/parent_s147_GDC.json');
const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35296_full.json','utf8')).data.resultData.runData;
const mk=(W)=>name=>{const r=rd[name];const nd=W.nodes.find(n=>n.name===name)||{};const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:nd.parameters||{}};};
const run=async(W,name,input)=>{const src=W.nodes.find(n=>n.name===name).parameters.jsCode;const $input={all:()=>input,first:()=>input[0],last:()=>input[input.length-1],item:input[0]};return await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk(W),$input);};
const base=rd['Send Back Call openrouter'][0].data.main[0];
const OLD='MISSES (Commitment 3) -- The answer supplies household placement';
const cases=[['as run',s=>s],
 ['P4 S2 reason opens with [CR4]',s=>s.replace(OLD,'MISSES (Commitment 3) -- [CR4] supplies household placement')],
 ['P5 S2 reason opens with bare CR4',s=>s.replace(OLD,'MISSES (Commitment 3) -- CR4 supplies household placement')],
 ['P3 S2 unspaced em dashes',s=>{const i=s.indexOf('SENDBACK: S2 -- CHANGE TO: ');const j=s.indexOf('\\n',i);return s.slice(0,i)+s.slice(i,j).replace('SENDBACK: S2 -- CHANGE TO: ','SENDBACK: S2 -- CHANGE TO: @@').split(' -- ').join('—').replace('@@','')+s.slice(j);}],
];
(async()=>{for(const [k,f] of cases){const s0=JSON.stringify(base[2].json);const s1=f(s0);const inp=[base[0],base[1],{json:JSON.parse(s1)}];
 const out=[];for(const W of [LV,PK]){const B=(await run(W,'Send Back Record',inp))[0].json;const r=B.sb_rows.filter(r=>r.seat==='sol'&&/Ezra 2:59/.test(r.item))[0];out.push(r.cure_status+' | '+String(r.cure_reason).slice(0,160));}
 console.log(k,'changed:',s0!==s1);console.log('  live',out[0]);console.log('  pkg ',out[1]);}})();
