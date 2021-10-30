var kit = {
    MDB_ID: "id",
    MDB_KEY: "key",
    MDB_TIME: "time",
    MDB_ZONE: "zone",
    MDB_TYPE: "type",
    MDB_NAME: "name",
    MDB_TEXT: "text",
    MDB_HELP: "help",

    MDB_LINK: "link",
    MDB_VALUE: "value",
    MDB_INDEX: "index",
    MDB_ARGS: "args",

    MDB_HASH: "hash",
    MDB_LIST: "list",
}
var ice = {
    SP: " ", PT: ".", NL: "\n",
    POD: "pod", CTX: "ctx", CMD: "cmd", ARG: "arg", OPT: "opt",

    TRUE: "true",

    MSG_USERNAME: "user.name",
    MSG_USERNICK: "user.nick",
    MSG_TITLE: "sess.title",
    MSG_RIVER: "sess.river",
    MSG_STORM: "sess.storm",
    MSG_TOAST: "sess.toast",
    MSG_FIELDS: "fields",
    MSG_SESSID: "sessid",

    MSG_APPEND: "append",

    MSG_TARGET: "_target",
    MSG_HANDLE: "_handle",

    MSG_ACTION: "_action",
    MSG_STATUS: "_status",
    MSG_DISPLAY: "_display",
    MSG_PROCESS: "_process",
    MSG_PREFIX: "_prefix",

	PROCESS_AGAIN: "_again",

    AUTO: "auto",
}

var ctx = {
    CONTEXT: "context", COMMAND: "command", CONFIG: "config",
    ACTION: "action",
}
var cli = {
    RUN: "run", DONE: "done",
    OPEN: "open", CLOSE: "close",
    START: "start", STOP: "stop",
    CLEAR: "clear", REFRESH: "refresh",
}
var web = {
    SHARE: "share",
    SPACE: "space",
}
var aaa = {
    USERNAME: "username", USERNICK: "usernick", BACKGROUND: "background", AVATAR: "avatar",
    LANGUAGE: "language", ENGLISH: "english", CHINESE: "chinese",
    LOGIN: "login", LOGOUT: "logout", INVITE: "invite",
}
var mdb = {
    PLUGIN: "plugin", RENDER: "render", SEARCH: "search", INPUTS: "inputs",
    CREATE: "create", REMOVE: "remove", INSERT: "insert", DELETE: "delete",
    MODIFY: "modify", SELECT: "select",

    META: "meta", HASH: "hash", LIST: "list",
}
var ssh = {
    SCRIPT: "script",
}
var nfs = {
    DIR: "dir",
}
var tcp = {
    HOST: "host",
}

var code = {
    WEBPACK: "webpack",
}
var wiki = {
    TITLE: "title", BRIEF: "brief", REFER: "refer", SPARK: "spark",
    ORDER: "order", TABLE: "table", CHART: "chart", IMAGE: "image", VIDEO: "video",
    FIELD: "field", SHELL: "shell", LOCAL: "local", PARSE: "parse",
}
var chat = {
    LIB: "lib", PAGE: "page", PANEL: "panel", PLUGIN: "plugin", OUTPUT: "output",
    STORY: "story", CARTE: "carte", INPUT: "input", FLOAT: "float",
    HEAD: "head", AUTO: "auto", LEFT: "left", MAIN: "main", FOOT: "foot",
    SCROLL: "scroll", HEIGHT: "height", WIDTH: "width", LEFT: "left", TOP: "top",

    LAYOUT: "layout", PROJECT: "project", CONTENT: "content", DISPLAY: "display", PROFILE: "profile",

    PUBLIC: "public", PROTECTED: "protected", PRIVATE: "private",
    USER: "user", TOOL: "tool", NODE: "node",

    HEADER: "header", FOOTER: "footer",
    ONMAIN: "onmain", ONSIZE: "onsize", ONLOGIN: "onlogin", ONSEARCH: "onsearch",

    RIVER: "river", STORM: "storm", FIELD: "field", TOAST: "toast",
    TOPIC: "topic", BLACK: "black", WHITE: "white", PRINT: "print",

    AGENT: "agent", CHECK: "check", GRANT: "grant", SHARE: "share",
    TITLE: "title", STATE: "state", MENUS: "menus", TRANS: "trans",
    SSO: "sso",
    CMD_MARGIN: 53,
}
var team = {
    TASK: "task",
    PLAN: "plan",
}
var mall = {
    ASSET: "asset",
    SALARY: "salary",
}

