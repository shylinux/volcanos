function shy(help, meta, list, cb) { // 封装函数
    var index = -1, value = "", type = "string", args = arguments;
    function next(check) {
        if (++index >= args.length) {return false}
        if (check && check != typeof args[index]) {index--; return false}
        return value = args[index], type = typeof value, value;
    }

    var cb = arguments[arguments.length-1] || function() {};
    cb.help = next("string") || "还没有写";
    cb.meta = next("object") || {};
    cb.list = next("object") || {};
    cb.runs = function() {};
    return cb;
}
function Volcanos(name, can, libs, cb, msg) { // 封装模块
    // 全局属性
    var list = arguments.callee.list || [], meta = arguments.callee.meta || {
        create_time: new Date(), path: "/static/volcanos/", index: 1, cache: {},
    };

    can = can || {};
    can._name = name;

    // 定义原型
    var id = 1, conf = {}, conf_cb = {}, sync = {}, cache = {};
    can[name] || list.push({_name: name, can: can, create_time: new Date()}) && (can.__proto__ = {
        _create_time: new Date(), _name: name, _path: "", _help: "插件模块", load: function(name) {
            if (meta.cache[name]) {var cache = meta.cache[name];
                for (var i = 0; i < cache.length; i++) {var item = cache[i];
                    if (item.can._name == can._name) {continue}
                    can[item._name] = item.can;
                }
                return can
            }

            meta.cache[name] = []
            for (var i = meta.index; i < list.length; i++) {var item = list[i];
                if (item.can._name == can._name || item.can._type == "local") {continue}
                can[item._name] = item.can;
                meta.cache[name].push(item);
            }
            meta.index = i;
            return can
        },
        ID: shy("生成器", function() {return id++}),
        Log: shy("日志器", function() {console.log(arguments)}),
        Conf: shy("配置器", function(key, value, cb) {if (key == undefined) {return conf}
            if (typeof key == "object") {conf = key; return conf}
            typeof cb == "function" && (conf_cb[key] = cb);
            if (value != undefined) {var old = conf[key], res; can.Log("conf", key, old, value);
                conf[key] = conf_cb[key] && (res = conf_cb[key](value, old, key)) != undefined && res || value
            }
            return conf[key]
        }),
        Sync: shy("同步器", function(name) {var data = "", list = []; name = name||"sync"+can.ID()
            return sync[name] || (sync[name] = {
                watch: shy("监听变量", function(cb) {typeof cb == "function" && list.push(cb); return list.length-1}),
                get: shy("读取变量", function() {return data}),
                set: shy("设置变量", function(value, force) {if (value == undefined) {return data}
                    if (value == data && !force) {return data}
                    can.Log("sync", name, data, value);
                    for (var i = 0; i < list; i++) {list[i](value, data, name)}
                    return data = value
                }),
            })
        }),
        Timer: shy("定时器", function(interval, cb, cbs) {interval = typeof interval == "object"? interval || []: [interval];
            var timer = {stop: false};
            function loop(i) {if (timer.stop || i >= interval.length && interval.length >= 0) {return typeof cbs == "function" && cbs(interval)}
                return typeof cb == "function" && cb(interval.value||interval[i], i, interval)?
                    typeof cbs == "function" && cbs(interval): setTimeout(function() {loop(i+1)}, interval.value||interval[i+1]);
            }
            setTimeout(function() {loop(0)}, interval.value||interval[0]);
            return timer;
        }),
        Event: shy("触发器", function(event, msg, proto) {event = event || {};
            msg = event.msg = msg || event.msg || {}, msg.__proto__ = proto || {
                _create_time: can.base.Time(), _source: can,
                Log: shy("输出日志", function() {console.log(arguments)}),
                Ids: function(index, key) {
                    var id = index;
                    msg && msg.id && (id = msg.id[index]) || msg && msg.name && (id = msg.name[index]);
                    return id;
                },
                Option: function(key, val) {
                    if (val == undefined) {return msg && msg[key] && msg[key][0] || ""}
                    msg.option = msg.option || []
                    can.core.List(msg.option, function(k) {
                        if (k == key) {return k}
                    }).length > 0 || msg.option.push(key)
                    msg[key] = can.core.List(arguments).slice(1)
                },
                Echo: shy("输出响应", function(res) {msg.result = msg.result || []
                    msg._hand = true
                    for (var i = 0; i < arguments.length; i++) {msg.result.push(arguments[i])}
                    return msg;
                }),
                Copy: function(res) {
                    res.result && (msg.result = res.result)
                    res.append && (msg.append = res.append) && res.append.forEach(function(item) {
                        res[item] && (msg[item] = res[item])
                    })
                    return msg
                },
                Table: shy("遍历数据", function(cb) {if (!msg.append || !msg.append.length || !msg[msg.append[0]]) {return}
                    var max = "", len = 0;
                    can.core.List(msg.append, function(key, index) {
                        if (msg[key].length > len) {max = key, len = msg[key].length}
                    });

                    return can.core.List(msg[max], function(value, index, array) {var one = {}, res;
                        can.core.List(msg.append, function(key) {one[key] = msg[key][index]||""})
                        return typeof cb == "function" && (res = cb(one, index, array)) && res != undefined && res || one
                    })
                }),
                Result: function() {
                    return msg.result && msg.result.join("") || "";
                },
                Export: function(name) {var ext = ".csv", txt = "";
                    msg.append && msg.append.length > 0? txt = can.core.List(msg.append, function(key) {return key}).join(",")+"\n"+
                    can.core.List(msg.Table(), function(line, index) {
                        return can.core.List(msg.append, function(key) {return line[key]}).join(",")
                    }).join("\n"): (ext = ".txt", txt = msg.Result())
                    return [name, ext, txt]
                },
            };
            msg.event = event
            return msg
        }),
        Dream: shy("构造器", function(target, type, line, key) {
            if (type.endsWith(".css")) {
                var style = document.createElement("link");
                style.rel = "stylesheet", style.type = "text/css";
                style.href = (can._path||meta.path)+type
                style.onload = line;
                target.appendChild(style);
                return style
            }
            if (type.endsWith(".js")) {
                var script = document.createElement("script");
                script.src = (can._path||meta.path)+type,
                script.onload = line;
                target.appendChild(script);
                return script
            }
            var text = line, list = [], item = false, style = ""
            switch (type) {
                case "input":
                    style = " "+line.type
                    list.push(line)
                    break
            }
            var ui = can.page.Append(can, target, item? list: [{view: ["item"+style], data: {id: "item"+can.ID(), draggable: false}, list:list}])
            return ui["item"+style].Meta = text, ui
        }),
        Cache: shy("缓存器", function(name, output, data) {
            if (data) {
                var temp = document.createDocumentFragment()
                while (output.childNodes.length>0) {
                    var item = output.childNodes[0]
                    item.parentNode.removeChild(item)
                    temp.appendChild(item)
                }
                cache[name] = {node: temp, data: data}
                return name
            }

            var list = cache[name];
            if (!list) {return}
            while (list.node.childNodes.length>0) {
                var item = list.node.childNodes[0]
                item.parentNode.removeChild(item)
                output.appendChild(item)
            }
            delete(cache[name])
            return list.data
        }),
        Story: shy("存储器", function(type, meta, list) {
        }),
    }), arguments.callee.meta = meta, arguments.callee.list = list;

    // 加载模块
    function next() {
        libs && libs.length > 1? Volcanos(name, can, libs.slice(1), cb):
            typeof cb == "function" && setTimeout(function() {cb(can);
                if (!can.target) {return}
                can.core.Item(can.onaction, function(key, cb) {key.indexOf("on") == 0 && (can.target[key] = function(event) {
                    cb(event, can);
                })});

                can.target.oncontextmenu = function(event) {
                    can.user.carte(event, shy("", can.onchoice, can.onchoice.list, function(event, key, meta) {var cb = meta[key];
                        typeof cb == "function"? cb(event, can, msg, key, event.target):
                            can.run(event, [typeof cb == "string"? cb: key, event.target], null, true)
                    }), can)
                    event.stopPropagation()
                    event.preventDefault()
                }
            }, 10);
    }
    if (libs && libs.length > 0) {
        if (can[libs[0]]) {
            // 重复加载
            next()
        } else if (meta.cache[libs[0]]) {
            // 缓存加载
            can.load(libs[0]), next()
        } else {
            // 加载脚本
            if (libs[0].indexOf(".") == -1) {libs[0] += ".js"}
            if (libs[0].endsWith(".wasm")) {var go = new Go();
                WebAssembly.instantiateStreaming(fetch(libs[0]), go.importObject).then((result) => {
                    go.argv = [can];
                    go.run(result.instance);
                    next();
                }).catch((err) => {
                    console.error(err);
                });
            } else {
                can.Dream(document.body, libs[0], function() {
                    can.load(libs[0]), next();
                })
            }
        }
    } else {
        // 独立模块
        next()
    }
    return can
}

