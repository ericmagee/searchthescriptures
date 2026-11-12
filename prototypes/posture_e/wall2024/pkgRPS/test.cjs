// pkgRPS tests: sbApply2024 captured from the rebuilt Gate Record source (live s151 and the package); plants on luna's stored judgment.
const fs=require('fs');
const cap=file=>{let w=JSON.parse(fs.readFileSync(file,'utf8'));w=w.data||w;w=w.workflow||w;const lib=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
 const L=JSON.parse(lib.slice(lib.indexOf('\n/*LIB*/')+8,lib.lastIndexOf('\n/*MAP*/'))),M=JSON.parse(lib.slice(lib.lastIndexOf('\n/*MAP*/')+8,lib.lastIndexOf('\n/*END*/')))['Gate Record'];
 let s=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
 const at=s.search(/\n(?:const|let) [A-Za-z_$]+=\$\('/);s=s.slice(0,at)+'\nglobalThis.__W1={sbApply2024};'+s.slice(at);
 const mk=()=>({isExecuted:false,all:()=>[],first:()=>({json:{}}),item:{json:{}},params:{}});try{new Function('$','$input',s)(()=>mk(),mk());}catch(e){}const X=globalThis.__W1;delete globalThis.__W1;if(!X)throw new Error('no capture');return X.sbApply2024;};
const LV=cap('/mnt/project-files/wall2024/fetchback_live_s151.json'),PK=cap(process.argv[2]);
let F0={conceded_links:0,challenger_conceded_links:0};let raw=fs.readFileSync(__dirname+'/luna_1134.txt','utf8');
// remove the appended AUDIT lines so the text is the judge's own lines
const Q='“I grant the narration names Joseph among ‘his parents’ (Luke 2:41; C5, P5.3).”';
const label='DEFENDER CR4: '+Q;
const C=[
 ['R1 luna as sent (no second separator, curly)','DEFENDER | [CR4] '+Q+' COUNTED','placed'],
 ['R2 both separators (control)','DEFENDER | [CR4] | '+Q+' COUNTED','placed'],
 ['R3 straight quotes','DEFENDER | [CR4] "I grant the narration names Joseph among \'his parents\' (Luke 2:41; C5, P5.3)." COUNTED','placed'],
 ['R4 the label form','DEFENDER CR4: '+Q+' COUNTED','placed'],
 ['R5 other side','CHALLENGER | [CR4] '+Q+' COUNTED','not placed'],
 ['R6 other round','DEFENDER | [CR3] '+Q+' COUNTED','not placed'],
 ['R7 other sentence','DEFENDER | [CR4] “I grant the narration names Mary.” COUNTED','not placed'],
 ['R8 round without brackets, no second separator','DEFENDER | CR4 '+Q+' COUNTED','placed'],
 ['R10 label form, other round','DEFENDER CR3: '+Q+' COUNTED','not placed'],
 ['R11 no quote after the round','DEFENDER | [CR4] I grant the narration names Joseph COUNTED','not placed'],
 ['R3b straight quotes, both separators (control)','DEFENDER | [CR4] | "I grant the narration names Joseph among \'his parents\' (Luke 2:41; C5, P5.3)." COUNTED','placed'],
 ['R9 lower case side','defender | [cr4] '+Q+' COUNTED','placed'],
];
const show=r=>{const it=(r&&r.items)||[];const na=it.filter(z=>/NOT APPLIED/.test(z.kind||''));return na.length?'not placed: '+na.map(z=>z.why).join('; ').slice(0,90):'placed';};
let ok=0;
for(const [nm,to,want] of C){const its=[{ans:'CHANGE',line:label,to,sid:'S1',rule:'K-S3',item:'S3 DEFENDER CR4: #3'}];
 let a,b;try{a=LV('luna',raw,F0,its,null);}catch(e){a={items:[{kind:'NOT APPLIED',why:'ERR '+e.message}]};}try{b=PK('luna',raw,F0,its,null);}catch(e){b={items:[{kind:'NOT APPLIED',why:'ERR '+e.message}]};}
 const g=show(b).startsWith('placed')?'placed':'not placed';if(g===want)ok++;
 console.log(g===want?'OK  ':'FAIL',nm,'| live:',show(a),'| package:',show(b));
 if(g==='placed'&&b&&b.text){const ln=String(b.text).split('\n').find(l=>l.includes('his parents')&&/^DEFENDER/.test(l));console.log('      placed line:',ln);}}
console.log('plants',ok,'of',C.length);
