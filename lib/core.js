var core = Volcanos("core", {help: "核心模块",
    Copy: function(to, from, fields) {
        var list = []
        for (var i = 2; i < arguments.length; i++) {
            list.push(arguments[i])
        }

        for (var i = 0; i < list.length; i++) {
            to[list[i]] = from[list[i]]
        }
    },
    Item: shy("迭代器", function(obj, cb) {var list = [];
        for (var k in obj) {
            var res = typeof cb == "function"? cb(k, obj[k]): k
            res && list.push(res)
        }
        return list
    }),
    Items: shy("迭代器", function(obj, cb) {var list = [];
        for (var key in obj) {
            list = list.concat(this.List(obj[key], function(value, index, array) {
                return typeof cb == "function" && cb(value, index, key, obj)
            }))
        }
        return list
    }),
    List: shy("迭代器", function(obj, cb, interval, cbs) {
        if (typeof obj == "number") {
            var begin = 0, end = obj, step = 1;
            if (typeof interval == "number") {
                step = interval
            }
            if (typeof cb == "number") {
                begin = obj, end = cb;
            }

            var list = []
            for (var i = begin; i < end; i += step) {
                list.push(i)
            }
            return list
        }

        obj = typeof obj == "string"? [obj]: (obj || [])
        if (interval > 0) {
            function loop(i) {if (i >= obj.length) {return typeof cbs == "function" && cbs(obj)}
                typeof cb == "function" && cb(obj[i], i, obj), setTimeout(function() {loop(i+1)}, interval);
            }
            obj.length > 0 && setTimeout(function() {loop(0)}, interval/4);
            return obj;
        }

        var list = [], res;
        for (var i = 0; i < obj.length; i++) {
            typeof cb == "function"? (res = cb(obj[i], i, obj)) != undefined && list.push(res): list.push(obj[i]);
        }
        return list;
    }),
    Next: shy("迭代器", function(obj, cb, cbs) {obj = typeof obj == "string"? [obj]: (obj || [])
        function next(list, cb, index) {
            list && list.length > 0? typeof cb == "function" && cb(list[0], function() {
                list.length > 0 && next(list.slice(1), cb, index+1)
            }, index): typeof cbs == "function" && cbs()
        }
        next(obj, cb, 0)
    }),

    Split: shy("分词器", function(str) { if (!str || !str.length) {return []}
        var opt = {simple: false}, arg = []; for (var i = 1; i < arguments.length; i++) {
            typeof arguments[i] == "object"? opt=arguments[i]: arg.push(arguments[i])
        }

        function _list(str) { var res = {}; for (var i = 0; i < str.length; i++) { res[str[i]] = true }; return res }
        // 空白符
        var seps = _list(arg[0]||"\t ,\n");
        // 分隔符
        var sups = _list(arg[1]||"{[(.:)]}");
        // 引用符
        var subs = _list(arg[2]||"'\"`");

        // 开始分词
        var res = [], list = str;
        var left = "", space = true, begin = 0;
        for (var i = 0; i < list.length; i++) {
            if (seps[list[i]]) {
                // 空白符
                if (left == "") {
                    if (!space) {
                        res.push(list.slice(begin, i))
                    }
                    opt.simple || res.push({text: list.slice(i, i+1), type: "space", left: left})
                    space = true, begin = i+1
                }
            } else if (subs[list[i]]) {
                // 引用符
                if (left == "") {
                    left = list[i], space = false, begin = i+1
                } else if (left == list[i]) {
                    res.push({text: list.slice(begin, i), type: "string", left: left, right: left})
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
    Eq: function(obj, other) { var self = arguments.callee
        // undefined null
        // string number boolen
        // object function
        if (typeof obj != typeof other) {
            return false
        }
        if (typeof obj == "object") {
            if (obj.length != other.length) { return false }
            for (var i = 0; i < obj.length; i++) {
                if (!self(obj[i], other[i])) {
                    return false
                }
            }
            for (var k in obj) {
                if (!self(obj[k], other[k])) {
                    return false
                }
            }
            return true
        }
        return obj === other
    },

    Timer: shy("定时器, value, [1,2,3,4], {value, length}", function(interval, cb, cbs) {
        interval = typeof interval == "object"? interval || []: [interval]
        var timer = {stop: false}; function loop(timer, i) {
            if (timer.stop || i >= interval.length && interval.length >= 0) {
                return typeof cbs == "function" && cbs(timer, interval)
            }
            return typeof cb == "function" && cb(timer, interval.value||interval[i], i, interval)?
                typeof cbs == "function" && cbs(timer, interval): setTimeout(function() { loop(timer, i+1) }, interval.value||interval[i+1])
        }
        setTimeout(function() { loop(timer, 0) }, interval.value||interval[0])
        return timer
    }),
})

