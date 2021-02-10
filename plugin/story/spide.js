Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        typeof cb == "function" && cb(msg)
        can.msg = msg, can.data = msg.Table()
        can.dir_root = msg.Option("dir_root")
        can.Action("scale", parseInt(msg.Option("scale")||"1"))
        can._tree = can.onimport._tree(can, msg.Table(), "path", "/")

        can.onmotion.clear(can)
        can.onappend.plugins(can, {type: "inner", index: "web.wiki.draw"}, function(sub) {
            sub.run = function(event, cmds, cb) {
                typeof cb == "function" && cb(sub.request())
                can.core.Timer(100, function() { can.sub = sub._outputs[0]
                    can.sub.onmotion.hidden(can.sub, can.sub.ui.project)
                    can.sub.require(["/plugin/local/wiki/draw/path.js"], function() {
                        can.sub.svg.Value("transform", "scale("+(can.Action("scale")||1)+")")
                        sub.Action("go", "run")

                        can.onaction[can.Action("view")](event, can)
                    })
                })
            }
        })
    },

    _tree: function(can, list, field, split) {
        var node = {}; can.core.List(list, function(item) {
            item[field] && can.core.List(item[field].split(split), function(value, index, array) {
                var last = array.slice(0, index).join(split) || "", name = array.slice(0, index+1).join(split)
                if (!value || node[name]) { return }

                node[last] = node[last] || {name: last, list: []}
                node[last].list.push(node[name] = {
                    name: value+(index==array.length-1? "": split),
                    meta: item, list: [], last: last,
                    file: item[field], hide: true,
                })
            })
        })
        return node
    },
    _height: function(can, tree) {
        if (!tree) { return 0 }
        if (tree.hide) { return tree.height = 1 }
        if (tree.list.length == 0) { return tree.height = 1 }

        var height = 0; can.core.List(tree.list, function(item) {
            height += can.onimport._height(can, item)
        })
        return tree.height = height
    },
})
Volcanos("onaction", {help: "操作数据", list: ["编辑", ["view", "横向", "纵向"], ["scale", "0.2", "0.5", "1", "2", "5"]],
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
    height: function(event, can) {
        can.onaction[can.Action("view")](event, can)
    },
    scale: function(event, can) {
        can.sub.svg.Value("transform", "scale("+(can.Action("scale")||"1")+")")
        can.onaction[can.Action("view")](event, can)
    },

    _show: function(can, args, layout) {
        can.onappend.plugin(can, {
            index: "web.code.inner", args: args,
            _action: ["关闭", "最大", "分屏", "复制"],
            width: layout.width, height: layout.height,
        }, function(sub) { can.page.Modify(can, sub._target, {style: layout})
            sub.run = function(event, cmds, cb, silent) {
                can.run(event, ["action", "inner"].concat(cmds), function(msg) {
                    typeof cb == "function" && cb(msg)
                }, true)
            }
        })
    },
    _draw: function(can, tree, x, y) { var sub = can.sub, name = tree.name || can.Option("name") || "."
        if (x+name.length*16 > can.width) { can.width = x+name.length*20 }

        tree.view = sub.onimport.draw({}, sub, {
            shape: "text", point: [
                {x: x, y: y+tree.height*30/2}
            ], style: {
                "stroke-width": 1, "fill": "yellow", "text-anchor": "start", inner: name,
            },
        })

        tree.view.onclick = function(event) {
            if (name.endsWith("/") || tree.tags) {
                tree.hide = !tree.hide
                can.onaction[can.Action("view")](event, can)
                return
            }

            if (tree.name.endsWith("go") || tree.name.endsWith("c") || tree.name.endsWith("h")) {
                can.run(event, [can.Option("name"), tree.file], function(msg) {
                    msg.Table(function(value) { tree.tags = true
                        tree.list.push({type: "tags", file: value.file, line: value.line, name: value.name, last: tree, list: []})
                    })

                    tree.hide = !tree.hide
                    can.onaction[can.Action("view")](event, can)
                }, true)
                return
            }

            var width = 720, height = 400
            can.onaction._show(can, [can.dir_root, tree.file, tree.line], {
                position: "fixed", width: width, height: height+240,
                left: event.x+width>window.innerWidth? window.innerWidth-width: event.x,
                top: event.y+height+120>window.innerHeight? window.innerHeight-height-120: event.y,
            })
        }
        tree.view.onmouseenter = function(event) {
            can.page.Remove(can, can.pos)
            can.pos = sub.onimport.draw({}, sub, {
                shape: "rect", point: [
                    {x: x, y: y+tree.height*30/2-15},
                    {x: x+name.length*16, y: y+tree.height*30/2+15},
                ], style: {
                    "stroke": "red", "stroke-width": 1, "fill": "none",
                },
            })
            event.stopPropagation(), event.preventDefault()
        }

        if (tree.hide) { return }

        function line(p0, p1) {
            return "M "+p0.x+","+p0.y+" Q "+(p0.x+(p1.x-p0.x)/3)+","+p0.y+" "+(p0.x+p1.x)/2+","+(p0.y+p1.y)/2+" T "+p1.x+","+p1.y
        }

        var offset = 0; can.core.List(tree.list, function(item) {
            sub.onimport.draw({}, sub, {
                shape: "path", point: [], style: {
                    "stroke-width": 1, "stroke": "cyan", "fill": "none", d: line(
                        {x: x+name.length*16-10, y: y+tree.height*30/2},
                        {x: x+name.length*16+40, y: y+offset+item.height*30/2}
                    ), 
                },
            })

            can.onaction._draw(can, item, x+name.length*20+20, y+offset)
            offset += item.height*30
        })
    },
    "横向": function(event, can) {
        if (!can._tree[""]) { return }
        can.onmotion.clear(can, can.sub.svg)

        can.onimport._height(can, can._tree[""])
        can.sub.svg.Val("height", can._tree[""].height*30)
        can.width = 0, can.onaction._draw(can, can._tree[""], 0, 0)
        can.sub.svg.Val("width", can.width)
    },
    "纵向": function(event, can) {
    },
})

