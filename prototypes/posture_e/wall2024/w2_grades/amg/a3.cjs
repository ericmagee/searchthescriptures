const fs=require('fs');const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const ld=f=>{const D=JSON.parse(fs.readFileSync(f,'utf8'));return (D.data||D).workflow||(D.data||D);};
const fnOf=(s,name)=>{const i=s.indexOf('function '+name+'(');if(i<0)throw new Error('no '+name);let d=0,j=s.indexOf('{',i);for(let k=j;k<s.length;k++){if(s[k]==='{')d++;else if(s[k]==='}'){d--;if(!d)return s.slice(i,k+1);}}};
const get=f=>{const W=ld(f);const s=rebuild(W.nodes.find(x=>x.name==='Send Back Record').parameters.jsCode,W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode);
 const deps='function __acm4(){return null;}';return new Function(deps+'\n'+fnOf(s,'enf428Cure')+'\nreturn enf428Cure;')();};
const O=get('/mnt/project-files/wall2024/fetchback_live_s142.json'),Nw=get('/mnt/project-files/wall2024/parent_s142_AMG.json');
const R={CR3:'MEANS stated here.',DR3:'The reassurance is spoken to the Davidic husband, about a child God owns. It fits the link fully and well.'};
const L=(g,ans)=>'ANSWER CHECK: Matthew 1:20 -- [DR3] -- MEANS: "the begetting is of the Holy Ghost" -- ANSWER: "'+ans+'" -- '+g+' -- "x"';
const A1='The reassurance is spoken to the Davidic husband, about a child God owns.';
const P=[
 ['MISSES flagged, right MEETS, change MEETS same answer',{rule:'E-ANS',line:L('MISSES',A1),reason:'ENFORCER DISAGREE (right: MEETS): ...'},{ans:'CHANGE',to:L('MEETS',A1)},'CURED'],
 ['FAILS flagged, right MEETS, change MEETS shorter cut',{rule:'E-ANS',line:L('FAILS',A1),reason:'ENFORCER DISAGREE (right:MEETS) x'},{ans:'CHANGE',to:L('MEETS','The reassurance is spoken to the Davidic husband')},'CURED'],
 ['MEETS flagged, right MISSES, change MEETS same',{rule:'E-ANS',line:L('MEETS',A1),reason:'ENFORCER DISAGREE (right: MISSES): ...'},{ans:'CHANGE',to:L('MEETS',A1)},'UNCURED'],
 ['MISSES flagged, right FAILS, change MEETS same',{rule:'E-ANS',line:L('MISSES',A1),reason:'ENFORCER DISAGREE (right: FAILS): ...'},{ans:'CHANGE',to:L('MEETS',A1)},'UNCURED'],
 ['MISSES flagged, no right-word in reason, change MEETS same',{rule:'E-ANS',line:L('MISSES',A1),reason:'ENFORCER DISAGREE: the answer meets'},{ans:'CHANGE',to:L('MEETS',A1)},'UNCURED'],
 ['MISSES flagged, right MEETS, change MEETS with words not in round',{rule:'E-ANS',line:L('MISSES',A1),reason:'(right: MEETS)'},{ans:'CHANGE',to:L('MEETS','A child of Joseph by blood is plainly named here.')},'UNCURED'],
 ['lower-case meets in flagged grade',{rule:'E-ANS',line:L('meets',A1),reason:'(right: MEETS)'},{ans:'CHANGE',to:L('MEETS',A1)},'?'],
];
for(const [n,it,a,exp] of P){let o,w;try{o=O(it,a,R,null).status;w=Nw(it,a,R,null).status;}catch(e){o=w='ERR '+e.message.slice(0,60);}console.log((exp==='?'?'INFO':w===exp?'RIGHT':'WRONG'),'old',o,'new',w,'expected',exp,'|',n,'|',Nw(it,a,R,null).why.slice(0,90));}
