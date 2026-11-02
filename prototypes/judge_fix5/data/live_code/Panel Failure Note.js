const e = ($input.first().json || {}).error;
const msg = typeof e === 'string' ? e : ((e && (e.message || e.description)) ? String(e.message || '') + ' ' + String(e.description || '') : JSON.stringify(e || {}));
let node = 'unknown'; try { node = $prevNode.name; } catch (x) {}
// A panel-stage failure no longer ends the run: the transcript still goes to Drive with this notice.
$execution.customData.set('panel_failed', node);
// DRY REPLAY: a failed dry regrade goes from here to Dry Failure Stop (via Dry Failed?), never to Get Row or Drive.
return [{ json: { panel_failed: true, failed_node: node, failed_msg: String(msg).trim().slice(0, 400) } }];
