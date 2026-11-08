// pkgGRT2 (D53; W1, 11-08; spec W3 3143 on W2 3141, route (a)): a FORCED-line E-COL ask whose pair has no collision ask in the same send-back
// gets a companion ask for the pair's collision line when the judge's text grades that line LINK BROKEN. Answering it with the pair regraded makes
// the offered "CHANGE TO: RETRACTED: <pair>" applicable (pkgRFL checks the collision grade after all changes of the send-back are applied).
// The companion is record-only: no enforcer rule, no ECF layer text, never silence, never counted. Texts come from pkgRTB/rule_table.cjs RXSB.
// Nodes (base fetchback_live_s68): Send Back Build, Alt Send Back Build, R2 Alt Send Back Build; Send Back Record, Alt and R2 Alt Send Back Record.
// Run from wall2024/: node pkgGRT2/build_GRT2.cjs [base workflow json]
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const BASE=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s68.json';const W=JSON.parse(fs.readFileSync(BASE,'utf8'));const N=W.nodes||W.data.nodes;
const {RXSB}=require('../pkgRTB/rule_table.cjs');const js=s=>JSON.stringify(s).slice(1,-1).replace(/'/g,"\\'"); // text for a '...' literal
const CMP="'"+js(RXSB.companion('@@SID@@')).split('@@SID@@').join("'+i.sid+'")+"'";
const FPT="'"+js(RXSB.forcedPointer('@@SID@@')).split('@@SID@@').join("'+i.grt2s+'")+"'";
const BLOCK=" /* pkgGRT2 (D53) */{const F2=/^\\s*(?:[-\\u2022]|\\d+[.)])?\\s*FORCED\\b/i;const P2=l=>{const m=String(l||'').replace(/[*_`]+/g,'').match(/\\bD(\\d+)\\s+vs\\.?\\s+C(\\d+)\\b/i);return m?'D'+m[1]+' vs C'+m[2]:null;};"
 +"const G2=/^\\s*(?:[-\\u2022*]\\s*|\\d+[.)]\\s*)?\\**D\\d+\\s+vs\\.?\\s+C\\d+\\b(?:\\s*\\([^)\\n]*\\))?[^:\\n(]*:\\s*\\**(?:DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN)\\b/;const L2=said[seat].split('\\n');"
 +"for(const i of items.slice()){if(i.rule!=='E-COL'||!F2.test(String(i.line||'').replace(/[*_`]+/g,'')))continue;const p=P2(i.line);if(!p)continue;"
 +"if(items.some(o=>o!==i&&!F2.test(String(o.line||'').replace(/[*_`]+/g,''))&&P2(o.line)===p))continue;"
 +"const cl=L2.filter(l=>{const t=l.replace(/[*_`]+/g,'').trim();return G2.test(t)&&P2(t)===p;});if(cl.length!==1)continue;"
 +"if(items.length>=MAX){not_sent.push({seat,rule:'E-COL',item:p+' (companion for '+i.sid+')',why:'over the '+MAX+'-item transport limit'});continue;}"
 +"const c={sid:'S'+(items.length+1),rule:'E-COL',item:p+' (collision line for '+i.sid+')',line:cl[0].trim(),reason:"+CMP+",ecl:null,und:null,abs:null,pab:null,mnp:null,imp:null,ksc:null,b7:null,src:null,grt2:{forced:i.sid,pair:p}};i.grt2s=c.sid;items.push(c);}}";
const SUBS={build:[
 ['ecf',"const __ecfR=i=>i.rule!=='E-COL'?'':","const __ecfR=i=>i.rule!=='E-COL'||i.grt2?'':"],
 ['ptr',"regrade that line (UNDERDETERMINED or STANDS) where it is asked (pkgGRT).'","regrade that line (UNDERDETERMINED or STANDS) where it is asked'+(i.grt2s?"+FPT+":'')+' (pkgGRT).'"],
 ['add',"b7:x.b7||null,src:x}));","b7:x.b7||null,src:x}));"+BLOCK],
 ['out',"b7:i.b7||null,epk:i.epk||null,","b7:i.b7||null,epk:i.epk||null,...(i.grt2?{grt2:i.grt2}:{}),"]],
 record:[
 ['sil',"const silent=!a&&!err&&!named;","const silent=!a&&!err&&!named&&!it.grt2; /* pkgGRT2: a companion ask is never silence */"],
 ['ec',"let __ec=null;if(it.rule==='E-ANS'||it.rule==='E-PREM'||it.rule==='E-COL'){","let __ec=null;if(!it.grt2&&(it.rule==='E-ANS'||it.rule==='E-PREM'||it.rule==='E-COL')){"],
 ['row',"if(it.rule==='E-COL'&&__ec&&__ec.status!=='CURED'&&!silent&&!err){","if(it.grt2){rows[rows.length-1].cure_reason+=' | COMPANION ASK (pkgGRT2, for '+it.grt2.forced+'): record-only, counts against no seat';if(a)rows[rows.length-1].cure_status='CURED';} /* pkgGRT2 */\n  if(it.rule==='E-COL'&&__ec&&__ec.status!=='CURED'&&!silent&&!err){"]]};
fs.mkdirSync('pkgGRT2/patched',{recursive:true});const plan={base:BASE,nodes:[]};
for(const p of ['','Alt ','R2 Alt '])for(const [kind,nm] of [['build',p+'Send Back Build'],['record',p+'Send Back Record']]){let t=N.find(x=>x.name===nm).parameters.jsCode;const before=h(t);
 for(const [tag,a,b] of SUBS[kind]){const k=t.split(a).length-1;if(k!==1)throw new Error(nm+' '+tag+' anchor count '+k);t=t.replace(a,()=>b);}
 try{new Function('$','$input','$execution','return (async()=>{\n'+t+'\n})();')}catch(e){throw new Error(nm+' syntax: '+e.message)}
 const file=nm.replace(/ /g,'_')+'.js';fs.writeFileSync('pkgGRT2/patched/'+file,t);plan.nodes.push({node:nm,file,before,after:h(t)});console.log(nm,before,'->',h(t));}
fs.writeFileSync('pkgGRT2/plan_GRT2.json',JSON.stringify(plan,null,1)+'\n');
