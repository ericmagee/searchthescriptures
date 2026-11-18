// ASK 399 pre-build: 8512 item 5 recount with the proposed restated test (markers_out.json): a retracted link counts with its restated grade if restated, else is left out.
const J=require('../a384/judgments_all.json');const D=require('../a386/dbcols.json');const E=require('../a400/ev.cjs')(__dirname+'/../rdf/fetchback_w394s11.json');
const M=require('./markers_out.json');const K=x=>String(x||'').toUpperCase().replace(/\s+VS\.?\s+/,' VS ').trim();
const rg=o=>{const BR=/LINK BROKEN$/;const v=o.v25.filter(c=>c);if(v.length){const last=v[v.length-1].split('>')[1];return (BR.test(o.col)&&!BR.test(last))?last:o.col;}if(o.restated.length){const g=o.restated[o.restated.length-1];return (BR.test(o.col)&&!BR.test(g))?g:o.col;}if(o.v27)return o.col;return null;};
const out=[];for(const j of J){const ms=M.filter(m=>m.id===j.id);if(!ms.length)continue;const c=D.find(x=>x[0]===j.id);const F={v:c[1],dst:c[2],cst:c[3],cd:c[4],cc:c[5]};
 const col=E.rcLines(E.cureJText(j.v,true)).col;const R=new Map(ms.map(m=>[K(m.link),rg(m)]));
 const col399=col.filter(z=>!R.has(K(z.link))||R.get(K(z.link))!==null).map(z=>R.has(K(z.link))?{...z,grade:R.get(K(z.link))}:z);
 const unk=col.filter(z=>!z.grade).length;const stand=(n,b,orig)=>{if(typeof n!=='number')return orig;if(n>=1||b>0)return (orig==='COLLAPSED'||orig==='PROP-DEPENDENT')?orig:'PROP-DEPENDENT';return unk?orig:'SELF-SUPPORTED';};
 const b=(cl,s)=>cl.filter(z=>z.grade===s+' LINK BROKEN').length;
 const d0=stand(F.cd,b(col,'DEFENDER'),F.dst),c0=stand(F.cc,b(col,'CHALLENGER'),F.cst),d1=stand(F.cd,b(col399,'DEFENDER'),F.dst),c1=stand(F.cc,b(col399,'CHALLENGER'),F.cst);
 const w0=E.rd386({verdict:F.v,dst:d0,cst:c0,cd:F.cd,cc:F.cc,col,retracted:[...R.keys()]}).word;
 // 399 rd386: list already filtered; nothing retracted left to drop
 const w1=E.rd386({verdict:F.v,dst:d1,cst:c1,cd:F.cd,cc:F.cc,col:col399,retracted:[]}).word;
 if(d0!==d1||c0!==c1||w0!==w1)out.push({id:j.id,seat:j.seat,v:F.v,stand:[d0+'>'+d1,c0+'>'+c1],word:w0+'>'+w1});}
console.log('changes',out.length);for(const o of out)console.log(JSON.stringify(o));require('fs').writeFileSync(__dirname+'/count2_out.json',JSON.stringify(out,null,1));
