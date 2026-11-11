// W2: independent pricing of 35067 under the rev 2 fill (figures read by W2 from the providers' pages 11-11).
const fs=require('fs');const W='/mnt/project-files/wall2024/';
const ld=f=>{let D=JSON.parse(fs.readFileSync(f,'utf8'));D=D.data||D;return D.workflow||D;};const B=ld(W+'parent_s139_RCS2.json');
const X=JSON.parse(fs.readFileSync(W+'ex35067_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const runSrc=(src,$,inp)=>{const $input={first:()=>inp[0],all:()=>inp,item:inp[0]};return new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
const mk=n=>{const r=rd[n];const o=r?(r[r.length-1].data.main[0]||[]):[];return {isExecuted:!!r,first:()=>o[0],all:()=>o,last:()=>o[o.length-1],item:o[0],params:{}};};
const P={'claude-opus-5-5':[4,0.2,5,8,20,null],'claude-sonnet-5-5':[2,0.1,2.5,4,10,null],'deepseek-flash':[0.15,0.003,null,null,0.6,2]};
const peak=t=>{if(!t)return true;const d=new Date(t*1000);const w=d.getUTCDay(),h=d.getUTCHours();return w>=1&&w<=5&&[1,2,3,6,7,8,9].includes(h);};
(async()=>{let pin=[];for(const [k,v] of Object.entries(B.connections))for(const o of (v.main||[]))for(const e of (o||[]))if(e.node==='Panel Tokens'&&rd[k])pin=rd[k][rd[k].length-1].data.main[0];
const out=await runSrc(B.nodes.find(n=>n.name==='Panel Tokens').parameters.jsCode,mk,pin);const C=out[0].json.calls;const by={};let tot=0,np=0,ds=[];
for(const c of C){let u=null;if('b' in c)u=c.b;else if(P[c.m]){const p=P[c.m];const m=p[5]&&peak(c.t)?p[5]:1;u=((c.i||0)*p[0]+(c.cr||0)*(p[1]??p[0])+(c.w5||0)*(p[2]??p[0])+(c.w1||0)*(p[3]??p[0])+(c.o||0)*p[4])/1e6*m;if(c.f==='deepseek')ds.push(c.t);}
 if(u==null){np++;continue;}tot+=u;const k=('b' in c)?'billed':c.m;by[k]=(by[k]||0)+u;}
console.log('total $'+tot.toFixed(4),'| no price',np,'|',Object.entries(by).map(([k,v])=>k+' $'+v.toFixed(4)).join(', '));
console.log('deepseek calls',ds.length,'with time',ds.filter(Boolean).length,'UTC range',new Date(Math.min(...ds)*1000).toISOString(),new Date(Math.max(...ds)*1000).toISOString(),'any peak',ds.some(peak));})();
