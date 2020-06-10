Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) { can._target.innerHTML = ""
        can.ui = can.page.Append(can, can._target, [
            {view: ["project", "table"], style: {display: can.user.Search(can, "project")||"none"}},
            {view: ["content", "table"]},
            {view: ["profile", "table"], style: {display: can.user.Search(can, "project")||"none"}},
        ])

        can.Timer(10, function() { can.onimport._stat(can, msg)
            can.page.Select(can, can.ui.content, "div.item.id"+can.user.Search(can, "id"), function(item) {
                item.click()
            })
        })
        can.onimport[can.Option("scale")](can, msg)
    },
    _stat: function(can, msg) {
        var stat = {
            l1: 0, l2: 0, l3: 0, l4: 0, l5: 0,
            prepare: 0, process: 0, cancel: 0, finish: 0,
            s1: 0, s2: 0, s3: 0, s4: 0, s5: 0,
            count: 0,
        }
        msg.Table(function(value) {
            stat["l"+(value.level||"3")]++
            stat["s"+(value.score||"3")]++
            stat[value.status]++
            stat.count++
        })
        can.Status("count", stat.process+"/"+stat.count)
        can.page.Append(can, can.ui.project, [
            {th: ["key", "value"]},
            {td: ["prepare", stat.prepare]},
            {td: ["process", stat.process]},
            {td: ["cancel", stat.cancel]},
            {td: ["finish", stat.finish]},
            stat.l1 > 0 && {td: ["level-1", stat.l1]},
            stat.l2 > 0 && {td: ["level-2", stat.l2]},
            stat.l3 > 0 && {td: ["level-3", stat.l3]},
            stat.l4 > 0 && {td: ["level-4", stat.l4]},
            stat.l5 > 0 && {td: ["level-5", stat.l5]},
            stat.s1 > 0 && {td: ["score-1", stat.s1]},
            stat.s2 > 0 && {td: ["score-2", stat.s2]},
            stat.s3 > 0 && {td: ["score-3", stat.s3]},
            stat.s4 > 0 && {td: ["score-4", stat.s4]},
            stat.s5 > 0 && {td: ["score-5", stat.s5]},
        ])
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
                return typeof task == "string"? {view: ["date", "div", task]}: {view: [["item", task.status, "id"+task.id, "l"+(task.level||""), "s"+(task.score||"")].join(" "),
                    "div", can.onexport[can.Action("view")||view||"name"](can, task)],
                    title: can.onexport.title(can, task), draggable: true,
                    ondragstart: function(event) { var target = event.target; can.drop = function(event, td, time) { td.append(target)
                        can.onaction.modifyTask(event, can, task, "begin_time", time, task.begin_time)
                    } }, onclick: function(event) {
                        can.onimport._profile(can, msg, task)
                    }, oncontextmenu: function(event) { var target = event.target
                        can.onappend.carte(can, can.ondetail, can.ondetail.list, function(event, item) {
                        })
                    }}
            }) }
    },
    _profile: function(can, msg, task) { can.ui.profile.innerHTML = ""
        can.Status(task)

        can.page.Append(can, can.ui.profile, [{th: ["key", "value"]}])
        can.core.Item(task, function(key, value) {
            can.page.Append(can, can.ui.profile, [{td: [key, value], ondblclick: function(event) {
                can.onappend.modify(can, event.target, function(ev, value, old) {
                    can.onaction.modifyTask(event, can, task, key, value)
                })
            }, oncontextmenu: function(event) { var target = event.target
                can.onappend.carte(can, can.ondetail, ["编辑"].concat(can.ondetail.list), function(event, item, meta) {
                    switch (item) {
                        case "编辑":
                            can.onappend.modify(can, target, function(ev, value, old) {
                                can.onaction.modifyTask(event, can, task, key, value)
                            })
                            break
                        default:
                            can.onaction.modifyTask(event, can, task, "status", item)
                    }
                })
            }}])
        })
    },

    day: function(can, msg) { var begin_time = new Date(can.base.Time(can.Option("begin_time")))
        function key(time) { return time.getHours() }
        var hash = {}; msg.Table(function(value) {
            var k = key(new Date(value.begin_time)); hash[k] = (hash[k]||[]).concat([value])
        })

        var head = ["hour", "task"]
        var list = [0]; for (var i = 6; i < 24; i++) { list.push(i) }

        function set(hour) { return can.base.Time(can.base.TimeAdd(begin_time, hour/24)) }
        var table = can.page.Append(can, can.ui.content, [{type: "table", list: 
            can.core.List(list, function(hour, row) {
                if (row == 0) { return {type: "tr", list: can.core.List(head, function(head) { return {text: [head, "th"]} })} }
                return {type: "tr", list: [{text: [can.base.Number(hour), "td"]}, can.onimport._task(can, msg, set(hour), hash[hour], "text")]}
            })
        }]).table
    },
    week: function(can, msg) { var begin_time = new Date(can.base.Time(can.Option("begin_time")))
        function key(time) { return time.getDay()+" "+time.getHours() }
        var hash = {}; msg.Table(function(value) {
            var k = key(new Date(value.begin_time)); hash[k] = (hash[k]||[]).concat([value])
        })

        var head = ["hour"].concat(["周日", "周一", "周二", "周三", "周四", "周五", "周六"]);
        var list = [0]; for (var i = 6; i < 24; i++) { list.push(i) }

        function set(week, hour) { return can.base.Time(can.base.TimeAdd(begin_time, week-begin_time.getDay()+hour/24)) }
        var table = can.page.Append(can, can.ui.content, [{type: "table", list: 
            can.core.List(list, function(hour, row) {
                if (row == 0) { return {type: "tr", list: can.core.List(head, function(head) { return {text: [head, "th"]} })} }
                return {type: "tr", list: can.core.List(head, function(head, index) {
                    if (index == 0) { return {text: [hour, "td"]} }
                    return can.onimport._task(can, msg, set(index-1, hour), hash[index-1+" "+hour])
                })}
            })
        }]).table
    },
    month: function(can, msg) { var begin_time = new Date(can.base.Time(can.Option("begin_time")))
        function key(time) { return can.base.Time(time, "%y-%m-%d") }
        var hash = {}; msg.Table(function(value) {
            var k = key(new Date(value.begin_time)); hash[k] = (hash[k]||[]).concat([value])
        })

        var head = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
        var list = [0]; for (var i = 1; i < 6; i++) { list.push(i) }

        var begin = can.base.TimeAdd(begin_time, -(begin_time.getDate()-1))
        var last = can.base.TimeAdd(begin_time, -(begin_time.getDate()-1)-begin.getDay())

        var table = can.page.Append(can, can.ui.content, [{type: "table", list: 
            can.core.List(list, function(date, row) {
                if (row == 0) { return {type: "tr", list: can.core.List(head, function(head) { return {text: [head, "th"]} })} }
                return {type: "tr", list: can.core.List(head, function(head, col) {
                    var day = can.base.TimeAdd(last, (row-1)*7+col+1);
                    var list = [day.getDate()+""].concat(hash[key(day)]||[])
                    return can.onimport._task(can, msg, key(day)+can.base.Time(" %H:%M:%S"), list)
                })}
            })
        }]).table
    },
    year: function(can, msg) { var begin_time = new Date(can.base.Time(can.Option("begin_time")))
        function key(time) { return can.base.Time(time, "%y-%m") }
        var hash = {}; msg.Table(function(value) {
            var k = key(new Date(value.begin_time)); hash[k] = (hash[k]||[]).concat([value])
        })

        var head = ["month", "task"]
        var list = [0]; for (var i = 1; i < 13; i++) { list.push(i) }

        function set(month) { return begin_time.getFullYear()+"-"+can.base.Number(month, 2) }
        var table = can.page.Append(can, can.ui.content, [{type: "table", list: 
            can.core.List(list, function(date, row) {
                if (row == 0) { return {type: "tr", list: can.core.List(head, function(head) { return {text: [head, "th"]} })} }
                return {type: "tr", list: can.core.List(head, function(head, col) {
                    if (col == 0) { return {text: [row+"", "td"]} }
                    return can.onimport._task(can, msg, set(row)+can.base.Time(begin_time, "-%d %H:%M:%S"), hash[set(row)], "text")
                })}
            })
        }]).table
    },
    long: function(can, msg) { var begin_time = new Date(can.base.Time(can.Option("begin_time")))
        function key(time) { return can.base.Time(time, "%y-%m") }
        var hash = {}; msg.Table(function(value) {
            var k = key(new Date(value.begin_time)); hash[k] = (hash[k]||[]).concat([value])
        })

        var head = ["month"]; for (var i = -5; i < 5; i++) { head.push(begin_time.getFullYear()+i) }
        var list = [0]; for (var i = 1; i < 13; i++) { list.push(i) }

        function set(month) { return begin_time.getFullYear()+"-"+can.base.Number(month, 2) }
        var table = can.page.Append(can, can.ui.content, [{type: "table", list: 
            can.core.List(list, function(date, row) {
                if (row == 0) { return {type: "tr", list: can.core.List(head, function(head) { return {text: [head, "th"]} })} }
                return {type: "tr", list: can.core.List(head, function(head, col) {
                    if (col == 0) { return {text: [row+"", "td"]} }
                    var key = head+"-"+can.base.Number(row, 2)
                    return can.onimport._task(can, msg, key+can.base.Time(begin_time, "-%d %H:%M:%S"), hash[key])
                })}
            })
        }]).table
    },
}, ["/plugin/local/team/miss.css"])
Volcanos("onaction", {help: "组件交互", list: ["统计","详情", "添加",
    ["level", "all", "l1", "l2", "l3", "l4", "l5"],
    ["status", "all", "prepare", "process", "cancel", "finish"],
    ["score", "all", "s1", "s2", "s3", "s4", "s5"],
    ["view", "", "name", "text", "level", "score"],
],
    modifyTask: function(event, can, task, key, value) {
        var msg = can.request(event); msg.Option(task)
        can.run(event, ["action", "modify", key, value, task[key]], function(msg) {
            task[key] = value, can.onimport._profile(can, can._msg, task)
            can.onappend.toast(can, "修改成功")
        }, true)
    },

    _filter: function(event, can, key, value) { var count = 0
        if (value == "all") {
            can.page.Select(can, can.ui.content, "div.item", function(item) {
                can.page.ClassList.del(can, item, "hidden")
                count++
            })
            can.Status("count", count)
            return
        }
        can.page.Select(can, can.ui.content, "div.item", function(item) {
            can.page.ClassList.add(can, item, "hidden")
        })
        can.page.Select(can, can.ui.content, "div."+value, function(item) {
            can.page.ClassList.del(can, item, "hidden")
            count++
        })
        can.Status("count", count)
    },
    level: function(event, can, key, value) { can.onaction._filter(event, can, key, value) },
    status: function(event, can, key, value) { can.onaction._filter(event, can, key, value) },
    score: function(event, can, key, value) { can.onaction._filter(event, can, key, value) },
    view: function(event, can, key, value) { can.ui.content.innerHTML = ""
        can.onimport[can.Option("scale")](can, can._msg)
    },

    "统计": function(event, can, key) {
        can.page.Modify(can, can.ui.project, {style: {display: can.ui.project.style.display=="none"? "table": "none"}})
    },
    "详情": function(event, can, key) {
        can.page.Modify(can, can.ui.profile, {style: {display: can.ui.profile.style.display=="none"? "table": "none"}})
    },
    "添加": function(event, can, key) {
        can.require(["/plugin/input/date"], function(can) {
            console.log("waht")
        })
        function time(event) {
            can.onfigure.date.onclick(event, can, {}, event.target)
        }
        can.user.input(event, can, [
            ["zone", "工作", "学习"], ["type", "项目开发", "项目测试"], "name", "text",
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
Volcanos("onexport", {help: "导出数据", list: ["count", "begin_time", "zone", "id", "type", "name"],
    name: function(can, task) {
        return task.name
    },
    text: function(can, task) {
        return task.name+": "+(task.text||"")
    },
    level: function(can, task) {
        return "l-"+(task.level||3)+": "+(task.name||"")
    },
    score: function(can, task) {
        return "s-"+(task.level||3)+": "+(task.name||"")
    },
    title: function(can, task) {
        return task.zone+": "+(task.type||"")
    },

    key: function(can, msg) {
        msg.Option("project", can.ui.project.style.display)
        msg.Option("profile", can.ui.profile.style.display)
        msg.Option("id", can.Status("id"))
    },
})

