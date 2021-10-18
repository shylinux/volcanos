Volcanos("onaction", {help: "交互操作", list: [], _init: function(can, msg, list, cb, target) {
    can.onmotion.float.auto(can, can._output, chat.CARTE)
    can.base.isFunc(cb) && cb()
},
    onmain: function(can) { can._names = location.pathname
        var msg = can.request({}, {_names: location.pathname})
        can.Conf(chat.TOOL)? can.core.Next(can.Conf(chat.TOOL), function(line, next) {
            can.onaction._plugin(can, line.index, can.base.Obj(line.args, []), next)

        }): can.run(msg._event, [ctx.ACTION, ctx.COMMAND], function(msg) {
            can.core.Next(msg.Table(), function(line, next) {
                can.onaction._plugin(can, line.index, can.base.Obj(line.args, []), next)
            })
        })
        can.page.ClassList.add(can, can._target, "Action")
    },
    _plugin: function(can, index, args, next) {
        can.onappend.plugin(can, {type: chat.PLUGIN, index: index, args: args, opts: can.user.Search(), height: window.innerHeight, width: window.innerWidth}, function(sub, meta) {
            sub.run = function(event, cmds, cb) { can.run(event, can.misc.Concat([ctx.ACTION, cli.RUN, index], cmds), cb) }
            can.user.title(meta.name), next()
        })
    },
})

