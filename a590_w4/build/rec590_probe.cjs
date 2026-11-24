// W4 probe: run the built Send Back Record source on one E-REVCLOSE item, with stub inputs (offline)
const lp=require('/mnt/project-files/ask588/w4/build/libpatch.js');const W=require(__dirname+'/target_engine_590s.json');
const S=lp.src(W,'Send Back Record');const LT=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
module.exports=async function(items,replyText,opts={}){
 const PB={bodies:[JSON.stringify({payload:{judge_seat:'sol62',verdict_raw:'VERDICT\\nDEFENDER LINK 2 STANDS: the law counts her as a wife.'}})],run_token:'ODV1-0-t'};
 const nodes={'Judge Enforcer Record':[PB],'Panel Cure Check':[{bodies:PB.bodies}],'Send Back Build':[{sb_skip:false,seat:'sol62',api_model:'x/j',run_token:'ODV1-0-t',items,msg:'m',body:{}}],'Shared Library':[{}]};
 const $=n=>{const it=nodes[n];const ex=it!==undefined;return {isExecuted:ex,params:{jsCode:LT},first:()=>({json:(it||[{}])[0]}),all:()=>(it||[]).map(json=>({json})),item:{json:(it||[{}])[0]}};};
 const R=opts.err?[{error:{message:'timeout'}}]:[{choices:[{message:{content:replyText}}]}];
 const $input={all:()=>R.map(json=>({json})),first:()=>({json:R[0]})};
 return await new Function('$','$input','return (async()=>{\n'+S+'\n})();')($,$input);};
