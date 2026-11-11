const fs=require('fs');const LIB=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../../pkgKSR/run_node.cjs');
const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const J=un('/tmp/claude-0/joint_CRFb_ACO.json'),C=un('/mnt/project-files/wall2024/parent_s135_CRFb.json'),A=un('/tmp/claude-0/parent_s135_ACO.json');
console.log('joint nodes == CRFb nodes',JSON.stringify(J.nodes)===JSON.stringify(C.nodes),'| joint connections == ACO connections',JSON.stringify(J.connections)===JSON.stringify(A.connections));
fs.writeFileSync('/tmp/claude-0/_u_joint.json',JSON.stringify(J));const L=LIB('/tmp/claude-0/_u_joint.json');
(async()=>{for(const f of ['ex35067','ex34852']){const ex=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f+'_full.json','utf8'));const rd=ex.data.resultData.runData;
 const biv=await run(L.code('Build Independent Verdict'),'Build Independent Verdict',rd);
 const cure=await run(L.code('Cure Build'),'Cure Build',rd,{'Build Independent Verdict':[biv.map(j=>({json:j}))]});
 if(cure.err){console.log(f,'ERR',cure.err);continue;}
 const vb=biv[0].verdictBody;const cb=(()=>{let r=null;(function w(x){if(r)return;if(x&&typeof x==='object'){if(Array.isArray(x.messages)&&x.model&&x.messages.length>vb.messages.length){r=x;return}for(const v of Object.values(x))w(v)}})(cure);return r})();
 const pre=cb&&JSON.stringify(cb.messages.slice(0,vb.messages.length))===JSON.stringify(vb.messages);
 const notes=(JSON.stringify(vb).match(/\[ANTI-CHEAT CHECK/g)||[]).length;
 console.log(f,'| verdict notes',notes,'| cure messages',cb&&cb.messages.length,'| cure starts with the whole verdict messages',pre,'| cure response_format',!!(cb&&cb.response_format),'| other top-level keys differ',cb&&JSON.stringify(Object.keys(cb).filter(k=>k!=='messages'&&JSON.stringify(cb[k])!==JSON.stringify(vb[k]))));}})();
