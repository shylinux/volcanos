var base = Volcanos("base", {help: "基础模块",
    isNone: function(c) {return c === undefined || c === null},
    isSpace: function(c) {return c == " " || c == "Enter"},

    Ext: function(file) { return (file.split("/").pop().split(".").pop()||"txt").toLowerCase() },
    Path: function() {var res = ""
        for (var i = 0; i < arguments.length; i++) {
            res += (arguments[i].indexOf("/") == 0 || res.endsWith("/")? "": "/") + arguments[i].trim()
        }
        return res
    },
    Int: function(value) {return parseInt(value)||0},
    Obj: function(value, def) {
        try {
            return typeof value == "string" && value != ""? JSON.parse(value): value || def || {}
        } catch {
            return [value]
        }
    },

    parseSize: function(size) {
        if (size.endsWith("TB") || size.endsWith("tb") || size.endsWith("T") || size.endsWith("t")) {
            return parseInt(size) * 1024 * 1024 * 1024 * 1024
        }
        if (size.endsWith("GB") || size.endsWith("gb") || size.endsWith("G") || size.endsWith("g")) {
            return parseInt(size) * 1024 * 1024 * 1024
        }
        if (size.endsWith("MB") || size.endsWith("mb") || size.endsWith("M") || size.endsWith("m")) {
            return parseInt(size) * 1024 * 1024
        }
        if (size.endsWith("KB") || size.endsWith("kb") || size.endsWith("K") || size.endsWith("k")) {
            return parseInt(size) * 1024
        }
        return parseInt(size)
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
    date: shy("时间格式化", function(t) {
        var now = new Date()
        if (t) { return now }
        if (typeof t == "string") { var ls = t.split(" ")
            var vs = ls[0].split("-")
            now.setFullYear(parseInt(vs[0]))
            now.setMonth(parseInt(vs[1]))
            now.setDate(parseInt(vs[2]))

            var vs = ls[1].split(":")
            now.setHours(parseInt(vs[0]))
            now.setMinutes(parseInt(vs[1]))
            now.setSeconds(parseInt(vs[2]))
        } else {
            now = t
        }
        return now
    }),
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
    TimeAdd: shy("时间格式化", function(t, d) {
        return new Date(t - t%(24*3600*1000) - 8*3600*1000 + d*24*3600*1000)
    }),
    Duration: function(n) {var res = "", h = 0;
        h = parseInt(n/3600000/24), h > 0 && (res += h+"d"), n = n % (3600000*24);
        h = parseInt(n/3600000), h > 0 && (res += h+"h"), n = n % 3600000;
        h = parseInt(n/60000), h > 0 && (res += h+"m"), n = n % 60000;
        h = parseInt(n/1000), h > 0 && (res += h), n = n % 1000;
        return res + (n > 0? "."+parseInt(n/10): "") + "s";
    },
    Number: shy("数字格式化", function(d, n) {var result = [];
        while (d>0) {result.push(d % 10); d = parseInt(d / 10); n--}
        while (n > 0) {result.push("0"); n--}
        result.reverse();
        return result.join("");
    }),
    Format: shy("数据格式化", function(obj) {return JSON.stringify(obj)}),

    isNight: function() {
        var now = new Date()
        return now.getHours() < 7 || now.getHours() > 17
    },
})

