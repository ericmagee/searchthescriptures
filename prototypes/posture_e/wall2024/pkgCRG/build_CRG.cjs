// pkgCRG (W1, W3 3087 ruling 1): when a cure's CORRECTED COUNT recounts a CONCEDED LINKS line, the engine's rewritten line names each
// counted premise with its ground; the stored count split (pkgCLR __CSP) gains "broken at the collision".
// Library layer on pkgLIB/strip_D38 (LIB v16_D38, W2, awaiting grade); Build Save Body on live s57.
// Run from wall2024/: node pkgCRG/build_CRG.cjs -> pkgLIB/strip_CRG/patched (22 files), pkgCRG/patched/Build_Save_Body.js, pkgCRG/plan_CRG.json
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC='pkgLIB/strip_D38/patched/',DST='pkgLIB/strip_CRG/patched/';fs.mkdirSync(DST,{recursive:true});fs.mkdirSync('pkgCRG/patched',{recursive:true});
// 1. cureRecompute: the CONCEDED LINKS line rewritten from a CORRECTED COUNT (cnew.from is null) names its grounds.
const A1="if(y&&(cnew[sd]||(yc!=null&&+yc!==c[sd])))rp.push([y.raw,lab[sd]+': '+c[sd]+' -- '+why+(cnew[sd]&&cnew[sd].from?' -- '+cnew[sd].from.replace(/^\\s*\\d+\\s*(?:--|—|-|:)?\\s*/,''):'')+'.']);}";
const B1="if(y&&(cnew[sd]||(yc!=null&&+yc!==c[sd])))rp.push([y.raw,lab[sd]+': '+c[sd]+' -- '+why+(cnew[sd]&&cnew[sd].from?' -- '+cnew[sd].from.replace(/^\\s*\\d+\\s*(?:--|—|-|:)?\\s*/,''):(c[sd]>0?__crg(sd,y,c[sd],yc):''))+'.']);}";
// __crg is defined inside cureRecompute (it reads col, v and cnt there), right before the count loop.
const A2=" const cs=cureSet(reply,v);const cnt={DEFENDER:F.conceded_links,CHALLENGER:F.challenger_conceded_links};";
const B2=" /* pkgCRG (W3 3087 ruling 1): a count set by CORRECTED COUNT names its grounds: each K-G1/K-G7 collision the cure counted (still graded the side's LINK BROKEN), then the judge's own line before the cure */\n"
 +" const __crg=(sd,y,n,yc)=>{const G=sd+' LINK BROKEN';const seen=new Set();const br=[];"
 +"for(const x of (v||[])){if(!x||x.side!==sd||x.status!=='CURED'||(x.rule!=='K-G7'&&x.rule!=='K-G1'))continue;const lk=U(x.link).replace(/\\s+VS\\.?\\s+/,' VS ');if(seen.has(lk))continue;"
 +"const z=col.find(q=>U(q.link).replace(/\\s+VS\\.?\\s+/,' VS ')===lk);if(!z||z.grade!==G)continue;seen.add(lk);const m=lk.match(/^D(\\d+) VS C(\\d+)$/);"
 +"const p=x.premise!=null?+x.premise:(m?+(sd==='DEFENDER'?m[1]:m[2]):null);br.push((p!=null?'premise '+p+' ':'')+'BROKEN AT THE COLLISION '+z.link.replace(/\\s+vs\\.?\\s+/i,' vs ')+' ('+x.rule+')');}"
 +"const n0=yc!=null?+yc:(typeof cnt[sd]==='number'?cnt[sd]:null);/* the count the judge's own line states */ const tail=n0>0&&n>=n0?rcOne(y.raw).replace(/^[\\s*_]*(?:CHALLENGER CONCEDED LINKS|CONCEDED LINKS)[*_]*\\s*:\\s*[*_]*\\d+[*_]*\\s*(?:--|—|-|:)?\\s*/i,'').replace(/[.\\s]+$/,''):'';"
 +"const k=br.length+(tail?n0:0);const low=n0>0&&n<n0?' (the cure lowered the count from '+n0+' and does not say which premises it keeps)':'';if(!br.length&&!tail)return ' -- grounds: the cure names none'+low;"
 +"return ' -- grounds: '+br.concat(tail?['before the cure, '+n0+': '+tail]:[]).join('; ')+(k!==n?' (the grounds number '+k+', the count '+n+')':'')+low;};\n";
