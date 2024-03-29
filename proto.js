var kit = {proto: function(sub, sup) { return sub.__proto__ = sup, sub },
	Dict: function() { var res = {}, arg = arguments; for (var i = 0; i < arg.length; i += 2) { var key = arg[i]
		if (typeof key == "object") { i--;
			if (key.length == undefined) {
				for (var k in key) { res[k] = key[k] }
			} else {
				for (var j = 0; j < key.length; j += 2) { res[key[j]] = key[j+1] }
			}
		} else if (typeof key == "string" && key) { res[key] = arg[i+1] }
	} return res },
}
var ice = {
	TB: "\t", SP: " ", DF: ":", EQ: "=", AT: "@", PS: "/", PT: ".", FS: ",", QS: "?", NL: "\n", LT: "<", GT: ">",
	OK: "ok", TRUE: "true", FALSE: "false", SUCCESS: "success", FAILURE: "failure", PROCESS: "process",

	HTTP: "http", HTML: "html",
	HOME: "home", MAIN: "main",
	LIST: "list", BACK: "back",
	SHOW: "show", HIDE: "hide",
	VIEW: "view", MODE: "mode",
	COPY: "copy", HELP: "help",
	AUTO: "auto", EXEC: "exec",
	SHIP: "ship",

	DEV: "dev", POD: "pod", CTX: "ctx", CMD: "cmd", ARG: "arg", OPT: "opt",
	CAN: "can", MSG: "msg", RUN: "run", RES: "res", ERR: "err",

	MSG_DETAIL: "detail", MSG_OPTION: "option", MSG_APPEND: "append", MSG_RESULT: "result",
	MSG_SESSID: "sessid", MSG_FIELDS: "fields",

	MSG_SOURCE: "_source", MSG_TARGET: "_target",
	MSG_HANDLE: "_handle", MSG_UPLOAD: "_upload",
	MSG_ACTION: "_action", MSG_STATUS: "_status",

	MSG_INDEX: "_index",
	MSG_DISPLAY: "_display",
	MSG_TOOLKIT: "_toolkit",
	MSG_PROCESS: "_process",
	PROCESS_AGAIN: "_again",
	PROCESS_FIELD: "_field",
	PROCESS_REWRITE: "_rewrite",
	MSG_PREFIX: "_prefix",

	MSG_USERNICK: "user.nick", MSG_USERNAME: "user.name", MSG_USERROLE: "user.role", MSG_LANGUAGE: "user.lang",
	MSG_TITLE: "sess.title", MSG_THEME: "sess.theme", MSG_RIVER: "sess.river", MSG_STORM: "sess.storm",
	MSG_HEIGHT: "sess.height", MSG_WIDTH: "sess.width", MSG_MODE: "sess.mode", MSG_DAEMON: "sess.daemon",
	LOG_DISABLE: "log.disable",
	
	ErrWarn: "warn: ", ErrNotLogin: "not login: ", ErrNotRight: "not right: ", ErrNotFound: "not found: ", ErrNotValid: "not valid: ",
	CAN_PLUGIN: "can._plugin", CAN_DEBUG: "can.debug", LOG_DEBUG: "log.debug",
	NFS: "nfs", USR: "usr", USR_VOLCANOS: "usr/volcanos/",
}

