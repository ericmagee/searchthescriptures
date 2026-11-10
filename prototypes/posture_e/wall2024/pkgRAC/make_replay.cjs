process.chdir(__dirname+'/..');const fs=require('fs');const IN='/mnt/project-files/wall2024/inputs/';
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const LIVE=g('/mnt/project-files/wall2024/fetchback_live_s106.json'),CAND=g('pkgRAC/parent_s106_RAC.json');
const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;const J=x=>({json:x});const cl=x=>JSON.parse(JSON.stringify(x));
const cache={};const saved=(run,n)=>{const k=run+'|'+n;if(k in cache)return cache[k];const f=IN+run+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return cache[k]=null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[d.length-1]:d;const m=(r&&r.data&&r.data.main)||(r&&r.main);return cache[k]=(m&&m[0])||[];};
// run one node's code on a stored debate; over = node name -> items (or null for "not executed"); W gives params.jsCode of any node
const run=(W,RUN,node,over,inputNode)=>{const get=n=>over&&n in over?over[n]:saved(RUN,n);
 const mk=n=>{const it=get(n);const params={get jsCode(){return code(W,n);}};if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+n);};return {isExecuted:false,first:no,last:no,all:no,params};}
  return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params};};
 const inp=(inputNode&&get(inputNode))||[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp)};
 const RD=Date,FIX=new RD('2026-11-07T03:10:18.511Z').getTime();class FD extends RD{constructor(...a){a.length?super(...a):super(FIX);}static now(){return FIX;}}global.Date=FD;
 try{return new Function('$','$input','$json','$execution','$workflow',(/await/.test(code(W,node))?"return (async()=>{\n"+code(W,node)+"\n})();":code(W,node)))(mk,$input,inp[0]&&inp[0].json,{id:RUN,customData:{set:()=>{},get:()=>undefined}},{id:'w'});}finally{global.Date=RD;}};
// pkgRAC replay bodies (W3). OFFLINE, NOT SENT. node pkgRAC/make_replay.cjs
const getF=r=>{const it=saved(r,'Final Output');return it&&it[it.length-1]&&it[it.length-1].json;};
const BO=(r,F)=>({'Final Output':[J(F)],'Resolve Seats':[J({deepseek:{api_model:'deepseek-flash'}})],'Init Seats':[J({run_token:r})],'Regrade Load':null});
const want=[['34108','DEFENDER'],['33461','DEFENDER'],['33482','DEFENDER'],['33442','DEFENDER'],['33705','DEFENDER'],['33222','CHALLENGER']];
let md='';
for(const [r,sd] of want){const F=getF(r);const out=run(CAND,r,'Close Enforcer Build',BO(r,F)).map(x=>x.json);const it=out.find(x=>x.side===sd);if(!it){console.log(r+' '+sd+' NO ITEM');continue;}
 const f='pkgRAC/replay/'+r+'_rac_'+sd+'.json';fs.writeFileSync(f,JSON.stringify({body:it.body}));const u=it.body.messages[1].content;
 const cs=it.cands.filter(c=>/^[AR]/.test(c.id));const lines=u.split('\n').filter(l=>/^[AR]\d+ -- /.test(l));
 md+='\n## '+r+'_rac_'+sd+'.json ('+(it.body.messages[0].content.length+u.length)+' characters). not sent: '+JSON.stringify(it.not_sent)+'\n'+cs.map(c=>'- '+c.id+' ('+c.by+'): EARLIER ['+c.earlier_round+'] "'+c.earlier_q+'" / CLOSING ['+c.closing_round+'] "'+c.closing_q+'"').join('\n')+'\n- candidate lines in the prompt: '+lines.length+' of '+cs.length+'\n';}
fs.writeFileSync('pkgRAC/replay/list.md',md);console.log(md);
