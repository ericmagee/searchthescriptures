// W2 pkgALT: run Init Seats (live s119 and candidate) on planted debates; print panel, reserve, alternates, single judge.
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const src=(f,n)=>g(f).nodes.find(x=>x.name===n).parameters.jsCode;
const LIVE='/mnt/project-files/wall2024/fetchback_live_s119.json',CAND='/mnt/project-files/wall2024/parent_s119_ALT.json';
const run=async(f,body,asked,refuse=[],jfl=[])=>{const s=src(f,'Init Seats');const acc={seats:asked.map(x=>({seat:x,placed:refuse.indexOf(x)<0,status:refuse.indexOf(x)<0?'placed':'refused'}))};
 const $=n=>{if(n==='Accept Models')return {all:()=>jfl.map(x=>({json:{seat:x,jfl_move:true}}))};throw new Error('no '+n);};const ex={id:1,customData:{set(){}}};
 try{const o=await new Function('$','$input','$execution','return (async()=>{'+s+'})();')($,{first:()=>({json:{acc,src:{body}}})},ex);const j=o[0].json;return 'panel '+j.panel_order.join(',')+' | reserve '+j.panel_reserve+' | alt '+j.alt_order.join(',')+' | single '+j.single_judge;}catch(e){return 'REFUSED: '+String(e.message).replace(/ run_token=.*/,'').slice(0,200);}};
// seats the agreement asks = Accept Build ORDER minus debaters minus qwen
const asked=(order,deb)=>order.filter(s=>deb.indexOf(s)<0&&s!=='qwen');
const OL=['chatgpt','sol','luna','haiku','qwen'],OC=['chatgpt','sol','luna','grok','argon','haiku','qwen'];
const B=(d,c)=>({topic:'t',defender:{engine:d,profile:'plain'},challenger:{engine:c,profile:'oracle'}});
(async()=>{for(const [name,d,c,ref,jfl] of [
 ['E1 claude v opus, grok on the fault ledger','claude','opus',[],['grok']],
 ['E2 claude v opus, chatgpt on the fault ledger','claude','opus',[],['chatgpt']],
 ['E3 claude v opus, argon refuses the posture','claude','opus',['argon'],[]],
 ['E4 claude v opus, all three alternates refuse','claude','opus',['grok','argon','haiku'],[]],
 ['E5 claude v opus, chatgpt ledger + grok ledger','claude','opus',[],['chatgpt','grok']],
 ['E6 gemini v grok','gemini','grok',[],[]],
 ['E7 chatgpt v opus (Wall 4622 case 1)','chatgpt','opus',[],[]],
 ['E8 claude v opus, sol refuses (Wall 4622 case 2)','claude','opus',['sol'],[]],
 ['E9 claude v opus, sol refuses, grok ledger','claude','opus',['sol'],['grok']]]){
 console.log('##',name,'\n live:',await run(LIVE,B(d,c),asked(OL,[d,c]),ref,jfl),'\n cand:',await run(CAND,B(d,c),asked(OC,[d,c]),ref,jfl));}})();
