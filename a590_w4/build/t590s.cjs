// ASK 590 layer 2 tests (W4): the send-back of a judge line resting on a reversed close sentence (S3 d)
const fs=require('fs');const lp=require('/mnt/project-files/ask588/w4/build/libpatch.js');const D=__dirname;
const J=f=>JSON.parse(fs.readFileSync(D+'/'+f,'utf8'));const E1=J('target_engine_590.json'),E2=J('target_engine_590s.json'),C0=J('base_child.json'),C2=J('target_child_590s.json');
let pass=0,fail=0;const T=(id,ok,what)=>{ok?pass++:fail++;console.log((ok?'PASS ':'FAIL ')+id+' '+what);};
// L1 structure
const nm=W=>Object.fromEntries(W.nodes.filter(n=>n.name!=='Shared Library').map(n=>[n.name,JSON.stringify(n)]));
const a=nm(E1),b=nm(E2);T('L1.1',Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>a[k]===b[k])&&JSON.stringify(E1.connections)===JSON.stringify(E2.connections),'engine: only the Shared Library differs from layer 1; wiring unchanged');
const c=nm(C0),d=nm(C2);T('L1.2',Object.keys(c).length===Object.keys(d).length&&Object.keys(c).every(k=>c[k]===d[k])&&JSON.stringify(C0.connections)===JSON.stringify(C2.connections),'child: only the Shared Library differs from live 2d5bdc94');
const L1=lp.cut(E1).L,L2=lp.cut(E2).L,LC=lp.cut(C2).L;const ch=L1.map((l,i)=>l!==L2[i]?i:-1).filter(i=>i>=0);
T('L1.3',JSON.stringify(ch)===JSON.stringify([2784,2789,2929,2959,3564]),'LIB lines changed: '+ch.join(', '));
T('L1.4',JSON.stringify(L2)===JSON.stringify(LC),'engine and child carry the same LIB');
const M2=lp.cut(E2).M;const keysOf=i=>Object.keys(M2).filter(k=>M2[k]&&Array.isArray(M2[k].p)&&M2[k].p.some(x=>x===i||(Array.isArray(x)&&typeof x[0]==='number'&&i>=x[0]&&i<=x[1])));
T('L1.5',JSON.stringify(keysOf(3564).sort())===JSON.stringify(['Alt Send Back Build','R2 Alt Send Back Build','Send Back Build']),'the new block runs in all three send-back builders: panel, alternates, round-2 alternates');
T('L1.6',['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record'].every(k=>keysOf(2789).includes(k)&&keysOf(2784).includes(k)),'the record-only cure runs in all three send-back records');
// L2 the matcher
const line=L2[3564];const fsrc=line.slice(line.indexOf('/*REV590{*/')+11,line.indexOf('/*}REV590*/'));
const acxN=new Function(L2[3563].slice(0,L2[3563].indexOf('\n',0)>0?undefined:undefined)+'\nreturn acx531Norm;')();
const hits=new Function('acx531Norm',fsrc+'\nreturn rev590Hits;')(acxN);
const R={id:'X3',side:'DEFENDER',verse:'Deuteronomy 22:24',closing_round:'DR4',earlier_round:'DR3',closing_q:'The damsel was betrothed and so the law counts her as a wife in the eyes of the congregation.',earlier_q:'The verse names her a damsel and not yet a wife.'};
T('L2.1',hits([R],'DEFENDER LINK 2 STANDS: the law counts her as a wife in the eyes of the congregation, so the link holds.').length===1,'a judge line quoting 8 words of the reversed close sentence is caught');
T('L2.2',hits([R],'DEFENDER LINK 2: the close says the law counts her as a wife in the eyes of the congregation, but that sentence is REVERSED and disregarded.').length===0,'a line that itself treats the sentence as reversed or disregarded is not sent back');
T('L2.3',hits([R],'DEFENDER LINK 2 STANDS: the verse names her a damsel and not yet a wife.').length===0,'a line quoting only the earlier sentence is not caught');
T('L2.4',hits([{...R,closing_q:'She was a wife.'}],'She was a wife.').length===0,'a close sentence under 6 words is not matched');
T('L2.5',hits([R],'[AUDIT v41: the law counts her as a wife in the eyes of the congregation]').length===0,'audit and extractor lines are skipped');
T('L2.6',hits([R],'A: the law counts her as a wife in the eyes of the congregation\nB: the law counts her as a wife in the eyes of the congregation').length===1,'one item per judge per side and verse');
T('L2.7',hits([R],'DEFENDER LINK 2: it counts her as a wife in the end').length===0,'7 words in a row are not enough');
// L3 the block run in the send-back builder, with stubs
const run=(alt,rev,bodies,altSeats)=>{const dis=[];const $=n=>({isExecuted:n==='Close Enforcer Record',first:()=>({json:{cec:{reversed:rev}}})});
 const PCC={bodies,alt_seats:altSeats||[]};const E421=[],E428=[];new Function('$','PCC','dis','E421','E428','__acxAlt',L2[3563]+'\n'+L2[3564])($,PCC,dis,E421,E428,alt);return dis;};
