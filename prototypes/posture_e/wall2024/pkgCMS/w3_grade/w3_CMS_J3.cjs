// W3 grade of pkgCMS (W1, bbfacf27). node pkgCMS/w3_grade/w3_CMS.cjs > pkgCMS/w3_grade/w3_CMS_out.txt
process.chdir(__dirname+'/../..');const fs=require('fs');const acorn=require('../../pkgLIB/vendor/acorn.cjs');const {strip}=require('../../pkgLIB/strip.cjs');const {rebuild}=require('../../pkgLIB/unpack.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const L=g('/tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/U_BRF4_CCM.json'),C=g('/mnt/project-files/wall2024/joint_s115_BRF4_CCM_CMS.json');
let fails=0;const ok=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);if(!c)fails++;};
const W='async function VmCodeWrapper() { ';
const tree=(code,cm)=>{const t=acorn.parse(W+code+'\n}',{ecmaVersion:2025,sourceType:'module',onComment:cm?(b,text)=>cm.push(text):undefined});return JSON.stringify(t,(k,v)=>(k==='start'||k==='end'||k==='loc'||k==='range')?undefined:(typeof v==='bigint'?String(v):v));};
const same=(a,b)=>{try{return tree(a)===tree(b);}catch(e){return 'ERR '+e.message;}};
const LB={};L.nodes.forEach(n=>LB[n.name]=n);const js=n=>n.parameters&&typeof n.parameters.jsCode==='string'?n.parameters.jsCode:null;const isStub=c=>/^\/\/ pkgLIB stub/.test(c);
// G1
{const s0=o=>{const x=JSON.parse(JSON.stringify(o));if(x.parameters)delete x.parameters.jsCode;return JSON.stringify(x);};const bad=C.nodes.filter(n=>!LB[n.name]||s0(n)!==s0(LB[n.name])).map(n=>n.name);
 const nonCode=C.nodes.filter(n=>js(n)==null&&JSON.stringify(n)!==JSON.stringify(LB[n.name])).map(n=>n.name);
 ok(C.nodes.length===418&&L.nodes.length===418&&!bad.length&&!nonCode.length&&JSON.stringify(C.connections)===JSON.stringify(L.connections),'G1 418 nodes; all but Code text equal live; connections equal'+(bad.length?' DIFFER: '+bad.join(', '):''));
 const top=Object.keys(C).filter(k=>k!=='nodes'&&k!=='connections'&&JSON.stringify(C[k])!==JSON.stringify(L[k]));console.log('   other top-level keys that differ from the fetch-back: '+(top.join(', ')||'none'));}
// G2, G4
const changed=C.nodes.filter(n=>js(n)!=null&&js(n)!==js(LB[n.name]));const plain=changed.filter(n=>n.name!=='Shared Library'&&!isStub(js(n)));const stubs=changed.filter(n=>isStub(js(n)));
console.log('changed Code nodes: '+changed.length+' (plain '+plain.length+', stubs '+stubs.length+', Shared Library '+(changed.some(n=>n.name==='Shared Library')?1:0)+')');
{const bad=[],left=[];let removed=0,cmt=0;for(const n of plain){const r=same(js(LB[n.name]),js(n));if(r!==true)bad.push(n.name+(r===false?'':' '+r));const cm=[];try{tree(js(n),cm);}catch(e){}if(cm.length)left.push(n.name+' ('+cm.length+')');const c0=[];try{tree(js(LB[n.name]),c0);}catch(e){}removed+=js(LB[n.name]).length-js(n).length;cmt+=c0.reduce((a,t)=>a+t.length+2,0);}
 ok(!bad.length,'G2 syntax tree equal, live against stripped, plain nodes: '+(plain.length-bad.length)+' of '+plain.length+(bad.length?' DIFFER: '+bad.join('; '):''));
 ok(!left.length,'G4 no comment left in a stripped plain node'+(left.length?': '+left.join(', '):''));console.log('   characters removed from plain nodes: '+removed+'; comment text counted by the parser in the live nodes (text plus two marker characters each, a lower bound): '+cmt);}
