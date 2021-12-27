Volcanos("onaction", {help: "交互操作", list: [], _init: function(can, msg, list, cb, target) {
        can.page.ClassList.add(can, can._target, "Action")
        can.base.isFunc(cb) && cb()
    },
    onlogin: function(can) { can._names = location.pathname
        can.Conf(chat.TOOL)? can.core.Next(can.Conf(chat.TOOL), function(item, next) {
            can.core.Timer(500, function() { can.onaction._plugin(can, item, next) })

        }): can.run(can.request()._event, [ctx.ACTION, ctx.COMMAND], function(msg) {
            can.core.Next(msg.Table(), function(item, next) {
                can.onaction._plugin(can, item, next)
            })
        })
    },
    _plugin: function(can, item, next) {
        can.base.Copy(item, {height: window.innerHeight, width: window.innerWidth, opts: can.misc.Search(can)})
        can.onappend.plugin(can, item, function(sub, meta) { can.user.title(meta.name), next() })
    },
})

