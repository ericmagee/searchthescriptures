// Step 6c verify of A3's step 6b (BB-8076): live vs new drvCheck (Cure Check node) over the collision lines of judgment 820 (29199 Gemini)
// and 28689's removed Gemini judgment, pulled by SQL (lines.json); plus negatives of my own. Code from A3's commit 051900b (rebuilt and equal).
const fs=require('fs');const S=process.argv[2];
const load=f=>{const s=fs.readFileSync(f,'utf8');const j=s.indexOf('return {items,marks};}',s.indexOf('function drvCheck'))+'return {items,marks};}'.length;return new Function(s.slice(0,j)+';return drvCheck;')();};
const OLD=load(S+'/live/Cure_Check.js'),NEW=load(S+'/new/Cure_Check.js');const L=JSON.parse(fs.readFileSync('lines.json'));
const show=(name,text)=>{for(const [n,f] of [['live',OLD],['new ',NEW]]){const r=f(text,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',false);
 console.log(name.padEnd(26),n,r.items.filter(x=>x.rule==='K-B'||x.rule==='K-G4').map(x=>x.rule+':'+x.link+(x.kinds?'['+x.kinds.join(',')+']':'')).join(' ')||'(none)');}};
show('820 (29199 Gemini)',L.j820.join('\n'));show('28689 removed Gemini',L.r28.join('\n'));
// my negatives: (a) next line is a concession line with tags (not footing for the BROKEN line above it); (b) next line belongs to an UNDERDETERMINED
// explanation with two tags but the BROKEN line sits two lines up; (c) [L2] with a Strong's number on the next line (rule BB-6926 counts it).
show('NEG a concession next',['D2 vs C2 (X 1:1): DEFENDER LINK BROKEN','DEFENDER | [CR2] | I grant [L1] "a quoted text here" and Job 1:1 [L3]'].join('\n'));
show('NEG b two lines down',['D2 vs C2 (X 1:1): DEFENDER LINK BROKEN','','The challenger exhibited [L1] "where prayer was wont" and Job 1:1 [L3]'].join('\n'));
show('POS c [L2] with Strong',['D2 vs C2 (X 1:1): DEFENDER LINK BROKEN','The challenger exhibited [L1] "where prayer was wont to be made" and [L2] *enomizeto* (G3543)'].join('\n'));
