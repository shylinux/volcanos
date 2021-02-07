Volcanos("base", {help: "数据类型",
    Int: function(value, def) { return parseInt(value)||def||0 },
    Obj: function(value, def) {
        try {
            return (typeof value == "string" && value != ""? JSON.parse(value): value) || def || {}
        } catch (e) {
            return [value]
        }
    },
    Copy: function(to, from, fields) {
        var list = []
        for (var i = 2; i < arguments.length; i++) {
            list.push(arguments[i])
        }

        for (var i = 0; i < list.length; i++) {
            to[list[i]] = from[list[i]]
        }
    },
    Eq: function(obj, other) { var self = arguments.callee
        if (typeof obj != typeof other) { return false }

        if (typeof obj == "object") {
            if (obj.length != other.length) { return false }
            for (var i = 0; i < obj.length; i++) {
                if (!self(obj[i], other[i])) { return false }
            }

            for (var k in obj) {
                if (!self(obj[k], other[k])) { return false }
            }
            return true
        }
        return obj === other
    },

    Ext: function(file) { return (file.split("/").pop().split(".").pop()).toLowerCase() },
    Path: function() { var res = ""
        for (var i = 0; i < arguments.length; i++) {
            res += (arguments[i].indexOf("/") == 0 || res.indexOf("/")==res.length-1? "": "/") + arguments[i].trim()
        }
        return res
    },
    Args: function(obj) {var res = [];
        for (var k in obj) {
            res.push(encodeURIComponent(k)+"="+encodeURIComponent(obj[k]))
        }
        return res.join("&")
    },
    URLMerge: function(url) { var args = {}
        var arg = url.split("?")[1]||""
        arg && arg.split("&").forEach(function(item) {
            var ls = item.split("=")
            args[decodeURIComponent(ls[0])] = decodeURIComponent(ls[1])
        })
        for (var i = 1; i < arguments.length; i++) {
            switch (typeof arguments[i]) {
                case "object":
                    if (arguments[i].length > 0) {
                        for (var j = 0; j < arguments[i].length; j += 2) {
                            args[arguments[i][j]] = arguments[i][j]
                        }
                        break
                    } 
                    for (var k in arguments[i]) {
                        args[k] = arguments[i][k]
                    }
                    break
                case "string":
                    args[arguments[i]] = arguments[i+1]
                    i++
                    break
            }
        }
        var list = []; for (var k in args) {
            list.push(encodeURIComponent(k)+"="+encodeURIComponent(args[k]))
        }
        return url.split("?")[0]+(list.length>0? "?"+list.join("&"): "")
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
    Time: shy("时间格式化", function(time, fmt) { var now = this.Date(time)
        var list = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
        fmt = fmt || "%y-%m-%d %H:%M:%S"
        fmt = fmt.replace("%y", now.getFullYear())
        fmt = fmt.replace("%m", this.Number(now.getMonth()+1, 2))
        fmt = fmt.replace("%d", this.Number(now.getDate(), 2))
        fmt = fmt.replace("%w", list[now.getDay()])
        fmt = fmt.replace("%H", this.Number(now.getHours(), 2))
        fmt = fmt.replace("%M", this.Number(now.getMinutes(), 2))
        fmt = fmt.replace("%S", this.Number(now.getSeconds(), 2))
        return fmt
    }),
    Duration: function(n) { var res = "", h = 0
        h = parseInt(n/3600000/24), h > 0 && (res += h+"d"), n = n % (3600000*24)
        h = parseInt(n/3600000), h > 0 && (res += h+"h"), n = n % 3600000
        h = parseInt(n/60000), h > 0 && (res += h+"m"), n = n % 60000
        h = parseInt(n/1000), h > 0 && (res += h), n = n % 1000
        return res + (n > 0? "."+parseInt(n/10): "") + "s"
    },
    Format: shy("数据格式化", function(obj) { return JSON.stringify(obj) }),
    Number: shy("数字格式化", function(d, n) { var result = []
        while (d > 0) { result.push(d % 10); d = parseInt(d / 10); n-- }
        while (n > 0) { result.push("0"); n-- }
        return result.reverse(), result.join("")
    }),
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
    isNight: function() { var now = new Date()
        return now.getHours() < 7 || now.getHours() > 17
    },
    TimeAdd: shy("时间格式化", function(t, d) {
        return new Date(t - t%(24*3600*1000) - 8*3600*1000 + d*24*3600*1000)
    }),

    Debug: function() {
        var args = [this.Time(null, "%H:%M:%S"), this.FileLine(2, 3), "debug"]
        for (var i in arguments) { args.push(arguments[i]) }
        args.push(this.fileLine(2, 3))
        console.log.apply(console, args)
    },
    Warn: function() {
        var args = [this.Time(null, "%H:%M:%S"), this.FileLine(2, 3), "warn"]
        for (var i in arguments) { args.push(arguments[i]) }
        args.push("\n", this._fileLine().split("\n").slice(2).join("\n"))
        console.log.apply(console, args)
    },
    Log: function() {
        var args = [this.Time(null, "%H:%M:%S"), this.FileLine(2, 3)]
        for (var i in arguments) { args.push(arguments[i]) }
        console.log.apply(console, args)
    },
    FileLine: function(depth, length) {
        return this.fileLine(depth+1).split("/").slice(3).slice(-length).join("/").split(")")[0]
    },
    fileLine: function(depth) {
        return (this._fileLine().split("\n")[1+depth]||"").trim()
    },
    _fileLine: function() { var obj = {}
        Error.captureStackTrace && Error.captureStackTrace(obj, arguments.callee)
        return obj.stack || ""
    },
})

