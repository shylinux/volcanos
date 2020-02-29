Volcanos("onimport", {help: "导入数据", list: [],
    init: function(can, meta, cb, target, action, option) {target.innerHTML = ""
        if (can.msg.Option("_display") == "table") {
            // 文件目录
            can.page.AppendTable(can, target, can.msg, can.msg.append, function(event, value, key, index, tr, td) {
                can.Export(event, value, key)
            })
            return
        }

        can.ui = can.page.Append(can, target, [{view: "action"}, {view: "output"}, {view: "status"}, {view: "total"}, {
            view: "display", style: {position: "absolute", "white-space": "pre", color: "yellow"}, onclick: function(event) {
                can.page.ClassList.add(can, can.ui.display, "hidden")
            },
        }])
        can.data = can.msg.Table()
        can.page.ClassList.add(can, can.ui.total, "status")

        can.sub = can.Output(can, {}, "/plugin/wiki/draw", can.Event({}), function() {
            can.Action("width", 600)
            can.onaction["编辑"]({}, can)
            can.onaction["股价图"]({}, can)
        }, can.ui.output, can.ui.action, option, can.ui.status)
    },
})
Volcanos("onaction", {help: "组件菜单", list: ["编辑", "清空", "股价图", "趋势", "比例", ["width", "200", "400", "600", "800", "1000"], ["height", "200", "400", "600"], "表格"],
    "编辑": function(event, can, value, cmd, target) {
        can.page.ClassList.neg(can, can.ui.action, "hidden")
        can.page.ClassList.neg(can, can.ui.status, "hidden")
    },
    "清空": function(event, can, value, cmd, target) {
        can.sub.svg.innerHTML = ""
    },
    "股价图": function(event, can, value, cmd, target) {var sub = can.sub, data = can.data;
        if (!can.list) {
            var count = 0, add = 0, del = 0, max = 0
            can.max = 0, can.rest = 0, can.list = can.core.List(data, function(value, index) {
                var line = {};
                line.note = value[can.msg.append[4]]
                line.date = value[can.msg.append[0]]
                line.add = parseInt(value[can.msg.append[1]])
                line.del = parseInt(value[can.msg.append[2]])

                line.begin = can.rest
                line.max = can.rest + line.add
                line.min = can.rest - line.del
                line.close = can.rest = can.rest + line.add - line.del

                count++
                add += line.add
                del += line.del
                if (line.max - line.min > max) {
                    max = line.max - line.min
                }
                if (line.max > can.max) {
                    can.max = line.max
                }
                return line
            })

            var begin = new Date(data[0].date)
            var end = new Date(data[data.length-1].date)
            var avg = parseInt((add + del) / (end - begin) * 1000 * 3600 * 24)
            can.page.AppendStatus(can, can.ui.total, ["from", "days", "count", "avg", "max", "add", "del", "rest"], {
                from: can.base.Time(begin).split(" ")[0], days: can.base.Duration(end-begin),
                count: count, avg: avg, max: max, add: add, del: del, rest: can.rest,
            })
        }

        var space = 10
        var view = parseInt(can.Action("height"))
        var max = parseInt(can.Action("width"))
        var step = parseInt(max / can.list.length)||2

        var width = can.list.length * step + space * 2
        sub.svg.Val("width", width)

        var height  = view + space * 2
        sub.svg.Val("height", height)

        can.core.List(can.list, function(line, index) {
            sub.onimport.draw({}, sub, {
                shape: "line", point: [
                    {x: space/2+step*index+step/4, y: space/2+view-line.min/can.max*view},
                    {x: space/2+step*index+step/4, y: space/2+view-line.max/can.max*view},
                ], style: line.begin < line.close? {
                    "stroke-width": 1, "stroke": "white",
                }: {
                    "stroke-width": 1, "stroke": "black",
                },
            })

            var one = line.begin < line.close? sub.onimport.draw({}, sub, {
                shape: "rect", point: [
                    {x: space/2+step*index, y: space/2+view-line.begin/can.max*view},
                    {x: space/2+step*index+step/2, y: space/2+view-line.close/can.max*view},
                ], style: {
                    "rx": 0, "ry": 0,
                    "stroke-width": 1, "stroke": "white", "fill": "white",
                },
            }): sub.onimport.draw({}, sub, {
                shape: "rect", point: [
                    {x: space/2+step*index, y: space/2+view-line.close/can.max*view},
                    {x: space/2+step*index+step/2, y: space/2+view-line.begin/can.max*view},
                ], style: {
                    "rx": 0, "ry": 0,
                    "stroke-width": 1, "stroke": "black", "fill": "black",
                },
            })

            one.onmouseover = function(event) {
                can.page.ClassList.del(can, can.ui.display, "hidden")
                can.ui.display.style.left = event.clientX+space/2+"px"
                can.ui.display.style.top = event.clientY+space/2+"px"

                var msg = can.Event(event);
                msg.Push(line, ["date", "note", "begin", "add", "del", "close"], "detail")
                can.ui.display.innerHTML = ""
                can.page.AppendTable(can, can.ui.display, msg, msg.append)
            }
        })
    },
    "趋势": function(event, can, value, cmd, target) {var sub = can.sub, data = can.data;
        var space = 10
        var view = parseInt(can.Action("height"))
        var max = parseInt(can.Action("width"))
        var step = parseInt(max / can.list.length)||2

        var width = can.list.length * step + space * 2
        sub.svg.Val("width", width)

        var height = 0
        var max = {};
        can.core.List(can.msg.append, function(key, which) {
            height += view + space * 2
            max[key] = 0;
            can.core.List(data, function(value, index) {
                if ((parseInt(value[key])||0) > max[key]) {
                    max[key] = parseInt(value[key])||0
                }
            })
        })

        sub.svg.Val("height", height+space*2)

        can.core.List(can.msg.append, function(key, which) {
            var y = (space*2+view)*(which+1)
            sub.onimport.draw({}, sub, {
                shape: "text", point: [
                    {x: width/2, y: y+space},
                ],
                style: {
                    "font-size": 20,
                    "stroke-width": 0,
                    "fill": "red",
                    inner: key, 
                },
            })

            can.core.List(data, function(value, index) {
                var one = sub.onimport.draw({}, sub, {
                    shape: "rect",
                    point: [
                        {x: space+step*index, y: y},
                        {x: space+step*index+step/4, y: y-parseInt(value[key])/(max[key]||1)*view}
                    ],
                    style: {
                        "rx": 0, "ry": 0,
                        "stroke-width": 1, "stroke": "white", "fill": "white",
                    },
                })

                one.onmouseover = function(event) {
                    can.page.ClassList.del(can, can.ui.display, "hidden")
                    can.ui.display.style.left = event.clientX+space/2+"px"
                    can.ui.display.style.top = event.clientY+space/2+"px"

                    var msg = can.Event(event);
                    msg.Push(value, can.core.Item(value, function(key) {
                        return msg[key] = [], key
                    }), "detail")
                    can.ui.display.innerHTML = ""
                    can.page.AppendTable(can, can.ui.display, msg, msg.append)
                }
            })
        })
    },
    "表格": function(event, can, value, cmd, target) {var sub = can.sub, data = can.data;
        if (!can.ui.table) {
            can.ui.table = can.page.AppendTable(can, can.target, can.msg, can.msg.append)
            can.ui.table.style.clear = "both"
            return
        }
        can.page.ClassList.neg(can, can.ui.table, "hidden")
    },
})
Volcanos("onchoice", {help: "组件交互", list: []})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})
