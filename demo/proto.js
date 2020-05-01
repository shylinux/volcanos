// volcanos: 前端 火山架 我看不行
// FMS: a fieldset manager system

function shy(help, meta, list, cb) {
    var index = -1, value = "", type = "string", args = arguments; function next(check) {
        if (++index >= args.length) {return false}
        if (check && check != typeof args[index]) {index--; return false}
        return value = args[index], type = typeof value, value;
    }

    var cb = arguments[arguments.length-1] || function() {};
    cb.help = next("string") || "还没有写";
    cb.meta = next("object") || {};
    cb.list = next("object") || [];
    return cb;
}
var Volcanos = shy("火山架", {cache: {}, index: 1, order: 1, debug: {
    volcano: false, config: true,
    require: true, cache: false, frame: false,
    request: true, search: true,
}}, [], function(name, can, libs, cb) {
    var meta = arguments.callee.meta, list = arguments.callee.list;

    var conf = {}, conf_cb = {}, sync = {}, cache = {};
    meta.debug["volcano"] && console.debug("volcano", name, "create");
    can = can || {}, list.push(can) && (can.__proto__ = { _name: name, _create_time: new Date(), _load: function(name) {
            for (var cache = meta.cache[name] || []; meta.index < list.length; meta.index++) {
                if (list[meta.index] == can) {continue}
                meta.debug["cache"] && console.debug("cache", name, "load", meta.index, list[meta.index]);
                cache.push(list[meta.index]);
                // 加载缓存
            }

            for (var i = 0; i < cache.length; i++) {
                meta.debug["frame"] && console.debug("frame", can._name, "load", i, cache[i]);
                can[cache[i]._name] = cache[i];
                // 加载索引
            }
            meta.cache[name] = cache;
        },
        require: function(libs, cb) { if (!libs || libs.length == 0) {
                typeof cb == "function" && setTimeout(function() {cb(can)}, 10);
                return // 加载完成
            }

            meta.debug["require"] && console.debug("volcano", can._name, "require", libs[0]); if (meta.cache[libs[0]]) {
                can._load(libs[0]), can.require(libs.slice(1), cb);
                return // 缓存加载
            }

            var target = libs[0].endsWith(".css")? (can._head||document.head): (can._body||document.body);
            var source = !libs[0].endsWith("/") && (libs[0].indexOf(".") == -1? libs[0]+".js": libs[0]) || libs[0];

            if (source.endsWith(".js")) { var script = document.createElement("script");
                script.src = source, script.onload = function() {
                    // meta.debug["require"] && console.debug("volcano", can._name, "required", libs[0]);
                    can._load(libs[0]), can.require(libs.slice(1), cb);
                } // 加载脚本
                target.appendChild(script);

            } else if (source.endsWith(".css")) { var style = document.createElement("link");
                style.rel = "stylesheet", style.type = "text/css";
                style.href = source; style.onload = function() {
                    // meta.debug["require"] && console.debug("volcano", can._name, "required", libs[0]);
                    can._load(libs[0]), can.require(libs.slice(1), cb);
                } // 加载样式
                target.appendChild(style);
            }
        },
        request: function(event, msg, proto) { event = event || {};
            if (!msg && event.msg) { return event.msg }

            event.msg = msg = msg || {}, msg.event = event;
            msg.__proto__ = proto || { _name: meta.order++, _create_time: new Date(),
                Option: function(key, val) {
                    if (val == undefined) { return msg && msg[key] && msg[key][0] || "" }
                    msg.option = msg.option || [], can.core.List(msg.option, function(k) {
                        if (k == key) {return k}
                    }).length > 0 || msg.option.push(key)
                    msg[key] = can.core.List(arguments).slice(1)
                },
                Copy: function(res) { if (!res) { return msg }
                    res.result && (msg.result = res.result)
                    res.append && (msg.append = res.append) && res.append.forEach(function(item) {
                        res[item] && (msg[item] = res[item])
                    })
                    res.option && (msg.option = res.option) && res.option.forEach(function(item) {
                        res[item] && (msg[item] = res[item])
                    })
                    return msg
                },
                Table: shy("遍历数据", function(cb) { if (!msg.append || !msg.append.length || !msg[msg.append[0]]) { return }
                    var max = "", len = 0; can.core.List(msg.append, function(key, index) {
                        if (msg[key].length > len) { max = key, len = msg[key].length }
                    });

                    return can.core.List(msg[max], function(value, index, array) { var one = {}, res;
                        can.core.List(msg.append, function(key) { one[key] = msg[key][index]||"" })
                        return typeof cb == "function" && (res = cb(one, index, array)) && res != undefined && res || one
                    })
                }),
            }
            return msg
        },

        Conf: function(key, value, cb) { if (key == undefined) { return conf }
            if (typeof key == "object") { conf = key; return conf }
            typeof cb == "function" && (conf_cb[key] = cb);
            if (value != undefined) {var old = conf[key], res; meta.debug["config"] && console.debug("volcano", can._name, "config", key, value, old)
                conf[key] = conf_cb[key] && (res = conf_cb[key](value, old, key)) != undefined && res || value
            }
            return conf[key] || ""
        },
        Timer: shy("定时器, value, [1,2,3,4], {value, length}", function(interval, cb, cbs) { interval = typeof interval == "object"? interval || []: [interval];
            var timer = {stop: false};
            function loop(event, i) {if (timer.stop || i >= interval.length && interval.length >= 0) {return typeof cbs == "function" && cbs(event, interval)}
                return typeof cb == "function" && cb(event, interval.value||interval[i], i, interval)?
                    typeof cbs == "function" && cbs(event, interval):
                        setTimeout(function() {loop(event, i+1)}, interval.value||interval[i+1]);
            }
            setTimeout(function(event) {loop(event, 0)}, interval.value||interval[0]);
            return timer;
        }),
        Cache: shy("缓存器", function(name, output, data) {
            if (data) { if (output.children.length == 0) { return }
                // 写缓存
                var temp = document.createDocumentFragment();
                while (output.childNodes.length>0) {
                    var item = output.childNodes[0];
                    item.parentNode.removeChild(item);
                    temp.appendChild(item);
                }

                cache[name] = {node: temp, data: data}
                console.log("volcano", can._name, "save", name, cache[name]);
                return name
            }

            var list = cache[name];
            if (!list) {return}
            console.log("volcano", can._name, "load", name, cache[name]);

            // 读缓存
            while (list.node.childNodes.length>0) {
                var item = list.node.childNodes[0];
                item.parentNode.removeChild(item);
                output.appendChild(item);
            }
            delete(cache[name]);
            return list.data;
        }),
    });

    return can.require(libs, cb), can
})
