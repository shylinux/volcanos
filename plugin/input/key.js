Volcanos("onfigure", {help: "控件详情", list: [], key: {onclick: function(event, can, item, target) {
    can.run(event, ["action", "inputs", item.name, target.value], function(msg) {
        if (msg.Length() == 0) { return can.page.Remove(can, can._target) }

        can.onappend._action(can, ["关闭", "清空"], can._action, {
            "关闭": function(event) { can.page.Remove(can, can._target) },
            "清空": function(event) { target.value = "" },
        })

        can.onappend.table(can, msg, function(value) {
            return {text: [value, "td"], onclick: function() {
                target.value = value, can.page.Remove(can, can._target) 
            }}
        }), can.Status("count", msg.Length())
        can.onlayout.figure(can, event)
    })
}}})

