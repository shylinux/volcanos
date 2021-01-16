Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        typeof cb == "function" && cb(msg)
        can.msg = msg, can.data = msg.Table()
        can.Action("speed", parseInt(msg.Option("speed")||"100"))
        can.Action("height", parseInt(msg.Option("height")||"400"))

        can.onmotion.clear(can)
        can.onappend.plugins(can, {index: "web.wiki.draw"}, function(sub) {
            sub.run = function(event, cmds, cb, silent) {
                typeof cb == "function" && cb(sub.request())

                can.core.Timer(100, function() { can.sub = sub._outputs[0]
                    can.onaction[can.Action("view")](event, can)
                    can.onlayout.resize(can, "action.resize", function(event) {
                        can.onaction[can.Action("view")](event, can)
                    })
                })
            }
        })
    },
})
Volcanos("onaction", {help: "组件菜单", list: ["编辑", "清空", ["view", "股价图", "趋势图", "数据源"], ["height", "100", "200", "400", "600"], ["speed", "10", "20", "50", "100"]],
    "编辑": function(event, can) {
        can.onmotion.toggle(can, can.sub._action)
        can.onmotion.toggle(can, can.sub._status)
    },
    "清空": function(event, can) {
        can.onmotion.clear(can, can.sub.svg)
    },
    view: function(event, can, cmd, key) {
        can.onaction[key](event, can)
    },
    height: function(event, can, key) {
        can.onaction[can.Action("view")](event, can)
    },

    "股价图": function(event, can) { var sub = can.sub, data = can.data
        if (!can.list) { var begin = "", count = 0, rest = 0, add = 0, del = 0, max = 0
            can.max = 0, can.min = 0, can.list = can.core.List(data, function(value, index) {
                var line = {
                    note: value[can.msg.append[4]],
                    date: value[can.msg.append[0]],
                    add: parseInt(value[can.msg.append[1]]),
                    del: parseInt(value[can.msg.append[2]]),
                }

                line.begin = rest
                line.max = rest + line.add
                line.min = rest - line.del
                line.close = rest + line.add - line.del

                begin = begin || value.date, count++
                rest = line.close, add += line.add, del += line.del
                if (line.max - line.min > max) {
                    max = line.max - line.min
                }
                if (line.max > can.max) { can.max = line.max }
                if (line.min < can.min) { can.min = line.min }
                return line
            })
            can.Status("from", begin)
            can.Status("commit", count)
            can.Status("total", add+del)
            can.Status("max", max)
        }

        var space = 10
        var view = parseInt(can.Action("height"))
        var max = parseInt(can.Conf("width"))-120
        var step = parseInt(max / can.list.length)||2
        can.onmotion.clear(can, sub.svg)

        var width = can.list.length * step + space * 2
        var height  = view + space * 2
        sub.svg.Val("height", height)
        sub.svg.Val("width", width)

        function compute(y) { return (y - can.min)/(can.max - can.min)*view }
        can.core.Next(can.list, function(line, next, index) {
            sub.onimport.draw({}, sub, {
                shape: "line", point: [
                    {x: space/2+step*index+step/4, y: space/2+view-compute(line.min)},
                    {x: space/2+step*index+step/4, y: space/2+view-compute(line.max)},
                ], style: {
                    "stroke-width": 1, "stroke": line.begin < line.close? "white": "black",
                },
            })

            var one = sub.onimport.draw({}, sub, line.begin < line.close? {
                shape: "rect", point: [
                    {x: space/2+step*index, y: space/2+view-compute(line.begin)},
                    {x: space/2+step*index+step/2, y: space/2+view-compute(line.close)},
                ], style: {
                    "stroke-width": 1, "stroke": "white", "fill": "white", "rx": 0, "ry": 0,
                },
            }: {
                shape: "rect", point: [
                    {x: space/2+step*index, y: space/2+view-compute(line.close)},
                    {x: space/2+step*index+step/2, y: space/2+view-compute(line.begin)},
                ], style: {
                    "rx": 0, "ry": 0, "stroke-width": 1, "stroke": "black", "fill": "black",
                },
            }); one.onmouseover = function(event) { can.Status(line) }

            can.core.Timer(parseInt(can.Action("speed")), next)
        })
    },
    "趋势图": function(event, can, value, cmd, target) { var sub = can.sub, data = can.data
        var space = 10
        var view = parseInt(can.Action("height"))
        var max = parseInt(can.Conf("width"))-120
        var step = parseInt(max / can.list.length)||2
        can.onmotion.clear(can, sub.svg)

        var max = {}
        var height = 0
        can.core.List(can.msg.append, function(key, which) {
            height += view + space * 2

            max[key] = 0, can.core.List(data, function(value, index) {
                if ((parseInt(value[key])||0) > max[key]) {
                    max[key] = parseInt(value[key])||0
                }
            })
        })

        var width = can.list.length * step + space * 2
        sub.svg.Val("height", height+space*2)
        sub.svg.Val("width", width)

        can.core.List(can.msg.append, function(key, which) { var y = (space*2+view)*(which+1)
            sub.onimport.draw({}, sub, {
                shape: "text", point: [
                    {x: width/2, y: y+space},
                ], style: {
                    "font-size": 20, "stroke-width": 0, "fill": "red", inner: key, 
                },
            })

            can.core.List(data, function(line, index) {
                var one = sub.onimport.draw({}, sub, {
                    shape: "rect", point: [
                        {x: space+step*index, y: y},
                        {x: space+step*index+step/4, y: y-parseInt(line[key])/(max[key]||1)*view}
                    ], style: {
                        "stroke-width": 1, "stroke": "white", "fill": "white", "rx": 0, "ry": 0,
                    },
                }); one.onmouseover = function(event) { can.Status(line) }
            })
        })
    },
    "数据源": function(event, can) {
        can.onmotion.clear(can, can.sub.ui.display)
        can.onappend.table(can, can.msg, null, can.sub.ui.display)
    },
})
Volcanos("onexport", {help: "导出数据", list: ["from", "commit", "total", "date", "begin", "add", "del", "close", "note"]})

