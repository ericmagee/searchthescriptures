const fs=require('fs');let t=fs.readFileSync('row.txt','utf8');try{t=JSON.parse(t).result}catch(e){}
const X=JSON.parse(t.slice(t.indexOf('[{'),t.lastIndexOf('}]')+2))[0].x;const row=X.row,J=X.judg||[];
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/parent_s158_SJO.json'));const code=W.nodes.find(n=>n.name==='Format Markdown').parameters.jsCode;
const run=r=>{const M={'Get Row':[r],'Get Judgments':J,'Get Verse':[{text:'verse'}],'Get Guards':[],'Init Seats':[{run_token:r.run_token,single_judge:'chatgpt',panel_expected:['chatgpt','luna','sol']}]};
 const $=n=>M[n]?{isExecuted:true,first:()=>({json:M[n][0]}),all:()=>M[n].map(json=>({json}))}:{isExecuted:false,first:()=>{throw new Error('not executed: '+n)},all:()=>{throw new Error('not executed: '+n)}};
 try{return new Function('$','$input',code)($,{all:()=>[],first:()=>({json:{}})});}catch(e){return 'THROWS '+e.message;}};
const off={...row,independent_verdict_raw:null,judge_model:null,challenger_chain_mark:null,defender_chain_mark:null,out_of_round_concessions:null,out_of_round_detail:null,data_class:'contested'};
const a=run(row),b=run(off);const md=x=>typeof x==='string'?x:(x&&x[0]&&x[0].json&&(x[0].json.markdown||x[0].json.md||JSON.stringify(x[0].json)))||JSON.stringify(x);
const A=md(a),B=md(b);console.log('old',A.slice(0,120).replace(/\n/g,' '),'len',A.length);console.log('new',B.slice(0,120).replace(/\n/g,' '),'len',B.length);
const la=A.split('\n'),lb=B.split('\n');const sa=new Set(la),sb=new Set(lb);console.log('lines only in old:');la.filter(l=>!sb.has(l)).slice(0,15).forEach(l=>console.log('  -',l.slice(0,220)));console.log('lines only in new:');lb.filter(l=>!sa.has(l)).slice(0,15).forEach(l=>console.log('  +',l.slice(0,220)));
