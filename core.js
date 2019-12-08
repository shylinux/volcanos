Volcanos("core", {help: "核心模块",
    Item: shy("迭代器", function(obj, cb) {var list = [];
        for (var k in obj) {var res;
            list.push(typeof cb == "function" && (res = cb(k, obj[k])) != undefined && res || k)
        }
        return list
    }),
    List: shy("迭代器", function(obj, cb, interval, cbs) {obj = typeof obj == "string"? [obj]: (obj || [])
        if (interval > 0) {
            function loop(i) {if (i >= obj.length) {return typeof cbs == "function" && cbs(obj)}
                typeof cb == "function" && cb(obj[i], i, obj), setTimeout(function() {loop(i+1)}, interval);
            }
            obj.length > 0 && setTimeout(function() {loop(0)}, interval/4);
            return obj;
        }

        var list = [], res;
        for (var i = 0; i < obj.length; i++) {
            typeof cb == "function"? (res = cb(obj[i], i, obj)) != undefined && list.push(res): list.push(res);
        }
        return list;
    }),
})
