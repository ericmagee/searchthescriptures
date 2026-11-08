const fs=require('fs');const D='/mnt/project-files/wall2024/inputs/';
const rd=(R,n)=>{try{const j=JSON.parse(fs.readFileSync(D+R+'_'+n+'_Extract.json'))[0].data.main[0][0].json;return j.labelled||j.raw;}catch(e){return null;}};
for(const [R,ref] of [['33040','Matthew 1:24'],['33506','Deuteronomy 20:7'],['33617','Isaiah 8:4'],['33617','Genesis 4:1']]){
 const d2=rd(R,'D2')||'';const i=d2.indexOf(ref);console.log('\n=== '+R+' '+ref+' DR2 press: '+(i<0?'NOT FOUND':d2.slice(Math.max(0,i-200),i+250).replace(/\s+/g,' ')));
 for(const k of ['C3','C4']){const t=rd(R,k)||'';let j=-1,n=0;while((j=t.indexOf(ref,j+1))>=0&&n<4){n++;console.log('--'+k+'@'+j+': '+t.slice(Math.max(0,j-220),j+220).replace(/\s+/g,' '));}}}
