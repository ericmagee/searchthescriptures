// W3 grade of pkgACM on live s109
const H=require('../../study_reject_w3/h.cjs');const {fs,IN,saved,run,cl}=H;
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const LIVE=g('/mnt/project-files/wall2024/fetchback_live_s109.json'),CAND=g('pkgACM/parent_s109_ACM.json');
const S=JSON.stringify;let ok=true;const chk=(n,c,x)=>{if(!c)ok=false;console.log((c?'OK   ':'FAIL ')+n+(x?': '+x:''));};
// G1
const diff=LIVE.nodes.filter(n=>S(n)!==S(CAND.nodes.find(z=>z.name===n.name))).map(n=>n.name);
const a=H.code(LIVE,'Anticheat Record'),b=H.code(CAND,'Anticheat Record');let i=0;while(a[i]===b[i])i++;
chk('G1 nodes '+LIVE.nodes.length+'/'+CAND.nodes.length+', connections equal, differing nodes '+S(diff),LIVE.nodes.length===418&&CAND.nodes.length===418&&S(LIVE.connections)===S(CAND.connections)&&S(diff)===S(['Anticheat Record']));
{const from='["”])?\\s*$/);if(!m)continue;',to='["”])?\\.?\\s*$/);if(!m)continue;';chk('G1 size '+a.length+' to '+b.length+'; the one difference is "\\.?" before "\\s*$" in the line pattern',b.length-a.length===3&&a.split(from).length===2&&a.replace(from,to)===b);}
const allCode=W=>W.nodes.reduce((s,n)=>s+(n.parameters&&typeof n.parameters.jsCode==='string'?n.parameters.jsCode.length:0),0);console.log('     code text total '+allCode(LIVE)+' to '+allCode(CAND));
// does any node send anti-cheat answers to record_enforcer_log?
const lg=LIVE.nodes.filter(n=>/record_enforcer_log/.test(S(n.parameters))&&/acx|Anticheat/i.test(S(n.parameters))).map(n=>n.name);console.log('     nodes naming both record_enforcer_log and the anti-cheat record: '+S(lg));
// G2
const runs=fs.readdirSync(IN).map(f=>(f.match(/^(\d+)_Anticheat_Call_deepseek\.json$/)||[])[1]).filter(Boolean).sort();
const txtOf=c=>{const j=c.json;return (j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content)||'';};
const R=(W,r,over)=>run(W,r,'Anticheat Record',over||null,'Anticheat Call deepseek')[0].json.acx;
let deb=0,lines=0,unL=[],unC=[],changed=[],shownDiff=0;
for(const r of runs){const call=saved(r,'Anticheat Call deepseek');if(!call||!call.length)continue;const x=R(LIVE,r),y=R(CAND,r);if(x.skipped){if(S(x)!==S(y))chk('G2 skipped run '+r+' equal',false);continue;}deb++;
 const L=call.map(txtOf).join('\n').split('\n').filter(l=>l.trim());lines+=L.length;
 const un=(A)=>{const ids=new Set(A.rows.map(z=>z.id));return L.filter(l=>{const m=l.match(/ANTICHEAT:\s*(X\d+)/);return !m||!ids.has(m[1]);}).map(l=>r+': '+l.slice(0,150));};unL.push(...un(x));unC.push(...un(y));
 if(S(x.reversed)!==S(y.reversed))shownDiff++;
 if(S(x)!==S(y)){const xi=new Map(x.rows.map(z=>[z.id,z]));const nw=y.rows.filter(z=>!xi.has(z.id));const same=y.rows.filter(z=>xi.has(z.id)).every(z=>S(z)===S(xi.get(z.id)))&&x.rows.every(z=>y.rows.some(w=>w.id===z.id));
  changed.push(r+': new rows '+nw.map(z=>z.id+' '+z.answer).join(', ')+'; other rows equal '+same+'; no_answer '+x.counts.no_answer+' to '+y.counts.no_answer+'; counts live '+S(x.counts)+' cand '+S(y.counts)+'; rest equal '+(S({...x,rows:0,counts:0,no_answer:0})===S({...y,rows:0,counts:0,no_answer:0})));}}
