Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can), can.base.isFunc(cb) && cb(msg)
        if (msg.Length() == 0) { return }

        can._args = can.base.Copy({root: "ice", field: msg.append[0], split: ice.PS}, can.base.ParseURL(can._display))
        can.dir_root = msg.Option(nfs.DIR_ROOT)||can._args.root||""
        can._tree = can.onimport._tree(can, msg.Table(), can._args.field, can._args.split)
        if (!can._tree[""]) { return }
        can._tree[""].name = can._args.root

        can.size = 30, can.margin = 30
        can.require(["/plugin/local/wiki/draw.js", "/plugin/local/wiki/draw/path.js"], function() {
            can.page.ClassList.add(can, can._fields, "draw")
            can.onimport._show(can, msg), can.onmotion.hidden(can, can.ui.project)
            var p = can.Action(ice.VIEW, can.sup.view||can.Action(ice.VIEW))
            can.onaction[p](event, can, p)
        })
    },

    _tree: function(can, list, field, split) {
        var node = {}; can.core.List(list, function(item) { if (!item[field]) { return }
            can.core.List(can.base.trimPrefix(item[field], can.dir_root+can._args.split).split(split), function(value, index, array) {
                var last = array.slice(0, index).join(split)||"", name = array.slice(0, index+1).join(split)
                if (!value || node[name]) { return }

                node[last] = node[last]||{name: last, meta: {}, list: []}
                node[last].list.push(node[name] = {
                    name: value+(index==array.length-1? "": split),
                    meta: item, list: [], last: node[last],
                    file: item[field]||item.file, hide: true,
                })
            })
        })
        return node
    },
    _height: function(can, tree, deep) { if (!tree) { return 0 }
        tree.deep = deep||0
        if (tree.list.length == 0 || tree.hide) { return tree.height = 1 }

        var height = 0; can.core.List(tree.list, function(item) {
            height += can.onimport._height(can, item, (deep||0)+1)
        })
        return tree.height = height
    },
    _width: function(can, tree, deep) { if (!tree) { return 0 }
        tree.deep = deep||0
        if (tree.list.length == 0 || tree.hide) {
            tree.view = can.onimport.draw({}, can, {shape: html.TEXT, point: [{x: 0, y: 0}], style: {inner: tree.name}})
            return tree.width = tree.view.Val("textLength")+can.margin
        }

        var width = 0; can.core.List(tree.list, function(item) {
            width += can.onimport._width(can, item, (deep||0)+1)
        })
        return tree.width = width
    },
    _color: function(can, tree) {
        return tree.meta&&tree.meta.color || (tree.list == 0? cli.PURPLE: cli.YELLOW)
    },
}, [""])
Volcanos("onaction", {help: "用户操作", list: ["编辑", [ice.VIEW, "横向", "纵向"], "生成图片"],
    "编辑": function(event, can) {
        can.onmotion.toggle(can, can._action)
        can.onmotion.toggle(can, can._status)
    },
    "横向": function(event, can) {
        can.onimport._height(can, can._tree[""])
        can.sup.view = "横向", can.onmotion.clear(can, can.svg)

        can.svg.Val(html.HEIGHT, can._tree[""].height*can.size+2*can.margin)
        can.width = 0, can.onaction._draw_horizontal(can, can._tree[""], can.margin, can.margin)
        can.svg.Val(html.WIDTH, can.width+can.margin)
    },
    "纵向": function(event, can) {
        can.onimport._width(can, can._tree[""])
        can.sup.view = "纵向", can.onmotion.clear(can, can.svg)

        can.svg.Val(html.WIDTH, can._tree[""].width+2*can.margin)
        can.height = 0, can.onaction._draw_vertical(can, can._tree[""], can.margin, can.margin+can.size)
        can.svg.Val(html.HEIGHT, can.height+can.margin)
    },
    "生成图片": function(event, can) {
        can.user.toPNG(can, "hi.png", can.svg.outerHTML, can.svg.Val(html.HEIGHT), can.svg.Val(html.WIDTH))
    },
    _draw: function(can, tree, x, y, style) {
        var color = can.onimport._color(can, tree)
        tree.view = can.onimport.draw({}, can, {
            shape: html.TEXT, point: [{x: x, y: y}], style: can.base.Copy({
                stroke: color, fill: color, "text-anchor": "start", inner: tree.name||tree.file,
            }, style),
        }), can.core.ItemCB(can.ondetail, tree.view, can, tree)
    },
    _draw_vertical: function(can, tree, x, y) { tree.x = x, tree.y = y
        can.onaction._draw(can, tree, x+tree.width/2, y, {"text-anchor": "middle"})

        tree.height = can.size
        if (y+tree.height > can.height) { can.height = y+tree.height }
        if (tree.hide) { return }

        var offset = 0; can.core.List(tree.list, function(item) {
            can.onimport.draw({}, can, {shape: "path2v", point: [
                {x: x+tree.width/2, y: y+tree.height-can.margin/2},
                {x: x+offset+item.width/2, y: y+tree.height+can.margin/2},
            ], style: {stroke: cli.CYAN}})

            can.onaction._draw_vertical(can, item, x+offset, y+tree.height+can.margin)
            offset += item.width
        })
    },
    _draw_horizontal: function(can, tree, x, y) { tree.x = x, tree.y = y
        can.onaction._draw(can, tree, x, y+tree.height*can.size/2, {"text-anchor": "start"})

        tree.width = tree.view.Val("textLength")||(tree.name||"").length*10
        if (x+tree.width > can.width) { can.width = x+tree.width }
        if (tree.hide) { return }

        var offset = 0; can.core.List(tree.list, function(item) {
            can.onimport.draw({}, can, {shape: "path2h", point: [
                {x: x+tree.width+can.margin/8, y: y+tree.height*can.size/2},
                {x: x+tree.width+can.margin*2-2*can.margin/8, y: y+offset+item.height*can.size/2}
            ], style: {stroke: cli.CYAN}})

            can.onaction._draw_horizontal(can, item, x+tree.width+2*can.margin, y+offset)
            offset += item.height*can.size
        })
    },
})
Volcanos("ondetail", {help: "用户交互", list: [],
    onmouseenter: function(event, can, tree) { var y = tree.y+tree.height*can.size/2
        can.page.Remove(can, can.pos), can.pos = can.onimport.draw({}, can, {
            shape: svg.RECT, point: [
                {x: tree.x-can.margin/4, y: y-can.size/2},
                {x: tree.x+tree.width+can.margin/8, y: y+can.size/2},
            ], style: {stroke: cli.RED, fill: html.NONE},
        }), can.onkeypop.prevent(event)
    },
    onclick: function(event, can, tree) {
        if (tree.list.length > 0 || tree.tags || tree.name.endsWith(can._args.split)) {
            return tree.hide = !tree.hide, can.onaction[can.Action(ice.VIEW)](event, can)
        }

        for (var node = tree; node; node = node.last) {
            can.request(event, node.meta)
        }
        var msg = can.request(event, can.Option())
        can.run(event, can.base.Obj(can._args.prefix, []).concat([can.Option(mdb.NAME)||"", tree.file||"", tree.name]), function(msg) {
            if (msg.Length() == 0) {
                return can.ondetail.plugin(can, tree, {}, "web.code.inner", [can.dir_root, tree.file, tree.line], [ctx.ACTION, "inner"])
            }
            if (msg.Append(mdb.INDEX)) { msg.Table(function(value) {
                can.ondetail.plugin(can, tree, value, value.index, [], [ctx.ACTION, ice.RUN, value.index])
            }); return }

            tree.tags = true
            if (msg.Option("split")) {
                tree.list = can.onimport._tree(can, msg.Table(), msg.Option("field")||msg.append[0], msg.Option("split"))[""].list||[]
                can.core.List(tree.list, function(item) { item.last = tree })
            } else {
                msg.Table(function(item) { tree.list.push({
                    type: "tags", name: item.name||item.file||item[msg.append[0]],
                    meta: item, list: [], last: tree,
                    file: item.file, line: item.line, hide: true,
                }) })
            }
            tree.hide = !tree.hide, can.onaction[can.Action(ice.VIEW)](event, can)
        }, true)
    },

    plugin: function(can, tree, value, index, args, prefix) {
        for (var node = tree; node; node = node.last) {
            can.base.Copy(value, node.meta)
        }
        can.onappend.plugin(can, can.base.Copy(value, {type: chat.FLOAT, index: index, args: args}), function(sub) {
            sub.run = function(event, cmds, cb) { can.request(event, value, can.Option())
                can.run(event, can.misc.concat(can, prefix, cmds), cb, true)
            }, can.ondetail.figure(can, sub)
        })
    },
    figure: function(can, sub, msg, cb) {
        can.getActionSize(function(left, top, width, height) { left = left||0
            var top = 120, margin = 20; if (can.user.isMobile) { margin = 0
                top = can.user.isLandscape()? 24: 48
            }
            can.onmotion.move(can, sub._target, {position: html.FIXED, left: left+margin, top: top})
            can.page.style(can, sub._output, html.MAX_WIDTH, width-margin*2)
            sub.Conf(html.HEIGHT, height-top-2*html.ACTION_HEIGHT)
            can.base.isFunc(cb) && cb(msg)
        })
    },
})

