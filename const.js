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
	OK: "ok", TRUE: "true", FALSE: "false", SUCCESS: "success", PROCESS: "process", FAILURE: "failure",

	CONTEXTS: "contexts",
	HTTP: "http", HOME: "home",
	HELP: "help", COPY: "copy",
	MAIN: "main", AUTO: "auto",
	LIST: "list", BACK: "back",
	MODE: "mode", EXEC: "exec",

	APP: "app", CAN: "can", CAN_PLUGIN: "can._plugin",
	OPS: "ops", DEV: "dev", POD: "pod", CTX: "ctx", CMD: "cmd", ARG: "arg",
	NFS: "nfs", USR: "usr",

	MSG_FIELDS: "fields", MSG_SESSID: "sessid", MSG_METHOD: "method", MSG_DEBUG: "debug",
	MSG_DETAIL: "detail", MSG_OPTION: "option", MSG_APPEND: "append", MSG_RESULT: "result",

	MSG_HANDLE: "_handle", MSG_UPLOAD: "_upload",
	MSG_SOURCE: "_source", MSG_TARGET: "_target",
	MSG_ACTION: "_action", MSG_STATUS: "_status",
	MSG_PROCESS: "_process", MSG_DISPLAY: "_display", MSG_TOOLKIT: "_toolkit",
	MSG_DISPLAY_CSS: "_display_css",

	MSG_USERWEB: "user.web", MSG_USERPOD: "user.pod",
	MSG_USERROLE: "user.role", MSG_USERNAME: "user.name", MSG_USERNICK: "user.nick", MSG_LANGUAGE: "user.lang",
	MSG_TITLE: "sess.title", MSG_THEME: "sess.theme", MSG_BG: "sess.bg", MSG_FG: "sess.fg", MSG_DAEMON: "sess.daemon",
	LOG_DISABLE: "log.disable", LOG_TRACEID: "log.id",
	MSG_RIVER: "sess.river", MSG_STORM: "sess.storm",

	MSG_COST: "sess.cost", MSG_MODE: "sess.mode",
	MSG_NODETYPE: "node.type", TABLE_CHECKBOX: "table.checkbox",
	FROM_DAEMON: "from.daemon",

	PROCESS_REWRITE: "_rewrite",
	PROCESS_FIELD: "_field",
	PROCESS_AGAIN: "_again",
	PROCESS_HOLD: "_hold",
	FIELD_PREFIX: "_prefix",
	MSG_PREFIX: "_prefix",
	MSG_INDEX: "_index",

	ErrWarn: "warn: ",
	ErrNotLogin: "not login: ",
	ErrNotRight: "not right: ",
	ErrNotValid: "not valid: ",
	ErrNotFound: "not found: ",
}

