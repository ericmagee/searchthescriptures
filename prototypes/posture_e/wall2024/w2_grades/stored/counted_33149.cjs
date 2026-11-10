// W2: the K-S3 COUNTED reader of each fetch-back on the two stored COUNTED cure answers of debate 33149 (enforcer log rows 9449 chatgpt, 9467 sol).
// No execution export exists for 33149: the item line and the STATEMENT and RESPONSE lines are copied from the enforcer log; rounds are not loaded (the COUNTED path reads only the response and its continuation).
process.env.EX=process.env.EX||'/mnt/project-files/wall2024/ex34703_full.json';
const H=require('../../pkgK7C/w3_grade/h.cjs');const fs=require('fs');
const CASES=[
 {row:9449,seat:'chatgpt',item:{rule:'K-S3',side:'DEFENDER',link:'S3 DEFENDER CR4: #1',line:'DEFENDER CR4: “Conceded: Jeconiah had a son, Salathiel.”'},
  text:'STATEMENT: K-S3 S3 DEFENDER CR4: #1 | The concession is counted under defender premise 2, which was already counted for the withdrawal of the Jeconiah step; it does not add a second premise.\nRESPONSE: K-S3 S3 DEFENDER CR4: #1 | COUNTED: [CR4] says, “Conceded: Jeconiah had a son, Salathiel.” It concerns the same listed premise already counted.\nRESTATED: D5 vs C1 (Galatians 4:4): UNDERDETERMINED'},
 {row:9467,seat:'sol',item:{rule:'K-S3',side:'DEFENDER',link:'S3 DEFENDER CR4: #6',line:'DEFENDER CR4: "Conceded: Jeconiah had a son, Salathiel."'},
  text:'STATEMENT: K-S3 S3 DEFENDER CR4: #6 | The factual grant "Conceded: Jeconiah had a son, Salathiel." is not an additional surrendered premise. The accompanying withdrawal of the Jeconiah argument is already COUNTED as defender premise 2.\nRESPONSE: K-S3 S3 DEFENDER CR4: #6 | COUNTED: The Jeconiah argument is already the single counted defender premise, number 2. "Conceded: Jeconiah had a son, Salathiel" neither adds another premise nor withdraws declared D6; the count remains 1.\nSTATEMENT: K-S3 S3 CHALLENGER DR4: #7 | TOUCHES NO LINK'}];
const over={'Close Enforcer Record':null,'Judge Contradiction Record':null};const rounds={};['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'].forEach(k=>rounds[k]='');
const src={cure:{items:null,broken:{DEFENDER:[],CHALLENGER:[]},rounds},reply:null};
for(const fb of process.argv.slice(2))for(const c of CASES){const s={cure:{...src.cure,items:[c.item]},reply:{ok:true,text:c.text}};const r=H.run(fb,s,over);const x=r.v[0];
 console.log(fb.replace(/.*fetchback_live_/,'').replace('.json',''),'| row',c.row,c.seat,'|',x.status,'|',x.why,'| drv',r.n);}
