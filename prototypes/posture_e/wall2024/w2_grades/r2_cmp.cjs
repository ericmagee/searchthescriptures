// W2 repeat 2, checks of W1's Wall 4718: (a) the panel rule on answers by reference / later rounds; (b) E-ANS items with and without THE ANSWER IN FULL, by round; Matthew 1:6 items.
const fs=require('fs');const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34852_full.json'));const rd=(X.data||X).resultData.runData;
const pb=JSON.stringify(rd['Panel Build']);for(const p of ['names it by reference','CLOSE ROUND [CR4]','read from any later round']){const i=pb.indexOf(p);console.log('PANEL RULE',p,'@',i);if(i>=0)console.log('  ',pb.slice(i-900,i+400).replace(/\\n/g,' / '));}
const b=rd['Judge Enforcer Build'];const items=b[b.length-1].data.main[0];const seen=new Set();let tot={};
for(const it of items){const u=((it.json.body||it.json).messages||[]).map(m=>m.content).join('\n');
 for(const m of u.matchAll(/ITEM (B\d+) \(E-ANS; the answering side wrote this in \[(\w+)\]\):\n([\s\S]*?)(?=\n\nITEM |\n*$)/g)){const k=m[1]+'|'+m[3].slice(0,120);if(seen.has(k))continue;seen.add(k);const r=m[2];tot[r]=tot[r]||{n:0,full:0};tot[r].n++;if(/THE ANSWER IN FULL/.test(m[3]))tot[r].full++;
  if(/PRESSED VERSE: Matthew 1:6\b/.test(m[3]))console.log('M1:6',m[1],m[3].replace(/\n/g,' / ').slice(0,700));}}
console.log('E-ANS items by round (n, with ANSWER IN FULL):',JSON.stringify(tot));
// (c) W2: eahFull (LIB 3252) serves THE ANSWER IN FULL only when the quoted answer opens with a grant or is under 60 characters. Classify the [CR3] items.
{const N=s=>String(s).replace(/\s+/g,' ').trim();const seen2=new Set();const c={full:0,gate_pass_no_full:0,gate_fail:0};
for(const it of items){const u=((it.json.body||it.json).messages||[]).map(m=>m.content).join('\n');
 for(const m of u.matchAll(/ITEM (B\d+) \(E-ANS; the answering side wrote this in \[CR3\]\):\n([\s\S]*?)(?=\n\nITEM |\n*$)/g)){const k=m[1]+'|'+m[2].slice(0,120);if(seen2.has(k))continue;seen2.add(k);
  const a=(m[2].match(/THE ANSWER: "([\s\S]*?)"\n/)||[])[1]||'';const gate=/^\s*(?:i\s+grant|i\s+concede|i\s+accept|granted)\b/i.test(N(a))||N(a).length<60;
  if(/THE ANSWER IN FULL/.test(m[2]))c.full++;else if(gate)c.gate_pass_no_full++;else c.gate_fail++;}}
console.log('[CR3] items: full block',c.full,'| grant-or-short but no block',c.gate_pass_no_full,'| not grant and 60+ chars (never served by design)',c.gate_fail);}
