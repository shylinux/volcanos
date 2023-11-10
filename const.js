var kit = {proto: function(sub, sup) { return sub.__proto__ = sup, sub },
	Dict: function() { var res = {}, arg = arguments; for (var i = 0; i < arg.length; i += 2) { var key = arg[i]
		if (typeof key == "object") { i--
			if (key.length == undefined) {
				for (var k in key) { res[k] = key[k] }
			} else {
				for (var j = 0; j < key.length; j += 2) { res[key[j]] = key[j+1] }
			}
		} else if (typeof key == "string" && key) { res[key] = arg[i+1] }
	} return res },
}
var ice = {
	TB: "\t", SP: " ", DF: ":", EQ: "=", AT: "@", QS: "?", PS: "/", PT: ".", FS: ",", NL: "\n", LT: "<", GT: ">",
	OK: "ok", TRUE: "true", FALSE: "false", SUCCESS: "success", FAILURE: "failure", PROCESS: "process",

	HTTP: "http", HELP: "help",
	MAIN: "main", AUTO: "auto",
	LIST: "list", BACK: "back",
	HOME: "home", COPY: "copy",
	MODE: "mode", EXEC: "exec",

	CAN: "can", POD: "pod", CTX: "ctx", CMD: "cmd", ARG: "arg",

	MSG_FIELDS: "fields", MSG_SESSID: "sessid",
	MSG_DETAIL: "detail", MSG_OPTION: "option", MSG_APPEND: "append", MSG_RESULT: "result",

	MSG_HANDLE: "_handle", MSG_UPLOAD: "_upload",
	MSG_SOURCE: "_source", MSG_TARGET: "_target",
	MSG_ACTION: "_action", MSG_STATUS: "_status",

	MSG_INDEX: "_index",
	MSG_PROCESS: "_process",
	MSG_DISPLAY: "_display",
	MSG_TOOLKIT: "_toolkit",
	PROCESS_REWRITE: "_rewrite",
	PROCESS_AGAIN: "_again",
	PROCESS_FIELD: "_field",
	MSG_PREFIX: "_prefix",
	MSG_METHOD: "_method",

	MSG_USERNICK: "user.nick", MSG_USERNAME: "user.name", MSG_USERROLE: "user.role", MSG_LANGUAGE: "user.lang",
	MSG_MODE: "sess.mode", MSG_THEME: "sess.theme", MSG_TITLE: "sess.title", MSG_RIVER: "sess.river", MSG_STORM: "sess.storm",
	MSG_DAEMON: "sess.daemon", LOG_DISABLE: "log.disable", LOG_TRACEID: "log.id",
	
	ErrWarn: "warn: ", ErrNotLogin: "not login: ", ErrNotRight: "not right: ", ErrNotValid: "not valid: ", ErrNotFound: "not found: ",
	NFS: "nfs", USR: "usr", CAN_PLUGIN: "can._plugin",
}

