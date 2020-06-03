Volcanos("core", {help: "核心模块",
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
    Item: shy("迭代器", function(obj, cb) {var list = [];
        for (var k in obj) {var res;
            list.push(typeof cb == "function" && (res = cb(k, obj[k])) != undefined && res || k)
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
    Next: shy("迭代器", function(obj, cb, cbs) {obj = typeof obj == "string"? [obj]: (obj || [])
        function next(list, cb, index) {
            list && list.length > 0? typeof cb == "function" && cb(list[0], function() {
                list.length > 0 && next(list.slice(1), cb, index+1)
            }, index): typeof cbs == "function" && cbs()
        }
        next(obj, cb, 0)
    }),
    Trim: shy("迭代器", function(obj) {
        for (var i = obj.length; i >= 0; i--) {
            if (obj[i]) {break}
            obj = obj.slice(0, i)
        }
        return obj
    }),

    Split: shy("分词器", function(str) { if (!str || !str.length) {return []}
        var opt = {simple: false}, arg = []; for (var i = 1; i < arguments.length; i++) {
            typeof arguments[i] == "object"? opt=arguments[i]: arg.push(arguments[i])
        }

        function trans(str) { var res = {}; for (var i = 0; i < str.length; i++) { res[str[i]] = true }; return res }
        // 空白符
        var seps = trans(arg[0]||"\t ,\n");
        // 分隔符
        var sups = trans(arg[1]||"{[(.:)]}");
        // 引用符
        var subs = trans(arg[2]||"'\"`");

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
                    res.push({text: list.slice(begin, i), type: "string", left: left})
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

        // 末尾单词
        if (begin < list.length) { res.push(list.slice(begin)) }
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
    }
})
