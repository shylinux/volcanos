Volcanos("base", {help: "基础模块",
    isNone: function(c) {return c === undefined || c === null},
    isSpace: function(c) {return c == " " || c == "Enter"},

    Args: function(obj) {var res = [];
        for (var k in obj) {
            res.push(encodeURIComponent(k)+"="+encodeURIComponent(obj[k]))
        }
        return res.join("&")
    },
    Int: function(value) {return parseInt(value)||0},
    Duration: function(n) {var res = "", h = 0;
        h = parseInt(n/3600000), h > 0 && (res += h+"h"), n = n % 3600000;
        h = parseInt(n/60000), h > 0 && (res += h+"m"), n = n % 60000;
        h = parseInt(n/1000), h > 0 && (res += h+"s"), n = n % 1000;
        return n > 0? res + n: res;
    },
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
        fmt = fmt.replace("%m", this.Number(now.getMonth()+1, 2))
        fmt = fmt.replace("%d", this.Number(now.getDate(), 2))
        fmt = fmt.replace("%H", this.Number(now.getHours(), 2))
        fmt = fmt.replace("%M", this.Number(now.getMinutes(), 2))
        fmt = fmt.replace("%S", this.Number(now.getSeconds(), 2))
        return fmt
    }),
})

