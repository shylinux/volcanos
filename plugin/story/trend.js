Volcanos("onimport", {help: "导入数据", list: [],
    init: function(can, meta, cb, target, action, option) {target.innerHTML = ""
        if (can.msg.Option("_display") == "table") {
            can.page.AppendTable(can, target, can.msg, can.msg.append, function(event, value, key, index, tr, td) {
                can.Export(event, value, key)
            })
            return
        }

        can.data = can.msg.Table()
        can.ui = can.page.Append(can, target, [{view: "action"}, {view: "output"}, {view: "total"}, {view: "status"}])
        can.ui.table = can.page.AppendTable(can, target, can.msg, can.msg.append)
        can.ui.table.style.clear = "both"
        can.sub = can.Output(can, {}, "/plugin/wiki/draw", can.Event({}), function() {
            can.onaction["编辑"]({}, can)
            can.onaction["表格"]({}, can)
            can.onaction["股价图"]({}, can)
        }, can.ui.output, can.ui.action, option, can.ui.status)
    },
})

Volcanos("onaction", {help: "组件菜单", list: ["股价图", "趋势", "比例", "表格", "编辑"],
    "表格": function(event, can, value, cmd, target) {var sub = can.sub, data = can.data;
        can.page.ClassList.neg(can, can.ui.table, "hidden")
    },
    "股价图": function(event, can, value, cmd, target) {var sub = can.sub, data = can.data;
        if (!can.list) {
            var add = 0, del = 0, count = 0, max = 0
            can.total = 0, can.list = can.core.List(data, function(value, index) {
                var line = {};
                line.note = value[can.msg.append[4]]
                line.date = value[can.msg.append[0]]
                line.add = parseInt(value[can.msg.append[1]])
                line.del = parseInt(value[can.msg.append[2]])

                line.begin = can.total
                line.max = can.total + line.add
                line.min = can.total - line.del
                line.close = can.total = can.total + line.add - line.del
                add += line.add
                del += line.del
                if (line.max - line.min > max) {
                    max = line.max - line.min
                }
                count++
                return line
            })
            var begin = new Date(data[0].date)
            var end = new Date(data[data.length-1].date)
            var avg = parseInt((add + del) / (end - begin) * 1000 * 3600 * 24)
            can.ui.total.innerHTML = can.base.Duration(end-begin) + " count: " + count + " add: " + add + " del: " + del
                + " max: " + max + " avg: " + avg + " rest: " + can.total
        }

        var step = 20
        var view = 200
        var space = 10
        var max = 600

        if (can.list.length * space > max) {
            step = parseInt(max / can.list.length)||2
        }

        var width = can.list.length * step + space * 2
        sub.svg.Val("width", width)

        var height  = view + space * 2
        sub.svg.Val("height", height)


        var display = can.page.Append(can, can.target, [{view: ["display"], style: {position: "absolute", "white-space": "pre"}, onclick: function() {
            can.page.ClassList.add(can, display, "hidden")
        }}]).first

        can.core.List(can.list, function(line, index) {
            sub.onimport.draw({}, sub, {
                shape: "line", point: [
                    {x: space/2+step*index+step/4, y: space/2+view-line.min/can.total*view},
                    {x: space/2+step*index+step/4, y: space/2+view-line.max/can.total*view},
                ], style: {
                },
            })
            var one = line.begin < line.close? sub.onimport.draw({}, sub, {
                shape: "rect", point: [
                    {x: space/2+step*index, y: space/2+view-line.begin/can.total*view},
                    {x: space/2+step*index+step/2, y: space/2+view-line.close/can.total*view},
                ], style: {
                    "rx": 0, "ry": 0,
                    "stroke-width": 1,
                    "fill": "white",
                },
            }): sub.onimport.draw({}, sub, {
                shape: "rect", point: [
                    {x: space/2+step*index, y: space/2+view-line.close/can.total*view},
                    {x: space/2+step*index+step/2, y: space/2+view-line.begin/can.total*view},
                ], style: {
                    "rx": 0, "ry": 0,
                    "stroke-width": 1,
                    "fill": "black",
                },
            })

            one.onmouseover = function(event) {
                can.page.ClassList.del(can, display, "hidden")
                display.style.left = event.clientX+space/2+"px"
                display.style.top = event.clientY+space/2+"px"
                display.innerHTML =
                      "date:  "+line.date+"\n"
                    + "note:  "+line.note+"\n"
                    + "begin: "+line.begin+"\n"
                    + "add:   "+line.add+"\n"
                    + "del:   "+line.del+"\n"
                    + "close: "+line.close+"\n"
            }
        })
    },
    "趋势": function(event, can, value, cmd, target) {var sub = can.sub, data = can.data;
        var width = data.length * 20 + 10
        sub.svg.Val("width", width)

        var height  = can.msg.append.length * 100 + 10
        sub.svg.Val("height", height)

        can.core.List(can.msg.append, function(key, which) {
            can.core.List(data, function(value, index) {
                sub.onimport.draw({}, sub, {
                    shape: "rect",
                    point: [{x: 10+20*index, y: 100*(which+1)}, {x: 20*index+20, y: 100*(which+1)-parseInt(value[key])}],
                })
            })
        })
    },
    "编辑": function(event, can, value, cmd, target) {
        can.page.ClassList.neg(can, can.ui.action, "hidden")
        can.page.ClassList.neg(can, can.ui.status, "hidden")
    },
})
Volcanos("onexport", {help: "导出数据", list: []})
