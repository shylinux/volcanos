Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can)
        can.base.isFunc(cb) && cb(msg)
        if (msg.Option("branch")) { return can.onappend.table(can, msg) }

        can.dir_root = msg.Option("dir_root")
        can._tree = can.onimport._tree(can, msg.Table(), "path", "/")
        if (!can._tree[""]) { return }
        can._tree[""].name = can.dir_root.split("/").pop()

        can.size = 30, can.margin = 30
        can.onappend.plugins(can, {index: "web.wiki.draw"}, function(sub) {
            sub.run = function(event, cmds, cb) { sub.Action("go", "run")
                can.base.isFunc(cb) && cb(sub.request())

                can.core.Timer(100, function() { can.draw = sub._outputs[0]
                    can.draw.onmotion.hidden(can.draw, can.draw.ui.project)
                    can.draw.require(["/plugin/local/wiki/draw/path.js"], function() {
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

                node[last] = node[last] || {name: last, meta: {}, list: []}
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
}, ["/plugin/story/spide.css"])
Volcanos("onaction", {help: "用户操作", list: ["编辑", ["view", "横向", "纵向"]],
    "编辑": function(event, can) {
        can.onmotion.toggle(can, can.draw._action)
        can.onmotion.toggle(can, can.draw._status)
    },
    "横向": function(event, can) {
        can.onmotion.clear(can, can.draw.svg)

        can.onimport._height(can, can._tree[""])
        can.draw.svg.Val("height", can._tree[""].height*can.size+2*can.margin)
        can.width = 0, can.onaction._draw(can, can._tree[""], can.margin, can.margin)
        can.draw.svg.Val("width", can.width+can.margin)
        can.base.Log(can)
    },
    "纵向": function(event, can) {
        can.onmotion.clear(can, can.draw.svg)
    },

    _draw: function(can, tree, x, y) { tree.x = x, tree.y = y
        var color = tree.meta&&tree.meta.color||"yellow"
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

        can.core.Item(can.ondetail, function(key, value) {
            if (key.indexOf("on") == 0 && can.base.isFunc(value)) {
                tree.view[key] = function(event) { value(event, can, tree) }
            }
        })

        if (tree.hide) { return }

        function line(p0, p1) {
            return "M "+p0.x+","+p0.y+" Q "+(p0.x+(p1.x-p0.x)/3)+","+p0.y+" "+(p0.x+p1.x)/2+","+(p0.y+p1.y)/2+" T "+p1.x+","+p1.y
        }

        var offset = 0; can.core.List(tree.list, function(item) {
            can.draw.onimport.draw({}, can.draw, {
                shape: "path", point: [], style: {
                    "stroke-width": 1, "stroke": "cyan", "fill": "none", d: line(
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
                "stroke": "red", "stroke-width": 2, "fill": "none",
            },
        }), event.stopPropagation(), event.preventDefault()
    },
    onclick: function(event, can, tree) {
        if (tree.name.endsWith("/") || tree.tags) {
            tree.hide = !tree.hide, can.onaction[can.Action("view")](event, can)
            return
        }

        if (tree.name.endsWith(".go") || tree.name.endsWith(".c") || tree.name.endsWith(".h")) {
            can.run(event, [can.Option("name"), tree.file], function(msg) {
                msg.Table(function(value) { tree.tags = true
                    tree.list.push({type: "tags", file: value.file, line: value.line, name: value.name, last: tree, list: []})
                })

                tree.hide = !tree.hide, can.onaction[can.Action("view")](event, can)
            }, true)
            return
        }

        can.ondetail._show(event, can, [can.dir_root, tree.file, tree.line])
    },

    _show: function(event, can, args) {
        can.onappend.plugin(can, {type: "float", index: "web.code.inner", args: args, _action: ["关闭"]}, function(sub) {
            can.page.Modify(can, sub._target, {style: {position: "fixed"}})
            sub.run = function(event, cmds, cb) {
                can.run(event, ["action", "inner"].concat(cmds), cb, true)
                can.onlayout.figure(event, sub, sub._target)
            }
        })
    },
})
