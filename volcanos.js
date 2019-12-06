function Volcanos(name, can, libs, cb) {var list = arguments.callee.list || [], meta = arguments.callee.meta || {
        // 全局属性
        path: "/static/volcanos/", index: 1,
    };
    can[name] || list.push({name: name, can: can, create_time: new Date()}) && (can.__proto__ = {
        // 通用属性
        create_time: new Date(),
        name: name, help: "静态模块", load: function() {
            for (var i = meta.index; i < list.length; i++) {var item = list[i];
                can[item.name] = item.can, item.can.name != can.name && (item.can.name = can.name + "." + item.name);
            }
            meta.index = i
        },
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
    Format: function(obj) {return JSON.stringify(obj)},

    List: function(obj, cb, interval, cbs) {obj = typeof obj == "string"? [obj]: (obj || [])
        if (interval > 0) {
            function loop(i) {if (i >= obj.length) {return kit._call(cbs)}
                kit._call(cb, [obj[i], i, obj]), setTimeout(function() {loop(i+1)}, interval)
            }
            obj.length > 0 && setTimeout(function() {loop(0)}, interval/4)
            return obj
        }

        var list = []
        for (var i = 0; i < obj.length; i++) {
            kit.Push(list, kit._call(cb, [obj[i], i, obj]))
        }
        return list
    },
})
Volcanos("core", {help: "核心模块",
    Log: function() {
    },
})
Volcanos("node", {help: "节点模块",
    Log: function() {
    },
    Split: function() {},
})
Volcanos("misc", {help: "其它模块",

})
Volcanos("device", {help: "设备模块",
    isWeiXin: navigator.userAgent.indexOf("MicroMessenger") > -1,
    isMobile: navigator.userAgent.indexOf("Mobile") > -1,
    isIPhone: navigator.userAgent.indexOf("iPhone") > -1,
    isMacOSX: navigator.userAgent.indexOf("Mac OS X") > -1,
    isWindows: navigator.userAgent.indexOf("Windows") > -1,
})
