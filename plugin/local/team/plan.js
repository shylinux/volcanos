Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.ui = can.page.Appends(can, can._target, [
            {view: ["project", "table"]},
            {view: ["content", "table"]},
            {view: ["profile", "table"]},
            {view: ["display", "pre"]},
        ])

        typeof cb == "function" && cb(msg)
        can.onimport[can.Option("scale")](can, msg)
        can.page.Modify(can, can._action, {style: {display: "none"}})

        var begin = can.onimport.date("2020-10-10 10:10:10")
    },
    date: function(t) { var now = new Date()
        if (t && typeof t == "string") { var ls = t.split(" ")
            var vs = ls[0].split("-")
            now.setFullYear(parseInt(vs[0]))
            now.setMonth(parseInt(vs[1])-1)
            now.setDate(parseInt(vs[2]))

            var vs = ls[1].split(":")
            now.setHours(parseInt(vs[0]))
            now.setMinutes(parseInt(vs[1]))
            now.setSeconds(parseInt(vs[2]))
        } else if (t) {
            now = t
        }
        return now
    },
    _show: function(can, msg, head, list, key, set, get) {
        var begin_time = can.onimport.date(can.base.Time(can.Option("begin_time")))
        var hash = {}; msg.Table(function(value, index) {
            var k = key(can.onimport.date(value.begin_time)); hash[k] = (hash[k]||[]).concat([value])
            can.Status("count", index+1)
        })

        var table = can.page.Append(can, can.ui.content, [{type: "table", list: 
            can.core.List(list, function(hour, row) {
                if (row == 0) { return {type: "tr", list: can.core.List(head, function(week) { return {text: [week, "th"]} })} }
                return {type: "tr", list: can.core.List(head, function(week, col) {
                    if (col == 0) { return {text: [hour, "td"]} }
                    return can.onimport._task(can, msg, set(begin_time, col, row), get(begin_time, col, row, hash))
                })}
            })
        }]).table
    },
    _task: function(can, msg, time, list, view) { return {text: ["", "td"],
        ondrop: function(event) {
            can.drop(event, event.target, time)
            event.preventDefault()
        },
        ondragover: function(event) {
            can.page.Select(can, can.ui.content, "td", function(item) { can.page.ClassList.del(can, item, "over") })
            can.page.ClassList.add(can, event.target, "over")
            event.preventDefault()
        },
        ondblclick: function(event) { var now = can.base.Time()
            can.onaction.insertTask(event, can, can.base.Time(can.onimport.date(time+now.slice(time.length))))
        },
        list: can.core.List(list, function(task) { return typeof task == "string"? {view: ["date", "div", task]}:
            {view: [can.onexport.style(can, task), "div", can.onexport[view||can.Action("view")||"text"](can, task)],
                draggable: time != undefined, ondragstart: function(event) { var target = event.target; can.drop = function(event, td, time) {
                    can.onaction.modifyTask(event, can, task, "begin_time", time+task.begin_time.slice(time.length), task.begin_time)
                    can.run()
                } },
                onclick: function(event) { can.onimport._profile(can, msg, task) },
                _init: function(target) { can.task || target.click() },
                title: can.onexport.title(can, task),
            }
        }),
    } },
    _profile: function(can, msg, task) {
        task.extra && can.core.Item(can.base.Obj(task.extra), function(key, value) { task["extra."+key] = value }), delete(task.extra)

        can.task && can.page.Cache(can.task.id, can.ui.display, can.task.id)
        can.Status(can.task = task); can.page.Cache(task.id, can.ui.display) || task["extra.cmd"] && can.onappend.plugin(can, {
            height: can.Conf("height"), width: can.Conf("width"), index: task["extra.ctx"]+"."+task["extra.cmd"], args: task["extra.arg"],
        }, function(sub) {
            sub.run = function(event, cmds, cb, silent) {
                var msg = can.request(event); can.core.Item(can.task, function(key, value) {
                    msg.Option("task."+key, value)
                })
                can.run(event, ["action", "command", "run", task["extra.ctx"]+"."+task["extra.cmd"]].concat(cmds), function(msg) {
                    typeof cb == "function" && cb(msg)
                }, true)
            }
        }, can.ui.display)

        can.page.Appends(can, can.ui.profile, [{th: ["key", "value"]}])
        can.core.Item(task, function(key, value) { can.page.Append(can, can.ui.profile, [{td: [key, value],
            onclick: function(event) { if (event.target.type == "button") { var name = event.target.name
                var cb = can.onaction[name]; if (typeof cb == "function") { return cb(event, can, name) }

                var msg = can.request(event); can.core.Item(can.task, msg.Option)
                can.sup.onaction.input(event, can.sup, name, function(msg) { can.run({}) })
            } },
            ondblclick: function(event) {
                can.onmotion.modify(can, event.target, function(ev, value, old) {
                    can.onaction.modifyTask(event, can, task, key, value)
                })
            },
        }]) })
    },

    day: function(can, msg) {
        var head = ["hour", "task"]
        var list = [0]; for (var i = 7; i < 24; i++) { list.push(can.base.Number(i, 2)) }
        function key(time) { return can.base.Number(time.getHours(), 2) }

        function set(begin_time, col, row) { return can.base.Time(begin_time, "%y-%m-%d ")+list[row] }
        function get(begin_time, col, row, hash) { return hash[list[row]] }
        can.onimport._show(can, msg, head, list, key, set, get)
    },
    week: function(can, msg) {
        var head = ["hour"].concat(["周日", "周一", "周二", "周三", "周四", "周五", "周六"])
        var list = [0]; for (var i = 7; i < 24; i++) { list.push(can.base.Number(i, 2)) }
        function key(time) { return time.getDay()+" "+can.base.Number(time.getHours(), 2) }

        function set(begin_time, col, row) { return can.base.Time(can.base.TimeAdd(begin_time, -begin_time.getDay()+col-1), "%y-%m-%d ")+list[row] }
        function get(begin_time, col, row, hash) { return hash[col-1+" "+list[row]] }
        can.onimport._show(can, msg, head, list, key, set, get)
    },
    month: function(can, msg) {
        var head = ["order"].concat(["周日", "周一", "周二", "周三", "周四", "周五", "周六"])
        var list = [0]; for (var i = 1; i < 6; i++) { list.push(i) }
        function key(time) { return can.base.Time(time, "%y-%m-%d") }

        function set(begin_time, col, row) {
            var begin = can.base.TimeAdd(begin_time, -(begin_time.getDate()-1))
            var last = can.base.TimeAdd(begin_time, -(begin_time.getDate()-1)-begin.getDay())
            var day = can.base.TimeAdd(last, (row-1)*7+col)
            return key(day)
        }
        function get(begin_time, col, row, hash) {
            var begin = can.base.TimeAdd(begin_time, -(begin_time.getDate()-1))
            var last = can.base.TimeAdd(begin_time, -(begin_time.getDate()-1)-begin.getDay())
            var day = can.base.TimeAdd(last, (row-1)*7+col)
            return [day.getDate()+""].concat(hash[key(day)]||[])
        }
        can.onimport._show(can, msg, head, list, key, set, get)
    },
    year: function(can, msg) {
        var head = ["month"].concat(["周日", "周一", "周二", "周三", "周四", "周五", "周六"]);
        var list = [0]; for (var i = 1; i < 13; i++) { list.push(i) }
        function key(time) { return can.base.Time(time, "%y-%m ")+time.getDay() }

        function set(begin_time, col, row) {
            return begin_time.getFullYear()+"-"+can.base.Number(list[row], 2)
        }
        function get(begin_time, col, row, hash) {
            return hash[begin_time.getFullYear()+"-"+can.base.Number(row, 2)+" "+(col-1)]
        }
        can.onimport._show(can, msg, head, list, key, set, get)
    },
    long: function(can, msg) {
        var begin_time = can.onimport.date(can.base.Time(can.Option("begin_time")))
        var begin = begin_time.getFullYear() - 5

        var head = ["month"]; for (var i = 0; i < 10; i++) { head.push(begin+i) }
        var list = [0]; for (var i = 1; i < 13; i++) { list.push(i) }
        function key(time) { return can.base.Time(time, "%y-%m") }

        function set(begin_time, col, row) {
            return begin+col-1+"-"+can.base.Number(row, 2)
        }
        function get(begin_time, col, row, hash) {
            return hash[begin+col-1+"-"+can.base.Number(row, 2)]
        }
        can.onimport._show(can, msg, head, list, key, set, get)
    },
}, ["/plugin/local/team/plan.css"])
Volcanos("onaction", {help: "组件交互", list: [
        ["level", "all", "l1", "l2", "l3", "l4", "l5"],
        ["status", "all", "prepare", "process", "cancel", "finish"],
        ["score", "all", "s1", "s2", "s3", "s4", "s5"],
        ["view", "", "name", "text", "level", "score"],
    ],
    insertTask: function(event, can, time) {
        can.user.input(event, can, can.Conf("feature")["insert"], function(event, button, data, list) {
            var args = ["action", "insert"]; can.core.Item(data, function(key, value) {
                if (key == "begin_time") { value = value || time }
                if (key == "close_time") { value = value || time }
                key && value && args.push(key, value)
            })
            can.run(event, args, function(msg) { })
            return true
        })
    },
    modifyTask: function(event, can, task, key, value) {
        var msg = can.request(event); msg.Option(task)
        can.run(event, ["action", "modify", key, value, task[key]], function(msg) {
            task[key] = value, can.onimport._profile(can, can._msg, task)
            can.user.toast(can, "修改成功")
        }, true)
    },

    _filter: function(event, can, key, value) { var count = 0
        if (value == "all") {
            can.page.Select(can, can.ui.content, "div.item", function(item) {
                can.page.ClassList.del(can, item, "hidden")
                count++
            })
        } else {
            can.page.Select(can, can.ui.content, "div.item", function(item) {
                can.page.ClassList.add(can, item, "hidden")
            })
            can.page.Select(can, can.ui.content, "div."+value, function(item) {
                can.page.ClassList.del(can, item, "hidden")
                count++
            })
        }
        can.Status("count", count)
        can.Action(key, value)
    },
    level: function(event, can, key, value) { can.onaction._filter(event, can, key, value) },
    status: function(event, can, key, value) { can.onaction._filter(event, can, key, value) },
    score: function(event, can, key, value) { can.onaction._filter(event, can, key, value) },
    view: function(event, can, key, value) { can.Action(key, value), can.onimport[can.Option("scale")](can, can._msg) },
})
Volcanos("onexport", {help: "导出数据", list: ["count", "begin_time", "zone", "id", "type", "name"],
    name: function(can, task) { return task.name },
    text: function(can, task) { return task.name+": "+(task.text||"") },
    level: function(can, task) { return "l-"+(task.level||3)+": "+(task.name||"") },
    score: function(can, task) { return "s-"+(task.level||3)+": "+(task.name||"") },
    title: function(can, task) { return task.zone+": "+(task.type||"") },
    style: function(can, task) { return ["item", task.status, "id"+task.id, "l"+(task.level||""), "s"+(task.score||"")].join(" ") },
})

