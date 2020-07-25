module.exports = {
    Number: function(d, n) {var res = [];
        while (d > 0) {res.push(d % 10); d = parseInt(d / 10); n--}
        while (n > 0) {res.push("0"); n--}
        return res.reverse(), res.join("");
    },
    Time: function(t, fmt) {var now = t? new Date(t): new Date();
        fmt = fmt || "%y-%m-%d %H:%M:%S";
        fmt = fmt.replace("%y", now.getFullYear())
        fmt = fmt.replace("%m", Number(now.getMonth()+1, 2))
        fmt = fmt.replace("%d", Number(now.getDate(), 2))
        fmt = fmt.replace("%H", Number(now.getHours(), 2))
        fmt = fmt.replace("%M", Number(now.getMinutes(), 2))
        fmt = fmt.replace("%S", Number(now.getSeconds(), 2))
        return fmt
    },
    Args: function(url, args) {var list = []
        for (var k in args) {
            list.push(encodeURIComponent(k)+"="+encodeURIComponent(args[k]))
        }
        return url+"?"+list.join("&")
    },
    List: function(list, cb, cbs) {var res = [], val;
        for (var i = 0; i < list.length; i++) {
            typeof cb == "function"? (val = cb(list[i], i, list)) != undefined && res.push(val): res.push(list[i])
        }
        return typeof cbs == "function" && cbs(res), res
    },
}

