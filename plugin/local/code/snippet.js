Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can)
        if (msg.Option("content")) {
            can.onappend.plugin(can, {index: "web.code.vimer", style: "full"}, function(sub) {
                sub.run = function(event, cmds, cb) { var res = can.request(event)
                    if (cmds[1] == "plugin") {
                        can.run(event, can.misc.Concat(["action", "vimer"], cmds), cb, true)
                        return
                    }
                    if (cmds[1] == "main.go") { res.Echo(msg.Option("content"))
                        can.core.Timer(100, function() { can.sub && can.sub.onaction["项目"]({}, can.sub) })
                    }
                    cb(res), can.sub = can.core.Value(sub, "_outputs.-1")
                }
            }, can._output)
            return
        }
        can.onappend.table(can, msg)
        can.onappend.board(can, msg)
    },
})
Volcanos("onaction", {help: "操作数据", list: [], _init: function(can, msg, list, cb, target) {
    },
    run: function(event, can, msg) {
        can.run(event, [ctx.ACTION, cli.RUN, "go", "hi.go", can.sub.onexport.content(can.sub)], function(msg) {
            can.onappend.board(can, msg)
        }, true)
    },
})
Volcanos("onexport", {help: "导出数据", list: [], _init: function(can, msg, list, cb, target) {
}})