var ctx = {
	CONTEXT: "context", COMMAND: "command", CONFIG: "config", INPUTS: "inputs", FEATURE: "feature",
	INDEX: "index", ARGS: "args", STYLE: "style", DISPLAY: "display", ACTION: "action", RUN: "run", CMDS: "cmds",
	EXTRA_INDEX: "extra.index", EXTRA_ARGS: "extra.args",
	FEATURE_TRANS: "feature._trans",
}
var mdb = {FOREACH: "*", RANDOMS: "%",
	DICT: "dict", META: "meta", HASH: "hash", LIST: "list",
	SHORT: "short", FIELD: "field", COUNT: "count", TOTAL: "total", LIMIT: "limit",
	TIME: "time", ZONE: "zone", ID: "id",
	TYPE: "type", NAME: "name", TEXT: "text", ICON: "icon", ICONS: "icons",
	KEY: "key", VALUE: "value", STATUS: "status", EXTRA: "extra",
	INDEX: "index", EXPIRE: "expire",
	ORDER: "order", WEIGHT: "weight",
	ENABLE: "enable", DISABLE: "disable",
	RENAME: "rename",
	NICK: "nick",
	DATA: "data", VIEW: "view",
	INPUTS: "inputs", CREATE: "create", REMOVE: "remove", UPDATE: "update",
	INSERT: "insert", DELETE: "delete", MODIFY: "modify", SELECT: "select",
	PRUNES: "prunes", EXPORT: "export", IMPORT: "import",
	SEARCH: "search", ENGINE: "engine", RENDER: "render", PLUGIN: "plugin",
	DETAIL: "detail", NORMAL: "normal", PRUNE: "prune",
	MAIN: "main", PAGE: "page", NEXT: "next", PREV: "prev", LIMIT: "limit", OFFEND: "offend",
	QS: ice.QS, AT: ice.AT,
	EQ: ice.EQ, FS: ice.FS,
}
var web = {
	SERVE: "serve", SPACE: "space", DREAM: "dream", ROUTE: "route",
	SHARE: "share", TOKEN: "token", STATS: "stats", COUNT: "count",
	SPIDE: "spide", STORE: "store", ADMIN: "admin", MATRIX: "matrix",
	GRANT: "grant",

	WORKER: "worker", SERVER: "server", ORIGIN: "origin", VENDOR: "vendor",
	GATEWAY: "gateway", ONLINE: "online", OFFLINE: "offline",

	FULL: "full", OPEN: "open", LINK: "link", HTTP: "http", DOMAIN: "domain", URL: "url",
	DRAW: "draw", PLAY: "play", CLEAR: "clear", RESIZE: "resize", FILTER: "filter",
	CANCEL: "cancel", SUBMIT: "submit", CONFIRM: "confirm", REFRESH: "refresh",
	UPLOAD: "upload", DOWNLOAD: "download", PREVIEW: "preview", TOIMAGE: "toimage",

	SHARE_CACHE: "/share/cache/", SHARE_LOCAL: "/share/local/", BASIC_LOGIN: "/basic/login",
	CHAT_SSO: "/chat/sso/", CHAT_POD: "/chat/pod/", CHAT_CMD: "/chat/cmd/",

	CHAT: "chat",
	PORTAL: "portal", DESKTOP: "desktop",
	STUDIO: "studio", SERVICE: "service",
	MESSAGE: "message",
	WORD: "word",
	VIMER: "vimer",

	CODE_GIT_SEARCH: "web.code.git.search",
	CODE_GIT_STATUS: "web.code.git.status",
	CODE_GIT_REPOS: "web.code.git.repos",
	CODE_COMPILE: "web.code.compile",
	CODE_VIMER: "web.code.vimer",
	CODE_INNER: "web.code.inner",
	CODE_XTERM: "web.code.xterm",
	WIKI_DRAW: "web.wiki.draw",
	WIKI_WORD: "web.wiki.word",
	WIKI_PORTAL: "web.wiki.portal",
	CHAT_OAUTH_CLIENT: "web.chat.oauth.client",
	CHAT_MACOS_DESKTOP: "web.chat.macos.desktop",
	CHAT_MACOS_SESSION: "web.chat.macos.session",
	CHAT_MESSAGE: "web.chat.message",
	CHAT_HEADER: "web.chat.header",
	CHAT_IFRAME: "web.chat.iframe",
	CHAT_FAVOR: "web.chat.favor",
	CHAT_FLOWS: "web.chat.flows",
	TEAM_PLAN: "web.team.plan",
	MALL_GOODS: "web.mall.goods",

	AT: ice.AT, QS: ice.QS,
}
var aaa = {
	USER: "user", AUTH: "auth", SESS: "sess", ROLE: "role",
	EMAIL: "email", OFFER: "offer", APPLY: "apply",
	LOGIN: "login", LOGOUT: "logout",

	BACKGROUND: "background", AVATAR: "avatar", MOBILE: "mobile", SECRET: "secret",
	LANGUAGE: "language", ENGLISH: "english", CHINESE: "chinese",
	PROVINCE: "province", COUNTRY: "country", CITY: "city",
	LONGITUDE: "longitude", LATITUDE: "latitude",
	IP: "ip", UA: "ua",
	LOCATION: "location",

	USERNICK: "usernick", USERNAME: "username", PASSWORD: "password", USERROLE: "userrole", USERZONE: "userzone",
	VOID: "void", TECH: "tech", ROOT: "root",
	PUBLIC: "public", PRIVATE: "private",
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
	CLOUD_PROFILE: "ssh.cloud.profile",
}
var gdb = {
	SIGNAL: "signal",
}
var tcp = {
	CLIENT: "client", SERVER: "server",
	PROTO: "proto", HOST: "host", PORT: "port",
	SERVICE: "service", HOSTNAME: "hostname",
	WIFI: "wifi", SSID: "ssid",
	LOCALHOST: "localhost",
	DIRECT: "direct", SEND: "send", RECV: "recv",
}
var nfs = {
	DIR: "dir", CAT: "cat", DEFS: "defs", PACK: "pack", TRASH: "trash", DIR_ROOT: "dir_root",
	COPY: "copy", EDIT: "edit", SAVE: "save", LOAD: "load", FIND: "find", GREP: "grep", TAGS: "tags",
	PATH: "path", FILE: "file", LINE: "line", SIZE: "size",

	MODULE: "module",
	SOURCE: "source",
	TARGET: "target",
	BINARY: "binary",
	SCRIPT: "script",

	CLONE: "clone",
	REPOS: "repos",
	BRANCH: "branch",
	VERSION: "version",

	TEMPLATE: "template", SUBJECT: "subject", CONTENT: "content",
	REPLACE: "replace", FROM: "from", TO: "to",
	RECENT: "recent", PUSH: "push", PULL: "pull",
	IMAGE: "image",

	_JS: ".js", _CSS: ".css",
	JS: "js", SVG: "svg", CSS: "css", HTML: "html",
	GO: "go", SH: "sh", SHY: "shy", CSV: "csv", JSON: "json",
	TXT: "txt", PNG: "png", WEBM: "webm",

	PWD: "./", SRC: "src/", SRC_MAIN_ICO: "src/main.ico",
	SRC_TEMPLATE: "src/template/",
	SRC_DOCUMENT: "src/document/",
	USR_LEARNING_PORTAL: "usr/learning/portal/",
	USR: "usr/", USR_LOCAL_WORK: "usr/local/work/",
	USR_WEBSOCKET: "usr/websocket/", USR_GO_QRCODE: "usr/go-qrcode/", USR_GO_GIT: "usr/go-git/",
	USR_ICONS: "usr/icons/", USR_GEOAREA: "usr/geoarea/", USR_PROGRAM: "usr/program/",
	USR_INTSHELL: "usr/intshell/", USR_VOLCANOS: "usr/volcanos/", USR_LEARNING: "usr/learning/",
	USR_NODE_MODULES: "usr/node_modules/",
	USR_ICONS_ICEBERGS: "usr/icons/icebergs.jpg",
	USR_ICONS_VOLCANOS: "usr/icons/volcanos.jpg",

	V: "/v/",
	M: "/m/",
	P: "/p/",
	X: "/x/",
	S: "/s/",
	C: "/c/",
	REQUIRE: "/require/", REQUIRE_MODULES: "/require/modules/",
	SHARE_CACHE: "/share/cache/", SHARE_LOCAL: "/share/local/",
	WIKI_PORTAL: "/wiki/portal/",
	CHAT_RIVER: "/chat/river/", CHAT_ACTION: "/chat/action/",

	DF: ice.DF, PS: ice.PS, PT: ice.PT,
}
var cli = {
	RUNTIME: "runtime", SYSTEM: "system", DAEMON: "daemon",
	BEGIN: "begin", END: "end", START: "start", RESTART: "restart", STOP: "stop", OPEN: "open", CLOSE: "close",
	PID: "pid",

	OPENS: "opens", BUILD: "build", ORDER: "order", DELAY: "delay", REBOOT: "reboot",
	PLAY: "play", STEP: "step", DONE: "done", COST: "cost", FROM: "from", PWD: "pwd",

	QRCODE: "qrcode", COLOR: "color", BLACK: "black", WHITE: "white", BLUE: "blue", RED: "red", GRAY: "gray", CYAN: "cyan", GREEN: "green", PURPLE: "purple", YELLOW: "yellow",
	MAGENTA: "magenta", SILVER: "silver", ALICEBLUE: "aliceblue", TRANSPARENT: "transparent",
	LINUX: "linux", DARWIN: "darwin", WINDOWS: "windows",
	SH: "sh",
}
var log = {
	INFO: "info", WARN: "warn", ERROR: "error", DEBUG: "debug", TRACE: "trace",
}