var ctx = {
	CONTEXT: "context", COMMAND: "command", CONFIG: "config", INPUTS: "inputs", FEATURE: "feature",
	INDEX: "index", ARGS: "args", STYLE: "style", DISPLAY: "display", ACTION: "action",
	EXTRA_INDEX: "extra.index", EXTRA_ARGS: "extra.args",
	RUN: "run",
}
var mdb = {
	DICT: "dict", META: "meta", HASH: "hash", LIST: "list",
	ID: "id", KEY: "key", TIME: "time", ZONE: "zone", TYPE: "type", NAME: "name", TEXT: "text",
	DATA: "data", VIEW: "view", ICON: "icon", LINK: "link", SCAN: "scan", HELP: "help",
	SHORT: "short", FIELD: "field", TOTAL: "total", COUNT: "count", LIMIT: "limit",
	INDEX: "index", VALUE: "value", EXTRA: "extra", ALIAS: "alias", EXPIRE: "expire",

	CREATE: "create", REMOVE: "remove", INSERT: "insert", DELETE: "delete", MODIFY: "modify", SELECT: "select",
	INPUTS: "inputs", PRUNES: "prunes", EXPORT: "export", IMPORT: "import", REVERT: "revert", NORMAL: "normal",
	SEARCH: "search", ENGINE: "engine", RENDER: "render", PLUGIN: "plugin",
	DETAIL: "detail",
	PRUNE: "prune",

	KEYS: "keys",
	MAIN: "main", PAGE: "page", NEXT: "next", PREV: "prev", LIMIT: "limit", OFFEND: "offend",
	FOREACH: "*", RANDOMS: "%",
	QS: ice.QS, AT: ice.AT,
	EQ: ice.EQ, FS: ice.FS,
}
var web = {CHAT: "chat",
	DREAM: "dream", SPACE: "space", ROUTE: "route", SPIDE: "spide", COUNT: "count", SHARE: "share",
	WEBSITE: "website", DRAW: "draw", PLAY: "play", CLEAR: "clear", REFRESH: "refresh", RESIZE: "resize", FILTER: "filter", INPUT: "input",
	CANCEL: "cancel", SUBMIT: "submit", UPLOAD: "upload", DOWNLOAD: "download", TOIMAGE: "toimage",
	SHARE_CACHE: "/share/cache/", SHARE_LOCAL: "/share/local/",
	WORKER: "worker", SERVER: "server", GATEWAY: "gateway",

	AT: "@", QS: "?", LINK: "link", HTTP: "http",
	GET: "GET", PUT: "PUT", POST: "POST", DELETE: "DELETE",
	Accept: "Accept", ContentType: "Content-Type", ContentJSON: "application/json", ContentFORM: "application/x-www-form-urlencoded",
	IMAGE_PNG: "image/png", VIDEO_WEBM: "video/webm",
	
	CODE_GIT_STATUS: "web.code.git.status",
	CODE_GIT_REPOS: "web.code.git.repos",
	CODE_COMPILE: "web.code.compile",
	CODE_VIMER: "web.code.vimer",
	CODE_INNER: "web.code.inner",
	CODE_XTERM: "web.code.xterm",
	WIKI_WORD: "web.wiki.word",
	WIKI_DRAW: "web.wiki.draw",
	WIKI_PORTAL: "web.wiki.portal",
	CHAT_MACOS_DESKTOP: "web.chat.macos.desktop",
	CHAT_MACOS_SESSION: "web.chat.macos.session",
	CHAT_IFRAME: "web.chat.iframe",
	CHAT_FAVOR: "web.chat.favor",
	CHAT_FLOWS: "web.chat.flows",
	TEAM_PLAN: "web.team.plan",
}
var aaa = {
	USER: "user",
	LOGIN: "login", LOGOUT: "logout", INVITE: "invite", TOKEN: "token",
	USERNICK: "usernick", USERNAME: "username", PASSWORD: "password", USERROLE: "userrole", BACKGROUND: "background", AVATAR: "avatar",
	LANGUAGE: "language", ENGLISH: "english", CHINESE: "chinese",
	VOID: "void", TECH: "tech", ROOT: "root",
}
var lex = {
	SPLIT: "split", PREFIX: "prefix", SUFFIX: "suffix",
	PARSE: "parse",
	TB: ice.TB, SP: ice.SP, NL: ice.NL,
}
var yac = {
	STASK: "stack",
}
var ssh = {
	SHELL: "shell",
}
var gdb = {
	SIGNAL: "signal",
}
var tcp = {
	HOST: "host", PORT: "port",
}
var nfs = {
	DIR: "dir", CAT: "cat", DEFS: "defs", PACK: "pack", TRASH: "trash", DIR_ROOT: "dir_root",
	COPY: "copy", EDIT: "edit", SAVE: "save", LOAD: "load", FIND: "find", GREP: "grep", TAGS: "tags",
	CONTENT: "content", RECENT: "recent", SCRIPT: "script", MODULE: "module", SOURCE: "source", TARGET: "target", REPOS: "repos", MASTER: "master",
	PATH: "path", FILE: "file", LINE: "line", SIZE: "size",
	REPLACE: "replace", FROM: "from", TO: "to",
	SVG: "svg", HTML: "html", CSS: "css", JS: "js", SH: "sh", GO: "go", CSV: "csv", JSON: "json", SHY: "shy",
	TXT: "txt", PNG: "png", WEBM: "webm",
	_CSS: ".css", _JS: ".js",
	PWD: "./", SRC: "src/", USR: "usr/", USR_LOCAL_WORK: "usr/local/work/", SRC_DOCUMENT: "src/document/",
	DF: ice.DF, PS: ice.PS, PT: ice.PT,
}
var cli = {
	OPENS: "opens", SYSTEM: "system", DAEMON: "daemon", ORDER: "order", BUILD: "build",
	BEGIN: "begin", START: "start", OPEN: "open", CLOSE: "close", STOP: "stop", END: "end", RESTART: "restart",
	COLOR: "color", BLACK: "black", WHITE: "white", BLUE: "blue", RED: "red", GRAY: "gray", CYAN: "cyan", GREEN: "green", PURPLE: "purple", YELLOW: "yellow",
	MAGENTA: "magenta", SILVER: "silver", ALICEBLUE: "aliceblue", TRANSPARENT: "transparent",
	MAKE: "make", EXEC: "exec", DONE: "done", COST: "cost", FROM: "from", CLEAR: "clear",
	LINUX: "linux", DARWIN: "darwin", WINDOWS: "windows",
	PWD: "pwd",
}
var log = {
	INFO: "info", WARN: "warn", ERROR: "error", DEBUG: "debug", TRACE: "trace",
}

