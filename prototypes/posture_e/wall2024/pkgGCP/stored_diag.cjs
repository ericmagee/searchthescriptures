// Why pkgGCP takes a cure count off or not, on a stored run: per counted cure line, (a) line replaced, (b) raised before, (c) raised after. usage: node pkgGCP/stored_diag.cjs <run> <seat>
const fs=require('fs');const cl=x=>JSON.parse(JSON.stringify(x));const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex'+process.argv[2]+'_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const out=n=>rd[n]?rd[n][rd[n].length-1].data.main:null;const L=require('./glib.cjs')(out);const seat=process.argv[3];
const SB=out('Send Back Record')[0][0].json,GR=out('Gate Record')[0][0].json,PB0=out('Panel Build')[0][0].json;
const p=JSON.parse(SB.bodies.find(s=>JSON.parse(s).payload.judge_seat===seat)).payload;const its=(GR.sb_items||[]).filter(x=>x.seat===seat);
const j=PB0.judges.find(q=>q.seat===seat);const PT=L.gatePromptText2024(j.body);const ctx={R:L.ciRounds(PT),DL:L.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
const F={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};
const R=L.sbApply2024(seat,p.verdict_raw,F,its,ctx.R);const K=L.gateNewK2024(L.cureJText(p.verdict_raw,true),R.text,F,R.fields,ctx);
const N=s=>String(s==null?'':s).replace(/\\+/g,'').replace(/[*_`"“”]+/g,'').replace(/\s+/g,' ').trim().toUpperCase();
console.log(process.argv[2],seat,'applied:',R.applied.join(','),'| replaced lines:',R.rp.length);R.rp.forEach(([o,n])=>console.log('  RP '+String(o).slice(0,150)+'\n   -> '+String(n).slice(0,150)));
const k=x=>x.rule+'|'+(x.link||x.side);console.log('  before:',(K.a||[]).map(k).join(' ; '));console.log('  after :',(K.b||[]).map(k).join(' ; '));
for(const l of p.verdict_raw.split('\n')){const m=l.match(/^\[AUDIT v21: DEBATE RULE VIOLATION REPORT -- SEAT: [^;]*; ITEM: (.*?); RULE: ([^;]+); RESULT: ([A-Z ]+?)[;\]](.*)/);if(!m||m[3]==='CURED')continue;
 const ln=N((m[4].match(/(?:^ |; )LINE: (.*?); (?:JUDGE )?STATEMENT: /)||[])[1]).replace(/\.\.\.$/,'').slice(0,80);const hit=(Ls,c)=>(Ls||[]).some(x=>x.rule===m[2]&&[x.link,(x.side||'')+' STANDING'].some(q=>N(q)===N(m[1])));
 console.log('  '+m[2]+' '+m[1]+': LIVE '+(L.enfStatus(m[2])==='LIVE')+'; replaced '+R.rp.some(([o])=>N(L.cureSafe(o)).includes(ln))+'; before '+hit(K.a)+'; after '+hit(K.b)+'; line: '+ln.slice(0,70));}
