// ALIGNED TO LIVE (BB-7821, 7826 correction 1): the engine is live ask; its reply carries no model field,
// so engine_model is the ask source constant at deploy 69, named as such.
const d = $input.first().json;
return [{json:{ ...d, saveBody: { ...d.saveBody, engine: 'ask-live', engine_model: 'z-ai/glm-5.3 (ask source constant, deploy 69)' } }}];
