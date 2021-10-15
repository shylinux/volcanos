const kit = {
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
const ice = {
    MSG_USERNAME: "user.name",
    MSG_USERNICK: "user.nick",
    MSG_TITLE: "sess.title",
    MSG_RIVER: "sess.river",
    MSG_STORM: "sess.storm",
    MSG_FIELDS: "fields",
}

const ctx = {
    CONTEXT: "context",
    COMMAND: "command",
    ACTION: "action",
    CONFIG: "config",
}
const cli = {
    RUN: "run",
    POD: "pod",
    CTX: "ctx",
    CMD: "cmd",
    ARG: "arg",

    OPEN: "open",
    CLOSE: "close",
    START: "start",
    STOP: "stop",
}
const web = {
    SHARE: "share",
    SPACE: "space",
}
const aaa = {
    USERNAME: "username",
    USERNICK: "usernick",
    BACKGROUND: "background",
    AVATAR: "avatar",

    LOGIN: "login",
    LOGOUT: "logout",
    INVITE: "invite",
}
const mdb = {
    CREATE: "create",
    REMOVE: "remove",
    INSERT: "insert",
    MODIFY: "modify",
    PLUGIN: "plugin",

    HASH: "hash",
    LIST: "list",
}
const ssh = {
    SCRIPT: "script",
}
const nfs = {
    DIR: "dir",
}
const tcp = {
    HOST: "host",
}

const code = {
    WEBPACK: "webpack",
}
const wiki = {
    TITLE: "title",
    BRIEF: "brief",
    REFER: "refer",
    SPARK: "spark",

    CHART: "chart",
    IMAGE: "image",
    VIDEO: "video",

    FIELD: "field",
    SHELL: "shell",
}
const chat = {
    RIVER: "river",
    STORM: "storm",
    FIELD: "field",

    PUBLIC: "public",
    PROTECTED: "protected",
    PRIVATE: "private",

    USER: "user",
    TOOL: "tool",
    NODE: "node",

    LAYOUT: "layout",
    OUTPUT: "output",
    SCROLL: "scroll",
    HEIGHT: "height",
    WIDTH: "width",
    TOP: "top",
    LEFT: "left",

    HEADER: "header",
    TOPIC: "topic",
    TITLE: "title",
    MENUS: "menus",
    TRANS: "trans",
    AGENT: "agent",
    CHECK: "check",
    SHARE: "share",
    GRANT: "grant",
    CMD_MARGIN: 53,
}
const team = {
    TASK: "task",
    PLAN: "plan",
}
const mall = {
    ASSET: "asset",
    SALARY: "salary",
}

const html = {
    DIV: "div",
    IMG: "img",
    CODE: "code",
    SPAN: "span",
    LABEL: "label",
    VIDEO: "video",
    BUTTON: "button",
    LEGEND: "legend",
    TEXTAREA: "textarea",
    FIELDSET: "fieldset",
    SELECT: "select",
    OPTION: "option",
    INPUT: "input",
    TEXT: "text",
    FILE: "file",

    ITEM: "item",
    LIST: "list",
}

function shy(help, meta, list, cb) {
    var index = 0, args = arguments; function next(type) {
        if (index < args.length && (!type || type == typeof args[index])) {
            return args[index++]
        }
    }

    cb = args[args.length-1] || function() {}
    cb.help = next("string") || ""
    cb.meta = next("object") || {}
    cb.list = next("object") || []
    return cb
}; var _can_name = ""
var Volcanos = shy("火山架", {iceberg: "/chat/", volcano: "/frame.js", args: {}, pack: {}, libs: [], cache: {}}, function(name, can, libs, cb) {
    var meta = arguments.callee.meta, list = arguments.callee.list
    if (typeof name == "object") { var Config = name; Config.panels = Config.panels||[], Config.main = Config.main||{}
        meta.libs = ["/lib/base.js", "/lib/core.js", "/lib/misc.js", "/lib/page.js", "/lib/user.js"]

        // 预加载
        var Preload = (Config.preload||[]).concat(Config.main.list)
        for (var i = 0; i < Config.panels.length; i++) { var panel = Config.panels[i]
            panel && (Preload = Preload.concat(panel.list = panel.list || ["/panel/"+panel.name+".css", "/panel/"+panel.name+".js"]))
        }; Preload = Preload.concat(Config.plugin)

        // 根模块
        name = Config.name, can = {_follow: Config.name, _target: Config.target||document.body}
        libs = Preload.concat(Config.libs||meta.libs, Config.volcano||meta.volcano), cb = function(can) {
            can.onengine._init(can, can.Conf(Config), Config.panels, Config._init, can._target)
        }, _can_name = "", can._root = can
    }

    can = can||{}, can.__proto__ = {__proto__: meta, _name: name, _load: function(name, cb) { // 加载缓存
            var cache = meta.cache[name]||[]; for (list.reverse(); list.length > 0; list) {
                var sub = list.pop(); sub != can && cache.push(sub)
            }; meta.cache[name] = cache

            // 加载模块
            for (var i = 0; i < cache.length; i++) { var sub = cache[i]
                if (typeof cb == "function" && cb(can, name, sub)) { continue }
                if (can[sub._name] && can[sub._name]._merge && can[sub._name]._merge(can, sub)) { continue }
                if (sub._name == "onkeypop") { can[sub._name] = sub; continue }
                !can[sub._name] && (can[sub._name] = {}); for (var k in sub) {
                    can[sub._name].hasOwnProperty(k) || (can[sub._name][k] = sub[k])
                }
            }
        },
        require: function(libs, cb, each) { if (!libs || libs.length == 0) {
                typeof cb == "function" && setTimeout(function() { cb(can) }, 10)
                return // 加载完成
            }
            if (!libs[0]) { return can.require(libs.slice(1), cb, each) }
            libs[0] = libs[0].toLowerCase()

            // 请求模块
            function next() { can._load(libs[0], each), can.require(libs.slice(1), cb, each) }
            meta.cache[libs[0]]? next(): meta._load(libs[0], next)
        },
        request: function(event, option) { event = event||{}
            var msg = event._msg||can.misc.Message(event, can); event._msg = msg
            function set(key, value) { msg[key] == undefined && msg.Option(key, value) }

            can.core.List(arguments, function(option, index) { if (index == 0) { return } 
                can.base.isFunc(option.Option)? can.core.List(option.Option(), function(key) {
                    set(key, option.Option(key))
                }): can.core.Item(can.base.isFunc(option)? option(): option, set)
            }); return msg
        },

        set: function(name, key, value) {
            var msg = can.request({}); msg.Option(key, value)
            return can.search(msg._event, [name+".onimport."+key])
        },
        get: function(name, key) { return can.search({}, [name+".onexport."+key]) },
        search: function(event, cmds, cb) { return can.run && can.run(event, ["_search"].concat(cmds), cb, true) },

        Conf: function(key, value) { return can.core.Value(can._conf, key, value) }, _conf: {},
    }

    if (_can_name) { // 加入缓存
        meta.cache[_can_name] = meta.cache[_can_name]||[]
        meta.cache[_can_name].push(can)
    } else { // 加入队列
        list.push(can)
    }
    return can.require(libs, cb), can
})
Volcanos.meta._load = function(url, cb) {
    switch (url.split("?")[0].split(".").pop().toLowerCase()) {
        case "css":
            var item = document.createElement(kit.MDB_LINK)
            item.rel = "stylesheet", item.type = "text/css"
            item.onload = cb, item.href = url
            break
        case "js":
            var item = document.createElement(ssh.SCRIPT)
            item.onload = cb, item.src = url
            break
        default: return
    }
    return document.body.appendChild(item), item
}
function cmd(tool) {
    Volcanos({name: "chat", panels: [
        {name: "cmd", help: "工作台", pos: "main", tool: tool},
    ], main: {name: "cmd", list: []}, plugin: [
            "/plugin/state.js",
            "/plugin/input.js",
            "/plugin/table.js",
            "/plugin/input/key.js",
            "/plugin/input/date.js",
            "/plugin/story/trend.js",
            "/plugin/story/spide.js",
            "/plugin/local/code/inner.js",
            "/plugin/local/code/vimer.js",
            "/plugin/local/wiki/draw/path.js",
            "/plugin/local/wiki/draw.js",
            "/plugin/local/wiki/word.js",
            "/plugin/local/team/plan.js",
        ],
    })
}
