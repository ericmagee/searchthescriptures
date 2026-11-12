const fs=require('fs');const c=JSON.parse(fs.readFileSync('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/pkgCRB/parent_s156_CRB2.json')).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const i=c.indexOf('const cecBlock=');const j=c.indexOf(';\nconst PROMPT=');const B=new Function(c.slice(i,j)+';return cecBlock;')();
const A='**ANSWER: Romans 1:3 -- D2 --** "verse"\n';
const P=[
['W2-1 curly apostrophe in close',B("# CLOSE\n**ANSWER: A**\n- [L4] Joseph’s line is not the route here at all.\n","Joseph's line is not the route here at all."),b=>b.includes('ANSWER: A')],
['W2-2 quoted earlier, then own row',B('# CLOSE\nI quote the challenger: "So the flesh comes by the mother and not by Joseph."\n\n**ANSWER: B**\n- [L4] So the flesh comes by the mother and not by Joseph.\n','So the flesh comes by the mother and not by Joseph.'),b=>b.startsWith('**ANSWER: B')],
['W3-F1 bold row labels',B(A+'**[L3]** Luke 1:35: "born of thee."\n**[L4]** The child is of Mary. So the flesh comes by the mother, and Joseph is not the route.\n','So the flesh comes by the mother, and Joseph is not the route.'),b=>b.startsWith('**ANSWER: Romans')&&b.includes('[L3]')],
['W3-F1 bold row label whole',B(A+'**[L3] Luke 1:35: born of thee.**\n**[L4] So the flesh comes by the mother, and Joseph is not the route.**\n','So the flesh comes by the mother, and Joseph is not the route.'),b=>b.startsWith('**ANSWER: Romans')&&b.includes('[L3]')],
['bold lead-in on own line',B(A+'- [L3] Row.\n**The point.** So the flesh comes by the mother, and Joseph is not the route.\n','So the flesh comes by the mother, and Joseph is not the route.'),b=>b.startsWith('**ANSWER: Romans')],
['W3-F2 two alike closings',B('**ANSWER: A1**\n- [L4] So the flesh comes by the mother in Luke one.\n\n**ANSWER: A2**\n- [L4] So the flesh comes by the mother in Romans one.\n','So the flesh comes by the mother in Romans one.'),b=>b.startsWith('**ANSWER: A2')],
['cut quote (ellipsis)',B(A+'- [L4] So the flesh comes by the mother, and Joseph is not the route.\n','So the flesh comes ... and Joseph is not the route.'),b=>b===''],
['bold lead-in row inside block splits (limit)',B(A+'- [L3] Row three.\n**Note.** a remark.\n- [L4] So the point stands from row three today.\n','So the point stands from row three today.'),b=>b.includes('[L3]')],
['regex chars',B('# H\nWhat (of) it [x] $5 + 2? Done here now.','What (of) it [x] $5 + 2? Done here now.'),b=>b.startsWith('# H')],
['empty',B('','So the flesh comes by the mother'),b=>b===''],
];let ok=0;for(const [n,b,f] of P){const p=f(b);if(p)ok++;console.log(p?'AS EXPECTED':'NOT AS EXPECTED',n,'=>',JSON.stringify(b.slice(0,80)));}console.log(ok+'/'+P.length);
// timing on a long close
const big='# H\n'+('word '.repeat(50)+'\n').repeat(400);let t0=Date.now();B(big,'word word word word word word word word word word word word word word word nothing');console.log('ms',Date.now()-t0);
