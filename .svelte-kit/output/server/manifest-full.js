export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.BwiM8JuL.js",app:"_app/immutable/entry/app.DwkPPQR7.js",imports:["_app/immutable/entry/start.BwiM8JuL.js","_app/immutable/chunks/Bs1kGKOk.js","_app/immutable/chunks/BYFKLCN7.js","_app/immutable/chunks/Bo3dnMlY.js","_app/immutable/entry/app.DwkPPQR7.js","_app/immutable/chunks/BYFKLCN7.js","_app/immutable/chunks/DfkxUdrI.js","_app/immutable/chunks/BEkmr5eG.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Bo3dnMlY.js","_app/immutable/chunks/DTAPeKia.js","_app/immutable/chunks/BSwn8-E0.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/demo",
				pattern: /^\/demo\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