var code = {
	FAVOR: "favor", XTERM: "xterm", INNER: "inner", VIMER: "vimer",
	WEBPACK: "webpack", BINPACK: "binpack", AUTOGEN: "autogen", COMPILE: "compile", PUBLISH: "publish", UPGRADE: "upgrade",
	TEMPLATE: "template", COMPLETE: "complete", NAVIGATE: "navigate", CURRENT: "current",
	PULL: "pull", PUSH: "push",
	INSTALL: "install",
	COMMENT: "comment", KEYWORD: "keyword", DATATYPE: "datatype", PACKAGE: "package",
	FUNCTION: "function", CONSTANT: "constant", STRING: "string", NUMBER: "number", BOOLEAN: "boolean",
	OBJECT: "object", ARRAY: "array", UNDEFINED: "undefined",
	META: "Meta", ALT: "Alt", CONTROL: "Control", SHIFT: "Shift", TAB: "Tab", ESCAPE: "Escape", ENTER: "Enter",
	CMD: "Cmd", CTRL: "Ctrl", SPACE: "Space", BACKSPACE: "Backspace", ESC: "Esc", PS: "/",
}
var wiki = {
	DRAW: "draw", WORD: "word", PORTAL: "portal",
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
	TITLE: "title", THEME: "theme", BLACK: "black", WHITE: "white", PRINT: "print", LIGHT: "light", DARK: "dark",
	SHARE: "share", RIVER: "river", STORM: "storm", FIELD: "field", TOOL: "tool",
	STATE: "state", MENUS: "menus", SSO: "sso", LOCATION: "location", IFRAME: "iframe", DESKTOP: "desktop",
	OUTPUT: "output", SIMPLE: "simple", FLOAT: "float", FULL: "full", CMD: "cmd",
	MESSAGE: "message",
	MATRIX: "matrix",
	TUTOR: "tutor",

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
		"story/stats.js",
		"story/spides.js",
		"story/trends.js",
		"local/code/xterm.js",
		"local/code/vimer.js",
		"local/code/inner.js",
		"local/code/inner/syntax.js",
		"local/wiki/draw/path.js",
		"local/wiki/draw.js",
		"local/wiki/feel.js",
		"local/wiki/word.js",
		"local/team/plan.js",
	].map(function(p) { return "/v/plugin/"+p }),
	PLUGIN_LOCAL: "/plugin/local/", PLUGIN_STORY: "/plugin/story/", PLUGIN_INPUT: "/plugin/input/",
	PLUGIN_INPUT_JS: "/plugin/input.js", PLUGIN_TABLE_JS: "/plugin/table.js", PLUGIN_STATE_JS: "/plugin/state.js",
	FRAME_JS: "/v/frame.js",

	ONENGINE: "onengine", ONDAEMON: "ondaemon", ONAPPEND: "onappend", ONLAYOUT: "onlayout", ONMOTION: "onmotion", ONKEYMAP: "onkeymap",
	ONIMPORT: "onimport", ONACTION: "onaction", ONDETAIL: "ondetail", ONEXPORT: "onexport",
	ONSYNTAX: "onsyntax", ONFIGURE: "onfigure", ONPLUGIN: "onplugin", ONINPUTS: "oninputs",

	ONSIZE: "onsize", ONMAIN: "onmain", ONLOGIN: "onlogin", ONREMOTE: "onremote", ONSEARCH: "onsearch",
	ONRESIZE: "onresize", ONKEYUP: "onkeyup", ONKEYDOWN: "onkeydown", ONMOUSEENTER: "onmouseenter", ORIENTATIONCHANGE: "orientationchange",
	ONSTORM_SELECT: "onstorm_select", ONACTION_NOSTORM: "onaction_nostorm", ONACTION_NOTOOL: "onaction_notool", ONACTION_TOUCH: "onaction_touch", ONACTION_CMD: "onaction_cmd", ONACTION_REMOVE: "onaction_remove",
	ONOPENSEARCH: "onopensearch", ONSEARCH_FOCUS: "onsearch_focus", ONCOMMAND_FOCUS: "oncommand_focus",
	ONTHEMECHANGE: "onthemechange", ONLAYOUT: "onlayout", ONUNLOAD: "onunload", ONWEBPACK: "onwebpack",
	ONTOAST: "ontoast", ONSHARE: "onshare", ONPRINT: "onprint", ONDEBUGS: "ondebugs",

	_INIT: "_init", _DELAY_INIT: "_delay_init",
	_TRANS: "_trans", _STYLE: "_style", _ENGINE: "_engine", _SEARCH: "_search", _NAMES: "_names", _TOAST: "_toast",

	PAGES_RIVER: "/pages/river/river",
	PAGES_ACTION: "/pages/action/action",
	PAGES_INSERT: "/pages/insert/insert",
	WX_LOGIN_SESS: "/chat/wx/login/action/sess",
	WX_LOGIN_USER: "/chat/wx/login/action/user",
	WX_LOGIN_SCAN: "/chat/wx/login/action/scan",
}
var team = {
	TASK: "task", PLAN: "plan", ASSET: "asset",
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
var html = {value: {
	PROJECT_WIDTH: 230, RIVER_WIDTH: 230,
	FLOAT_HEIGHT: 480, FLOAT_WIDTH: 1200,
	PLUGIN_PADDING: 0, PLUGIN_MARGIN: 0,

	HEADER_HEIGHT: 48, ACTION_HEIGHT: 32, STATUS_HEIGHT: 32,
	QRCODE_HEIGHT: 363, QRCODE_WIDTH: 360,
	CARD_HEIGHT: 160, CARD_WIDTH: 280,
	STORY_HEIGHT: 480,
	PLUG_HEIGHT: 480, PLUG_WIDTH: 800,
	DESKTOP_HEIGHT: 684, DESKTOP_WIDTH: 1200,
	DESKTOP_MENU_HEIGHT: 25,

	ACTION_BUTTON: 3, TABLE_BUTTON: 5, CARD_BUTTON: 5,
	RIVER_MARGIN: 80, ACTION_MARGIN: 200,
	ORDER_SHOW_LIMIT: 30, ORDER_SHOW_DELAY: 150,
	CODE_FONT_SIZE: 14, CODE_LINE_HEIGHT: 20,
},
	STORY: "story",
	FIELDSET: "fieldset", LEGEND: "legend", OPTION: "option", ACTION: "action", OUTPUT: "output", STATUS: "status",
	OPTION_ARGS: "select.args,input.args,textarea.args", INPUT_ARGS: "input.args,textarea.args", INPUT_BUTTON: "input[type=button]", INPUT_FILE: "input[type=file]",
	FORM_OPTION: "form.option", DIV_ACTION: "div.action", DIV_OUTPUT: "div.output", DIV_STATUS: "div.status",
	FIELDSET_HEAD: "fieldset.head", FIELDSET_FOOT: "fieldset.foot", FIELDSET_LEFT: "fieldset.left", FIELDSET_MAIN: "fieldset.main",
	FIELDSET_PANEL: "fieldset.panel", FIELDSET_PLUGIN: "fieldset.plugin", FIELDSET_STORY: "fieldset.story", FIELDSET_PLUG: "fieldset.plug",
	FIELDSET_FLOAT: "fieldset.float", FIELDSET_INPUT: "fieldset.input",
	FIELDSET_OUTPUT: "fieldset.output",

	H1: "h1", H2: "h2", H3: "h3", UL: "ul", OL: "ol", LI: "li", BR: "br", HR: "hr",
	A: "a", SPAN: "span", CODE: "code", DIV: "div",
	SVG: "svg", IMG: "img", IMAGE: "image", VIDEO: "video", AUDIO: "audio", CANVAS: "canvas", IFRAME: "iframe",
	WSS: "wss", WEBVIEW: "webview", CHROME: "chrome", MOBILE: "mobile", LANDSCAPE: "landscape",
	BODY: "body", FORM: "form", LABEL: "label", TITLE: "title", INNER: "inner", SPACE: "space", CLICK: "click",
	SELECT: "select", INPUT: "input", TEXT: "text", FILE: "file", TEXTAREA: "textarea", BUTTON: "button", CHECKBOX: "checkbox",
	CANCEL: "cancel", SUBMIT: "submit", UPLOAD: "upload", USERNAME: "username", PASSWORD: "password",
	CONFIRM: "confirm",
	TABLE: "table", THEAD: "thead", TBODY: "tbody", TR: "tr", TH: "th", TD: "td",
	HEADER: "header", NAV: "nav", MAIN: "main", ASIDE: "aside", FOOTER: "footer",
	FAVICON: "favicon",

	BACKGROUND_COLOR: "background-color", COLOR: "color",
	PADDING: "padding", BORDER: "border", MARGIN: "margin", MARGIN_TOP: "margin-top", MARGIN_X: "margin-x", MARGIN_Y: "margin-y",
	HEIGHT: "height", WIDTH: "width", MIN_HEIGHT: "min-height", MAX_HEIGHT: "max-height", MIN_WIDTH: "min-width", MAX_WIDTH: "max-width",
	DISPLAY: "display", BLOCK: "block", NONE: "none", OVERFLOW: "overflow", HIDDEN: "hidden", SCROLL: "scroll", FLOAT: "float", CLEAR: "clear", BOTH: "both",
	LEFT: "left", TOP: "top", RIGHT: "right", BOTTOM: "bottom",
	SCROLLBAR: "scrollbar", VERTICAL: "vertical", HORIZON: "horizon",
	VISIBILITY: "visibility", TRANSPARENT: "transparent",
	NOTICE: "notice", DANGER: "danger", PICKER: "picker",
	CURSOR: "cursor", POINTER: "pointer", CROSSHAIR: "crosshair", MOVE: "move", RESIZE: "resize",

	SIZE: "size", OPACITY: "opacity", VISIBLE: "visible",
	CLASS: "class", DARK: "dark", LIGHT: "light", WHITE: "white", BLACK: "black",
	FILTER: "filter", TOGGLE: "toggle", EXPAND: "expand", SPEED: "speed", HOVER: "hover", HOVER_SELECT: "hover,select",

	ICONS: "icons",
	FULL: "full",
	ICON: "icon",
	VALUE: "value",
	PROCESS: "process",
	TOIMAGE: "toimage", NOT_HIDE: ":not(.hide)",
	CONTAINER: "container", FLEX: "flex", FLOW: "flow",
	MORE: "more",
	PAGE: "page", TABS: "tabs", MENU: "menu", NODE: "node", PLUG: "plug",
	ZONE: "zone", LIST: "list", ITEM: "item", NAME: "name", ICON: "icon", VIEW: "view",
	HEAD: "head", LEFT: "left", MAIN: "main", FOOT: "foot", AUTO: "auto", SHOW: "show", HIDE: "hide",
	PLUGIN: "plugin", LAYOUT: "layout", PROJECT: "project", DISPLAY: "display", PROFILE: "profile", CONTENT: "content", TABVIEW: "tabview",
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

	IMAGE_PNG: "image/png", VIDEO_WEBM: "video/webm",
}
var icon = {
	CHEVRON_DOWN: "bi bi-chevron-down", SEARCH: "bi bi-search", TERMINAL: "bi bi-terminal", SUN: "bi bi-sun", MOON: "bi bi-moon-stars",

	portal: "bi bi-globe", desktop: "bi bi-window-desktop", admin: "bi bi-window-sidebar",
	dream: "bi bi-box", space: "bi bi-box", store: "bi bi-shop",
	word: "bi bi-book", repos: "bi bi-git", vimer: "bi bi-bug", build: "bi bi-tools", xterm: "bi bi-terminal", shell: "bi bi-terminal",
	stats: "bi bi-card-list",
	matrix: "bi bi-grid-3x3-gap",
	feel: "bi bi-images",
	plan: "bi bi-calendar4-week",
	status: "bi bi-git",

	access: "bi bi-file-earmark-lock",
	sso: "bi bi-shield-check", login: "bi bi-person-check", token: "bi bi-key",
	username: "bi bi-person-gear", nodename: "bi bi-globe",
	password: "bi bi-shield-lock",
	database: "bi bi-database",
	table: "bi bi-table",
	domain: "bi bi-globe",
	origin: "bi bi-globe",
	server: "bi bi-globe",
	vendor: "bi bi-shop",
	full: "bi bi-arrows-fullscreen", open: "bi bi-box-arrow-up-right",
	more: "bi bi-three-dots-vertical", actions: "bi bi-three-dots",
	search: "bi bi-search", favor: "bi bi-star",
	plugs: "bi bi-tools",
	tools: "bi bi-grid",

	key: "bi bi-hash", hash: "bi bi-hash", zone: "bi bi-diagram-3", id: "bi bi-sort-numeric-down",
	modify: "bi bi-pencil-square", rename: "bi bi-pencil-square", remove: "bi bi-trash",
	enable: "bi bi-toggle-off", disable: "bi bi-toggle-on",
	expire: "bi bi-clock-history",

	name: "bi bi-sort-alpha-down",
	sess: "bi bi-telephone-forward",
	path: "bi bi-folder2", file: "bi bi-file-earmark-text", line: "bi bi-sort-numeric-down",
	start: "bi bi-play-circle", stop: "bi bi-stop-circle",
	load: "bi bi-folder-plus", save: "bi bi-floppy", trash: "bi bi-trash",
	pull: "bi bi-cloud-download", push: "bi bi-cloud-upload",
	upload: "bi bi-box-arrow-in-up", download: "bi bi-box-arrow-down",
	"import": "bi bi-folder-plus", "export": "bi bi-floppy",
	"begin_time": "bi bi-clock-history", "end_time": "bi bi-clock-history",

	// scale: "bi bi-arrows-fullscreen",
	pie: "bi bi-pie-chart",
	tags: "bi bi-tags",
	version: "bi bi-tags",
	compile: "bi bi-tools",
	publish: "bi bi-send-check",
	upgrade: "bi bi-rocket-takeoff",
	install: "bi bi-cloud-download",
	runtime: "bi bi-info-square",
	inspect: "bi bi-info-square",
	info: "bi bi-info-square",
	template: "bi bi-file-earmark-medical",
	reboot: "bi bi-bootstrap-reboot",
	restart: "bi bi-bootstrap-reboot",
	binary: "bi bi-disc",
	images: "bi bi-disc",
	qrcode: "bi bi-qr-code",
	main: "bi bi-house-door", top: "bi bi-globe",
	configs: "bi bi-gear", config: "bi bi-gear", conf: "bi bi-gear", logs: "bi bi-calendar4-week", tag: "bi bi-tags",
	data: "bi bi-database",
	branch: "bi bi-diagram-3", commit: "bi bi-hash",
	message: "bi bi-wechat",

	preview: "bi bi-window-stack", show: "bi bi-window-stack",
	display: "bi bi-window-desktop", exec: "bi bi-window-desktop",
	chat: "bi bi-chat-dots", help: "bi bi-question-square", doc: "bi bi-question-square",
	record: "bi bi-record-circle", record1: "bi bi-images", record2: "bi bi-record-circle",

	"client.name": "bi bi-globe",
	machine: "bi bi-pc-display",
	host: "bi bi-pc-display",
	port: "bi bi-hash",
	arch: "bi bi-cpu", os: "bi bi-ubuntu",
	role: "bi bi-person-square",
	title: "bi bi-textarea-t",
	type: "bi bi-card-list",
	scan: "bi bi-card-list",
	send: "bi bi-send-check",
	cmds: "bi bi-terminal",
	localCreate: "bi bi-cloud-download",
	notifications: "bi bi-chat-right-text",
	play: "bi bi-play-circle", app: "bi bi-box-arrow-down-left",
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
try { module.exports = {
	kit, ice,
	ctx, mdb, web, aaa,
	lex, yac, ssh, gdb,
	tcp, nfs, cli, log,
	code, wiki, chat, team, mall,
	http, html, icon, svg
} } catch {}
