var kit = {
	Dict: function() { var res = {}
		for (var i = 0; i < arguments.length; i += 2) { res[arguments[i]] = arguments[i+1] }
		return res
	}
}
var ice = {
	TB: "\t", SP: " ", DF: ":", EQ: "=", AT: "@", PS: "/", PT: ".", FS: ",", NL: "\n", LT: "<", GT: ">",
	OK: "ok", TRUE: "true", FALSE: "false", SUCCESS: "success", FAILURE: "failure", PROCESS: "process",

	AUTO: "auto", LIST: "list", BACK: "back", EXEC: "exec",
	SHOW: "show", HIDE: "hide", HELP: "help", HTTP: "http",
	VIEW: "view", MODE: "mode", SHIP: "ship", COPY: "copy",

	POD: "pod", CTX: "ctx", CMD: "cmd", ARG: "arg", RES: "res",
	RUN: "run", ERR: "err", OPT: "opt",
	CAN: "can",
	PWD: "./",

	MSG_DETAIL: "detail",
	MSG_OPTION: "option",
	MSG_APPEND: "append",
	MSG_RESULT: "result",
	MSG_FIELDS: "fields",
	MSG_SESSID: "sessid",

	MSG_SOURCE: "_source",
	MSG_TARGET: "_target",
	MSG_HANDLE: "_handle",
	MSG_UPLOAD: "_upload",
	MSG_DAEMON: "_daemon",
	MSG_ACTION: "_action",
	MSG_STATUS: "_status",
	MSG_PREFIX: "_prefix",

	MSG_DISPLAY: "_display",
	MSG_PROCESS: "_process",

	MSG_USERNAME: "user.name",
	MSG_USERNICK: "user.nick",

	MSG_TITLE: "sess.title",
	MSG_TOPIC: "sess.topic",
	MSG_RIVER: "sess.river",
	MSG_STORM: "sess.storm",
	MSG_TOAST: "sess.toast",

	PROCESS_AGAIN: "_again",

	ErrWarn: "warn: ",
	ErrNotLogin: "not login: ",
	ErrNotRight: "not right: ",
	ErrNotFound: "not found: ",
}

var ctx = {
	CONTEXT: "context", COMMAND: "command", CONFIG: "config",
	INDEX: "index", ARGS: "args", STYLE: "style", DISPLAY: "display", ACTION: "action",
	INPUTS: "inputs", FEATURE: "feature",
}
var cli = {
	DAEMON: "daemon",
	START: "start", STOP: "stop", OPEN: "open", CLOSE: "close", BEGIN: "begin", END: "end",

	RED: "red", GREEN: "green", BLUE: "blue",
	YELLOW: "yellow", CYAN: "cyan", PURPLE: "purple", MAGENTA: "magenta",
	WHITE: "white", BLACK: "black",

	MAKE: "make", MAIN: "main", EXEC: "exec", DONE: "done",
	CODE: "code", COST: "cost", BACK: "back", FROM: "from",
	ERROR: "error", CLEAR: "clear", REFRESH: "refresh",
	SHOW: "show",
}
var nfs = {
	ZML: "zml", IML: "iml",
	HTML: "html", CSS: "css", JS: "js", GO: "go", SH: "sh", CSV: "csv", JSON: "json",
	PATH: "path", FILE: "file", LINE: "line", SIZE: "size",
	SAVE: "save", LOAD: "load", TAGS: "tags", FIND: "find", GREP: "grep",
	DIR: "dir", CAT: "cat", DEFS: "defs", TRASH: "trash",
	DIR_ROOT: "dir_root",
	SCRIPT: "script",
}
var mdb = {
	DICT: "dict", META: "meta", HASH: "hash", LIST: "list",

	ID: "id", KEY: "key", TIME: "time", ZONE: "zone", TYPE: "type", NAME: "name", TEXT: "text",
	LINK: "link", SCAN: "scan", SHOW: "show", HELP: "help",
	SHORT: "short", FIELD: "field", TOTAL: "total", COUNT: "count", LIMIT: "limit",
	INDEX: "index", VALUE: "value", EXTRA: "extra", ALIAS: "alias", EXPIRE: "expire",

	CREATE: "create", REMOVE: "remove", INSERT: "insert", DELETE: "delete",
	MODIFY: "modify", SELECT: "select",
	INPUTS: "inputs", PRUNES: "prunes", EXPORT: "export", IMPORT: "import",
	UPLOAD: "upload",

	SEARCH: "search", ENGINE: "engine", RENDER: "render", PLUGIN: "plugin",
	PAGE: "page", NEXT: "next", PREV: "prev", LIMIT: "limit", OFFEND: "offend",
	MAIN: "main",

	FOREACH: "*", RANDOMS: "%",
}
var aaa = {
	PASSWORD: "password", USERNAME: "username", USERNICK: "usernick", BACKGROUND: "background", AVATAR: "avatar",
	LANGUAGE: "language", ENGLISH: "english", CHINESE: "chinese",
	LOGIN: "login", LOGOUT: "logout", INVITE: "invite",
}
var web = {
	SPACE: "space", DREAM: "dream", SHARE: "share",
}
var tcp = {
	HOST: "host", PORT: "port",
}
var gdb = {
	SIGNAL: "signal",
}
var lex = {
	SPLIT: "split",
}

