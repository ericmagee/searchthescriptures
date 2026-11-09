// W4 grade of pkgXK rev 3: edge cases for xkSalvage2024 / xkJson2024, taken from the built Shared Library source (strip_XKB) vs rev 2 (strip_XKB2).
const fs=require('fs');
const grab=(f)=>{const s=fs.readFileSync(f,'utf8');const out={};for(const n of ['xkSalvage2024','xkJson2024']){const i=s.indexOf('function '+n+'(');if(i<0){out[n]=null;continue;}let d=0,j=s.indexOf('{',i);for(;j<s.length;j++){if(s[j]==='{')d++;else if(s[j]==='}'){d--;if(d===0)break;}}out[n]=s.slice(i,j+1);}return out;};
// brace counting above is naive; use eval of the whole function text via Function wrapper with a real parser fallback
const load=(f)=>{const s=fs.readFileSync(f,'utf8');const a=s.indexOf('function xkSalvage2024(')>=0?s.indexOf('function xkSalvage2024('):s.indexOf('function xkJson2024(');const b=s.indexOf('function xkJson2024(');const end=s.indexOf("join('\\n');}",b)+"join('\\n');}".length;return Function(s.slice(a,end)+';return xkJson2024;')();};
const R3=load('pkgLIB/strip_XKB/patched/Panel_Cure_Normalize_2.js'),R2=load('pkgLIB/strip_XKB2/patched/Panel_Cure_Normalize_2.js');
const E=(k,i,t)=>({kind:k,item:i,text:t});
const full=JSON.stringify({cure_lines:[E('RESPONSE','D1 #1','a {brace} and "quote" and \\ slash'),E('STATEMENT','D2 #2','x}y'),E('RESPONSE','D3 #3','third')]});
const cases=[
 ['full valid reply: rev 3 equals rev 2', full, (a,b)=>a===b],
 ['cut inside entry 3 (text holds { } " \\ inside strings): keeps entries 1 and 2', full.slice(0,full.indexOf('third')), (a)=>a==='RESPONSE: D1 #1 | a {brace} and "quote" and \\ slash\nSTATEMENT: D2 #2 | x}y'],
 ['cut inside entry 1: left as text (line reader fallback)', full.slice(0,20), (a,b,t)=>a===t],
 ['plain line reply: unchanged', 'RESPONSE: D1 #1 | ok', (a,b,t)=>a===t],
 ['other JSON naming cure_lines in a string: unchanged', JSON.stringify({note:'cure_lines are below',x:1}), (a,b,t)=>a===t&&b===t],
 ['cut entry missing text after a complete entry: keeps the complete one', '{"cure_lines":[{"kind":"RESPONSE","item":"D1 #1","text":"ok"},{"kind":"RESPONSE","item":"D2', (a)=>a==='RESPONSE: D1 #1 | ok'],
 ['complete entry with a wrong shape (no text): whole reply left as text', '{"cure_lines":[{"kind":"RESPONSE","item":"D1 #1"},{"kind":"RESPONSE","item":"D2', (a,b,t)=>a===t],
 ['json fence, cut: salvaged', '```json\n'+full.slice(0,full.indexOf('third')), (a)=>a.startsWith('RESPONSE: D1 #1')&&a.split('\n').length===2],
];
let ok=0,bad=0;for(const [n,t,f] of cases){const a=R3(t),b=R2(t);const p=f(a,b,t);p?ok++:bad++;console.log((p?'OK   ':'FAIL ')+n+(p?'':'\n   rev3='+JSON.stringify(a)+'\n   rev2='+JSON.stringify(b)));}
console.log('TOTAL '+ok+' OK, '+bad+' FAIL');
