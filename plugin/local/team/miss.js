Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) { can._target.innerHTML = ""
        can.ui = can.page.Append(can, can._target, [
            {view: ["content", "table"]},
            {view: ["display", "table"]},
        ])

        can.onimport[can.Option("scale")](can, msg)
    },
    _task: function(can, msg, time, values) {
        return {text: ["", "td"],
            ondragover: function(event) { event.preventDefault()
                can.page.Select(can, can.ui.content, "td", function(item) {
                    can.page.ClassList.del(can, item, "over")
                }), can.page.ClassList.add(can, event.target, "over")
            },
            ondrop: function(event) { event.preventDefault()
                can.run(event, ["action", "modify", "begin_time", time, ""], function(msg) {
                    value.begin_time = begin_time
                    can.onimport._display(can, msg, value)
                    can.onappend.toast(can, "修改成功")
                }, true)

                event.target.append(can.task)
            },
            list: can.core.List(values, function(value) {
                return {view: [value.status, "div", value.name], draggable: true,
                    ondragstart: function(event) { can.task = event.target },
                    ondragover: function(event) { event.preventDefault() },
                    ondrop: function(event) { event.preventDefault() },
                    onclick: function(event) {
                        can.onimport._display(can, msg, value)
                    }, oncontextmenu: function(event) { var target = event.target
                        can.onappend.carte(can, can.ondetail, can.ondetail.list, function(event, item) {
                            var msg = can.request(event); msg.Option(value)
                            can.run(event, ["action", "modify", "status", item, value.status], function(msg) {
                                target.className = value.status = item
                                can.onimport._display(can, msg, value)
                                can.onappend.toast(can, "修改成功")
                            }, true)
                        })
                    }}

            }) }

    },
    _display: function(can, msg, value) { can.ui.display.innerHTML = ""
        can.page.Append(can, can.ui.display, [{type: "tr", list: [{text: ["key", "th"]}, {text: ["value", "th"]}]}])
        can.core.Item(value, function(key, value) {
            can.page.Append(can, can.ui.display, [{type: "tr", list: [{text: [key, "td"]}, {text: [value, "td"]}]}])
        })
    },
    day: function(can, msg) {
        var hash = {}; msg.Table(function(value) { var time = new Date(value.time)
            var key = time.getHours(); hash[key] = (hash[key]||[]).concat([value])
        })

        var list = [0]; for (var i = 6; i < 24; i++) { list.push(i) }

        var table = can.page.Append(can, can.ui.content, [{type: "table", list: 
            can.core.List(list, function(hour, index) {
                if (index == 0) { return {type: "tr", list: [{text: ["time", "th"]}, {text: ["text", "th"]}]} }
                return {type: "tr", list: [{text: [can.base.Number(hour), "td"]}, can.onimport._task(can, msg, "2020-06-08 "+hour+":00:00", hash[hour])]}
            })
        }]).table
    },
    week: function(can, msg) {
        var hash = {}; msg.Table(function(value) { var time = new Date(value.time)
            var key = time.getDay()+" "+time.getHours()
            hash[key] = (hash[key]||[]).concat([value])
        })

        var head = ["time"].concat(["周日", "周一", "周二", "周三", "周四", "周五", "周六"]);
        var list = [0]; for (var i = 6; i < 24; i++) { list.push(i) }

        var table = can.page.Append(can, can.ui.content, [{type: "table", list: 
            can.core.List(list, function(hour, index) {
                if (index == 0) { return {type: "tr", list: can.core.List(head, function(head) { return {text: [head, "th"]} })} }
                return {type: "tr", list: can.core.List(head, function(head, index) { if (index == 0) { return {text: [hour, "td"]} }
                    return {text: ["", "td"], list: can.core.List(hash[index-1+" "+hour], function(value) {
                        return can.onimport._task(can, msg, value)
                    })}
                })}
            })
        }]).table
    },
    month: function(can, msg) {
    },
    months: function(can, msg) {
    },
    year: function(can, msg) {
    },
    long: function(can, msg) {
    },
}, ["/plugin/local/team/miss.css"])
Volcanos("onaction", {help: "组件交互", list: [],
})
Volcanos("ondetail", {help: "菜单交互", list: ["prepare", "process", "finish", "cancel"],
})
Volcanos("onexport", {help: "导出数据", list: [],
})

