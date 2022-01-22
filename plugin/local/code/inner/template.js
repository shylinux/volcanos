Volcanos("onimport", {help: "导入数据", _init: function(can, args, cb) {
    can.onimport.toolkit(can, {index: "web.code.template"}, function(sub) {
        sub.run = function(event, cmds, cb) { var msg = sub.request(event, can.Option())
            if (can.misc.runAction(can, msg, cmds, cb, kit.Dict(
                mdb.INPUTS, function(cmds) {
                    msg.Push(nfs.FILE, can.Option(nfs.FILE))
                    can.base.isFunc(cb) && cb(msg)
                },
                nfs.DEFS, function(cmds) {
                    can.run(event, [ctx.ACTION, ice.RUN, "web.code.template", nfs.DEFS].concat(cmds), function(msg) {
                        can.base.isFunc(cb) && cb(msg)
                        can.onimport.project(can, can.Option(nfs.PATH))
                        can.onimport.tabview(can, can.Option(nfs.PATH), cmds[1])
                    }, true)
                },
            ))) { return }
            can.run(event, [ctx.ACTION, ice.RUN, "web.code.template"].concat(cmds), function(msg) {
                can.base.isFunc(cb) && cb(msg)
                can.onimport.project(can, can.Option(nfs.PATH))
            }, true)
        }, can.base.isFunc(cb) && cb(sub)
    })
}})


