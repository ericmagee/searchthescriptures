// pkgKCL (W3 queue, Wall 2437; amended per W3 Wall 2481): the per-line commitment tag for K-CMT, as a TRIAL rule K-CMTL beside the LIVE
// grouped K-CMT item. Run from wall2024/: node pkgKCL/build_KCL.cjs
// Base: pkgKF/patched (whole stack through pkgCK, K-F LIVE). 22 library nodes.
// (a) Raise: the grouped K-CMT item is unchanged (LIVE). Beside it, one K-CMTL item per contested grade line (TRIAL), link "line <k>" in the
//     judgment's order, the line quoted whole (to 400 characters). Which lines are contested is unchanged (kcmtGrade2024, pkgKCMT).
// (b) Prompt (the item text the cure prompt prints): each K-CMTL item names its answer, RESPONSE: K-CMTL line <k> | (Commitment N), or NOT A
//     GRADE; the first item also gives the shared form with an example: RESPONSE: K-CMTL lines | line 1: (Commitment 3); line 2: (Commitment 7);
//     line 4: NOT A GRADE.
// (c) Cure: a K-CMTL item is answered by its own RESPONSE (or, with a RESPONSE written, its STATEMENT) naming a Commitment N or NOT A GRADE,
//     or by its segment ("line <k>: ..." or "lines <j>, <k>: ...", split on ";" and line breaks) of a RESPONSE headed K-CMTL. The grouped
//     LIVE K-CMT item also takes the K-CMTL answers when it has no RESPONSE of its own, so a judge who answers line by line is not removed.
// (d) ENF_STATUS K-CMTL TRIAL; cureLabel and cureAsk know K-CMTL.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const SEG="function kcmtlSeg2024(text,k){for(const s of String(text||'').split(/;|\\n/)){const m=s.match(/^\\s*lines?\\s+((?:\\d+\\s*(?:,|and|&)?\\s*)+)\\s*(?::|--|\\u2014|\\u2013|-)\\s*([\\s\\S]*)$/i);if(m&&(m[1].match(/\\d+/g)||[]).map(Number).includes(k))return s.trim();}return null;} /* pkgKCL (c): the segment of a shared K-CMTL RESPONSE for line k */\n";
const OLD_ITEM_END=" marks.push('[AUDIT v33: GRADE WITHOUT ITS COMMITMENT (K-CMT) -- '";
const NEW_ITEMS=" L.forEach((l,k)=>items.push({rule:'K-CMTL',side:'JUDGE',link:'line '+(k+1),line:'\"'+l.slice(0,400)+'\" -- this contested grade line names no commitment. TRIAL rule: answer it with RESPONSE: K-CMTL line '+(k+1)+' | (Commitment N), the commitment the grade applies, or NOT A GRADE where the line carries a grade word but grades nothing.'+(k===0&&L.length>1?' Several lines may share one RESPONSE, each line with its own answer, for example: RESPONSE: K-CMTL lines | line 1: (Commitment 3); line 2: (Commitment 7); line 4: NOT A GRADE.':'')})); /* pkgKCL (a), (b): per-line items, TRIAL (W3 2437, 2481) */\n";
const RESP_OLD="/* the one item of its rule in this cure: a RESPONSE headed by that rule answers it (32949: \"RESPONSE: K-CMT | ...\") */return r?r.text:null;};";
const RESP_NEW="/* the one item of its rule in this cure: a RESPONSE headed by that rule answers it (32949: \"RESPONSE: K-CMT | ...\") */if(r)return r.text;"
 +"if(x.rule==='K-CMTL'){const k=+(String(x.link).match(/\\d+/)||[0])[0];for(const s of o.response){if(!/^K-CMTL\\b/.test(NZ(s.label)))continue;const g=kcmtlSeg2024(s.text,k);if(g)return g;}return null;} /* pkgKCL (c): a shared RESPONSE answers line k by its own segment */"
 +"if(x.rule==='K-CMT'){const t=o.response.filter(s=>/^K-CMTL\\b/.test(NZ(s.label))).map(s=>s.text).join('\\n');return t||null;} /* pkgKCL (c): the K-CMTL answers answer the grouped item */return null;};";
const KR_OLD="{const kr=krulCure(x,reply&&reply.ok?reply.text:'',R,(x.rule==='K-CMT'?";
const KR_NEW="{const kr=krulCure(x,reply&&reply.ok?reply.text:'',R,x.rule==='K-CMTL'?(respOf(x)+'\\n'+(stmtOf(x)||'')):(x.rule==='K-CMT'?";
const E=[
 ["function kcmtLines2024(text){",SEG+"function kcmtLines2024(text){",1,1,'kcmtlSeg2024'],
 [OLD_ITEM_END,NEW_ITEMS+OLD_ITEM_END,1,1,'K-CMTL items per line'],
 ["'K-CMT':'LIVE'","'K-CMT':'LIVE','K-CMTL':'TRIAL'",1,1,'ENF_STATUS K-CMTL TRIAL'],
 ["x.rule==='K-CMT'||","x.rule==='K-CMT'||x.rule==='K-CMTL'||",0,2,'cureLabel, cureAsk'],
 ["if(x.rule==='K-CMT'){const rp=","if(x.rule==='K-CMT'||x.rule==='K-CMTL'){const rp=",0,1,'krulCure K-CMTL'],
 [RESP_OLD,RESP_NEW,0,1,'respOf K-CMTL segment; grouped K-CMT takes K-CMTL answers'],
 [KR_OLD,KR_NEW,0,1,'cure call K-CMTL'],
];
const BASE='pkgKF/patched';const plan={base:BASE,nodes:[]};fs.rmSync('pkgKCL/patched',{recursive:true,force:true});fs.mkdirSync('pkgKCL/patched',{recursive:true});
for(const f of fs.readdirSync(BASE).filter(f=>f.endsWith('.js')).sort()){const b=fs.readFileSync(BASE+'/'+f,'utf8');let t=b;const ed=[];
 const cure=b.includes(RESP_OLD);
 for(const [a,c,mn,mx,tag] of E){const k=t.split(a).length-1;if(k<mn||k>mx||(cure&&k!==mx)||(k&&k!==mx))throw new Error(f+' '+tag+': x'+k);if(!k)continue;t=t.split(a).join(c);ed.push(tag);}
 new Function('$','$input','$json',t);fs.writeFileSync('pkgKCL/patched/'+f,t);plan.nodes.push({file:f,name:f.replace(/\.js$/,'').replace(/_/g,' '),base_sha:sha(b),final_sha:sha(t),cure:cure,edits:ed});}
fs.writeFileSync('pkgKCL/plan_KCL.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.name.padEnd(28),x.base_sha,'->',x.final_sha,x.edits.length+' edits'));
