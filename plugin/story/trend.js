Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) { can._output.innerHTML = ""
        var list = []; can.onengine.listen(can, "action.resize", function(width, height) {
            can.Conf({width: width, height: height}), can.core.Delay(list, 100, function() {
                can.onimport._init(can, msg, list, cb, target)
            })
        })

        if (msg.Option("_display") == "table") {
            can.onappend.table(can, "content", msg, function(value, key) {
                return {text: [value, "td"], click: function(event) {
                    can.sup.onaction.change(event, can.sup, key, value, function(msg) {
                        can.run(event)
                    })
                }}
            }, can._target)
            return typeof cb == "function" && cb(msg)
        }
        can.ui = can.page.Append(can, can._output, [{view: "content"}, {view: "display"}])

        can.onappend._init(can, {name: "draw", help: "绘图", inputs: [
                {type: "text", name: "path", value: "hi.svg"},
                {type: "button", name: "查看", value: "auto"},
            ], index: "web.wiki.draw.draw", feature: {display: "/plugin/local/wiki/draw.js"}}
        , Volcanos.meta.libs.concat(["/plugin/state.js"]), function(sub) {
            can.page.Modify(can, sub._legend, {style: {display: "none"}})
            can.page.Modify(can, sub._option, {style: {display: "none"}})
            can.page.Modify(can, sub._action, {style: {display: "none"}})
            can.page.Modify(can, sub._status, {style: {display: "none"}})
            sub.run = function(event, cmds, cb, silent) {
                typeof cb == "function" && cb(can.request(event))
                can.core.Timer(100, function() {
                    can.sub = sub._outputs[0]
                    can.msg = msg, can.data = msg.Table()
                    var action = can.Conf("action")
                    can.Action("height", parseInt(action && action.height ||"400"))
                    can.Action("speed", parseInt(action && action.speed ||"100"))
                    can.onaction["股价图"](event, can)
                })
            }
        }, can.ui.content)
        return typeof cb == "function" && cb(msg)
    },
})
Volcanos("onaction", {help: "组件菜单", list: ["编辑", "清空", ["view", "股价图", "趋势图", "数据源"], ["height", "100", "200", "400", "600"], ["speed", "10", "20", "50", "100"]],
    "编辑": function(event, can) {
        var hide = can.sub._action.style.display == "none"
        can.page.Modify(can, can.sub._action, {style: {display: hide? "": "none"}})
        can.page.Modify(can, can.sub._status, {style: {display: hide? "": "none"}})
    },
    "清空": function(event, can) {
        can.sub.svg.innerHTML = ""
    },
    view: function(event, can, cmd, value) {
        can.onaction[value](event, can)
    },
    height: function(event, can, cmd) {
        can.onaction[can.Action("view")](event, can)
    },

    "股价图": function(event, can) { var sub = can.sub, data = can.data
        if (!can.list) { var count = 0, add = 0, del = 0, max = 0, begin = ""
            can.max = 0, can.min = 0, can.rest = 0, can.list = can.core.List(data, function(value, index) {
                if (index == 0) { begin = value.date }
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
                if (line.max > can.max) { can.max = line.max }
                if (line.min < can.min) { can.min = line.min }
                return line
            })
            can.Status("from", begin)
            can.Status("commit", count)
            can.Status("total", add+del)
        }

        var space = 10
        var view = parseInt(can.Action("height"))
        var max = parseInt(can.Conf("width"))-120
        var step = parseInt(max / can.list.length)||2

        var width = can.list.length * step + space * 2
        sub.svg.Val("width", width)

        var height  = view + space * 2
        sub.svg.Val("height", height)

        sub.svg.innerHTML = ""
        can.ui.display.innerHTML = ""

        function compute(y) { return (y - can.min)/(can.max - can.min)*view }
        var i = 0; can.core.Next(can.list, function(line, next) {
            (function() { var index = i++
                sub.onimport.draw({}, sub, {
                    shape: "line", point: [
                        {x: space/2+step*index+step/4, y: space/2+view-compute(line.min)},
                        {x: space/2+step*index+step/4, y: space/2+view-compute(line.max)},
                    ], style: line.begin < line.close? {
                        "stroke-width": 1, "stroke": "white",
                    }: {
                        "stroke-width": 1, "stroke": "black",
                    },
                })

                var one = line.begin < line.close? sub.onimport.draw({}, sub, {
                    shape: "rect", point: [
                        {x: space/2+step*index, y: space/2+view-compute(line.begin)},
                        {x: space/2+step*index+step/2, y: space/2+view-compute(line.close)},
                    ], style: {
                        "rx": 0, "ry": 0, "stroke-width": 1, "stroke": "white", "fill": "white",
                    },
                }): sub.onimport.draw({}, sub, {
                    shape: "rect", point: [
                        {x: space/2+step*index, y: space/2+view-compute(line.close)},
                        {x: space/2+step*index+step/2, y: space/2+view-compute(line.begin)},
                    ], style: {
                        "rx": 0, "ry": 0, "stroke-width": 1, "stroke": "black", "fill": "black",
                    },
                })

                one.onmouseover = function(event) { can.Status(line) }

                can.core.Timer(parseInt(can.Action("speed")), next)
            })()
        })
    },
    "趋势图": function(event, can, value, cmd, target) {var sub = can.sub, data = can.data;
        var space = 10
        var view = parseInt(can.Action("height"))
        var max = parseInt(can.Conf("width"))-120
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

        sub.svg.innerHTML = ""
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

            can.core.List(data, function(line, index) {
                var one = sub.onimport.draw({}, sub, {
                    shape: "rect",
                    point: [
                        {x: space+step*index, y: y},
                        {x: space+step*index+step/4, y: y-parseInt(line[key])/(max[key]||1)*view}
                    ],
                    style: {
                        "rx": 0, "ry": 0,
                        "stroke-width": 1, "stroke": "white", "fill": "white",
                    },
                })

                one.onmouseover = function(event) { can.Status(line) }
            })
        })
    },
    "数据源": function(event, can) {
        can.ui.display.innerHTML = ""
        can.onappend.table(can, "content", can._msg, null, can.ui.display)
    },
})
Volcanos("onexport", {help: "导出数据", list: ["from", "commit", "total", "date", "begin", "add", "del", "close", "note"]})