var ctx = {
	CONTEXT: "context", COMMAND: "command", CONFIG: "config", INPUTS: "inputs", FEATURE: "feature",
	CMDS: "cmds", INDEX: "index", ARGS: "args", STYLE: "style", DISPLAY: "display", ACTION: "action", RUN: "run",
	EXTRA_INDEX: "extra.index", EXTRA_ARGS: "extra.args",
}
var mdb = {FOREACH: "*", RANDOMS: "%",
	DICT: "dict", META: "meta", HASH: "hash", LIST: "list",
	TIME: "time", ZONE: "zone", ID: "id",
	TYPE: "type", NAME: "name", TEXT: "text", ICON: "icon", ICONS: "icons",
	KEY: "key", VALUE: "value", STATUS: "status", EXPIRE: "expire", EXTRA: "extra",
	SHORT: "short", FIELD: "field", COUNT: "count", TOTAL: "total", INDEX: "index", LIMIT: "limit",
	DATA: "data", VIEW: "view", ORDER: "order",
	INPUTS: "inputs", CREATE: "create", REMOVE: "remove", UPDATE: "update",
	INSERT: "insert", DELETE: "delete", MODIFY: "modify", SELECT: "select",
	PRUNES: "prunes", EXPORT: "export", IMPORT: "import",
	SEARCH: "search", ENGINE: "engine", RENDER: "render", PLUGIN: "plugin",
	DETAIL: "detail", NORMAL: "normal", PRUNE: "prune",
	MAIN: "main", PAGE: "page", NEXT: "next", PREV: "prev", LIMIT: "limit", OFFEND: "offend",
	QS: ice.QS, AT: ice.AT,
	EQ: ice.EQ, FS: ice.FS,
}
var web = {CHAT: "chat", PORTAL: "portal", STUDIO: "studio", SERVICE: "service",
	SERVE: "serve", SPACE: "space", ROUTE: "route", DREAM: "dream",
	SPIDE: "spide", TOKEN: "token", SHARE: "share", COUNT: "count",
	WORKER: "worker", SERVER: "server", GATEWAY: "gateway",
	ONLINE: "online", OFFLINE: "offline",
	OPEN: "open", LINK: "link", HTTP: "http", DOMAIN: "domain", URL: "url",
	SHARE_CACHE: "/share/cache/", SHARE_LOCAL: "/share/local/",
	AT: ice.AT, QS: ice.QS,

	DRAW: "draw", PLAY: "play", CLEAR: "clear", REFRESH: "refresh", RESIZE: "resize", FILTER: "filter",
	CANCEL: "cancel", SUBMIT: "submit", UPLOAD: "upload", DOWNLOAD: "download", TOIMAGE: "toimage", CONFIRM: "confirm",
	
	CODE_GIT_SEARCH: "web.code.git.search",
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
	MALL_GOODS: "web.mall.goods",
}
var aaa = {
	USER: "user", AUTH: "auth", SESS: "sess", ROLE: "role",
	LOGIN: "login", LOGOUT: "logout",

	BACKGROUND: "background", AVATAR: "avatar", EMAIL: "email", SECRET: "secret",
	LANGUAGE: "language", ENGLISH: "english", CHINESE: "chinese",
	LONGITUDE: "longitude", LATITUDE: "latitude",
	PROVINCE: "province", COUNTRY: "country", CITY: "city",

	USERNICK: "usernick", USERNAME: "username", PASSWORD: "password", USERROLE: "userrole", USERZONE: "userzone",
	VOID: "void", TECH: "tech", ROOT: "root",
}
var lex = {
	SPLIT: "split", PARSE: "parse",
	PREFIX: "prefix", SUFFIX: "suffix",
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
	CLIENT: "client", SERVER: "server",
	PROTO: "proto", HOST: "host", PORT: "port",
	SERVICE: "service", HOSTNAME: "hostname",
}
var nfs = {
	DIR: "dir", CAT: "cat", DEFS: "defs", PACK: "pack", TRASH: "trash", DIR_ROOT: "dir_root",
	COPY: "copy", EDIT: "edit", SAVE: "save", LOAD: "load", FIND: "find", GREP: "grep", TAGS: "tags",
	PATH: "path", FILE: "file", LINE: "line", SIZE: "size",
	REPOS: "repos", MODULE: "module", BRANCH: "branch", VERSION: "version",
	BINARY: "binary", SCRIPT: "script", TEMPLATE: "template",
	REPLACE: "replace", FROM: "from", TO: "to",
	SUBJECT: "subject", CONTENT: "content",
	SOURCE: "source", TARGET: "target",
	PUSH: "push", PULL: "pull",
	RECENT: "recent",
	IMAGE: "image",
	SH: "sh", SHY: "shy", GO: "go", JS: "js", CSS: "css", HTML: "html", SVG: "svg", _JS: ".js", _CSS: ".css",
	TXT: "txt", CSV: "csv", JSON: "json",
	PNG: "png", WEBM: "webm",
	PWD: "./", SRC: "src/", SRC_TEMPLATE: "src/template/", SRC_DOCUMENT: "src/document/",
	USR: "usr/", USR_LOCAL_WORK: "usr/local/work/", USR_VOLCANOS: "usr/volcanos/", USR_GEOAREA: "usr/geoarea/", USR_ICONS: "usr/icons/",
	USR_INTSHELL: "usr/intshell", USR_LEARNING: "usr/learning",
	REQUIRE: "/require/", REQUIRE_MODULES: "/require/modules/",
	SHARE_LOCAL: "/share/local/",
	DF: ice.DF, PS: ice.PS, PT: ice.PT,
}
var cli = {
	RUNTIME: "runtime", SYSTEM: "system", DAEMON: "daemon", ORDER: "order", BUILD: "build", OPENS: "opens",
	BEGIN: "begin", END: "end", START: "start", RESTART: "restart", STOP: "stop", OPEN: "open", CLOSE: "close",
	QRCODE: "qrcode", COLOR: "color", BLACK: "black", WHITE: "white", BLUE: "blue", RED: "red", GRAY: "gray", CYAN: "cyan", GREEN: "green", PURPLE: "purple", YELLOW: "yellow",
	MAGENTA: "magenta", SILVER: "silver", ALICEBLUE: "aliceblue", TRANSPARENT: "transparent",
	LINUX: "linux", DARWIN: "darwin", WINDOWS: "windows",
	DONE: "done", COST: "cost", FROM: "from", PWD: "pwd",
}
var log = {
	INFO: "info", WARN: "warn", ERROR: "error", DEBUG: "debug", TRACE: "trace",
}