const plan={base:'pkgLIB/strip_D38 (LIB v16_D38); Build Save Body on live s57 (fetchback_live_s57.json)',nodes:{}};
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;
 if(s0.includes(A1)){if(s0.split(A1).length!==2||s0.split(A2).length!==2)throw new Error(f+' anchors 1/2');s=s.replace(A1,()=>B1).replace(A2,()=>B2+A2);}
 if(s.includes('const __CSP=(()=>{'))s=csp(s,f);
 if(s!==s0){new Function('$','$input',s);plan.nodes[f]={base:h(s0),patched:h(s)};}
 fs.writeFileSync(DST+f,s);}
// 2. __CSP (stored count split): "premise n BROKEN AT THE COLLISION" is its own class, broken_at_collision; unnamed no longer takes it.
function csp(s,f){const A3="const one=(t,side,stored)=>{const st=(typeof stored==='number'&&isFinite(stored))?stored:null;const r=CLR.read(t,side);if(!r)return {stored:st,stated:null,granted:0,unexhibited:0,unnamed:null,granted_items:[],unexhibited_items:[]};\n"
 +" const g=r.counted.filter(x=>x.tag==='CONCEDED'||x.tag==='WITHDRAWN'),u=r.counted.filter(x=>x.tag==='UNEXHIBITED');\n"
 +" return {stored:st,stated:r.count,granted:g.length,unexhibited:u.length,unnamed:r.count==null?null:Math.max(0,r.count-g.length-u.length),granted_items:g.map(nm),unexhibited_items:u.map(nm)};};";
 const B3="const one=(t,side,stored)=>{const st=(typeof stored==='number'&&isFinite(stored))?stored:null;const r=CLR.read(t,side);if(!r)return {stored:st,stated:null,granted:0,unexhibited:0,broken_at_collision:0,unnamed:null,granted_items:[],unexhibited_items:[],broken_items:[]};\n"
 +" const g=r.counted.filter(x=>x.tag==='CONCEDED'||x.tag==='WITHDRAWN'),u=r.counted.filter(x=>x.tag==='UNEXHIBITED');\n"
 +" /* pkgCRG: the engine's recount names \"premise n BROKEN AT THE COLLISION Dn vs Cm\" (a premise counted under K-G1/K-G7); counted, but neither granted nor unexhibited */\n"
 +" const have=new Set(r.counted.map(x=>x.ref+x.num));const b=[];if(r.count!==0)for(const m of String(r.body||'').matchAll(/\\bpremise\\s+(\\d+)\\s+BROKEN AT THE COLLISION\\b/g)){const k='PREMISE'+m[1];if(!have.has(k)){have.add(k);b.push({ref:'PREMISE',num:+m[1]});}}\n"
 +" return {stored:st,stated:r.count,granted:g.length,unexhibited:u.length,broken_at_collision:b.length,unnamed:r.count==null?null:Math.max(0,r.count-g.length-u.length-b.length),granted_items:g.map(nm),unexhibited_items:u.map(nm),broken_items:b.map(nm)};};";
 if(s.split(A3).length!==2)throw new Error(f+' anchor 3');return s.replace(A3,()=>B3);}
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s57.json','utf8'));const bs0=W.nodes.find(z=>z.name==='Build Save Body').parameters.jsCode;
const bs=csp(bs0,'Build Save Body');new Function('$','$input',bs);fs.writeFileSync('pkgCRG/patched/Build_Save_Body.js',bs);plan.nodes['Build Save Body (live s57)']={base:h(bs0),patched:h(bs)};
fs.writeFileSync('pkgCRG/plan_CRG.json',JSON.stringify(plan,null,1));console.log(plan.nodes);
