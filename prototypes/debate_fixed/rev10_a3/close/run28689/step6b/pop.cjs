const fs=require('fs');let t=fs.readFileSync('/root/.claude/projects/-home-user-searchthescriptures/b26695b3-56b9-5f42-92b7-63fcf7fb72c9/tool-results/mcp-supbase-fix-execute_sql-1793254892477.txt','utf8');try{const o=JSON.parse(t);if(o.result)t=o.result}catch(e){}
const a=t.indexOf('[{"x"'),b=t.lastIndexOf('}]')+2;const J=JSON.parse(t.slice(a,b))[0].x;const R=JSON.parse(fs.readFileSync('removed.json'));
const load=f=>{const s=fs.readFileSync(f,'utf8');const j=s.indexOf('return {items,marks};}',s.indexOf('function drvCheck'))+'return {items,marks};}'.length;return new Function(s.slice(0,j)+';return drvCheck;')();};
const reason=raw=>{let t=String(raw);const a=t.indexOf('{'),b=t.lastIndexOf('}');try{const o=JSON.parse(t.slice(a,b+1));if(typeof o.reasoning==='string')return o.reasoning;}catch(e){}return t;};
const dir=process.argv[2]||'new';const OLD=load('live/Cure_Check.js'),NEW=load(dir+'/Cure_Check.js');
const all=[...J.map(j=>({src:'judg '+j.id,tok:j.tok,seat:j.seat,raw:j.raw})),...R.map(r=>({src:'removed',tok:r.tok,seat:r.seat,raw:r.raw}))];
let o=0,n=0;const gone=[],added=[];
for(const x of all){const txt=reason(x.raw);const ko=OLD(txt,0,0,'','',false).items.filter(i=>i.rule==='K-B').map(i=>i.link);const kn=NEW(txt,0,0,'','',false).items.filter(i=>i.rule==='K-B').map(i=>i.link);
 o+=ko.length;n+=kn.length;for(const l of ko)if(!kn.includes(l))gone.push(x.tok.slice(5,10)+' '+x.seat+' '+x.src+' '+l);for(const l of kn)if(!ko.includes(l))added.push(x.tok+' '+l);}
console.log('texts',all.length,'K-B old',o,'new',n);console.log('GONE',gone.length);gone.forEach(g=>console.log('  '+g));console.log('ADDED',added.length,added.join('; '));
