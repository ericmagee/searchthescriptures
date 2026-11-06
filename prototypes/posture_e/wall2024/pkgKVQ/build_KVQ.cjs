// pkgKVQ (run 33107 chatgpt K-V UNCURED): the K-V kind test reads "a claim the quoted words do not make". KV_KIND matched "quote" or "quotation"
// but not "quoted", so chatgpt's cure STATEMENT ("“immediate father” is a claim the quoted words do not make") was read as naming no kind.
// Not a curly-quote fault: kvQuotes reads curly marks (checked). One line, KV_KIND, in all 22 library nodes: (?:quote|quotation) -> (?:quote|quoted|quotation).
// Base: live 36e9c423 = pkgKVP/patched with pkgECL/patched for its 5 library nodes. Run from wall2024/: node pkgKVQ/build_KVQ.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const OLD=fs.readFileSync('pkgKVP/patched/Panel_Cure_Check.js','utf8').match(/^const KV_KIND=.*$/m)[0];
const NEW=OLD.split('\\b(?:quote|quotation)\\b').join('\\b(?:quote|quoted|quotation)\\b');if(NEW.split('quoted|').length!==3)throw new Error('expected 2 edits');
fs.mkdirSync('pkgKVQ/patched',{recursive:true});const plan={nodes:[]};
for(const f of fs.readdirSync('pkgKVP/patched').filter(f=>f.endsWith('.js')).sort()){const base=fs.existsSync('pkgECL/patched/'+f)?'pkgECL/patched':'pkgKVP/patched';const s0=fs.readFileSync(base+'/'+f,'utf8');
 if(s0.split(OLD).length!==2)throw new Error(f+': KV_KIND line not found once');const s=s0.replace(OLD,()=>NEW);new Function('$','$input','$json',s);fs.writeFileSync('pkgKVQ/patched/'+f,s);
 plan.nodes.push({file:f,base,base_sha:sha(s0),final_sha:sha(s)});}
plan.old=OLD;plan.new=NEW;fs.writeFileSync('pkgKVQ/plan_KVQ.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes');