var code = {
	VIMER: "vimer", INNER: "inner", FAVOR: "favor",
	AUTOGEN: "autogen", COMPILE: "compile", BINPACK: "binpack", WEBPACK: "webpack", PUBLISH: "publish",
	KEYWORD: "keyword",
}
var wiki = {
	TITLE: "title", BRIEF: "brief", REFER: "refer", SPARK: "spark",
	ORDER: "order", TABLE: "table", CHART: "chart", IMAGE: "image", VIDEO: "video",
	FIELD: "field", SHELL: "shell", LOCAL: "local", PARSE: "parse",
	CONTENT: "content",

	NAVMENU: "navmenu", PREMENU: "premenu",

	ITEM: ".story",
	H2: "h2.story",
	H3: "h3.story",
	DIV_PAGE: "div.page",
}
var chat = {
	LIB: "lib", PAGE: "page", PANEL: "panel", PLUGIN: "plugin", OUTPUT: "output", STORY: "story", FLOAT: "float",
	TOAST: "toast", CARTE: "carte", INPUT: "input", UPLOAD: "upload", CONTEXTS: "contexts",
	LAYOUT: "layout", PROJECT: "project", CONTENT: "content", DISPLAY: "display", PROFILE: "profile",

	TITLE: "title", TOPIC: "topic", BLACK: "black", WHITE: "white", PRINT: "print",
	SHARE: "share", RIVER: "river", STORM: "storm", FIELD: "field",
	PUBLIC: "public", PROTECTED: "protected", PRIVATE: "private",
	USER: "user", TOOL: "tool", NODE: "node",

	AGENT: "agent", CHECK: "check", GRANT: "grant",
	STATE: "state", MENUS: "menus", TRANS: "trans",
	SSO: "sso", WEBSITE: "website",

	libs: ["/lib/base.js", "/lib/core.js", "/lib/misc.js", "/lib/page.js", "/lib/user.js"],
	panel_list: [
		{name: "Header", help: "标题栏", pos: "head", state: ["time", "usernick", "avatar"]},
		{name: "River",  help: "群聊组", pos: "left", action: ["create", "refresh"]},
		{name: "Action", help: "工作台", pos: "main"},
		{name: "Search", help: "搜索框", pos: "auto"},
		{name: "Footer", help: "状态条", pos: "foot", state: ["ncmd", "ntip"]},
	],
	plugin_list: [
		"/plugin/state.js",
		"/plugin/input.js",
		"/plugin/table.js",
		"/plugin/input/key.js",
		"/plugin/input/date.js",
		"/plugin/story/spide.js",
		"/plugin/story/trend.js",
		"/plugin/local/code/inner.js",
		"/plugin/local/code/vimer.js",
		"/plugin/local/wiki/draw/path.js",
		"/plugin/local/wiki/draw.js",
		"/plugin/local/wiki/word.js",
		"/plugin/local/team/plan.js",
	],
	PLUGIN_STATE_JS: "/plugin/state.js",
	PLUGIN_INPUT_JS: "/plugin/input.js",
	PLUGIN_TABLE_JS: "/plugin/table.js",

	ONENGINE: "onengine", ONDAEMON: "ondaemon", ONAPPEND: "onappend", ONLAYOUT: "onlayout", ONMOTION: "onmotion", ONKEYMAP: "onkeymap",
	ONIMPORT: "onimport", ONSYNTAX: "onsyntax", ONACTION: "onaction", ONDETAIL: "ondetail", ONFIGURE: "onfigure", ONEXPORT: "onexport",
	ONPLUGIN: "onplugin",

	ONMAIN: "onmain", ONLOGIN: "onlogin", ONSEARCH: "onsearch",
	ONSIZE: "onsize", ONTOAST: "ontoast", ONREMOTE: "onremote",
	ONKEYDOWN: "onkeydown", ONMOUSEENTER: "onmouseenter", ORIENTATIONCHANGE: "orientationchange",
	ONSTORM_SELECT: "onstorm_select", ONACTION_TOUCH: "onaction_touch", ONACTION_NOTOOL: "onaction_notool",
	ONACTION_CMD: "onaction_cmd",

	_INIT: "_init", _ENGINE: "_engine", _SEARCH: "_search", _OUTPUTS_CURRENT: "_outputs.-1",
	_NAMES: "_names", _TOAST: "_toast",
}
var team = {
	TASK: "task", PLAN: "plan",
}
var mall = {
	ASSET: "asset", SALARY: "salary",
}

