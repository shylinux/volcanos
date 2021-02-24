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
var Volcanos = shy("火山架", {args: {}, pack: {}, libs: [], cache: {}}, [], function(name, can, libs, cb) {
    var meta = arguments.callee.meta, list = arguments.callee.list
    if (typeof name == "object") { var Config = name; _can_name = ""
        meta.libs = Config.libs, meta.volcano = Config.volcano

        // 预加载
        var Preload = [Config.volcano]; for (var i = 0; i < Config.panes.length; i++) { var pane = Config.panes[i]
            pane && (Preload = Preload.concat(pane.list = pane.list || ["/pane/"+pane.name+".css", "/pane/"+pane.name+".js"]))
        }; Preload = Preload.concat(Config.plugin)

        // 根模块
        name = Config.name, can = {_follow: Config.name, _target: document.body}
        libs = Preload.concat(Config.libs, Config.main.list), cb = function(can) {
            can.onengine._init(can, can.Conf(Config), Config.panes, function(msg) { can.base.Log(can.user.title(), "run", can)
                document.body.onresize = function() { can.onlayout._init(can, can._target) }
            }, can._target)
        }
    }

    var proto = {_name: name, _load: function(name, cb) {
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

            if (libs && libs[0][0] != "/") {
                can._require = can._require||[], can._require.push(libs[0])
                can.require(libs.slice(1), cb, each) 
                return
            }

            // 请求模块
            function next() { can._load(libs[0], each), can.require(libs.slice(1), cb, each) }
            meta.cache[libs[0]]? next(): meta._load(libs[0], next)
        },
        request: function(event, option) { event = event || {}
            event._msg = event._msg || can.misc.Message(event, can)

            can.core.List(arguments, function(option, index) {
                index > 0 && can.core.Item(typeof option == "function"? option(): option, event._msg.Option)
            }); return event._msg
        },
        Conf: function(key, value) { return can.core.Value(can._conf, key, value) }, _conf: {},
    }; can = can || {}; for (var k in proto) { can.hasOwnProperty(k) || (can[k] = proto[k]) }

    if (_can_name) {
        meta.cache[_can_name] = meta.cache[_can_name] || []
        meta.cache[_can_name].push(can)
    } else {
        list.push(can)
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
