// brace repair: GLM's real cut-off reply (run 32471) is read; whole replies unchanged; a reply cut mid-text still fails closed.
const fs=require('fs'),path=require('path');const D=path.join(__dirname,'..');const fx=JSON.parse(fs.readFileSync(path.join(__dirname,'fx.json'),'utf8'));
const cut=(c,s,e)=>{const i=c.indexOf(s);if(i<0)throw new Error('no '+s);const j=c.indexOf(e,i);return c.slice(i,j+e.length);};
function V(which){const c=fs.readFileSync(path.join(D,which,'Panel Check.js'),'utf8');const src="const RT=' run_token=T';"+cut(c,'function repairReasoning(','return x.slice(0,vs)+out+x.slice(ve);}')+'\n'+c.slice(c.indexOf('function verdict(seat,text){'),c.indexOf('\nfunction intOrFail'))+'\nreturn verdict;';
 try{return new Function(src)();}catch(e){const k=c.indexOf('function verdict(seat,text){');console.log(c.slice(k,k+900));throw e;}}
function U(which){const c=fs.readFileSync(path.join(D,which,'Panel Cure Normalize 1.js'),'utf8');return new Function(cut(c,'function netUnwrap(text){','return t;}')+'\nreturn netUnwrap;')();}
const vb=V('base'),vn=V('new'),ub=U('base'),un=U('new');let pass=0,fail=0;const ok=(c,m)=>{if(c)pass++;else{fail++;console.log('FAIL',m);}};
const thr=f=>{try{f();return null;}catch(e){return e.message;}};
ok(/no JSON object/.test(thr(()=>vb('glm',fx.glm_cut))||''),'base fails on the cut reply (the defect reproduced)');
let o=null;ok(!thr(()=>{o=vn('glm',fx.glm_cut);}),'new reads the cut reply');ok(o&&o.verdict_tag==='HELD'&&typeof o.reasoning==='string'&&o.reasoning.length>7000,'fields and the whole reasoning read: '+(o&&o.verdict_tag)+' '+(o&&o.reasoning&&o.reasoning.length));
const w1=vb('chatgpt',fx.chatgpt_whole),w2=vn('chatgpt',fx.chatgpt_whole);ok(JSON.stringify(w1)===JSON.stringify(w2),'a whole reply reads the same');
ok(/no JSON object|FAIL-CLOSED/.test(thr(()=>vn('glm',fx.glm_cut.slice(0,5000)))||'x'),'a reply cut mid-text still fails closed');
ok(/no JSON object/.test(thr(()=>vn('glm',''))||''),'an empty reply still fails closed');
ok(/no JSON object/.test(thr(()=>vn('glm','I cannot judge this.'))||''),'a prose reply still fails closed');
ok(ub(fx.glm_cut)===fx.glm_cut,'base rule-check reader returns the raw JSON for the cut reply (the downstream defect)');
ok(un(fx.glm_cut)===o.reasoning,'new rule-check reader returns the reasoning text');ok(un(fx.chatgpt_whole)===ub(fx.chatgpt_whole),'rule-check reader unchanged on a whole reply');
console.log('PASS',pass,'FAIL',fail);process.exit(fail?1:0);
