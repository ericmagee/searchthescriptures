// node pkgEZR/plants.cjs <base> <new>
const fs=require('fs');const g=f=>JSON.parse(fs.readFileSync(f)).nodes.find(x=>x.name==='Init with Guards').parameters.jsCode;
const a=g(process.argv[2]),b=g(process.argv[3]);let pass=0,fail=0;const T=(n,c)=>{console.log((c?'PASS ':'FAIL ')+n);c?pass++:fail++;};
const ev=s=>{const k=s.indexOf('TEXTPROOF=');const m=/[^\\]";/g;m.lastIndex=k+11;const e=m.exec(s).index+2;return eval(s.slice(k+10,e));};
const ta=ev(a),tb=ev(b);
T('E1 old TEXTPROOF is a prefix of new',tb.startsWith(ta));
T('E2 added text is the sentence, quotes intact',tb.slice(ta.length)===' When a verse states an outcome, carry the cause the verse itself gives; never pin the outcome on a cause a nearby verse names and this one does not (Ezra 2:62 gives its cause, "they were not found: therefore were they, as polluted, put from the priesthood"; it does not say a name taken through a wife\'s house was refused).');
T('E3 only TEXTPROOF changed in the node',a.replace(/TEXTPROOF="(?:[^"\\]|\\.)*"/,'X')===b.replace(/TEXTPROOF="(?:[^"\\]|\\.)*"/,'X'));
const uses=s=>(s.match(/\bTEXTPROOF\b/g)||[]).length;T('E4 TEXTPROOF used once (definition) plus once in the oracle branch only: '+uses(b),uses(b)===2&&b.split('\n').some(l=>l.includes("profile==='oracle'")&&l.includes('TEXTPROOF')));
T('E5 non-oracle return line has no TEXTPROOF',!/return 'You are a rigorous biblical scholar[^\n]*TEXTPROOF/.test(b));
try{new Function('$','$execution','$input',b);T('E6 node compiles',true);}catch(e){T('E6 node compiles: '+e.message,/await/.test(e.message));}
console.log('pass',pass,'fail',fail);
