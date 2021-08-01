Volcanos("onaction", {help: "交互操作", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.float.auto(can, can._output, "carte")
        can.base.isFunc(cb) && cb()
    },
    onmain: function(can) {
        var msg = can.request({}, {_names: location.pathname})
        can.run(msg._event, [ctx.ACTION, ctx.COMMAND], function(msg) {
            can.core.Next(msg.Table(), function(line, next) {
                can.onaction._plugin(can, line.index, can.base.Obj(line.args, []), next)
            })
        })
        can.page.ClassList.add(can, can._target, "Action")
    },
    _plugin: function(can, index, args, next) {
        can.onappend.plugin(can, {type: "plugin", index: index, args: args, opts: can.user.Search(), width: window.innerWidth}, function(sub, meta) {
            sub.run = function(event, cmds, cb) {
                var msg = can.request(event, {_names: location.pathname})
                can.run(event, (can.onengine[cmds[0]]? []: [ctx.ACTION, "run", index]).concat(cmds), cb)
            }
            // can.onmotion.hidden(can, sub._legend)
            can.user.title(meta.name)
            next()
        })
    },
})
