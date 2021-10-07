Volcanos("onfigure", {help: "控件详情", list: [], key: {onclick: function(event, can, meta, cb, target) {
    can.run(event, [ctx.ACTION, "inputs", meta.name, target.value], function(msg) {
        if (msg.Length() == 0) { return can.page.Remove(can, can._target) }

        can.onappend._action(can, ["close", "clear"], can._action, {
            "close": function(event) { can.page.Remove(can, can._target) },
            "clear": function(event) { target.value = "" },
        })

        function show(msg) {
            can.onmotion.clear(can)
            can.onappend.table(can, msg, function(value, key, index, line) {
                return {text: [value, "td"], onclick: function() {
                    target.value = line[key]
                    msg.Option("_process") == "_again"? can.run({}, [ctx.ACTION, "inputs", meta.name, target.value], function(msg) {
                        show(msg)
                    }): can.page.Remove(can, can._target) 

                }}
            }), can.Status("count", msg.Length())
        }
        show(msg)

        can.onlayout.figure(event, can)
    })
}}})

