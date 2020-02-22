Volcanos("onfigure", {help: "控件详情", list: [],
    key: {click: function(event, can, value, cmd, target) {
        function add(msg, list, update) {
            can.page.Append(can, can.figure.output, [{view: "list", list: can.core.List(list, function(item) {
                return {text: [item, "div", "label"], onclick: function(event) {
                    target.value = item;
                    update && can.history.unshift(item);
                    msg.Option("_refresh") && run()
                }}
            })}])
        }
        function run() {can.figure.output.innerHTML = ""
            can.Run(event, ["action", "input", can.item.name, target.value], function(msg) {
                add(msg, can.history), can.core.List(msg.append, function(key) {add(msg, msg[key], true)})
            }, true)
        }

        can.history = can.history || [];
        can.onfigure._prepare(event, can, value, cmd ,target) && run()
    }},
    _prepare: function(event, can, value, cmd, target) {if (can.figure) {return}
        can.figure = can.page.Append(can, document.body, [{view: ["input "+cmd, "fieldset"], style: {
            position: "absolute", left: "20px", top: event.clientY+10+"px",
        }, list: [{text: [cmd, "legend"]}, {view: ["action"]}, {view: ["output"]}], onmouseleave: function(event) {
            !can.figure.stick && can.onfigure._release(event, can, value, cmd, target)
        }}])
        return can.figure
    },
    _release: function(event, can, value, cmd, target) {
        can.page.Remove(can, can.figure.first); delete(can.figure);
    },
})
