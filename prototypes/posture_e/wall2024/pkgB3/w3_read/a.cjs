// W3 second reading of W2 survey item B3: how does cureLines on a workflow file read the stored 48f8feea gemini RESTATED line?
const L=require('../../w2_grades/formsurvey/cl_lib.cjs')(process.argv[2]);
if(process.argv[3]==='src'){const s=L.cureLines.toString();console.log(s.length);console.log(s.slice(0,1800));process.exit();}
const cut='RESTATED: CHALLENGER CHAIN MARK: STRAINED -- C1 asserts an unstated marital knowing within the espousal contradicted by [L1] Matthew 1:25 "And knew her not till';
const T={cut,
 full:cut+' she had brought forth her firstborn son" | [L2] ginōskō (G1097, "to know") | [L3] Matthew 1:18 "before they came together, she was found with child of the Holy Ghost"',
 own_bare:'RESTATED: CHALLENGER CHAIN MARK: STRAINED',
 own_nolabel:'RESTATED: STRAINED -- C1 asserts an unstated marital knowing',
 own_dash:'RESTATED - CHALLENGER CHAIN MARK: STRAINED -- C1 asserts a knowing [L1] Matthew 1:25 "And knew her not" | [L2] ginōskō (G1097)',
 own_wrap:cut+'\nshe had brought forth her firstborn son" | [L2] ginōskō (G1097, "to know")'};
for(const k in T){const o=L.cureLines(T[k]);console.log(k,'| restated',o.restated.length,'malformed',o.malformed.length,'prose',o.prose.length,'|',JSON.stringify(o.restated[0]||o.malformed[0]||'').slice(0,260));}
