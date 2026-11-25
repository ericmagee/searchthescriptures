// ASK 653 tests (W4): replay the [L2] check (L2C Count Plan entry, built LIBs) on the 42528 and 42373 tags, before and after; plus unit cases.
const fs=require('fs');
function L2Cof(file){const E=JSON.parse(fs.readFileSync(file,'utf8'));const T=E.nodes.find(k=>k.name==='Shared Library').parameters.jsCode;
 const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))['L2C Count Plan'];
 let S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');if(S.length!==M.n)throw new Error('MAP n mismatch '+file);
 S=S.replace('return {tags,tagWords,','return {markRoots,tags,tagWords,');
 return new Function('$','REFP',S+'\nreturn L2C;')(()=>{throw new Error('no $')},new Proxy({},{get:()=>undefined}));}
const OLD=L2Cof('tg/live_50ade174.json'),NEW=L2Cof('tg/target_engine_653.json');
let pass=0,fail=0;const ok=(c,m)=>{if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}};
const strip=t=>({...t,words:(t.words||[]).map(w=>({w:w.w,kind:w.kind})),status:undefined,why:undefined});
const exp={'42528':[88,90,91,99,101,107,108,112,113,151,152,155,160,171,236],'42373':[]};
for(const run of ['42528','42373']){
 const F=JSON.parse(fs.readFileSync('fx_'+run+'.json','utf8'));const GD={ok:F.e340.ok,eng:F.e340.eng};
 const go=X=>X.check(F.tags.map(strip).map(t=>({...t,words:X.markRoots(t.seg,t.words)})),F.ow,F.lex,F.read,GD);
 const A=go(OLD),B=go(NEW);const out=[];const ch=[];
 F.tags.forEach((t,j)=>{out.push([j,t.side,t.round,'stored='+t.status,'before='+A[j].status,'after='+B[j].status,'why_after='+B[j].why,'seg='+t.seg].join(' | '));if(A[j].status!==B[j].status)ch.push(j);});
 fs.writeFileSync('l2_'+run+'_before_after.txt',out.join('\n')+'\n');
 const rep=F.tags.filter((t,j)=>A[j].status===t.status).length;
 ok(rep>=F.tags.length-1,run+': before-replay reproduces stored status '+rep+'/'+F.tags.length);
 ok(JSON.stringify(ch)===JSON.stringify(exp[run]),run+': changed tags exactly '+JSON.stringify(ch));
 ok(ch.every(j=>A[j].status==='NOT COUNTED'&&B[j].status==='COUNTED'),run+': every change is NOT COUNTED -> COUNTED');
 ok(ch.every(j=>F.tags[j].side==='DEFENDER'),run+': sides of changes '+[...new Set(ch.map(j=>F.tags[j].side))].join(','));
 {const wc=F.tags.map((t,j)=>j).filter(j=>!ch.includes(j)&&JSON.stringify(A[j].words)!==JSON.stringify(B[j].words));ok(wc.every(j=>A[j].status===B[j].status),run+': other tags whose root marks change keep their status: '+wc.length);for(const j of wc)console.log('    ROOTS ONLY',j,F.tags[j].side,F.tags[j].round,A[j].status,'roots now:',(B[j].words||[]).filter(w=>w.root).map(w=>w.w).join(' '),'|',F.tags[j].seg.slice(0,100));}
 const nc=B.map((t,j)=>t.status==='NOT COUNTED'?j:-1).filter(j=>j>=0);console.log('  '+run+' NOT COUNTED after: '+nc.length+' -> '+nc.map(j=>F.tags[j].side[0]+F.tags[j].round+':'+(B[j].why||'').slice(0,60)).join(' || '));
}
// unit cases on NEW
const mk=(ws)=>ws.map(w=>({w,kind:/^[GH]\d+$/.test(w)?'strongs':/[Ͱ-Ͽἀ-῿]/.test(w)?'greek':'latin'}));
const roots=(seg,ws)=>NEW.markRoots(seg,mk(ws)).filter(x=>x.root).map(x=>x.w);
ok(roots('G435 (anēr): "a primary word (compare ἄνθρωπος); a man"',['G435','ἄνθρωπος']).join()==='ἄνθρωπος','compare marks root, number stays core');
ok(roots('G4905 (synerchomai) and G3880 (paralambano)',['G4905','G3880']).length===0,'and between two numbers: no root');
ok(roots('ἀνήρ and ἄνθρωπος stand in the verse',['ἀνήρ','ἄνθρωπος']).length===0,'and with no root before it: no root');
// N1: a tag holding only an absent "compare X" stays NOT COUNTED
{const F=JSON.parse(fs.readFileSync('fx_42528.json','utf8'));const v=F.tags.find(t=>t.verses&&t.verses.length&&F.read.includes(t.verses[0])).verses[0];
 const t={side:'DEFENDER',round:'CR2',seg:'(compare ἄνθρωπος) as said here',words:NEW.markRoots('(compare ἄνθρωπος) as said here',mk(['ἄνθρωπος'])),verses:[v],apoc:[]};
 const r=NEW.check([t],F.ow,F.lex,F.read,{ok:F.e340.ok,eng:F.e340.eng})[0];ok(r.status==='NOT COUNTED','N1: tag with only an absent "compare ἄνθρωπος" stays NOT COUNTED ('+r.status+'; '+r.why+')');}
console.log(pass+' PASS, '+fail+' FAIL');
