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
    // 全局缓存
    var list = arguments.callee.list || [], meta = arguments.callee.meta || {index: 1, cache: {}};
    arguments.callee.meta = meta, arguments.callee.list = list;

    // 定义原型
    var id = 1, conf = {}, conf_cb = {}, sync = {}, cache = {};
    can = can || {}, list.push(can) && (can.__proto__ = {_name: name, _help: "插件模块", _create_time: new Date(), _load: function(name) {
            if (meta.cache[name]) {var cache = meta.cache[name];
                for (var i = 0; i < cache.length; i++) {var sub = cache[i];
                    // if (sub._name == can._name) {continue}
                    // 加载索引
                    can[sub._name] = sub;
                    typeof sub._spawn == "function" && sub._spawn(can, sub)
                }
                return can
            }

            meta.cache[name] = []
            for (var i = meta.index; i < list.length; i++) {var sub = list[i];
                // if (sub._name == can._name) {continue}
                if (sub._type == "local"|| sub._type == "input" || sub._type == "output") {continue}
                // 加载缓存
                can[sub._name] = sub;
                meta.cache[name].push(sub);
                typeof sub._spawn == "function" && sub._spawn(can, sub)
            }
            meta.index = i;
            return can
        },
        require: function(libs, cb) {
            if (!libs || libs.length == 0) {
                // 加载完成
                typeof cb == "function" && setTimeout(function() {cb(can)}, 10);
                return
            }

            if (can[libs[0]]) {
                // 已经加载
                can.require(libs.slice(1), cb)
                return
            }
            if (meta.cache[libs[0]]) {
                // 缓存加载
                can._load(libs[0]), can.require(libs.slice(1), cb)
                return
            }

            if (libs[0].endsWith(".wasm")) {var go = new Go();
                // 加载汇编
                WebAssembly.instantiateStreaming(fetch(libs[0]), go.importObject).then((result) => {
                    go.argv = [can];
                    go.run(result.instance);
                    can.require(libs.slice(1), cb);
                }).catch((err) => {
                    console.error(err);
                });
                return
            }

            // 加载脚本
            can.Dream(document.body, !libs[0].endsWith("/") && libs[0].indexOf(".") == -1? libs[0]+".js": libs[0], function() {
                can._load(libs[0]), can.require(libs.slice(1), cb);
            })
        },
        Name: function() {return can._name.toLowerCase()},

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
            // value
            // [1,2,3,4]
            // {value, length}
            var timer = {stop: false};
            function loop(event, i) {if (timer.stop || i >= interval.length && interval.length >= 0) {return typeof cbs == "function" && cbs(event, interval)}
                return typeof cb == "function" && cb(event, interval.value||interval[i], i, interval)?
                    typeof cbs == "function" && cbs(event, interval):
                        setTimeout(function() {loop(event, i+1)}, interval.value||interval[i+1]);
            }
            setTimeout(function(event) {loop(event, 0)}, interval.value||interval[0]);
            return timer;
        }),
        Event: shy("触发器", function(event, msg, proto) {event = event || {};
            if (!msg && event.msg) {return event.msg}

            event.msg = msg = msg || {}, msg.__proto__ = proto || {
                __proto__: can, _create_time: can.base.Time(),
                option: [],
                Log: shy("输出日志", function() {console.log(arguments)}),
                Ids: function(index, key) {var id = index;
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
                Push: function(key, value) {msg.append = msg.append || []
                    if (typeof key == "object") {
                        value? can.core.List(value, function(item) {
                            msg.Push(item, key[item]||"")
                        }): can.core.Item(key, function(key, value) {
                            msg.Push(key, value||"")
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
                    msg[key].push(""+value)
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
                    res.option && (msg.option = res.option) && res.option.forEach(function(item) {
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
            return msg.event = event, msg
        }),
        Dream: shy("构造器", function(target, type, line) {
            if (type.endsWith(".css")) {
                var style = document.createElement("link");
                style.rel = "stylesheet", style.type = "text/css";
                style.href = (type.startsWith("/")? "": Config.volcano)+type;
                style.onload = line;
                target.appendChild(style);
                return style
            }
            if (type.endsWith(".js")) {
                var script = document.createElement("script");
                script.src = (type.startsWith("/")? "": Config.volcano)+type;
                script.onload = line
                target.appendChild(script);
                return script
            }
            if (type.endsWith("/")) {
                typeof line == "function" && line()
                return
            }

            var text = line, list = [], item = false, style = ""
            switch (type) {
                case "option":
                    list.push({text: line.name+": "})
                case "input":
                    style = " "+line.type
                    list.push(line)
                    break
            }
            var ui = can.page.Append(can, target, item? list: [{view: ["item"+style], list:list}])
            return ui["item"+style].Meta = text, ui
        }),
        Cache: shy("缓存器", function(name, output, data) {
            if (data) {
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

            var list = cache[name];
            if (!list) {return}

            // 读缓存
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
    });

    can.require(libs, function() {
        can.onimport && can.onimport._begin && can.onimport._begin(can)
        typeof cb == "function" && cb(can);
        if (can.target) {
            function run(event, msg, key, cb) {
                if (typeof cb == "function") {
                    // 本地命令
                    cb(event, can, msg, key, can.target)
                } else {
                    // 本地命令
                    can.run(event, ["action", key], function(msg) {can.Import(event, msg, key)}, true)
                }
            }

            // 注册控件
            can.action && (can.action.innerHTML = ""), can.onaction && can.page.AppendAction(can, can.action, can.onaction.list, function(event, value, key) {
                key? run(event, key, value, can.onaction[key]||can.onaction[value]): run(event, msg, value, can.onaction[value]);
            })
            // 注册菜单
            can.target.oncontextmenu = function(event) {can.user.carte(event, shy("", can.onchoice, can.onchoice.list, function(event, key, meta) {
                run(event, msg, key, can.onchoice[key] || can.onaction[key]);
            }), can), event.stopPropagation(), event.preventDefault()}

            // 注册事件
            can.core.Item(can.onaction, function(key, cb) {key.indexOf("on") == 0 && (can.target[key] = function(event) {cb(event, can)})});
        }
        can.onimport && can.onimport._start && can.onimport._start(can)
    })
    return can
}

