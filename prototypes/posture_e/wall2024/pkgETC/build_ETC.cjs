// pkgETC (W2): DeepSeek enforcer label-vs-text check, in Judge Enforcer Record and Alt Judge Enforcer Record. A DISAGREE or NO ANSWER verdict whose
// "right:" label contradicts the ruling its own reason concludes is written as ENFORCER CONTRADICTED, which the send-back filter
// (/^ENFORCER (?:DISAGREE|NO ANSWER)\b/) does not send. The row is still recorded, with both rulings named. Nothing else changes.
// Base: live s40 f0104a40 (fetchback_live_s40.json). Run from wall2024/: node pkgETC/build_ETC.cjs
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s40.json','utf8'));const L=(W.data||W);
const LIB=fs.readFileSync(__dirname+'/etc_lib.js','utf8').trim();
const A1="const T=new Date().toISOString();";
const A2="const v=V[x.id.toUpperCase()];const verdict=v?v.v:'NO VERDICT';";
const B2="const v=V[x.id.toUpperCase()];const __ec=v&&(v.v==='DISAGREE'||v.v==='NO ANSWER')?ETC(x.rule,v.right,v.why):null;const verdict=__ec?'CONTRADICTED':(v?v.v:'NO VERDICT');";
const A3="+(v&&v.why?': '+v.why.slice(0,600):'')+' (judge wrote '";
const B3="+(v&&v.why?': '+v.why.slice(0,600):'')+(__ec?' [pkgETC: written '+v.v+' with right: '+v.right+', but its own reason concludes '+__ec+'; recorded, not sent back]':'')+' (judge wrote '";
const A4="tally[k]={AGREE:0,DISAGREE:0,'NO ANSWER':0,'NO VERDICT':0};";
const B4="tally[k]={AGREE:0,DISAGREE:0,'NO ANSWER':0,'NO VERDICT':0,CONTRADICTED:0};";
const E=[[A1,A1+'\n'+LIB],[A2,B2],[A3,B3],[A4,B4]];
const OUT=__dirname+'/patched';fs.mkdirSync(OUT,{recursive:true});const plan={source:'W2 pkgETC, 33311 rows 13335 and 13350',base:'live '+L.versionId,nodes:[]};
for(const name of ['Judge Enforcer Record','Alt Judge Enforcer Record']){const n=L.nodes.find(z=>z.name===name);const live=n.parameters.jsCode;let s=live;
 for(const [a,b] of E){const c=s.split(a).length-1;if(c!==1)throw new Error(name+' anchor x'+c+': '+a.slice(0,40));s=s.replace(a,()=>b);}
 new Function('$','$input','$json','$execution','$workflow',s);const f=name.replace(/ /g,'_')+'.js';fs.writeFileSync(OUT+'/'+f,s);
 plan.nodes.push({name,file:f,live_sha:sha(live),final_sha:sha(s),bytes:[live.length,s.length]});}
fs.writeFileSync(__dirname+'/plan_ETC.json',JSON.stringify(plan,null,1));console.log(JSON.stringify(plan));
