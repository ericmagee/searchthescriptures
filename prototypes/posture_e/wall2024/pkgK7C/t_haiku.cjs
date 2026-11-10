process.env.EX='/mnt/project-files/wall2024/ex34703_full.json';process.env.EXID='34703';const chain=require('./chain_ex.cjs');
(async()=>{const r=await chain(process.argv[2],{});const J=r.over['Alternate Merge Seat'][0][0].json;const t=(J.alt_tried||J.tried||[]);const T=JSON.stringify(J);
 const i=T.indexOf('"result":"NOT SEATED"');const k=T.indexOf('"verdict_raw":"',i)+15;let s='',j=k;for(;j<T.length;j++){if(T[j]==='\\'){s+=T[j]+T[j+1];j++;continue;}if(T[j]==='"')break;s+=T[j];}
 const v=JSON.parse('"'+s+'"');console.log(v.split('\n').filter(l=>/^\[AUDIT/.test(l)&&(/UNCURED|counted|COUNT|drv/i.test(l))).map(l=>l.slice(0,330)).join('\n'));})();