var code = {
	FAVOR: "favor", XTERM: "xterm", INNER: "inner", VIMER: "vimer",
	WEBPACK: "webpack", BINPACK: "binpack", AUTOGEN: "autogen", COMPILE: "compile", PUBLISH: "publish",
	TEMPLATE: "template", COMPLETE: "complete", NAVIGATE: "navigate", CURRENT: "current",
	PULL: "pull", PUSH: "push",
	COMMENT: "comment", KEYWORD: "keyword",
	PACKAGE: "package", DATATYPE: "datatype", FUNCTION: "function", CONSTANT: "constant",
	STRING: "string", NUMBER: "number", BOOLEAN: "boolean", OBJECT: "object", ARRAY: "array", UNDEFINED: "undefined",

	META: "Meta", ALT: "Alt", CONTROL: "Control", SHIFT: "Shift", TAB: "Tab", ESCAPE: "Escape", ENTER: "Enter",
	CMD: "Cmd", CTRL: "Ctrl", SPACE: "Space", BACKSPACE: "Backspace", ESC: "Esc", PS: "/",
}
var wiki = {
	TITLE: "title", BRIEF: "brief", REFER: "refer", SPARK: "spark", SHELL: "shell",
	ORDER: "order", TABLE: "table", CHART: "chart", IMAGE: "image", VIDEO: "video",
	FIELD: "field", LOCAL: "local", PARSE: "parse",
	NAVMENU: "navmenu", PREMENU: "premenu", CONTENT: "content",
	STORY_ITEM: ".story", H2: "h2.story", H3: "h3.story",
	DRAW: "draw",
}
var chat = {
	LIB: "lib", PAGE: "page", PANEL: "panel", PLUGIN: "plugin", STORY: "story", PLUG: "plug",
	TOAST: "toast", CARTE: "carte", INPUT: "input", UPLOAD: "upload", CONTEXTS: "contexts",
	LAYOUT: "layout", PROJECT: "project", CONTENT: "content", DISPLAY: "display", PROFILE: "profile", ACTIONS: "actions",
	TITLE: "title", THEME: "theme", BLACK: "black", WHITE: "white", PRINT: "print", LIGHT: "light", DARK: "dark",
	SHARE: "share", RIVER: "river", STORM: "storm", FIELD: "field", TOOL: "tool",
	STATE: "state", MENUS: "menus", SSO: "sso", LOCATION: "location", IFRAME: "iframe",
	OUTPUT: "output", SIMPLE: "simple", FLOAT: "float", FULL: "full", CMD: "cmd",

	HEADER: "Header", ACTION: "Action", FOOTER: "Footer",
	libs: ["/lib/base.js", "/lib/core.js", "/lib/date.js", "/lib/misc.js", "/lib/page.js", "/lib/user.js"],
	panel_list: [{name: "Header", style: "head"}, {name: "River",  style: "left"}, {name: "Action", style: "main"}, {name: "Search", style: "auto"}, {name: "Footer", style: "foot"}],
	plugin_list: [
		"/plugin/state.js",
		"/plugin/input.js",
		"/plugin/table.js",
		"/plugin/input/key.js",
		"/plugin/input/date.js",
		"/plugin/story/json.js",
		"/plugin/story/spide.js",
		"/plugin/story/trend.js",
		"/plugin/local/code/xterm.js",
		"/plugin/local/code/vimer.js",
		"/plugin/local/code/inner.js",
		"/plugin/local/code/inner/syntax.js",
		"/plugin/local/wiki/draw/path.js",
		"/plugin/local/wiki/draw.js",
		"/plugin/local/wiki/feel.js",
		"/plugin/local/wiki/word.js",
		"/plugin/local/team/plan.js",
		"/plugin/local/mall/goods.js",
	], PLUGIN_INPUT: "/plugin/input/", PLUGIN_STORY: "/plugin/story/", PLUGIN_LOCAL: "/plugin/local/",
	PLUGIN_STATE_JS: "/plugin/state.js", PLUGIN_INPUT_JS: "/plugin/input.js", PLUGIN_TABLE_JS: "/plugin/table.js",
	ONENGINE: "onengine", ONDAEMON: "ondaemon", ONAPPEND: "onappend", ONLAYOUT: "onlayout", ONMOTION: "onmotion", ONKEYMAP: "onkeymap",
	ONIMPORT: "onimport", ONACTION: "onaction", ONDETAIL: "ondetail", ONEXPORT: "onexport",
	ONSYNTAX: "onsyntax", ONFIGURE: "onfigure", ONPLUGIN: "onplugin",

	ONSIZE: "onsize", ONMAIN: "onmain", ONLOGIN: "onlogin", ONREMOTE: "onremote", ONSEARCH: "onsearch",
	ONRESIZE: "onresize", ONKEYUP: "onkeyup", ONKEYDOWN: "onkeydown", ONMOUSEENTER: "onmouseenter", ORIENTATIONCHANGE: "orientationchange",
	ONSTORM_SELECT: "onstorm_select", ONACTION_NOSTORM: "onaction_nostorm", ONACTION_NOTOOL: "onaction_notool", ONACTION_TOUCH: "onaction_touch", ONACTION_CMD: "onaction_cmd", ONACTION_REMOVE: "onaction_remove",
	ONOPENSEARCH: "onopensearch", ONSEARCH_FOCUS: "onsearch_focus", ONCOMMAND_FOCUS: "oncommand_focus",
	ONTHEMECHANGE: "onthemechange", ONLAYOUT: "onlayout", ONUNLOAD: "onunload", ONWEBPACK: "onwebpack",
	ONTOAST: "ontoast", ONDEBUG: "ondebug", ONSHARE: "onshare", ONPRINT: "onprint",

	_INIT: "_init", _DELAY_INIT: "_delay_init",
	_TRANS: "_trans", _STYLE: "_style", _ENGINE: "_engine", _SEARCH: "_search", _NAMES: "_names", _TOAST: "_toast",
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

var html = {PLUGIN_MARGIN: 10, ACTION_HEIGHT: 32, ACTION_MARGIN: 200,
	FIELDSET: "fieldset", LEGEND: "legend", OPTION: "option", ACTION: "action", OUTPUT: "output", STATUS: "status",
	OPTION_ARGS: "select.args,input.args,textarea.args", INPUT_ARGS: "input.args,textarea.args", INPUT_BUTTON: "input[type=button]", INPUT_FILE: "input[type=file]",
	FORM_OPTION: "form.option", DIV_ACTION: "div.action", DIV_OUTPUT: "div.output", DIV_STATUS: "div.status",
	FIELDSET_HEAD: "fieldset.head", FIELDSET_FOOT: "fieldset.foot", FIELDSET_LEFT: "fieldset.left", FIELDSET_MAIN: "fieldset.main",
	FIELDSET_PANEL: "fieldset.panel", FIELDSET_PLUGIN: "fieldset.plugin", FIELDSET_STORY: "fieldset.story", FIELDSET_PLUG: "fieldset.plug",
	FIELDSET_FLOAT: "fieldset.float", FIELDSET_INPUT: "fieldset.input",

	H1: "h1", H2: "h2", H3: "h3", UL: "ul", OL: "ol", LI: "li", BR: "br", HR: "hr",
	A: "a", SPAN: "span", CODE: "code", DIV: "div",
	SVG: "svg", IMG: "img", VIDEO: "video", AUDIO: "audio", CANVAS: "canvas", IFRAME: "iframe",
	WSS: "wss", WEBVIEW: "webview", CHROME: "chrome", MOBILE: "mobile", LANDSCAPE: "landscape",
	BODY: "body", FORM: "form", LABEL: "label", TITLE: "title", INNER: "inner", SPACE: "space", CLICK: "click",
	SELECT: "select", INPUT: "input", TEXT: "text", FILE: "file", TEXTAREA: "textarea", BUTTON: "button",
	CANCEL: "cancel", SUBMIT: "submit", UPLOAD: "upload", USERNAME: "username", PASSWORD: "password",
	TABLE: "table", THEAD: "thead", TBODY: "tbody", TR: "tr", TH: "th", TD: "td",
	HEADER: "header", NAV: "nav", MAIN: "main", ASIDE: "aside", FOOTER: "footer",

	BACKGROUND_COLOR: "background-color", COLOR: "color",
	PADDING: "padding", BORDER: "border", MARGIN: "margin", MARGIN_TOP: "margin-top", MARGIN_X: "margin-x", MARGIN_Y: "margin-y",
	HEIGHT: "height", WIDTH: "width", MIN_HEIGHT: "min-height", MAX_HEIGHT: "max-height", MIN_WIDTH: "min-width", MAX_WIDTH: "max-width",
	DISPLAY: "display", BLOCK: "block", NONE: "none", OVERFLOW: "overflow", HIDDEN: "hidden", SCROLL: "scroll", FLOAT: "float", CLEAR: "clear", BOTH: "both",
	LEFT: "left", TOP: "top", RIGHT: "right", BOTTOM: "bottom",
	FLEX: "flex", FLOW: "flow",
	SCROLLBAR: "scrollbar",
	VISIBILITY: "visibility",
	VERTICAL: "vertical", HORIZON: "horizon",

	SIZE: "size", OPACITY: "opacity", VISIBLE: "visible", 
	CLASS: "class", LIGHT: "light", DARK: "dark",
	FILTER: "filter", TOGGLE: "toggle", EXPAND: "expand", SPEED: "speed", HOVER: "hover", HOVER_SELECT: "hover,select",
	NOT_HIDE: ":not(.hide)",
	
	PAGE: "page", TABS: "tabs", MENU: "menu", NODE: "node", PLUG: "plug",
	ZONE: "zone", LIST: "list", ITEM: "item", NAME: "name", ICON: "icon", VIEW: "view",
	HEAD: "head", LEFT: "left", MAIN: "main", FOOT: "foot", AUTO: "auto", SHOW: "show", HIDE: "hide",
	PLUGIN: "plugin", LAYOUT: "layout", PROJECT: "project", DISPLAY: "display", PROFILE: "profile", CONTENT: "content",
	DIV_PAGE: "div.page", DIV_TABS: "div.tabs", DIV_PATH: "div.path", DIV_CODE: "div.code", DIV_PLUG: "div.plug",
	DIV_ZONE: "div.zone", DIV_LIST: "div.list", DIV_ITEM: "div.item", DIV_NAME: "div.name", SPAN_ITEM: "span.item", SPAN_ICON: "span.icon", SPAN_NAME: "span.name",
	DIV_CONTENT: "div.content", TABLE_CONTENT: "table.content", TABLE_LAYOUT: "table.layout", DIV_TOGGLE: "div.toggle",
	DIV_LAYOUT: "div.layout", DIV_LAYOUT_HEAD: "div.layout.head", DIV_LAYOUT_FOOT: "div.layout.foot", DIV_LAYOUT_LEFT: "div.layout.left",
	DIV_FLOAT: "div.float", DIV_TOAST: "div.toast", DIV_CARTE: "div.carte",
	DESKTOP: "desktop", DIV_DESKTOP: "div.desktop", DIV_EXPAND: "div.expand",
}
var svg = {
	GROUP: "group", PID: "pid", GRID: "grid",
	FIGURE: "figure", DATA: "data", SHIP: "ship", TRANS: "trans",
	GO: "go",
	SHAPE: "shape", TEXT: "text", RECT: "rect", LINE: "line", CIRCLE: "circle", ELLIPSE: "ellipse", BLOCK: "block",
	STROKE_WIDTH: "stroke-width", STROKE: "stroke", FILL: "fill", FONT_SIZE: "font-size", FONT_FAMILY: "font-family", TEXT_ANCHOR: "text-anchor",
	G: "g", X: "x", Y: "y", R: "r", RX: "rx", RY: "ry", CX: "cx", CY: "cy", X1: "x1", Y1: "y1", X2: "x2", Y2: "y2",
	PATH: "path", PATH2V: "path2v", PATH2H: "path2h",
	M: "M", Q: "Q", T: "T",
	TEXT_LENGTH: "textLength",
}

function shy(help, meta, list, cb) { var arg = arguments, i = 0; function next(type) {
		if (type == code.OBJECT) { if (typeof arg[i] == code.OBJECT && arg[i].length == undefined) { return arg[i++] }
		} else if (type == code.ARRAY) { if (typeof arg[i] == code.OBJECT && arg[i].length != undefined) { return arg[i++] }
		} else if (i < arg.length && (!type || type == typeof arg[i])) { return arg[i++] }
	} return cb = typeof arg[arg.length-1] == code.FUNCTION? arg[arg.length-1]: function() {}, cb.help = next(code.STRING)||"", cb.meta = next(code.OBJECT)||{}, cb.list = next(code.ARRAY)||[], cb
}; var _can_name = "", _can_path = ""
var Volcanos = shy({iceberg: "/chat/", volcano: "/frame.js", cache: {}, pack: {}, args: {}}, function(name, can, libs, cb) {
	var meta = arguments.callee.meta, list = arguments.callee.list; if (typeof name == code.OBJECT) {
		if (name.length > 0) { return Volcanos({panels: [{name: chat.HEADER, style: html.HIDE, state: [mdb.TIME, aaa.USERNICK]}, {name: chat.ACTION, style: html.MAIN, tool: name}, {name: chat.FOOTER, style: html.HIDE}]}) }
		var Config = name; name = Config.name||ice.CAN, _can_name = ""
		meta.iceberg = Config.iceberg||meta.iceberg, meta.libs = (Config.libs||chat.libs).concat(Config.list), panels = Config.panels||chat.panel_list, delete(Config.panels)
		libs = [], panels.forEach(function(p) { p && (libs = libs.concat(p.list = p.list||["/panel/"+p.name+nfs._JS, "/panel/"+p.name+nfs._CSS])) }), libs = libs.concat(Config.plugin||chat.plugin_list)
		cb = can||function(can) { can.onengine._init(can, can.Conf(Config), panels, Config._init||meta._init, can._target) }
		can = Config, can._follow = name, can._target = Config.target||meta.target, can._height = Config.height||meta._height, can._width = Config.width||meta._width
	}
	can = kit.proto(can||{}, kit.proto({_name: name, _path: _can_name, _load: function(name, cbs) { var cache = meta.cache[name]||[]
			for (list.reverse(); list.length > 0; list) { var sub = list.pop(); sub != can && cache.push(sub), sub._path = sub._path||name } meta.cache[name] = cache
			cache.forEach(function(sub) { var name = sub._name; if (typeof cbs == code.FUNCTION && cbs(can, name, sub)) { return }
				can[name] = can[name]||{}; for (var k in sub) { can[name].hasOwnProperty(k) || sub.hasOwnProperty(k) && (can[name][k] = sub[k]) }
			})
		},
		require: function(libs, cb, cbs) {
			if (!libs || libs.length == 0) {
				if (navigator.userAgent == "nodejs") { return typeof cb == code.FUNCTION && cb(can) }
				return typeof cb == code.FUNCTION && setTimeout(function() { cb(can) }, 10)
			}
			if (libs[0] == undefined) { return can.require(libs.slice(1), cb, cbs) }
			if (libs[0] == "") { libs[0] = can._path.replace(nfs._JS, nfs._CSS) }
			if (libs[0].indexOf(nfs.SRC) == 0 || libs[0].indexOf(nfs.USR) == 0) { libs[0] = "/require/"+libs[0] }
			if (libs[0][0] != ice.PS && libs[0].indexOf(ice.HTTP) != 0) { libs[0] = can._path.slice(0, can._path.lastIndexOf(ice.PS)+1)+libs[0] }
			var name = (libs[0].indexOf(ice.HTTP) == 0? libs[0]: libs[0].split(ice.QS)[0]).toLowerCase()
			function next() { can._load(name, cbs), can.require(libs.slice(1), cb, cbs) }
			meta.cache[name]||name==""? next(): (meta._load(name, next))
		},
		request: function(event) { event = event||{}, event = event._event||event
			var msg = event._msg||can.misc.Message(event, can); event._msg = msg
			function set(key, value) { value == "" || msg.Option(key) || msg.Option(key, value) }
			can.core.List(arguments, function(item, index) { if (!item || index == 0) { return } 
				can.base.isFunc(item.Option)? can.core.List(item.Option(), function(key) {
					key.indexOf("_") == 0 || key.indexOf("user.") == 0 || set(key, item.Option(key))
				}): can.core.Item(can.base.isFunc(item)? item(): item, set)
			}); set(ice.MSG_HEIGHT, (can.ConfHeight()||"32")+""), set(ice.MSG_WIDTH, (can.ConfWidth()||"320")+""), set(ice.MSG_MODE, can.Mode())
			return msg
		},
		requestAction: function(event, button) { return can.request(event, {action: button, _toast: ice.PROCESS+" "+button}) },
		runActionInputs: function(event, cmds, cb) { var msg = can.request(event), meta = can.Conf()
			if (msg.Option(ice.MSG_HANDLE) != ice.TRUE && cmds && cmds[0] == ctx.ACTION && meta.feature[cmds[1]]) { var msg = can.request(event, {action: cmds[1]})
				if (can.base.isFunc(meta.feature[cmds[1]])) { return meta.feature[cmds[1]](can, msg, cmds.slice(2)) }
				return can.user.input(event, can, meta.feature[cmds[1]], function(args) { can.Update(can.request(event, {_handle: ice.TRUE}, can.Option()), cmds.slice(0, 2).concat(args)) })
			} can.runAction(event, cmds[1], cmds.slice(2), cb, true)
		},
		runActionCommand: function(event, index, args, cb) { can.request(event)._caller()
			can.runAction(event, ice.RUN, [index].concat(args), cb, true)
		},
		runAction: function(event, action, args, cb, silent) {
			can.request(event, {_handle: ice.TRUE}, can.Option())._caller()
			can.run(event, [ctx.ACTION].concat(action, args), cb, silent)
		},
		search: function(event, cmds, cb) {
			if (cmds && typeof cmds == code.OBJECT && cmds.length > 0 && typeof cmds[0] == code.OBJECT && cmds[0].length > 0 ) { cmds[0] = cmds[0].join(nfs.PT) }
			return (can._root||can).run(event, [chat._SEARCH].concat(cmds), cb, true)
		},
		get: function(name, key, cb) { var value; can.search({}, [can.core.Keys(name, chat.ONEXPORT, key)], cb||function(msg) { value = msg.Result() }); return value },
		set: function(name, key, value) { var msg = can.request(); msg.Option(key, value); return can.search(msg, [[name, chat.ONIMPORT, key]]) },
		setHeaderMenu: function(list, cb) { can._menu && can.page.Remove(can, can._menu)
			return can._menu = can.search(can.request({}, {trans: can.onaction._trans}), [[chat.HEADER, chat.ONIMPORT, html  .MENU], can._name].concat(list), cb)
		},
		getHeaderTheme: function(cb) { return can.get(chat.HEADER, chat.THEME, cb) },
		getHeader: function(key, cb) { return can.get(chat.HEADER, key, cb) },
		setHeader: function(key, value) { return can.set(chat.HEADER, key, value) },
		setAction: function(key, value) { return can.set(chat.ACTION, key, value) },
		getAction: function(key, cb) { return can.get(chat.ACTION, key, cb) },
		getActionSize: function(cb) { return can.get(chat.ACTION, nfs.SIZE, cb) },

		isPanelType: function() { return can.page.ClassList.has(can, can._fields||can._target, chat.PANEL) },
		isPluginType: function() { return can.page.ClassList.has(can, can._fields||can._target, chat.PLUGIN) },
		isStoryType: function() { return can.page.ClassList.has(can, can._fields||can._target, chat.STORY) },
		isOutputStyle: function() { return can.page.ClassList.has(can, can._fields||can._target, chat.OUTPUT) },
		isSimpleMode: function() { return can.Mode() == chat.SIMPLE },
		isFloatMode: function() { return can.Mode() == chat.FLOAT },
		isFullMode: function() { return can.Mode() == chat.FULL },
		isCmdMode: function() { return can.Mode() == chat.CMD },
		isAutoMode: function() { return can.Mode() == "" },
		Mode: function(value) { return can.Conf(ice.MODE, value) },
		ConfDefault: function(value) { can.core.Item(value, function(k, v) { can.Conf(k) || can.Conf(k, v) }) },
		ConfHeight: function(value) { return can.Conf(html.HEIGHT, value) },
		ConfWidth: function(value) { return can.Conf(html.WIDTH, value) },
		Conf: function(key, value) { var res = can._conf
			for (var i = 0; i < arguments.length; i += 2) {
				if (typeof key == code.OBJECT) { res = can.core.Value(can._conf, arguments[i]), i--; continue }
				res = can.core.Value(can._conf, arguments[i], arguments[i+1])
			} return can.base.isUndefined(res) && key.indexOf(ctx.FEATURE+nfs.PT) == -1? can.Conf(can.core.Keys(ctx.FEATURE, key)): res
		}, _conf: {},
	}, meta)); if (_can_name) { meta.cache[_can_name] = meta.cache[_can_name]||[], meta.cache[_can_name].push(can) } else { list.push(can) }
	setTimeout(function() { can.require(can._follow? libs.concat(meta.libs, meta.volcano): libs, cb) }, 1)
	return can
})
try { if (typeof(window) == code.OBJECT) { var meta = Volcanos.meta
	try { var debug = location.search.indexOf("debug=true") > -1
		meta.version = window._version||"", window.parent.outerWidth-window.parent.innerWidth > 100 && (meta.version = "", debug = false)
	} catch (e) {
		meta.version = window._version, window.outerWidth-window.innerWidth > 100 && (meta.version = "", debug = false)
	}
	meta._load = function(url, cb) {
		switch (url.split(ice.QS)[0].split(nfs.PT).pop().toLowerCase()) {
			case nfs.CSS: var item = document.createElement(mdb.LINK); item.href = url+meta.version, item.rel = "stylesheet", item.onload = cb, document.head.appendChild(item); break
			default: var item = document.createElement(nfs.SCRIPT); item.src = url+meta.version, item.onerror = cb, item.onload = cb, document.body.appendChild(item)
		}
	}
	meta.target = document.body, meta._height = window.innerHeight, meta._width = window.innerWidth
	meta._init = function(can) { var last = can.page.width() < can.page.height()
		window.onresize = function(event) { can.misc.Event(event, can, function(msg) {
			if (can.user.isMobile && last === can.page.width() < can.page.height()) { return } last = can.page.width() < can.page.height()
			can.onmotion.delayOnce(can, function() { can.onengine.signal(can, chat.ONRESIZE, can.request(event, kit.Dict(html.HEIGHT, window.innerHeight, html.WIDTH, window.innerWidth))) }, 100, can._delay_resize = can._delay_resize||[])
		}) }
		window.onbeforeunload = function() { can.onengine.signal(can, chat.ONUNLOAD) }
		window.onerror = function(message, source, lineno, colno, error) { debug? alert([message].concat(can.misc._stacks(0, error)).join(lex.NL)): can.misc.Error(message, lex.NL+[source, lineno, colno].join(ice.DF), error) }
		window.onmousemove = function(event) { window._mousemove && (window._mousemove.onmousemove(event)) }
		window.onmouseup = function(event) { window._mousemove && (window._mousemove.onmouseup(event)) }
		// window.ondblclick = function(event) { can.onkeymap.prevent(event) }
		// window.onkeydown = function(event) { if (event.key == code.ESCAPE && !can.page.tagis(event.target, html.INPUT)) { can.onkeymap.prevent(event) } }
	}
} else { // nodejs
	global.document = {}, global.location = {}, global.window = {}, global.navigator = {userAgent: "nodejs"}
	global.kit = kit, global.ice = ice
	global.ctx = ctx, global.mdb = mdb, global.web = web, global.aaa = aaa
	global.lex = lex, global.yac = yac, global.ssh = ssh, global.gdb = gdb
	global.tcp = tcp, global.nfs = nfs, global.cli = cli, global.log = log
	global.code = code, global.wiki = wiki, global.chat = chat, global.team = team, global.mall = mall
	global.html = html, global.svg = svg
	global.shy = shy, global.Volcanos = Volcanos
} } catch (e) { console.log(e) }
