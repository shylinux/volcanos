Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can), can.base.isFunc(cb) && cb(msg)
        if (msg.Option("branch")) { return can.onappend.table(can, msg) }
        can.onappend._status(can, ["from", "commit", "total", "max", "date", "text", "add", "del"])

        can.msg = msg, can.data = msg.Table(), can.onimport._sum(can)
        can.Action(html.HEIGHT, msg.Option(html.HEIGHT)||can.user.mod.isCmd? "max": can.user.isMobile&&can.user.isLandscape()? "200": "400")
        can.Action("speed", parseInt(msg.Option("speed")||"100"))

        can.require(["/plugin/local/wiki/draw.js", "/plugin/local/wiki/draw/path.js"], function() {
            can.page.ClassList.add(can, can._fields, "draw")
            can.onimport._show(can, msg), can.onmotion.hidden(can, can.ui.project)
            can.onaction[can.Action("view")](event, can)
        })
    },
    _sum: function(can) {
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
}, [""])
Volcanos("onaction", {help: "组件菜单", list: ["编辑", ["view", "趋势图", "柱状图", "数据源"], ["height", "100", "200", "400", "600", "800", "max"], ["speed", "10", "20", "50", "100"]],
    "编辑": function(event, can) {
        can.onmotion.toggle(can, can._action)
        can.onmotion.toggle(can, can._status)
    },
    "趋势图": function(event, can) { var height = can.Action(html.HEIGHT)
        if (height == "max") { height = can.Conf(html.HEIGHT) - chat.CMD_MARGIN }
        height = parseInt(height)

        var space = 10, width = parseInt(can.Conf(html.WIDTH))
        var step = parseInt((width-2*space) / can.list.length)

        can.onmotion.clear(can, can.svg)
        can.svg.Val(html.HEIGHT, height)
        can.svg.Val(html.WIDTH, width)

        function scale(y) { return (y - can.min)/(can.max - can.min)*(height-2*space) }
        function order(index, x, y) { return {x: space+step*index+x, y: height-space-scale(y)} }

        can.core.Next(can.list, function(line, next, index) { can.Status(line, ["date", "text", "add", "del"])
            can.onimport.draw({}, can, {
                shape: "line", point: [
                    order(index, step/2, line.min), order(index, step/2, line.max),
                ], style: {
                    "stroke-width": 1, "stroke": line.begin < line.close? chat.WHITE: chat.BLACK,
                },
            })

            can.onimport.draw({}, can, {
                shape: "rect", point: [
                    order(index, step/4, line.close), order(index, step/4*3, line.begin),
                ], style: can.base.Copy({"stroke-width": 1, "rx": 0, "ry": 0}, line.begin < line.close? {
                    "stroke": chat.WHITE, "fill": chat.WHITE,
                }: {
                    "stroke": chat.BLACK, "fill": chat.BLACK,
                }),
                _init: function(view) {
                    can.core.ItemCB(can.ondetail, function(key, cb) {
                        view[key] = function(event) { cb(event, can, line) }
                    })
                },
            })

            can.core.Timer(parseInt(can.Action("speed")), next)
        })
    },
    "柱状图": function(event, can) {
        var max = {}, min = {}
        can.core.List(can.msg.append, function(key, which) {
            can.core.List(can.data, function(value, index) {
                var v = parseInt(value[key])||0; if (index == 0) {
                    max[key] = v, min[key] = v
                    return
                }
                if (v > max[key]) { max[key] = v }
                if (v < min[key]) { min[key] = v }
            })
        })

        var height = parseInt(can.Action(html.HEIGHT))
        var space = 10, width = parseInt(can.Conf(html.WIDTH))
        var step = parseInt((width-2*space) / can.list.length)

        can.onmotion.clear(can, can.svg)
        can.svg.Val(html.HEIGHT, height)
        can.svg.Val(html.WIDTH, width)

        function scale(key, y) { return (y - min[key])/(max[key] - min[key])*(height-2*space) }
        function order(index, key, x, y) { return {x: space+step*index+x, y: space+scale(key, y)} }

        var width = (step-4)/can.msg.append.length
        can.core.List(can.msg.append, function(key, which) {
            max[key] != min[key] && can.core.Next(can.data, function(line, next, index) {
                var y = scale(key, parseFloat(line[key]))
                y && can.onimport.draw({}, can, {
                    shape: "rect", point: [
                        order(index, key, width*which+2, 0), order(index, key, width*which+2+width, y),
                    ], style: {
                        "stroke-width": 1, "stroke": chat.WHITE, "fill": chat.WHITE, "rx": 0, "ry": 0,
                    },
                    _init: function(view) {
                        can.core.ItemCB(can.ondetail, function(key, cb) {
                            view[key] = function(event) { cb(event, can, line) }
                        })
                    },
                })

                can.core.Timer(parseInt(can.Action("speed")), next)
            })
        })
    },
    "数据源": function(event, can) {
        can.onmotion.clear(can, can.ui.display)
        can.onappend.table(can, can.msg, null, can.ui.display)
        can.onmotion.show(can, can.ui.display)
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

