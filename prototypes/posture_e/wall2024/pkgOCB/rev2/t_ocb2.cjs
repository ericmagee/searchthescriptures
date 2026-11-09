// pkgOCB rev 2 tests (W4). Run from anywhere.
const {harness,live}=require(__dirname+'/../../pkgGSL/harness.cjs');const fs=require('fs');
const LIVE='/mnt/project-files/wall2024/fetchback_live_s85.json',NEW=__dirname+'/parent_s85_OCB2.json';
let ok=0,bad=0;const T=(n,c,i)=>{c?ok++:bad++;console.log((c?'OK   ':'FAIL ')+n+(i?': '+i:''));};
const a=JSON.parse(fs.readFileSync(LIVE,'utf8')),b=JSON.parse(fs.readFileSync(NEW,'utf8'));const A=Object.fromEntries(a.nodes.map(n=>[n.name,n])),B=Object.fromEntries(b.nodes.map(n=>[n.name,n]));
const ch=Object.keys(A).filter(k=>JSON.stringify(A[k])!==JSON.stringify(B[k]));T('1 only C4, C4G, C4B Extract change; connections equal',JSON.stringify(ch.sort())===JSON.stringify(['C4 Extract','C4B Extract','C4G Extract'])&&JSON.stringify(a.connections)===JSON.stringify(b.connections),ch.join(', '));
const t="Close.\nOPPONENT'S GRANTS:\nG1 [CR2] \"Luke 1:34 shows\"\n\nOPPONENT'S CONTRADICTIONS:\nX1 LINK 6 | EARLIER [CR3] \"For this birth Matthew 1:18 states a different order\" | CLOSING [CR4] \"Christ had no biological father.\" | why\n";
for(const nm of ['C4 Extract','C4G Extract','C4B Extract']){const m=B[nm].parameters.jsCode.match(/const __ogrS2=t=>\{.*?\}; \/\* pkgOCB rev 2/s)[0].replace(/ \/\* pkgOCB rev 2$/,'').replace('const __ogrS2','globalThis.__ogrS2');(0,eval)(m);
 const o=__ogrS2(t);T('2 '+nm+': X quote and G quote both blanked',!/Matthew 1:18/.test(o)&&!/Luke 1:34/.test(o));}
// 3 node-level on 34108: real output byte-equal; planted X line with Matthew 1:18 leaves new_press
const d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_C4_Call_anthropic.json','utf8'));const it=(Array.isArray(d)?d[0]:d).data.main[0];
const plant=sec=>{const c=JSON.parse(JSON.stringify(it));const x=c[0].json.content.find(z=>z.type==='text');x.text+='\n\n'+sec;return c;};
const H0=harness('34108');const o0=JSON.stringify(H0(live(LIVE,'C4 Extract'),'C4 Call anthropic')),n0=JSON.stringify(H0(live(NEW,'C4 Extract'),'C4 Call anthropic'));T('3 real 34108 C4 Extract: byte-equal to live',o0===n0);
const sec="OPPONENT'S CONTRADICTIONS:\nX1 LINK 6 | EARLIER [CR3] \"For this birth Obadiah 1:4 states a different order\" | CLOSING [CR4] \"Christ had no biological father.\" | why";
const H1=harness('34108',{'C4 Call anthropic':plant(sec)});const ro=H1(live(LIVE,'C4 Extract'),'C4 Call anthropic')[0].json,rn=H1(live(NEW,'C4 Extract'),'C4 Call anthropic')[0].json;
const has=r=>JSON.stringify(r.new_press||[]).includes("Obadiah 1:4");T('4 planted X line: live lists Obadiah 1:4 (a verse the challenger never named) in new_press, rev 2 does not',has(ro)&&!has(rn),'live '+JSON.stringify(ro.new_press).slice(0,120)+' | rev2 '+JSON.stringify(rn.new_press).slice(0,120));
const ro2={...ro},rn2={...rn};delete ro2.new_press;delete rn2.new_press;T('5 every other field equal',JSON.stringify(ro2)===JSON.stringify(rn2));
// 6 all saved runs, C4 Extract: byte-equal
const runs=[...new Set(fs.readdirSync('/mnt/project-files/wall2024/inputs/').filter(f=>f.endsWith('_C4_Call_anthropic.json')).map(f=>f.split('_')[0]))];let eq=0,df=[],sk=0;
for(const r of runs){const H=harness(r);let x,y;try{x=JSON.stringify(H(live(LIVE,'C4 Extract'),'C4 Call anthropic'));}catch(e){sk++;continue;}try{y=JSON.stringify(H(live(NEW,'C4 Extract'),'C4 Call anthropic'));}catch(e){df.push(r);continue;}x===y?eq++:df.push(r);}
T('6 saved runs ('+runs.length+'): C4 Extract byte-equal ('+eq+' equal, '+sk+' skipped)',df.length===0,df.join(','));
console.log(ok+' OK, '+bad+' FAIL');
