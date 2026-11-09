const {harness,live}=require('/tmp/claude-0/-home-user/86d59483-62fd-5fa0-b8c4-6322500f4823/scratchpad/sjr/prototypes/posture_e/wall2024/pkgGSL/harness.cjs');
const OLD='/mnt/project-files/wall2024/fetchback_live_s84.json',NEW='/mnt/project-files/wall2024/fetchback_live_s85.json';
const H0=harness('34108');
const a=H0(live(OLD,'Init with Guards'),'Retrieval Check')[0].json.csys,b=H0(live(NEW,'Init with Guards'),'Retrieval Check')[0].json.csys;
let p=0;while(a[p]===b[p])p++;const add=b.length-a.length;
console.log('pure insertion:',b.slice(0,p)+b.slice(p+add)===a,'| before:',JSON.stringify(a.slice(p-120,p)),'| after:',JSON.stringify(a.slice(p,p+120)));
