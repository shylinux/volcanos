var kit = {
    Dict: function() { var res = {}
        for (var i = 0; i < arguments.length; i += 2) {
            res[arguments[i]] = arguments[i+1]
        } return res
    }
}
var ice = {
    SP: " ", PS: "/", PT: ".", FS: ",", NL: "\n", LT: "<", GT: ">",
    POD: "pod", CTX: "ctx", CMD: "cmd", ARG: "arg", OPT: "opt",
    RUN: "run", RES: "res", ERR: "err",

    OK: "ok", TRUE: "true", FALSE: "false", SUCCESS: "success", FAILURE: "failure", PROCESS: "process",
    PWD: "./",

    AUTO: "auto", HELP: "help", HTTP: "http",
    VIEW: "view", MODE: "mode", SHIP: "ship",
    COPY: "copy", SHOW: "show", HIDE: "hide",

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
    MSG_PREFIX: "_prefix",

    ErrWarn: "warn: ",
    ErrNotFound: "not found: ",
}

var ctx = {
    CONTEXT: "context", COMMAND: "command", ACTION: "action", CONFIG: "config",
    INDEX: "index", ARGS: "args", STYLE: "style",
    INPUTS: "inputs", FEATURE: "feature",
}
var cli = {
    CODE: "code", COST: "cost", FROM: "from", BACK: "back",
    OPEN: "open", CLOSE: "close", BEGIN: "begin", END: "end",
    START: "start", STOP: "stop", DONE: "done", ERROR: "error",
    CLEAR: "clear", REFRESH: "refresh",
    EXEC: "exec",
    SHOW: "show",
    MAIN: "main",

    RED: "red", GREEN: "green", BLUE: "blue",
    YELLOW: "yellow", CYAN: "cyan", PURPLE: "purple", MAGENTA: "magenta",
    WHITE: "white", BLACK: "black",
}
var web = {
    SPACE: "space", SHARE: "share",
}
var aaa = {
    USERNAME: "username", USERNICK: "usernick", BACKGROUND: "background", AVATAR: "avatar",
    LANGUAGE: "language", ENGLISH: "english", CHINESE: "chinese",
    LOGIN: "login", LOGOUT: "logout", INVITE: "invite",
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

    PLUGIN: "plugin", RENDER: "render", SEARCH: "search", ENGINE: "engine",
    NEXT: "next", PREV: "prev", PAGE: "page", MAIN: "main",

    FOREACH: "*", RANDOMS: "%",
}
var ssh = {
    SCRIPT: "script",
}
var nfs = {
    HTML: "html", CSS: "css", JS: "js", GO: "go", SH: "sh", CSV: "csv", JSON: "json",
    PATH: "path", FILE: "file", LINE: "line", SIZE: "size",
    DIR: "dir", CAT: "cat", TRASH: "trash",
    DIR_ROOT: "dir_root",
    FIND: "find", GREP: "grep",
}
var tcp = {
    HOST: "host", PORT: "port",
}

