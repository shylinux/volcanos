Volcanos("onfigure", {help: "控件详情", list: [], _merge: function(can, sub) { can.core.Item(sub, function(key, value) {
        if (sub.hasOwnProperty(key)) { can.onfigure[key] = value }
    }); return true },

    key: {onclick: function(event, can, item, target) {
        function run() { var msg = can.request(event); msg.Option(item)
            can.run(event, ["action", "input", item.name, target.value], function(msg) {
                if (!msg.append) { return }

                var figure = can.onappend.field(can, document.body, "input key", {})
                can.page.Modify(can, figure.fieldset, {style: {top: event.clientY+10, left: event.clientX}})
                can.page.Remove(can, figure.legend)

                can.page.Append(can, figure.action, [
                    {button: ["清空", function(event) { target.value = "" }]},
                    {button: ["关闭", function(event) { can.page.Remove(can, figure.fieldset) }]},
                ])

                can.page.AppendTable(can, figure.output, msg, msg.append, function(event, value, key, index, tr, td) {
                    target.value = value; msg.Option("_refresh") && run()
                    can.page.Remove(can, figure.fieldset) 
                })
            }, true)
        }
        run()
    }},
})
