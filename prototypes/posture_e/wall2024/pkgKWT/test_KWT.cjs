// pkgKWT unit test: the runs function from the patched source.
const fs=require('fs');const s=fs.readFileSync('pkgKWT/patched/Gate_Record.js','utf8');const a=s.indexOf('const __rn0=');const b=s.indexOf('/* pkgKWT',a);
const rn=new Function(s.slice(a,b)+'return __rn;')();let ok=0,bad=0;const w=x=>x.split(' ');
const T=(n,got,want)=>{const p=JSON.stringify(got)===JSON.stringify(want);p?ok++:bad++;console.log((p?'OK   ':'FAIL ')+n+(p?'':' got '+JSON.stringify(got)));};
T('33411 sol: "that two fatherhoods stand together there" also takes the 5 words',rn(w('that two fatherhoods stand together there')),['that two fatherhoods stand together there','two fatherhoods stand together there']);
T('W3 2932: "that sentence" keeps its floor',rn(w('that sentence')),['that sentence']);
T('"that sub limb" (2 words left) keeps its floor',rn(w('that sub limb')),['that sub limb']);
T('"that a b c" (3 words left) adds',rn(w('that a b c')),['that a b c','a b c']);
T('no leading that: unchanged',rn(w('two fatherhoods stand together there')),['two fatherhoods stand together there']);
console.log(ok+' OK, '+bad+' FAIL');
