Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, conf, list, cb, target) {
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

            sub.run(event, args, function(msg) {
                typeof cb == "function" && cb(msg)
            })
            return true
        }): can.run(event, ["action", name], function(msg) {
            typeof cb == "function" && cb(msg)
        })
    },
    change: function(event, can, name, value, cb) {
        can.page.Select(can, can._option, "input.args", function(input) { if (input.name == name) { var data = input.dataset || {}
            if (value != input.value) { input.value = value;
                data.action == "auto" && typeof cb == "function" && cb()
            }
        } })
    },
})
