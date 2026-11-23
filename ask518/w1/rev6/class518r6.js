// ASK 518 rev 6 (W1): class the replies in ask518/w4/rev6/<body>_r<n>.json. pkgJC2 per run: an item is confirmed in run n only when copy 1 AND copy 2 of run n answer CONFIRMED.
// Item key: J-candidates by id (J1, J2); X-candidates by id; NEW items by side + kind + n. Output class518r6.json and a per-item table OLD vs NEW (runs confirmed of 3).
const fs=require('fs');const H=__dirname;const man=JSON.parse(fs.readFileSync(H+'/manifest518r6.json','utf8'));const RDIR=process.env.RDIR||'/mnt/project-files/ask518/w4/rev6';
const LINE=/^[\s*>-]*CLOSE-CONTRADICTION\s*:\s*([A-Z]*\d*|NEW)\s*--\s*(DEFENDER|CHALLENGER)\s*--\s*([A-Z ]+?)\s*(\d+|\?)?\s*--\s*(CONFIRMED|NOT A CONTRADICTION)\s*--\s*(.*)$/i;
const rep=[];const per={};// per[body|arm|run][copy] = {key: [rows]}
for(const m of man){const base=m.file.split('/').pop().replace(/\.json$/,'');
 for(let k=1;k<=m.repeats;k++){const f=RDIR+'/'+base+'_r'+k+'.json';const slot=(per[m.body+'|'+m.arm+'|'+k]=per[m.body+'|'+m.arm+'|'+k]||{});
  if(!fs.existsSync(f)){rep.push({base,k,missing:true});slot[m.copy]=null;continue;}
  const W=JSON.parse(fs.readFileSync(f,'utf8'));const R=W.response||W;const txt=String(((R.choices||[])[0]||{}).message?R.choices[0].message.content:(R.content||JSON.stringify(R)));
  const none=/^\s*CLOSE-CONTRADICTION\s*:\s*NONE\s*$/im.test(txt);const rows=[];
  for(const l of txt.split('\n')){const x=l.match(LINE);if(!x)continue;const rest=x[6];const id=x[1].toUpperCase();
   const key=id==='NEW'?(x[2].toUpperCase()+' '+x[3].trim().toUpperCase()+' '+(x[4]||'?')):id;
   rows.push({key,id,side:x[2].toUpperCase(),kind:x[3].trim().toUpperCase(),n:x[4]||null,answer:x[5].toUpperCase(),
    earlier:(rest.match(/EARLIER\s*\[([^\]]+)\]\s*"([^"]*)"/i)||[]).slice(1).join(' '),closing:(rest.match(/CLOSING\s*\[([^\]]+)\]\s*"([^"]*)"/i)||[]).slice(1).join(' '),why:rest.split(/--/).pop().trim().slice(0,240)});}
  const conf={};for(const r of rows)if(r.answer==='CONFIRMED')(conf[r.key]=conf[r.key]||[]).push(r);slot[m.copy]=conf;
  rep.push({base,body:m.body,arm:m.arm,copy:m.copy,k,exec:W.execution||null,body_md5_ok:W.body_md5===m.md5,finish:((R.choices||[])[0]||{}).finish_reason||null,none,rows,unparsed:(rows.length||none)?0:1});}}
const items={a:{'CHALLENGER LINK 6':null},b:{J1:null,J2:null},c:{'CHALLENGER LINK 1':null,'CHALLENGER LINK 2':null,'CHALLENGER LINK 4':null},d:{'CHALLENGER LINK 6':null}};// known items seeded so a zero shows; items[body][key] = {OLD:[runs], NEW:[runs], single:{OLD:n,NEW:n}}
for(const [s,c] of Object.entries(per)){const [b,arm,k]=s.split('|');const c1=c[1],c2=c[2];if(!c1||!c2)continue;
 for(const key of new Set([...Object.keys(c1),...Object.keys(c2)])){const it=((items[b]=items[b]||{})[key]=items[b][key]||{OLD:[],NEW:[],single:{OLD:0,NEW:0}});
  if(c1[key]&&c2[key])it[arm].push(+k);else it.single[arm]++;}}
for(const o of Object.values(items))for(const k in o)if(!o[k])o[k]={OLD:[],NEW:[],single:{OLD:0,NEW:0}};
fs.writeFileSync(H+'/class518r6.json',JSON.stringify({replies:rep,items},null,1));
const miss=rep.filter(r=>r.missing).length,bad=rep.filter(r=>!r.missing&&(!r.body_md5_ok||r.unparsed)).map(r=>r.base+'_r'+r.k);
console.log('replies',rep.length-miss,'of',rep.length,'missing',miss,'md5/parse problems',bad.join(' ')||'none');
for(const [b,o] of Object.entries(items))for(const [key,v] of Object.entries(o))console.log(b,key.padEnd(24),'OLD both-copy runs',v.OLD.length+'/3','NEW',v.NEW.length+'/3','| one-copy only OLD',v.single.OLD,'NEW',v.single.NEW);
