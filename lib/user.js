Volcanos("user", {help: "用户模块",
    alert: function(text) {alert(JSON.stringify(text))},
    confirm: function(text) {return confirm(JSON.stringify(text))},
    prompt: function(text, cb) {(text = prompt(text)) != undefined && typeof cb == "function" && cb(text); return text},
    reload: function() {confirm("重新加载页面？") && location.reload()},

    toast: function(text) {},
    carte: function(event, cb) {},

    Share: shy("共享链接", function(can, objs, clear) {var obj = objs || {};
        !clear && can.core.Item(can.user.Search(), function(key, value) {obj[key] || (obj[key] = value)});
        return location.origin+location.pathname+(objs? "?"+can.core.Item(obj, function(key, value) {
            return can.core.List(value, function(value) {return key+"="+encodeURIComponent(value)}).join("&");
        }).join("&"): "");
    }),
    Search: shy("请求参数", function(can, key, value) {var args = {}
        location.search && location.search.slice(1).split("&").forEach(function(item) {var x = item.split("=")
            x[1] != "" && (args[x[0]] = decodeURIComponent(x[1]))
        })

        if (typeof key == "object") {
            can.core.Item(key, function(key, value) {
                if (value != undefined) {args[key] = value}
            })
        } else if (key == undefined) {
            return args
        } else if (value == undefined) {
            return args[key] || can.user.Cookie(can, key)
        } else {
            args[key] = value
        }

        return location.search = can.core.Item(args, function(key, value) {
            return key+"="+encodeURIComponent(value)
        }).join("&")
    }),
    Cookie: shy("会话变量", function(can, key, value, path) {
        function set(k, v) {document.cookie = k+"="+v+";path="+(path||"/")}

        if (typeof key == "object") {
            for (var k in key) {set(k, key[k])}
            key = null
        }
        if (key == undefined) {var cs = {}
            document.cookie.split("; ").forEach(function(item) {
                var cookie = item.split("=")
                cs[cookie[0]] = cookie[1]
            })
            return cs
        }

        value != undefined && set(key, value)
        var result = (new RegExp(key+"=([^;]*);?")).exec(document.cookie)
        return result && result.length > 0? result[1]: ""
    }),

    isWeiXin: navigator.userAgent.indexOf("MicroMessenger") > -1,
    isMobile: navigator.userAgent.indexOf("Mobile") > -1,
    isIPhone: navigator.userAgent.indexOf("iPhone") > -1,
    isMacOSX: navigator.userAgent.indexOf("Mac OS X") > -1,
    isWindows: navigator.userAgent.indexOf("Windows") > -1,
})

