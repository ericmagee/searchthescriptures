// judge_fix7 J6: Init Seats and Resolve Seats run as n8n runs them (new/), on the operator's body, with the ACTIVE model_config rows read on
// 2026-11-02 (data/model_config.json; Fetch Models reads active=eq.true). Prints the seats, the panel, the alternates and the direct model id.
const R=require('./runner.cjs');const MC=require('../data/model_config.json').filter(x=>x.active);
for(const v of ['base','new']){
 const body={topic:'Did Christ have a biological father?',defender:{engine:'claude',profile:'plain'},challenger:{engine:'opus',profile:'oracle'}};
 let S;try{S=R.runNode(v,'Init Seats',{},{body})[0].json;}catch(e){console.log(v+': Init Seats refused: '+e.message.replace(/run_token=\S+/,'run_token=...'));continue;}
 const RS=R.runNode(v==='new'?'data/live_code':'data/live_code','Resolve Seats',{'Init Seats':S,'Fetch Models':MC,'Fetch Drift Guards':[],'Fetch Tensions':[]})[0].json;
 console.log('== '+v+' (Init Seats '+v+'; Resolve Seats is unchanged, live code)');
 console.log('defender:',JSON.stringify(RS.defender));console.log('challenger:',JSON.stringify(RS.challenger));
 console.log('panel_order:',S.panel_order.join(', '),'| panel_expected:',S.panel_expected.join(', '),'| reserve:',S.panel_reserve,'| single judge:',S.single_judge);
 console.log('judges:',RS.judges.map(j=>j.seat+'='+j.api_model).join('; '));console.log('reserve:',RS.reserve?RS.reserve.seat+'='+RS.reserve.api_model:'none');
 console.log('alt_order:',S.alt_order.join(', ')||'none','| alternates:',RS.alternates.map(a=>a.seat+'='+a.api_model+' ('+a.family+')').join('; ')||'none');
 console.log('debaters:',JSON.stringify(RS.debaters));
 console.log('direct model id (challenger):',RS.challenger.direct_model,'| family',RS.challenger.fam,'| via',RS.challenger.via_engine_fam,'| max_tokens',RS.challenger.tok);
 // the C1 Build's own check of the id, as the call is built
 const s=require('fs').readFileSync(__dirname+'/../new/C1 Build.js','utf8');const m=s.slice(s.indexOf('const __AID='),s.indexOf('const __AIDV='));const f=new Function(m+';return {__AID,__AOK};')();
 console.log('C1 Build maps',RS.challenger.model,'->',f.__AID(RS.challenger.model),'| known form:',f.__AOK(f.__AID(RS.challenger.model)));}
