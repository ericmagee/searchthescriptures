process.chdir(__dirname+'/../..');const fs=require('fs');const IN='/mnt/project-files/wall2024/inputs/';
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const LIVE=g('/mnt/project-files/wall2024/fetchback_live_s108.json'),CAND=g('pkgRAC/parent_s108_RAC.json');
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
// Do the Oracle's named candidates (ids X, J) go with fewer NEW lines? Stored replies only; no call. Replies whose body handed no A or R pair are read through the LIVE Record.
const S='/mnt/project-files/wall2024/staged_w4/';const sets=[[S+'setC_replies_s106/',/^(\d+)_css_([A-Z]+)_/,false],[S+'check34108_s108/',/^(\d+)_X_live_([A-Z]+)_/,false],[S+'rac_replay_s107/',/^(\d+)_rac_([A-Z]+)_/,true],[S+'ctl_replay_s108/',/^(\d+)_ctl_([A-Z]+)_/,true],[S+'check34108_s108/',/^(\d+)_Y_rac_([A-Z]+)_/,true]];
const rowsOut=[];
for(const [D,re,handed] of sets)for(const f of fs.readdirSync(D).filter(x=>/\.json$/.test(x)).sort()){const m=f.match(re);if(!m)continue;const r=m[1],sd=m[2];let t;try{t=JSON.parse(fs.readFileSync(D+f,'utf8')).content;}catch(e){continue;}if(typeof t!=='string')continue;const F=getF(r);const W=handed?CAND:LIVE;
 const B=run(W,r,'Close Enforcer Build',BO(r,F));const b=B.find(b=>b.json.side===sd);if(!b)continue;const oc=(b.json.cands||[]).filter(c=>/^[XJ]\d/.test(c.id)).length,hp=(b.json.cands||[]).filter(c=>/^[AR]\d/.test(c.id)).length;
 const R=run(W,r,'Close Enforcer Record',{'Final Output':[J(F)],'Regrade Load':null,'Close Enforcer Build':B,'Close Enforcer Call deepseek':B.map(x=>rep(x.json.side===sd?t:'CLOSE-CONTRADICTION: NONE'))},'Close Enforcer Call deepseek')[0].json;
 const raw=t.split('\n').filter(l=>/CLOSE-CONTRADICTION:\s*NEW/.test(l)).length;const nw=R.cec.rows.filter(x=>/^NEW/.test(String(x.id))&&x.status==='CONFIRMED'||/^NEW/.test(String(x.id))&&/^CONFIRMED/.test(String(x.status))).length;
 rowsOut.push({f,r,sd,handed:hp,oracle:oc,rawNew:raw,newConf:nw});console.log(f.padEnd(44)+' handed pairs '+hp+' | Oracle candidates '+oc+' | NEW lines in reply '+raw+' | NEW recorded CONFIRMED '+nw);}
const grp=(lab,fn)=>{const g=rowsOut.filter(fn);const n=g.length,s=g.reduce((a,x)=>a+x.rawNew,0),z=g.filter(x=>x.rawNew===0).length;console.log(lab+': replies '+n+', NEW lines '+s+' (mean '+(n?(s/n).toFixed(2):'-')+'), replies with no NEW line '+z);};
grp('no handed pair, no Oracle candidate',x=>!x.handed&&!x.oracle);grp('no handed pair, Oracle candidates',x=>!x.handed&&x.oracle);grp('handed pair, no Oracle candidate',x=>x.handed&&!x.oracle);grp('handed pair and Oracle candidates',x=>x.handed&&x.oracle);
