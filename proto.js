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
var Volcanos = shy("火山架", {libs: [], cache: {}}, [], function(name, can, libs, cb) {
    var meta = arguments.callee.meta, list = arguments.callee.list
    if (typeof name == "object") { var Config = name; _can_name = ""
        meta.libs = Config.libs, meta.volcano = Config.volcano

        // 预加载
        var Preload = []; Config.panes.forEach(function(pane) {
            Preload = Preload.concat(pane.list = pane.list || ["/pane/"+pane.name+".css", "/pane/"+pane.name+".js"])
        }); Preload = Preload.concat(Config.plugin)

        // 根模块
        name = Config.name, can = {_follow: Config.name, _target: document.body}
        libs = Preload.concat(Config.main.list, Config.libs), cb = function(can) {
            can.onengine._init(can, can.Conf(Config), Config.panes, function(msg) { can.base.Log(name, "run", can)
                var list = []; document.body.onresize = function() { can.core.Delay(list, 100, function() {
                    can.onlayout._init(can, can._target, can._width = window.innerWidth, can._height = window.innerHeight)
                }) }, document.body.onresize()
            }, can._target)
        }
    }

    list.push(can = can || {}), can.__proto__ = {__proto__: Volcanos.meta, _name: name, _load: function(name, cb) {
            // 加载缓存
            var cache = meta.cache[name] || []; for (list.reverse(); list.length > 0; list) {
                var sub = list.pop(); sub != can && cache.push(sub)
            }; meta.cache[name] = cache

            // 加载模块
            for (var i = 0; i < cache.length; i++) { var sub = cache[i]
                if (typeof cb == "function" && cb(can, name, sub)) { continue }
                if (can[sub._name] && can[sub._name]._merge && can[sub._name]._merge(can, sub)) { continue }
                !can[sub._name] && (can[sub._name] = {}); for (var k in sub) {
                    can[sub._name].hasOwnProperty(k) || (can[sub._name][k] = sub[k])
                }
            }
        },
        require: function(libs, cb, each) { if (!libs || libs.length == 0) {
                typeof cb == "function" && setTimeout(function() { cb(can) }, 10)
                return // 加载完成
            }

            var source = !libs[0].endsWith("/") && (libs[0].indexOf(".") == -1? libs[0]+".js": libs[0]) || libs[0]

            // 请求模块
            function next() { can._load(source, each), can.require(libs.slice(1), cb, each) }
            meta.cache[source]? next(): meta._load(source, next)
        },
        request: function(event, option) { event = event || {}
            event._msg = event._msg || can.misc.Message(event, can)
            can.core.Item(option, event._msg.Option)
            return event._msg
        },

        Conf: function(key, value) {
            return can.core.Value(can._conf, key, value)
        }, _conf: {},
    }

    if (_can_name) {
        meta.cache[_can_name] = meta.cache[_can_name] || []
        meta.cache[_can_name].push(can)
    }
    return can.require(libs, cb), can
})
Volcanos.meta._load = function(url, cb) {
    switch (url.split("?")[0].split(".").pop().toLowerCase()) {
        case "css":
            var item = document.createElement("link")
            item.rel = "stylesheet", item.type = "text/css"
            item.href = url; item.onload = cb
            document.head.appendChild(item)
            return item
        case "js":
            var item = document.createElement("script")
            item.src = url, item.onload = cb
            document.body.appendChild(item)
            return item
    }
}
