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
		client: {start:"_app/immutable/entry/start.CF948DAL.js",app:"_app/immutable/entry/app.sfG7IGA8.js",imports:["_app/immutable/entry/start.CF948DAL.js","_app/immutable/chunks/B6nYz25w.js","_app/immutable/chunks/_3nBd531.js","_app/immutable/entry/app.sfG7IGA8.js","_app/immutable/chunks/_3nBd531.js","_app/immutable/chunks/B5evsOw5.js","_app/immutable/chunks/DqaDUR1F.js","_app/immutable/chunks/j6JZjGrl.js","_app/immutable/chunks/DcWqenAx.js","_app/immutable/chunks/DR6WDxkT.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
