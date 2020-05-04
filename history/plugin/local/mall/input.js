Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, feature, output, action, option) {
        function passcode(event) {
            can.Run(event, [], function(msg) {
                can.page.Appends(can, output, [{type: "img", src: "data:image/jpg;base64,"+msg.image[0], onclick: function(event) {
                    var p = can.page.Append(can, output, [{view: ["what", "div"], dataset: {meta: ""+(event.offsetX+1)+","+(event.offsetY-30+1)+""}, style: {
                        background: "red", position: "absolute", width: "20px", height: "20px",
                        left: event.offsetX+1+"px", top: event.offsetY+30+1+"px",
                    }, onclick: function(event) {
                        p.parentNode.removeChild(p)
                    }}]).what
                }}])
            }, true)
        }

        can.page.Append(can, option, [
            {button: ["刷新", passcode]},
            {username: ["账号", "args"]}, {password: ["密码", "args"]},
            {button: ["登录", function(event) {
                var point = can.page.Select(can, output, "div.what", function(item) {return item.dataset.meta}).join(",")
                point == ""? can.page.toast("请点击图片"): can.Run(event, ["check", point], function(msg) {
                    if (msg.result_code == "4") {
                        var input = can.page.Select(can, option, "input.args", function(item) {return item.value})
                        can.Run(event, ["login"].concat(input).concat([msg.cmds[4]]), function(msg) {
                            can.page.toast(msg.result_message[0])
                        })
                    } else {
                        passcode(event)
                    }
                }, true)
            }]},
        ])
    },
})
Volcanos("onaction", {help: "控件交互", list: []})
Volcanos("onchoice", {help: "控件菜单", list: []})
Volcanos("ondetail", {help: "控件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

