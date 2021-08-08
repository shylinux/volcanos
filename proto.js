const kit = {
    MDB_TIME: "time",
    MDB_TYPE: "type",
    MDB_NAME: "name",
    MDB_TEXT: "text",
    MDB_LINK: "link",
    MDB_VALUE: "value",

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
    SPACE: "space",
}
const aaa = {
    USERNAME: "username",
    USERNICK: "usernick",
    AVATAR: "avatar",
    BACKGROUND: "background",

    LOGIN: "login",
    LOGOUT: "logout",
    INVITE: "invite",
}
const mdb = {
    CREATE: "create",
    INSERT: "insert",
    MODIFY: "modify",
    REMOVE: "remove",
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

    HEADER: "header",
    TOPIC: "topic",
    TITLE: "title",
    MENUS: "menus",
    TRANS: "trans",
    AGENT: "agent",
    CHECK: "check",
    SHARE: "share",
    GRANT: "grant",
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
    BUTTON: "button",
    LEGEND: "legend",
    TEXTAREA: "textarea",
    SELECT: "select",
    OPTION: "option",
    INPUT: "input",
    TEXT: "text",
    FILE: "file",

    ITEM: "item",
    LIST: "list",
}

function shy(help, meta, list, cb) {
    var index = 0, args = arguments; function next(check) {
        if (index < args.length && (!check || check == typeof args[index])) {
            return args[index++]
        }
    }

    cb = args[args.length-1] || function() {}
    cb.help = next("string") || ""
    cb.meta = next("object") || {}
    cb.list = next("object") || []
    return cb
}; var _can_name = ""
var Volcanos = shy("火山架", {volcano: "/frame.js", args: {}, pack: {}, libs: [], cache: {}}, [], function(name, can, libs, cb) {
    var meta = arguments.callee.meta, list = arguments.callee.list
    if (typeof name == "object") { var Config = name; _can_name = ""
        meta.libs = Config.libs, meta.volcano = Config.volcano
        Config.panels = Config.panels||[]
        Config.main = Config.main||{}

        // 预加载
        var Preload = Config.preload||[]; for (var i = 0; i < Config.panels.length; i++) { var panel = Config.panels[i]
            panel && (Preload = Preload.concat(panel.list = panel.list || ["/panel/"+panel.name+".css", "/panel/"+panel.name+".js"]))
        }; Preload = Preload.concat(Config.plugin)

        // 根模块
        name = Config.name, can = {_follow: Config.name, _target: document.body}
        libs = Preload.concat(Config.main.list, Config.libs, Config.volcano), cb = function(can) {
            can.onengine._init(can, can.Conf(Config), Config.panels, function(msg) {
                can.base.isFunc(Config._init) && Config._init(can)
            }, can._target)
        }
    }

    var proto = {__proto__: meta, _name: name, _load: function(name, cb) { // 加载缓存
            var cache = meta.cache[name] || []; for (list.reverse(); list.length > 0; list) {
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
        request: function(event, option) { event = event || {}
            event._msg = event._msg || can.misc.Message(event, can)

            can.core.List(arguments, function(option, index) { if (index == 0) { return } 
                can.base.isFunc(option.Option)? can.core.List(option.Option(), function(key) {
                    event._msg.Option(key, option.Option(key))
                }): can.core.Item(can.base.isFunc(option)? option(): option, event._msg.Option)

            }); return event._msg
        },

        get: function(name, key) { var event = {}
            return can.search(event, [name+".onexport."+key])
        },
        set: function(name, key, value) { var event = {}
            var msg = can.request(event); msg.Option(key, value)
            return can.search(event, [name+".onimport."+key])
        },
        search: function(event, cmds, cb) { return can.run && can.run(event, ["_search"].concat(cmds), cb, true) },

        const: function(list) { can.core.List(typeof list == "object"? list: arguments, function(v) { can["_"+v.toUpperCase()] = v }) },
        Conf: function(key, value) { return can.core.Value(can._conf, key, value) }, _conf: {},
    }; can = can || {}; can.__proto__ = proto

    if (_can_name && location.search.indexOf("debug=true") == -1) { // 加入缓存
        meta.cache[_can_name] = meta.cache[_can_name] || []
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
            item.href = url; item.onload = cb
            document.head.appendChild(item)
            return item
        case "js":
            var item = document.createElement(ssh.SCRIPT)
            item.src = url, item.onload = cb
            document.body.appendChild(item)
            return item
    }
}
function cmd(tool) {
    Volcanos({name: "chat", iceberg: "/chat/", volcano: "/frame.js", preload: [],
        libs: ["/lib/base.js", "/lib/core.js", "/lib/misc.js", "/lib/page.js", "/lib/user.js"],
        panels: [{name: "cmd", help: "工作台", pos: "main", tool: tool}], main: {name: "cmd", list: []}, plugin: [
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
