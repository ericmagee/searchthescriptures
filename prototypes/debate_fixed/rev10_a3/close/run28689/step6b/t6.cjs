const fs=require('fs');
const load=f=>{const s=fs.readFileSync(f,'utf8');const j=s.indexOf('return {items,marks};}',s.indexOf('function drvCheck'))+'return {items,marks};}'.length;return new Function(s.slice(0,j)+';return drvCheck;')();};
const reason=raw=>{let t=String(raw);const a=t.indexOf('{'),b=t.lastIndexOf('}');try{const o=JSON.parse(t.slice(a,b+1));return o.reasoning||t;}catch(e){return t.replace(/\\n/g,'\n');}};
const dir=process.argv[2]||'new';const OLD=load('live/Cure_Check.js'),NEW=load(dir+'/Cure_Check.js');
const kb=JSON.parse(fs.readFileSync('kb.json'));const g29=kb.find(j=>/29199/.test(j.tok)&&j.seat==='gemini');
const r28=JSON.parse(fs.readFileSync('r28.json'));
const show=(name,text)=>{for(const [n,f] of [['OLD',OLD],[dir.toUpperCase(),NEW]]){const r=f(text,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',false);
 console.log(name,n,r.items.filter(x=>x.rule==='K-B'||x.rule==='K-G4').map(x=>x.rule+':'+x.link+(x.kinds?'['+x.kinds.join(',')+']':'')).join(' '));}};
show('29199 gemini',reason(g29.raw));show('28689 gemini(removed)',reason(r28));
// F6d negatives
const neg=['D1 vs C1 (X 1:1): DEFENDER LINK BROKEN','D4: STANDS','D2 vs C2 (X 1:1): DEFENDER LINK BROKEN [L1] "a quoted text here"','plain words only, no tags at all','D3 vs C3 (X 1:1): DEFENDER LINK BROKEN','DEFENDER CHAIN MARK: FOOTED -- [L1] "x words here" and Job 1:1 [L3]','D5 vs C5 (X 1:1): DEFENDER LINK BROKEN','[L1] and [L3] with nothing after them'].join('\n');
show('NEG',neg);
