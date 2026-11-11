// pkgSYL (W1): ASK 56 option 1 (Eric 22:20 CST 11-10). After the closing check, code adds one row under each link the closing enforcer
// confirmed broken, in the synthesis saved by Build Save Body. No model reads the saved synthesis. Build Save Body only.
// Usage (from wall2024/): node pkgSYL/build_SYL.cjs <parent.json> <out.json>
const fs=require('fs'),crypto=require('crypto');const [PB,OUT]=process.argv.slice(2);
const w=JSON.parse(fs.readFileSync(PB,'utf8'));const n=w.nodes.find(x=>x.name==='Build Save Body');let c=n.parameters.jsCode;
const A='synthesis:d.synthesis,';const k=c.split(A).length-1;if(k!==1)throw new Error('anchor count '+k);
const F="const __SYL=s=>{let C=[];try{C=$('Close Enforcer Record').first().json.cec.confirmed||[];}catch(e){}if(!s||!C.length)return s;const L=String(s).split('\\n'),T=[],q=x=>String(x||'').replace(/\\s+/g,' ').replace(/\\|/g,'/');C.forEach(x=>{const t={DEFENDER:'D',CHALLENGER:'C'}[x.side]+x.link,m='confirmed closing contradiction ('+q(x.id)+'): earlier ['+q(x.earlier_round)+'] \"'+q(x.earlier_q)+'\"; closing ['+q(x.closing_round)+'] \"'+q(x.closing_q)+'\". Added by code after the closing check.',i=L.findIndex(l=>new RegExp('^\\\\|[\\\\s*]*'+t+'\\\\b').test(l));if(i<0)T.push('**ENGINE: '+t+' BROKEN** -- '+m);else L.splice(i+1,0,'| '+t+' (engine) | **BROKEN** | '+m+' |'+' |'.repeat(Math.max(0,L[i].split('|').length-5)));});let o=L.join('\\n');if(T.length){const j=o.search(/\\n--- ORACLE_DEBATE_V1 /);o=j<0?o+'\\n\\n'+T.join('\\n\\n'):o.slice(0,j)+'\\n\\n'+T.join('\\n\\n')+o.slice(j);}return o;}; /* pkgSYL */\n";
c=F+c.replace(A,'synthesis:__SYL(d.synthesis),');n.parameters.jsCode=c;
new Function('$','$input','$json','$execution','return (async()=>{\n'+c+'\n})');
const tot=x=>x.nodes.reduce((s,n)=>s+((n.parameters&&n.parameters.jsCode)||'').length,0);const p=JSON.parse(fs.readFileSync(PB,'utf8'));
const s=JSON.stringify(w);fs.writeFileSync(OUT,s);console.log('code vs parent',tot(w)-tot(p),'| sha',crypto.createHash('sha256').update(s).digest('hex').slice(0,16),OUT);
