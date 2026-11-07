// pkgLOG test: the built jsonBody expression, run on the saved Alternate Merge output of each run in inputs/ that has one, and on edge cases.
// Each check: same rows in the same order; every field but the two long texts byte-equal; every pointer resolves (row n's field is the
// full text, equal to the original); a text under 2,000 characters is never replaced; the body is smaller. Run from wall2024/.
const fs=require('fs');const P=JSON.parse(fs.readFileSync('pkgLOG/plan_LOG.json','utf8'));let ok=0,bad=0;const out=[];
const T=(n,c,d)=>{const l=(c?'OK  ':'FAIL')+' '+n+(d?' | '+d:'');console.log(l);out.push(l);c?ok++:bad++;};
const expr=v=>v.replace(/^=\{\{\s*/,'').replace(/\s*\}\}$/,'');
// v2: the expression runs in n8n's own expression engine (@n8n/tournament 1.15.0, pkgLOG/package.json; npm ci --prefix pkgLOG), the way the
// Write Enforcer Log node reads it, so a "}}" or a quote the engine refuses fails here (33261 "invalid syntax"; the v1 test used new Function).
const {Tournament}=require(__dirname+'/node_modules/@n8n/tournament');const TOUR=new Tournament(()=>{});
const run=(v,body)=>TOUR.execute(String(v).replace(/^=/,''),{$:n=>{if(n!=='Alternate Merge')throw new Error('reads '+n);return {first:()=>({json:{enforcer_log_body:body}})};},JSON,Object,Array});
T('T0 the final expression parses in n8n\'s engine (the v1 expression does not: "Unexpected end of input")',(()=>{try{run(P.final_value,{p_rows:[]});return true;}catch(e){return false;}})()&&(()=>{try{run(P.final_value.replace("']';} });","']';}});"),{p_rows:[]});return false;}catch(e){return true;}})());
T('base expression reproduces JSON.stringify of the body',run(P.base_value,{a:[1]})===JSON.stringify({a:[1]}));
const check=(name,body)=>{const s0=run(P.base_value,body),s1=run(P.final_value,body);const a=JSON.parse(s0),b=JSON.parse(s1);
 const R0=a.p_rows||[],R1=b.p_rows||[];let fields=true,ptr=0,res=true,short=true;
 if(R0.length!==R1.length)return T(name+': row count',false);
 for(const k of Object.keys(a))if(k!=='p_rows'&&JSON.stringify(a[k])!==JSON.stringify(b[k]))fields=false;
 R0.forEach((r,i)=>{const q=R1[i];for(const k of new Set([...Object.keys(r),...Object.keys(q)])){if(k==='prompt_sent'||k==='full_reply'){
   if(r[k]===q[k])continue;if(typeof r[k]!=='string'||r[k].length<2000){short=false;continue;}const m=String(q[k]).match(/^\[SAME (prompt_sent|full_reply) AS row (\d+) of the run log: /);
   if(!m||m[1]!==k){res=false;continue;}ptr++;const t=R1[+m[2]-1];if(!t||t[k]!==r[k]||+m[2]-1>=i)res=false;}else if(JSON.stringify(r[k])!==JSON.stringify(q[k]))fields=false;}});
 T(name+': '+R0.length+' rows, '+s0.length+' -> '+s1.length+' bytes ('+Math.round(100*s1.length/Math.max(1,s0.length))+'%), '+ptr+' pointers; other fields equal, every pointer resolves to an earlier row holding the same text, no short text replaced',fields&&res&&short&&s1.length<=s0.length);return s1.length;};
const D='/mnt/project-files/wall2024/inputs/';const runs=[...new Set(fs.readdirSync(D).filter(f=>/_Alternate_Merge\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
let max=0;for(const r of runs){const d=JSON.parse(fs.readFileSync(D+r+'_Alternate_Merge.json','utf8'));const x=Array.isArray(d)?d[0]:d;const m=((x.data&&x.data.main)||x.main||[])[0]||[];const b=m[0]&&m[0].json&&m[0].json.enforcer_log_body;
 if(!b){T(r+': no enforcer_log_body in the saved output',true,'skipped');continue;}max=Math.max(max,check(r,b));}
check('edge: empty rows',{p_debate_id:null,p_run_token:'t',p_rows:[]});check('edge: no p_rows',{p_run_token:'t'});
T('edge: a null body is sent as the base sends it',run(P.final_value,null)===run(P.base_value,null),run(P.final_value,null));
const big='x'.repeat(3000);check('edge: one long text twice, two fields, a null and a short text',{p_run_token:'t',p_rows:[{seat:'a',kind:'cure',rule:'K-W',item:'1',prompt_sent:big,full_reply:'short'},{seat:'b',kind:'cure',rule:'K-W',item:'2',prompt_sent:big,full_reply:null},{seat:'c',prompt_sent:'y'.repeat(1999)},{seat:'d',prompt_sent:'y'.repeat(1999)}]});
T('largest deduplicated body '+max+' bytes is under the 33218 body that wrote in time (5.2 MB)',max<5200000);
fs.writeFileSync('pkgLOG/test_LOG.txt',out.join('\n')+'\n'+ok+' OK, '+bad+' FAIL\n');console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
