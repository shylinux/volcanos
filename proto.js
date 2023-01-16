var kit = {proto: function(sub, sup) { return sub.__proto__ = sup, sub },
	Dict: function() { var res = {}, arg = arguments; for (var i = 0; i < arg.length; i += 2) { var key = arg[i]
		if (typeof key == "object") { i--; for (var k in key) { res[k] = key[k] }
			for (var j = 0; j < key.length; j += 2) { res[key[j]] = key[j+1] }
		} else if (typeof key == "string" && key) { res[key] = arg[i+1] }
	} return res },
}
var ice = {
	TB: "\t", SP: " ", DF: ":", EQ: "=", AT: "@", PS: "/", PT: ".", FS: ",", NL: "\n", LT: "<", GT: ">",
	OK: "ok", TRUE: "true", FALSE: "false", SUCCESS: "success", FAILURE: "failure", PROCESS: "process",

	AUTO: "auto", HTTP: "http", LIST: "list", BACK: "back",
	SHOW: "show", HIDE: "hide", HELP: "help", COPY: "copy",
	VIEW: "view", MODE: "mode", SHIP: "ship", EXEC: "exec",

	DEV: "dev", POD: "pod", CTX: "ctx", CMD: "cmd", ARG: "arg", OPT: "opt",
	CAN: "can", MSG: "msg", RUN: "run", RES: "res", ERR: "err",
	CAN_PLUGIN: "can._plugin",

	MSG_DETAIL: "detail", MSG_OPTION: "option", MSG_APPEND: "append", MSG_RESULT: "result",
	MSG_SESSID: "sessid", MSG_FIELDS: "fields",

	MSG_SOURCE: "_source",
	MSG_TARGET: "_target",
	MSG_HANDLE: "_handle",
	MSG_UPLOAD: "_upload",
	MSG_ACTION: "_action",
	MSG_STATUS: "_status",
	MSG_PREFIX: "_prefix",

	MSG_DISPLAY: "_display",
	MSG_TOOLKIT: "_toolkit",
	MSG_PROCESS: "_process",
	PROCESS_AGAIN: "_again",

	MSG_TITLE: "sess.title", MSG_TOPIC: "sess.topic", MSG_RIVER: "sess.river", MSG_STORM: "sess.storm", MSG_WIDTH: "sess.width", MSG_HEIGHT: "sess.height",
	MSG_DAEMON: "sess.daemon",
	MSG_USERNAME: "user.name", MSG_USERNICK: "user.nick",
	LOG_DISABLE: "log.disable",
	
	ErrWarn: "warn: ", ErrNotLogin: "not login: ", ErrNotRight: "not right: ", ErrNotFound: "not found: ", ErrNotValid: "not valid: ",
	
	USR_ICEBERGS: "usr/icebergs/",
	USR_VOLCANOS: "usr/volcanos/",
	LIB_MISC: "lib/misc.js",
	LIB_PAGE: "lib/page.js",
	REQUIRE: "require",
}

