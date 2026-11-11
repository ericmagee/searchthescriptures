// W2 repeat 4 study: which clause of sol's 34726 CHALLENGER CONCEDED LINKS line raises K-C under live s125 Panel Payloads. Variants replace the line in the stored judge reply.
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};const L=g((process.argv[2]||'s125').includes('/')?process.argv[2]:'/mnt/project-files/wall2024/fetchback_live_'+(process.argv[2]||'s125')+'.json');
const lt=L.nodes.find(x=>x.name==='Shared Library').parameters.jsCode;const code=rebuild(L.nodes.find(x=>x.name==='Panel Payloads').parameters.jsCode,lt);
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34726_full.json'));const rd0=(X.data||X).resultData.runData;
let J=null;for(const n of ['Panel Judge 1 openrouter','Panel Judge 2 openrouter','Panel Judge 3 openrouter']){if(rd0[n]&&JSON.stringify(rd0[n]).includes('Premise 4 is VOID (Commitment 6)'))J=n;}console.log('sol node',J);
const ORIG=(()=>{const s=JSON.stringify(rd0[J]);const m=s.match(/CHALLENGER CONCEDED LINKS: 0 -- Premises 1, 2, 3 and 6[^\\]*(?:\\(?!n)[^\\]*)*/);return m[0];})();
console.log('orig line (json-escaped) length',ORIG.length);
const kc=async(rep)=>{const rd=JSON.parse(JSON.stringify(rd0));rd[J]=JSON.parse(JSON.stringify(rd0[J]).split(ORIG).join(rep));const o=await run(code,'Panel Payloads',rd);if(o.err)return 'ERR '+o.err;const s=JSON.stringify(o);const i=s.indexOf('(K-C) -- CHALLENGER CONCEDED LINKS');return i>=0?'K-C RAISED':'no K-C';};
(async()=>{console.log(process.argv[2]||'s125','orig:',await kc(ORIG));if(process.argv[3]!=='all')return;
 const sents=ORIG.replace(/^CHALLENGER CONCEDED LINKS: 0 -- /,'').split(/(?<=\.)\s+(?=[A-Z])/);console.log('sentences',sents.length);
 for(let i=0;i<sents.length;i++){const v='CHALLENGER CONCEDED LINKS: 0 -- '+sents[i];console.log('S'+i,(await kc(v)).padEnd(12),sents[i].slice(0,140));}
 console.log('only head:',await kc('CHALLENGER CONCEDED LINKS: 0 -- Premises 1, 2, 3 and 6 are spared on their exhibited footing and answers.'));})();
