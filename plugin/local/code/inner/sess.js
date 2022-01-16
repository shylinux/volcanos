Volcanos("onimport", {help: "导入数据", _init: function(can, cb) {
    can.onimport.toolkit(can, {index: "web.code.sess"}, function(sub) {
        sub.run = function(event, cmds, cb) { var msg = can.request(event)
            if (can.misc.runAction(can, msg, cmds, cb, kit.Dict(
                "save", function(cmds) {
                    can.run(event, [ctx.ACTION, ice.RUN, "web.code.sess"].concat([ctx.ACTION, mdb.CREATE,
                        "tool", can.core.Item(can.toolkit).join(ice.FS),
                        "tabs", can.core.Item(can.tabview).join(ice.FS),
                    ]), cb, true)
                },
                "load", function(cmds) {
                    can.core.List(can.core.Split(msg.Option("tabs")), function(item) {
                        var ls = can.core.Split(item, ":"); can.onimport.tabview(can, ls[0], ls[1])
                    })
                    // var repos = can.base.trimSuffix(can.base.trimPrefix(can.Option(nfs.PATH), "usr/"), ice.PS)
                    can.run({}, [ctx.ACTION, ctx.COMMAND].concat(can.core.Split(msg.Option("tool")).reverse()), function(msg) {
                        can.core.Next(msg.Table(), function(item, next) {
                            item.args = can.base.getValid(item.args, []), can.onimport.toolkit(can, item, next)
                        })
                    }, true)
                },
                mdb.INPUTS, function(cmds) {
                    switch (cmds[0]) {
                        case mdb.TYPE:
                            msg.Push(cmds[0], "hi")
                            break
                        case mdb.NAME:
                            msg.Push(cmds[0], "hi")
                            break
                        case mdb.TEXT:
                            msg.Push(cmds[0], "hi")
                            break
                    }
                    can.base.isFunc(cb) && cb(msg)
                },
            ))) { return }
            can.run(event, [ctx.ACTION, ice.RUN, "web.code.sess"].concat(cmds), cb, true)
        }
        can.base.isFunc(cb) && cb()
    })
}})

