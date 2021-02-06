function shy(help, meta, list, cb) {
    var index = 0, args = arguments; function next(check) {
        if (index < args.length && (!check || check == typeof args[index])) {
            return args[index++]
        }
    }

    cb = args[args.length-1] || function() {}
    cb.help = next("string") || ""
    cb.meta = next("object") || {}
    cb.list = next("object") || []
    return cb
}; var _can_name = ""

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
    Item: function(list, cb, cbs) {
        for (var k in list) { cb(k, list[k]) }
    },
    Value: function(data, key, value) {
        if (data == undefined) { return }
        if (key == undefined) { return data }
        if (typeof key == "object") { for (var k in key) {
            arguments.callee.call(this, data, k, key[k])
        }; return data }

        if (value != undefined) { data[key] = value }
        if (data[key] != undefined) { return data[key] }

        var p = data, ls = key.split("."); while (p && ls.length > 0) {
            if (ls[0] == "-1") { ls[0] = p.length-1 }
            p = p[ls[0]], ls = ls.slice(1)
        }; return p
    },
    Simple: function() { var res = []
        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i]; switch (typeof arguments[i]) {
                case "number": res.push(arg); break
                case "string": res.push(arg); break
                case "object":
                    if (arg.length > 0) {
                        res = res.concat(arg)
                    } else {
                        for (var k in arg) { res.push(k, arg[k]) }
                    }
            }
        }
        return res
    },

    Timer: shy("定时器, value, [1,2,3,4], {value, length}", function(interval, cb, cbs) {
        interval = typeof interval == "object"? interval || []: [interval]
        var timer = {stop: false}; function loop(timer, i) {
            if (timer.stop || i >= interval.length && interval.length >= 0) {
                return typeof cbs == "function" && cbs(timer, interval)
            }
            return typeof cb == "function" && cb(timer, interval.interval||interval[i], i, interval)?
                typeof cbs == "function" && cbs(timer, interval): setTimeout(function() { loop(timer, i+1) }, interval.interval||interval[i+1])
        }
        setTimeout(function() { loop(timer, 0) }, interval.interval||interval[0])
        return timer
    }),
    Split: shy("分词器", function(str) { if (!str || !str.length) { return [] }
        var opt = {detail: false}, arg = []; for (var i = 1; i < arguments.length; i++) {
            typeof arguments[i] == "object"? opt = arguments[i]: arg.push(arguments[i])
        }

        function _list(str) { var res = {}; for (var i = 0; i < str.length; i++) { res[str[i]] = true }; return res }
        // 空白符
        var seps = _list(arg[0]||"\t ,\n")
        // 分隔符
        var sups = _list(arg[1]||"{[(.:)]}")
        // 引用符
        var subs = _list(arg[2]||"'\"`")

        // 开始分词
        var res = [], list = str
        var left = "", space = true, begin = 0
        for (var i = 0; i < list.length; i++) {
            if (seps[list[i]]) {
                // 空白符
                if (left == "") {
                    if (!space) {
                        res.push(list.slice(begin, i))
                    }
                    opt.detail && res.push({text: list.slice(i, i+1), type: "space", left: left})
                    space = true, begin = i+1
                }
            } else if (subs[list[i]]) {
                // 引用符
                if (left == "") {
                    left = list[i], space = false, begin = i+1
                } else if (left == list[i]) {
                    opt.detail? res.push({text: list.slice(begin, i), type: "string", left: left, right: left}): res.push(list.slice(begin, i))
                    left = "", space = true, begin = i+1
                }
            } else if (sups[list[i]]) {
                // 分隔符
                if (left == "") {
                    if (!space) {
                        res.push(list.slice(begin, i))
                    }
                    res.push(list.slice(i, i+1))
                    space = true, begin = i+1
                }
            } else if (list[0] == '\\') {
                // 转义符
                for (var i = i; i < list.length-1; i++) {
                    list[i] = list[i+1]
                }
                list = list.slice(0, list.length-1)
                space = false
            } else {
                space = false
            }
        }

        // 末尾字符
        if (left != "") {
            res.push({text: list.slice(begin), type: "string", left: left, right: ""})
        } else if (begin < list.length) {
            res.push(list.slice(begin))
        }
        return res
    }),
    parseJSON: shy("解析器", function(str, def) { var res
        if (!str) { return def||{} }
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
    }),
}

