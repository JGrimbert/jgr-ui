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
		client: {start:"_app/immutable/entry/start.tUUD1oCi.js",app:"_app/immutable/entry/app.Bs0C4dLg.js",imports:["_app/immutable/entry/start.tUUD1oCi.js","_app/immutable/chunks/C6Ke6fLs.js","_app/immutable/chunks/Dqtv70OQ.js","_app/immutable/chunks/eucqAbiz.js","_app/immutable/entry/app.Bs0C4dLg.js","_app/immutable/chunks/Dqtv70OQ.js","_app/immutable/chunks/DyW_aNdh.js","_app/immutable/chunks/D_w3XQ-z.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/eucqAbiz.js","_app/immutable/chunks/BWIKfAaU.js","_app/immutable/chunks/u_3azkkx.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
