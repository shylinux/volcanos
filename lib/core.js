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

        var arg = []; for (var i = 1; i < arguments.length; i++) {
            arg.push(arguments[i])
        }

        // 空白符
        var sep = "\t ,\n"
        if (arg.length > 0 && arg[0].length > 0) {
            sep = arg[0]
        }
        for (var i = sep.length; i < 5; i++) {
            sep += sep[0]
        }

        // 分隔符
        var sup = "{[()]}"
        if (arg.length > 1 && arg[1].length > 0) {
            sup = arg[1]
        }
        for (var i = sup.length; i < 10; i++) {
            sup += sup[0]
        }

        // 引用符
        var sub = "'\"`"
        if (arg.length > 2 && arg[2].length > 0) {
            sub = arg[2]
        }
        for (var i = sub.length; i < 5; i++) {
            sub += sub[0]
        }

        var res = []
        // 开始分词
        var list = str
        var left = '\000', space = true, begin = 0
        for (var i = 0; i < list.length; i++) {
            if (list[i] == sep[0] || list[i] == sep[1] || list[i] == sep[2] || list[i] == sep[3] || list[i] == sep[4]) {
                if (left == '\000') {
                    if (!space) {
                        // 空白分隔
                        res.push(list.slice(begin, i))
                    }
                    space = true, begin = i+1
                }
            } else if (list[i] == sub[0] || list[i] == sub[1] || list[i] == sub[2] || list[i] == sub[3] || list[i] == sub[4]) {
                if (arg.length > 0) {
                    if (left == '\000') {
                        left = list[i]
                    } else if (left == list[i]) {
                        left = '\000'
                    }
                    break
                } else {
                    if (left == '\000') {
                        left = list[i], space = false, begin = i+1
                    } else if (left == list[i]) {
                        // 引用分隔
                        res.push({text: list.slice(begin, i), type: "str"})
                        left = '\000', space = true, begin = i+1
                    }
                }
            } else if (list[i] == sup[0] || list[i] == sup[1] || list[i] == sup[2] || list[i] == sup[3] || list[i] == sup[4] || list[i] == sup[5] || list[i] == sup[6] || list[i] == sup[7] || list[i] == sup[8] || list[i] == sup[9]) {
                if (left == '\000') {
                    if (!space) {
                        res.push(list.slice(begin, i))
                    }
                        // 分隔分隔
                    res.push(list.slice(i, i+1))
                    space = true, begin = i+1
                }
            } else if (list[0] == '\\') {
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
        if (begin < list.length) {
            res.push(list.slice(begin))
        }
        return res
    }),
})
