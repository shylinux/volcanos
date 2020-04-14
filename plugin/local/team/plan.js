Volcanos("onimport", {help: "导入数据", list: [],
    init: function(can, msg, cb, output, action, option) {output.innerHTML = "";
        var table = can.page.AppendTable(can, output, msg, msg.append);
        table.onclick = function(event) {switch (event.target.tagName) {
            case "SPAN":
            case "TD":
                var input = can.user.input(event, can, ["zone", "type", "name", "text"], function(event, value, data) {
                    switch (value) {
                        case "提交":
                            // 创建任务
                            can.run(event, ["action", "insert", data.zone, data.type, data.name, data.text, "begin_time", can.base.Time()], function(msg) {
                                can.page.Remove(can, input.first)
                                can.user.toast("添加成功")
                                can.Runs(event)
                                return true
                            }, true)
                            break
                        case "关闭": return true;
                    }
                })
                break
            case "TH":
                break
            case "TR":
            case "TABLE":
        }}

        table.oncontextmenu = function(event) {var target = event.target;
            switch (event.target.tagName) {
                case "DIV":
                    // 任务操作
                    var data = target.dataset;
                    can.user.carte(event, shy("", can.ondetail, can.feature.detail || can.ondetail.list, function(event, cmd, meta) {var cb = meta[cmd];
                        typeof cb == "function"? cb(event, can, msg, data.id, data.zone, cmd, target):
                            can.run(event, ["action", typeof cb == "string"? cb: cmd, data.id, data.zone], function(msg) {
                                can.user.toast("修改成功")
                            }, true)
                    }))
                    event.stopPropagation()
                    event.preventDefault()
                    break
                case "TD":
                    break
                case "TH":
                case "TR":
                case "TABLE":
            }
        }

        can.page.Select(can, table, "div.task", function(item) {
            // 拖动排期
            item.setAttribute("draggable", true)
            item.ondragstart = function(event) {can.drag = event.target}
            item.ondragover = function(event) {event.preventDefault()}
            item.ondrop = function(event) {event.preventDefault()
                can.preview.insertBefore(can.drag, item)
            }
        })

        can.page.Select(can, table, "tr", function(tr) {tr.list = [];
            can.page.Select(can, tr, "td", function(item, index) {tr.list.push(item);
                item.ondragover = function(event) {event.preventDefault(), can.page.Select(can, table, "td.over", function(item) {
                    can.page.ClassList.del(can, item, "over")
                }), can.page.ClassList.add(can, item, "over")}

                item.ondrop = function(event) {event.preventDefault()
                    item.append(can.drag)

                    // 任务排期
                    var data = can.drag.dataset;
                    var begin_time = new Date(data.begin_time);

                    switch (can.Option("scale")) {
                        case "long":
                            begin_time.setYear(parseInt(tr.list[0].innerText));
                            break
                        case "year":
                            begin_time.setMonth(parseInt(tr.list[0].innerText)-1);
                            break
                        case "month":
                            can.page.Select(can, item, "span", function(item) {var data = item.dataset
                                begin_time.setYear(parseInt(data.year))
                                begin_time.setMonth(parseInt(data.month)-1)
                                begin_time.setDate(parseInt(data.day))
                            })
                            break
                        case "week":
                            begin_time.setDate(begin_time.getDate() - (begin_time.getDay() - index + 1))
                        case "day":
                            begin_time.setHours(parseInt(tr.list[0].innerText));
                            begin_time.setMinutes(0);
                            begin_time.setSeconds(0);
                    }

                    can.run(event, ["action", "modify", "begin_time", can.base.Time(begin_time), data.begin_time, data.id, data.zone], function(msg) {
                        can.user.toast("修改成功")
                    }, true);
                }
            })
        })

        return typeof cb == "function" && cb(msg), table;
    },
    which: function(event, table, list, cb) {if (event.target == table) {return cb(-1, "")}
        can.page.Select(can, table, "tr", function(tr, index) {if (event.target == tr) {return cb(index-1, "")}
            can.page.Select(can, tr, "th,td", function(td, order) {
                if (event.target == td) {return cb(index-1, list[order])}
            })
        })
    },
}, ["plugin/team/plan.css"])
Volcanos("onaction", {help: "组件交互", list: []})
Volcanos("onchoice", {help: "组件菜单", list: ["返回", "清空"],
    "返回": function(event, can, msg, cmd, target) {
        can.run(event, ["", "Last"])
    },
    "清空": function(event, can, msg, cmd, target) {
        can.target.innerHTML = "";
    },
})
Volcanos("ondetail", {help: "组件详情", list: ["开始", "完成", "取消"],
    "开始": "process",
    "完成": "finish",
    "取消": "cancel",
})
Volcanos("onexport", {help: "导出数据", list: []})



