// W3: for one answer, where does the Panel Cure Check output of pkgKRO rev 2 differ from rev 1 (reason of the K-S3 row aside)?
process.chdir('/home/claude/ericmagee/searchthescriptures/prototypes/posture_e/wall2024');
const fs=require('fs');const {harness}=require(process.cwd()+'/pkgGSL/harness.cjs');const R=f=>fs.readFileSync(f,'utf8');
const C0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Cure_Call_1_openrouter.json'))[0].data.main[0][0].json;const T0=C0.choices[0].message.content;
const K='K-S3 S3 DEFENDER CR4: #1';const LINE=T0.split('\n').find(x=>x.startsWith('RESPONSE: '+K+' |'));
const out=(L,r)=>{const c=JSON.parse(JSON.stringify(C0));c.choices[0].message.content=T0.replace(LINE,()=>'RESPONSE: '+K+' | '+r);const n=harness('34108',{'Panel Cure Call 1 openrouter':[{json:c}]})(R(L+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');return harness('34108',{'Panel Cure Normalize 1':n})(R(L+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;};
const walk=(a,b,p)=>{if(typeof a!==typeof b||a===null||b===null||typeof a!=='object'){if(a!==b)console.log(p+'\n   rev1: '+String(JSON.stringify(a)).slice(0,500)+'\n   rev2: '+String(JSON.stringify(b)).slice(0,500));return;}for(const k of new Set([...Object.keys(a),...Object.keys(b)]))walk(a[k],b[k],p+'.'+k);};
walk(out('pkgLIB/strip_KRO/patched/',process.argv[2]),out('pkgLIB/strip_KRO2/patched/',process.argv[2]),'');
{const a=JSON.stringify(out('pkgLIB/strip_KRO/patched/',process.argv[2])),b=JSON.stringify(out('pkgLIB/strip_KRO2/patched/',process.argv[2]));const cut=s=>s.replace(/ ?\(NOTED, record-only: [^)]*\)/g,'');console.log('equal once every NOTED parenthesis is removed:',cut(a)===cut(b),'| statuses in rev2:',(b.match(/cure_status\\*":\\*"[A-Z ]+/g)||[]).join(' ').replace(/[\\"]/g,''));}
