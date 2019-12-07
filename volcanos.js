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
        path: "/static/volcanos/", index: 1,
    };

    var id = 1, conf = {}, conf_cb = {}, sync = {};
    can[name] || list.push({name: name, can: can, create_time: new Date()}) && (can.__proto__ = {
        // 通用属性
        create_time: new Date(), name: name, help: "静态模块", load: shy("加载器", function() {
            for (var i = meta.index; i < list.length; i++) {var item = list[i];
                can[item.name] = item.can, item.can.name != can.name && (item.can.name = can.name + "." + item.name);
            }
            meta.index = i;
            return can
        }),
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
        Dream: shy("构造器", function(target, type, msg, list) {
            switch (type) {
                case "table":
                    var table = can.node.Append(can, target, type)
                    var tr = can.node.Append(can, table, "tr");
                    can.core.List(list, function(key) {can.node.Append(can, tr, "th", key)});
                    msg.Table(function(line) {var tr = can.node.Append(can, table, "tr");
                        can.core.List(list, function(key) {can.node.Append(can, tr, "td", can.node.Display(line[key]))});
                    })
                    return table
            }
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
        if (can[libs[0]]) {
            // 重复加载
            libs.length > 1? Volcanos(name, can, libs.slice(1), cb): cb(can);
        } else {
            // 加载脚本
            var script = document.createElement("script");
            script.src = (can.path||meta.path)+libs[0]+".js";
            script.type = "text/javascript";
            script.onload = function() {
                can.load(), libs.length > 1? Volcanos(name, can, libs.slice(1), cb): cb(can);
            }
            document.body.appendChild(script);
        }
    } else {
        typeof cb == "function" && cb(can);
    }
    return can
}

Volcanos("type", {help: "类型模块",
    isNone: function(c) {return c === undefined || c === null},
    isSpace: function(c) {return c == " " || c == "Enter"},

    Format: shy("数据格式化", function(obj) {return JSON.stringify(obj)}),
    Number: shy("数字格式化", function(d, n) {var result = [];
        while (d>0) {result.push(d % 10); d = parseInt(d / 10); n--}
        while (n > 0) {result.push("0"); n--}
        result.reverse();
        return result.join("");
    }),
    Time: shy("时间格式化", function(t, fmt) {var now = t? new Date(t): new Date();
        fmt = fmt || "%y-%m-%d %H:%M:%S";
        fmt = fmt.replace("%y", now.getFullYear())
        fmt = fmt.replace("%m", kit.number(now.getMonth()+1, 2))
        fmt = fmt.replace("%d", kit.number(now.getDate(), 2))
        fmt = fmt.replace("%H", kit.number(now.getHours(), 2))
        fmt = fmt.replace("%M", kit.number(now.getMinutes(), 2))
        fmt = fmt.replace("%S", kit.number(now.getSeconds(), 2))
        return fmt
    }),
})
Volcanos("core", {help: "核心模块",
    List: shy("迭代器", function(obj, cb, interval, cbs) {obj = typeof obj == "string"? [obj]: (obj || [])
        if (interval > 0) {
            function loop(i) {if (i >= obj.length) {return typeof cbs == "function" && cbs(obj)}
                typeof cb == "function" && cb(obj[i], i, obj), setTimeout(function() {loop(i+1)}, interval);
            }
            obj.length > 0 && setTimeout(function() {loop(0)}, interval/4);
            return obj;
        }

        var list = [], res;
        for (var i = 0; i < obj.length; i++) {
            typeof cb == "function"? (res = cb(obj[i], i, obj)) != undefined && list.push(res): list.push(res);
        }
        return list;
    }),
})
Volcanos("misc", {help: "其它模块",

})
Volcanos("node", {help: "节点模块",
    Display: function(text) {
        if (text.startsWith("http")) {return "<a href='"+text+"' target='_blank'>"+text+"</a>"}
        return text
    },
    Select: shy("选择器", function(obj, key, list, cb, interval, cbs) {
        var item = obj && obj.querySelectorAll(key);
        return list? list(item, cb, interval, cbs): item;
    }),
    Modify: shy("修改节点", function(can, target, value) {
        if (typeof value == "string") {target.innerHTML = value}
        return target
    }),
    Append: shy("添加节点", function(can, target, key, value) {
        if (typeof key == "string") {var res = document.createElement(key);
            return target.appendChild(res), can.node.Modify(can, res, value);
        }
    }),
    AppendTable: shy("添加表格", function(can, target, msg, list) {
        var table = can.node.Append(can, target, "table")
        var tr = can.node.Append(can, table, "tr");
        can.core.List(list, function(key) {can.node.Append(can, tr, "th", key)});
        msg.Table(function(line) {var tr = can.node.Append(can, table, "tr");
            can.core.List(list, function(key) {can.node.Append(can, tr, "td", can.node.Display(line[key]))});
        })
        return table
    }),
})
Volcanos("user", {help: "用户模块",
    toast: function(text) {},
    alert: function(text) {alert(JSON.stringify(text))},
    confirm: function(text) {return confirm(JSON.stringify(text))},
    prompt: function(text, cb) {(text = prompt(text)) != undefined && typeof cb == "function" && cb(text); return text},
    reload: function() {confirm("重新加载页面？") && location.reload()},

    isWeiXin: navigator.userAgent.indexOf("MicroMessenger") > -1,
    isMobile: navigator.userAgent.indexOf("Mobile") > -1,
    isIPhone: navigator.userAgent.indexOf("iPhone") > -1,
    isMacOSX: navigator.userAgent.indexOf("Mac OS X") > -1,
    isWindows: navigator.userAgent.indexOf("Windows") > -1,
})
