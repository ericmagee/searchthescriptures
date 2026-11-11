// pkgPCQ replay: preCheckSide from base and parent (both nodes) run on the stored round texts of the 12 exports, plus plants.
const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflowData||j.workflow||j;};
const fn=(w,name)=>{const c=w.nodes.find(n=>n.name===name).parameters.jsCode;try{new Function('$','$input','return (async()=>{\n'+c+'\n})();');}catch(e){throw new Error(name+' does not compile: '+e.message);}const i=c.indexOf('function preCheckSide');const j=c.indexOf('\nfunction ',i+10);return new Function(c.slice(i,j)+'\nreturn preCheckSide;')();};
const A=load(process.env.BASE||'/mnt/project-files/wall2024/parent_s142_JOINT_A21_SRH.json'),B=load(process.argv[2]);
const W='/mnt/project-files/wall2024/';let tot={items:0,changed:0,same:0,nodes_agree:true};
for(const name of ['Panel Build','Build Independent Verdict']){const O=fn(A,name),N=fn(B,name);console.log('==',name,'compiles');
 for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const rd=JSON.parse(fs.readFileSync(W+f,'utf8')).data.resultData.runData;let r=null;
  const walk=o=>{if(r)return;if(o&&typeof o==='object'&&!Array.isArray(o)){if(typeof o.cr1==='string'&&typeof o.gr2==='string'&&typeof o.cr3==='string'&&o.gr2.length>500){r=o;return;}for(const k in o)walk(o[k]);}else if(Array.isArray(o))o.forEach(walk);};
  for(const n in rd){rd[n].slice(0,1).forEach(x=>walk(x.data));if(r)break;}
  const go=F=>[].concat(F(r.gr2,[r.cr1,r.cr2],'CHALLENGER LIST [DR2]'),F(r.cr3,[r.gr1,r.gr2],'DEFENDER LIST [CR3]'));const o=go(O),n=go(N);
  o.forEach((x,k)=>{tot.items++;if(x===n[k]){tot.same++;return;}tot.changed++;tot.dchars=(tot.dchars||0)+n[k].length-x.length;console.log(f.slice(2,7),'OLD',x.slice(0,140),'\n      NEW',n[k].slice(0,200));});}}
console.log('TOTAL',JSON.stringify(tot));
// plants
const N=fn(B,'Panel Build'),O=fn(A,'Panel Build');const opp=['I wrote that the pregnancy is dated before any union, so Joseph cannot be the source of it. And "found with child" (Matthew 1:18) and "took unto him his wife" (Matthew 1:24).'];
const mkL=items=>'## UNSUPPORTED-L4 PREMISES\n\n'+items.map((t,i)=>(i+1)+'. '+t).join('\n\n')+'\n';
const P=[
 ['quote after ASSUMES, "words:" marker','LINK 1: The dating inference. ASSUMES: "before" dates it. ROWS GIVE: "found with child" (Matthew 1:18). The defender\'s verbatim words: "the pregnancy is dated before any union, so Joseph cannot be the source of it."','found'],
 ['quote after ASSUMES, "Defender:" marker, curly quotes','LINK 1: The dating inference. ASSUMES: x -- ROWS GIVE: y. Defender: “the pregnancy is dated before any union, so Joseph cannot be the source of it.”','found'],
 ['no opponent quote; only ROWS GIVE verse quotes after ASSUMES (must stay "no verbatim quote found")','LINK 1: The dating inference. ASSUMES: "before" dates it. ROWS GIVE: "found with child" (Matthew 1:18), "took unto him his wife" (Matthew 1:24).','none'],
 ['quote before ASSUMES (unchanged)','LINK 1: The defender wrote: "the pregnancy is dated before any union, so Joseph cannot be the source of it." ASSUMES: x -- ROWS GIVE: y.','found'],
 ['"Challenger:" marker with words not in the opponent rounds','LINK 1: The dating inference. ASSUMES: x -- ROWS GIVE: y. Challenger: "words that stand in no round of the other side."','none'],
 ['quote under PRESSED WITH only (not searched)','LINK 1: The dating inference. ASSUMES: x -- ROWS GIVE: y.\nPRESSED WITH:\nDefender: "the pregnancy is dated before any union, so Joseph cannot be the source of it."','none'],
];
let ok=0;for(const [nm,t,want] of P){const n=N(mkL([t]),opp,'CHALLENGER LIST [DR2]')[0],o=O(mkL([t]),opp,'CHALLENGER LIST [DR2]')[0];const got=/no verbatim quote found/.test(n)?'none':'found';if(got===want)ok++;console.log(got===want?'OK  ':'FAIL',nm,'| old:',/no verbatim/.test(o)?'none':'found','| new:',n.slice(0,110));}
console.log('plants',P.length,'right',ok);
