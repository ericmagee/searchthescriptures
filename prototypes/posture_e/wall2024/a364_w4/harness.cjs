function run(code,nodes,input){const $=(nm)=>{if(!(nm in nodes))return {first:()=>{throw new Error('no node '+nm);},all:()=>[],isExecuted:false};const v=nodes[nm];return {first:()=>({json:v}),all:()=>[{json:v}],isExecuted:true};};
 const $input={first:()=>({json:input}),all:()=>[{json:input}]};
 return new Function('$','$input','$execution','return (()=>{'+code+'\n})();')($,$input,{customData:{set(){},get(){}}});}
module.exports={run};