var svg = {
	G: "g", X: "x", Y: "y", R: "r", RX: "rx", RY: "ry",
	LINE: "line", RECT: "rect", TEXT: "text",
	M: "M", Q: "Q", T: "T",
	PATH2V: "path2v", PATH2H: "path2h",
}
var html = {
	// FIELDSET
	FIELDSET: "fieldset", LEGEND: "legend", OPTION: "option", ACTION: "action", OUTPUT: "output", STATUS: "status",
	FORM_OPTION: "form.option", DIV_ACTION: "div.action", DIV_OUTPUT: "div.output", DIV_STATUS: "div.status",
	FIELDSET_PANEL: "fieldset.panel", FIELDSET_PLUGIN: "fieldset.plugin", FIELDSET_STORY: "fieldset.story",
	FIELDSET_HEAD: "fieldset.head", FIELDSET_FOOT: "fieldset.foot",
	FIELDSET_LEFT: "fieldset.left", FIELDSET_MAIN: "fieldset.main",
	FIELDSET_AUTO: "fieldset.auto", FIELDSET_FLOAT: "fieldset.float",
	OPTION_ARGS: "select.args,input.args,textarea.args",
	INPUT_ARGS: "input.args,textarea.args",
	INPUT_BUTTON: "input[type=button]",

	// HTML
	UPLOAD: "upload", USERNAME: "username", PASSWORD: "password",
	INPUT: "input", TEXT: "text", TEXTAREA: "textarea", SELECT: "select", BUTTON: "button",
	FORM: "form", FILE: "file", SPACE: "space", CLICK: "click", SUBMIT: "submit", CANCEL: "cancel",
	DIV: "div", IMG: "img", CODE: "code", SPAN: "span", VIDEO: "video",
	TABLE: "table", TBODY: "tbody", TR: "tr", TH: "th", TD: "td", BR: "br", UL: "ul", LI: "li",
	A: "a", LABEL: "label", INNER: "inner", TITLE: "title",
	H1: "h1", H2: "h2", H3: "h3",
	WSS: "wss", SVG: "svg", CANVAS: "canvas", IFRAME: "iframe", CHROME: "chrome",

	// CSS
	CLASS: "class", FLOAT: "float", CLEAR: "clear", BOTH: "both",
	BACKGROUND: "background", SELECT: "select", HIDDEN: "hidden",
	DISPLAY: "display", BLOCK: "block", NONE: "none", FIXED: "fixed",
	OPACITY: "opacity",
	STROKE_WIDTH: "stroke-width", STROKE: "stroke", FILL: "fill", FONT_SIZE: "font-size", MONOSPACE: "monospace",
	SCROLL: "scroll", HEIGHT: "height", WIDTH: "width", LEFT: "left", TOP: "top", RIGHT: "right", BOTTOM: "bottom",
	MIN_HEIGHT: "min-height", MAX_HEIGHT: "max-height", MAX_WIDTH: "max-width", MIN_WIDTH: "min-width", MARGIN_TOP: "margin-top", MARGIN_X: "margin-x", MARGIN_Y: "margin-y",
	PLUGIN_MARGIN: 10, ACTION_HEIGHT: 29, ACTION_MARGIN: 200,
	TOGGLE: "toggle",

	PAGE: "page", TABS: "tabs",
	LIST: "list", ITEM: "item",
	MENU: "menu", NODE: "node",
	HIDE: "hide", SHOW: "show", AUTO: "auto",
	HEAD: "head", LEFT: "left", MAIN: "main", FOOT: "foot",
	LAYOUT: "layout", PLUGIN: "plugin",

	DIV_PAGE: "div.page",
	DIV_TABS: "div.tabs",
	DIV_LIST: "div.list",
	DIV_ITEM: "div.item",
	DIV_CODE: "div.code",
	DIV_LAYOUT_HEAD: "div.layout.head",
	DIV_LAYOUT_LEFT: "div.layout.left",
	DIV_LAYOUT_FOOT: "div.layout.foot",
	TABLE_CONTENT: "table.content",
	DIV_FLOAT: "div.float",

	ESCAPE: "Escape", ENTER: "Enter", TAB: "Tab",
	_CSS: ".css", _JS: ".js",
}
var lang = {
	UNDEFINED: "undefined",
	STRING: "string", NUMBER: "number",
	OBJECT: "object", FUNCTION: "function",
	ESCAPE: "Escape", ENTER: "Enter", TAB: "Tab",
	CONTROL: "Control", SHIFT: "Shift",
	PS: "/",
}

