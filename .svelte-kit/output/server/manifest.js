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
		client: {start:"_app/immutable/entry/start.BYFLVS6f.js",app:"_app/immutable/entry/app.INp8ztEy.js",imports:["_app/immutable/entry/start.BYFLVS6f.js","_app/immutable/chunks/Y49IwOax.js","_app/immutable/chunks/uoU5KDzp.js","_app/immutable/entry/app.INp8ztEy.js","_app/immutable/chunks/uoU5KDzp.js","_app/immutable/chunks/DOP8Rw1N.js","_app/immutable/chunks/BNebY_TL.js","_app/immutable/chunks/CYhagmku.js","_app/immutable/chunks/D3XllGz-.js","_app/immutable/chunks/H2hy-9fT.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
