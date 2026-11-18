// ASK 374 plant 4d: a [CR3] list written to the new D3 prompt, fed to the live Assume Check Build node, and to the judges' list reader (pkgPCQ split in Panel Build).
const fs=require('fs');let d=JSON.parse(fs.readFileSync(process.argv[2]));d=d.data||d;
const cr3=`LINK 1: SUPPORTED. Matthew 1:20 "that which is conceived in her is of the Holy Ghost".

CHALLENGER'S UNSUPPORTED-L4 PREMISES
1. The challenger infers a begetting from the naming. Quote [DR1]: "Joseph named him, so Joseph begat him" PRESSED WITH: Matthew 1:25 (KJV) "and he called his name JESUS"
2. The challenger takes Joseph's fatherhood of the child as given. Quote [DR2]: "the son of Joseph by the flesh"
STEP: the seed passes through Joseph -- ASSUMES: Joseph is the father of the child -- ROWS GIVE: Luke 3:23 "being (as was supposed) the son of Joseph"
PRESSED WITH: Luke 3:23 (KJV) "being (as was supposed) the son of Joseph"
3. A third premise. Quote [DR2]: "x y z" PRESSED WITH: none`;
const dr3=`LINK 1: the first link.\nLINK 2: Luke 3:23 "the son of Joseph, which was the son of Heli" answers it.\nLINK 3: none.`;
const M={'Init Seats':{run_token:'PLANT-374'},'Resolve Seats':{deepseek:{api_model:'x',max_tokens:8000}},'Final Output':{gr1:'',gr2:'',cr3,dr3}};
const $=n=>{if(n==='Regrade Load')return {isExecuted:false,first:()=>{throw new Error('x')}};if(!(n in M))throw new Error('no '+n);return {isExecuted:true,first:()=>({json:JSON.parse(JSON.stringify(M[n]))})};};
const src=d.nodes.find(x=>x.name==='Assume Check Build').parameters.jsCode;const o=new Function('$',src)($)[0].json;
console.log('acx_skip',o.acx_skip,o.why||'');console.log(JSON.stringify(o.prem.map(p=>({side:p.side,n:p.n,link:p.link,answer_round:p.answer_round,assumes:p.assumes,rows_give:p.rows_give,block:p.block.slice(0,60)}))));
const pb=d.nodes.find(x=>x.name==='Panel Build').parameters.jsCode;const k=pb.indexOf('UNSUPPORTED-L4');console.log('Panel Build mentions UNSUPPORTED-L4 at',k);
// the two list splitters in Panel Build (pkgPCQ items, and the witness ledger items), run on the same list
const body=cr3.slice(cr3.search(/CHALLENGER.S UNSUPPORTED-L4 PREMISES/i));
const s1=body.split(/\n(?=[ \t]*(?:\*\*)?(?:\d+\.|LINK\s+(?:\d+|[A-Za-z][A-Za-z\/]{0,9})\s*:))/i).slice(1);
const s2=String(body).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
console.log('pkgPCQ split items',s1.length,'| ledger split items',s2.length,'| premise 2 keeps its STEP line in both:',s1[1].includes('STEP:')&&s2[1].includes('STEP:'));