var ctx = {
	CONTEXT: "context", COMMAND: "command", CONFIG: "config", INPUTS: "inputs", FEATURE: "feature",
	INDEX: "index", ARGS: "args", STYLE: "style", DISPLAY: "display", ACTION: "action",
	EXTRA_INDEX: "extra.index", EXTRA_ARGS: "extra.args",
}
var mdb = {
	DICT: "dict", META: "meta", HASH: "hash", LIST: "list",

	ID: "id", KEY: "key", TIME: "time", ZONE: "zone", TYPE: "type", NAME: "name", TEXT: "text", LINK: "link", SCAN: "scan", HELP: "help",
	SHORT: "short", FIELD: "field", TOTAL: "total", COUNT: "count", LIMIT: "limit",
	INDEX: "index", VALUE: "value", EXTRA: "extra", ALIAS: "alias", EXPIRE: "expire",

	CREATE: "create", REMOVE: "remove", INSERT: "insert", DELETE: "delete", MODIFY: "modify", SELECT: "select",
	INPUTS: "inputs", PRUNES: "prunes", EXPORT: "export", IMPORT: "import",
	SEARCH: "search", ENGINE: "engine", RENDER: "render", PLUGIN: "plugin",
	REVERT: "revert",
	NORMAL: "normal",

	MAIN: "main", PAGE: "page", NEXT: "next", PREV: "prev", LIMIT: "limit", OFFEND: "offend",
	FOREACH: "*", RANDOMS: "%",
}
var web = {
	SHARE: "share", SPACE: "space", DREAM: "dream",
	WEBSITE: "website", DRAW: "draw", CLEAR: "clear", REFRESH: "refresh", RESIZE: "resize", FILTER: "filter",
	CANCEL: "cancel", SUBMIT: "submit", UPLOAD: "upload", DOWNLOAD: "download", TOIMAGE: "toimage",
	SHARE_CACHE: "/share/cache/", SHARE_LOCAL: "/share/local/",

	GET: "GET", PUT: "PUT", POST: "POST", DELETE: "DELETE",
	Accept: "Accept", ContentType: "Content-Type", ContentJSON: "application/json", ContentFORM: "application/x-www-form-urlencoded",
	VIDEO_WEBM: "video/webm",
	
	CODE_INNER: "web.code.inner", WIKI_WORD: "web.wiki.word",
}
var aaa = {
	LOGIN: "login", LOGOUT: "logout", INVITE: "invite", TOKEN: "token",
	PASSWORD: "password", USERNAME: "username", USERNICK: "usernick", BACKGROUND: "background", AVATAR: "avatar",
	LANGUAGE: "language", ENGLISH: "english", CHINESE: "chinese",
	VOID: "void", TECH: "tech",
}
var lex = {
	SPLIT: "split", PREFIX: "prefix", SUFFIX: "suffix",
}
var yac = {
}
var ssh = {
}
var gdb = {
	SIGNAL: "signal",
}
var tcp = {
	HOST: "host", PORT: "port",
}
var nfs = {
	PATH: "path", FILE: "file", LINE: "line", SIZE: "size", ROOT: "root",
	COPY: "copy", EDIT: "edit", SAVE: "save", LOAD: "load", FIND: "find", GREP: "grep", TAGS: "tags",
	DIR: "dir", CAT: "cat", DEFS: "defs", TRASH: "trash", DIR_ROOT: "dir_root", PWD: "./",
	CONTENT: "content", SOURCE: "source", SCRIPT: "script", MODULE: "module", RECENT: "recent",
	HTML: "html", CSS: "css", JS: "js", GO: "go", SH: "sh", CSV: "csv", JSON: "json",
	ZML: "zml", IML: "iml", TXT: "txt", PNG: "png", WEBM: "webm",
	_CSS: ".css", _JS: ".js",
	REPOS: "repos", REPLACE: "replace", FROM: "from", TO: "to",
}
var cli = {
	PWD: "pwd", SYSTEM: "system", DAEMON: "daemon", ORDER: "order", BUILD: "build",
	BEGIN: "begin", START: "start", OPEN: "open", CLOSE: "close", STOP: "stop", END: "end", RESTART: "restart",
	COLOR: "color", WHITE: "white", BLACK: "black", RED: "red", GREEN: "green", BLUE: "blue",
	YELLOW: "yellow", CYAN: "cyan", PURPLE: "purple", MAGENTA: "magenta", GLASS: "transparent",
	MAKE: "make", MAIN: "main", EXEC: "exec", DONE: "done", COST: "cost", FROM: "from", CLEAR: "clear",
}
var log = {
	INFO: "info", WARN: "warn", ERROR: "error", DEBUG: "debug", TRACE: "trace",
}

