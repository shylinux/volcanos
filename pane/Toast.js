Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, output) {
    can.user.toast = function(text, title, duration, list) {if (!text) {return can.Hide()}
        text = typeof text == "object"? text: {list: list, text: text, title: title||"", duration: duration||3000}

        var list = [{text: [text.title||"", "div", "title"]},
            {text: [text.text||"", "div", "content"]},
            {view: ["form"], list: text.list||[{type: "button", inner: "cancel", click: function() {
                timer.stop = true
            }}]},
            {text: [text.tick||"", "div", "tick"]},
        ]

        var toast = can.page.Appends(can, output, list)
        var width = text.width||text.text.length*10+10
        can.Show(width>400?400:width, text.height||80)

        var begin = can.base.Time().split(" ")[1]
        var timer = can.Timer({value: 1000, length: text.duration > 0? text.duration/1000: text.duration}, function(t, i) {
            console.log(t, i)
            if (i > 10000) {return true}
            toast.tick.innerHTML = can.base.Duration(i*t) + " after " + begin
        }, function() {
            can.Hide()
        })
    }
}})
Volcanos("onaction", {help: "组件交互", list: []})
Volcanos("onchoice", {help: "组件菜单", list: []})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

