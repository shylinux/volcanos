Volcanos("base", {help: "数据类型",
    Int: function(value, def) {
        return parseInt(value)||def||0
    },
    Obj: function(value, def) {
        try {
            value = typeof value == lang.STRING && value != ""? JSON.parse(value): value
            if (def && def.length > 0 && value.length == 0) { return def }
            return value||def
        } catch (e) {
            return [value]
        }
    },
    Copy: function(to, from, fields) {
        if (arguments.length == 2) {
            for (var k in from) { to[k] = from[k] }
            return to
        }

        var list = []; for (var i = 2; i < arguments.length; i++) {
            list.push(arguments[i])
        }

        for (var i = 0; i < list.length; i++) {
            to[list[i]] = from[list[i]]
        }
        return to
    },
    Eq: function(to, from) { var self = arguments.callee
        if (typeof to != typeof from) { return false }

        if (typeof to == "object") {
            if (to.length != from.length) { return false }
            for (var i = 0; i < to.length; i++) {
                if (!self(to[i], from[i])) { return false }
            }

            for (var k in to) {
                if (!self(to[k], from[k])) { return false }
            }
            return true
        }
        return to === from
    },

    Ext: function(file) {
        return (file.split("/").pop().split(".").pop()).toLowerCase()
    },
    Path: function() { var res = ""
        for (var i = 0; i < arguments.length; i++) {
            res += (arguments[i][0]=="/" || res=="" || res[res.length-1]=="/"? "": "/") + arguments[i].trim()
        }
        return res
    },
    Args: function(obj) {var res = [];
        for (var k in obj) {
            res.push(encodeURIComponent(k)+"="+encodeURIComponent(obj[k]))
        }
        return res.join("&")
    },
    MergeURL: function(url) { var args = {}
        var arg = url.split("?")[1]||""
        arg && arg.split("&").forEach(function(item) {
            var ls = item.split("=")
            args[decodeURIComponent(ls[0])] = decodeURIComponent(ls[1])
        })
        for (var i = 1; i < arguments.length; i++) {
            switch (typeof arguments[i]) {
                case "string":
                    args[arguments[i]] = arguments[i+1], i++
                    break
                case "object":
                    if (arguments[i].length > 0) {
                        for (var j = 0; j < arguments[i].length; j += 2) {
                            args[arguments[i][j]] = arguments[i][j]
                        }
                    } else {
                        for (var k in arguments[i]) {
                            args[k] = arguments[i][k]
                        }
                    }
                    break
            }
        }
        var list = []; for (var k in args) {
            list.push(encodeURIComponent(k)+"="+encodeURIComponent(args[k]))
        }
        return url.split("?")[0]+(list.length>0? "?"+list.join("&"): "")
    },

    Size: function(size) {size = parseInt(size)
        if (size > 1000000000) {
            return parseInt(size / 1000000000) + "." + parseInt(size / 10000000 % 100) + "G"
        }
        if (size > 1000000) {
            return parseInt(size / 1000000) + "." + parseInt(size / 10000 % 100) + "M"
        }
        if (size > 1000) {
            return parseInt(size / 1000) + "." + parseInt(size / 10 % 100) + "K"
        }
        return size + "B"
    },
    Number: function(d, n) { var result = []
        while (d > 0) { result.push(d % 10); d = parseInt(d / 10); n-- }
        while (n > 0) { result.push("0"); n-- }
        return result.reverse(), result.join("")
    },
    Format: function(obj) {
        return JSON.stringify(obj)
    },
    endWith: function(str, end) {
        return str.lastIndexOf(end) + end.length == str.length
    },
    trimSuffix: function(str, end) {
        if (str.indexOf(end) == -1) {
            return str
        }
        return str.slice(0, str.indexOf(end))
    },
    Simple: function() { var res = []
        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i]; switch (typeof arguments[i]) {
                case "number": res.push(arg); break
                case "string": res.push(arg); break
                case "object":
                    if (arg.length > 0) { res = res.concat(arg); break }
                    for (var k in arg) { k && arg[k] && res.push(k, arg[k]) }
                    break
                default: res.push(arg); 
            }
        }
        return res
    },
    AddUniq: function(list, value) { list = list || []
        return list.indexOf(value) == -1 && list.push(value), list
    },

    Date: function(time) { var now = new Date()
        if (typeof time == "string" && time != "") { var ls = time.split(" ")
            var vs = ls[0].split("-")
            now.setFullYear(parseInt(vs[0]))
            now.setMonth(parseInt(vs[1])-1)
            now.setDate(parseInt(vs[2]))

            var vs = ls[1].split(":")
            now.setHours(parseInt(vs[0]))
            now.setMinutes(parseInt(vs[1]))
            now.setSeconds(parseInt(vs[2]))
        } else if (time) {
            now = time
        }
        return now
    },
    Time: function(time, fmt) { var now = this.Date(time)
        var list = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        fmt = fmt||"%H:%M:%S"
        fmt = fmt.replace("%y", now.getFullYear())
        fmt = fmt.replace("%m", this.Number(now.getMonth()+1, 2))
        fmt = fmt.replace("%d", this.Number(now.getDate(), 2))
        fmt = fmt.replace("%w", list[now.getDay()])
        fmt = fmt.replace("%H", this.Number(now.getHours(), 2))
        fmt = fmt.replace("%M", this.Number(now.getMinutes(), 2))
        fmt = fmt.replace("%S", this.Number(now.getSeconds(), 2))
        return fmt
    },
    TimeAdd: function(t, d) {
        return new Date(t - t%(24*3600*1000) - 8*3600*1000 + d*24*3600*1000)
    },
    Duration: function(n) { var res = "", h = 0
        h = parseInt(n/3600000/24), h > 0 && (res += h+"d"), n = n % (3600000*24)
        h = parseInt(n/3600000), h > 0 && (res += h+"h"), n = n % 3600000
        h = parseInt(n/60000), h > 0 && (res += h+"m"), n = n % 60000
        h = parseInt(n/1000), h > 0 && (res += h), n = n % 1000
        return res + (n > 0? "."+parseInt(n/10): "") + "s"
    },

    parseSize: function(size) { size = size.toLowerCase()
        if (size.endsWith("tb") || size.endsWith("t")) {
            return parseInt(size) * 1024 * 1024 * 1024 * 1024
        }
        if (size.endsWith("gb") || size.endsWith("g")) {
            return parseInt(size) * 1024 * 1024 * 1024
        }
        if (size.endsWith("mb") || size.endsWith("m")) {
            return parseInt(size) * 1024 * 1024
        }
        if (size.endsWith("kb") || size.endsWith("k")) {
            return parseInt(size) * 1024
        }
        return parseInt(size)
    },
    parseJSON: function(str) { var res
        if (typeof str == "object") { return str }
        if (str.indexOf("http") == 0) { var ls = str.split("?")
            res = {type: "link", name: "", text: str}
            res.name = ls[0].split("://").pop().split("/")[0]
            ls[1] && ls[1].split("&").forEach(function(item) { var ls = item.split("=")
                res[decodeURIComponent(ls[0])] = decodeURIComponent(ls[1])
            })
            return res
        }
        try { res = JSON.parse(str)
            res.text = res.text||str
            res.type = res.type||"json"
        } catch (e) {
            res = {type: "text", text: str}
        }
        return res
    },
    isNight: function() { var now = new Date()
        return now.getHours() < 7 || now.getHours() > 17
    },

    join: function(list, sp) { return (list||[]).join(sp||" ") },
    trim: function(args) { if (this.isString(args)) { return args.trim() }
        if (this.isArray(args)) { for (var i = args.length-1; i >= 0; i--) { if (!args[i]) { args.pop() } else { break } } }
        return args
    },
    isString: function(arg) { return typeof arg == "string" },
    isObject: function(arg) { return typeof arg == "object" },
    isArray: function(arg) { return typeof arg == "object" && arg.length != undefined },
    isFunction: function(arg) { return typeof arg == "function" },
    isCallback: function(key, value) { return key.indexOf("on") == 0 && can.base.isFunc(value) },
    isFunc: function(cb) { return typeof cb == "function" },
    isUndefined: function(arg) { return arg == undefined },
    isNull: function(arg) { return arg == null },
})

