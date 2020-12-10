function shy(help, meta, list, cb) {
    var index = -1, value = "", type = "string", args = arguments; function next(check) {
        if (++index >= args.length) {return false}
        if (check && check != typeof args[index]) {index--; return false}
        return value = args[index], type = typeof value, value
    }

    var cb = arguments[arguments.length-1] || function() {}
    cb.help = next("string") || cb.name
    cb.meta = next("object") || {}
    cb.list = next("object") || []
    return cb
}; var _can_name = ""
var Volcanos = shy("火山架", {libs: [], cache: {}, index: 1}, [], function(name, can, libs, cb) {
    var meta = arguments.callee.meta, list = arguments.callee.list
    if (typeof name == "object") { var Config = name
        meta.volcano = Config.volcano, meta.libs = Config.libs
        var Preload = Config.libs; Config.panes.forEach(function(pane) {
            Preload = Preload.concat(pane.list = pane.list || ["/pane/"+pane.name+".css", "/pane/"+pane.name+".js"])
        }); Preload = Preload.concat(Config.plugin)

        name = Config.name, can = { _follow: Config.name,
            _width: window.innerWidth, _height: window.innerHeight,
            _target: document.body, _head: document.head, _body: document.body,
        }, libs = Preload.concat(Config.volcano), cb = function(can) {
            can.onengine._init(can, can.Conf(Config), [], function(msg) {
                console.log(can)
            }, can._target)
        }
    }

    var conf = {}, conf_cb = {}
    can = can || {}, list.push(can) && (can.__proto__ = {__proto__: Volcanos.meta, _name: name, _create_time: new Date(), _load: function(name, cb) {
            for (var cache = meta.cache[name] || []; meta.index < list.length; meta.index++) {
                if (name == "/plugin/input/date.css" && cache.length > 0) { continue }
                if (name == "/lib/base.js" && cache.length > 0) { continue }
                if (list[meta.index] == can) { continue }
                cache.push(list[meta.index])
                // 加载缓存
            }

            for (var i = 0; i < cache.length; i++) {
                if (can[cache[i]._name] && can[cache[i]._name]._merge && can[cache[i]._name]._merge(can, cache[i])) { continue }
                if (typeof cb == "function" && cb(can, name, cache[i])) { continue}
                if (can[cache[i]._name]) {
                    for (var k in cache[i]) {
                        can[cache[i]._name].hasOwnProperty(k) || (can[cache[i]._name][k] = cache[i][k])
                    }
                } else {
                    can[cache[i]._name] = cache[i]
                }


                // 加载索引
            }
            meta.cache[name] = cache
        },
        require: function(libs, cb, each) { if (!libs || libs.length == 0) {
                typeof cb == "function" && setTimeout(function() { cb(can) }, 10)
                return // 加载完成
            }

            var source = !libs[0].endsWith("/") && (libs[0].indexOf(".") == -1? libs[0]+".js": libs[0]) || libs[0]
            var target = source.endsWith(".css")? (can._head||document.head): (can._body||document.body)

            if (meta.cache[source]) {
                can._load(source, each), can.require(libs.slice(1), cb, each)
                return // 缓存加载
            }

            if (source.endsWith(".js")) { var script = document.createElement("script")
                if (can.user && source.indexOf("publish") == 0) {
                    source += "?pod="+(can.user.Search(can, "pod")||"")
                }
                if (can.user && source.indexOf("/publish") == 0) {
                    source += "?pod="+(can.user.Search(can, "pod")||"")
                }
                script.src = source, script.onload = function() {
                    can._load(source, each), can.require(libs.slice(1), cb, each)
                } // 加载脚本
                target.appendChild(script)

            } else if (source.endsWith(".css")) { var style = document.createElement("link")
                style.rel = "stylesheet", style.type = "text/css"
                style.href = source; style.onload = function() {
                    can._load(source, each), can.require(libs.slice(1), cb, each)
                } // 加载样式
                target.appendChild(style)
            }
        },
        request: function(event, option) { event = event || {}
            if (event._msg) {
                can.core.Item(option, event._msg.Option)
                return event._msg
            }

            var ls = (can._name||can._help).split("/")
            event._pane = ls[ls.length-1]

            var msg = can.misc.Message(event, can)
            can.core.Item(option, msg.Option)
            return event._msg = msg
        },

        Conf: function(key, value, cb) {
            if (key == undefined) { return conf }
            if (typeof key == "object") { conf = key; return conf }
            typeof cb == "function" && (conf_cb[key] = cb)
            if (value != undefined) { var old = conf[key], res;
                conf[key] = conf_cb[key] && (res = conf_cb[key](value, old, key)) != undefined && res || value
            }
            if (conf[key] == undefined && key.indexOf(".") > 0) {
                var p = conf, ls = key.split(".")
                while (p && ls.length > 0) {
                    p = p[ls[0]], ls = ls.slice(1)
                }
                return p
            }
            return conf[key] || ""
        },
    })

    if (_can_name) {
        meta.cache[_can_name] = meta.cache[_can_name] || []
        meta.cache[_can_name].push(can)
    }
    return can.require(libs, cb), can
})

