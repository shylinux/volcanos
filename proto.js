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
var Volcanos = shy("火山架", {libs: [], pack: {}, order: 1, cache: {}, index: 1}, [], function(name, can, libs, cb) {
    var meta = arguments.callee.meta, list = arguments.callee.list
    if (typeof name == "object") { var Config = name
        meta.volcano = Config.volcano, meta.libs = Config.libs
        var Preload = Config.libs; Config.panes.forEach(function(pane) {
            pane.type= "pane"
            pane.list = pane.list || ["/pane/"+pane.name+".css", "/pane/"+pane.name+".js"]
            Preload = Preload.concat(pane.list)
        }); Preload = Preload.concat(Config.plugin)

        name = Config.name, can = { _follow: Config.name,
            _width: window.innerWidth, _height: window.innerHeight,
            _target: document.body, _head: document.head, _body: document.body,
        }, libs = Preload.concat(Config.volcano), cb = function(can) {
            can.onengine._init(can, can.Conf(Config), [], function(msg) {
            }, can._target)
        }
    }

    var conf = {}, conf_cb = {}, cache = {}
    can = can || {}, list.push(can) && (can.__proto__ = {_name: name, _create_time: new Date(), _load: function(name, cb) {
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
                can.core.Item(option, function(key, value) {
                    msg.Option(key, value)
                })
                return event._msg
            }

            var ls = (can._name||can._help).split("/")
            event._pane = ls[ls.length-1]

            var msg = {}; event._msg = msg, msg._event = event, msg._can = can
            msg.__proto__ = { _name: meta.order++, _create_time: new Date(),
                Option: function(key, val) {
                    if (key == undefined) { return msg && msg.option || [] }
                    if (typeof key == "object") { can.core.Item(key, msg.Option) }
                    if (val == undefined) { return msg && msg[key] && msg[key][0] || ""}
                    msg.option = msg.option || [], can.core.List(msg.option, function(k) { if (k == key) {return k} }).length > 0 || msg.option.push(key)
                    msg[key] = can.core.List(arguments).slice(1)
                    return val
                },
                Append: function(key, val) {
                    if (key == undefined) { return msg && msg.append || [] }
                    if (typeof key == "object") { can.core.Item(key, msg.Append) }
                    if (val == undefined) { return msg && msg[key] && msg[key][0] || ""}
                    msg.append = msg.append || [], can.core.List(msg.append, function(k) { if (k == key) {return k} }).length > 0 || msg.append.push(key)
                    msg[key] = can.core.List(arguments).slice(1)
                    return val
                },
                Result: function(cb) {
                    return msg.result && msg.result.join("") || ""
                },
                Table: function(cb) { if (!msg.append || !msg.append.length || !msg[msg.append[0]]) { return }
                    var max = "", len = 0; can.core.List(msg.append, function(key, index) {
                        if (msg[key] && msg[key].length > len) { max = key, len = msg[key].length }
                    })

                    return can.core.List(msg[max], function(value, index, array) { var one = {}, res
                        can.core.List(msg.append, function(key) { one[key] = (msg[key]&&msg[key][index]||"").trim() })
                        return typeof cb == "function" && (res = cb(one, index, array)) && res != undefined && res || one
                    })
                },
                Clear: function(key) {
                    switch (key) {
                        case "append":
                        case "option":
                            can.core.List(msg[key], function(item) {
                                delete(msg[item])
                            })
                        default:
                            msg[key] = []
                    }
                },
                Copy: function(res) { if (!res) { return msg }
                    res.result && (msg.result = (msg.result||[]).concat(res.result))
                    res.append && (msg.append = res.append) && res.append.forEach(function(item) {
                        res[item] && (msg[item] = (msg[item]||[]).concat(res[item]))
                    })
                    res.option && (msg.option = res.option) && res.option.forEach(function(item) {
                        res[item] && (msg[item] = res[item])
                    })
                    return msg
                },
                Push: function(key, value, detail) { msg.append = msg.append || []
                    if (typeof key == "object") {
                        value = value || can.core.Item(key)
                        can.core.List(value, function(item) {
                            detail? msg.Push("key", item).Push("value", key[item]||""):
                                msg.Push(item, key[item]||"")
                        })
                        return
                    }

                    for (var i = 0; i < msg.append.length; i++) {
                        if (msg.append[i] == key) {
                            break
                        }
                    }
                    if (i >= msg.append.length) {msg.append.push(key)}
                    msg[key] = msg[key] || []
                    msg[key].push(""+(typeof value == "object"? JSON.stringify(value): value)+"")
                    return msg
                },
                Echo: function(res) {msg.result = msg.result || []
                    msg._hand = true
                    for (var i = 0; i < arguments.length; i++) {msg.result.push(arguments[i])}
                    return msg
                },
            }
            can.core.Item(option, function(key, value) {
                msg.Option(key, value)
            })
            return msg
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
        Cache: function(name, output, data) {
            if (data) { if (output.children.length == 0) { return }
                // 写缓存
                var temp = document.createDocumentFragment()
                while (output.childNodes.length>0) {
                    var item = output.childNodes[0]
                    item.parentNode.removeChild(item)
                    temp.appendChild(item)
                }

                cache[name] = {node: temp, data: data}
                return name
            }

            output.innerHTML = ""
            var list = cache[name]; if (!list) {return}

            // 读缓存
            while (list.node.childNodes.length>0) {
                var item = list.node.childNodes[0]
                item.parentNode.removeChild(item)
                output.appendChild(item)
            }
            delete(cache[name])
            return list.data
        },
        Timer: shy("定时器, value, [1,2,3,4], {value, length}", function(interval, cb, cbs) {
            interval = typeof interval == "object"? interval || []: [interval]
            var timer = {stop: false}; function loop(timer, i) {
                if (timer.stop || i >= interval.length && interval.length >= 0) {
                    return typeof cbs == "function" && cbs(timer, interval)
                }
                return typeof cb == "function" && cb(timer, interval.value||interval[i], i, interval)?
                    typeof cbs == "function" && cbs(timer, interval): setTimeout(function() { loop(timer, i+1) }, interval.value||interval[i+1])
            }
            setTimeout(function() { loop(timer, 0) }, interval.value||interval[0])
            return timer
        }),
    })

    if (_can_name) {
        meta.cache[_can_name] = meta.cache[_can_name] || []
        meta.cache[_can_name].push(can)
    }
    return can.require(libs, cb), can
})

