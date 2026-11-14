const fs=require('fs'),zlib=require('zlib');const code=f=>JSON.parse(fs.readFileSync(f,'utf8')).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
// run the real node source from its top, mocking $ only for lines before try{ ; stop right after the cands pushes
const mk=c=>{const a=c.indexOf('\n',c.indexOf('try{'))+1;const s=c.indexOf("\nconst S=$('Init Seats')");const i=c.indexOf('const links=cecLinks(F);');const j=c.indexOf('\n',c.indexOf('/* pkgWVR */',i));const call=c.slice(i,j);return {f:new Function('F',c.slice(a,s)+'\n'+call+'\nreturn cands;'),call};};
const A=mk(code('rb206/e206.json')),B=mk(code('rb206/cql.json'));console.log('CALL LINE:',B.call.slice(0,400));
let rows=JSON.parse(zlib.gunzipSync(fs.readFileSync('pkgVBC_tmp/rounds8.json.gz')));
try{const R=JSON.parse(zlib.gunzipSync(fs.readFileSync('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/pkgACL2/runs.json.gz')));for(const v of Object.values(R))if(v.r)rows.push(v.r);}catch(e){console.log('runs',e.message)}
const seen=new Set();let a=0,b=0,same=0,n=0;for(const r of rows){if(seen.has(r.id))continue;seen.add(r.id);n++;const F={cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3,cr4:r.defender_r4,gr1:r.engine_r1,gr2:r.engine_r2,dr3:r.challenger_r3,dr4:r.challenger_r4};
 const x=A.f(F),y=B.f(F);a+=x.length;b+=y.length;if(JSON.stringify(y.slice(0,x.length))===JSON.stringify(x))same++;
 y.slice(x.length).forEach(c=>console.log(String(r.id).slice(0,8),c.side,'LINK',c.n,'\n   E:',String(c.earlier_q||'').slice(0,200),'\n   C:',String(c.closing_q||'').slice(0,220)));}
console.log('debates',n,'cands',a,'->',b,'prefix kept',same,'of',n);
