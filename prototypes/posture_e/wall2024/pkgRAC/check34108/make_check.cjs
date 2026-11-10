process.chdir(__dirname+'/../..');const fs=require('fs');const IN='/mnt/project-files/wall2024/inputs/';
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const LIVE=g('/mnt/project-files/wall2024/fetchback_live_s107.json'),CAND=g('pkgRAC/parent_s107_RAC.json');
const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;const J=x=>({json:x});const cl=x=>JSON.parse(JSON.stringify(x));
const cache={};const saved=(run,n)=>{const k=run+'|'+n;if(k in cache)return cache[k];const f=IN+run+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return cache[k]=null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[d.length-1]:d;const m=(r&&r.data&&r.data.main)||(r&&r.main);return cache[k]=(m&&m[0])||[];};
// run one node's code on a stored debate; over = node name -> items (or null for "not executed"); W gives params.jsCode of any node
const run=(W,RUN,node,over,inputNode)=>{const get=n=>over&&n in over?over[n]:saved(RUN,n);
 const mk=n=>{const it=get(n);const params={get jsCode(){return code(W,n);}};if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+n);};return {isExecuted:false,first:no,last:no,all:no,params};}
  return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params};};
 const inp=(inputNode&&get(inputNode))||[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp)};
 const RD=Date,FIX=new RD('2026-11-07T03:10:18.511Z').getTime();class FD extends RD{constructor(...a){a.length?super(...a):super(FIX);}static now(){return FIX;}}global.Date=FD;
 try{return new Function('$','$input','$json','$execution','$workflow',(/await/.test(code(W,node))?"return (async()=>{\n"+code(W,node)+"\n})();":code(W,node)))(mk,$input,inp[0]&&inp[0].json,{id:RUN,customData:{set:()=>{},get:()=>undefined}},{id:'w'});}finally{global.Date=RD;}};
// pkgRAC check on 34108 (W3). OFFLINE, NOT SENT. node pkgRAC/check34108/make_check.cjs
const getF=r=>{const it=saved(r,'Final Output');return it&&it[it.length-1]&&it[it.length-1].json;};
const BO=(r,F)=>({'Final Output':[J(F)],'Resolve Seats':[J({deepseek:{api_model:'deepseek-flash'}})],'Init Seats':[J({run_token:r})],'Regrade Load':null});
const r='34108',F=getF(r);const X=run(LIVE,r,'Close Enforcer Build',BO(r,F)).map(x=>x.json).find(x=>x.side==='DEFENDER'),Y=run(CAND,r,'Close Enforcer Build',BO(r,F)).map(x=>x.json).find(x=>x.side==='DEFENDER');
fs.writeFileSync('pkgRAC/check34108/34108_X_live_DEFENDER.json',JSON.stringify({body:X.body}));fs.writeFileSync('pkgRAC/check34108/34108_Y_rac_DEFENDER.json',JSON.stringify({body:Y.body}));
const ux=X.body.messages[1].content,uy=Y.body.messages[1].content;console.log('X '+ux.length+' Y '+uy.length+' system equal '+(X.body.messages[0].content===Y.body.messages[0].content)+' model/params equal '+(JSON.stringify({...X.body,messages:0})===JSON.stringify({...Y.body,messages:0})));
// the only difference must be the candidate block
let i=0;while(ux[i]===uy[i])i++;let a=ux.length-1,b=uy.length-1;while(ux[a]===uy[b]){a--;b--;}console.log('X only: ['+ux.slice(i,a+1)+']');console.log('Y only: ['+uy.slice(i,b+1)+']');
console.log('Y equals the replay body already sent: '+(JSON.stringify({body:Y.body})===fs.readFileSync('/mnt/project-files/w3/pkgRAC_replay/34108_rac_DEFENDER.json','utf8')));
const A='/mnt/project-files/wall2024/staged_w4/stage_CSS/replay/';try{const f=fs.readdirSync(A).find(x=>/34108.*DEFENDER/.test(x));const s=JSON.parse(fs.readFileSync(A+f,'utf8'));console.log('X equals the set A body ('+f+'): '+(JSON.stringify(s.body.messages)===JSON.stringify(X.body.messages)));}catch(e){console.log('set A body not compared: '+e.message);}
