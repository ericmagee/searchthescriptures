// ASK 584 C4: run the live Init Seats code (old and new) on every ordered pair of debaters, all judges having accepted.
const fs=require('fs');
const ORDER0=['chatgpt','sol','sol62','haiku','gemini','spark','qwen4max','argon','sonnet'];
function run(code,d,c){
  const body={topic:'test topic for 584',defender:{engine:d,profile:'oracle'},challenger:{engine:c,profile:'plain'}};
  const $input={first:()=>({json:{acc:{seats:ORDER0.map(s=>({seat:s,placed:true}))},src:{body}}}),all:()=>[]};
  const $execution={id:1,customData:{set(){}}};
  const $=n=>({all:()=>[],first:()=>({json:{}})});
  try{const out=new Function('$input','$execution','$',code)($input,$execution,$);const j=out[0].json;
    return {ok:true,panel:j.panel_order,reserve:j.panel_reserve,sj:j.single_judge,D:j.defender,C:j.challenger};}
  catch(e){return {ok:false,err:String(e.message).replace(/ run_token=\S+/,'')};}
}
const oldc=fs.readFileSync(process.argv[2],'utf8'),newc=fs.readFileSync(process.argv[3],'utf8');
const K10=['claude','chatgpt','gemini','grok','mimo','haiku','opus','glm','qwen4max','spark'];const K11=K10.concat(['sol62']);
let same=0,diff=0;const lines=[];
for(const d of K10)for(const c of K10){const a=JSON.stringify(run(oldc,d,c)),b=JSON.stringify(run(newc,d,c));if(a===b)same++;else{diff++;lines.push('DIFF '+d+' v '+c);}}
lines.push('existing 100 pairs: same '+same+', differ '+diff);
const FAM={chatgpt:'openai',sol:'openai',sol62:'openai'};let bad=0;
for(const d of K11)for(const c of K11){if(d!=='sol62'&&c!=='sol62')continue;const r=run(newc,d,c);
  const oa=r.ok?r.panel.filter(s=>FAM[s]):[];const okp=r.ok&&r.panel.length===3&&oa.length===0&&!(FAM[r.reserve])&&!FAM[r.sj];if(!okp)bad++;
  lines.push((okp?'OK  ':'BAD ')+d+' v '+c+': '+(r.ok?'panel '+r.panel.join(',')+' reserve '+r.reserve+' single_judge '+r.sj+' D.mc '+r.D.mc_seat+' C.mc '+r.C.mc_seat:'REFUSED '+r.err));}
lines.push('sol62 pairs: '+(21-bad)+' of 21 OK');
const o=run(oldc,'sol62','claude');lines.push('old code, sol62 v claude: '+(o.ok?'ACCEPTED (unexpected)':'REFUSED '+o.err.slice(0,160)));
console.log(lines.join('\n'));
