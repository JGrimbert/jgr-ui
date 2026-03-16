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
		client: {start:"_app/immutable/entry/start.Cz6_Aase.js",app:"_app/immutable/entry/app.CcrDHBEe.js",imports:["_app/immutable/entry/start.Cz6_Aase.js","_app/immutable/chunks/DafGJ-6-.js","_app/immutable/chunks/Dqtv70OQ.js","_app/immutable/chunks/eucqAbiz.js","_app/immutable/entry/app.CcrDHBEe.js","_app/immutable/chunks/Dqtv70OQ.js","_app/immutable/chunks/DCSZmcwn.js","_app/immutable/chunks/DW1dr9xa.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/eucqAbiz.js","_app/immutable/chunks/BWIKfAaU.js","_app/immutable/chunks/u_3azkkx.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