function shy(help, meta, list, cb) { var index = 0, args = arguments
	function next(type) { if (index < args.length && (!type || type == typeof args[index])) { return args[index++] } }
	return cb = args[args.length-1]||function() {}, cb.help = next(lang.STRING)||"", cb.meta = next(lang.OBJECT)||{}, cb.list = next(lang.OBJECT)||[], cb
}; var _can_name = "", _can_path = ""
var Volcanos = shy("火山架", {iceberg: "/chat/", volcano: "/frame.js", pack: {}, cache: {}}, function(name, can, libs, cb) {
	var meta = arguments.callee.meta, list = arguments.callee.list
	if (typeof name == lang.OBJECT) { var Config = name, panels = Config.panels||chat.panel_list
		meta.libs = Config.libs||chat.libs, meta.iceberg = Config.iceberg||meta.iceberg

		// 预加载
		libs = []; for (var i = 0; i < panels.length; i++) { var p = panels[i]
			p && (libs = libs.concat(p.list = p.list||["/panel/"+p.name+html._CSS, "/panel/"+p.name+html._JS]))
		}; libs = libs.concat(Config.plugin||chat.plugin_list)

		// 根模块
		_can_name = "", name = Config.name||ice.CAN, cb = can||function(can) {
			can.onengine._init(can, can.Conf(Config), panels, Config._init, can._target)
		}, can = {_follow: name, _target: Config.target||meta.target, _height: Config.height||window.innerHeight, _width: Config.width||window.innerWidth}
		for (var k in Config) { can[k] = Config[k] }
		can._root = can
	}

	var proto = {__proto__: meta, _path: _can_path, _name: name, _load: function(name, each) {
			// 加载缓存
			var cache = meta.cache[name]||[]; for (list.reverse(); list.length > 0; list) {
				var sub = list.pop(); sub != can && cache.push(sub)
			}; meta.cache[name] = cache

			// 加载模块
			for (var i = 0; i < cache.length; i++) { var sub = cache[i], name = sub._name
				if (typeof each == lang.FUNCTION && each(can, name, sub)) { continue }
				!can[name] && (can[name] = {}); for (var k in sub) {
					can[name].hasOwnProperty(k) || !sub.hasOwnProperty(k) || (can[name][k] = sub[k])
				}
			}
		},
		require: function(libs, cb, each) { if (!libs || libs.length == 0) {
				typeof cb == lang.FUNCTION && setTimeout(function() { cb(can) }, 10)
				return // 加载完成
			}

			// 无效地址
			if (libs[0] == undefined) { return can.require(libs.slice(1), cb, each) }

			if (libs[0] == "") {
				// 样式地址
				libs[0] = can._name.replace(html._JS, html._CSS)
			} else if (libs[0][0] != ice.PS && libs[0].indexOf(ice.HTTP) != 0) {
				// 相对地址
				libs[0] = can._name.slice(0, can._name.lastIndexOf(ice.PS)+1)+libs[0]
			}

			// 加载模块
			libs[0] = libs[0].toLowerCase()
			var name = libs[0].split("?")[0]
			function next() { can._load(name, each), can.require(libs.slice(1), cb, each) }
			meta.cache[name]? next(): (_can_path = libs[0], meta._load(name, next))
		},
		request: function(event) { event = event||{}, event = event._event||event
			var msg = event._msg||can.misc.Message(event, can); event._msg = msg
			function set(key, value) { msg.Option(key) || value == "" || msg.Option(key, value) }

			// 添加参数
			can.core.List(arguments, function(option, index) { if (!option || index == 0) { return } 
				can.base.isFunc(option.Option)? can.core.List(option.Option(), function(key) {
					if (key.indexOf("user.") == 0) { return }
					if (key.indexOf("_") == 0) { return }
					set(key, option.Option(key))
				}): can.core.Item(can.base.isFunc(option)? option(): option, set)
			}); return msg
		},

		actions: function(event, button) { can.run(event, [ctx.ACTION, button], null, true) },
		runAction: function(event, action, args, cb) { can.request(event, {_handle: ice.TRUE}, can.Option())
			can.run(event, can.misc.concat(can, [ctx.ACTION, action], args), cb||function(msg) {
				can.user.toastSuccess(can, action)
			}, true)
		},

		search: function(event, cmds, cb) {
			if (cmds && typeof cmds == lang.OBJECT && cmds.length > 0 && typeof cmds[0] == lang.OBJECT && cmds[0].length > 0 ) {
				cmds[0] = cmds[0].join(ice.PT)
			}
			return can.run && can.run(event, [chat._SEARCH].concat(cmds), cb, true)
		},
		get: function(name, key, cb) { return can.search({}, [can.core.Keys(name, chat.ONEXPORT, key)], cb) },
		set: function(name, key, value) { var msg = can.request({}); msg.Option(key, value)
			return can.search(msg, [[name, chat.ONIMPORT, key]])
		},
		setHeaderMenu: function(list, cb) { can._menu && can.page.Remove(can, can._menu)
			var msg = can.request({}, {trans: can.onaction._trans})
			return can._menu = can.search(msg, [["Header", chat.ONIMPORT, "menu"], can._name].concat(list), cb)
		},
		setHeader: function(key, value) { return can.set("Header", key, value) },
		getHeader: function(key, cb) { return can.get("Header", key, cb) },
		setRiver: function(key, value) { return can.set("River", key, value) },
		getAction: function(key, cb) { return can.get("Action", key, cb) },
		getActionSize: function(cb) { return can.get("Action", "size", cb) },

		ConfHeight: function(value) { return can.Conf(html.HEIGHT, value) },
		ConfWidth: function(value) { return can.Conf(html.WIDTH, value) },
		Conf: function(key, value) { var res = can._conf
			for (var i = 0; i < arguments.length; i += 2) {
				if (typeof key == lang.OBJECT) {
					res = can.core.Value(can._conf, arguments[i]), i--
					continue
				}
				res = can.core.Value(can._conf, arguments[i], arguments[i+1])
			}
			if (res == undefined && key.indexOf("feature.") == -1) {
				return can.Conf(can.core.Keys("feature", key))
			}
			return res
		}, _conf: {},
	}; can = can||{}, can.__proto__ = proto

	if (_can_name) { // 加入缓存
		meta.cache[_can_name] = meta.cache[_can_name]||[], meta.cache[_can_name].push(can)
	} else { // 加入队列
		list.push(can)
	}

	if (can._follow) { libs = libs.concat(meta.libs, meta.volcano) }
	if (libs && libs.length > 0) { // 解析参数
		for (var i = 0; i < libs.length; i++) {
			if (libs[i] == undefined) {

			} else if (libs[i] == "") {
				libs[i] = _can_path.replace(html._JS, html._CSS)
			} else if (libs[i][0] != ice.PS && libs[i].indexOf(ice.HTTP) != 0) {
				libs[i] = _can_path.slice(0, _can_path.lastIndexOf(ice.PS)+1)+libs[i]
			}
		}
	}
	return can.require(libs, cb), can
})
function can(tool) {
	Volcanos({panels: [
		{name: "Header", help: "标题栏", pos: html.HIDE, state: [aaa.USERNICK]},
		{name: "Action", help: "工作台", pos: html.MAIN, tool: tool},
		{name: "Search", help: "搜索框", pos: html.AUTO},
	]})
}

