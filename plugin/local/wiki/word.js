Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, msg, list, cb, target) { can._output.innerHTML = "";
        can.onappend.table(can, target, "table", msg)

        // if (msg.Option("_display") == "table") {
        //     var table = can.page.AppendTable(can, can._output, msg, msg.append, function(event, value, key, index, tr, td) {
        //         can.page.Select(can, can._option, "input.args", function(input) { if (input.name == key) { var data = input.dataset || {}
        //             input.value = value
        //             if (data.action == "auto") {
        //                 can.run(event, [], function(msg) {})
        //             }
        //         } })
        //     })
        //     return typeof cb == "function" && cb(msg);
        // }
        //
        can._output.innerHTML = msg.Result()

        can.page.Select(can, can._output, "fieldset.story", function(item) {var data = item.dataset
            can.onappend._init(can, JSON.parse(data.meta||"{}"), Config.libs.concat(["plugin/state.js"]), function(sub) {
                sub.run = function(event, cmds, cb, silent) {
                    can.run(event, ["field", "action", "story", data.type, data.name, data.text].concat(cmds), cb, silent)
                }
            }, item)
        })
        return typeof cb == "function" && cb(msg)
    },
}, ["plugin/local/wiki/word.css"])