var code = {
	FAVOR: "favor", XTERM: "xterm", INNER: "inner", VIMER: "vimer",
	WEBPACK: "webpack", BINPACK: "binpack", AUTOGEN: "autogen", COMPILE: "compile", PUBLISH: "publish",
	COMMENT: "comment", KEYWORD: "keyword", PACKAGE: "package", DATATYPE: "datatype", FUNCTION: "function", CONSTANT: "constant", STRING: "string", OBJECT: "object",
	TEMPLATE: "template", COMPLETE: "complete", NAVIGATE: "navigate", CURRENT: "current",
}
var wiki = {
	TITLE: "title", BRIEF: "brief", REFER: "refer", SPARK: "spark", SHELL: "shell",
	ORDER: "order", TABLE: "table", CHART: "chart", IMAGE: "image", VIDEO: "video",
	FIELD: "field", LOCAL: "local", PARSE: "parse",
	NAVMENU: "navmenu", PREMENU: "premenu", CONTENT: "content",
	STORY_ITEM: ".story", H2: "h2.story", H3: "h3.story",
}
var chat = {
	LIB: "lib", PAGE: "page", PANEL: "panel", PLUGIN: "plugin", STORY: "story", PLUG: "plug",
	TOAST: "toast", CARTE: "carte", INPUT: "input", UPLOAD: "upload", CONTEXTS: "contexts",
	LAYOUT: "layout", PROJECT: "project", CONTENT: "content", DISPLAY: "display", PROFILE: "profile", ACTIONS: "actions",
	TITLE: "title", TOPIC: "topic", BLACK: "black", WHITE: "white", PRINT: "print", LIGHT: "light", DARK: "dark",
	SHARE: "share", RIVER: "river", STORM: "storm", FIELD: "field", TOOL: "tool",
	STATE: "state", MENUS: "menus", SSO: "sso", LOCATION: "location", IFRAME: "iframe",
	OUTPUT: "output", SIMPLE: "simple", FLOAT: "float", FULL: "full", CMD: "cmd",

	HEADER: "Header", ACTION: "Action", FOOTER: "Footer",
	libs: ["/lib/base.js", "/lib/core.js", "/lib/date.js", "/lib/misc.js", "/lib/page.js", "/lib/user.js"],
	panel_list: [{name: "Header", pos: "head"}, {name: "River",  pos: "left"}, {name: "Action", pos: "main"}, {name: "Search", pos: "auto"}, {name: "Footer", pos: "foot"}],
	plugin_list: [
		"/plugin/state.js",
		"/plugin/input.js",
		"/plugin/table.js",
		"/plugin/input/key.js",
		"/plugin/input/date.js",
		"/plugin/story/spide.js",
		"/plugin/story/trend.js",
		"/plugin/local/code/xterm.js",
		"/plugin/local/code/vimer.js",
		"/plugin/local/code/inner.js",
		"/plugin/local/code/inner/syntax.js",
		"/plugin/local/wiki/draw/path.js",
		"/plugin/local/wiki/draw.js",
		"/plugin/local/wiki/word.js",
		"/plugin/local/team/plan.js",
		"/plugin/local/mall/goods.js",
	], PLUGIN_INPUT: "/plugin/input/", PLUGIN_STORY: "/plugin/story/", PLUGIN_LOCAL: "/plugin/local/",
	PLUGIN_STATE_JS: "/plugin/state.js", PLUGIN_INPUT_JS: "/plugin/input.js", PLUGIN_TABLE_JS: "/plugin/table.js",
	ONENGINE: "onengine", ONDAEMON: "ondaemon", ONAPPEND: "onappend", ONLAYOUT: "onlayout", ONMOTION: "onmotion", ONKEYMAP: "onkeymap",
	ONIMPORT: "onimport", ONSYNTAX: "onsyntax", ONFIGURE: "onfigure", ONACTION: "onaction", ONDETAIL: "ondetail", ONEXPORT: "onexport", ONPLUGIN: "onplugin",
	
	ONMAIN: "onmain", ONLOGIN: "onlogin", ONREMOTE: "onremote", ONSEARCH: "onsearch",
	ONSIZE: "onsize", ONTOAST: "ontoast", ONDEBUG: "ondebug", ONSHARE: "onshare", ONPRINT: "onprint",
	ONRESIZE: "onresize", ONKEYUP: "onkeyup", ONKEYDOWN: "onkeydown", ONMOUSEENTER: "onmouseenter", ORIENTATIONCHANGE: "orientationchange",
	ONSTORM_SELECT: "onstorm_select", ONACTION_NOTOOL: "onaction_notool", ONACTION_TOUCH: "onaction_touch", ONACTION_CMD: "onaction_cmd",
	ONOPENSEARCH: "onopensearch", ONSEARCH_FOCUS: "onsearch_focus", ONCOMMAND_FOCUS: "oncommand_focus",

	_INIT: "_init", _TRANS: "_trans", _STYLE: "_style", _ENGINE: "_engine", _SEARCH: "_search", _OUTPUTS_CURRENT: "_outputs.-1", _NAMES: "_names", _TOAST: "_toast",
}
var team = {
	TASK: "task", PLAN: "plan",
	BEGIN_TIME: "begin_time",
	LONG: "long", YEAR: "year", MONTH: "month", WEEK: "week", DAY: "day", HOUR: "hour",
	TASK_POD: "task.pod", TASK_ZONE: "task.zone", TASK_ID: "task.id",
}
var mall = {
	COUNT: "count", PRICE: "price",
	ASSET: "asset", SALARY: "salary",
}

