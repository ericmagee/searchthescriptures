process.chdir(__dirname+'/..');const fs=require('fs');const IN='/mnt/project-files/wall2024/inputs/';
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const LIVE=g('/mnt/project-files/wall2024/fetchback_live_s108.json'),CAND=g('pkgRLF/rev2/parent_s108_RLF2.json');
const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;const J=x=>({json:x});const cl=x=>JSON.parse(JSON.stringify(x));
const cache={};const saved=(run,n)=>{const k=run+'|'+n;if(k in cache)return cache[k];const f=IN+run+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return cache[k]=null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[d.length-1]:d;const m=(r&&r.data&&r.data.main)||(r&&r.main);return cache[k]=(m&&m[0])||[];};
// run one node's code on a stored debate; over = node name -> items (or null for "not executed"); W gives params.jsCode of any node
const run=(W,RUN,node,over,inputNode)=>{const get=n=>over&&n in over?over[n]:saved(RUN,n);
 const mk=n=>{const it=get(n);const params={get jsCode(){return code(W,n);}};if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+n);};return {isExecuted:false,first:no,last:no,all:no,params};}
  return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params};};
 const inp=(inputNode&&get(inputNode))||[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp)};
 const RD=Date,FIX=new RD('2026-11-07T03:10:18.511Z').getTime();class FD extends RD{constructor(...a){a.length?super(...a):super(FIX);}static now(){return FIX;}}global.Date=FD;
 try{return new Function('$','$input','$json','$execution','$workflow',(/await/.test(code(W,node))?"return (async()=>{\n"+code(W,node)+"\n})();":code(W,node)))(mk,$input,inp[0]&&inp[0].json,{id:RUN,customData:{set:()=>{},get:()=>undefined}},{id:'w'});}finally{global.Date=RD;}};
const getF=r=>{const it=saved(r,'Final Output');return it&&it[it.length-1]&&it[it.length-1].json;};
const BO=(r,F)=>({'Final Output':[J(F)],'Resolve Seats':[J({deepseek:{api_model:'deepseek-flash'}})],'Init Seats':[J({run_token:r})],'Regrade Load':null});
const rep=t=>J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]});
// W3 grade of pkgRLF rev 2 (bare round labels). Labels: pkgRLF2_w3/labels_RLF2_w3.md. LIVE = s108, CAND = pkgRLF/rev2/parent_s108_RLF2.json.
let fails=0;const ok=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);if(!c)fails++;};const S='/mnt/project-files/wall2024/staged_w4/';
const rec=(W,r,sd,t)=>{const F=getF(r);const B=run(LIVE,r,'Close Enforcer Build',BO(r,F));return run(W,r,'Close Enforcer Record',{'Final Output':[J(F)],'Regrade Load':null,'Close Enforcer Build':B,'Close Enforcer Call deepseek':B.map(b=>rep(b.json.side===sd?t:'CLOSE-CONTRADICTION: NONE'))},'Close Enforcer Call deepseek');};
const sum=o=>{const c=o[0].json.cec;return 'confirmed '+JSON.stringify(c.confirmed.map(x=>x.id+' L'+x.link))+' rows '+c.rows.map(x=>x.answer+'/'+x.status+' E['+x.earlier_round+'] C['+x.closing_round+']').join('; ')+' none='+c.none;};
// L1
{const d=CAND.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(LIVE.nodes.find(x=>x.name===n.name))).map(n=>n.name);const a=code(LIVE,'Close Enforcer Record').length,b=code(CAND,'Close Enforcer Record').length;
 ok(d.length===1&&d[0]==='Close Enforcer Record'&&JSON.stringify(LIVE.connections)===JSON.stringify(CAND.connections),'L1 only Close Enforcer Record differs; connections equal; size measured '+a+' -> '+b+' (+'+(b-a)+')');
 const strs=c=>{const o=[];require('../pkgLIB/vendor/acorn.cjs').parse('async function W(){\n'+c+'\n}',{ecmaVersion:2025,sourceType:'module',onToken:t=>{if(t.type.label==='string'||t.type.label==='template')o.push(t.value);}});return o;};
 const A=strs(code(LIVE,'Close Enforcer Record')),Bs=strs(code(CAND,'Close Enforcer Record'));const df=A.map((x,i)=>x===Bs[i]?null:[x,Bs[i]]).filter(Boolean);ok(A.length===Bs.length&&df.length===1&&df[0][0]==='ROUND'&&df[0][1]==='','L1 strings and template texts: '+A.length+', differing '+df.length+': the code string \'ROUND\' of startsWith() became the empty replacement of replace(/^ROUND/,\'\'); no prompt or log text changes (the two label patterns are regular expressions, compared in the code text by hand)');df.forEach(([x,y])=>console.log('   live: '+String(x).slice(0,200)+'\n   fix:  '+String(y).slice(0,200)));}
