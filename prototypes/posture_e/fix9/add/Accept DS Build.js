// posture v5: DeepSeek's acceptance call, by its own API, or a skip item when DeepSeek debates.
const ds=$('Accept Build').first().json.ds;return [{json:ds?{acc:ds}:{skip:true}}];
