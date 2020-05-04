Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, msg, list, cb, target) { can._output.innerHTML = "";
        var table = can.page.AppendTable(can, can._output, msg, msg.append, function(event, value, key, index, tr, td) {
            can.page.Select(can, can._option, "input.args", function(input) { if (input.name == key) { var data = input.dataset || {}
                input.value = value
                if (data.action == "auto") {
                    can.run(event, [], function(msg) {})
                }
            } })
        }, function(event, value, key, index, tr, td) {
        });
        msg.result && can.page.AppendBoard(can, can._output, msg.result.join(""))
    },
})
Volcanos("onaction", {help: "控件交互", list: [],
    onclick: function(event, can) {
        can.run(event, [], function() {})
    },
})



