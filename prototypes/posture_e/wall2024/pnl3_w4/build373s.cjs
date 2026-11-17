// ASK 373 (plan W1 Wall 7817, amended after 7818): RESTATED accepts the LINK STATE form. Base: live s252 (2c1e1f38).
const fs=require('fs');const {unpack,rb}=require('../tools/lib.cjs');
const w=JSON.parse(fs.readFileSync(process.argv[2]||'../rdf/fetchback_s252.json'));const BASEV='2c1e1f38-69e6-4b77-bb1b-4cce84175ee9';if(w.versionId!==BASEV&&!process.env.STACK)throw new Error('base moved: '+w.versionId);
const OLD="const RESTATABLE=['COLLISION','FORCED','ANSWER CHECK','KEYSTONE','STANDING','CONCEDED','RESULT'];";
const NEW="const RESTATABLE=['COLLISION','FORCED','ANSWER CHECK','KEYSTONE','STANDING','CONCEDED','RESULT','LINK STATE'];";
const NODES=['Build Save Body','Format Markdown','Enforcer Build','Judge Enforcer Retry Build','Alt Judge Enforcer Retry Build','R2 Alt Judge Enforcer Retry Build'];
for(const nm of NODES){const n=w.nodes.find(x=>x.name===nm);const s=n.parameters.jsCode;const c=s.split(OLD).length-1;if(c!==1)throw new Error(nm+' count '+c);n.parameters.jsCode=s.replace(OLD,()=>NEW);}
for(const n of w.nodes){if(NODES.includes(n.name)||n.name==='Shared Library')continue;if(String(n.parameters&&n.parameters.jsCode||'').includes('RESTATABLE'))throw new Error('unexpected copy in '+n.name);}
const u=unpack(w);const L=u.L.slice();const idx=L.map((l,i)=>l===OLD?i:-1).filter(i=>i>=0);if(idx.length!==1||L.filter(l=>l.includes('RESTATABLE=')).length!==1)throw new Error('library copy count');L[idx[0]]=NEW;
const M=JSON.parse(JSON.stringify(u.M));const fixed=[];for(const k in M){const len=rb(L,M[k]).length;if(len!==M[k].n){fixed.push(k);M[k].n=len;}}
const T=u.T;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
if(JSON.stringify(u.L)!==T.slice(iL+8,iM)||JSON.stringify(u.M)!==T.slice(iM+8,iE))throw new Error('LIB/MAP serialization differs; stop');
w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=T.slice(0,iL+8)+JSON.stringify(L)+T.slice(iM,iM+8)+JSON.stringify(M)+T.slice(iE);
fs.writeFileSync(process.argv[3]||'target_373.json',JSON.stringify(w));console.log('library line',idx[0],'MAP n updated',fixed.length,fixed.join(', '));
