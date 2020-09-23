Volcanos("onfigure", {help: "控件详情", list: [], _init: function(can, item, target, cb) {
        can.core.Item(can.onfigure.key, function(key, value) { if (key.startsWith("on")) {
            target[key] = function(event) {
                cb(event), value(event, can, item, target)
            }
        } })
    },
    key: {onclick: function(event, can, item, target) {
        function run() { var msg = can.request(event); msg.Option(can.Option())
            can.run(event, ["action", "inputs", item.name, target.value], function(msg) {
                if (!msg.append) { return }

                can._figure && can.page.Remove(can, can._figure.fieldset)
                can._figure = can.onappend.field(can, document.body, "input key", {})

                var layout = {top: event.clientY+10, left: event.clientX}
                can.onmotion.move(can, can._figure.fieldset, layout)
                can.page.Modify(can, can._figure.fieldset, {style: layout})
                can.page.Remove(can, can._figure.legend)

                can.page.Append(can, can._figure.action, [
                    {button: ["清空", function(event) { target.value = "" }]},
                    {button: ["关闭", function(event) { can.page.Remove(can, can._figure.fieldset) }]},
                ])

                can.page.AppendTable(can, can._figure.output, msg, msg.append, function(value, key, index, line) {
                    return {type: "td", inner: value, onclick: function() {
                        target.value = value; msg.Option("_refresh") && run()
                        can.page.Remove(can, can._figure.fieldset) 
                    }}
                })
            }, true)
        }
        run()
    }},
}, ["/plugin/input/key.css"])

