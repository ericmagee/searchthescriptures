// pkgABR build. node build.cjs <parent workflow json> <out json>
// Changes ONLY the Shared Library node: ABS.check gains readIn (an absence phrase that answers a reading-in does not raise),
// then recomputes the MAP length (n) of every node whose rebuilt source changes. Refuses unless each edit matches exactly once.
const fs=require('fs');const crypto=require('crypto');const {parseLib,src}=require('./rebuild.cjs');
const [,,IN,OUT]=process.argv;const W=JSON.parse(fs.readFileSync(IN,'utf8'));const nodes=W.nodes||W.workflow.nodes;
const lib=nodes.find(n=>n.name==='Shared Library');const code=lib.parameters.jsCode;
const head=code.slice(0,code.indexOf('\n/*LIB*/')+8),mid='\n/*MAP*/',tail=code.slice(code.lastIndexOf('\n/*END*/'));
const {L,M}=parseLib(code);
const EDITS=[[" function check(id,ctx){", " /* pkgABR (W1, run 36677 luna Haggai 2:23): an absence phrase followed, in the same sentence, by a quotation of 3 words or more that is not in the checked verse but is a run of another verse served this run answers a reading-in; it is not a meeting by absence. */ function readIn(id,t,a,ctx){try{const L=N(id&&id.flagged_line);const vm=L.match(/ANSWER CHECK:\\s*((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?)\\s(\\d{1,3}):(\\d{1,3})/);if(!vm||!a)return null; const W=s=>' '+String(s==null?'':s).replace(/\\[[^\\]]*:[^\\]]*\\]/g,' ').replace(/[\\[\\]]/g,'').toLowerCase().replace(/[\u2019']/g,\"'\").replace(/[^a-z' ]+/g,' ').replace(/\\s+/g,' ').trim()+' '; const rows=((ctx&&ctx.rows)||[]).filter(r=>r&&r.book&&r.text);const me=rows.find(r=>r.book===vm[1]&&+r.chapter===+vm[2]&&+r.verse===+vm[3]);if(!me)return null; const at=String(t).search(AB);if(at<0)return null;const m=String(t).slice(at+a.length).match(/^[^.]{0,60}?[\"\u201c'\u2018]([^\"\u201d'\u2019]{6,160})[\"\u201d'\u2019]/);if(!m)return null; const q=W(m[1]).trim();if(q.split(' ').length<3||W(me.text).includes(' '+q+' '))return null;const o=rows.find(r=>r!==me&&W(r.text).includes(' '+q+' ')); return o?{q:m[1],v:vm[1]+' '+vm[2]+':'+vm[3],ref:o.book+' '+o.chapter+':'+o.verse}:null;}catch(e){return null;}} function check(id,ctx){"], ["  const f=fit(t,ctx);if(f==='COUNTED')return {applies:true,raise:false,absence:a,fit:f,why:'absence phrase \"'+a+'\" with a counted [L1] positive fit'};", "  {const __ri=readIn(id,t,a,ctx);if(__ri)return {applies:true,raise:false,absence:a,readin:__ri,why:'absence phrase \"'+a+'\" answers a reading-in: the quoted words \"'+__ri.q+'\" are not in '+__ri.v+' but are words of '+__ri.ref+' (pkgABR)'};}const f=fit(t,ctx);if(f==='COUNTED')return {applies:true,raise:false,absence:a,fit:f,why:'absence phrase \"'+a+'\" with a counted [L1] positive fit'};"]];
const L2=L.slice();
for(const [a,b] of EDITS){const hits=[];L2.forEach((x,i)=>{let k=-1,c=0;while((k=x.indexOf(a,k+1))>=0)c++;if(c)hits.push([i,c]);});
 if(hits.length!==1||hits[0][1]!==1)throw new Error('edit must match exactly once: '+a+' -> '+JSON.stringify(hits));L2[hits[0][0]]=L2[hits[0][0]].replace(a,b);console.log('edited LIB line',hits[0][0]);}
const M2={};let changed=[];for(const n of Object.keys(M)){const before=src(L,M,n),after=src(L2,M,n);if(before.length!==M[n].n)throw new Error('parent map length mismatch '+n);M2[n]={...M[n],n:after.length};if(after!==before)changed.push(n+' '+M[n].n+' -> '+after.length);}
const libtxt=JSON.stringify(L2),oldsha=(head.match(/library sha (\w+),/)||[])[1];if(!oldsha)throw new Error('no library sha in header');
const newsha=crypto.createHash('sha256').update(libtxt).digest('hex').slice(0,16);
const code2=head.replace('library sha '+oldsha+',','library sha '+newsha+',')+libtxt+mid+JSON.stringify(M2)+tail;console.log('header library sha',oldsha,'->',newsha);
for(const n of Object.keys(M2))if(src(L2,M2,n).length!==M2[n].n)throw new Error('rebuilt length mismatch '+n);
lib.parameters.jsCode=code2;fs.writeFileSync(OUT,JSON.stringify(W));
const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
console.log('nodes whose rebuilt source changes:',changed.length);changed.forEach(c=>console.log('  '+c));
console.log('Shared Library jsCode',code.length,'->',code2.length,'('+(code2.length-code.length>=0?'+':'')+(code2.length-code.length)+')');
console.log('parent sha',sha(fs.readFileSync(IN,'utf8')),'out sha',sha(fs.readFileSync(OUT,'utf8')));
