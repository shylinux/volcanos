Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, conf, list, cb, target) {
    },
})
Volcanos("onaction", {help: "交互操作", list: [], _init: function(can, msg, list, cb, target) {
                    // can.onaction._process(can, sub, value, msg, cmds, cb, silent)
    },
    _process: function(can, sub, conf, msg, cmds, cb, silent) {
        var p = can.onaction[msg.Option("_process")]
        typeof p == "function"? p(can, sub, conf, msg, cmds, cb, silent): typeof cb == "function" && cb(msg)
        can.run(msg._event, ["search", "Footer.onaction.ncmd"])
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
        can.Timer(1000, function() {
            var res = sub.request({})
            res.Option("_progress", msg.Option("_progress"))
            sub.run(res._event, cmds, cb, silent)
        })
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
})