// L2
const X=[1,2].map(k=>JSON.parse(fs.readFileSync(S+'check34108_s108/34108_X_live_DEFENDER_s'+k+'_reply.json','utf8')).content);const allRows=[];
X.forEach((t,k)=>{const a=rec(LIVE,'34108','DEFENDER',t),b=rec(CAND,'34108','DEFENDER',t);ok(a[0].json.cec.confirmed.length===0&&b[0].json.cec.confirmed.length===1&&b[0].json.cec.confirmed[0].link==6,'L2 real reply X send '+(k+1)+': live '+sum(a)+' | fix '+sum(b));if(b[0].json.log_rows||b[0].json.rows)allRows.push(...(b[0].json.log_rows||b[0].json.rows));if(k===0)console.log('   output keys: '+Object.keys(b[0].json).join(','));});
// L3 every other stored per-side reply: live and fix give the same output
{let n=0,bad=[];const sets=[['setC_replies_s106/',/^(\d+)_css_([A-Z]+)_/],['rac_replay_s107/',/^(\d+)_rac_([A-Z]+)_/],['ctl_replay_s108/',/^(\d+)_ctl_([A-Z]+)_/],['check34108_s108/',/^(\d+)_Y_rac_([A-Z]+)_/],['stage_CSS/replies_css_s105/',/^(\d+)_css_([A-Z]+)_/]];
 for(const [D,re] of sets)for(const f of fs.readdirSync(S+D).filter(x=>/\.json$/.test(x)).sort()){const m=f.match(re);if(!m)continue;let t;try{t=JSON.parse(fs.readFileSync(S+D+f,'utf8')).content;}catch(e){continue;}if(typeof t!=='string')continue;n++;const a=JSON.stringify(rec(LIVE,m[1],m[2],t)),b=JSON.stringify(rec(CAND,m[1],m[2],t));if(a!==b)bad.push(D+f);}
 ok(!bad.length&&n>30,'L3 '+n+' other stored replies: Record output through the fix equal to live field for field'+(bad.length?' DIFFER: '+bad.join(', '):''));}
