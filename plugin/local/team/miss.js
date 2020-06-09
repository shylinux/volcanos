Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) { can._target.innerHTML = ""
        can.ui = can.page.Append(can, can._target, [
            {view: ["content", "table"]},
            {view: ["display", "table"]},
        ])

        can.onimport[can.Option("scale")](can, msg)
    },
    _task: function(can, msg, time, list, view) {
        return {text: ["", "td"],
            ondragover: function(event) { event.preventDefault()
                can.page.Select(can, can.ui.content, "td", function(item) {
                    can.page.ClassList.del(can, item, "over")
                }), can.page.ClassList.add(can, event.target, "over")
            },
            ondrop: function(event) { event.preventDefault()
                can.drop(event, event.target, time)
            },
            list: can.core.List(list, function(task) {
                return {view: [task.status, "div", view!="detail"? task.name: task.name+": "+task.text], title: task.text, draggable: true,
                    ondragstart: function(event) { var target = event.target; can.drop = function(event, td, time) {
                        var msg = can.request(event); msg.Option(task)
                        td.append(target), can.run(event, ["action", "modify", "begin_time", time, task.begin_time], function(msg) {
                            task.begin_time = time, can.onimport._display(can, msg, task)
                            can.onappend.toast(can, "修改成功")
                        }, true)
                    } },
                    onclick: function(event) {
                        can.onimport._display(can, msg, task)
                    }, oncontextmenu: function(event) { var target = event.target
                        can.onappend.carte(can, can.ondetail, can.ondetail.list, function(event, item) {
                            var msg = can.request(event); msg.Option(task)
                            can.run(event, ["action", "modify", "status", item, task.status], function(msg) {
                                target.className = task.status = item
                                can.onimport._display(can, msg, task)
                                can.onappend.toast(can, "修改成功")
                            }, true)
                        })
                    }}
            }) }
    },
    _display: function(can, msg, task) { can.ui.display.innerHTML = ""
        can.Status(task)

        can.page.Append(can, can.ui.display, [{th: ["key", "value"]}])
        can.core.Item(task, function(key, value) {
            can.page.Append(can, can.ui.display, [{td: [key, value], oncontextmenu: function(event) { var target = event.target
                can.onappend.carte(can, can.ondetail, ["编辑"].concat(can.ondetail.list), function(event, item, meta) {
                    var res = can.request(event); res.Option(task)
                    switch (item) {
                        case "编辑":
                            can.onappend.modify(can, target, function(ev, value, old) {
                                can.run(event, ["action", "modify", key, value, old], function(res) {
                                    task[key] = value
                                    can.onimport._display(can, msg, task)
                                    can.onappend.toast(can, "修改成功")
                                }, true)
                            })
                            break
                        default:
                            can.run(event, ["action", "modify", "status", item, task.status], function(res) {
                                task.status = item
                                can.onimport._display(can, msg, task)
                                can.onappend.toast(can, "修改成功")
                            }, true)
                    }
                })
            }}])
        })
    },
    day: function(can, msg) { var begin_time = new Date(can.base.Time(can.Option("begin_time")))
        function set(hour) {
            return can.base.Time(new Date(begin_time-((begin_time.getHours()-hour))*60*60*1000))
        }

        var hash = {}; msg.Table(function(value) { var time = new Date(value.begin_time)
            var key = time.getHours(); hash[key] = (hash[key]||[]).concat([value])
        })

        var list = [0]; for (var i = 6; i < 24; i++) { list.push(i) }

        var table = can.page.Append(can, can.ui.content, [{type: "table", list: 
            can.core.List(list, function(hour, index) {
                if (index == 0) { return {type: "tr", list: [{text: ["time", "th"]}, {text: ["text", "th"]}]} }
                return {type: "tr", list: [{text: [can.base.Number(hour), "td"]}, can.onimport._task(can, msg, set(hour), hash[hour], "detail")]}
            })
        }]).table
    },
    week: function(can, msg) { var begin_time = new Date(can.base.Time(can.Option("begin_time")))
        function set(week, hour) {
            return can.base.Time(new Date(begin_time-((begin_time.getDay()-week)*24+(begin_time.getHours()-hour))*60*60*1000))
        }

        var hash = {}; msg.Table(function(value) { var time = new Date(value.begin_time)
            var key = time.getDay()+" "+time.getHours()
            hash[key] = (hash[key]||[]).concat([value])
        })

        var head = ["time"].concat(["周日", "周一", "周二", "周三", "周四", "周五", "周六"]);
        var list = [0]; for (var i = 6; i < 24; i++) { list.push(i) }

        var table = can.page.Append(can, can.ui.content, [{type: "table", list: 
            can.core.List(list, function(hour, index) {
                if (index == 0) { return {type: "tr", list: can.core.List(head, function(head) { return {text: [head, "th"]} })} }
                return {type: "tr", list: can.core.List(head, function(head, index) { if (index == 0) { return {text: [hour, "td"]} }
                    return can.onimport._task(can, msg, set(index-1, hour), hash[index-1+" "+hour])
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
Volcanos("onaction", {help: "组件交互", list: ["添加"],
    "添加": function(event, can, key) {
        can.require(["/plugin/input/date"], function(can) {
            console.log("waht")
        })
        function time(event) {
            can.onfigure.date.onclick(event, can, {}, event.target)
        }
        can.user.input(event, can, [
            "zone", "type", "name", "text",
            {name: "begin_time", type: "input", value: can.base.Time(), onclick: time},
            {name: "end_timem", type: "input", value: can.base.Time(), onclick: time},
        ], function(event, button, data, list) {
            can.run(event, ["action", "insert"].concat(list), function(msg) {

            }, true)
            return true
        })
    },
})
Volcanos("ondetail", {help: "菜单交互", list: ["prepare", "process", "finish", "cancel"],
})
Volcanos("onexport", {help: "导出数据", list: ["begin_time", "zone", "id", "type", "name"],
})

