// W1 Issue A (Wall 4812): Format Markdown on 35067 with live s132 code. Count review-flag rows that say "removes the seat", by audit form, and
// whether flagKey gives them a key at all.
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const P='/mnt/project-files/wall2024/';
let W=JSON.parse(fs.readFileSync(P+'fetchback_live_s132.json'));W=W.data||W;W=W.workflow||W;const code=W.nodes.find(n=>n.name==='Format Markdown').parameters.jsCode;
const rd=JSON.parse(fs.readFileSync(P+(process.argv[2]||'ex35067_full.json'),'utf8')).data.resultData.runData;
(async()=>{const o=await run(code,'Format Markdown',rd);if(o.err){console.log('ERR',o.err);return;}const md=JSON.stringify(o).replace(/\\n/g,'\n');
 const rows=md.split('\n').filter(l=>/^\| (Review|Cured) flag/.test(l));const rs=rows.filter(l=>/removes the seat/.test(l));
 const form=l=>(l.match(/AUDIT v\d+: ([A-Z][A-Z -]+?)(?: \(|--)/)||[])[1]||'?';const by={};for(const l of rs){const k=(l.startsWith('| Review')?'Review':'Cured')+' | '+form(l);by[k]=(by[k]||0)+1;}
 console.log('flag rows',rows.length,'review',rows.filter(l=>l.startsWith('| Review')).length,'cured',rows.filter(l=>l.startsWith('| Cured')).length);console.log('rows saying removes the seat',rs.length,JSON.stringify(by,null,1));
 const fk=code.slice(code.indexOf('const flagKey'),code.indexOf('const curedSet'));const flagKey=new Function(fk+';return flagKey;')();
 const sample=rs.filter(l=>l.startsWith('| Review')).slice(0,3);sample.forEach(l=>{const x='['+l.split(' | ')[1].replace(/ \|$/,'')+']';console.log('flagKey ->',flagKey(x),'|',x.slice(0,200));});})();
