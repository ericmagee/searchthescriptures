// W2 pkgALT: run Init Seats (live s119 and candidate) on planted debates; print panel, reserve, alternates, single judge.
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const src=(f,n)=>g(f).nodes.find(x=>x.name===n).parameters.jsCode;
const LIVE='/mnt/project-files/wall2024/fetchback_live_s119.json',CAND='/mnt/project-files/wall2024/parent_s119_ALT.json';
const run=async(f,body,asked,refuse=[])=>{const s=src(f,'Init Seats');const acc={seats:asked.map(x=>({seat:x,placed:refuse.indexOf(x)<0,status:refuse.indexOf(x)<0?'placed':'refused'}))};
 const $=n=>{if(n==='Accept Models')return {all:()=>(process.env.JFL?[{json:{seat:'chatgpt',jfl_move:true}},{json:{seat:'sol',jfl_move:true}}]:[])};throw new Error('no '+n);};const ex={id:1,customData:{set(){}}};
 try{const o=await new Function('$','$input','$execution','return (async()=>{'+s+'})();')($,{first:()=>({json:{acc,src:{body}}})},ex);const j=o[0].json;return 'panel '+j.panel_order.join(',')+' | reserve '+j.panel_reserve+' | alt '+j.alt_order.join(',')+' | single '+j.single_judge;}catch(e){return 'REFUSED: '+String(e.message).replace(/ run_token=.*/,'').slice(0,200);}};
// seats the agreement asks = Accept Build ORDER minus debaters minus qwen
const asked=(order,deb)=>order.filter(s=>deb.indexOf(s)<0&&s!=='qwen');
const OL=['chatgpt','sol','luna','haiku','qwen'],OC=['chatgpt','sol','luna','grok','argon','haiku','qwen'];
const B=(d,c)=>({topic:'t',defender:{engine:d,profile:'plain'},challenger:{engine:c,profile:'oracle'}});
(async()=>{for(const [name,d,c,ref] of [['S1 claude v opus, all accept','claude','opus',[]],['S2 chatgpt v opus','chatgpt','opus',[]],['S3 claude v opus, sol refuses the posture','claude','opus',['sol']],['S4 gemini v claude','gemini','claude',[]],['S5 grok v claude','grok','claude',[]],['S6 claude v opus, grok refuses','claude','opus',['grok']],['S7 claude v opus, sol and luna refuse','claude','opus',['sol','luna']]]){
 console.log('##',name,'\n live:',await run(LIVE,B(d,c),asked(OL,[d,c]),ref),'\n cand:',await run(CAND,B(d,c),asked(OC,[d,c]),ref));}})();
