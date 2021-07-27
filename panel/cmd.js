
Volcanos("onaction", {help: "交互操作", list: [], _init: function(can, msg, list, cb, target) {
        console.log("what")
        can.base.isFunc(cb) && cb()
    },
    onmain: function(can, msg) {
        var args = location.pathname.split("/").slice(1)
        can.onappend.plugin(can, {index: args[2], args: args.slice(3), opts: can.user.Search(), width: window.innerWidth}, function(sub, meta) {
            sub.run = function(event, cmds, cb) { can.run(event, [ctx.ACTION, "run", args[2]].concat(cmds), cb) }
            can.onmotion.hidden(can, sub._legend)
            can.user.title(meta.name)
        })
    },
})
