// pkgCPD (W1; W3 2772 item 5, grade_33276, grade_33299): when a cure or send-back changes a side's count, the panel JSON's counted_premises array for
// that side is never re-derived (cureRewrite only ADDS cured premises, ruling 421 B6; sbApply2024 returns cpAdd:null). Three runs stored a stale array:
// 33249 sol, 33276 gemini ([1] after count 0), 33299 gemini ([3] after count 0). Fix, record-only: in cureRewrite (panel branch), for each side whose count
// field this rewrite changed and whose array size no longer equals the count, derive the array from the side's final CONCEDED LINKS line (psGrades COUNTED
// premises; [] at count 0). Written only when the derived set has exactly the count's size; otherwise the array is left and a NOT DERIVED mark is written.
// No seat removed, no count changed, no item raised. psGrades is copied byte for byte from Gate Build into the 13 cure nodes that lack it.
// Base: live s32 (fetchback_live_s32.json). Run from wall2024/: node pkgCPD/build_CPD.cjs [--fb <fetchback.json>] [--on <patched dir>] [--out <dir>]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};
const FB=arg('--fb','/mnt/project-files/wall2024/fetchback_live_s32.json');const OUT=arg('--out','pkgCPD/patched');
const w=JSON.parse(fs.readFileSync(FB,'utf8'));const W=w.data||w;const NS=(W.nodes||W.workflow.nodes);
const ON=arg('--on',null);if(ON)for(const n of NS){const f=ON+'/'+n.name.replace(/ /g,'_')+'.js';if(n.parameters&&typeof n.parameters.jsCode==='string'&&fs.existsSync(f))n.parameters.jsCode=fs.readFileSync(f,'utf8');} /* --on <patched dir>: build on another package's nodes */
const GB=NS.find(n=>n.name==='Gate Build').parameters.jsCode;const PSG=GB.slice(GB.indexOf('// pkgPS: premise grades of a CONCEDED LINKS line\nfunction psGrades('),GB.indexOf('\nfunction sbApply2024('))+'\n';
if(!/^\/\/ pkgPS[^\n]*\nfunction psGrades\(l\)\{[\s\S]*\}\n$/.test(PSG))throw new Error('psGrades cut');
const LIB=`// pkgCPD (W1; W3 2772 item 5): the side's final count line gives the counted_premises array after a changed count. Record-only.
function cpdSync(j,pre,seat){let ob;try{ob=JSON.parse(j);}catch(e){return {j,mark:''};}const T=typeof ob.reasoning==='string'?ob.reasoning:'';let jj=j;const mk=[];
 const lineOf=sd=>{for(const l of T.split('\\n')){const u=String(l).replace(/[*_\`]+/g,'').replace(/^\\s*(?:[-\\u2022]\\s*|\\d+[.)]\\s*)?/,'');if(/^\\[/.test(u))continue;
   if(sd==='CHALLENGER'?/^CHALLENGER\\s+CONCEDED LINKS\\s*:/i.test(u):/^(?:DEFENDER\\s+)?CONCEDED LINKS\\s*:/i.test(u))return u.trim();}return null;};
 for(const [sd,key,ck] of [['DEFENDER','counted_premises_defender','conceded_links'],['CHALLENGER','counted_premises_challenger','challenger_conceded_links']]){
  const cur=ob[key],n=ob[ck];if(!Array.isArray(cur)||!Number.isInteger(n)||!pre||pre[ck]==null||pre[ck]===n||cur.length===n)continue;
  const L=lineOf(sd);let set=null,why='';if(n===0)set=[];else if(!L)why='no '+sd+' count line in the text';else{const g=psGrades(L);if(!g||g.n!==n)why='the count line does not give the count '+n;else{const c=Object.keys(g.g).map(Number).filter(k=>g.g[k]==='COUNTED').sort((a,b)=>a-b);if(c.length===n)set=c;else why='the count line names '+c.length+' counted premise(s) ('+(c.join(', ')||'none')+') for a count of '+n;}}
  const was='['+cur.join(',')+']';const from=cureSafe(String(L||'').slice(0,240)).replace(/;\\s*END\\]/g,', END');
  if(set){const rx=new RegExp('("'+key+'"\\\\s*:\\\\s*)\\\\[[^\\\\]]*\\\\]');if(!rx.test(jj))continue;jj=jj.replace(rx,(_,h)=>h+'['+set.join(',')+']');
   mk.push('\\n[AUDIT v50: COUNTED PREMISES DERIVED (pkgCPD) -- '+(seat?'SEAT: '+seat+'; ':'')+'SIDE: '+sd+'; COUNT: '+pre[ck]+' to '+n+'; WAS: '+was+'; NOW: ['+set.join(',')+']; FROM: '+(n===0?'the count 0':from)+'; record-only, it removes no seat ; END]');}
  else mk.push('\\n[AUDIT v50: COUNTED PREMISES NOT DERIVED (pkgCPD) -- '+(seat?'SEAT: '+seat+'; ':'')+'SIDE: '+sd+'; COUNT: '+pre[ck]+' to '+n+'; ARRAY: '+was+' (kept); WHY: '+cureSafe(why)+'; LINE: '+from+'; record-only, it removes no seat. REVIEW THIS ROW. ; END]');}
 return {j:jj,mark:mk.join('')};}
`;
const C0="if(panel){const a=s.indexOf('{');const b=a<0?-1:rcObjEnd(s,a);if(b>0){let j=s.slice(a,b);let miss=false;";
const C1=C0+"const __cpdPre={conceded_links:(j.match(/\"conceded_links\"\\s*:\\s*(\\d+)/)||[])[1],challenger_conceded_links:(j.match(/\"challenger_conceded_links\"\\s*:\\s*(\\d+)/)||[])[1]};for(const k in __cpdPre)__cpdPre[k]=__cpdPre[k]==null?null:+__cpdPre[k]; /* pkgCPD */";
const A0="if(nu.length!==cur.length)j=j.replace(rx,(_,h)=>h+'['+nu.join(',')+']');}";
const A1=A0+"\n   let __cpd='';try{const __c=cpdSync(j,__cpdPre,seat);j=__c.j;__cpd=__c.mark;}catch(e){__cpd='\\n[AUDIT v50: COUNTED PREMISES -- the derive failed: '+cureSafe(String(e&&e.message||e)).slice(0,160)+' ; END]';} /* pkgCPD */";
const B0="s=s.slice(0,a)+j+cr+s.slice(b);}}";const B1="s=s.slice(0,a)+j+cr+__cpd+s.slice(b);}}";
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor x'+n);return s.split(a).join(b);};
const BASE=ON?OUT+'_base':OUT.replace(/patched[^/]*$/,'base');fs.mkdirSync(OUT,{recursive:true});fs.mkdirSync(BASE,{recursive:true});const plan={base:FB+(ON?' + '+ON:''),nodes:[]};
for(const n of NS){const s0=(n.parameters||{}).jsCode;if(typeof s0!=='string'||!s0.includes('function cureRewrite('))continue;let s=rep(s0,C0,C1,n.name+' pre');s=rep(s,A0,A1,n.name+' derive');s=rep(s,B0,B1,n.name+' mark');const ed=['pre','derive','mark'];
 let lib=LIB;if(!s0.includes('function psGrades(')){lib=PSG+LIB;ed.push('lib psGrades');}s=rep(s,'function cureRewrite(',lib+'function cureRewrite(',n.name+' lib');
 new Function('$','$input','$json','$execution','$workflow',s);const f=n.name.replace(/ /g,'_')+'.js';fs.writeFileSync(BASE+'/'+f,s0);fs.writeFileSync(OUT+'/'+f,s);
 plan.nodes.push({name:n.name,file:f,base_sha:sha(s0),final_sha:sha(s),edits:ed});console.log(n.name.padEnd(28),sha(s0),'->',sha(s),ed.join(','));}
fs.writeFileSync(OUT+'/../plan_'+OUT.split('/').pop()+'.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length,'nodes');
