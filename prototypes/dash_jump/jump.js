/* Jump to #: waits until typing stops (0.7 s) instead of jumping on the first digit; Enter jumps at once (operator 2026-11-24). Loads last. */
(function(){if(typeof lcJump!=='function')return;var J=lcJump,T={};
window.lcJumpNow=function(t){clearTimeout(T[t]);J(t);};
lcJump=function(t){var el=document.getElementById('lc_j_'+t);if(el)lcGet(t).jump=String(el.value||'').trim();clearTimeout(T[t]);T[t]=setTimeout(function(){J(t);},700);};
document.addEventListener('keydown',function(e){var el=e.target;if(e.key==='Enter'&&el&&el.id&&el.id.indexOf('lc_j_')===0){e.preventDefault();window.lcJumpNow(el.id.slice(5));}},true);})();