var html = {
    FIELDSET: "fieldset", LEGEND: "legend", OPTION: "option", ACTION: "action", OUTPUT: "output", STATUS: "status",
    FORM_OPTION: "form.option", DIV_ACTION: "div.action", DIV_OUTPUT: "div.output", DIV_STATUS: "div.status",

    INPUT: "input", INPUT_ARGS: ".args", TEXT: "text", TEXTAREA: "textarea", SELECT: "select", BUTTON: "button",
    SPACE: "space", BLOCK: "block", NONE: "none",
    BR: "br",

    TABLE: "table", TR: "tr", TH: "th", TD: "td",
    DIV: "div",
    IMG: "img",
    SPAN: "span",
    CODE: "code",
    LABEL: "label",
    VIDEO: "video",

    FORM: "form", FILE: "file",
    LIST: "list", ITEM: "item", MENU: "menu",
}
var lang = {
    STRING: "string", OBJECT: "object", FUNCTION: "function",
    ESCAPE: "Escape", ENTER: "Enter",
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
    if (typeof name == lang.OBJECT) { var Config = name; Config.panels = Config.panels||[], Config.main = Config.main||{}
        libs = [], meta.libs = ["/lib/base.js", "/lib/core.js", "/lib/misc.js", "/lib/page.js", "/lib/user.js"]

        // 预加载
        for (var i = 0; i < Config.panels.length; i++) { var panel = Config.panels[i]
            panel && (libs = libs.concat(panel.list = panel.list||["/panel/"+panel.name+".css", "/panel/"+panel.name+".js"]))
        }; libs = libs.concat(Config.plugin, Config.main.list, meta.volcano)

        // 根模块
        name = Config.name, can = {_follow: Config.name, _target: Config.target||document.body}, cb = function(can) {
            can.onengine._init(can, can.Conf(Config), Config.panels, Config._init, can._target)
        }, _can_name = "", can._root = can
    }

    can = can||{}
    var proto = {__proto__: meta, _name: name, _load: function(name, cb) { // 加载缓存
            var cache = meta.cache[name]||[]; for (list.reverse(); list.length > 0; list) {
                var sub = list.pop(); sub != can && cache.push(sub)
            }; meta.cache[name] = cache

            // 加载模块
            for (var i = 0; i < cache.length; i++) { var sub = cache[i]
                if (typeof cb == lang.FUNCTION && cb(can, name, sub)) { continue }
                !can[sub._name] && (can[sub._name] = {}); for (var k in sub) {
                    can[sub._name].hasOwnProperty(k) || (can[sub._name][k] = sub[k])
                }
            }
        },
        require: function(libs, cb, each) { if (!libs || libs.length == 0) {
                typeof cb == lang.FUNCTION && setTimeout(function() { cb(can) }, 10)
                return // 加载完成
            }
            libs[0] = libs[0].toLowerCase()

            // 请求模块
            function next() { can._load(libs[0], each), can.require(libs.slice(1), cb, each) }
            meta.cache[libs[0]]? next(): meta._load(libs[0], next)
        },
        request: function(event, option) { event = event||{}
            var msg = event._msg||can.misc.Message(event, can); event._msg = msg
            function set(key, value) {
                can.misc.Log(key, msg.Option(key))
                msg.Option(key) || msg.Option(key, value)
            }

            can.core.List(arguments, function(option, index) { if (index == 0) { return } 
                can.base.isFunc(option.Option)? can.core.List(option.Option(), function(key) {
                    set(key, option.Option(key))
                }): can.core.Item(can.base.isFunc(option)? option(): option, set)
            }); return msg
        },

        set: function(name, key, value) { var msg = can.request({}); msg.Option(key, value)
            return can.search(msg._event, [can.core.Keys(name, "onimport", key)])
        },
        get: function(name, key, cb) { return can.search({}, [can.core.Keys(name, "onexport", key)], cb) },
        search: function(event, cmds, cb) { return can.run && can.run(event, ["_search"].concat(cmds), cb, true) },

        Conf: function(key, value) { return can.core.Value(can._conf, key, value) }, _conf: {},
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
            if (libs[i] == "") {
                libs[i] = _can_path.replace(".js", ".css")
            } else if (libs[i][0] != "/") {
                libs[i] = _can_path.slice(0, _can_path.lastIndexOf("/")+1)+libs[i]
            }
        }
    }
    return can.require(libs, cb), can
})
Volcanos.meta._load = function(url, cb) { _can_path = url
    switch (url.split("?")[0].split(ice.PT).pop().toLowerCase()) {
        case "css":
            var item = document.createElement(kit.MDB_LINK)
            item.rel = "stylesheet", item.type = "text/css"
            item.onload = cb, item.href = url
            return (document.head||document.body).appendChild(item), item
        case "js":
            var item = document.createElement(ssh.SCRIPT)
            item.onload = cb, item.src = url
            return document.body.appendChild(item), item
    }
}
function cmd(tool) {
    Volcanos({name: "chat", panels: [
        {name: "cmd", help: "工作台", pos: chat.MAIN, tool: tool},
    ], main: {name: "cmd", list: []}, plugin: [
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
    })
}
