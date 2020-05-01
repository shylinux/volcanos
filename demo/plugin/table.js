Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, msg, list, cb, output, action, option, field) { output.innerHTML = "";
        var table = can.page.AppendTable(can, output, msg, msg.append, function(event, value, key, index, tr, td) {
            can.page.Select(can, option, "input.args", function(input) { if (input.name == key) {
                input.value = value
            } })

        }, function(event, value, key, index, tr, td) {
        });

        msg.result && can.page.AppendBoard(can, output, msg.result.join(""))
    },
})
Volcanos("onaction", {help: "控件交互", list: [],
    onclick: function(event, can) {
        can.run(event, [], function() {})
    },
})



