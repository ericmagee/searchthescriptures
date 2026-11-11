// W2: the single judge's four terra calls on 35067 (Synthesis, Verdict, Cure, Diagnostic) and the panel cure calls: prefixes and parameters.
const {show,items}=require('./prefix.cjs');
const B={Synthesis:items('Build Synthesis')[0].requestBody,Verdict:items('Build Independent Verdict')[0].verdictBody,Cure:items('Cure Build')[0].cure.body,Diagnostic:items('Build Diagnostic Prompt')[0].requestBody};
for(const k in B){const b=B[k];console.log(k,'model',b.model,'| params',Object.keys(b).filter(x=>x!=='messages').join(','),'| response_format',b.response_format?b.response_format.type+(b.response_format.json_schema?' '+b.response_format.json_schema.name:''):'none','| messages',b.messages.map(m=>m.role[0]+':'+(typeof m.content==='string'?m.content.length:'arr')).join(' '));}
show('Synthesis',B.Synthesis,'Diagnostic',B.Diagnostic);show('Verdict',B.Verdict,'Cure',B.Cure);show('Synthesis',B.Synthesis,'Verdict',B.Verdict);
// time order of the calls
const {bodies}=require('./prefix.cjs');
