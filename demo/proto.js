// volcanos: 前端 火山架 我看不行
// FMS: a fieldset manager system

function shy(help, meta, list, cb) {
    var index = -1, value = "", type = "string", args = arguments;
    function next(check) {
        if (++index >= args.length) {return false}
        if (check && check != typeof args[index]) {index--; return false}
        return value = args[index], type = typeof value, value;
    }

    var cb = arguments[arguments.length-1] || function() {};
    cb.help = next("string") || "还没有写";
    cb.meta = next("object") || {};
    cb.list = next("object") || {};
    cb.runs = function() {};
    return cb;
}
function Volcanos(name, can, libs, cb) {
    // 全局缓存
    var list = arguments.callee.list || [], meta = arguments.callee.meta || {index: 1, cache: {}};
    arguments.callee.list = list, arguments.callee.meta = meta;

    // 定义原型
    can = can || {}, list.push(can) && (can.__proto__ = {_name: name, _load: function(name) {
            if (meta.cache[name]) {var cache = meta.cache[name];
                // 加载索引
                for (var i = 0; i < cache.length; i++) {var sub = cache[i];
                    can[sub._name] = sub;
                }
                return can
            }

            // 加载缓存
            meta.cache[name] = []
            for (var i = meta.index; i < list.length; i++) {var sub = list[i];
                can[sub._name] = sub;
                meta.cache[name].push(sub);
            }
            meta.index = i;
            return can
        },
        require: function(libs, cb) {
            if (!libs || libs.length == 0) {
                // 加载完成
                typeof cb == "function" && setTimeout(function() {cb(can)}, 10);

            } else if (can[libs[0]]) {
                // 已经加载
                can.require(libs.slice(1), cb)

            } else if (meta.cache[libs[0]]) {
                // 缓存加载
                can._load(libs[0]), can.require(libs.slice(1), cb)

            } else {
                // 加载脚本
                var target = libs[0].endsWith(".css")? (can._head||document.head): (can._body||document.body);
                var source = !libs[0].endsWith("/") && (libs[0].indexOf(".") == -1? libs[0]+".js": libs[0]) || libs[0]

                if (source.endsWith(".js")) { var script = document.createElement("script");
                    script.src = source, script.onload = function() {
                        can._load(libs[0]), can.require(libs.slice(1), cb);
                    }
                    target.appendChild(script);

                } else if (source.endsWith(".css")) { var style = document.createElement("link");
                    style.rel = "stylesheet", style.type = "text/css";
                    style.href = source; style.onload = function() {
                        can._load(libs[0]), can.require(libs.slice(1), cb);
                    };
                    target.appendChild(style);
                }
            }
        },
    });

    return can.require(libs, cb), can
}

