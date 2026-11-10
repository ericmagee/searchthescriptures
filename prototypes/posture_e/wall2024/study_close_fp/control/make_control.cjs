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
// W2 control bodies for the closing-enforcer false-contradiction study (ASK 17). OFFLINE, NOT SENT; only W4 sends, after the operator's answer.
// Built with pkgRAC's Close Enforcer Build (write file parent_s107_RAC.json, the live prompt sentence) on the stored rounds; format {body}.
const getF=r=>{const it=saved(r,'Final Output');return it&&it[it.length-1]&&it[it.length-1].json;};
const BO=(r,F)=>({'Final Output':[J(F)],'Resolve Seats':[J({deepseek:{api_model:'deepseek-flash'}})],'Init Seats':[J({run_token:r})],'Regrade Load':null});
const want=[['33218','DEFENDER'],['33299','DEFENDER'],['33345','DEFENDER'],['33530','CHALLENGER'],['33644','DEFENDER'],['33371','DEFENDER'],['33798','DEFENDER'],['33846','DEFENDER']];
const D='study_close_fp/control/';let md='';
for(const [r,sd] of want){const F=getF(r);const out=run(CAND,r,'Close Enforcer Build',BO(r,F)).map(x=>x.json).find(x=>x.side===sd);
 fs.writeFileSync(D+r+'_ctl_'+sd+'.json',JSON.stringify({body:out.body}));const L=out.body.messages.map(m=>m.content).join('\n').length;
 md+='\n## '+r+' '+sd+' ('+L+' characters)\n'+out.cands.map(c=>'- '+c.id+' '+c.earlier_round+' "'+c.earlier_q.slice(0,90)+'" / '+c.closing_round+' "'+c.closing_q.slice(0,90)+'"').join('\n')+'\n';}
fs.writeFileSync(D+'list.md','# Control bodies and the candidates each carries\n'+md);console.log(md);
