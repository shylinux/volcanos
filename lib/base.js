Volcanos("base", {help: "基础模块",
    Int: function(value) { return parseInt(value)||0 },
    Obj: function(value, def) {
        try {
            return (typeof value == "string" && value != ""? JSON.parse(value): value) || def || {}
        } catch {
            return [value]
        }
    },

    Ext: function(file) { return (file.split("/").pop().split(".").pop()||"txt").toLowerCase() },
    Path: function() { var res = ""
        for (var i = 0; i < arguments.length; i++) {
            res += (arguments[i].indexOf("/") == 0 || res.endsWith("/")? "": "/") + arguments[i].trim()
        }
        return res
    },
    Args: function(obj) {var res = [];
        for (var k in obj) {
            res.push(encodeURIComponent(k)+"="+encodeURIComponent(obj[k]))
        }
        return res.join("&")
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
    Time: shy("时间格式化", function(t, fmt) {
        var now = new Date()
        if (t && typeof t == "string") { var ls = t.split(" ")
            var vs = ls[0].split("-")
            now.setFullYear(parseInt(vs[0]))
            now.setMonth(parseInt(vs[1]))
            now.setDate(parseInt(vs[2]))

            var vs = ls[1].split(":")
            now.setHours(parseInt(vs[0]))
            now.setMinutes(parseInt(vs[1]))
            now.setSeconds(parseInt(vs[2]))
        } else if (t) {
            now = t
        }
        // var now = t? new Date(t): new Date()

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
    Number: shy("数字格式化", function(d, n) { var result = []
        while (d > 0) { result.push(d % 10); d = parseInt(d / 10); n-- }
        while (n > 0) { result.push("0"); n-- }
        return result.reverse(), result.join("")
    }),
    Format: shy("数据格式化", function(obj) { return JSON.stringify(obj) }),

    TimeAdd: shy("时间格式化", function(t, d) {
        return new Date(t - t%(24*3600*1000) - 8*3600*1000 + d*24*3600*1000)
    }),
    isNight: function() { var now = new Date()
        return now.getHours() < 7 || now.getHours() > 17
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

    _fileLine: function() { var obj = {}; Error.captureStackTrace(obj, arguments.callee); return obj.stack },
    FileLine: function(depth) { return this._fileLine().split("\n")[1+depth].trim() },
    Log: function() {
        var args = [this.Time(), this.FileLine(2, 3).split("/").slice(3).slice(-length).join("/") ]
        for (var i in arguments) { args.push(arguments[i]) }
        console.log.apply(console, args)
    },
    Logs: function() {
        var args = [this.Time()]
        for (var i in arguments) { args.push(arguments[i]) }
        args.push(this.FileLine(2, 3))
        console.log.apply(console, args)
    },
    Error: function() {
        var args = [this.Time()]
        for (var i in arguments) { args.push(arguments[i]) }
        args.push("\n", this._fileLine().split("\n").slice(2).join("\n"))
        console.log.apply(console, args)
    },
})

