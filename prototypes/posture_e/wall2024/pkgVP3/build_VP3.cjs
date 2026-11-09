// pkgVP3 build (W4). node build_VP3.cjs <live fetch-back.json> <out parent.json>
// Patches Send Back Record, Alt Send Back Record, R2 Alt Send Back Record: P3 TRIAL (record-only), three anchors each.
const fs=require('fs');const [,,src,dst]=process.argv;let W=JSON.parse(fs.readFileSync(src,'utf8'));W=W.data||W;W=W.workflow||W;
const MOD=fs.readFileSync(__dirname+'/vp3_mod.js','utf8');
const A1="let __RD=null;for(const n of ['Panel Cure Normalize 1'";
const A2="__r.cure_status=__o.status;__r.cure_reason+=' | CURE (E-OOR code reading of the replaced line, pkgVP1; record-only): '+__o.status+' -- '+__o.why;}}}}\n});});";
const A3="b7_counted},sb_rows:rows";
const ITEM="__r.cure_status=__o.status;__r.cure_reason+=' | CURE (E-OOR code reading of the replaced line, pkgVP1; record-only): '+__o.status+' -- '+__o.why;}}}}\n"+
"  /* pkgVP3 TRIAL (record-only): two readers on an E-ANS or E-HOLD DeepSeek DISAGREE; lists the seat it would remove; counts nothing */\n"+
"  if((it.rule==='E-ANS'||it.rule==='E-HOLD')&&!it.grt2){const __r=rows[rows.length-1];let __v=null;try{__v=vp3Trial2024(it,a,__RD,__r.cure_status);}catch(e){__v={agree:false,note:'TRIAL pkgVP3: NOT CHECKED -- '+String(e&&e.message||e).slice(0,160)};}\n"+
"   if(__v){let __n=__v.note;if(__v.agree&&__v.would&&(silent||err))__n=__n.replace(/WOULD REMOVE %SEAT%[^;]*/,'no written answer; silence is counted already (pkgSBS)');\n"+
"    __r.cure_reason+=' | '+__n.replace('%SEAT%',b.seat);__VP3.checked++;if(__v.agree)__VP3.agree++;if(__v.agree&&__v.would&&!silent&&!err)(__VP3.would_remove[b.seat]=__VP3.would_remove[b.seat]||[]).push(it.sid+' ('+it.rule+' '+String(it.item||'').slice(0,60)+')');}}\n"+
"});});";
let n=0;for(const nd of W.nodes){if(!['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record'].includes(nd.name))continue;let c=nd.parameters.jsCode;
 for(const a of [A1,A2,A3])if(c.split(a).length!==2)throw new Error(nd.name+': anchor count '+(c.split(a).length-1)+' for '+a.slice(0,40));
 if(c.includes('pkgVP3'))throw new Error(nd.name+': already has pkgVP3');
 c=c.replace(A1,()=>MOD+'const __VP3={status:"TRIAL",checked:0,agree:0,would_remove:{}};\n'+A1).replace(A2,()=>ITEM).replace(A3,()=>"b7_counted,vp3_trial:__VP3},sb_rows:rows");
 nd.parameters.jsCode=c;n++;}
if(n!==3)throw new Error('patched '+n+' nodes');
fs.writeFileSync(dst,JSON.stringify(W));console.log('patched 3 nodes ->',dst);
