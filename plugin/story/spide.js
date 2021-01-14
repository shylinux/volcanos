Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, msg, list, cb, target) { can._output.innerHTML = ""
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
        can.dir_root = msg.Option("dir_root")

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
                can.core.Timer(1000, function() {
                    can.sub = sub._outputs[0]
                    can.msg = msg, can.data = msg.Table()
                    can.Action("height", "400")
                    can.Action("speed", "100")
                    can.Action("scale", "1")
                    can.Action("stroke-width", "1")
                    can.sub.svg.Value("transform", "scale("+(can.Action("scale")||1)+")")
                    can.onaction["横向"](event, can)
                    sub.Action("go", "run")
                })
            }
        }, can.ui.content)
    },
})
Volcanos("onaction", {help: "组件菜单", list: ["编辑", ["view", "横向", "纵向"], ["scale", "0.2", "0.5", "1", "2", "5"]],
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
            value.path && can.core.List(value.path.split("/"), function(item, index, array) {
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
        if (!tree) { return }
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
    _draw: function(can, tree, x, y) { var sub = can.sub, name = tree.name || can.Option("name") || "."
        tree.view = sub.onimport.draw({}, sub, {
            shape: "text", point: [{x: x, y: y+tree.height*30/2}], style: {inner: name, "text-anchor": "start", "stroke-width": 1, fill: "yellow"},
        })
        if (x+name.length*16 > can.width) {
            can.width = x+name.length*20
        }
        tree.view.onclick = function(event) {
            if (name.endsWith("/") || tree.tags) {
                sub.svg.innerHTML = ""
                tree.hide = !tree.hide
                can.onaction["横向"](event, can)
                return
            }

            if (tree.name.endsWith("go") ||
            tree.name.endsWith("c") ||
            tree.name.endsWith("h")) {
                can.run(event, [can.Option("name"), tree.file], function(msg) {
                    msg.Table(function(value) { tree.tags = true
                        tree.list.push({type: "tags", file: value.file, line: value.line, name: value.name, last: tree, list: []})
                    })

                    sub.svg.innerHTML = ""
                    tree.hide = !tree.hide
                    can.onaction["横向"](event, can)
                }, true)
                return
            }

            can.onaction._show(can, [can.dir_root, tree.file, tree.line], {
                position: "fixed", width: 800, height: 600,
                left: event.x-(event.x>600? 400: 100),
                top: event.y-(event.y>600? 400: 0),
            })
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
    _resize: function(can, layout) {
        can.page.Modify(can, can._target, {style: layout})
        can.page.Select(can, can._output, "div.profile", function(item) {
            can.page.Modify(can, item, {style: {
                "max-height": layout.height-60,
                "width": layout.width,
            }})
        })
        can.page.Select(can, can._output, "div.content", function(item) {
            can.page.Modify(can, item, {style: {
                "max-width": layout.width - 100,
            }})
        })
        can.page.Select(can, can._output, "div.search", function(item) {
            can.page.Modify(can, item, {style: {
                position: "absolute", bottom: 0,
                width: layout.width,
            }})
        })
    },
    _show: function(can, args, layout) {
        can.onappend.plugin(can, {index: "web.code.inner", args: args, _action: ["最大", "分屏", "复制", "关闭"], width: layout.width, height: layout.height}, function(sub, value) {
            can.onmotion.move(sub, sub._target, layout)
            can.onaction._resize(sub, layout)

            sub.run = function(event, cmds, cb, silent) {
                switch (cmds[1]) {
                    case "关闭":
                        can.page.Remove(can, sub._target)
                        break
                    case "复制":
                        can.onaction._show(can, args, {
                            position: "fixed",
                            left: layout.left+100, top: layout.top+100,
                            width: layout.width, height: layout.height,
                        })
                        break
                    case "分屏":
                        if (event.ctrlKey) {
                            layout.height = layout.height/2
                            can.onaction._resize(sub, layout)

                            can.onaction._show(can, args, {
                                position: "fixed",
                                left: layout.left, top: layout.top+layout.height+10,
                                width: layout.width, height: layout.height,
                            })
                            break
                        }

                        layout.width = layout.width/2
                        can.onaction._resize(sub, layout)

                        can.onaction._show(can, args, {
                            position: "fixed",
                            left: layout.left+layout.width+10, top: layout.top,
                            width: layout.width, height: layout.height,
                        })
                        break
                    case "最大":
                        if (event.ctrlKey) {
                            layout.left = 0, layout.top = 40
                            layout.width = window.innerWidth/2
                            layout.height = window.innerHeight/2
                            can.onaction._resize(sub, layout)
                            break
                        }

                        layout.left = 0, layout.top = 40
                        layout.width = window.innerWidth-40
                        layout.height = window.innerHeight-60
                        if (can.user.isMobile) {
                            if (window.innerWidth > window.innerHeight) {
                                layout.top = 0
                            }
                        }
                        can.onaction._resize(sub, layout)
                        break
                    default:
                        can.run(event, ["inner"].concat(cmds), function(msg) {
                            cb(msg), can.core.Timer(10, function() {
                                // can.onaction._resize(sub, layout)
                            })
                        }, true)
                }
            }
            if (can.user.isMobile) {
                can.core.Timer(100, function() {
                    sub.run({}, ["some", "最大"])
                })
            }
        })
    },

    "横向": function(event, can) { var sub = can.sub
        can.width = 0
        can._tree = can._tree || can.onaction._tree(can, can._msg)
        can.onaction._height(can, can._tree[""])
        if (!can._tree[""]) { return }
        sub.svg.Val("height", can._tree[""].height*30)
        can.onaction._draw(can, can._tree[""], 0, 0)
        sub.svg.Val("width", can.width)
    },
    "纵向": function(event, can) {
    },
})

