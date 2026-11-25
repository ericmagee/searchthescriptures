// ASK 641 build (W4): the Panel Tokens body moves unchanged into one Shared Library entry; Panel Tokens and a new Salvage Tokens are its stubs;
// Salvage Write Tokens? and Salvage Write Tokens send the call list to rpc/record_debate_row_tokens on the salvage path. node b641.cjs base.json out.json
const fs=require('fs');const crypto=require('crypto');const [,,BE,OUT]=process.argv;const E=JSON.parse(fs.readFileSync(BE,'utf8'));
const byName=k=>{const n=E.nodes.find(x=>x.name===k);if(!n)throw new Error('no node '+k);return n;};
['Salvage Tokens','Salvage Write Tokens?','Salvage Write Tokens'].forEach(k=>{if(E.nodes.some(x=>x.name===k))throw new Error(k+' already exists');});
const PT=byName('Panel Tokens');const S0=PT.parameters.jsCode;
// 1. library entry
const SL=byName('Shared Library');const T=SL.parameters.jsCode;
const head=T.slice(0,T.indexOf('\n/*LIB*/')),tail=T.slice(T.lastIndexOf('\n/*END*/')+8);
const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));
if(M['Panel Tokens'])throw new Error('the library already holds Panel Tokens');
const lines=S0.split('\n');const a=L.length;lines.forEach(l=>L.push(l));const b=L.length-1;M['Panel Tokens']={n:S0.length,p:[a===b?a:[a,b]]};
const reb=p=>p.map(x=>typeof x==='number'?L[x]:typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n')).join('\n');
if(reb(M['Panel Tokens'].p)!==S0)throw new Error('the entry does not rebuild the Panel Tokens body');
SL.parameters.jsCode=head+'\n/*LIB*/'+JSON.stringify(L)+'\n/*MAP*/'+JSON.stringify(M)+'\n/*END*/'+tail;
// 2. the stub (one text, used by both nodes); its if(false) header names every node the body reads with a literal $('...') (W1 N1)
const names=[...new Set([...S0.matchAll(/\$\((['"])([^'"]+)\1\)/g)].map(m=>m[2]))];
const STUB='if(false){'+names.map(x=>'$('+JSON.stringify(x)+');').join('')+'$(String());}\n'
+"/* ASK 641: the Panel Tokens body is one Shared Library entry; Panel Tokens (after the panel) and Salvage Tokens (after Salvage Save) both run it */\n"
+"const __LT=$('Shared Library').params.jsCode;const __L=JSON.parse(__LT.slice(__LT.indexOf('\\n/*LIB*/')+8,__LT.lastIndexOf('\\n/*MAP*/')));const __M=JSON.parse(__LT.slice(__LT.lastIndexOf('\\n/*MAP*/')+8,__LT.lastIndexOf('\\n/*END*/')))[\"Panel Tokens\"];if(!__M)throw new Error('pkgLIB: the Shared Library holds no entry for Panel Tokens');\n"
+"const __N=__M.n,__P=__M.p;\n"
+"const __S=__P.map(e=>typeof e==='number'?__L[e]:typeof e[0]==='string'?e[0]:__L.slice(e[0],e[1]+1).join('\\n')).join('\\n');\n"
+"if(__S.length!==__N)throw new Error('pkgLIB: rebuilt source is '+__S.length+' bytes, expected '+__N+' (Shared Library does not match this stub)');\n"
+"return await new Function('$','$input','return (async()=>{\\n'+__S+'\\n})();')($,$input);";
PT.parameters.jsCode=STUB;
const uid=s=>{const h=crypto.createHash('md5').update('ASK641:'+s).digest('hex');return h.slice(0,8)+'-'+h.slice(8,12)+'-4'+h.slice(13,16)+'-a'+h.slice(17,20)+'-'+h.slice(20,32);};
const SS=byName('Salvage Save');const [x0,y0]=SS.position;
E.nodes.push({id:uid('st'),name:'Salvage Tokens',type:PT.type,typeVersion:PT.typeVersion,position:[x0,y0-220],onError:'continueRegularOutput',notes:'ASK 641: the Panel Tokens collector, run on the salvage path; a fault here never stops the salvage',parameters:{...PT.parameters,jsCode:STUB}});
const WQ=byName('Write Tokens?');const q=JSON.parse(JSON.stringify(WQ.parameters));q.conditions.conditions=[{id:'salvage-write-tokens-go',leftValue:"={{ $('Init Seats').first().json.regrade !== true && $('Init Seats').first().json.dry !== true }}",operator:{operation:'true',singleValue:true,type:'boolean'},rightValue:''}];
E.nodes.push({id:uid('sq'),name:'Salvage Write Tokens?',type:WQ.type,typeVersion:WQ.typeVersion,position:[x0+110,y0-220],notes:'ASK 641: not a regrade, not a dry run',parameters:q});
const WT=byName('Write Tokens');const w=JSON.parse(JSON.stringify(WT));w.id=uid('sw');w.name='Salvage Write Tokens';w.position=[x0+220,y0-260];w.notes='ASK 641: call costs of a run stopped before the panel; token totals null (the RPC leaves them unset)';
w.parameters.jsonBody="={{ { p_run_token: $('Failure Salvage').first().json.run_token, p_input: null, p_output: null, p_cache_write: null, p_cache_read: null, p_calls: ($('Salvage Tokens').first().json.calls || null) } }}";
E.nodes.push(w);
// 3. wiring
const C=E.connections;const to=(n,i=0)=>({node:n,type:'main',index:i});
if(JSON.stringify(C['Salvage Save'])!==JSON.stringify({main:[[to('Save Incomplete to Drive')]]}))throw new Error('Salvage Save wiring is not the base');
C['Salvage Save']={main:[[to('Salvage Tokens')]]};C['Salvage Tokens']={main:[[to('Salvage Write Tokens?')]]};
C['Salvage Write Tokens?']={main:[[to('Salvage Write Tokens')],[to('Save Incomplete to Drive')]]};C['Salvage Write Tokens']={main:[[to('Save Incomplete to Drive')]]};
fs.writeFileSync(OUT,JSON.stringify(E));console.log('ASK 641 built: LIB',a,'to',b,'(',lines.length,'lines ) entry n',S0.length,'| stub',STUB.length,'| header names',names.length);
