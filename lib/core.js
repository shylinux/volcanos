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
    Items: function(obj, cb) {var list = []
        for (var key in obj) {
            list = list.concat(this.List(obj[key], function(value, index, array) {
                return typeof cb == "function" && cb(value, index, key, obj)
            }))
        }
        return list
    },
    Next: shy("迭代器", function(obj, cb, cbs) {obj = typeof obj == "string"? [obj]: (obj || [])
        function next(list, cb) {
            list && list.length > 0? typeof cb == "function" && cb(list[0], function() {
                list.length > 0 && next(list.slice(1), cb)
            }): typeof cbs == "function" && cbs()
        }
        next(obj, cb)
    }),
})
