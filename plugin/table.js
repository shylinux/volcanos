var _can_name = "/plugin/table.js"
Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can), can.base.isFunc(cb) && cb(msg)
        can.onappend.table(can, msg)
        can.onappend.board(can, msg)
        can.onmotion.story.auto(can, target)
    },

    _process: function(can, msg) {
        if (msg.Option("sess.toast")) {
            can.user.toast(can, msg.Option("sess.toast"))
        }
        return can.core.CallFunc([can.onimport, msg.Option("_process")], [can, msg])
    },

    _control: function(can, msg) {
        var cb = can.onimport[msg.Option("_control")]
        return can.base.isFunc(cb) && cb(can, msg)
    },
})
Volcanos("onaction", {help: "控件交互", list: []})
Volcanos("onexport", {help: "导出数据", list: []})
var _can_name = ""
