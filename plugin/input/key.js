Volcanos("onfigure", {help: "控件详情", list: [], key: {onclick: function(event, can, meta, cb, target) {
    can.run(event, ["action", "inputs", meta.name, target.value], function(msg) {
        if (msg.Length() == 0) { return can.page.Remove(can, can._target) }

        can.onappend._action(can, ["关闭", "清空"], can._action, {
            "关闭": function(event) { can.page.Remove(can, can._target) },
            "清空": function(event) { target.value = "" },
        })

        can.onappend.table(can, msg, function(value, key, index, line) {
            return {text: [value, "td"], onclick: function() {
                target.value = line[key], can.page.Remove(can, can._target) 
            }}
        }), can.Status("count", msg.Length())
        can.onlayout.figure(event, can)
    })
}}})

