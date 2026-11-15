// ASK 339 replay: Format Markdown PRE (live s227) vs POST (target_339) on every stored run with a synthesis. Quote Report for S-C runs from the live s227 citation pipeline over REST.
const fs=require('fs');const W=f=>JSON.parse(fs.readFileSync(f));const K='sb_publishable_rgfWFjynRqBdzyEeBRHcig_c6pHysAi';
const g=(w,n)=>w.nodes.find(x=>x.name===n).parameters.jsCode;const L=W(process.argv[2]||'../rdf/fetchback_s227_342.json'),T=W(process.argv[3]||'target_339.json');
const FMpre=g(L,'Format Markdown'),FMpost=g(T,'Format Markdown');const C={cs:g(L,'Citation Scan'),qc:g(L,'Quote Compare'),qr:g(L,'Quote Report')};
const get=async u=>{for(let k=0;k<5;k++){try{const r=await fetch(u,{headers:{apikey:K,Authorization:'Bearer '+K}});const j=await r.json();if(Array.isArray(j))return j;}catch(e){}await new Promise(r=>setTimeout(r,800*(k+1)));}throw new Error('fetch');};
const mk=M=>n=>{const m=M[n];return m?{isExecuted:true,all:()=>m.map(j=>({json:j})),first:()=>({json:m[0]})}:{isExecuted:false,all:()=>[],first:()=>{throw new Error('no '+n);}};};
const EX=(c,M)=>new Function('$','$input',c)(mk(M),{all:()=>[{json:{}}],first:()=>({json:{}})})[0].json;
async function QR(R){const F={cr1:R.claude_r1||'',gr1:R.engine_r1||'',cr2:R.claude_r2||'',gr2:R.engine_r2||'',cr3:R.engine_r3||'',dr3:R.challenger_r3||'',cr4:R.defender_r4||'',dr4:R.challenger_r4||'',synthesis:R.synthesis||''};
 const M={'Final Output':[F],'Init Seats':[{run_token:'X'}]};const cs=EX(C.cs,M);M['Citation Scan']=[cs];M['Cited Verses']=await get(cs.url_cited);const qc=EX(C.qc,M);M['Quote Compare']=[qc];M['Find Words']=await get(qc.url_find);return EX(C.qr,M);}
const SCN=new Function(fs.readFileSync(__dirname+'/scn339.js','utf8')+';return __SCNmk;')();
(async()=>{const rows=W('rows/full.json'),J=W('rows/jud.json');const GV=(await get('https://bhffmkginddovmdcpnty.supabase.co/rest/v1/kjv_verses?select=text&book=eq.Isaiah&chapter=eq.28&verse=eq.10'))[0];
 let same=0,diff=0,err=0,sc=0,nl=0,bad=0;const out=[];
 for(const r of rows.sort((a,b)=>String(a.run_token||a.id)<String(b.run_token||b.id)?-1:1)){const hasSC=/SYNTHESIS CHECK \(S-C\) -- /.test(r.review_notes||'');const M={'Get Row':[r],'Get Judgments':J.filter(j=>j.debate_id===r.id),'Get Verse':[GV]};
  let q=null;if(hasSC){sc++;q=await QR(r);M['Quote Report']=[q];}
  let a,b;try{a=EX(FMpre,M).md;}catch(e){a='ERR '+e.message;}try{b=EX(FMpost,M).md;}catch(e){b='ERR '+e.message;}
  if(/^ERR/.test(a)||/^ERR/.test(b)){err++;out.push('ERROR '+(r.run_token||r.id)+' PRE:'+String(a).slice(0,80)+' POST:'+String(b).slice(0,80));}
  if(a===b)same++;else{diff++;const A=a.split('\n'),B=b.split('\n');out.push('== CHANGED '+(r.run_token||r.id)+' lines '+A.length+'/'+B.length);
   if(A.length!==B.length)bad++;for(let i=0;i<Math.max(A.length,B.length);i++)if(A[i]!==B[i]){nl++;if(!(typeof B[i]==='string'&&B[i].startsWith(String(A[i]).replace(/\s+$/,'')+' [SYSTEM CHECK S-C: ')&&/this line says no side charged (?:it|them)\.\]$/.test(B[i])))bad++;out.push('  PRE  '+String(A[i]).slice(0,160));out.push('  POST '+String(B[i]).slice(-260));}}
  if(hasSC){const s0=a.indexOf('## Synthesis\n\n');const s1=a.indexOf('\n\n',a.indexOf('\n\n',s0+14)+2);const s2=a.indexOf('\n\n**Synthesis checks**',s1);const syn=a.slice(s1+2,s2);const INFO=[];SCN(r,q,GV.text,INFO)(syn);
   out.push('-- S-C '+(r.run_token||r.id));for(const n of INFO)out.push('   INFO '+n.kind+' | '+(n.kind==='words'?'S-C gram "'+n.hit+'" charge gram "'+(n.gram||'')+'" | at '+n.where:'verses '+n.verses.join('; '))+' | '+(n.note?'NOTE at line '+n.at:'no note: '+n.why)+' | line: '+String(n.line).slice(0,90));}}
 console.log('runs',rows.length,'| with S-C',sc,'| identical',same,'| changed',diff,'| errors',err,'| changed lines',nl,'| changed lines that are not PRE line + S-C note',bad);out.forEach(l=>console.log(l));})().catch(e=>{console.error(e);process.exit(1);});
