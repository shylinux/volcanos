Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, conf, output, action, option, field) {
        can.page.Append(can, option, [{input: ["cmd", function(event) {
            function run(cmd) {
                var msg = can.Event(event);
                msg.detail = [cmd]
                msg._time = can.base.Time()
                msg._source = can
                can.Export(event, msg, "favor")
                if (msg._hand) {
                    event.target.value = ""
                }
                return msg
            }

            if (can.page.oninput(event, can, function(event) {
                event.stopPropagation()
                event.preventDefault()
                return true
            })) {return}

            switch (event.key) {
                case "Enter":
                    var msg = run(event.target.value.trim())
                    output.innerHTML = msg.Result()
                    break
                case "Escape":
                    can.Hide()
                    break
            }
        }, function(event) {
            if (event.ctrlKey) {
                event.stopPropagation()
                event.preventDefault()
                return true
            }

        }]}])
    },
})
Volcanos("onaction", {help: "组件交互", list: []})
Volcanos("onchoice", {help: "组件菜单", list: []})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})