var code = {
	FAVOR: "favor", XTERM: "xterm", INNER: "inner", VIMER: "vimer",
	WEBPACK: "webpack", BINPACK: "binpack", AUTOGEN: "autogen", COMPILE: "compile", PUBLISH: "publish", UPGRADE: "upgrade",
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
	libs: ["base.js", "core.js", "date.js", "misc.js", "page.js", "user.js"].map(function(p) { return "/lib/"+p }),
	panel_list: [{name: "Header", style: "head"}, {name: "River",  style: "left"}, {name: "Action", style: "main"}, {name: "Search", style: "auto"}, {name: "Footer", style: "foot"}],
	plugin_list: [
		"state.js",
		"input.js",
		"table.js",
		"input/key.js",
		"input/date.js",
		"story/json.js",
		"story/spide.js",
		"story/trend.js",
		"local/code/xterm.js",
		"local/code/vimer.js",
		"local/code/inner.js",
		"local/code/inner/syntax.js",
		"local/wiki/draw/path.js",
		"local/wiki/draw.js",
		"local/wiki/feel.js",
		"local/wiki/word.js",
		"local/team/plan.js",
	].map(function(p) { return "/plugin/"+p }),
	PLUGIN_LOCAL: "/plugin/local/", PLUGIN_STORY: "/plugin/story/", PLUGIN_INPUT: "/plugin/input/",
	PLUGIN_INPUT_JS: "/plugin/input.js", PLUGIN_TABLE_JS: "/plugin/table.js", PLUGIN_STATE_JS: "/plugin/state.js",
	FRAME_JS: "/volcanos/frame.js",

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
	BEGIN_TIME: "begin_time", END_TIME: "end_time",
	LONG: "long", YEAR: "year", MONTH: "month", WEEK: "week", DAY: "day", HOUR: "hour",
	TASK_POD: "task.pod", TASK_ZONE: "task.zone", TASK_ID: "task.id",
}
var mall = {
	GOODS: "goods", PRICE: "price", COUNT: "count", UNITS: "units", AMOUNT: "amount",
	ASSET: "asset", SALARY: "salary",
}

var http = {
	GET: "GET", PUT: "PUT", POST: "POST", DELETE: "DELETE",
	Accept: "Accept", ContentType: "Content-Type", ApplicationJSON: "application/json", ApplicationFORM: "application/x-www-form-urlencoded",
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
	NOTICE: "notice", DANGER: "danger",
	TOIMAGE: "toimage", 

	CURSOR: "cursor", POINTER: "pointer", CROSSHAIR: "crosshair", MOVE: "move", RESIZE: "resize",

	SIZE: "size", OPACITY: "opacity", VISIBLE: "visible", 
	CLASS: "class", DARK: "dark", LIGHT: "light", WHITE: "white", BLACK: "black",
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
	DIV_ITEM_TEXT: "div.item.text",
	DIV_ITEM_SELECT: "div.item.select",
	DIV_TABS_SELECT: "div.tabs.select",
	DIV_PROFILE: "div.profile", DIV_DISPLAY: "div.display",
	VALUE: "value",

	IMAGE_PNG: "image/png", VIDEO_WEBM: "video/webm",
}
var icon = {
	SEARCH: "bi bi-search", TERMINAL: "bi bi-terminal",
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
