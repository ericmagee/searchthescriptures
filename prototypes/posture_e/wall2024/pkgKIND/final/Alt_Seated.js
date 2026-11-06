// Item C (W2; WALL-2024 2266 design, 2268 rulings): the seated alternates, shaped as the panel's nodes are read, so the cloned ruling 428
// chain (Alt Judge Enforcer, Alt Send Back, Alt Gate) reads them by the names it substitutes: Panel Cure Check, Panel Build, Enforcer Record,
// Regrade Load and Final Output all read this node. bodies: the seated alternates' bodies from Alternate Merge Seat; judges: their requests
// from Alternate Build (seat, fam, api_model, body). f: the debate rounds with the synthesis left empty, so the clone raises no E-SYN item
// (the synthesis was read once, with the panel). With no alternate seated, bodies and judges are empty and the chain passes nothing on.
const AM=$('Alternate Merge Seat').first().json;
const seated=(AM.alternates_seated||[]);const alt=new Set(seated.map(x=>x.alternate_seat));
const bodies=(AM.bodies||[]).filter(s=>{try{return alt.has(JSON.parse(s).payload.judge_seat);}catch(e){return false;}});
let AB=[];try{if($('Alternate Build').isExecuted)AB=$('Alternate Build').all().map(x=>x.json&&x.json.alt).filter(a=>a&&a.body&&alt.has(a.seat));}catch(e){AB=[];}
const judges=AB.map(a=>({seat:a.seat,fam:'openrouter',api_model:a.api_model,body:a.body}));
let f=null;try{f=$('Regrade Load').isExecuted?$('Regrade Load').first().json.f:$('Final Output').first().json;}catch(e){f=null;}
const F=f?{cr1:f.cr1,cr2:f.cr2,cr3:f.cr3,cr4:f.cr4,gr1:f.gr1,gr2:f.gr2,dr3:f.dr3,dr4:f.dr4,synthesis:''}:{synthesis:''};
let rt=null;try{rt=$('Init Seats').first().json.run_token;}catch(e){rt=null;}
return [{json:{bodies,judges,alt_seats:seated.map(x=>({seat:x.alternate_seat,removed_seat:x.removed_seat,api_model:x.alternate_api_model})),run_token:rt,f:F,enf421_rows:[],enf428_rows:[],alt_needed:false}}];
