Volcanos("base", {help: "基础模块",
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

