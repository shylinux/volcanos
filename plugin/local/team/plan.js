Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.ui = can.page.Appends(can, can._target, [
            {view: ["project", "table"], style: {display: can.user.Searchs(can, "project")||"none"}},
            {view: ["content", "table"]},
            {view: ["profile", "table"]},
            {view: ["display", "pre"]},
        ])

        can.onimport[can.Option("scale")](can, msg)
        typeof cb == "function" && cb()

        can.onaction.view({}, can, "view", can.user.Searchs(can, "view")||"text")
        can.page.Select(can, can.ui.content, "div.item.id"+can.user.Searchs(can, "id"), function(item) {
            item.click()
        }), can.page.Modify(can, can._action, {style: {display: "none"}})
    },
    _stat: function(can, msg) {
        var stat = {
            l1: 0, l2: 0, l3: 0, l4: 0, l5: 0,
            prepare: 0, process: 0, cancel: 0, finish: 0,
            s1: 0, s2: 0, s3: 0, s4: 0, s5: 0,
            count: 0,
        }; msg.Table(function(value) {
            stat["l"+(value.level||"3")]++
            stat["s"+(value.score||"3")]++
            stat[value.status]++
            stat.count++
        })
        can.Status("count", stat.process+"/"+stat.count)

        can.page.Append(can, can.ui.project, [ {th: ["key", "value"]} ])
        can.core.List(["1", "2", "3", "4", "5"], function(item) {
            stat["l"+item] > 0 && can.page.Append(can, can.ui.project, [
                {td: ["level-"+item, stat["l"+item]], onclick: function(event) {
                    can.onaction._filter(event, can, "level", "l"+item)
                }}
            ])
        })
        can.core.List(["prepare", "process", "cancel", "finish"], function(item) {
            can.page.Append(can, can.ui.project, [{td: [item, stat[item]], onclick: function(event) {
                can.onaction._filter(event, can, "status", item)
            } }])
        })
        can.core.List(["1", "2", "3", "4", "5"], function(item) {
            stat["s"+item] > 0 && can.page.Append(can, can.ui.project, [
                {td: ["score-"+item, stat["s"+item]], onclick: function(event) {
                    can.onaction._filter(event, can, "score", "s"+item)
                }}
            ])
        })
    },
    _task: function(can, msg, time, list, view) { return {text: ["", "td"],
        ondragover: function(event) { event.preventDefault()
            can.page.Select(can, can.ui.content, "td", function(item) {
                can.page.ClassList.del(can, item, "over")
            }), can.page.ClassList.add(can, event.target, "over")
        },
        ondrop: function(event) { event.preventDefault()
            can.drop(event, event.target, time)
        },
        ondblclick: function(event) {
            can.onaction.insertTask(event, can, can.base.Time(new Date(time)))
        },
        list: can.core.List(list, function(task) { return typeof task == "string"? {view: ["date", "div", task]}:
            {view: [can.onexport.style(can, task), "div", can.onexport[can.Action("view")||view||"name"](can, task)],
                draggable: true, title: can.onexport.title(can, task),
                ondragstart: function(event) { var target = event.target; can.drop = function(event, td, time) { td.append(target)
                    can.onaction.modifyTask(event, can, task, "begin_time", time, task.begin_time)
                } },
                onclick: function(event) {
                    can.onimport._profile(can, msg, task)
                },
                ondblclick: function(event) {
                    can.onaction.pluginTask(event, can, task)
                },
                oncontextmenu: function(event) { var target = event.target
                    can.user.carte(can, can.ondetail, can.ondetail.list, function(event, item) {
                        can.onaction.modifyTask(event, can, task, "status", item)
                    })
                },
                _init: function(target) { can.task || target.click()
                    can._option._task && can._option._task.id == task.id && target.click()
                },
            }
        }),
    } },
    _profile: function(can, msg, task) { can.ui.profile.innerHTML = ""
        can._option._task = can.task = task, can.Status(task)

        can.page.Append(can, can.ui.profile, [{th: ["key", "value"]}])

        task.extra && can.core.Item(can.base.Obj(task.extra), function(key, value) {
            task["extra."+key] = value
        }) && delete(task.extra)

        can.core.Item(task, function(key, value) { can.page.Append(can, can.ui.profile, [{td: [key, value],
            onclick: function(event) {
                if (event.target.type == "button") { var name = event.target.value||event.target.name
                    var cb = can.onaction[name];
                    if (typeof cb == "function") {
                        cb(event, can, name)
                    } else {
                        var msg = can.request(event); can.core.Item(can.task, msg.Option)
                        can.run(event, ["action", name], function(msg) {
                            can.run({})
                        }, true)
                    }
                }
            },
            ondblclick: function(event) {
                can.onmotion.modify(can, event.target, function(ev, value, old) {
                    can.onaction.modifyTask(event, can, task, key, value)
                })
            },
            oncontextmenu: function(event) { var target = event.target
                can.user.carte(can, can.ondetail, ["编辑"].concat(can.ondetail.list), function(event, item, meta) {
                    switch (item) {
                        case "编辑":
                            can.onmotion.modify(can, target, function(ev, value, old) {
                                can.onaction.modifyTask(event, can, task, key, value)
                            })
                            break
                        default:
                            can.onaction.modifyTask(event, can, task, "status", item)
                    }
                })
            },
        }]) })
    },

    day: function(can, msg) { var begin_time = new Date(can.base.Time(can.Option("begin_time")))
        function key(time) { return time.getHours() }
        var hash = {}; msg.Table(function(value) {
            var k = key(new Date(value.begin_time)); hash[k] = (hash[k]||[]).concat([value])
        })

        var head = ["hour", "task"]
        var list = [0]; for (var i = 7; i < 23; i++) { list.push(can.base.Number(i, 2)) }

        function set(hour) { return can.base.Time(can.base.TimeAdd(begin_time, hour/24)) }
        var table = can.page.Append(can, can.ui.content, [{type: "table", list: 
            can.core.List(list, function(hour, row) {
                if (row == 0) { return {type: "tr", list: can.core.List(head, function(head) { return {text: [head, "th"]} })} }
                return {type: "tr", list: [{text: [can.base.Number(hour), "td"]}, can.onimport._task(can, msg, set(hour), hash[hour], "text")]}
            })
        }]).table
    },
    week: function(can, msg) { var begin_time = new Date(can.base.Time(can.Option("begin_time")))
        function key(time) { return time.getDay()+" "+can.base.Number(time.getHours(), 2) }
        var hash = {}; msg.Table(function(value) {
            var k = key(new Date(value.begin_time)); hash[k] = (hash[k]||[]).concat([value])
        })

        var head = ["hour"].concat(["周日", "周一", "周二", "周三", "周四", "周五", "周六"]);
        var list = [0]; for (var i = 7; i < 24; i++) { list.push(can.base.Number(i, 2)) }

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
                    var day = can.base.TimeAdd(last, (row-1)*7+col+1)
                    var list = [day.getDate()+""].concat(hash[key(day)]||[])
                    return can.onimport._task(can, msg, key(day)+can.base.Time(null, " %H:%M:%S"), list)
                })}
            })
        }]).table
    },
    year: function(can, msg) { var begin_time = new Date(can.base.Time(can.Option("begin_time")))
        function key(time) { return can.base.Time(time, "%y-%m ")+time.getDay() }
        var hash = {}; msg.Table(function(value) {
            var k = key(new Date(value.begin_time)); hash[k] = (hash[k]||[]).concat([value])
        })

        var head = ["month"].concat(["周日", "周一", "周二", "周三", "周四", "周五", "周六"]);
        var list = [0]; for (var i = 1; i < 13; i++) { list.push(i) }

        function set(month, weekday) { return begin_time.getFullYear()+"-"+can.base.Number(month, 2)+" "+weekday }
        var table = can.page.Append(can, can.ui.content, [{type: "table", list: 
            can.core.List(list, function(date, row) {
                if (row == 0) { return {type: "tr", list: can.core.List(head, function(head) { return {text: [head, "th"]} })} }
                return {type: "tr", list: can.core.List(head, function(head, col) {
                    if (col == 0) { return {text: [row+"", "td"]} }
                    return can.onimport._task(can, msg, set(row, col-1)+can.base.Time(begin_time, "-%d %H:%M:%S"), hash[set(row, col-1)], "text")
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
}, ["/plugin/local/team/plan.css"])
Volcanos("onaction", {help: "组件交互", list: [
        ["level", "all", "l1", "l2", "l3", "l4", "l5"],
        ["status", "all", "prepare", "process", "cancel", "finish"],
        ["score", "all", "s1", "s2", "s3", "s4", "s5"],
        ["view", "", "name", "text", "level", "score"],
    ],
    insertTask: function(event, can, time) {
        can.user.input(event, can, can.Conf("feature")["添加"], function(event, button, data, list) {
            var args = ["action", "insert"]; can.core.Item(data, function(key, value) {
                if (key == "begin_time") {
                    value = value || time
                }
                if (key == "close_time") {
                    value = value || time
                }
                key && value && args.push(key, value)
            })
            can.run(event, args, function(msg) {
                can.user.toast(can, "添加成功")
                can.run({})
            }, true)
            return true
        })
    },
    modifyTask: function(event, can, task, key, value) {
        var msg = can.request(event); msg.Option(task)
        can.run(event, ["action", "modify", key, value, task[key]], function(msg) {
            task[key] = value, can.onimport._profile(can, can._msg, task)
            can.user.toast(can, "修改成功")
            can.run({})
        }, true)
    },
    pluginTask: function(event, can, task, key) {
        var msg = can.request(event); msg.Option(task)
        can.run(event, ["action", "plugin", task.zone, task.type], function(msg) { can.ui.display.innerHTML = ""
            can.onappend.table(can, can.ui.display, "table", msg)
            can.onappend.board(can, can.ui.display, "board", msg)
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
        can.Action(key, value)
    },
    level: function(event, can, key, value) { can.onaction._filter(event, can, key, value) },
    status: function(event, can, key, value) { can.onaction._filter(event, can, key, value) },
    score: function(event, can, key, value) { can.onaction._filter(event, can, key, value) },
    view: function(event, can, key, value) { can.ui.content.innerHTML = ""
        can.Action(key, value), can.onimport[can.Option("scale")](can, can._msg)
    },

    "统计": function(event, can, key) {
        can.page.Modify(can, can.ui.project, {style: {display: can.ui.project.style.display=="none"? "table": "none"}})
        can.onimport._stat(can, msg)
    },
    "详情": function(event, can, key) {
        can.page.Modify(can, can.ui.profile, {style: {display: can.ui.profile.style.display=="none"? "table": "none"}})
    },
    "启动": function(event, can, key) {
        can.onaction.modifyTask(event, can, can.task, "status", "process", can.task.status)
    },
    "筛选": function(event, can, key) {
        can.page.Modify(can, can._action, {style: {display: can._action.style.display=="none"? "block": "none"}})
    },
    "运行": function(event, can, key) {
        can.onaction.pluginTask(event, can, can.task)
    },
    "插件": function(event, can, key) {
        can.task["extra.cmds"] || can.user.input(event, can, ["extra.cmds", "extra.args"], function(event, button, data, list) {
            var msg = can.request(event)
            can.core.Item(can.task, msg.Option)
            can.run(event, ["action", "modify", "extra.cmds", list[0]], function(msg) {
                var msg = can.request({})
                can.core.Item(can.task, msg.Option)
                can.run(msg._event, ["action", "modify", "extra.args", list[1]], function(msg) {
                    can.run({})
                }, true)
            }, true)
        })
        can.task["extra.cmds"] && can.run(event, ["action", "command", can.task["extra.cmds"]], function(msg) {
            msg.Table(function(item) {
                var feature = can.base.Obj(item.meta)
                feature.width = 400
                feature.height = 400
                var plugin = can.onappend._init(can, {name: item.name, help: item.help, inputs: can.base.Obj(item.list, [ 
                    {type: "text", name: "path", value: "hi.svg"},
                    {type: "button", name: "查看", value: "auto"},
                ]), index: can.task["extra.cmds"], args: can.base.Obj(can.task["extra.args"]), feature: feature}, Volcanos.meta.libs.concat(["/plugin/state.js"]), function(sub) {
                    sub.run = function(event, cmds, cb, silent) {
                        can.run(event, ["action", "command", can.task["extra.cmds"]].concat(cmds), function(msg) {
                            typeof cb == "function" && cb(msg)
                        }, true)
                    }

                    can.page.Modify(can, sub._target, {style: {position: "fixed",
                        left: event.x-(event.x>400? 400: 100),
                        top: event.y-(event.y>400? 400: 0),
                    }})
                    can.Timer(100, function() {
                        can.page.Append(can, sub._option, [{view: "item button", list: [{button: ["关闭", function(event) {
                            can.page.Remove(can, sub._target)
                        }] }] }])
                    })
                }, document.body)
            })
        }, true)
    },
    "开始": function(event, can, key) {
        can.onaction.modifyTask(event, can, can.task, "status", "process", can.task.status)
    },
    "完成": function(event, can, key) {
        can.onaction.modifyTask(event, can, can.task, "status", "finish", can.task.status)
    },
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
    style: function(can, task) {
        return ["item", task.status, "id"+task.id, "l"+(task.level||""), "s"+(task.score||"")].join(" ")
    },

    key: function(can, msg) {
        msg.Option("project", can.ui.project.style.display)
        msg.Option("profile", can.ui.profile.style.display)
        msg.Option("view", can.Action("view"))
        msg.Option("id", can.Status("id"))
    },
})

