function shy(help, meta, list, cb) {
    var index = -1, args = arguments; function next(check) {
        if (++index >= args.length) { return }
        if (check && check != typeof args[index]) { index--; return }
        return args[index]
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
        // 预加载
        var Preload = Config.libs; Config.panes.forEach(function(pane) {
            Preload = Preload.concat(pane.list = pane.list || ["/pane/"+pane.name+".css", "/pane/"+pane.name+".js"])
        }); Preload = Preload.concat(Config.plugin)

        // 根模块
        meta.libs = Config.libs, meta.volcano = Config.volcano
        name = Config.name, can = { _follow: Config.name,
            _target: document.body, _head: document.head, _body: document.body,
            _width: window.innerWidth, _height: window.innerHeight,
        }, libs = Preload.concat(Config.volcano), cb = function(can) {
            can.onengine._init(can, can.Conf(Config), [], function(msg) {
                can.base.Log(can)
            }, can._target)
        }
    }

    var conf = {}, conf_cb = {}
    list.push(can = can || {}), can.__proto__ = {__proto__: Volcanos.meta, _name: name, _load: function(name, cb) {
            // 加载缓存
            for (var cache = meta.cache[name] || []; meta.index < list.length; meta.index++) {
                list[meta.index] != can && cache.push(list[meta.index])
            }; meta.cache[name] = cache

            // 加载模块
            for (var i = 0; i < cache.length; i++) { var sub = cache[i]
                if (can[sub._name] && can[sub._name]._merge && can[sub._name]._merge(can, sub)) { continue }
                if (typeof cb == "function" && cb(can, name, sub)) { continue}
                if (can[sub._name]) {
                    for (var k in sub) {
                        can[sub._name].hasOwnProperty(k) || (can[sub._name][k] = sub[k])
                    }
                } else {
                    can[sub._name] = sub
                }
            }
        },
        require: function(libs, cb, each) { if (!libs || libs.length == 0) {
                typeof cb == "function" && setTimeout(function() { cb(can) }, 10)
                return // 加载完成
            }

            var source = !libs[0].endsWith("/") && (libs[0].indexOf(".") == -1? libs[0]+".js": libs[0]) || libs[0]
            var target = source.endsWith(".css")? (can._head||document.head): (can._body||document.body)

            if (meta.cache[source]) {
                can._load(source, each), can.require(libs.slice(1), cb, each)
                return // 加载缓存
            }

            if (source.endsWith(".css")) { var style = document.createElement("link")
                style.rel = "stylesheet", style.type = "text/css"
                style.href = source; style.onload = function() {
                    can._load(source, each), can.require(libs.slice(1), cb, each)
                } // 加载样式
                target.appendChild(style)

            } else if (source.endsWith(".js")) { var script = document.createElement("script")
                if (source.indexOf("/publish") == 0 && can.user) {
                    source += "?pod="+(can.user.Search(can, "pod")||"")
                }
                script.src = source, script.onload = function() {
                    can._load(source, each), can.require(libs.slice(1), cb, each)
                } // 加载脚本
                target.appendChild(script)
            }
        },
        request: function(event, option) { event = event || {}
            event._msg = event._msg || can.misc.Message(event, can)
            can.core.Item(option, event._msg.Option)
            return event._msg
        },

        Conf: function(key, value) {
            if (key == undefined) { return conf }
            if (typeof key == "object") { conf = key; return conf }
            conf[key] = value == undefined? conf[key]: value

            if (conf[key] == undefined && key.indexOf(".") > 0) {
                var p = conf, ls = key.split("."); while (p && ls.length > 0) {
                    p = p[ls[0]], ls = ls.slice(1)
                }
                return p
            }
            return conf[key]
        },
    }

    if (_can_name) {
        meta.cache[_can_name] = meta.cache[_can_name] || []
        meta.cache[_can_name].push(can)
    }
    return can.require(libs, cb), can
})

