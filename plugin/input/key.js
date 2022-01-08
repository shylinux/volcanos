Volcanos("onfigure", {help: "控件详情", list: [], key: {onclick: function(event, can, meta, cb, target) {
    can.run(event, [ctx.ACTION, mdb.INPUTS, meta.name, target.value], function(msg) {
        if (msg.Length() == 0) { return can.page.Remove(can, can._target) }

        can.onappend._action(can, [cli.CLOSE, cli.CLEAR], can._action, {
            close: function(event) { can.page.Remove(can, can._target) },
            clear: function(event) { target.value = "" },
        })

        function show(msg) { can.onmotion.clear(can)
            can.onappend.table(can, msg, function(value, key, index, line) {
                return {text: [value, html.TD], onclick: function() { target.value = line[key]
                    msg.Option(ice.MSG_PROCESS) == ice.PROCESS_AGAIN? can.run({}, [ctx.ACTION, mdb.INPUTS, meta.name, target.value], function(msg) {
                        show(msg)
                    }): can.page.Remove(can, can._target) 
                }}
            }), can.Status(mdb.COUNT, msg.Length())
        }
        show(msg), can.onlayout.figure(event, can)
    })
}}})