try { if (typeof(global) == lang.OBJECT) { // nodejs
	global.kit = kit, global.ice = ice
	global.ctx = ctx, global.cli = cli, global.web = web, global.aaa = aaa
	global.mdb = mdb, global.ssh = ssh, global.nfs = nfs, global.tcp = tcp
	global.code = code, global.wiki = wiki, global.chat = chat, global.team = team, global.mall = mall
	global.svg = svg, global.html = html, global.lang = lang
	global.shy = shy, global.Volcanos = Volcanos

	Volcanos.meta._load = function(url, cb) {
		setTimeout(function() { if (Volcanos.meta.cache[url]) { return cb(Volcanos.meta.cache[url]) }
			switch (url.split("?")[0].split(ice.PT).pop().toLowerCase()) {
				case nfs.JS: require(_can_name = url), cb(Volcanos.meta.cache[url]); break
			}
		}, 100)
	}

	Volcanos.meta._load(global.plugin, function(cache) {
		Volcanos.meta.volcano = "./frame.js", Volcanos({libs: [
			"./lib/base.js", "./lib/core.js", "./lib/misc.js", "./lib/page.js", // "./lib/user.js",
		], panels: [], plugin: []}, function(can) { can.core.List(cache, function(item) { can[item._name] = item })
			Volcanos.meta._load("./publish/client/nodejs/proto.js", function(cache) {
				can.core.List(cache, function(item) { can.base.Copy(can[item._name]||{}, item) })
				can.onimport._init(can, can.request(), function(msg) { console.log(ice.NL) }, null)
			})
		})
	})
} else { // browser
	Volcanos.meta.target = document.body
	Volcanos.meta._load = function(url, cb) {
		switch (url.split("?")[0].split(ice.PT).pop().toLowerCase()) {
			case nfs.CSS:
				var item = document.createElement(mdb.LINK)
				item.rel = "stylesheet", item.type = "text/css"
				item.href = url, item.onload = cb
				return document.head.appendChild(item), item
			case nfs.JS:
				var item = document.createElement(nfs.SCRIPT)
				item.src = url, item.onload = cb, item.onerror = cb
				return document.body.appendChild(item), item
		}
	}
} } catch (e) { console.log(e) }