const body=(seat,vr)=>JSON.stringify({payload:{judge_seat:seat,verdict_raw:vr}});
const vr='VERDICT\nDEFENDER LINK 2 STANDS: the law counts her as a wife in the eyes of the congregation.\nCHALLENGER LINK 1 BROKEN';
let x=run(false,[R],[body('sol62',vr),body('terra','nothing quoted')]);
T('L3.1',x.length===1&&x[0].seat==='sol62'&&x[0].rule==='E-REVCLOSE'&&x[0].seat_role==='panel'&&x[0].rvc&&x[0].rvc.verse==='Deuteronomy 22:24','panel: one E-REVCLOSE item for the judge that quotes the sentence, none for the other');
T('L3.2',x.length===1&&/^ENFORCER DISAGREE: REVERSED CLOSE SENTENCE/.test(x[0].cure_reason)&&/the judge keeps the decision \(ruling 428\)/.test(x[0].cure_reason)&&/counts against no seat/.test(x[0].cure_reason)&&/\[DR4\]/.test(x[0].cure_reason)&&/\[DR3\]/.test(x[0].cure_reason),'the item carries both quotations, both rounds and ruling 428\'s form');
T('L3.3',run(false,[],[body('sol62',vr)]).length===0,'no reversed sentence: no item (today\'s send-back unchanged)');
T('L3.4',run(true,[R],[body('sol62',vr),body('alt1',vr)],[{seat:'alt1'}]).map(y=>y.seat+'/'+y.seat_role).join()==='alt1/alternate','alternates: only the seated alternate is sent back');
T('L3.5',(()=>{try{const dis=[];new Function('$','PCC','dis','E421','E428','__acxAlt',L2[3563]+'\n'+L2[3564])(()=>{throw new Error('x')},{bodies:[body('a',vr)]},dis,[],[],false);return dis.length===0;}catch(e){return false;}})(),'a fault in the block adds nothing and stops nothing');
// L4 the record: record-only
T('L4.1',/&&!it\.grt2&&!it\.rvc&&/.test(L2[2784]),'a silent E-REVCLOSE item is not counted as silence');
T('L4.2',/if\(it\.rvc\)\{rows\[rows\.length-1\]\.cure_reason\+=' \| REVERSED CLOSE SENTENCE \(E-REVCLOSE, ASK 590, ruling 427\): record-only, counts against no seat; the judge keeps the decision \(ruling 428\)'/.test(L2[2789]),'the record line says record-only and ruling 428');
const recSrc=['Send Back Record'].map(k=>lp.src(E2,k))[0];
T('L4.3',!/(ACXM|PABM|MNPM|IMPM|KSCM|B7M|ECF|UNDF|LAYF|DLUC|SIL)\[[^\]]*\][^;]*it\.rvc/.test(recSrc)&&(recSrc.match(/it\.rvc/g)||[]).length===2,'it.rvc appears only in the silence guard and the record line: no failure map takes it');
T('L4.4',/rvc:x\.rvc\|\|null/.test(L2[2929])&&/rvc:i\.rvc\|\|null/.test(L2[2959]),'the flag rides from the item list to the send-back output');
console.log('RESULT: '+(fail?'FAIL ('+fail+' fail, '+pass+' pass)':'ALL PASS ('+pass+' pass)'));
