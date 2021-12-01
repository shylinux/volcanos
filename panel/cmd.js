Volcanos("onaction", {help: "交互操作", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.float.auto(can, can._output, chat.CARTE)
        can.onmotion.float.auto(can, window, chat.CARTE)
        can.base.isFunc(cb) && cb()
    },
    onlogin: function(can) { can._names = location.pathname
        var msg = can.request({})
        can.Conf(chat.TOOL)? can.core.Next(can.Conf(chat.TOOL), function(item, next) {
            can.core.Timer(500, function() {
                can.onaction._plugin(can, item, next)
            })

        }): can.run(msg._event, [ctx.ACTION, ctx.COMMAND], function(msg) {
            can.core.Next(msg.Table(), function(item, next) {
                can.onaction._plugin(can, item, next)
            })
        })
        can.page.ClassList.add(can, can._target, "Action")
    },
    _plugin: function(can, item, next) {
        item.height = window.innerHeight, item.width = window.innerWidth, item.opts = can.misc.Search()
        can.onappend.plugin(can, item, function(sub, meta) { can.user.title(meta.name), next() })
    },
})

