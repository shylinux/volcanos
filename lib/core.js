Volcanos("core", {help: "数据结构",
    Keys: shy("连接器", function() { var list = []
        for (var i = 0; i < arguments.length; i++) { var v = arguments[i]
            switch (typeof v) {
                case lang.OBJECT:
                    for (var j = 0; j < v.length; j++) {
                        list.push(v[j])
                    }
                    break
                case lang.FUNCTION: v = v()
                default: v && list.push(v+"")
            }
        }
        return list.join(ice.PT)
    }),
    Value: shy("存储器", function(data, key, value) {
        if (data == undefined) { return }
        if (key == undefined) { return data }

        if (typeof key == lang.OBJECT) { for (var k in key) {
            arguments.callee.call(this, data, k, key[k])
        }; return data }

        if (value != undefined) { data[key] = value }
        if (data[key] != undefined) { return data[key] }

        var p = data, ls = key.split(ice.PT); while (p && ls.length > 0) {
            if (ls[0] == "-1") { ls[0] = p.length-1 }
            p = p[ls[0]], ls = ls.slice(1)
        }; return p
    }),
    Split: shy("分词器", function(str) { if (!str || !str.length) { return [] }
        var opt = {detail: false}, arg = []; for (var i = 1; i < arguments.length; i++) {
            typeof arguments[i] == lang.OBJECT? opt = arguments[i]: arg.push(arguments[i])
        }

        // 字符定义
        function _list(str) { var res = {}; for (var i = 0; i < str.length; i++) { res[str[i]] = true }; return res }
        var soos = _list("\\")               // 转义符
        var seps = _list(arg[0]||"\t ,;\n")  // 空白符
        var subs = _list(arg[1]||"{[(.:)]}") // 分隔符
        var sups = _list(arg[2]||"'\"`")     // 引用符

        var res = [], begin = 0; function push(obj) {
            obj && res.push(typeof obj == lang.STRING || opt.detail? obj: obj.text), begin = -1
        }

        // 开始分词
        for (var s = "", i = 0; i < str.length; i++) {
            if (soos[str[i]]) { // 转义符
                begin == -1 && (begin = i++)

            } else if (seps[str[i]]) { // 空白符
                if (s) { continue }
                begin > -1 && push(str.slice(begin, i))
                opt.detail && push({type: "space", text: str.slice(i, i+1)})

            } else if (subs[str[i]]) { // 分隔符
                if (s) { continue }
                begin > -1 && push(str.slice(begin, i))
                push(str.slice(i, i+1))

            } else if (sups[str[i]]) { // 引用符
                if (s == "") {
                    s = str[i], begin = i+1
                } else if (s == str[i]) {
                    push({type: lang.STRING, text: str.slice(begin, i), left: s, right: str[i]})
                    s = "", begin = -1
                }

            } else { // 普通符
                begin == -1 && (begin = i)
            }
        }

        // 剩余字符
        begin >= 0 && (s? push({type: lang.STRING, text: str.slice(begin), left: s, right: ""}): push(str.slice(begin)))
        return res
    }),
    CallFunc: shy("调用器", function(func, args, mod) { args = args||{}
        var can = args["can"]||args[0], msg = args["msg"]||args[1], cmds = args["cmds"]||[]

        // 查找调用
        func = typeof func == lang.FUNCTION? func: typeof func == lang.STRING? this.Value(mod||can, func):
            typeof func == lang.OBJECT && func.length > 0? this.Value(func[0], this.Keys(func.slice(1))): null
        if (typeof func != lang.FUNCTION) { return }

        // 解析参数
        var list = [], echo = false, cb = args["cb"]
        this.List(func.toString().split(")")[0].split("(")[1].split(ice.FS), function(item, index) { item = item.trim(); if (item == "") { return }
            var arg = msg&&msg.Option&&msg.Option(item) || event&&!(event instanceof Event)&&event[item] ||
                args[item] || can&&can.Conf&&can.Conf(item) || args[index] || cmds[index] || null
            if (item == "cb") { echo = true }
            list.push(arg)
        })

        // 执行调用
        var res = func.apply(mod||can, list)

        // 执行回调
        if (!echo && typeof cb == lang.FUNCTION) { res && msg && msg.Echo(res), arguments.callee.apply(this, [cb, {msg: msg, res: res}]) }
        return res
    }),

    List: shy("迭代器", function(list, cb, interval, cbs) {
        if (typeof list == lang.STRING) { // 默认序列
            list = [list]

        } else if (typeof list == lang.NUMBER) { // 等差序列
            var begin = 0, end = list, step = typeof interval == lang.NUMBER? interval: 1
            if (typeof cb == lang.NUMBER) { begin = list, end = cb, cb = null }

            list = []; for (var i = begin; i < end; i += step) {
                list.push(i)
            }
        }

        list = list || []

        if (interval > 0) { // 时间序列
            function loop(i) { if (i >= list.length) { return typeof cbs == lang.FUNCTION && cbs(list) }
                cb(list[i], i, list), setTimeout(function() { loop(i+1) }, interval)
            }
            typeof cb == lang.FUNCTION && list.length > 0 && setTimeout(function() { loop(0) }, interval/4)
        } else { // 选择序列
            var slice = [], res
            for (var i = 0; i < list.length; i++) {
                typeof cb == lang.FUNCTION? (res = cb(list[i], i, list)) != undefined && slice.push(res): slice.push(list[i])
            }; list = slice
        }
        return list
    }),
    Next: shy("迭代器", function(list, cb, cbs) {
        function next(i) {
            i < list.length? cb(list[i], function() {
                next(i+1)
            }, i, list): typeof cbs == lang.FUNCTION && cbs(list)
        }

        switch (typeof list) {
            case undefined: list = []; break
            case lang.OBJECT: break
            default: list = [list]

        }

        list && list.length > 0 && typeof cb == lang.FUNCTION? next(0): typeof cbs == lang.FUNCTION && cbs(list)
    }),
    Items: shy("迭代器", function(obj, cb) { var list = []
        for (var k in obj) {
            list = list.concat(this.List(obj[k], function(v, i) {
                return typeof cb == lang.FUNCTION && cb(v, i, k, obj)
            }))
        }
        return list
    }),
    Item: shy("迭代器", function(obj, cb) { var list = []
        for (var k in obj) {
            var res = typeof cb == lang.FUNCTION? cb(k, obj[k]): k
            res != undefined && list.push(res)
        }
        return list
    }),
    ItemCB: shy("迭代器", function(meta, cb, can, item) { var list = []
        for (var k in meta) { (function(k) {
            if (k.indexOf("on") == 0 && typeof meta[k] == lang.FUNCTION) {
                if (typeof cb == lang.FUNCTION) {
                    cb(k, meta[k])
                } else {
                    cb[k] = function(event) { meta[k](event, can, item) }
                }
                list.push(k)
            }
        })(k) }
        return list
    }),

    Timer300ms: function(cb) { this.Timer(300, cb) },
    Timer: shy("定时器, value, [1,2,3,4], {interval, length}", function(interval, cb, cbs) {
        var timer = {stop: false}; function loop(i) {
            timer.stop || i >= interval.length && interval.length >= 0 || cb(timer, interval.interval||interval[i], i, interval)?
                typeof cbs == lang.FUNCTION && cbs(timer, interval): setTimeout(function() { loop(i+1) }, interval.interval||interval[i+1])
        }

        interval = typeof interval == lang.OBJECT? interval: [interval]
        if (interval.interval == 0) { cb(); return timer }

        typeof cb == lang.FUNCTION && setTimeout(function() { loop(0) }, interval.interval||interval[0])
        return timer
    }),
    Delay: shy("延时器", function(list, interval, cb, cbs) { list = list || []
        list.push(cb); this.Timer(interval, function() {
            var cb = list.pop(); list.length = 0
            typeof cb == lang.FUNCTION && cb()
        }, cbs)
        return list
    }),
})

