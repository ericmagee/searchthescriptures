const {harness,live,feeder}=require(__dirname+'/../../pkgGSL/harness.cjs');
const OLD='/mnt/project-files/wall2024/fetchback_live_s83.json',NEW=__dirname+'/../parent_s83_OCB.json';
const nodes=['Init with Guards','C4 Build','C4 Extract','C4G Extract','C4B Extract','Build Synthesis','Build Independent Verdict','Build Save Body','Panel Build','Format Markdown','D4 Build','D4 Extract','D4B Extract'];
const H=harness('34108');
for(const n of nodes){const f=feeder(OLD,n)[0];let a,b;try{a=JSON.stringify(H(live(OLD,n),f));}catch(e){a='ERR '+e.message}try{b=JSON.stringify(H(live(NEW,n),f));}catch(e){b='ERR '+e.message}
 console.log(n,'| feeder',f,'| old',a.slice(0,60),'| eq',a===b,'| lens',a.length,b.length);}
