// rev 3 vs rev 4 void372 on every stored line carrying VOID and a premise number (12 exports), premises 1-9.
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const F=p=>{const T=un(p).nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));return new Function(L[3122].match(/const void372=[^]*?return false;};/)[0]+';return void372;')();};
const v3=F('/mnt/project-files/wall2024/parent_s143_JOINT_P72r3_DFR.json'),v4=F(process.argv[2]);const W='/mnt/project-files/wall2024/';const seen=new Set();let lines=0,both=0,only4=0,only3=0;const out=[];
for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const rd=JSON.parse(fs.readFileSync(W+f,'utf8')).data.resultData.runData;
 const walk=o=>{if(typeof o==='string'){if(!/VOID/i.test(o))return;for(const l of o.split('\n')){if(!/void/i.test(l)||!/premise/i.test(l)||seen.has(l))continue;seen.add(l);lines++;for(let n=1;n<=9;n++){const a=v3(l,n),b=v4(l,n);if(a&&b)both++;else if(b){only4++;out.push(f.slice(2,7)+' n='+n+' | '+l.slice(0,300));}else if(a)only3++;}}}else if(o&&typeof o==='object')for(const k in o)walk(o[k]);};
 for(const k in rd)rd[k].forEach(r=>walk(r.data));}
console.log('distinct lines with VOID and premise',lines,'| (line,premise) read VOID by both',both,'| rev 4 only',only4,'| rev 3 only',only3);
const seenS=new Set();for(const x of out){const k=x.slice(0,300);if(!seenS.has(k)){seenS.add(k);console.log(x);}}
