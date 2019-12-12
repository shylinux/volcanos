Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, conf, output) {
        can.user.toast = function(text, title, duration, list) {if (!text) {return can.Hide()}
            text = typeof text == "object"? text: {list: list, text: text, title: title||""}
            text.duration = text.duration || conf.duration || 3000

            var list = [{text: [text.title||"", "div", "title"]},
                {text: [text.text||"", "div", "content"]},
                {view: ["form"], list: text.list||[{type: "button", inner: "ok", click: function() {
                    timer.stop = true
                }}]},
                {text: [text.tick||"", "div", "tick"]},
            ]

            var toast = can.page.Appends(can, output, list)
            var width = text.width||text.text.length*10+100
            width = width>400?400:width
            can.Show(event, width, text.height||80)

            var begin = can.base.Time().split(" ")[1]
            var timer = can.Timer({value: 1000, length: text.duration > 0? text.duration/1000: text.duration}, function(t, i) {
                if (i < 10) {return}
                if (i > 10000) {return true}
                toast.tick.innerHTML = can.base.Duration(i*t) + " after " + begin
                console.log(t, i)
            }, function() {
                can.Hide()
            })
            timer.toast = toast
            return timer
        }
    },
    show: function(event, can, value, cmd, output) {
    }
})
Volcanos("onaction", {help: "组件交互", list: []})
Volcanos("onchoice", {help: "组件菜单", list: []})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

