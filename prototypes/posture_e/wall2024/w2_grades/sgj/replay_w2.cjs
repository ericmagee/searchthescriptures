const fs=require('fs');const R=require('../../pkgCNP/rounds.cjs');
const get=(f)=>{const c=JSON.parse(fs.readFileSync(f,'utf8')).nodes.find(n=>n.name==='C4 Build').parameters.jsCode;
 const a=c.indexOf(' const RX=');const b=c.indexOf(' function block(');return new Function(c.slice(a,b)+';return [harvest,N];')();};
const [OLD,N]=get('/mnt/project-files/wall2024/fetchback_live_s155.json'),[NEW]=get('/mnt/project-files/wall2024/parent_s155_SGJ.json');
const runs=Object.assign({},...process.argv.slice(2).map(f=>R(f)));
let T={old:0,nw:0,same:0,nl:0,notverb:0,lead:0,joinbullet:0};
for(const [rt,F] of Object.entries(runs)){const r={CR1:F.cr1,CR2:F.cr2,CR3:F.cr3,CR4:F.cr4};if(!r.CR1)continue;
 const o=OLD(r),n=NEW(r);T.old+=o.length;T.nw+=n.length;const os=new Set(o.map(x=>x.text));
 let jb=0;for(const x of o)if(/ - |\s[-*] \[/.test(x.text)&&!N(r[x.round]).includes(x.text))jb++;T.joinbullet+=jb;
 for(const x of n){if(os.has(x.text))T.same++;if(/\n/.test(x.text))T.nl++;if(!N(r[x.round]).includes(x.text)){T.notverb++;console.log('NOT VERBATIM',rt,x.round,JSON.stringify(x.text.slice(0,120)));}
  if(!/^(?:I\s|Granted|Conceded|CONCEDED)/.test(x.text))T.lead++;}
 console.log(rt,'old',o.length,'new',n.length,'old items not verbatim (joined across line):',jb);}
console.log(JSON.stringify(T));
