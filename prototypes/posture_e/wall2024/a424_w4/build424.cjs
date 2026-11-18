// ASK 424 build (plan W3 rev 3, 5ceee971; R6 by W3 8930): every reader of the defender's DECLARED CHAIN takes the ASK 423 head, so "D1:" chains are read.
// Usage: node a424/build424.cjs ENG CHILD ENG_BASEV CHILD_BASEV ENG_OUT CHILD_OUT
// Library (engine and child alike, by a422a/lib_apply.cjs): R1 chain_count, R2 drvLinks, R3 drvChainOf DEFENDER. Engine nodes: R4 cecDeclared/cecDlinks (3 nodes),
// R5 declared/dlinks (12 / 10 nodes). Each reader keeps its own rules; only the numbered-line test and the number and text capture change.
const fs=require('fs'),path=require('path'),cp=require('child_process');const acorn=require(path.join(__dirname,'../tools/node_modules/acorn'));
const [EI,CI,EV,CV,EO,CO]=process.argv.slice(2);const ld=p=>{let d=JSON.parse(fs.readFileSync(p));return d.data||d;};
if(ld(EI).versionId!==EV)throw new Error('engine base moved');if(ld(CI).versionId!==CV)throw new Error('child base moved');
const DASH='[-‐-―−]';
// plan rev 2 (W3 8898, 69b4c1cd): R2 to R5 take HEAD (keeps ^\s*, W2-C1; no digit after the stop, W2-C2). R1 keeps its own start; it takes the
// ASK 423 head with the same no-digit guard (W1 8899 note, offered to the builder; DONE WHEN 1 is shown on all 245 with it).
const HEAD="^\\s*(?:#+\\s*)?[*_]*\\s*D?([0-9]+)[*_]*(?:[.:)](?![0-9])|\\s+"+DASH+"{1,3}(?:\\s|$))";
const R={ // [old, new] literal texts
 R1:["const m=L[i].match(/^(?:#+\\s*)?\\**D?([0-9]+)(?:\\.|\\s+-{1,3}(?:\\s|$))/i);if(!m)continue;if(parseInt(m[1],10)===c+1)c++;else break;}",
     "const m=L[i].match(/^(?:#+\\s*)?[*_]*\\s*D?([0-9]+)[*_]*(?:[.:)](?![0-9])|\\s+"+DASH+"{1,3}(?:\\s|$))/i);if(!m)continue;if(parseInt(m[1],10)===c+1)c++;else break;} /* ASK 424: the ASK 423 head */"],
 R2:["const m=l.match(/^\\s*\\**\\s*(\\d+)[.)]\\s+(\\S.*)$/);if(m){L.push(m[2].replace(",
     "const m=l.match(/"+HEAD+"[*_]*\\s*(\\S.*)$/i);if(m){L.push(m[2].replace("],
 R3:["const m=l.match(/^\\s*(\\d+)[.)]\\s+(\\S.*)$/);if(m){L.push('LINK '+m[1]+' -- '+cut(m[2]));",
     "const m=l.match(/"+HEAD+"[*_]*\\s*(\\S.*)$/i);if(m){L.push('LINK '+m[1]+' -- '+cut(m[2]));"],
 NUM:["const num=/^\\s*\\**\\s*\\d+[.)]\\s+\\S/.test(l);",
      "const num=/"+HEAD+"[*_]*\\s*\\S/i.test(l); /* ASK 424 */"],
 DL:["const m=l.match(/^\\s*\\**\\s*(\\d+)[.)]\\s+(.*)$/);if(m){cur={n:+m[1],text:m[2]};",
     "const m=l.match(/"+HEAD+"[*_]*\\s*(.*)$/i);if(m){cur={n:+m[1],text:m[2]};"]};
fs.writeFileSync(path.join(__dirname,'readers.json'),JSON.stringify(R,null,1));
// library: one pair set, both workflows
const P=['R1','R2','R3'].map(k=>({old:R[k][0],new:R[k][1]}));
// R6 (W3 8930 option b): chainCount and chain_lines, inline MAP text of the entry "Extract Independent Verdict" (engine and child), take R1's head.
const lit=s=>s.slice(s.indexOf('L[i].match(')+11,s.indexOf(');if(!m)'));P.push({map:'Extract Independent Verdict',old:lit(R.R1[0]),new:lit(R.R1[1]),count:2});fs.writeFileSync(path.join(__dirname,'pairs_424.json'),JSON.stringify(P));
cp.execFileSync('node',[path.join(__dirname,fs.existsSync(path.join(__dirname,'lib_apply.cjs'))?'lib_apply.cjs':'../a422a/lib_apply.cjs'),EI,CI,path.join(__dirname,'pairs_424.json'),EO+'.lib',CO],{stdio:'inherit'});
// engine nodes
const E=ld(EO+'.lib');fs.unlinkSync(EO+'.lib');const N4=['Close Enforcer Build','Judge Contradiction Build','Judge Contradiction Record'];
const N5=['Build Synthesis','Build Independent Verdict','Build Save Body','Panel Build','Format Markdown','D4 Build','D4 Extract','C4 Build','C4 Extract','C4G Extract','D4B Extract','C4B Extract'];
const cnt=(s,a)=>s.split(a).length-1;const rep={};
for(const n of E.nodes){if(n.name==='Shared Library'||!n.parameters||typeof n.parameters.jsCode!=='string')continue;let c=n.parameters.jsCode;const a=cnt(c,R.NUM[0]),b=cnt(c,R.DL[0]);if(!a&&!b)continue;
 if(a!==1||b>1)throw new Error(n.name+': num '+a+' dlinks '+b);c=c.replace(R.NUM[0],()=>R.NUM[1]);if(b)c=c.replace(R.DL[0],()=>R.DL[1]);n.parameters.jsCode=c;rep[n.name]=[a,b];
 acorn.parse('(async function(){'+c+'\n})',{ecmaVersion:'latest'});}
const got=Object.keys(rep).sort(),want=[...N4,...N5].sort();if(JSON.stringify(got)!==JSON.stringify(want))throw new Error('node set differs: '+JSON.stringify(got));
const nDL=Object.values(rep).filter(x=>x[1]).length;console.log('engine nodes changed',got.length,'(declared/cecDeclared',got.length,', dlinks/cecDlinks',nDL+')');
fs.writeFileSync(EO,JSON.stringify(E));
