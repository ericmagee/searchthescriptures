const {harness,live,feeder}=require('/tmp/claude-0/-home-user/86d59483-62fd-5fa0-b8c4-6322500f4823/scratchpad/sjr/prototypes/posture_e/wall2024/pkgGSL/harness.cjs');
const OLD='/mnt/project-files/wall2024/fetchback_live_s84.json',NEW='/mnt/project-files/wall2024/fetchback_live_s85.json';
const H0=harness('34108');
const iO=H0(live(OLD,'Init with Guards'),'Retrieval Check')[0].json, iN=H0(live(NEW,'Init with Guards'),'Retrieval Check')[0].json;
const diffs=Object.keys(iN).filter(k=>JSON.stringify(iN[k])!==JSON.stringify(iO[k]));
console.log('B1 changed keys:',diffs);
for(const k of diffs){const a=JSON.stringify(iO[k]),b=JSON.stringify(iN[k]);let p=0;while(a[p]===b[p])p++;console.log(' ',k,'prefix-equal',p,'old len',a.length,'new',b.length,'| added:',b.slice(p,p+80),'...');}
console.log('B1 watch in csys',/CONTRADICTION WATCH\./.test(iN.csys),'in dsys',/CONTRADICTION WATCH/.test(JSON.stringify(iN.dsys||'')));
// B2
const H1=harness('34108',{'Init with Guards':[{json:iN}]});
const cO=JSON.stringify(H0(live(OLD,'C4 Build'),'C4 Lexicon Sheet')),cN=JSON.stringify(H1(live(NEW,'C4 Build'),'C4 Lexicon Sheet'));
console.log('B2 section in request',cN.includes("OPPONENT'S CONTRADICTIONS."),'old has',cO.includes("OPPONENT'S CONTRADICTIONS."), 'len',cO.length,cN.length);
const cN0=JSON.stringify(H0(live(NEW,'C4 Build'),'C4 Lexicon Sheet'));console.log('B2 gated off with old csys (byte-equal):',cN0===cO);
// B4
const c4in=H0(()=>0,'C4 Call anthropic');
const raw0=require('fs').readFileSync('/mnt/project-files/wall2024/inputs/34108_C4_Extract.json','utf8');
const d=JSON.parse(raw0);const R=(n)=>{const x=JSON.parse(require('fs').readFileSync('/mnt/project-files/wall2024/inputs/34108_'+n.replace(/ /g,'_')+'.json','utf8'));const r=Array.isArray(x)?x[0]:x;return ((r.data&&r.data.main)||r.main)[0][0].json.raw;};
const CR3=R('D3B Extract'),CR4=R('D4B Extract');
const q=(t,re)=>{const m=t.match(re);return m?m[0]:null};
console.log('CR3 has ordinary means:',q(CR3,/[^.\n]{0,60}ordinary means[^.\n]{0,40}/));
console.log('CR4 has cannot supply the sequence:',q(CR4,/[^.\n]{0,60}cannot supply the sequence[^.\n]{0,40}/));
module.exports={iN};
