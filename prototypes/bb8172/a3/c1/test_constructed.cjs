// BB-8172 step 4 constructed falsifiers at Citation Scan level (base vs new), and the ledger's cited list for the same texts.
const fs=require('fs'),path=require('path');
const cs=dir=>{const src=fs.readFileSync(path.join(__dirname,dir,'Citation_Scan.js'),'utf8');return R=>{const $=n=>{if(n==='Regrade Load')return {isExecuted:false};if(n==='Final Output')return {first:()=>({json:R})};};return new Function('$',src)($)[0].json.items;};};
const pwl=(dir,nm)=>{const t=fs.readFileSync(path.join(__dirname,dir,(nm||'C3_Build')+'.js'),'utf8');const a=t.indexOf('const PWL=(()=>{');const e=t.indexOf('})();',a);return new Function(t.slice(a,e+5)+'\nreturn PWL;')();};
const ND=process.argv[2]||'new';const B=cs('base'),N=cs(ND),LB=pwl('base'),LN=pwl(ND);
const cases={
 F2_opens_bare:'"Judas begat Phares and Zara of Thamar" (1:3) is the first line of this round.',
 F3_prose_before:'Matthew 1:20 says "take unto thee Mary thy wife" and nothing else is claimed.',
 F1_bare_after_book:'The line runs from Matthew 1:2: "Judas begat Phares and Zara of Thamar" (1:3), and likewise "Salmon begat Booz of Rachab" (1:5).',
 SWAP_after_first:'Luke 1:13, 62-63 and "by the house of their fathers" (Numbers 1:2) are the register rows.',
 SWAP_bare_after:'Matthew 1:19 "Joseph her husband", "Mary thy wife" (1:20).',
 CLAIMED_linebreak:'Matthew 1:2 begins the line.\n"Judas begat Phares and Zara of Thamar" (1:3).',
 NEG_prose_bare:'Matthew 1:2 is the line; "Judas begat Phares and Zara" is not said of David (1:3).',
 POSSESSIVE:'Luke 1:35 says it. Matthew\'s own genealogy: "Judas begat Phares and Zara of Thamar" (1:3).',
 CAPITALS:'Luke 1:35 is read first.\n**IV. MATTHEW 1:18-25**\nThe line "Mary thy wife" (1:20) is plain.',
 KEEP_no_after:'Luke 1:13 "thy wife Elisabeth shall bear thee a son" is the father row.'};
const show=it=>it.map(i=>i.ref+(i.after_first?' [after_first, fallback '+(i.alt&&i.alt.ref)+(i.alt&&i.alt.v2&&i.alt.v2!==i.alt.verse?'-'+i.alt.v2:'')+']':'')+(i.order?' ['+i.order+']':'')+(i.cite_form===false?' [not cite form]':'')+' "'+i.quote.slice(0,30)+'"');
const NODES=['Panel_Build','Build_Independent_Verdict','D3_Build','C3_Build'];const LBn={},LNn={};for(const x of NODES){LBn[x]=pwl('base',x);LNn[x]=pwl(ND,x);}
const out={};
for(const [k,txt] of Object.entries(cases)){const R={cr1:txt,gr1:'',cr2:'',gr2:'',cr3:'',dr3:''};
 out[k]={scan_base:show(B(R)),scan_new:show(N(R)),ledger_base:LB.citedBlock([['round 1',txt]],'THE DEFENDER')||'(none)',ledger_new:LN.citedBlock([['round 1',txt]],'THE DEFENDER')||'(none)',ledger_by_node:Object.fromEntries(NODES.map(x=>[x,(LNn[x].citedBlock([['round 1',txt]],'THE DEFENDER')||'(none)').split('\n').pop()]))};}
console.log(JSON.stringify(out,null,1));
