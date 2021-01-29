Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, conf, list, cb, target) {
    },
    _process: function(can, msg, cmds, cb, silent) {
        return can.core.CallFunc([can.onimport, msg.Option("_process")], [can, msg, cmds, cb, silent])
    },
    _progress: function(can, msg, cmds, cb, silent) {
        var size = msg.Append("size") || msg.Append("count")
        if (size != "" && size == msg.Append("total")) { return false }

        can.user.toast(can, {
            title: can._name+" "+msg.Append("step")+"% ", duration: 1100,
            text: "执行进度: "+can.base.Size(size||0)+"/"+can.base.Size(msg.Append("total")||"1000")+"\n"+msg.Append("name"),
            progress: parseInt(msg.Append("step")), width: 400,
        })

        can.page.Select(can, can._output, "td", function(td) {
            if (td.innerText == msg.Option("name")) {
                can.page.ClassList.add(can, td, "done")
            }
        })

        can.core.Timer(1000, function() {
            var res = can.request({}, {_progress: msg.Option("_progress")})
            return can.onappend._output(can, can.Conf(), res._event, can.Pack(cmds), cb, silent)
        })
        return true
    },
    _refresh: function(can, msg) {
        can.core.Timer(parseInt(msg.Option("_delay")||"500"), function() {
            var sub = can.request({}, {_count: parseInt(msg.Option("_count"))-1})
            can.onappend._output(can, can.Conf(), sub._event, can.Pack())
        })
        return true
    },
    _field: function(can, msg) {
        msg.Table(function(item) { can.onappend._plugin(can, item, {}, function(sub, meta) {
            sub.run = function(event, cmds, cb, silent) {
                var res = can.request(event); can.core.Item(can.Option(), function(key, value) {
                    res.Option(key) || res.Option(key, value)
                })
                can.run(event, (msg["_prefix"]||[]).concat(cmds), cb, true)
            }
        }) })
        return true
    },
})
Volcanos("onaction", {help: "交互操作", list: [], _init: function(can, msg, list, cb, target) {
    },
    change: function(event, can, name, value, cb) {
        return can.page.Select(can, can._option, "input.args", function(input) {
            if (input.name == name && value != input.value) { input.value = value
                var data = input.dataset || {}; data.action == "auto" && can.run(event, can.Pack(), cb)
                return input
            }
        })
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

    "关闭": function(event, can) {
        can.page.Remove(can, can._target)
    },
    "复制": function(event, can) {
        can.onaction._show(can, args, {
            position: "fixed",
            left: layout.left+100, top: layout.top+100,
            width: layout.width, height: layout.height,
        })
    },
    "分屏": function(event, can) {
        if (event.ctrlKey) {
            layout.height = layout.height/2
            can.onaction._resize(sub, layout)

            can.onaction._show(can, args, {
                position: "fixed",
                left: layout.left, top: layout.top+layout.height+10,
                width: layout.width, height: layout.height,
            })
            return
        }

        layout.width = layout.width/2
        can.onaction._resize(sub, layout)

        can.onaction._show(can, args, {
            position: "fixed",
            left: layout.left+layout.width+10, top: layout.top,
            width: layout.width, height: layout.height,
        })
    },
    "最大": function(event, can) {
        can.page.Modify(can, can._target, {style: { margin: 0,
            left: 0, top: 0, width: window.innerWidth, height: window.innerHeight
        }})

        var sub = can.core.Value(can, "_outputs.-1")
        var cb = can.core.Value(can, "_outputs.-1.onimport.resize")
        sub && cb && can.core.CallFunc(cb, {can: sub,
            width: window.innerWidth, height: window.innerHeight,
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: []})
