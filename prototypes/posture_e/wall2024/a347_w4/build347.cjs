// ASK 347 (pkgACR rev 2) build: W1 7238 items 11-12 as amended by W3 7239 and W1 7240; passes W3 7239, W2 7241 (design). Oracle prompt only (ruling 383); no code, no model setting.
const fs=require('fs'),cr=require('crypto'),acorn=require('../tools/node_modules/acorn');
const IN=process.argv[2]||'../rdf/fetchback_s233_346.json',OUT=process.argv[3]||'target_347.json';
const d=JSON.parse(fs.readFileSync(IN));const node=n=>d.nodes.find(x=>x.name===n);
const ed=(nm,o,n,tag)=>{const x=node(nm);const c=x.parameters.jsCode;const k=c.split(o).length-1;if(k!==1)throw new Error(tag+' '+nm+' count '+k);x.parameters.jsCode=c.replace(o,()=>n);};
// item 11 (W1 7240 verbatim; apostrophes escaped for the single-quoted prompt string), after the live STEP/ASSUMES/ROWS GIVE form sentence
const I11="If your earlier rounds charged an assumption (CHARGE THE ASSUMPTION), carry each such charge into this list as its own numbered premise: LINK n:, the defender\\'s own words that assert the fact, quoted verbatim, and the STEP/ASSUMES/ROWS GIVE line. If no words of the defender assert the fact, do not list the charge. The STEP/ASSUMES/ROWS GIVE line carries none of the words no, not, none, never, only, without, alone, every or no other. A charge left outside this list is not graded. ";
const A11="Write that line only for such a premise; it carries none of the words no, not, none, never, only, without, alone, every or no other. ";
ed('C2 Build',A11+"After the quote, write PRESSED WITH:",A11+I11+"After the quote, write PRESSED WITH:",'I11');
// item 12 (W1 7238 verbatim), at the end of the system prompt's CHARGE THE ASSUMPTION paragraph
const A12="never ask a verse to state the conclusion. ANSWER A PRESS WITH THE FIT";
ed('Init with Guards',A12,"never ask a verse to state the conclusion. Charge it in your round 2 UNSUPPORTED-L4 PREMISES list; it is graded only there. ANSWER A PRESS WITH THE FIT",'I12');
for(const nm of ['C2 Build','Init with Guards'])acorn.parse(node(nm).parameters.jsCode,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});
fs.writeFileSync(OUT,JSON.stringify(d));
const h=x=>cr.createHash('sha256').update(x).digest('hex').slice(0,16);
console.log('node sha',h(JSON.stringify(d.nodes.map(n=>[n.name,n.parameters]))),'| C2 Build +'+I11.length+' | Init with Guards +81');
