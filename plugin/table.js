Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can)
        can.onappend.table(can, msg)
        can.onappend.board(can, msg)
        can.onmotion.story.auto(can)
        can.base.isFunc(cb) && cb(msg)
    },

    _process: function(can, msg) {
        msg.Option(ice.MSG_TOAST) && can.user.toast(can, msg.Option(ice.MSG_TOAST))
        return can.core.CallFunc([can.onimport, msg.Option(ice.MSG_PROCESS)], [can, msg])
    },
})
Volcanos("onaction", {help: "控件交互", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

