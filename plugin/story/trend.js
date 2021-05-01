Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can)
        can.base.isFunc(cb) && cb(msg)
        if (msg.Option("branch")) { return can.onappend.table(can, msg) }

        can.msg = msg, can.data = msg.Table(), can.onimport._sum(can)
        can.Action("height", parseInt(msg.Option("height")||"400"))
        can.Action("speed", parseInt(msg.Option("speed")||"100"))

        can.onappend.plugins(can, {index: "web.wiki.draw"}, function(sub) {
            sub.run = function(event, cmds, cb) { sub.Action("go", "run")
                can.base.isFunc(cb) && cb(sub.request())

                can.core.Timer(100, function() { can.draw = sub._outputs[0]
                    can.draw.onmotion.hidden(can.draw, can.draw.ui.project)
                    can.onaction[can.Action("view")](event, can)
                })
            }
        })
    },
    _sum: function(can, ) {
        var begin = "", count = 0, rest = 0, add = 0, del = 0, max = 0
        can.max = 0, can.min = 0, can.list = can.core.List(can.data, function(value, index) {
            var line = {
                date: value[can.msg.append[0]],
                text: value[can.msg.append[4]],
                add: parseInt(value[can.msg.append[1]]),
                del: parseInt(value[can.msg.append[2]]),
            }

            line.begin = rest
            line.max = rest + line.add
            line.min = rest - line.del
            line.close = rest + line.add - line.del

            begin = begin || value.date, count++
            rest = line.close, add += line.add, del += line.del

            if (line.max - line.min > max) { max = line.max - line.min }
            if (line.max > can.max) { can.max = line.max }
            if (line.min < can.min) { can.min = line.min }
            return line
        })
        can.Status({"from": begin, "commit": count, "total": add+del, "max": max})
    },
})
Volcanos("onaction", {help: "组件菜单", list: ["编辑", ["view", "趋势图", "柱状图", "数据源"], ["height", "100", "200", "400", "600"], ["speed", "10", "20", "50", "100"]],
    "编辑": function(event, can) {
        can.onmotion.toggle(can, can.draw._action)
        can.onmotion.toggle(can, can.draw._status)
    },
    "趋势图": function(event, can) {
        var space = 10
        var view = parseInt(can.Action("height"))
        var max = parseInt(can.Conf("width"))-2*space
        var step = parseInt(max / (can.list.length+1))||2

        var height  = view + space * 2
        var width = can.list.length * step + space * 2
        can.draw.svg.Val("width", width-space*2+5)
        can.draw.svg.Val("height", height)

        function scale(y) { return (y - can.min)/(can.max - can.min)*view }

        can.onmotion.clear(can, can.draw.svg)
        can.core.Next(can.list, function(line, next, index) { can.Status(line, ["date", "text", "add", "del"])
            can.draw.onimport.draw({}, can.draw, {
                shape: "line", point: [
                    {x: space/2+step*index+step/4, y: space/2+view-scale(line.min)},
                    {x: space/2+step*index+step/4, y: space/2+view-scale(line.max)},
                ], style: {
                    "stroke-width": 1, "stroke": line.begin < line.close? "white": "black",
                },
            })

            line.view = can.draw.onimport.draw({}, can.draw, line.begin < line.close? {
                shape: "rect", point: [
                    {x: space/2+step*index, y: space/2+view-scale(line.begin)},
                    {x: space/2+step*index+step/2, y: space/2+view-scale(line.close)},
                ], style: {
                    "stroke-width": 1, "stroke": "white", "fill": "white", "rx": 0, "ry": 0,
                },
            }: {
                shape: "rect", point: [
                    {x: space/2+step*index, y: space/2+view-scale(line.close)},
                    {x: space/2+step*index+step/2, y: space/2+view-scale(line.begin)},
                ], style: {
                    "stroke-width": 1, "stroke": "black", "fill": "black", "rx": 0, "ry": 0, 
                },
            })

            can.core.Item(can.ondetail, function(key, value) {
                if (key.indexOf("on") == 0 && can.base.isFunc(value)) {
                    line.view[key] = function(event) { value(event, can, line) }
                }
            })
            can.core.Timer(parseInt(can.Action("speed")), next)
        })
    },
    "柱状图": function(event, can) {
        var space = 10
        var view = parseInt(can.Action("height"))
        var max = parseInt(can.Conf("width"))-2*space
        var step = parseInt(max / can.list.length)||2

        var max = {}
        var height = 0; can.core.List(can.msg.append, function(key, which) {
            height += view + 2*space

            max[key] = 0, can.core.List(can.data, function(value, index) {
                if ((parseInt(value[key])||0) > max[key]) {
                    max[key] = parseInt(value[key])||0
                }
            })
        })

        var width = can.list.length*step + 2*space
        can.draw.svg.Val("height", height+2*space)
        can.draw.svg.Val("width", width)

        can.onmotion.clear(can, can.draw.svg)
        can.core.List(can.msg.append, function(key, which) { var y = (space*2+view)*(which+1)
            can.draw.onimport.draw({}, can.draw, {
                shape: "text", point: [
                    {x: width/2, y: y+space},
                ], style: {
                    "font-size": 20, 
                    "stroke-width": 0, "stroke": "red", "fill": "red", inner: key, 
                },
            })

            can.core.Next(can.data, function(line, next, index) {
                line.view = can.draw.onimport.draw({}, can.draw, {
                    shape: "rect", point: [
                        {x: space+step*index, y: y},
                        {x: space+step*index+step/4, y: y-parseInt(line[key])/(max[key]||1)*view}
                    ], style: {
                        "stroke-width": 1, "stroke": "white", "fill": "white", "rx": 0, "ry": 0,
                    },
                })

                can.core.Item(can.ondetail, function(key, value) {
                    if (key.indexOf("on") == 0 && can.base.isFunc(value)) {
                        line.view[key] = function(event) { value(event, can, line) }
                    }
                })
                can.core.Timer(parseInt(can.Action("speed")), next)
            })
        })
    },
    "数据源": function(event, can) {
        can.onmotion.clear(can, can.draw.ui.display)
        can.onappend.table(can, can.msg, null, can.draw.ui.display)
        can.onmotion.show(can, can.draw.ui.display)
    },

    height: function(event, can) {
        can.onaction[can.Action("view")](event, can)
    },
    speed: function(event, can) {
        can.onaction[can.Action("view")](event, can)
    },
})
Volcanos("ondetail", {help: "用户交互", list: [],
    onmouseenter: function(event, can, line) {
        can.Status(line, ["date", "text", "add", "del"])
    },
})
Volcanos("onexport", {help: "导出数据", list: []})

