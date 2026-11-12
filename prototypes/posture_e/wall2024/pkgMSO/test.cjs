// pkgMSO tests: replay of both Merge Seats on the stored exports (s151 vs package), and delivery plants on the guard.
const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const LV=load('/mnt/project-files/wall2024/fetchback_live_s151.json'),PK=load(process.argv[2]);
const mask=s=>JSON.stringify(s).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z?/g,'T');
const node=(runs,params)=>{const R=runs||[];const last=R.length?R[R.length-1]:[];return {isExecuted:R.length>0,params:params||{},first:()=>last[0],last:()=>last[last.length-1],item:last[0],all:(b,r)=>{if(r===undefined)return last;if(r<0||r>=R.length)throw new Error('run '+r+' out of range');return R[r];}};};
const mk=(rd,W,over)=>name=>{const nd=W.nodes.find(n=>n.name===name)||{};if(over&&over[name])return node(over[name],nd.parameters);const r=rd[name];return node(r?r.map(x=>(x.data.main.flat().filter(Boolean))):[],nd.parameters);};
const run=async(W,rd,name,input,over)=>{const src=W.nodes.find(n=>n.name===name).parameters.jsCode;const $input={all:()=>input,first:()=>input[0],last:()=>input[input.length-1],item:input[0]};return await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk(rd,W,over),$input);};
const inpOf=(rd,n,ri)=>{const sc=rd[n][ri].source[0];return rd[sc.previousNode][sc.previousNodeRun||0].data.main[sc.previousNodeOutput||0]||[];};
(async()=>{let tot=0,eq=0;
for(const f of fs.readdirSync('/mnt/project-files/wall2024').filter(f=>/^ex3\d+_full\.json$/.test(f))){let rd;try{rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8')).data.resultData.runData;}catch(e){continue;}
 for(const n of ['Alternate Merge Seat','R2 Alternate Merge Seat']){if(!rd[n]||JSON.stringify(rd[n]).includes('isArtificialRecoveredEventItem'))continue;for(let ri=0;ri<rd[n].length;ri++){const inp=inpOf(rd,n,ri);
  let a,b;try{a=await run(LV,rd,n,inp);}catch(e){a='ERR '+e.message;}try{b=await run(PK,rd,n,inp);}catch(e){b='ERR '+e.message;}tot++;if(mask(a)===mask(b))eq++;else console.log('DIFF',f,n,ri,typeof b==='string'?b:(b||[]).length);}}}
console.log('Merge Seat replay runs',tot,'equal',eq);
// Plants: take 34852 (alternate with a follow-up) as the base run data and vary the Normalize runs and the delivered input.
const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34852_full.json','utf8')).data.resultData.runData;
const NR=rd['Alternate Cure Normalize'].map(x=>x.data.main.flat().filter(Boolean));const base=NR[NR.length-1][0];
const it=(who,k,fum)=>({json:{...base.json,cure:{...(base.json.cure||{}),who,k},fum:fum?{body:{}}:undefined,fum_done:!fum}});
const A0=it('argon',0,false),G0=it('grok',1,true),G1=it('grok',1,false);
const cases=[
 ['P1 35379 order, grok delivery from run 1 (first)',[[A0,G0],[G1]],[G1],'goes on'],
 ['P2 35379 order, argon delivery from run 0 (second)',[[A0,G0],[G1]],[A0],'stops'],
 ['P3 argon delivery first, grok still waits',[[A0,G0]],[A0],'stops'],
 ['P4 no follow-up, both in one delivery',[[A0,it('grok',1,false)]],[A0,it('grok',1,false)],'goes on'],
 ['P5 one alternate with a follow-up (34852 shape)',[[it('haiku',0,true)],[it('haiku',0,false)]],[it('haiku',0,false)],'goes on'],
 ['P6 input with no cure key (skip path)',[[A0]],[{json:{alt:{seat:'x'}}}],'goes on'],
 ['P7 Normalize not run',null,[{json:{alt:{seat:'x'}}}],'goes on'],
];
for(const [nm,runs,inp,want] of cases){const over=runs?{'Alternate Cure Normalize':runs}:{'Alternate Cure Normalize':[]};let o;try{o=await run(PK,rd,'Alternate Merge Seat',inp,over);}catch(e){o='ERR '+e.message.slice(0,120);}
 const got=Array.isArray(o)?(o.length?'goes on':'stops'):o;let lv;try{lv=await run(LV,rd,'Alternate Merge Seat',inp,over);}catch(e){lv='ERR';}
 console.log((got===want?'OK  ':'FAIL'),nm,'| package',got,'| live',Array.isArray(lv)?(lv.length?'goes on':'stops'):lv);}
// R2 plant: same two-delivery shape on the R2 seat
const over2={'R2 Alternate Cure Normalize':[[A0,G0],[G1]]};const r2a=await run(PK,rd,'R2 Alternate Merge Seat',[A0],over2).catch(e=>'ERR '+e.message);const r2b=await run(PK,rd,'R2 Alternate Merge Seat',[G1],over2).catch(e=>'ERR '+e.message);
console.log('R2 stale delivery:',Array.isArray(r2a)?(r2a.length?'goes on':'stops'):r2a,'| R2 last delivery:',Array.isArray(r2b)?(r2b.length?'goes on':'stops'):r2b);
})();
