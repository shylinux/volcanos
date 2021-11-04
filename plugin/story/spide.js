Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can), can.base.isFunc(cb) && cb(msg)
        if (msg.Option("branch")) { return can.onappend.table(can, msg) }

        can._tree = can.onimport._tree(can, msg.Table(), nfs.PATH, ice.PS)
        if (!can._tree[""]) { return }
        can.dir_root = msg.Option(nfs.DIR_ROOT)
        can._tree[""].name = can.dir_root.split(ice.PS).slice(-2)[0]

        can.size = 30, can.margin = 30
        can.onappend.plugin(can, {type: chat.OUTPUT, index: "web.wiki.draw"}, function(sub) {
            sub.run = function(event, cmds, cb) { sub.Action("go", "run")
                can.base.isFunc(cb) && cb(sub.request())

                can.core.Timer300ms(function() { can.draw = sub._outputs[0]
                    can.draw.onmotion.hidden(can.draw, can.draw.ui.project)
                    can.draw.require(["/plugin/local/wiki/draw/path.js"], function() {
                        var p = can.sup.view||can.Action("view"); 
                        can.Action("view", p)
                        can.onaction[p](event, can, p)
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

                node[last] = node[last]||{name: last, meta: {}, list: []}
                node[last].list.push(node[name] = {
                    name: value+(index==array.length-1? "": split),
                    meta: item, list: [], last: last,
                    file: item[field], hide: true,
                })
            })
        })
        return node
    },
    _height: function(can, tree) { if (!tree) { return 0 }
        if (tree.list.length == 0 || tree.hide) { return tree.height = 1 }

        var height = 0; can.core.List(tree.list, function(item) {
            height += can.onimport._height(can, item)
        })
        return tree.height = height
    },
    _width: function(can, tree) { if (!tree) { return 0 }
        if (tree.list.length == 0 || tree.hide) {
            tree.view = can.draw.onimport.draw({}, can.draw, {
                shape: "text", point: [{x: 0, y: 0}], style: {
                    "stroke-width": 1, "text-anchor": "middle", inner: tree.name,
                },
            })
            return tree.width = tree.view.Val("textLength")+can.margin
        }

        var width = 0; can.core.List(tree.list, function(item) {
            width += can.onimport._width(can, item)
        })
        return tree.width = width
    },
}, [""])
Volcanos("onaction", {help: "用户操作", list: ["编辑", ["view", "横向", "纵向"]],
    "编辑": function(event, can) {
        can.onmotion.toggle(can, can.draw._action)
        can.onmotion.toggle(can, can.draw._status)
    },
    "横向": function(event, can, button) {
        can.sup.view = button
        can.onmotion.clear(can, can.draw.svg)
        can.onimport._height(can, can._tree[""])

        can.draw.svg.Val(chat.HEIGHT, can._tree[""].height*can.size+2*can.margin)
        can.width = 0, can.onaction._draw(can, can._tree[""], can.margin, can.margin)
        can.draw.svg.Val(chat.WIDTH, can.width+can.margin)
    },
    "纵向": function(event, can, button) {
        can.sup.view = button
        can.onimport._width(can, can._tree[""])
        can.onmotion.clear(can, can.draw.svg)

        can.draw.svg.Val(chat.WIDTH, can._tree[""].width+2*can.margin)
        can.draw.svg.Value("font-family", "monospace")
        can.height = 0, can.onaction._draw_vertical(can, can._tree[""], can.margin, can.margin+can.size)
        can.draw.svg.Val(chat.HEIGHT, can.height+can.margin)
    },
    _draw_vertical: function(can, tree, x, y) { tree.x = x, tree.y = y
        var color = tree.meta&&tree.meta.color||cli.YELLOW
        tree.view = can.draw.onimport.draw({}, can.draw, {
            shape: "text", point: [
                {x: x+tree.width/2, y: y}
            ], style: {
                "stroke-width": 1, "stroke": color,
                "fill": color, "text-anchor": "middle", inner: tree.name,
            },
        })

        can.core.ItemCB(can.ondetail, function(key, cb) {
            tree.view[key] = function(event) { cb(event, can, tree) }
        })
        tree.height = can.size
        if (y+tree.height > can.height) { can.height = y+tree.height }
        if (tree.hide) { return }

        function line(p0, p1) {
            return "M "+p0.x+","+p0.y+" Q "+p0.x+","+(p0.y+(p1.y-p0.y)/3)+" "+(p0.x+p1.x)/2+","+(p0.y+p1.y)/2+" T "+p1.x+","+p1.y
        }

        var offset = 0; can.core.List(tree.list, function(item) {
            can.draw.onimport.draw({}, can.draw, {
                shape: "path", point: [], style: {
                    "stroke-width": 1, "stroke": cli.CYAN, "fill": html.NONE, d: line(
                        {x: x+tree.width/2, y: y+tree.height-can.margin/2},
                        {x: x+offset+item.width/2, y: y+tree.height+can.margin/2},
                    ), 
                },
            })

            can.onaction._draw_vertical(can, item, x+offset, y+tree.height+can.margin)
            offset += item.width
        })
    },

    _draw: function(can, tree, x, y) { tree.x = x, tree.y = y
        var color = tree.meta&&tree.meta.color||cli.YELLOW
        tree.view = can.draw.onimport.draw({}, can.draw, {
            shape: "text", point: [
                {x: x, y: y+tree.height*can.size/2}
            ], style: {
                "stroke-width": 1, "stroke": color,
                "fill": color, "text-anchor": "start", inner: tree.name,
            },
        })

        tree.width = tree.view.Val("textLength")
        if (x+tree.width > can.width) { can.width = x+tree.width }

        can.core.ItemCB(can.ondetail, function(key, cb) {
            tree.view[key] = function(event) { cb(event, can, tree) }
        })
        if (tree.hide) { return }

        function line(p0, p1) {
            return "M "+p0.x+","+p0.y+" Q "+(p0.x+(p1.x-p0.x)/3)+","+p0.y+" "+(p0.x+p1.x)/2+","+(p0.y+p1.y)/2+" T "+p1.x+","+p1.y
        }

        var offset = 0; can.core.List(tree.list, function(item) {
            can.draw.onimport.draw({}, can.draw, {
                shape: "path", point: [], style: {
                    "stroke-width": 1, "stroke": cli.CYAN, "fill": html.NONE, d: line(
                        {x: x+tree.width+can.margin/8, y: y+tree.height*can.size/2},
                        {x: x+tree.width+can.margin*2-2*can.margin/8, y: y+offset+item.height*can.size/2}
                    ), 
                },
            })

            can.onaction._draw(can, item, x+tree.width+2*can.margin, y+offset)
            offset += item.height*can.size
        })
    },
})
Volcanos("ondetail", {help: "用户交互", list: [],
    onmouseenter: function(event, can, tree) { var y = tree.y+tree.height*can.size/2
        can.page.Remove(can, can.pos), can.pos = can.draw.onimport.draw({}, can.draw, {
            shape: "rect", point: [
                {x: tree.x-can.margin/4, y: y-can.size/2},
                {x: tree.x+tree.width+can.margin/8, y: y+can.size/2},
            ], style: {
                "stroke": cli.RED, "stroke-width": 2, "fill": html.NONE,
            },
        }), event.stopPropagation(), event.preventDefault()
    },
    onclick: function(event, can, tree) {
        if (tree.name.endsWith(ice.PS) || tree.tags) {
            tree.hide = !tree.hide, can.onaction[can.Action("view")](event, can)
            return
        }

        if (tree.name.endsWith(".go") || tree.name.endsWith(".c") || tree.name.endsWith(".h")) {
            can.run(event, [can.Option(kit.MDB_NAME), tree.file], function(msg) {
                msg.Table(function(value) { tree.tags = true
                    tree.list.push({type: "tags", file: value.file, line: value.line, name: value.name, last: tree, list: []})
                })

                tree.hide = !tree.hide, can.onaction[can.Action("view")](event, can)
            }, true)
            return
        }

        can.ondetail.plugin(event, can, [can.dir_root, tree.file, tree.line])
    },

    plugin: function(event, can, args) {
        can.onappend.plugin(can, {type: chat.FLOAT, index: "web.code.inner", args: args, _action: [cli.CLOSE]}, function(sub) {
            sub.run = function(event, cmds, cb) {
                can.run(event, can.misc.Concat([ctx.ACTION, "inner"], cmds), function(msg) {
                    msg.Option(ice.MSG_ACTION, cli.CLOSE)
                    can.get("Action", "size", function(left, top, width, height) { left = left||0
                        var top = 120, margin = 20; if (can.user.isMobile) { margin = 0
                            if (can.user.isLandscape) {
                                top = 24, sub.Conf(chat.HEIGHT, height-top)
                            } else {
                                top = 48, sub.Conf(chat.HEIGHT, height-top)
                            }
                        } else {
                            sub.Conf(chat.HEIGHT, height-top)
                        }

                        var layout = {position: "fixed", left: left+margin, top: top}
                        can.onmotion.move(can, sub._target, layout)
                        can.page.Modify(can, sub._target, {style: layout})
                        can.page.Modify(can, sub._output, {style: {"max-width": width-margin*2}})
                        can.base.isFunc(cb) && cb(msg)
                    })
                }, true)
            }
        })
    },
})

