const fs=require('fs');const P=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s119.json'));
const OLD="const L=((A.reversed||{})[sd]||[]);if(!L.length)return '';";
const NEWA="const __n=x=>String(x||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();let __X=[];try{if($('Close Enforcer Record').isExecuted)__X=(($('Close Enforcer Record').first().json.cec||{}).rows||[]).filter(x=>x&&x.status==='NOT A CONTRADICTION').map(x=>__n(x.closing_q));}catch(e){}const L=((A.reversed||{})[sd]||[]).filter(r=>__X.indexOf(__n(r.close_q))<0);if(!L.length)return '';";
const OLDB="The close sentence is disregarded; grade";const NEWB="The close sentence is disregarded (this note breaks no link; it is not a confirmed closing contradiction); grade";
for(const nm of ['Panel Build','Build Independent Verdict']){const s=P.nodes.find(n=>n.name===nm).parameters.jsCode;console.log(nm,'anchor A',s.split(OLD).length-1,'anchor B',s.split(OLDB).length-1);}
console.log('A per node code',NEWA.length-OLD.length,'B per node code',NEWB.length-OLDB.length,'B per note prompt',NEWB.length-OLDB.length);
// test A on 34852 rows
const rd=JSON.parse(fs.readFileSync('ex34852_full.json','utf8')).data.resultData.runData;const j=k=>rd[k][rd[k].length-1].data.main[0].map(x=>x.json);
const A=j('Anticheat Record')[0].acx;const C=j('Close Enforcer Record')[0].cec;const __n=x=>String(x||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const X=(C.rows||[]).filter(x=>x.status==='NOT A CONTRADICTION').map(x=>__n(x.closing_q));
console.log('reversed.D',(A.reversed.D||[]).map(r=>r.verse),'-> kept',(A.reversed.D||[]).filter(r=>X.indexOf(__n(r.close_q))<0).map(r=>r.verse));
