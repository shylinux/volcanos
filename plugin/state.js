Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, conf, list, cb, target) {
    },
    _process: function(can, msg) {
        var cb = can.onimport[msg.Option("_process") || can.Conf("feature._process")]
        return typeof cb == "function" && cb(can, msg)
    },
    _progress: function(can, sub, conf, msg, cmds, cb, silent) {
        var size = msg.Append("size") || msg.Append("count")
        if (size != "" && size == msg.Append("total")) {
            return typeof cb == "function" && cb(msg)
        }
        can.user.toast(can, {
            width: 400,
            title: conf.name+" "+msg.Append("step")+"% ", duration: 1100,
            text: "执行进度: "+can.base.Size(size||0)+"/"+can.base.Size(msg.Append("total")||"1000")+"\n"+msg.Append("name"),
            progress: parseInt(msg.Append("step")),
        })
        can.page.Select(can, sub._output, "td", function(td) {
            if (td.innerText == msg.Option("name")) {
                can.page.ClassList.add(can, td, "done")
            }
        })
        can.core.Timer(1000, function() {
            var res = sub.request({})
            res.Option("_progress", msg.Option("_progress"))
            sub.run(res._event, cmds, cb, silent)
        })
        return true
    },
    _refresh: function(can, msg) {
        can.core.Timer(500, function(timer) {
            var sub = can.request({}, {_count: parseInt(msg.Option("_count"))-1})
            can.run(sub._event)
        })
    },
    _field: function(can, msg) {
        msg.Table(function(value) {
            value.feature = can.base.Obj(msg.meta&&msg.meta[0]||"{}", {})
            value.inputs = can.base.Obj(msg.list&&msg.list[0]||"[]", [])
            value.width = can._target.offsetWidth
            value.type = "story"

            can.onappend._init(can, value, ["/plugin/state.js"], function(sub) {
                sub.run = function(event, cmds, cb, silent) {
                    can.run(event, (msg["_prefix"]||[]).concat(cmds), cb, true)
                }
            }, can._output)
        })
        return true
    },
})
Volcanos("onaction", {help: "交互操作", list: [], _init: function(can, msg, list, cb, target) {
    },
    input: function(event, can, name, cb) { var feature = can.Conf("feature")
        feature[name]? can.user.input(event, can, feature[name], function(ev, button, data, list) {
            var msg = can.request(event); msg.Option(can.Option())
            var args = ["action", name]; can.core.Item(data, function(key, value) {
                key && value && args.push(key, value)
            })

            var sub = can._outputs && can._outputs[can._outputs.length-1] || can
            sub.run(event, args, function(msg) { typeof cb == "function" && cb(msg) })
            return true
        }): can.run(event, ["action", name], function(msg) { typeof cb == "function" && cb(msg) })
    },
    change: function(event, can, name, value, cb) {
        can.page.Select(can, can._option, "input.args", function(input) { if (input.name == name) { var data = input.dataset || {}
            if (value != input.value) { input.value = value;
                data.action == "auto" && typeof cb == "function" && cb()
            }
        } })
    },

    getLocation: function(event, can, cmd) { var msg = can.request(can)
        can.user.agent.getLocation(function(res) {
            var arg = []; can.core.Item(res, function(key, value) { arg.push(key, value) })
            can.run(event, ["action", cmd].concat(arg))
        })
    },
    openLocation: function(event, can) { var msg = can.request(can)
        can.user.agent.openLocation(msg)
    },
    scanQRCode0: function(event, can) { var msg = can.request(can)
        can.user.agent.scanQRCode()
    },
    scanQRCode: function(event, can, cmd) { var msg = can.request(can)
        can.user.agent.scanQRCode(function(res) {
            var arg = []; can.core.Item(res, function(key, value) { arg.push(key, value) })
            can.run(event, ["action", cmd].concat(arg))
        })
    },

    "清空": function(event, can, name) { can._output.innerHTML = "" },
    "结束": function(event, can, name) { can.user.confirm("确定结束?") && can.run(event, ["action", name], function(msg) {
        can.run({})
    }, true) },
})
Volcanos("onexport", {help: "导出数据", list: []})