// G3
{const libL=js(LB['Shared Library']),libC=js(C.nodes.find(n=>n.name==='Shared Library'));const allStubs=C.nodes.filter(n=>js(n)!=null&&isStub(js(n)));let eq=0,tr=0,bad=[],stubDiff=[]; /* the two E4 heads (Alternate Build, Early Alternate Build) build __S in the same three lines but end differently; cut after the length check */const rb=(st,lib)=>{try{return rebuild(st,lib);}catch(e){const i=st.indexOf('\nconst __e4h=');if(i<0||st.indexOf('const __S=')<0||st.indexOf('const __S=')>i)throw e;const $=n=>{if(n!=='Shared Library')throw new Error('stub read '+n);return {params:{jsCode:lib}};};return new Function('$',st.slice(0,i)+'\nreturn __S;')($);}};
 for(const n of allStubs){if(js(n)!==js(LB[n.name]))stubDiff.push(n.name);let a,b;try{a=rb(js(LB[n.name]),libL);b=rb(js(n),libC);}catch(e){bad.push(n.name+' rebuild: '+e.message);continue;}if(a===b)eq++;else{const r=same(a,b);if(r===true)tr++;else bad.push(n.name+(r===false?' tree differs':' '+r));}}
 ok(!bad.length,'G3 '+allStubs.length+' stubs: sources rebuilt from the new library byte-equal to live '+eq+', tree-equal after the strip '+tr+(bad.length?' BAD: '+bad.join('; '):''));
 console.log('   stubs whose own text differs from live: '+(stubDiff.length?stubDiff.join(', '):'none')+'; Shared Library '+libL.length+' -> '+libC.length+' ('+(libC.length-libL.length)+')');
 for(const nm of stubDiff){const a=js(LB[nm]),b=js(C.nodes.find(n=>n.name===nm));let i=0;while(a[i]===b[i])i++;console.log('   '+nm+' stub differs at '+i+': live "'+a.slice(i-40,i+60).replace(/\n/g,'\\n')+'" | cand "'+b.slice(i-40,i+60).replace(/\n/g,'\\n')+'"');}}
// G5 plants on the strip function
{const P={a:'if(x){return /*\n*/ 1;}',b:'const t=`line one  \n\n  // not a comment\n /* nor this */  \n\nend`;return t;',c:'const u="http://x//y";const r=/\\/\\*|\\/\\//g;return u.replace(r,"");',d:'let a=b /* c */ / d / e;\nlet x=y //c\n(z)',e:'i++ /*\n*/\nj\nreturn i //last',f:'const f=async /* c */ (q)=>q;const s=String.raw /* t */ `a//b`;return [f,s];',g1:'x = 1 <!-- 2',g2:'#!shebang\nreturn 1'};
 for(const k in P){let t,r;try{t=strip(P[k]);r=same(P[k],t);}catch(e){r='strip or parse refuses: '+e.message.slice(0,80);}console.log((r===true?'OK   ':'NOTE ')+'G5'+k+' '+JSON.stringify(P[k]).slice(0,90)+' -> '+(t===undefined?'(no output)':JSON.stringify(t).slice(0,90))+' : '+(r===true?'tree equal':r===false?'TREE CHANGES':r));}
 // the hazard of plant b in live: a template literal or string with a blank line, a white-space-only line or trailing space at a line end, in any changed node
 const hz=[];for(const n of plain){const src=js(LB[n.name]);let t;try{t=acorn.parse(W+src+'\n}',{ecmaVersion:2025,sourceType:'module'});}catch(e){continue;}const walk=o=>{if(!o||typeof o!=='object')return;if(Array.isArray(o)){o.forEach(walk);return;}if(o.type==='TemplateElement'&&/(^|\n)[ \t]*\n|[ \t]+\n/.test(o.value.raw))hz.push(n.name);for(const k in o)if(k!=='loc')walk(o[k]);};walk(t);}
 console.log('   live plain nodes holding a template literal with a blank line or trailing space before a line break: '+([...new Set(hz)].join(', ')||'none'));}
