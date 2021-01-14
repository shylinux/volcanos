Volcanos("onfigure", {help: "控件详情", list: [], key: {onclick: function(event, can, item, target) { function run() {
    var msg = can.request(event, can.Option()); msg.Option("action", item._action)
    can.run(event, ["action", "inputs", item.name, target.value], function(msg) {
        if (!msg.append) { return }

        can._figure && can.page.Remove(can, can._figure.fieldset)
        var figure = can.onappend.field(can, document.body, "input key", {})
        can._figure = figure; can.onlayout.figure(can, figure, event)

        can.onappend._action(can, [
            {button: ["清空", function(event) { target.value = "" }]},
            {button: ["关闭", function(event) { can.page.Remove(can, can._figure.fieldset) }]},
        ], can._figure.action)

        can.onappend.table(can, msg, can._figure.output, "content", function(value, key, index, line) {
            return {type: "td", inner: value, onclick: function() {
                target.value = value; msg.Option("_refresh") && run()
                can.page.Remove(can, can._figure.fieldset) 
            }}
        })
    }, true)
}; run() }}, }, ["/plugin/input/key.css"])