// plants on 34108 defender; T is the true line of X send 1
const T=X[0];const P=(nm,t,want,r='34108',sd='DEFENDER')=>{let a,b,e='';try{a=rec(LIVE,r,sd,t);b=rec(CAND,r,sd,t);}catch(x){e=String(x.message);}if(e){ok(false,nm+' THROWS '+e);return;}const c=b[0].json.cec;const got=c.confirmed.length?'CONFIRMED':(c.rows.length?'NOT CONFIRMED':'NO ROW');const same=JSON.stringify(a)===JSON.stringify(b);ok(want==='SAME'?same:got===want,nm+' -> '+got+(same?' (equal to live)':'')+' | '+sum(b).slice(0,230));};
P('L5a EARLIER [4] (not rounds 1 to 3)',T.replace('EARLIER [3]','EARLIER [4]'),'NOT CONFIRMED');
P('L5b CLOSING [3]',T.replace('CLOSING [4]','CLOSING [3]'),'NOT CONFIRMED');
for(const z of ['[0]','[5]','[34]','[]'])P('L5c CLOSING '+z,T.replace('CLOSING [4]','CLOSING '+z),'NOT CONFIRMED');
P('L5d EARLIER [0]',T.replace('EARLIER [3]','EARLIER [0]'),'NOT CONFIRMED');
P('L6a good labels, "[3]" planted inside the earlier quotation',T.replace('EARLIER [3] "I drop','EARLIER [CR3] "[3] I drop').replace('CLOSING [4]','CLOSING [CR4]'),'SAME');
P('L6b good labels, why-sentence holds "[4]"',T.replace('EARLIER [3]','EARLIER [CR3]').replace('CLOSING [4]','CLOSING [CR4]').replace(/\.$/,' [4].'),'SAME');
P('L6c bare labels, why-sentence holds "CLOSING [5]"',T.replace(/\.$/,' as in CLOSING [5].'),'CONFIRMED');
P('L7a [3] with [CR4]',T.replace('CLOSING [4]','CLOSING [CR4]'),'CONFIRMED');P('L7b [round 3] with [4]',T.replace('EARLIER [3]','EARLIER [round 3]'),'CONFIRMED');P('L7c unbracketed 3 and 4',T.replace('EARLIER [3]','EARLIER 3').replace('CLOSING [4]','CLOSING 4'),'CONFIRMED');
P('L8a EARLIER [Luke 1:35]',T.replace('EARLIER [3]','EARLIER [Luke 1:35]'),'NOT CONFIRMED');P('L8b EARLIER [1:35]',T.replace('EARLIER [3]','EARLIER [1:35]'),'NOT CONFIRMED');P('L8c EARLIER [3:16]',T.replace('EARLIER [3]','EARLIER [3:16]'),'NOT CONFIRMED');P('L8d EARLIER [D3]',T.replace('EARLIER [3]','EARLIER [D3]'),'NOT CONFIRMED');
P('L4a DEFENDER line with [DR3] and [4]',T.replace('EARLIER [3]','EARLIER [DR3]'),'NOT CONFIRMED');
// L4b a defender line whose quotations stand only in the challenger's rounds
{const F=getF('34108');const pick=(k,o)=>{const ss=String(F[k]).split(/(?<=[.!?])\s+/).map(x=>x.trim()).filter(x=>x.length>60&&x.length<160&&!/["“”*\[\]|]/.test(x)&&String(F[o]).indexOf(x)<0&&String(F.cr1+F.cr2+F.cr3+F.cr4).indexOf(x)<0);return ss[0];};const e=pick('dr3','cr3'),c=pick('dr4','cr4');
 P('L4b DEFENDER line, bare labels, quotations taken from the challenger\'s rounds 3 and 4','CLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK 6 -- CONFIRMED -- EARLIER [3] "'+e+'" -- CLOSING [4] "'+c+'" -- plant.','NOT CONFIRMED');
 P('L4c the same quotations on a CHALLENGER line with bare labels: read in the challenger\'s own rounds (quotation check passes; link check decides)','CLOSE-CONTRADICTION: NEW -- CHALLENGER -- LINK 6 -- CONFIRMED -- EARLIER [3] "'+e+'" -- CLOSING [4] "'+c+'" -- plant.','SAME'==='x'?'':'CONFIRMED','34108','CHALLENGER');}
// L4d a real challenger line (33222 pkgRAC replay send 1) with its labels rewritten bare: same result as with its own labels through live
{const t=JSON.parse(fs.readFileSync(S+'rac_replay_s107/33222_rac_CHALLENGER_send1.json','utf8')).content;const nl=t.split('\n').filter(l=>/CLOSE-CONTRADICTION:\s*NEW/.test(l))[0];console.log('   real challenger line: '+nl.slice(0,260));const bare=nl.replace(/EARLIER\s*\[[^\]]*?(\d)\]/,'EARLIER [$1]').replace(/CLOSING\s*\[[^\]]*?(\d)\]/,'CLOSING [$1]');
 const a=rec(LIVE,'33222','CHALLENGER',nl)[0].json.cec,b=rec(CAND,'33222','CHALLENGER',bare)[0].json.cec;ok(JSON.stringify(a.confirmed.map(x=>x.link))===JSON.stringify(b.confirmed.map(x=>x.link))&&a.confirmed.length===1,'L4d real challenger line, bare labels through the fix: confirmed '+JSON.stringify(b.confirmed.map(x=>'L'+x.link))+' as with its own labels through live '+JSON.stringify(a.confirmed.map(x=>'L'+x.link))+' | '+bare.slice(60,140));}
// L10 a reply of bare-label lines that all fail the quotation check
{const t=[1,2].map(k=>'CLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK '+k+' -- CONFIRMED -- EARLIER [3] "words that stand in no round at all number '+k+'" -- CLOSING [4] "nor do these words stand anywhere" -- plant.').join('\n');const c=rec(CAND,'34108','DEFENDER',t)[0].json.cec;ok(c.confirmed.length===0&&c.rows.length===2&&c.none!==true&&c.rows.every(x=>/NOT CONFIRMED/.test(x.status)),'L10 two bare-label lines failing the quotation check: rows '+c.rows.map(x=>x.status).join('; ')+' none='+c.none);}
fs.writeFileSync(__dirname+'/x_out_json.json',JSON.stringify(rec(CAND,'34108','DEFENDER',X[0])[0].json,null,1));
console.log(fails?'FAILURES: '+fails:'ALL AS LABELED');
