Volcanos("onfigure", {help: "控件详情", list: [], key: {onclick: function(event, can, item, target, figure) { function run() {
    var msg = can.request(event, can.Option())
    can.run(event, ["action", "inputs", item.name, target.value], function(msg) {
        if (!msg.append) { return }

        can.onappend._action(can, [
            {button: ["清空", function(event) { target.value = "" }]},
            {button: ["关闭", function(event) { can.page.Remove(can, figure.fieldset) }]},
        ], figure.action)

        can.onappend.table(can, "content", msg, function(value, key, index, line) {
            return {type: "td", inner: value, onclick: function() {
                target.value = value, msg.Option("_refresh") && run()
                can.page.Remove(can, figure.fieldset) 
            }}
        }, figure.output)
    }, true)
}; run() }}, }, [])

