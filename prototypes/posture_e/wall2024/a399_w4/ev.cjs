const fs=require('fs');module.exports=function(file){let d=JSON.parse(fs.readFileSync(file));if(d.data&&d.data.nodes)d=d.data;const lt=d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
 const L=JSON.parse(lt.slice(lt.indexOf('\n/*LIB*/')+8,lt.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(lt.slice(lt.lastIndexOf('\n/*MAP*/')+8,lt.lastIndexOf('\n/*END*/')))['Alternate Merge ERT'];
 const S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
 return new Function('$',S+'\nreturn {ert386,rd386,rcLines,cureJText,ret386,ap399:(typeof ap399!=="undefined"?ap399:null)};')(()=>{throw new Error('no $');});};
