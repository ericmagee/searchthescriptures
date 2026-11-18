// ASK 390 rev 3 edge plants (W1 8309 item 4.2, W3 8311): every patched reader normalizer, before (t390) and after (t390b), on all 6 mark edges
// of the two marked rounds, plus a quote of a note's own words. A quote is 3 normalized words before the edge and 3 after, taken in that reader's own words.
// Then the full LAY reader (both line forms) on the same 6 edges.
const fs=require('fs'),acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const wn390=new Function(fs.readFileSync(__dirname+'/wn390.js','utf8')+';return wn390;')();const R=JSON.parse(fs.readFileSync(__dirname+'/rounds.json'));
const A=T.unpack(JSON.parse(fs.readFileSync('a390/t390_on397.json'))),B=T.unpack(JSON.parse(fs.readFileSync('a390/t390_on397a.json')));
const FN=A.L[A.L.length-1];const wnOff390=new Function(FN+';return wnOff390;')();
// collect each normalizer that calls wnOff390, with its pre-fix text from t390 (same line index)
const NS=[];for(let i=0;i<A.L.length-1;i++){const l=A.L[i];if(!l.includes('wnOff390('))continue;
 const re=/(function (\w+)\(s\)\{return [^\n]*?\}(?=\s*$|\s*function|\s*const|\s*\n)|const (\w+)=s=>[^;\n]*;)/g;let m;
 while((m=re.exec(l))){if(!m[0].includes('wnOff390('))continue;const name=m[2]||m[3];const src=m[0];
  const old=src.replace(/wnOff390\(s\)/,'s');if(!B.L[i].includes(old))throw new Error('L'+(i+1)+' '+name+': old text not in t390');NS.push({line:i+1,name,src,old});}}
const N2549=s=>String(s==null?'':s).replace(/\\+"/g,'"').replace(/[*_`]+/g,'');const VAR={};const ctx={N:N2549,VAR,W:s=>String(s==null?'':s).replace(/[\[\]]/g,'').toLowerCase().replace(/[’']s\b/g,'').replace(/[^a-z\s]+/g,' ').split(/\s+/).filter(Boolean).map(x=>VAR[x]||x)};
const mk=src=>{const nm=(src.match(/^function (\w+)/)||src.match(/^const (\w+)/))[1];return new Function('wnOff390','N','W','VAR',(src.startsWith('const')?src.replace(/^const (\w+)=/,'const __f='):src+';const __f='+nm+';')+';return __f;')(wnOff390,ctx.N,ctx.W,VAR);};
const words=v=>(Array.isArray(v)?v.join(' '):String(v)).split(' ').filter(Boolean);
const fits=(f,txt,q)=>(' '+words(f(txt)).join(' ')+' ').includes(' '+q+' ');
const cases=[];for(const [tok,col,key] of [['ODV1-38593','engine_r2','CR2'],['ODV1-37812','defender_r4','DR4']]){const r=R.find(x=>x.run_token.startsWith(tok));const t=r[col];const w=wn390(t);
 w.notes.forEach((x,ni)=>{for(const side of ['start','end'])cases.push({tok,key,t,w,ni,side,e:side==='start'?x.span[0]:x.span[1],x});cases.push({tok,key,t,w,ni,side:'inside',x});});}
let tot={before:0,after:0,n:0};
console.log('normalizers patched:',NS.length);
for(const z of NS){const fA=mk(z.src),fB=mk(z.old);let row=[];
 for(const c of cases){let q;if(c.side==='inside'){const iw=words(fA(c.t.slice(c.x.span[0],c.x.span[1])));if(iw.length<6){row.push('in:short');continue;}q=iw.slice(0,6).join(' ');}
  else q=words(fA(c.t.slice(0,c.e))).slice(-3).concat(words(fA(c.t.slice(c.e))).slice(0,3)).join(' ');
  const u=fits(fA,c.t,q),b=fits(fB,c.w.text,q),a=fits(fA,c.w.text,q);if(!u){row.push(c.side+':NOFIT');continue;}tot.n++;if(b)tot.before++;if(a)tot.after++;
  row.push(c.side[0]+(c.side==='inside'?'n':'')+':'+(b?'Y':'n')+'>'+(a?'Y':'n'));}
 console.log(('L'+z.line+' '+z.name).padEnd(16),row.join(' '));}
console.log('quotes that fit the unmarked round:',tot.n,'| still match on the marked round, before the fix (t390):',tot.before,'| after (t390b):',tot.after);
// full LAY reader on the edges
const GA=T.load(T.rb(A.L,A.M['Send Back Build'])),GB=T.load(T.rb(B.L,B.M['Send Back Build']));
const own=t=>{const N=s=>String(s==null?'':s).toLowerCase().replace(/\\+"/g,'"').replace(/[‘’ʼ`]/g,"'").replace(/\[(?:l[1-4]|[cd]r[1-4])\]/g,' ').replace(/[\[\]]/g,'').replace(/'/g,'').replace(/[^a-z0-9Ͱ-Ͽἀ-῿֐-׿]+/g,' ').replace(/\s+/g,' ').trim();return N(String(t||'').replace(/[*_`]+/g,'').replace(/"[^"\n]{8,}?"|“[^”\n]{8,}?”/g,' | '));};
const OW=s=>own(wnOff390(s)).split(' ').filter(w=>w&&w!=='|');
for(const c of cases){if(c.side==='inside')continue;const q=OW(c.t.slice(0,c.e)).slice(-3).concat(OW(c.t.slice(c.e)).slice(0,3)).join(' ');
 const l1='D1: STANDS -- GROUND: the answer says "'+q+'"',l2='D1 vs C1: STANDS -- GROUND: [L1] Genesis 1:1 "In the beginning God created the heaven and the earth." and the answer says "'+q+'"';
 const f=(G,l,txt)=>G.LAY.scan(l,{[c.key]:txt},{}).filter(y=>y.kind==='STANDS-FIT').length;
 console.log('LAY',c.tok,'note',c.ni+1,c.side,'"'+q+'" | STANDS-FIT items (LINK STATE/COLLISION) unmarked',f(GA,l1,c.t)+'/'+f(GA,l2,c.t),'| marked before',f(GB,l1,c.w.text)+'/'+f(GB,l2,c.w.text),'| marked after',f(GA,l1,c.w.text)+'/'+f(GA,l2,c.w.text));}