var svg = {
	GROUP: "group", PID: "pid", GRID: "grid",
	FIGURE: "figure", DATA: "data", SHIP: "ship", TRANS: "trans",
	GO: "go",
	SHAPE: "shape", TEXT: "text", RECT: "rect", LINE: "line", CIRCLE: "circle", ELLIPSE: "ellipse", BLOCK: "block",
	STROKE_WIDTH: "stroke-width", STROKE: "stroke", FILL: "fill", FONT_SIZE: "font-size", FONT_FAMILY: "font-family", MONOSPACE: "monospace", TEXT_ANCHOR: "text-anchor",
	G: "g", X: "x", Y: "y", R: "r", RX: "rx", RY: "ry", CX: "cx", CY: "cy", X1: "x1", Y1: "y1", X2: "x2", Y2: "y2",
	PATH: "path", PATH2V: "path2v", PATH2H: "path2h",
	M: "M", Q: "Q", T: "T",
	TEXT_LENGTH: "textLength",
}
var html = {PLUGIN_MARGIN: 10, ACTION_HEIGHT: 31, ACTION_MARGIN: 200,
	FIELDSET: "fieldset", LEGEND: "legend", OPTION: "option", ACTION: "action", OUTPUT: "output", STATUS: "status",
	FORM_OPTION: "form.option", DIV_ACTION: "div.action", DIV_OUTPUT: "div.output", DIV_STATUS: "div.status",
	FIELDSET_PANEL: "fieldset.panel", FIELDSET_PLUGIN: "fieldset.plugin", FIELDSET_STORY: "fieldset.story", FIELDSET_INPUT: "fieldset.input", FIELDSET_FLOAT: "fieldset.float",
	FIELDSET_HEAD: "fieldset.head", FIELDSET_FOOT: "fieldset.foot", FIELDSET_LEFT: "fieldset.left", FIELDSET_MAIN: "fieldset.main",
	OPTION_ARGS: "select.args,input.args,textarea.args", INPUT_ARGS: "input.args,textarea.args", INPUT_BUTTON: "input[type=button]", INPUT_FILE: "input[type=file]",
	BODY: "body", FORM: "form", SELECT: "select", INPUT: "input", TEXT: "text", FILE: "file", BUTTON: "button", TEXTAREA: "textarea",
	CLICK: "click", CANCEL: "cancel", SUBMIT: "submit", UPLOAD: "upload", USERNAME: "username", PASSWORD: "password",
	TABLE: "table", THEAD: "thead", TBODY: "tbody", TR: "tr", TH: "th", TD: "td", BR: "br", UL: "ul", LI: "li", BR: "br", HR: "hr",
	H1: "h1", H2: "h2", H3: "h3", A: "a", LABEL: "label", INNER: "inner", TITLE: "title",
	SPAN: "span", CODE: "code", DIV: "div", IMG: "img", VIDEO: "video", WSS: "wss", SVG: "svg", CANVAS: "canvas", IFRAME: "iframe",
	WEBVIEW: "webview", CHROME: "chrome", MOBILE: "mobile", LANDSCAPE: "landscape",

	CLASS: "class", DISPLAY: "display", BLOCK: "block", NONE: "none", OVERFLOW: "overflow", HIDDEN: "hidden", SCROLL: "scroll", FLOAT: "float", CLEAR: "clear", BOTH: "both",
	PADDING: "padding", BORDER: "border", MARGIN: "margin", MARGIN_TOP: "margin-top", MARGIN_X: "margin-x", MARGIN_Y: "margin-y",
	HEIGHT: "height", WIDTH: "width", MIN_HEIGHT: "min-height", MAX_HEIGHT: "max-height", MIN_WIDTH: "min-width", MAX_WIDTH: "max-width", LEFT: "left", TOP: "top", RIGHT: "right", BOTTOM: "bottom",
	BACKGROUND_COLOR: "background-color", COLOR: "color", OPACITY: "opacity", TOGGLE: "toggle", SPEED: "speed", SIZE: "size",
	HOVER: "hover", HOVER_SELECT: "hover,select",
	LIGHT: "light", DARK: "dark",

	PAGE: "page", TABS: "tabs", MENU: "menu", NODE: "node",
	ZONE: "zone", LIST: "list", ITEM: "item", NAME: "name", ICON: "icon",
	HEAD: "head", LEFT: "left", MAIN: "main", FOOT: "foot", AUTO: "auto", SHOW: "show", HIDE: "hide",
	PLUGIN: "plugin", LAYOUT: "layout", PROJECT: "project", DISPLAY: "display", PROFILE: "profile", CONTENT: "content",

	DIV_PAGE: "div.page", DIV_TABS: "div.tabs", DIV_PATH: "div.path", DIV_CODE: "div.code",
	DIV_ZONE: "div.zone", DIV_LIST: "div.list", DIV_ITEM: "div.item", DIV_NAME: "div.name",
	DIV_CONTENT: "div.content", TABLE_CONTENT: "table.content", TABLE_LAYOUT: "table.layout", DIV_TOGGLE: "div.toggle",
	DIV_LAYOUT_HEAD: "div.layout.head", DIV_LAYOUT_FOOT: "div.layout.foot", DIV_LAYOUT_LEFT: "div.layout.left",
	DIV_FLOAT: "div.float", DIV_TOAST: "div.toast", DIV_CARTE: "div.carte",
}
var lang = {
	SPACE: "space", UNDEFINED: "undefined", STRING: "string", NUMBER: "number", BOOLEAN: "boolean", FUNCTION: "function", OBJECT: "object", ARRAY: "array",
	META: "Meta", ALT: "Alt", CONTROL: "Control", SHIFT: "Shift", TAB: "Tab", ESCAPE: "Escape", ENTER: "Enter",
	CMD: "Cmd", CTRL: "Ctrl", SPACE: "Space", BACKSPACE: "Backspace", ESC: "Esc", PS: "/",
}

