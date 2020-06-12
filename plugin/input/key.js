Volcanos("onfigure", {help: "控件详情", list: [], _merge: function(can, sub) { can.core.Item(sub, function(key, value) {
        if (sub.hasOwnProperty(key)) { can.onfigure[key] = value }
    }); return true },

    key: {onclick: function(event, can, item, target) {
        can._figure && can.page.Remove(can, can._figure.fieldset)
        can._figure = can.onappend.field(can, can._target, "input key", {})

        var figure = can._figure, offset = can.page.offset(can._target)
        can.page.Modify(can, figure.fieldset, {style: {top: event.clientY-offset.Top+60, left: event.clientX-offset.Left+60}})
        can.page.Remove(can, figure.legend), can.page.Append(can, figure.action, [
            {button: ["关闭", function(event) {
                can._figure && can.page.Remove(can, can._figure.fieldset)
            }]},
        ])

        function run() { var msg = can.request(event); msg.Option(item)
            can.run(event, ["action", "input", item.name, target.value], function(msg) {
                can.page.AppendTable(can, figure.output, msg, msg.append, function(event, value, key, index, tr, td) {
                    target.value = value; msg.Option("_refresh") && run()
                })
            }, true)
        }
        run()
    }},
})
