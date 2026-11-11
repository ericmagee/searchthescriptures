// W1: combined file on 35067 if the paid close-enforcer call also confirms pkgRCH's new link 2 candidate (modelled by copying the Judge Contradiction
// Record's own link 2 entry into Close Enforcer Record). Every library node, scenario B vs the stored scenario (call result unchanged). No model call.
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../pkgKSR/run_node.cjs');const P='/mnt/project-files/wall2024/';
const C=L('/tmp/claude-0/cmx/combined.json');const rd=JSON.parse(fs.readFileSync(P+'ex35067_full.json','utf8')).data.resultData.runData;
const cec=rd['Close Enforcer Record'][0].data.main[0][0].json;const jcc=rd['Judge Contradiction Record'][0].data.main[0][0].json.jcc.confirmed;
const l2=jcc.find(x=>x.side==='DEFENDER'&&+x.link===2);const B={...cec,cec:{...cec.cec,confirmed:cec.cec.confirmed.concat([l2])}};
const over={'Close Enforcer Record':[[{json:B}]]};const S=v=>JSON.stringify(v).replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g,'<ts>');
(async()=>{let n=0,d=0;for(const name of Object.keys(C.M).filter(x=>rd[x])){const a=await run(C.code(name),name,rd),b=await run(C.code(name),name,rd,over);n++;
 if(S(a)===S(b))continue;d++;const sa=S(a),sb=S(b);let i=0;while(sa[i]===sb[i])i++;console.log('DIFF',name,'\n  A:',sa.slice(Math.max(0,i-150),i+250),'\n  B:',sb.slice(Math.max(0,i-150),i+250));}
 console.log('library nodes',n,'differ',d);})();
