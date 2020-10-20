Volcanos("onfigure", {help: "控件详情", list: [],
    city: {click: function(event, can, value, cmd, target, figure) {
        function run() {figure.output.innerHTML = ""
            can.Run(event, ["action", "input", can.item.name, target.value], function(msg) {
                can.page.AppendTable(can, msg, figure.output, msg.append, function(event, value, key, index, tr, td) {
                    target.value = value; msg.Option("_refresh") && run()
                })
            }, true)
        }
        run()
    }},
})

