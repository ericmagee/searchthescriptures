// K-F reader test: the live pattern (base) vs the patched one (new), on GLM's and ChatGPT's real FORCED lines and on malformed lines.
const fs=require('fs'),path=require('path');const D=path.join(__dirname,'..');
function load(which){const c=fs.readFileSync(path.join(D,which,'Panel Payloads.js'),'utf8');
 const cut=(start,endTok)=>{const i=c.indexOf(start);if(i<0)throw new Error('no '+start);const j=c.indexOf(endTok,i);return c.slice(i,j+endTok.length);};
 const src=[cut('const ciQ=','\n'),cut('const ciFound=','\n'),cut('const KF_LINE=','\n'),cut('const KF_GROUND=','\n'),cut('function kfLines(','return {items,marks};}')].join('\n');
 return new Function(src+';return {KF_LINE,kfLines};')();}
const row=JSON.parse(fs.readFileSync(path.join(D,'..','regress','tests','row.json'),'utf8'))[0];
const R={CR1:row.claude_r1,DR1:row.engine_r1,CR2:row.claude_r2,DR2:row.engine_r2,CR3:row.engine_r3,DR3:row.challenger_r3,CR4:row.defender_r4,DR4:row.challenger_r4};
const lines=f=>fs.readFileSync(path.join(__dirname,f),'utf8').split('\n').filter(l=>/^\s*FORCED\s*:/i.test(l)).map(l=>l.trim());
const B=load('base'),N=load('new');let pass=0,fail=0;const ok=(c,m)=>{if(c){pass++;}else{fail++;console.log('FAIL',m);}};
for(const f of ['glm32456_reasoning.txt','glm32454_reasoning.txt','chatgpt32454_reasoning.txt','glm_cure_forced.txt'])for(const l of lines(f)){
 const b=l.match(B.KF_LINE),n=l.match(N.KF_LINE);const kb=B.kfLines(l,R),kn=N.kfLines(l,R);
 console.log(f.slice(0,12),l.slice(0,22),'| base match',!!b,'items',kb.items.map(x=>x.why).join('; ')||'none','| new match',!!n,'items',kn.items.map(x=>x.why).join('; ')||'none');
 ok(!!n,'new reads '+f+' '+l.slice(0,30));
 if(b)ok(b.slice(1).join('|')===n.slice(1).join('|'),'same captures where base already matched: '+l.slice(0,30));}
// negatives: must still be malformed
const neg=['FORCED: D2 vs C4 -- MEANS [CR3]: "the pregnancy is found" -- FAILS: "x y z"',
 'FORCED: D2 vs C4 -- MEANS [CR3] the pregnancy -- ANSWER [DR3]: "a b c" -- FAILS: "a b c"',
 'FORCED: D2 vs C4 -- MEANS [XR3]: "a b c" -- ANSWER [DR3]: "a b c" -- FAILS: "a b c"',
 'FORCED: D2 -- MEANS [CR3]: "a b c" -- ANSWER [DR3]: "a b c" -- FAILS: "a b c"'];
for(const l of neg){ok(!l.match(N.KF_LINE),'negative read as valid: '+l);ok(N.kfLines(l,R).items.some(x=>x.why==='malformed'),'negative not marked malformed: '+l);}
// a quotation not in its round still fails under the new reader
const fake='FORCED: D2 vs C4 -- MEANS [[CR3]]: "the moon is made of green cheese entirely" ([L2] x) -- ANSWER [[DR3]]: "Matthew sets the coming together by the taking that follows" -- FAILS: "Matthew sets the coming together by the taking that follows" -- reason';
const kf=N.kfLines(fake,R);ok(kf.items.length===1&&/MEANS quotation is not in/.test(kf.items[0].why),'invented MEANS quotation passed: '+JSON.stringify(kf.items));
console.log('PASS',pass,'FAIL',fail);process.exit(fail?1:0);