var code = {
    VIMER: "vimer", INNER: "inner", FAVOR: "favor",
    WEBPACK: "webpack",
}
var wiki = {
    TITLE: "title", BRIEF: "brief", REFER: "refer", SPARK: "spark",
    ORDER: "order", TABLE: "table", CHART: "chart", IMAGE: "image", VIDEO: "video",
    FIELD: "field", SHELL: "shell", LOCAL: "local", PARSE: "parse",

    NAVMENU: "navmenu", PREMENU: "premenu",

    ITEM: ".story",
    H2: "h2.story",
    H3: "h3.story",
    DIV_PAGE: "div.page",
}
var chat = {
    LIB: "lib", PAGE: "page", PANEL: "panel", PLUGIN: "plugin", OUTPUT: "output", INPUT: "input", UPLOAD: "upload",
    STORY: "story", FLOAT: "float", CONTEXTS: "contexts", CARTE: "carte", TOAST: "toast",
    LEGNED: "legend", OPTION: "option", ACTION: "action", OUTPUT: "output", STATUS: "status",
    LAYOUT: "layout", PROJECT: "project", CONTENT: "content", DISPLAY: "display", PROFILE: "profile",

    TITLE: "title", TOPIC: "topic", BLACK: "black", WHITE: "white", PRINT: "print",
    SHARE: "share", RIVER: "river", STORM: "storm", FIELD: "field", TOAST: "toast",
    PUBLIC: "public", PROTECTED: "protected", PRIVATE: "private",
    USER: "user", TOOL: "tool", NODE: "node",

    AGENT: "agent", CHECK: "check", GRANT: "grant",
    STATE: "state", MENUS: "menus", TRANS: "trans",

    ONMAIN: "onmain", ONLOGIN: "onlogin", ONSEARCH: "onsearch",
    ONSIZE: "onsize", ONTOAST: "ontoast", ONREMOTE: "onremote",

    HEAD: "head", LEFT: "left", MAIN: "main", AUTO: "auto", HIDE: "hide", FOOT: "foot",
    SCROLL: "scroll", LEFT: "left", TOP: "top", RIGHT: "right", BOTTOM: "bottom",
    HEADER: "header", FOOTER: "footer",

    TABS: "tabs", DIV_TABS: "div.tabs",

    SSO: "sso",

    PLUGIN_STATE_JS: "/plugin/state.js",
    PLUGIN_INPUT_JS: "/plugin/input.js",
    PLUGIN_TABLE_JS: "/plugin/table.js",

    libs: ["/lib/base.js", "/lib/core.js", "/lib/misc.js", "/lib/page.js", "/lib/user.js"],
    panel_list: [
        {name: "Header", help: "标题栏", pos: "head", state: ["time", "usernick", "avatar"]},
        {name: "River",  help: "群聊组", pos: "left", action: ["create", "refresh"]},
        {name: "Action", help: "工作台", pos: "main"},
        {name: "Search", help: "搜索框", pos: "auto"},
        {name: "Footer", help: "状态条", pos: "foot", state: ["ncmd"]},
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
        "/plugin/local/chat/div.js",
        "/plugin/local/team/plan.js",
        "/plugin/input/province.js",
    ],
    ACTION_LAYOUT_FMT: `
fieldset.Action.grid>div.output fieldset.plugin {
    width:_width; height:_height;
}
fieldset.Action.grid>div.output fieldset.plugin>div.output {
    width:_width; height:_height;
}
`,
}
var team = {
    TASK: "task", PLAN: "plan",
}
var mall = {
    ASSET: "asset", SALARY: "salary",
}

