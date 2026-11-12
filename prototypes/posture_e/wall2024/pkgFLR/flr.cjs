// pkgFLR replay and plants. $ supports all(branch, run) over the stored runs (n8n semantics: no run index = last run; a missing run throws).
const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const LV=load('/mnt/project-files/wall2024/fetchback_live_s149.json'),PK=load(process.argv[2]);
const mask=s=>JSON.stringify(s).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z?/g,'T');
const node=(runs,params)=>{const R=runs||[];const last=R.length?R[R.length-1]:[];return {isExecuted:R.length>0,params:params||{},first:()=>last[0],last:()=>last[last.length-1],item:last[0],
 all:(b,r)=>{if(r===undefined)return last;if(r<0||r>=R.length)throw new Error('run '+r+' out of range');return R[r];}};};
const mk=(rd,W,over)=>name=>{const nd=W.nodes.find(n=>n.name===name)||{};if(over&&over[name])return node(over[name],nd.parameters);const r=rd[name];return node(r?r.map(x=>(x.data.main.flat().filter(Boolean))):[],nd.parameters);};
const run=async(W,rd,name,input,over)=>{const src=W.nodes.find(n=>n.name===name).parameters.jsCode;const $input={all:()=>input,first:()=>input[0],last:()=>input[input.length-1],item:input[0]};return await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk(rd,W,over),$input);};
const inpOf=(rd,n,ri)=>{const sc=rd[n][ri].source[0];return rd[sc.previousNode][sc.previousNodeRun||0].data.main[sc.previousNodeOutput||0]||[];};
const st=(m,seat)=>{const el=(m.enforcer_log||[]).filter(x=>x.seat===seat&&x.kind==='cure');return seat+': '+el.length+' cure rows, '+el.filter(x=>/no cure call was made/.test(x.cure_reason||'')).length+' "no cure call", '+el.filter(x=>/FOLLOW-UP MARK/.test(x.cure_reason||'')).length+' FOLLOW-UP MARK, tried '+JSON.stringify((m.alternates_tried||[]).filter(t=>t.alternate===seat).map(t=>t.result+(t.why?' ('+t.why+')':'')));};
(async()=>{let tot=0,eq=0;
for(const f of fs.readdirSync('/mnt/project-files/wall2024').filter(f=>/^ex3\d+_full\.json$/.test(f))){let rd;try{rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8')).data.resultData.runData;}catch(e){continue;}
 for(const n of ['Alternate Merge Seat','R2 Alternate Merge Seat']){if(!rd[n]||JSON.stringify(rd[n]).includes('isArtificialRecoveredEventItem'))continue;for(let ri=0;ri<rd[n].length;ri++){const inp=inpOf(rd,n,ri);
  const a=await run(LV,rd,n,inp),b=await run(PK,rd,n,inp);tot++;if(mask(a)===mask(b))eq++;else console.log('DIFF',f,n,ri);}}}
console.log('Merge Seat runs',tot,'equal',eq);
// plants on 35296 (two alternates, one cure Normalize run holding argon k1)
const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35296_full.json','utf8')).data.resultData.runData;const n='Alternate Merge Seat';const inp=inpOf(rd,n,0);
const CN=rd['Alternate Cure Normalize'][0].data.main[0];const ar=CN[0];const other={json:{...ar.json,cure:{...ar.json.cure,k:0,seat:'grok'},reply:{ok:true,text:'RESPONSE: none'}}};
const P=[['P1 as stored: one Normalize run [argon]',[[ar]]],
 ['P2 follow-up loop for the other alternate: runs [argon, other] then [other]',[[ar,other],[other]]],
 ['P3 follow-up loop for argon: runs [argon, other] then [argon (follow-up)]',[[ar,other],[{json:{...ar.json,fum_marker:true}}]]],
 ['P5 latest run wins: runs [argon, other] then [argon whose reply is marked FOLLOW-UP MARK]',[[ar,other],[{json:{...ar.json,reply:{ok:false,why:'FOLLOW-UP MARK'}}}]]],
 ['P4 follow-up for both: runs [argon, other] then [other, argon]',[[ar,other],[other,ar]]]];
for(const [k,runs] of P){const o={'Alternate Cure Normalize':runs};const a=(await run(LV,rd,n,inp,o))[0].json,b=(await run(PK,rd,n,inp,o))[0].json;console.log(k,'\n  live:',st(a,'argon'),'\n  pkg: ',st(b,'argon'));}
})();