function shy(help, meta, list, cb) { var arg = arguments, i = 0; function next(type) {
		if (type == lang.OBJECT) { if (typeof arg[i] == lang.OBJECT && arg[i].length == undefined) { return arg[i++] }
		} else if (type == lang.ARRAY) { if (typeof arg[i] == lang.OBJECT && arg[i].length != undefined) { return arg[i++] }
		} else if (i < arg.length && (!type || type == typeof arg[i])) { return arg[i++] }
	} return cb = typeof arg[arg.length-1] == lang.FUNCTION? arg[arg.length-1]: function() {}, cb.help = next(lang.STRING)||"", cb.meta = next(lang.OBJECT)||{}, cb.list = next(lang.ARRAY)||[], cb
}; var _can_name = "", _can_path = ""
var Volcanos = shy({version: window._version||"", iceberg: "/chat/", volcano: "/frame.js", cache: {}, pack: {}, args: {}}, function(name, can, libs, cb) {
	var meta = arguments.callee.meta, list = arguments.callee.list; if (typeof name == lang.OBJECT) {
		if (name.length > 0) { return Volcanos({panels: [{name: chat.HEADER, pos: html.HIDE, state: [mdb.TIME, aaa.USERNICK]}, {name: chat.ACTION, pos: html.MAIN, tool: name}, {name: chat.FOOTER, pos: html.HIDE}]}) }
		var Config = name; name = Config.name||ice.CAN, _can_name = "", _can_path = ""
		meta.iceberg = Config.iceberg||meta.iceberg, meta.libs = Config.libs||chat.libs, panels = Config.panels||chat.panel_list
		libs = [], panels.forEach(function(p) { p && (libs = libs.concat(p.list = p.list||["/panel/"+p.name+nfs._JS, "/panel/"+p.name+nfs._CSS])) }), libs = libs.concat(Config.plugin||chat.plugin_list)
		cb = can||function(can) { can.onengine._init(can, can.Conf(Config), panels, Config._init||meta._init, can._target) }
		can = Config, can._follow = name, can._target = Config.target||meta.target, can._height = Config.height||meta._height, can._width = Config.width||meta._width
	}
	can = kit.proto(can||{}, kit.proto({_path: _can_path, _name: name, _load: function(name, cbs) { var cache = meta.cache[name]||[]
			for (list.reverse(); list.length > 0; list) { var sub = list.pop(); sub != can && cache.push(sub), sub._path = name } meta.cache[name] = cache
			cache.forEach(function(sub) { var name = sub._name; if (typeof cbs == lang.FUNCTION && cbs(can, name, sub)) { return }
				can[name] = can[name]||{}; for (var k in sub) {
					name == chat.ONIMPORT && k == chat._INIT && (can[name]._last_init = sub[k])
					can[name].hasOwnProperty(k) || sub.hasOwnProperty(k) && (can[name][k] = sub[k])
				}
			})
		},
		requireModules: function(libs, cb, cbs) {
			for (var i = 0; i < libs.length; i++) { if (libs[i].indexOf(ice.PS) == 0 || libs[i].indexOf(ice.HTTP) == 0) { continue }
				if (libs[i].indexOf(nfs._CSS) == -1 && libs[i].indexOf(nfs._JS) == -1) { libs[i] = libs[i]+"/lib/"+libs[i]+nfs._JS }
				libs[i] = "/require/node_modules/"+libs[i]
			} can.require(libs, cb, cbs)
		},
		requireDraw: function(cb) { can.page.ClassList.add(can, can._fields, "draw")
			can.require(["/plugin/local/wiki/draw.js", "/plugin/local/wiki/draw/path.js"], function() {
				can.onmotion.clear(can), can.onimport._show(can, can._msg), cb()
			})
		},
		require: function(libs, cb, cbs) {
			if (!libs || libs.length == 0) { return typeof cb == lang.FUNCTION && setTimeout(function() { cb(can) }, 10) }
			if (libs[0] == undefined) { return can.require(libs.slice(1), cb, cbs) }
			if (libs[0] == "") { libs[0] = can._path.replace(nfs._JS, nfs._CSS) }
			if (libs[0][0] != ice.PS && libs[0].indexOf(ice.HTTP) != 0) { libs[0] = can._path.slice(0, can._path.lastIndexOf(ice.PS)+1)+libs[0] }
			var name = (libs[0].indexOf(ice.HTTP) == 0? libs[0]: libs[0].split("?")[0]).toLowerCase(); meta.debug == true && (name += "?_="+Date.now())
			function next() { can._load(name, cbs), can.require(libs.slice(1), cb, cbs) }
			meta.cache[name]? next(): (_can_path = libs[0], meta._load(name, next))
		},
		request: function(event) { event = event||{}, event = event._event||event
			var msg = event._msg||can.misc.Message(event, can); event._msg = msg
			function set(key, value) { value == "" || msg.Option(key) || msg.Option(key, value) }
			can.core.List(arguments, function(item, index) { if (!item || index == 0) { return } 
				can.base.isFunc(item.Option)? can.core.List(item.Option(), function(key) {
					key.indexOf("_") == 0 || key.indexOf("user.") == 0 || set(key, item.Option(key))
				}): can.core.Item(can.base.isFunc(item)? item(): item, set)
			});
			set(ice.MSG_HEIGHT, can.ConfHeight()), set(ice.MSG_WIDTH, can.ConfWidth())
			return msg
		},

		runActionInputs: function(event, cmds, cb) { var msg = can.request(event), meta = can.Conf()
			if (msg.Option(ice.MSG_HANDLE) != ice.TRUE && cmds && cmds[0] == ctx.ACTION && meta.feature[cmds[1]]) { var msg = can.request(event, {action: cmds[1]})
				if (can.base.isFunc(meta.feature[cmds[1]])) { return meta.feature[cmds[1]](can, msg, cmds.slice(2)) }
				return can.user.input(event, can, meta.feature[cmds[1]], function(args) { can.Update(can.request(event, {_handle: ice.TRUE}, can.Option()), cmds.slice(0, 2).concat(args)) })
			}
			can.runAction(event, cmds[1], cmds.slice(2), cb, true)
		},
		runActionCommand: function(event, index, args, cb) { can.runAction(event, ice.RUN, can.misc.concat(can, [index], args), cb, true) },
		runAction: function(event, action, args, cb, silent) { can.request(event, {_handle: ice.TRUE}, can.Option())
			can.run(event, can.misc.concat(can, [ctx.ACTION].concat(action), args), cb, silent)
		},

		search: function(event, cmds, cb) {
			if (cmds && typeof cmds == lang.OBJECT && cmds.length > 0 && typeof cmds[0] == lang.OBJECT && cmds[0].length > 0 ) { cmds[0] = cmds[0].join(ice.PT) }
			return can.run && can.run(event, [chat._SEARCH].concat(cmds), cb, true)
		},
		get: function(name, key, cb) { var value; can.search({}, [can.core.Keys(name, chat.ONEXPORT, key)], cb||function(msg) { value = msg.Result() }); return value },
		set: function(name, key, value) { var msg = can.request(); msg.Option(key, value); return can.search(msg, [[name, chat.ONIMPORT, key]]) },
		setHeaderMenu: function(list, cb) { can._menu && can.page.Remove(can, can._menu)
			return can._menu = can.search(can.request({}, {trans: can.onaction._trans}), [[chat.HEADER, chat.ONIMPORT, html  .MENU], can._name].concat(list), cb)
		},
		getHeaderTopic: function(cb) { return can.get(chat.HEADER, chat.TOPIC, cb) },
		getHeader: function(key, cb) { return can.get(chat.HEADER, key, cb) },
		setHeader: function(key, value) { return can.set(chat.HEADER, key, value) },
		setAction: function(key, value) { return can.set(chat.ACTION, key, value) },
		getAction: function(key, cb) { return can.get(chat.ACTION, key, cb) },
		getActionSize: function(cb) { return can.get(chat.ACTION, nfs.SIZE, cb) },

		isStoryType: function(value) { return can.page.ClassList.has(can, can._fields, chat.STORY) },
		isSimpleMode: function(value) { return can.Mode() == chat.SIMPLE },
		isOutputMode: function(value) { return can.Mode() == chat.OUTPUT },
		isFloatMode: function(value) { return can.Mode() == chat.FLOAT },
		isFullMode: function(value) { return can.Mode() == chat.FULL },
		isCmdMode: function(value) { return can.Mode() == chat.CMD },
		isAutoMode: function(value) { return can.Mode() == "" },
		Mode: function(value) { return can.Conf(ice.MODE, value) },
		ConfDefault: function(value) { can.core.Item(value, function(k, v) { can.Conf(k) || can.Conf(k, v) }) },
		ConfHeight: function(value) { return can.Conf(html.HEIGHT, value) },
		ConfWidth: function(value) { return can.Conf(html.WIDTH, value) },
		Conf: function(key, value) { var res = can._conf
			for (var i = 0; i < arguments.length; i += 2) {
				if (typeof key == lang.OBJECT) { res = can.core.Value(can._conf, arguments[i]), i--; continue }
				res = can.core.Value(can._conf, arguments[i], arguments[i+1])
			} return can.base.isUndefined(res) && key.indexOf(ctx.FEATURE+ice.PT) == -1? can.Conf(can.core.Keys(ctx.FEATURE, key)): res
		}, _conf: {},
	}, meta)); if (_can_name) { meta.cache[_can_name] = meta.cache[_can_name]||[], meta.cache[_can_name].push(can) } else { list.push(can) }
	return can.require(can._follow? libs.concat(meta.libs, meta.volcano): libs, cb), can
})
try { if (typeof(window) == lang.OBJECT) { // chrome
	Volcanos.meta.target = document.body, Volcanos.meta._height = window.innerHeight, Volcanos.meta._width = window.innerWidth
	Volcanos.meta._load = function(url, cb) { switch (url.split("?")[0].split(ice.PT).pop().toLowerCase()) {
		case nfs.CSS: var item = document.createElement(mdb.LINK); item.href = url+Volcanos.meta.version, item.rel = "stylesheet", item.onload = cb, document.head.appendChild(item); break
		case nfs.JS: var item = document.createElement(nfs.SCRIPT); item.src = url+Volcanos.meta.version, item.onerror = cb, item.onload = cb, document.body.appendChild(item); break
	} }
	Volcanos.meta._init = function(can) {
		var last = can.page.width() < can.page.height(); window.onresize = function(event) {
			if (can.user.isMobile && last === can.page.width() < can.page.height()) { return } last = can.page.width() < can.page.height()
			can.onengine.signal(can, chat.ONRESIZE, can.request(event, kit.Dict(html.HEIGHT, window.innerHeight, html.WIDTH, window.innerWidth)))
		}
	}
} else { // nodejs
	global.kit = kit, global.ice = ice
	global.ctx = ctx, global.cli = cli, global.aaa = aaa, global.web = web
	global.mdb = mdb, global.ssh = ssh, global.nfs = nfs, global.tcp = tcp
	global.code = code, global.wiki = wiki, global.chat = chat, global.team = team, global.mall = mall
	global.svg = svg, global.html = html, global.lang = lang
	global.shy = shy, global.Volcanos = Volcanos
} } catch (e) { console.log(e) }