var svg = {
    G: "g", X: "x", Y: "y", R: "r", RECT: "rect",
    M: "M", Q: "Q", T: "T",
}
var html = {
    FIELDSET: "fieldset", LEGEND: "legend", OPTION: "option", ACTION: "action", OUTPUT: "output", STATUS: "status",
    FORM_OPTION: "form.option", DIV_ACTION: "div.action", DIV_OUTPUT: "div.output", DIV_STATUS: "div.status",
    FIELDSET_PANEL: "fieldset.panel", FIELDSET_PLUGIN: "fieldset.plugin", FIELDSET_STORY: "fieldset.story",

    FIELDSET_HEAD: "fieldset.head", FIELDSET_FOOT: "fieldset.foot",
    FIELDSET_LEFT: "fieldset.left", FIELDSET_MAIN: "fieldset.main",
    FIELDSET_AUTO: "fieldset.auto", FIELDSET_FLOAT: "fieldset.float",
    DIV_LEGEND: "div.legend",

    OPTION_ARGS: "select.args,input.args,textarea.args",
    INPUT_ARGS: "input.args,textarea.args",
    DIV_ITEM: "div.item", DIV_FLOAT: "div.float",

    INPUT_BUTTON: "input[type=button]",
    UPLOAD: "upload", USERNAME: "username", PASSWORD: "password",
    INPUT: "input", TEXT: "text", TEXTAREA: "textarea", SELECT: "select", BUTTON: "button",
    FORM: "form", FILE: "file", SPACE: "space", CLICK: "click", SUBMIT: "submit", CANCEL: "cancel",
    DIV: "div", IMG: "img", CODE: "code", SPAN: "span", VIDEO: "video",
    TABLE: "table", TR: "tr", TH: "th", TD: "td", BR: "br", UL: "ul", LI: "li",
    A: "a", LABEL: "label", INNER: "inner", TITLE: "title",

    CLASS: "class", FLOAT: "float", CLEAR: "clear", BOTH: "both",
    BACKGROUND: "background", SELECT: "select", HIDDEN: "hidden",
    DISPLAY: "display", BLOCK: "block", NONE: "none",
    STROKE_WIDTH: "stroke-width", STROKE: "stroke", FILL: "fill", FONT_SIZE: "font-size", MONOSPACE: "monospace",
    SCROLL: "scroll", HEIGHT: "height", WIDTH: "width", LEFT: "left", TOP: "top", RIGHT: "right", BOTTOM: "bottom",
    MAX_HEIGHT: "max-height", MAX_WIDTH: "max-width", MARGIN_X: "margin-x", MARGIN_Y: "margin-y",
    PLUGIN_MARGIN: 10, ACTION_HEIGHT: 27, ACTION_MARGIN: 200,

    FIXED: "fixed",

    WSS: "wss", SVG: "svg", CANVAS: "canvas", IFRAME: "iframe", CHROME: "chrome",
    LIST: "list", ITEM: "item", MENU: "menu", NODE: "node",
    HIDE: "hide", SHOW: "show",
    H1: "h1", H2: "h2", H3: "h3",
}
var lang = {
    STRING: "string", NUMBER: "number",
    OBJECT: "object", FUNCTION: "function",
    ESCAPE: "Escape", ENTER: "Enter", TAB: "Tab",
}
function shy(help, meta, list, cb) {
    var index = 0, args = arguments; function next(type) {
        if (index < args.length && (!type || type == typeof args[index])) {
            return args[index++]
        }
    }

    cb = args[args.length-1]||function() {}
    cb.help = next(lang.STRING)||""
    cb.meta = next(lang.OBJECT)|| {}
    cb.list = next(lang.OBJECT)||[]
    return cb
}; var _can_name = "", _can_path = ""
var Volcanos = shy("火山架", {iceberg: "/chat/", volcano: "/frame.js", args: {}, pack: {}, libs: [], cache: {}}, function(name, can, libs, cb) {
    var meta = arguments.callee.meta, list = arguments.callee.list
    if (typeof name == lang.OBJECT) { var Config = name; Config.plugin = Config.plugin||chat.plugin_list
        Config.panels = Config.panels||chat.panel_list, Config.main = Config.main||{name: "Header"}
        meta.libs = chat.libs, meta.iceberg = Config.iceberg||meta.iceberg

        // 预加载
        libs = []; for (var i = 0; i < Config.panels.length; i++) { var panel = Config.panels[i]
            panel && (libs = libs.concat(panel.list = panel.list||["/panel/"+panel.name+".css", "/panel/"+panel.name+".js"]))
        }; libs = libs.concat(Config.plugin, Config.main.list)

        // 根模块
        _can_name = "", name = Config.name||"chat", cb = can||function(can) {
            can.onengine._init(can, can.Conf(Config), Config.panels, Config._init, can._target)
        }, can = {_follow: name, _target: Config.target||document.body}, can._root = can
        for (var k in Config) { can[k] = Config[k] }
    }

    can = can||{}
    var proto = {__proto__: meta, _path: _can_path, _name: name, _load: function(name, each) { // 加载缓存
            var cache = meta.cache[name]||[]; for (list.reverse(); list.length > 0; list) {
                var sub = list.pop(); sub != can && cache.push(sub)
            }; meta.cache[name] = cache

            // 加载模块
            for (var i = 0; i < cache.length; i++) { var sub = cache[i], name = sub._name
                if (typeof each == lang.FUNCTION && each(can, name, sub)) { continue }
                !can[name] && (can[name] = {}); for (var k in sub) {
                    can[name].hasOwnProperty(k) || (can[name][k] = sub[k])
                }
            }
        },
        require: function(libs, cb, each) { if (!libs || libs.length == 0) {
                typeof cb == lang.FUNCTION && setTimeout(function() { cb(can) }, 10)
                return // 加载完成
            }

            if (!libs[0]) { return can.require(libs.slice(1), cb, each) }
            libs[0] = libs[0].toLowerCase()

            // 请求模块
            var name = libs[0].split("?")[0]
            function next() { can._load(name, each), can.require(libs.slice(1), cb, each) }
            meta.cache[name]? next(): (_can_path = libs[0], meta._load(name, next))
        },
        request: function(event, option) { event = event||{}
            var msg = event._msg||can.misc.Message(event, can); event._msg = msg
            function set(key, value) { msg.Option(key) || value == "" || msg.Option(key, value) }

            can.core.List(arguments, function(option, index) { if (index == 0) { return } 
                can.base.isFunc(option.Option)? can.core.List(option.Option(), function(key) {
                    set(key, option.Option(key))
                }): can.core.Item(can.base.isFunc(option)? option(): option, set)
            }); return msg
        },

        setHeaderMenu: function(list, cb) { can._menu && can.page.Remove(can, can._menu)
            var msg = can.request({}, {trans: can.onaction._trans})
            return can._menu = can.search(msg._event, ["Header.onimport.menu", can._name].concat(list), cb)
        },
        set: function(name, key, value) { var msg = can.request({}); msg.Option(key, value)
            return can.search(msg._event, [can.core.Keys(name, "onimport", key)])
        },
        get: function(name, key, cb) {
            return can.search({}, [can.core.Keys(name, "onexport", key)], cb)
        },
        setHeader: function(key, value) { return can.set("Header", key, value) },
        getHeader: function(key, cb) { return can.get("Header", key, cb) },
        getAction: function(key, cb) { return can.get("Action", key, cb) },
        getActionSize: function(cb) { return can.get("Action", "size", cb) },
        search: function(event, cmds, cb) { return can.run && can.run(event, ["_search"].concat(cmds), cb, true) },

        Conf: function(key, value) { var res = can._conf
            for (var i = 0; i < arguments.length; i += 2) {
                res = can.core.Value(can._conf, arguments[i], arguments[i+1])
            }
            return res
        }, _conf: {},
    }

    if (navigator.userAgent.indexOf("MSIE") > -1) {
        for (var k in proto) { can[k] = proto[k] }
    } else {
        can.__proto__ = proto
    }

    if (_can_name) { // 加入缓存
        meta.cache[_can_name] = meta.cache[_can_name]||[], meta.cache[_can_name].push(can)
    } else { // 加入队列
        list.push(can)
    }
    if (can._follow) { libs = libs.concat(meta.libs, meta.volcano) }
    if (libs && libs.length > 0) {
        for (var i = 0; i < libs.length; i++) {
            if (libs[i] == undefined) {

            } else if (libs[i] == "") {
                libs[i] = _can_path.replace(".js", ".css")
            } else if (libs[i][0] != ice.PS && libs[i].indexOf(ice.HTTP) != 0) {
                libs[i] = _can_path.slice(0, _can_path.lastIndexOf(ice.PS)+1)+libs[i]
            }
        }
    }
    return can.require(libs, cb), can
})
Volcanos.meta._load = function(url, cb) {
    switch (url.split("?")[0].split(ice.PT).pop().toLowerCase()) {
        case nfs.CSS:
            var item = document.createElement(mdb.LINK)
            item.rel = "stylesheet", item.type = "text/css"
            item.onload = cb, item.href = url
            return (document.head||document.body).appendChild(item), item
        case nfs.JS:
            var item = document.createElement(ssh.SCRIPT)
            item.onload = cb, item.onerror = cb, item.src = url
            return document.body.appendChild(item), item
    }
}
function can(tool) {
    Volcanos({name: "chat", panels: [
        {name: "Header", help: "标题栏", pos: "hide", state: ["time", "usernick", "avatar"]},
        {name: "Action", help: "工作台", pos: chat.MAIN, tool: tool},
    ]})
}
