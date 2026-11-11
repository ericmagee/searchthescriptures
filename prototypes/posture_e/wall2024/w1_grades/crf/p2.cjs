const fs=require('fs');const LIB=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../../pkgKSR/run_node.cjs');
const A=LIB('/tmp/claude-0/_u_fetchback_live_s135.json'),B=LIB('/tmp/claude-0/_u_parent_s135_CRFb.json');
const ex=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8'));const rd=ex.data.resultData.runData;
(async()=>{const bn='Panel Cure Build 1',cn='Panel Cure Call 1 openrouter',nn='Panel Cure Normalize 1';
const bo=await run(A.code(bn),bn,rd),bnw=await run(B.code(bn),bn,rd);const st=rd[cn][0].data.main[0][0].json;const J=JSON.parse(String(st.choices[0].message.content).replace(/^```(?:json)?\s*|\s*```$/g,''));
const rep=JSON.parse(JSON.stringify(st));rep.choices[0].message.content=JSON.stringify({cure_lines:J.cure_lines.slice(0,5)});
for(const [lab,L,b] of [['old',A,bo],['new',B,bnw]]){const o=await run(L.code(nn),nn,rd,{[bn]:[b.map(j=>({json:j}))]},[{json:rep}]);
 // find bodies with messages
 const bodies=[];(function w(x,p){if(x&&typeof x==='object'){if(Array.isArray(x.messages)&&x.model)bodies.push([p,x]);for(const [k,v] of Object.entries(x))w(v,p+'.'+k)}})(o,'');
 for(const [p,bd] of bodies){const last=bd.messages.at(-1);const c=typeof last.content==='string'?last.content:JSON.stringify(last.content);console.log(lab,p,'| messages',bd.messages.length,'| response_format',!!bd.response_format,'| last ends with note',c.endsWith("\n\nANSWER FORMAT"+c.split("\n\nANSWER FORMAT").pop()),'| last role',last.role,'| last chars',c.length);}
}})();
