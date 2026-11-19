// Targets of non-literal $(x) calls: node names written as quoted literals in the 260 chars before each such call
// (e.g. for(const n of ['Panel Cure Check','Alt Seated','R2 Alt Seated']){...$(n)...}), kept only if they are nodes of the workflow.
const acorn=require('../pkgLIB/vendor/acorn.cjs');const walk=require('../pkgLIB/vendor/walk.cjs');
module.exports=function dyn(src,nodeSet){const ast=acorn.parse('async function V(){'+src+'}',{ecmaVersion:2025,sourceType:'module'});const calls=[];
 walk.ancestor(ast,{CallExpression(c){if(c.callee.type==='Identifier'&&c.callee.name==='$'&&c.arguments.length&&c.arguments[0].type!=='Literal'){
  const s=c.start-19;const ctx=src.slice(Math.max(0,s-260),s);calls.push([...new Set([...ctx.matchAll(/'([^'\\]+)'/g)].map(m=>m[1]).filter(z=>nodeSet.has(z)))]);}},
  Identifier(i){if(i.name==='$node'||i.name==='$item')calls.push(null);}});return calls;};
