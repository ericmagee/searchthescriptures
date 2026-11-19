// ASK 426 DONE WHEN (c): the request body the TARGET builds for one stored E-ASSUME prompt and one stored E-ANS (D4) prompt equals the 8981 luna test body.
// RS from the target Resolve Seats run on model_config_jfl active rows (models_active.json; a gemini v deepseek debate, panel chatgpt sol sol62);
// the body statement cut from the target Assume Check Build and from the target library's Judge Enforcer Build, run with that RS.enforcer.
const fs=require('fs'),path=require('path');const T=require(path.join(__dirname,'../tools/lib.cjs'));
const W=JSON.parse(fs.readFileSync(process.argv[2]));const N={};W.nodes.forEach(n=>N[n.name]=n);const H=path.join(__dirname,'../a410/harness/');
const M=JSON.parse(fs.readFileSync(path.join(__dirname,'models_active.json')));
const S={run_token:'ODV1-0-t426',defender:{engine:'gemini',profile:'x',fam:'openrouter',mc_seat:'gemini'},challenger:{engine:'deepseek',profile:'x',fam:'deepseek',mc_seat:'deepseek_debate'},panel_order:['chatgpt','sol','sol62'],alt_order:[]};
const mk=a=>({first:()=>({json:a[0]}),all:()=>a.map(json=>({json})),isExecuted:true});
const $=n=>({'Init Seats':mk([S]),'Fetch Models':mk(M),'Fetch Drift Guards':mk([]),'Fetch Tensions':mk([])})[n];
const RS=new Function('$','$execution',N['Resolve Seats'].parameters.jsCode)($,{customData:{set(){}}})[0].json;
console.log('RS.enforcer',JSON.stringify(RS.enforcer),'| RS.deepseek',JSON.stringify(RS.deepseek));
const ds=RS&&RS.enforcer&&RS.enforcer.api_model?RS.enforcer:null;const RQ=[H+'requests_luna.json',path.join(__dirname,'../a410_w4/luna/requests_luna.json')].find(f=>fs.existsSync(f)); /* W1 9013 N1: the committed copy is a410_w4/luna */const R=JSON.parse(fs.readFileSync(RQ));
// E-ASSUME
const acb=N['Assume Check Build'].parameters.jsCode;const i=acb.indexOf('const body={model:ds.api_model');const st=acb.slice(i,acb.indexOf("{role:'user',content:user}]};",i)+29);
const ea=R.find(r=>r.set==='EA'&&r.rep===1);const b1=new Function('ds','user',st+'\nreturn body;')(ds,ea.body.messages[1].content);
const e1=JSON.stringify(b1)===JSON.stringify(ea.body);console.log('E-ASSUME',ea.key,'EQUAL',e1);if(!e1)console.log(JSON.stringify(b1).slice(0,300),'\n',JSON.stringify(ea.body).slice(0,300));
// E-ANS (D4): library Judge Enforcer Build
const U=T.unpack(W);const jeb=T.rb(U.L,U.M['Judge Enforcer Build']);const grab=nm=>{const k=jeb.indexOf('const '+nm+'=');const j=jeb.indexOf(';\n',k);return new Function(jeb.slice(k,j+1)+'\nreturn '+nm+';')();};
const SYS=grab('SYS'),JAGR=grab('__JAGR');const k=jeb.indexOf('body:{model:ds.api_model');const bt=jeb.slice(k+5,jeb.indexOf("{role:'user',content:",k))+"{role:'user',content:USER}]}"; /* the live user text is the stored prompt_sent; the part before it is cut as it stands */
const d4=R.find(r=>r.set==='D4'&&r.rep===1);const b2=new Function('ds','SYS','__JAGR','USER','return '+bt+';')(ds,SYS,JAGR,d4.body.messages[1].content);
const e2=JSON.stringify(b2)===JSON.stringify(d4.body);console.log('E-ANS (D4)',d4.key,'EQUAL',e2);if(!e2)console.log(JSON.stringify(b2).slice(0,300),'\n',JSON.stringify(d4.body).slice(0,300));
console.log('statements:',st.slice(0,90),'... |',bt.slice(0,90),'...');process.exit(e1&&e2?0:1);
