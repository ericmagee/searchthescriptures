const {harness,live}=require(__dirname+'/../../pkgGSL/harness.cjs');
const OLD='/mnt/project-files/wall2024/fetchback_live_s83.json',NEW=__dirname+'/../parent_s83_OCB.json';
const H0=harness('34108');
const a=H0(live(OLD,'Init with Guards'),'Retrieval Check')[0].json.csys,b=H0(live(NEW,'Init with Guards'),'Retrieval Check')[0].json.csys;
let p=0;while(a[p]===b[p])p++;const add=b.length-a.length;
console.log('pure insertion:',b.slice(0,p)+b.slice(p+add)===a,'| before:',JSON.stringify(a.slice(p-120,p)),'| after:',JSON.stringify(a.slice(p,p+120)));
