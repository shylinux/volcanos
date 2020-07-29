Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, msg, list, cb, target) { can._output.innerHTML = ""
        if (msg.Option("_display") == "table") {
            can.onappend.table(can, can._target, "table", msg)
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
                can.Timer(1000, function() {
                    can.sub = sub._outputs[0]
                    can.msg = msg, can.data = msg.Table()
                    can.Action("height", "400")
                    can.Action("speed", "100")
                    can.Action("scale", "1")
                    can.sub.svg.Value("transform", "scale("+can.Action("scale")+")")
                    can.onaction["横向"](event, can)
                    sub.Action("go", "run")
                })
            }
        }, can.ui.content)
    },
})
Volcanos("onaction", {help: "组件菜单", list: ["编辑", "清空", ["view", "横向", "纵向"], ["height", "100", "200", "400", "600"], ["speed", "10", "50", "100"], ["scale", "0.2", "0.5", "1", "2", "5"]],
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
    scale: function(event, can, cmd) {
        can.sub.svg.Value("transform", "scale("+can.Action("scale")+")")
        can.onaction[can.Action("view")](event, can)
    },

    _tree: function(can, msg) { var list = {}
        msg.Table(function(value, index) {
            can.core.List(value.path.split("/"), function(item, index, array) {
                var last = array.slice(0, index).join("/") || ""
                var name = array.slice(0, index+1).join("/")
                list[last] = list[last] || {name: last, list: []}
                if (!item || list[name]) { return }
                list[last].list.push(list[name] = {hide: true, file: value.path, name: item+(index==array.length-1? "": "/"), last: last, list: []})
            })
        })
        return list
    },
    _height: function(can, tree) {
        if (tree.hide) { return tree.height = 1 }

        if (tree.list.length == 0) {
            return tree.height = 1
        }

        var height = 0
        can.core.List(tree.list, function(item) {
            height += can.onaction._height(can, item)
        })
        return tree.height = height
    },
    _draw: function(can, tree, x, y) { var sub = can.sub, name = tree.name || can.Option("path") || "."
        tree.view = sub.onimport.draw({}, sub, {
            shape: "text", point: [{x: x, y: y+tree.height*30/2}], style: {inner: name, "text-anchor": "start", "stroke-width": 1, fill: "yellow"},
        })
        if (x+name.length*16 > can.width) {
            can.width = x+name.length*20
        }
        tree.view.onclick = function(event) {
            if (!name.endsWith("/")) {
                if (!tree.tags) { tree.tags = true
                    console.log(tree)
                    can.run(event, [can.Option("path"), tree.file], function(msg) {
                        msg.Table(function(value) {
                            tree.list.push({name: value.name, last: tree, list: []})
                        })

                        sub.svg.innerHTML = ""
                        tree.hide = !tree.hide
                        can.onaction["横向"](event, can)
                    }, true)
                    return
                }
            }

            sub.svg.innerHTML = ""
            tree.hide = !tree.hide
            can.onaction["横向"](event, can)

            if (!event) {return}
            event.stopPropagation()
            event.preventDefault()
        }
        tree.view.onmouseenter = function(event) {
            can.page.Remove(can, can.pos)
            can.pos = sub.onimport.draw({}, sub, {
                shape: "rect", point: [{x: x, y: y+tree.height*30/2-15}, {
                    x: x+name.length*16,
                    y: y+tree.height*30/2+15,
                }], style: {"stroke": "red", "stroke-width": 1, fill: "none"},
            })
            event.stopPropagation()
            event.preventDefault()
        }

        if (tree.hide) { return }
        var offset = 0
        can.core.List(tree.list, function(item) {
            function line(p0, p1) {
                return "M "+p0.x+","+p0.y+" Q "+(p0.x+(p1.x-p0.x)/3)+","+p0.y+" "+(p0.x+p1.x)/2+","+(p0.y+p1.y)/2+" T "+p1.x+","+p1.y
            }

            sub.onimport.draw({}, sub, {
                shape: "path", point: [], style: {
                    fill: "none",
                    stroke: "cyan", "stroke-width": 1, d: line(
                        {x: x+name.length*16-10, y: y+tree.height*30/2},
                        {x: x+name.length*16+40, y: y+offset+item.height*30/2}
                    ), 
                },
            })
            can.onaction._draw(can, item, x+name.length*20+20, y+offset)
            offset += item.height*30
        })
    },

    "横向": function(event, can) { var sub = can.sub
        can.width = 0
        can._tree = can._tree || can.onaction._tree(can, can._msg)
        can.onaction._height(can, can._tree[""])
        sub.svg.Val("height", can._tree[""].height*30)
        can.onaction._draw(can, can._tree[""], 0, 0)
        sub.svg.Val("width", can.width)
    },
    "纵向": function(event, can) {
    },
})
Volcanos("onchoice", {help: "组件交互", list: []})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: ["date", "begin", "add", "del", "close", "note"]})