console.log('G2 debates with an anti-cheat reply '+deb+'; reply lines '+lines+'; unread live '+unL.length+', candidate '+unC.length);unL.forEach(z=>console.log('     live unread: '+z));unC.forEach(z=>console.log('     cand unread: '+z));changed.forEach(z=>console.log('     changed '+z));
chk('G2 changed debates are 33389 and 33617 only; no shown mark differs',changed.length===2&&/^33389/.test(changed[0])&&/^33617/.test(changed[1])&&shownDiff===0&&changed.every(z=>/other rows equal true/.test(z)&&/rest equal true/.test(z)));
chk('G2 unread 4 to 1, 33389 X73 stays',unL.length===4&&unC.length===1&&/33389.*X73/.test(unC[0]));
// G3 plants
const real=[];for(const r of runs){const call=saved(r,'Anticheat Call deepseek');if(!call||!call.length)continue;const x=R(LIVE,r);if(x.skipped)continue;for(const row of x.rows)if(row.answer==='REVERSED'&&row.shown)real.push([r,row.id]);}
console.log('G3 real shown REVERSED lines in stored runs: '+real.map(z=>z.join(' ')).join(', '));
const pick=real.find(z=>z[0]!=='33218')||real[0];const [r,id]=pick;const call=saved(r,'Anticheat Call deepseek');const re=new RegExp('ANTICHEAT:\\s*'+id+'\\b');const k=call.findIndex(c=>re.test(txtOf(c)));const line=txtOf(call[k]).split('\n').find(l=>re.test(l));console.log('   plant base: debate '+r+' '+id+': '+line.slice(0,220));
const P=(W,nl)=>{const c2=cl(call);c2[k].json.choices[0].message.content=txtOf(call[k]).replace(line,nl);const A=R(W,r,{'Anticheat Call deepseek':c2});const rows=A.rows.filter(z=>z.id===id);return {n:rows.length,ans:rows.map(z=>z.answer+(z.note?'/'+z.note:'')).join('+')||'NOT READ',shown:[].concat(A.reversed.D,A.reversed.C).filter(z=>z.id===id).length,na:A.no_answer.includes(id),A};};
const T=(nm,nl,exp)=>{const x=P(LIVE,nl),y=P(CAND,nl);const d='live '+x.ans+' shown '+x.shown+'; candidate '+y.ans+' shown '+y.shown;chk('G3 '+nm,exp(x,y),d);return [x,y];};
const base=line.replace(/\s*$/,'');
T('control, as stored',line,(x,y)=>x.shown===1&&y.shown===1&&S(x.A)===S(y.A));
T('a. period after the EARLIER quote',base+'.',(x,y)=>x.ans==='NOT READ'&&y.ans==='REVERSED'&&y.shown===1);
T('b. curly closing quote then period',base.replace(/["”]$/,'”')+'.',(x,y)=>x.ans==='NOT READ'&&y.shown===1);
T('c. period, spaces, carriage return',base+'.  \r',(x,y)=>x.ans==='NOT READ'&&y.shown===1);
T('d. period; EARLIER words not in the side text',base.replace(/EARLIER:\s*["“][^]*["”]$/,'EARLIER: "the moon is made of green cheese and always was so"')+'.',(x,y)=>x.ans==='NOT READ'&&y.ans==='REVERSED/QUOTE NOT FOUND'&&y.shown===0);
T('e1. three periods after the quote',base+'...',(x,y)=>x.ans==='NOT READ'&&y.ans==='NOT READ');
T('e2. "!" after the quote',base+'!',(x,y)=>x.ans==='NOT READ'&&y.ans==='NOT READ');
T('e3. a note after the period',base+'. The grant is taken back',(x,y)=>x.ans==='NOT READ'&&y.ans==='NOT READ');
T('e4. period then closing bold marks',base+'.**',(x,y)=>x.ans==='NOT READ'&&y.ans==='NOT READ');
{const [x,y]=T('f. same id twice: stored line, then the same with a period',line+'\n'+base+'.',(x,y)=>x.shown===1&&y.shown>=1);console.log('     rows for the id: live '+x.n+', candidate '+y.n+'; counts live '+S(x.A.counts)+' candidate '+S(y.A.counts));
 const x2=P(LIVE,line+'\n'+base),y2=P(CAND,line+'\n'+base);console.log('     for comparison, the stored line twice with no period: rows live '+x2.n+' shown '+x2.shown+', candidate '+y2.n+' shown '+y2.shown+' (a repeated line is counted twice by live already: '+(x2.n===2)+')');}
T('g. period line for an id not in the items',line+'\n'+base.replace(id,'X9999')+'.',(x,y)=>S(x.A)===S(y.A));
T('h. bare CONSISTENT with a period','ANTICHEAT: '+id+' -- CONSISTENT.',(x,y)=>x.ans==='NOT READ'&&y.ans==='CONSISTENT'&&y.shown===0);
T('i. period inside the quote only (as live reads today)',base.replace(/["”]$/,'."'),(x,y)=>S(x.A)===S(y.A));
T('j. CLOSE quote only, with a period, on REVERSED',base.replace(/\s*--\s*EARLIER:[^]*$/,'')+'.',(x,y)=>x.ans==='NOT READ'&&y.ans==='REVERSED/QUOTE NOT FOUND'&&y.shown===0);
// G4 downstream
for(const rr of ['33389','33617']){const x=R(LIVE,rr),y=R(CAND,rr);for(const nd of ['Panel Build','Build Independent Verdict','Build Save Body']){let o1,o2,err='';try{o1=run(LIVE,rr,nd,{'Anticheat Record':[{json:{acx_only:false,acx:x}}]});o2=run(LIVE,rr,nd,{'Anticheat Record':[{json:{acx_only:false,acx:y}}]});}catch(e){err=e.message.slice(0,160);}
  Promise.all([o1,o2]).then(([p,q])=>{if(err){console.log('G4 '+rr+' '+nd+': could not run offline: '+err);return;}const s1=S(p),s2=S(q);if(s1===s2){console.log('G4 '+rr+' '+nd+': output equal ('+s1.length+' characters)');return;}let i=0;while(s1[i]===s2[i])i++;let j=0;while(s1[s1.length-1-j]===s2[s2.length-1-j]&&j<s1.length-i)j++;console.log('G4 '+rr+' '+nd+': differs, '+s1.length+' to '+s2.length+'\n     live: '+s1.slice(Math.max(0,i-160),s1.length-j+40)+'\n     cand: '+s2.slice(Math.max(0,i-160),s2.length-j+40));}).catch(e=>console.log('G4 '+rr+' '+nd+': could not run offline: '+String(e.message).slice(0,160)));}}
process.on('exit',()=>console.log(ok?'ALL CHECKS OK':'SOME CHECK FAILED'));