// G6
{const mk=[],intro=[];for(const n of changed){const c=js(n);if(n.name==='Shared Library'||isStub(c))continue;if(/["'`][^"'`\n]*cacheall/.test(c))mk.push(n.name);if(/\.toString\(\s*\)/.test(c)&&/(=>|function)[^;]{0,200}\.toString\(\s*\)|\b[A-Za-z_$][\w$]*\.toString\(\s*\)/.test(c)){const hits=(c.match(/[\w$\]\)]+\.toString\(\s*\)/g)||[]);intro.push(n.name+': '+[...new Set(hits)].slice(0,6).join(' '));}if(/jsCode|\.params\b/.test(c))intro.push(n.name+': reads jsCode/params');}
 ok(!mk.length,'G6 no changed node holds "cacheall" inside a string'+(mk.length?': '+mk.join(', '):''));console.log('   toString() calls and code-text reads in changed plain nodes (read by hand below):');intro.forEach(x=>console.log('     '+x));if(!intro.length)console.log('     none');}
// G7
{const tot=w=>w.nodes.reduce((a,n)=>a+(js(n)||'').length,0);console.log('G7 size measured: all Code text '+tot(L)+' -> '+tot(C)+' = '+(tot(C)-tot(L)));}
// G8 behaviour: Close Enforcer Build and Record, live against stripped
{const IN='/mnt/project-files/wall2024/inputs/';const J=x=>({json:x});const cl=x=>JSON.parse(JSON.stringify(x));const code=(Wf,n)=>js(Wf.nodes.find(z=>z.name===n));
 const saved=(run,n)=>{const f=IN+run+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[d.length-1]:d;const m=(r&&r.data&&r.data.main)||(r&&r.main);return (m&&m[0])||[];};
 const run=(Wf,RUN,node,over,inputNode)=>{const get=n=>over&&n in over?over[n]:saved(RUN,n);const mk=n=>{const it=get(n);const params={get jsCode(){return code(Wf,n);}};if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+n);};return {isExecuted:false,first:no,last:no,all:no,params};}return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params};};
  const inp=(inputNode&&get(inputNode))||[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp)};return new Function('$','$input','$json',code(Wf,node))(mk,$input,inp[0]&&inp[0].json);};
 const runs=fs.readdirSync(IN).filter(f=>f.endsWith('_Final_Output.json')).map(f=>f.split('_')[0]).sort();const BO=(r,F)=>({'Final Output':[J(F)],'Resolve Seats':[J({deepseek:{api_model:'deepseek-flash'}})],'Init Seats':[J({run_token:r})],'Regrade Load':null});
 const rep=t=>J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]});let nb=0,eb=0;const B={};
 for(const r of runs){const it=saved(r,'Final Output');const F=it&&it[it.length-1]&&it[it.length-1].json;if(!F)continue;let a,b;try{a=run(L,r,'Close Enforcer Build',BO(r,F));}catch(e){continue;}b=run(C,r,'Close Enforcer Build',BO(r,F));nb++;if(JSON.stringify(a)===JSON.stringify(b))eb++;B[r]={F,B:a};}
 ok(nb>0&&nb===eb,'G8 Close Enforcer Build, live against stripped: '+eb+' of '+nb+' stored debates byte-equal');
 let nr=0,er=0;const dirs=['/mnt/project-files/wall2024/staged_w4/setC_replies_s106/','/mnt/project-files/wall2024/staged_w4/rac_replay_s107/'];
 for(const D of dirs)for(const f of fs.readdirSync(D).filter(x=>/^\d+_(css|rac)_[A-Z]+_send\d/.test(x))){const m=f.match(/^(\d+)_\w+?_([A-Z]+)_send/);const r=m[1],sd=m[2];if(!B[r])continue;const t=JSON.parse(fs.readFileSync(D+f,'utf8')).content;const o={'Final Output':[J(B[r].F)],'Regrade Load':null,'Close Enforcer Build':B[r].B,'Close Enforcer Call deepseek':B[r].B.map(b=>rep(b.json.side===sd?t:'CLOSE-CONTRADICTION: NONE'))};
  const a=run(L,r,'Close Enforcer Record',o,'Close Enforcer Call deepseek'),b=run(C,r,'Close Enforcer Record',o,'Close Enforcer Call deepseek');nr++;if(JSON.stringify(a)===JSON.stringify(b))er++;}
 ok(nr>0&&nr===er,'G8 Close Enforcer Record on the stored set C and replay replies, live against stripped: '+er+' of '+nr+' byte-equal');
 const noRun=plain.filter(n=>!fs.readdirSync(IN).some(f=>f.endsWith('_'+n.name.replace(/ /g,'_')+'.json')));console.log('   changed plain nodes with no saved output file in the inputs folder: '+noRun.length);}
console.log(fails?'FAILURES: '+fails:'ALL AS LABELED (notes above are read by hand)');
