// pkgKCON test: K-CON reads TRIAL in every node; only the two planned strings differ from pkgR2; item D cure probe unchanged
const fs=require('fs');let ok=0,bad=0;const t=(c,m)=>{if(c){ok++;console.log('OK  ',m);}else{bad++;console.log('FAIL',m);}};
for(const n of fs.readdirSync('pkgKCON/patched')){const s=fs.readFileSync('pkgKCON/patched/'+n,'utf8'),b=fs.readFileSync('pkgR2/patched/'+n,'utf8');
 const m=s.match(/const ENF_STATUS=(\{[^}]*\})/);const ENF=new Function('return '+m[1])();
 const enfStatus=r=>ENF[String(r||'')]==='TRIAL'?'TRIAL':'LIVE';
 t(enfStatus('K-CON')==='TRIAL'&&enfStatus('K-G4')==='LIVE',n+': K-CON TRIAL, K-G4 still LIVE');
 const back=s.split("'K-CON':'TRIAL'").join("'K-CON':'LIVE'");
 const back2=back.replace(/or REASSERTED IN with the quote\. TRIAL rule: answer it in the cure; it removes no seat\./g,'or REASSERTED IN with the quote. LIVE rule: left uncured after the cure, it removes the seat.');
 t(back2===b,n+': no other change');}
const L=require('../pkgR2/lib.cjs')('pkgKCON/patched/Panel_Cure_Check.js');const Q='the angel told Joseph that the child was conceived of the Holy Ghost';
const x={rule:'K-CON',link:'K1',line:'[R3] ... quotes it: "'+Q+'"'};
t(L.krulCure(x,'NOT HELD -- K1 -- "'+Q+'" -- verse only.',{},'').st==='CURED','cure reader unchanged: bare NOT HELD with quote cures');
t(L.krulCure(x,'RESPONSE: K1 | NOT HELD: verse only.',{},'').st==='UNCURED','cure reader unchanged: NOT HELD with reason only does not cure (now TRIAL, removes no seat)');
console.log(ok,'OK',bad,'FAIL');process.exit(bad?1:0);
