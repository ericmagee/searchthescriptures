// Wall 8251/8252: sites 6 and 8 old against new on the CHANGE TO shapes of the 151 vs-line STANDS send-back rows
const fs=require('fs');const src=fs.readFileSync(__dirname+'/shim394.cjs','utf8');
const pre=src.slice(0,src.indexOf('// pool'));const S=new Function('require','__dirname',pre+';return {SITES,RL,RI,col};')(require,__dirname);
const lines=['D1 vs C1 (Matthew 1:20): STANDS -- x','D4 vs C4 (Luke 1:35; Isaiah 7:14): DEFENDER LINK STANDS -- x','D2 vs C3 (Romans 1:3): STANDS -- the answer fits','**D6 vs C2 (Matthew 1:16)**: STANDS -- x'];
const DLB='DEFENDER LINK BROKEN',CLB='CHALLENGER LINK BROKEN',UND='UNDERDETERMINED';
for(const l of lines){const s6=S.SITES['6 GR1'],s8=S.SITES['8 GRADED1'];
 console.log(JSON.stringify(l.slice(0,50)),'| site6 old',s6.old(l),'new',s6.nu(s6.R,l),'new+STANDS',S.col(s6.R,l,[DLB,CLB,UND,'STANDS'])?'Y':null,'| site8 old',s8.old(l),'new',s8.nu(s8.R,l));}
