// W3 second seat on W2's Wall 4558 item 3: a bare reference that the scoped parser gives no book. Live s119 C4P, Build Synthesis copy.
const fs=require('fs');let d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s119.json','utf8'));d=d.data||d;d=d.workflow||d;
const cut=c=>{const k=c.indexOf('const REFP=');const ke=c.indexOf('})();',k)+5;const i=c.indexOf('const C4P=');const e=c.indexOf('})();',i)+5;return [c.slice(k,ke),c.slice(i,e)];};
const [r,p]=cut(d.nodes.find(x=>x.name==='Build Synthesis').parameters.jsCode);const R=new Function(r+'\n'+p+'\nreturn {REFP,C4P};')();
const E=["Matthew 1:18 dates the finding.","Luke 1:35 names the power.",""];
const P={
 a:"I keep the link. The 'nothing shall be impossible' of 1:37 covers it.",
 b:"I keep the link. Luke gives the 'nothing shall be impossible' of 1:37.",
 b2:"I keep the link. Luke 1:35 stands, and the 'nothing shall be impossible' of 1:37 covers it.",
 c:"I keep the link. The taking (1:24) follows the dream.",
 d:"I keep the link. The 'nothing shall be impossible' of Luke 1:37 covers it.",
 e:"Matthew 1:20 names the source. The 'nothing shall be impossible' of 1:37 covers it.",
};
for(const k in P){const F1={gr1:E[0],gr2:E[1],dr3:E[2],dr4:P[k]},F2={cr1:E[0],gr1:'',cr2:E[1],gr2:'',cr3:E[2],dr3:'',cr4:P[k]};const x=R.C4P.of(F1),y=R.C4P.ofD(F2);
 console.log(k,'| DR4 new',JSON.stringify([...x]),'line',JSON.stringify(x.u||[]),'| CR4 new',JSON.stringify([...y]),'line',JSON.stringify(y.u||[]),'| note chars',R.C4P.note(F1).length,R.C4P.noteD(F2).length);}
