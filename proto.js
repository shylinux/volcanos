function shy(help, meta, list, cb) {
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
function Volcanos(name, can, libs, cb) {var list = arguments.callee.list || [], meta = arguments.callee.meta || {
        // 全局属性
        create_time: new Date(), path: "/static/volcanos/", index: 1, cache: {},
    };

    var id = 1, conf = {}, conf_cb = {}, sync = {};
    can[name] || list.push({name: name, can: can, create_time: new Date()}) && (can.__proto__ = {
        // 通用属性
        create_time: new Date(), name: name, help: "插件模块", load: function(name) {
            if (meta.cache[name]) {var cache = meta.cache[name];
                for (var i = 0; i < cache.length; i++) {var item = cache[i];
                    if (item.can.name == can.name) {continue}
                    can[item.name] = item.can;
                }
                return can
            }

            meta.cache[name] = []
            for (var i = meta.index; i < list.length; i++) {var item = list[i];
                if (item.can.name == can.name || item.can.type == "local") {continue}
                can[item.name] = item.can;
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
            function loop(i) {if (i >= interval.length) {return typeof cbs == "function" && cbs(interval)}
                return typeof cb == "function" && cb(interval[i], i, interval), setTimeout(function() {loop(i+1)}, interval[i]);
            }
            return loop(0)
        }),
        Event: shy("触发器", function(event, msg, proto) {
            msg = event.msg = msg || event.msg || {}, msg.__proto__ = proto || msg.__proto__ || {
                Log: shy("输出日志", function() {console.log(arguments)}),
                Echo: shy("输出响应", function(res) {msg.result = msg.result || []
                    for (var i = 0; i < arguments.length; i++) {msg.result.push(arguments[i])}
                    return msg;
                }),
                Table: shy("遍历数据", function(cb) {if (!msg.append || !msg.append.length || !msg[msg.append[0]]) {return}
                    var max = "", len = 0;
                    can.core.List(msg.append, function(key, index) {
                        if (msg[key].length > len) {max = key, len = msg[key].length}
                    });

                    return can.core.List(msg[max], function(value, index, array) {var one = {}
                        can.core.List(msg.append, function(key) {one[key] = msg[key][index]||""})
                        return typeof cb == "function" && cb(one, index, array)
                    })
                }),
            };
            msg.event = event
            return msg
        }),
        Dream: shy("构造器", function(target, type, line, key) {
            var text = line, list = [], item = false, style = ""
            switch (type) {
                case "input":
                    style = " "+line.type
                    list.push(line)
                    break
            }
            var ui = kit.AppendChild(target, item? list: [{view: ["item"+style], data: {id: "item"+can.ID(), draggable: false}, list:list}])
            return ui["item"+style].Meta = text, ui
        }),
        Cache: shy("缓存器", function(name, data) {
            if (data == undefined) {
                return
            }
        }),
        Story: shy("存储器", function(type, meta, list) {
        }),
    }), arguments.callee.meta = meta, arguments.callee.list = list;

    if (libs && libs.length > 0) {
        function next() {
            libs.length > 1? Volcanos(name, can, libs.slice(1), cb): setTimeout(function() {cb(can)}, 10);
        }
        if (can[libs[0]]) {
            // 重复加载
            next()
        } else if (meta.cache[libs[0]]) {
            // 缓存加载
            can.load(libs[0]), next()
        } else {
            // 加载脚本
            var script = document.createElement("script");
            script.src = (can.path||meta.path)+libs[0]+".js";
            script.type = "text/javascript";
            script.onload = function() {can.load(libs[0]), next()}
            document.body.appendChild(script);
        }
    } else {
        typeof cb == "function" && cb(can);
    }
    return can
}

