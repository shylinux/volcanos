Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can), can.onmotion.hidden(can, can._action)
        can.onimport._show(can, msg), can.base.isFunc(cb) && cb(msg)
        can.keylist = [], can.onkeypop._build(can)
    },
    _show: function(can, msg) { can.point = []
        can.svg = null, can.group = null, can.temp = null, can.current = null

        // 加载图形
        can.ui = can.onlayout.profile(can), can.onmotion.hidden(can, can.ui.project)
        can.page.Modify(can, can.ui.content, msg.Result()||can.onexport.content(can))
        can.page.Select(can, can.ui.content, html.SVG, function(svg) {
            can.svg = can.group = can.onimport._block(can, svg), can.onimport._group(can, svg).click()
            can.core.ItemCB(can.onaction, function(key, cb) { svg[key] = function(event) { cb(event, can) } })
            can.page.Select(can, svg, "*", function(item, index) { can.onimport._block(can, item)
                item.tagName == html.G && item.Value(html.CLASS) && can.onimport._group(can, item)
            })
        })
        // 默认参数
        can.core.Timer(10, function() {
            can.core.Item({
                "stroke-width": 2, stroke: cli.YELLOW, fill: cli.PURPLE,
                "font-size": 24, "font-family": html.MONOSPACE,
                go: ice.RUN, shape: "rect", grid: 10,
            }, function(key, value) { can.svg.Value(key, can.Action(key, can.svg.Value(key)||value)) })

            var pid = can.Option("pid")||can.svg.Value("pid"); can.onmotion.hidden(can, can.ui.profile, true)
            pid && can.page.Select(can, can.svg, ice.PT+pid, function(item) {
                can.ondetail.run({target: item}, can), can.onimport._profile(can, item)
            }) || can.onimport._profile(can, can.svg), can.onmotion.hidden(can, can.ui.profile)
            can.page.Modify(can, can.ui.display, {style: {"min-height": 80, "max-height": can.Conf("height")-can.svg.Val("height")-52}})
        }) 
    },
    _group: function(can, target) { var name = target.Groups()
        function show(event) { can.group = target
            can.core.List([html.STROKE_WIDTH, html.STROKE, html.FILL, html.FONT_SIZE], function(key) {
                can.Action(key, target.Value(key)||can.Action(key))
            })
        }
        return (name || target == can.svg) && can.onappend.item(can, html.ITEM, {name: name||html.SVG}, function(event) { show(event)
            can.onaction.show(event, can)
        }, function(event) {
            can.user.cartes(event, can, can.onaction, [ice.HIDE, ice.SHOW, mdb.CREATE, cli.CLEAR, mdb.REMOVE])
        }, can.ui.project)
    },
    _block: function(can, target) {
        target.oncontextmenu = function(event) {
            var carte = can.user.carte(event, can, can.ondetail, null, function(ev, button, meta) {
                meta[button](event, can, button)
            }); can.page.Modify(can, carte._target, {style: {left: event.clientX, top: event.clientY}})
        }
        target.Val = function(key, value) {
            return parseInt(target.Value(key, value == undefined? value: parseInt(value)||0))||0
        }
        target.Value = function(key, value) { if (typeof key == undefined) { return }
            if (can.base.isObject(key)) { can.core.Item(key, target.Value); return }

            var figure = can.onfigure._get(can, target)
            key = figure && figure.data && figure.data.size && figure.data.size[key] || key
            if (figure && figure.data && can.base.isFunc(figure.data[key])) {
                return figure.data[key](can, value, key, target)
            }

            if (key == html.INNER) {
                return value != undefined && (target.innerHTML = value), target.innerHTML
            }
            if (key == ice.SHIP) {
                return value != undefined && target.setAttribute(key, JSON.stringify(value)), can.base.Obj(target.getAttribute(key), [])
            }
            return value != undefined && target.setAttribute(key, value), target.getAttribute(key||html.CLASS)
                || target[key]&&target[key].baseVal&&target[key].baseVal.value || target[key]&&target[key].baseVal || ""
        }
        target.Group = function() { var item = target
            while (item) { if ([html.SVG, html.G].indexOf(item.tagName) > -1) { return item }; item = item.parentNode }
            return can.svg
        }
        target.Groups = function() { var item = target
            var list = []; while (item && item.tagName != html.SVG) {
                item.tagName == html.G && item.Value(html.CLASS) && list.push(item.Value(html.CLASS))
                item = item.parentNode
            }
            return list.reverse().join(ice.PT)
        }
        return target
    },
    _profile: function(can, target, list) { can.Option("pid", can.onfigure._pid(can, target))
        can.pid && can.page.Cache(can.pid, can.ui.profile, "some"), can.pid = target.Value("pid")
        var cache = can.page.Cache(can.pid, can.ui.profile); if (cache) { return }

        var action = can.page.Append(can, can.ui.profile, [{view: "action"}]).first
        can.onappend._action(can, can.ondetail.list, action, {_engine: function(event, can, button) {
            can.ondetail[button]({target: target}, can, button)
        }})

        var figure = can.onfigure._get(can, target)
        list = (list||[]).concat(figure.data.copy, [html.X, html.Y, kit.MDB_INDEX, kit.MDB_ARGS])
        can.page.Append(can, can.ui.profile, [{type: html.TABLE, className: "content", list: [
            {th: [kit.MDB_KEY, kit.MDB_VALUE]}, {td: [kit.MDB_TYPE, target.tagName]}, {td: ["pid", target.Value("pid")]},
        ].concat(can.core.List(list, function(key) {
            return key = figure.data.size[key]||key, {td: [key, target.Value(key)], ondblclick: function(event) {
                can.onmotion.modify(can, event.target, function(event, value, old) {
                    target.Value(key, value), can.onfigure._move(can, target)
                })
            }}
        })) }])

    },
    draw: function(event, can, value) {
        var figure = can.onfigure[value.shape]
        var data = figure.draw(event, can, value.point, value.style)
        can.core.Item(value.style, function(key, value) { data[key] = value })
        var item = can.onfigure._push(can, value.shape, data, can.group||can.svg)
        can.core.ItemCB(value, function(key, cb) { item[key] = cb })
        can.onimport._block(can, item), can.onfigure._pid(can, item)
        return value._init && value._init(item), item
    },
}, ["/plugin/local/wiki/draw.css"])
Volcanos("onfigure", {help: "图形绘制", list: [],
    _get: function(can, item, name) {
        return can.onfigure[name]||can.onfigure[item.getAttribute(kit.MDB_NAME)]||can.onfigure[item.tagName]
    },
    _pid: function(can, item) { if (item.Value("pid")) { return item.Value("pid") }
        var pid = "p"+can.svg.Val(kit.MDB_COUNT, can.svg.Val(kit.MDB_COUNT)+1)
        item.Value(html.CLASS, (item.Value(html.CLASS)+ice.SP+item.Value("pid", pid)).trim())
        return pid
    },
    _push: function(can, type, data, target) {
        var item = document.createElementNS("http://www.w3.org/2000/svg", type)
        target.appendChild(can.onimport._block(can, item)), item.Value(data)
        return item
    },
    _copy: function(event, can, target) {
        var data = {}, figure = can.onfigure._get(can, target), size = figure.data.size
        can.core.List(figure.data.copy, function(item) { data[item] = target.Value(item) })
        data[size.x||html.X] = target.Val(size.x||html.X)+10
        data[size.y||html.Y] = target.Val(size.y||html.Y)+10
        return can.onfigure._push(can, target.tagName, data, can.group||can.svg)
    },
    _move: function(can, target, list) {
        can.core.List(list||target.Value(ice.SHIP), function(ship) {
            ship.target = can.page.Select(can, can.svg, ice.PT+ship.pid)[0]
            var p = can.onexport.anchor(target, ship.anchor, {}) 
            if (ship.which == 1) {
                ship.target.Val("x1", p.x), ship.target.Val("y1", p.y)
            } else if (ship.which == 2) {
                ship.target.Val("x2", p.x), ship.target.Val("y2", p.y)
            }
        })
    },

    svg: { // <svg height="200" width="600" count="0" grid="10" stroke-width="2" stroke="yellow" fill="purple" font-size="24"/>
        data: {size: {}, copy: []},
        show: function(can, target, figure) { return can.onexport._size(can, target, figure) }
    },
    text: { // <text x="60" y="10">hi<text>
        data: {points: 1, size: {}, copy: [html.INNER]},
        draw: function(event, can, point, style) { if (point.length < 1 || event.type == "mousemove") { return }
            var p0 = point[0], text = style&&style.inner||can.user.prompt(kit.MDB_TEXT)
            return text? {x: p0.x, y: p0.y, inner: text}: null
        },
        show: function(can, target, figure) { return can.onexport._position(can, target, figure) }
    },
    circle: { // <circle r="20" cx="25" cy="75"/>
        data: {points: 2, size: {height: html.R, width: html.R, x: "cx", y: "cy"}, copy: [html.R]},
        draw: function(event, can, point) { if (point.length < 2) { return }
            var p0 = point[0], p1 = point[1]
            return {r: parseInt(Math.sqrt(Math.pow(p0.x-p1.x, 2)+Math.pow(p0.y-p1.y, 2))), cx: p0.x, cy: p0.y}
        },
    },
    ellipse: { // <ellipse ry="5" rx="20" cx="75" cy="75"/>
        data: {points: 2, size: {height: "ry", width: "rx", x: "cx", y: "cy"}, copy: ["ry", "rx"]},
        draw: function(event, can, point) { if (point.length < 2) { return }
            var p0 = point[0], p1 = point[1]
            return {ry: Math.abs(p0.y - p1.y), rx: Math.abs(p0.x - p1.x), cx: p0.x, cy: p0.y}
        },
    },
    rect: { // <rect height="30" width="30" ry="10" rx="10" x="60" y="10"/>
        data: {points: 2, ry: 4, rx: 4, size: {}, copy: [chat.HEIGHT, chat.WIDTH, "ry", "rx"]},
        draw: function(event, can, point) { if (point.length < 2) { return }
            var p0 = point[0], p1 = point[1]
            return {
                height: Math.abs(p0.y-p1.y), width: Math.abs(p0.x-p1.x), ry: this.data.ry, rx: this.data.rx,
                x: p0.x > p1.x? p1.x: p0.x, y: p0.y > p1.y? p1.y: p0.y,
            }
        },
        text: function(can, data, target) { return data.x = target.Val(html.X)+target.Val(chat.WIDTH)/2, data.y = target.Val(html.Y)+target.Val(chat.HEIGHT)/2, data },
    },
    block: { // <rect height="30" width="30" ry="10" rx="10" x="60" y="10"/>
        data: {points: 2, ry: 4, rx: 4, size: {}, copy: [chat.HEIGHT, chat.WIDTH, "ry", "rx"]},
        draw: function(event, can, point) { if (point.length < 2) { return }
            this._temp && can.page.Remove(can, this._temp) && delete(this._temp)
            this._temp = can.onfigure._push(can, html.G, {}, can.group||can.svg)

            var rect = can.onfigure._push(can, "rect", can.onfigure.rect.draw(event, can, point), this._temp)
            if (event.type == html.CLICK) {
                can.onfigure._pid(can, rect), delete(this._temp)
            }
        },
        text: function(can, data, target) { can.onfigure.rect.text(can, data, target) },
    },
    line: { // <line x1="10" y1="50" x2="110" y2="150" xx="100" yy="100"/>
        data: {points: 2, size: {x: "x1", y: "y1"}, copy: ["x1", "y1", "x2", "y2"]},
        grid: function(event, can, point) { var target = event.target
            if (target == can.svg) { return }
            var p = point[point.length-1], pos = can.onexport.cursor(event, can, target)
            target.Val && can.onexport.anchor(target, pos, p)
            return p.target = target, p.anchor = pos, point
        },
        draw: function(event, can, point) { if (point.length < 2) { return }
            var p0 = point[0], p1 = point[1], ship = []
            p0.target && p0.target.Value && ship.push({pid: p0.target.Value("pid")})
            p1.target && p1.target.Value && ship.push({pid: p1.target.Value("pid")})
            return {x1: p0.x, y1: p0.y, x2: p1.x, y2: p1.y, ship: ship}
        },
        text: function(can, target, data) { return data.x = (target.Val("x1")+target.Val("x2"))/2, data.y = (target.Val("y1")+target.Val("y2"))/2, data },
        show: function(can, target, figure) { return "<("+(target.Val("y2")-target.Val("y1"))+ice.FS+(target.Val("x2")-target.Val("x1"))+")"+can.onexport._position(can, target, figure) },
    },
}, [])
Volcanos("onkeypop", {help: "键盘交互", list: [],
    _mode: {
        normal: {
            gr: function(event, can) { can.Action("go", "run") },
            ga: function(event, can) { can.Action("go", "auto") },
            gm: function(event, can) { can.Action("go", "manual") },

            ad: function(event, can) { can.Action("mode", "draw") },
            ar: function(event, can) { can.Action("mode", "resize") },

            st: function(event, can) { can.Action("shape", "text") },
            sr: function(event, can) { can.Action("shape", "rect") },
            sl: function(event, can) { can.Action("shape", "line") },
            sc: function(event, can) { can.Action("shape", "circle") },
            se: function(event, can) { can.Action("shape", "ellipse") },

            cr: function(event, can) { can.onaction._change(can, "stroke", "red") },
            cb: function(event, can) { can.onaction._change(can, "stroke", "blue") },
            cg: function(event, can) { can.onaction._change(can, "stroke", "green") },
            cy: function(event, can) { can.onaction._change(can, "stroke", "yellow") },
            cp: function(event, can) { can.onaction._change(can, "stroke", "purple") },
            cc: function(event, can) { can.onaction._change(can, "stroke", "cyan") },
            ch: function(event, can) { can.onaction._change(can, "stroke", "black") },
            cw: function(event, can) { can.onaction._change(can, "stroke", "white") },

            fr: function(event, can) { can.onaction._change(can, "fill", "red") },
            fb: function(event, can) { can.onaction._change(can, "fill", "blue") },
            fg: function(event, can) { can.onaction._change(can, "fill", "green") },
            fy: function(event, can) { can.onaction._change(can, "fill", "yellow") },
            fp: function(event, can) { can.onaction._change(can, "fill", "purple") },
            fc: function(event, can) { can.onaction._change(can, "fill", "cyan") },
            fh: function(event, can) { can.onaction._change(can, "fill", "black") },
            fw: function(event, can) { can.onaction._change(can, "fill", "white") },
        },
    }, _engine: {},
})
Volcanos("onaction", {help: "组件菜单", list: [
        ["stroke-width", 1, 2, 3, 4, 5],
        ["stroke", cli.RED, cli.YELLOW, cli.GREEN, cli.CYAN, cli.BLUE, cli.PURPLE, cli.BLACK, cli.WHITE],
        ["fill", cli.RED, cli.YELLOW, cli.GREEN, cli.CYAN, cli.BLUE, cli.PURPLE, cli.BLACK, cli.WHITE, "#0000"],
        ["font-size", 12, 16, 18, 24, 32],

        ["go", ice.RUN, ice.AUTO, "manual"],
        ["mode", "draw", "resize"],
        ["shape", "text", "circle", "ellipse", "rect", "block", "line"],
        ["grid", 1, 2, 3, 4, 5, 10, 20],
    ],
    _change: function(can, key, value) { can.Action(key, value), can.group.Value(key, value) },
    "stroke-width": function(event, can, key, value) { can.onaction._change(can, key, value) },
    stroke: function(event, can, key, value) { can.onaction._change(can, key, value) },
    fill: function(event, can, key, value) { can.onaction._change(can, key, value) },
    "font-size": function(event, can, key, value) { can.onaction._change(can, key, value) },

    go: function(event, can, key, value) { can.Action(key, value) },
    mode: function(event, can, key, value) { can.Action(key, value) },
    shape: function(event, can, key, value) { can.Action(key, value) },

    edit: function(event, can) { can.Action("go", can.Action("go") == ice.RUN? ice.AUTO: ice.RUN) },
    save: function(event, can, button) {
        var msg = can.request(event, {content: can.onexport.content(can, can.svg)})
        can.run(event, [ctx.ACTION, button, can.Option(nfs.PATH)], function(msg) {
            can.user.toast(can, ice.SUCCESS, button)
        }, true)
    },

    project: function(event, can) { can.onmotion.toggle(can, can.ui.project) },
    profile: function(event, can) { can.onmotion.toggle(can, can.ui.profile) },
    show: function(event, can) { can.onmotion.show(can, {interval: 100, length: 10}, null, can.group) },
    hide: function(event, can) { can.onmotion.hide(can, {interval: 100, length: 10}, null, can.group) },
    create: function(event, can) {
        can.user.prompt("group", function(name) {
            var group = document.createElementNS('http://www.w3.org/2000/svg', html.G)
            can.group.append(group), can.onimport._block(can, group)
            group.Value(html.CLASS, name), can.core.List([html.STROKE_WIDTH, html.STROKE, html.FILL, html.FONT_SIZE], function(name) {
                group.Value(name, can.Action(name))
            }), can.onimport._group(can, group).click()
        })
    },
    remove: function(event, can) { if (can.group == can.svg) { return }
        can.page.Remove(can, can.group)
    },
    clear: function(event, can) {
        can.onmotion.clear(can, can.group), can.point = [], delete(can.temp)
    },

    _mode: {
        draw: function(event, can, point) {
            var shape = can.Action("shape")
            var figure = can.onfigure[shape]
            figure.grid && figure.grid(event, can, point)

            var data = figure.draw && figure.draw(event, can, point)
            var item = data && can.onfigure._push(can, figure.data.name||shape, data, can.group||can.svg)
            event.type == html.CLICK && point.length === figure.data.points && (can.point = []) 

            if (event.type == html.CLICK && item) {
                var pid = can.onfigure._pid(can, item); can.core.List(point, function(p, i) { if (!p.target) { return }
                    p.target.Value(ice.SHIP, p.target.Value(ice.SHIP).concat([{pid: pid, which: i+1, anchor: p.anchor}]))
                })
            }
            return item
        },
        resize: function(event, can, point, target) { target = target||event.target
            if (event.type == html.CLICK) {
                if (point.length == 1) {
                    can.current = {target: target, begin: can.core.List([target], function(item) { if (item.tagName == html.G) { return }
                        return {
                            height: item.Val(chat.HEIGHT), width: item.Val(chat.WIDTH), x: item.Val(html.X), y: item.Val(html.Y),
                            target: item, ship: can.core.List(item.Value(ice.SHIP), function(ship) {
                                return ship.pid && (ship.target = can.page.Select(can, can.svg, ice.PT+ship.pid)[0]) && ship
                            })
                        }
                    }), pos: can.onexport.cursor(event, can, target)}
                    return
                }
                return can.point = [], delete(can.current)
            }

            can.current && can.core.List(can.current.begin, function(item) { var figure = can.onfigure._get(can, item.target)
                can.onexport.resize(event, item.target, item, point[0], point[1], can.current.pos)
                can.page.Select(can, can.svg, ice.PT+item.target.Value(kit.MDB_TEXT), function(text) {
                    text.Value(can.onexport._text(can, item.target, figure, {}))
                })
                can.onfigure._move(can, item.target, item.ship)
            })
        },
        run: function(event, can) {
            can.onimport._profile(can, event.target)
        },
    },
    _auto: function(can, target) {
        if (can.point.length > 0) { return }
        if (target.tagName == kit.MDB_TEXT) { return }

        var pos = can.onexport.cursor(event, can, event.target)
        if (target == can.svg) {
            if (pos == 5) {
                can.Action(ice.MODE, "draw"), can.Action("shape", html.BLOCK)
                can.page.Modify(can, target, {style: {cursor: "crosshair"}})
            } else {
                can.Action(ice.MODE, "resize")
            }
        } else {
            switch (pos) {
                case 5:
                case 9: can.Action(ice.MODE, "resize"); break
                default: can.Action(ice.MODE, "draw"), can.Action("shape", "line")
            }
        }
    },
    _figure: function(event, can, points, target) {
        can.temp && can.page.Remove(can, can.temp) && delete(can.temp)
        can.temp = can.core.CallFunc([can.onaction._mode, can.Action(ice.MODE)], [event, can, points, target])
        can.point.length == 0 && delete(can.temp)
    },

    onmouseover: function(event, can) { can.onexport._show(can, event.target) },
    onmousemove: function(event, can) { var point = can.onexport._point(event, can)
        if (can.Action("go") == ice.RUN) { return }
        can.onexport.cursor(event, can, event.target)
        if (can.Action("go") == ice.AUTO) { can.onaction._auto(can, event.target) }
        can.onaction._figure(event, can, can.point.concat(point))
    },
    onclick: function(event, can) { var point = can.onexport._point(event, can)
        if (can.Action("go") == ice.RUN) { can.onimport._profile(can, event.target)
            return event.shiftKey? can.onaction._mode.run(event, can): can.ondetail.run(event, can)
        }
        can.onaction._figure(event, can, can.point = can.point.concat(point))
    },
    ondblclick: function(event, can) {
        can.ondetail.label(event, can)
    },
})
Volcanos("ondetail", {help: "组件详情", list: [cli.START, ice.RUN, ice.COPY, html.LABEL, mdb.MODIFY, mdb.DELETE],
    start: function(event, can) { var target = event.target
        var list = [target], dict = {}
        for (var i = 0; i < list.length; i++) { var ship = list[i].Value("ship")
            for (var j = 0; j < ship.length; j++) { var pid = ship[j].pid
                can.page.Select(can, can.svg, ice.PT+pid, function(item) {
                    var pid = item.Value("ship")[1].pid
                    can.page.Select(can, can.svg, ice.PT+pid, function(item) {
                        !dict[pid] && list.push(item), dict[pid] = true
                    })
                })
            }
        }
        can.core.Next(list, function(item, next) { can.core.Timer(3000, function() {
            can.onmotion.show(can, {interval: 300, length: 10}, null, item) 
            can.user.toast(can, item.Value("index"))
            can.ondetail.run({target: item}, can), next()
        }) })
    },
    run: function(event, can) { var target = event.target
        if (!target.Value("pid")) { can.onfigure._pid(can, target) }
        can._pid && can.page.Cache(can._pid, can.ui.display, "some"), can._pid = target.Value("pid")
        var cache = can.page.Cache(can._pid, can.ui.display); if (cache) { return }

        can.onmotion.clear(can, can.ui.display), can.svg.Value("pid", target.Value("pid"))
        var index = target.Value(kit.MDB_INDEX); index && can.onappend.plugin(can, {type: chat.STORY, index: index, args: target.Value(kit.MDB_ARGS)}, function(sub) {
            sub.Conf("height", can.Conf("height")-can.svg.Val("height")-52), sub.Conf("width", can.Conf("width"))
            sub.run = function(event, cmds, cb) { can.run(event, can.misc.Concat([ice.RUN, index], cmds), cb, true) }
            can.onmotion.hidden(can, sub._legend), can.onmotion.hidden(can, can.ui.display, true)
        }, can.ui.display)
    },
    copy: function(event, can) { can.onfigure._copy(event, can, event.target) },
    label: function(event, can) { var target = event.target
        var def = target.Value(kit.MDB_TEXT); def && can.page.Select(can, can.svg, ice.PT+def, function(item) {
            def = item.Value(html.INNER)
        })
        can.user.prompt(html.LABEL, function(text) {
            if (target.tagName == html.TEXT) { return target.innerHTML = text }

            if (def && can.page.Select(can, can.svg, ice.PT+def, function(item) {
                item.Value(html.INNER, text)
            }).length > 0) {
                return
            }

            var figure = can.onfigure._get(can, target)
            var data = can.onexport._text(can, target, figure, {inner: text})
            var item = can.onfigure._push(can, html.TEXT, data, target.Group())
            target.Value(kit.MDB_TEXT, can.onfigure._pid(can, item))
        }, def)
    },
    modify: function(event, can) { can.onimport._profile(can, event.target) },
    "delete": function(event, can) { var target = event.target
        if (target == can.svg) { return }
        can.core.List(target.Value(ice.SHIP), function(value) {
            can.page.Select(can, can.svg, ice.PT+value.pid, function(item) {
                can.page.Remove(can, item)
            })
        })
        target.Value(kit.MDB_TEXT) && can.page.Select(can, can.svg, ice.PT+target.Value(kit.MDB_TEXT), function(item) {
            can.page.Remove(can, item)
        })
        can.page.Remove(can, target)
    },
})
Volcanos("onexport", {help: "导出数据", list: ["group", "figure", "index", "pos"],
    _show: function(can, target) { var figure = can.onfigure._get(can, target)
        function show() { return can.onexport._size(can, target, figure)+ice.SP+can.onexport._position(can, target, figure) }
        can.Status("figure", target.tagName+":"+target.Value("pid")+ice.SP+(figure? (figure.show||show)(can, target, figure): ""))
        can.Status("group", target.Groups()||can.group.Groups()||html.SVG)
        can.Status("index", target.Value("index"))
    },
    _size: function(can, target, figure) { var size = figure.data.size||{}
        return "<("+target.Val(size[chat.HEIGHT]||chat.HEIGHT)+ice.FS+target.Val(size[chat.WIDTH]||chat.WIDTH)+")"
    },
    _position: function(can, target, figure) { var size = figure.data.size||{}
        return "@("+target.Val(size[html.X]||html.X)+ice.FS+target.Val(size[html.Y]||html.Y)+")"
    },
    _text: function(can, target, figure, data) { var size = figure.data.size||{}
        if (figure.text) { return figure.text(can, data, target) }
        return data.x = target.Val(size[html.X]||html.X), data.y = target.Val(size[html.Y]||html.Y), data
    },
    _point: function(event, can) {
        var p = can.svg.getBoundingClientRect()
        var point = {x: event.clientX-p.x, y: event.clientY-p.y}
        point.x = point.x - point.x % parseInt(can.Action("grid"))
        point.y = point.y - point.y % parseInt(can.Action("grid"))
        return can.Status("pos", point.x+ice.FS+point.y), point
    },

    content: function(can, svg) {
        return ['<svg vertion="1.1" xmlns="https://www.w3.org/2000/svg" text-anchor="middle" dominant-baseline="middle"'].concat(
            svg? can.core.List([chat.HEIGHT, chat.WIDTH, kit.MDB_COUNT, "pid", "grid", html.STROKE_WIDTH, html.STROKE, html.FILL, html.FONT_SIZE], function(item) {
                return svg.Value(item)? ice.SP + item + '="' + svg.Value(item) + '"': ""
            }): [" height="+((can.Conf(chat.HEIGHT)||450)-50)+" width="+(can.Conf(chat.WIDTH)||600)]).concat(['>', svg? svg.innerHTML: "", "</svg>"]).join("")
    },
    cursor: function(event, can, item, show) {
        var p = item.getBoundingClientRect()
        var q = {x: event.clientX, y: event.clientY}

        var pos = 5, margin = 20
        var y = (q.y-p.y)/p.height
        if (y < 0.2 && q.y-p.y < margin) {
            pos -= 3
        } else if (y > 0.8 && q.y-p.y-p.height > -margin) {
            pos += 3
        }
        var x = (q.x-p.x)/p.width
        if (x < 0.2 && q.x-p.x < margin) {
            pos -= 1
        } else if (x > 0.8 && q.x-p.x- p.width > -margin) {
            pos += 1
        }

        return (show||can.svg).style.cursor = [
            "nw-resize", "n-resize", "ne-resize",
            "w-resize", "move", "e-resize",
            "sw-resize", "s-resize", "se-resize",
        ][pos-1], pos
    },
    anchor: function(target, pos, point) {
        switch (pos) {
            case 1:
            case 2:
            case 3:
                point.y = target.Val(html.Y)
                break
            case 4:
            case 5:
            case 6:
                point.y = target.Val(html.Y) + target.Val(chat.HEIGHT) / 2
                break
            case 7:
            case 8:
            case 9:
                point.y = target.Val(html.Y) + target.Val(chat.HEIGHT)
                break
        }

        switch (pos) {
            case 1:
            case 4:
            case 7:
                point.x = target.Val(html.X)
                break
            case 2:
            case 5:
            case 8:
                point.x = target.Val(html.X) + target.Val(chat.WIDTH) / 2
                break
            case 3:
            case 6:
            case 9:
                point.x = target.Val(html.X) + target.Val(chat.WIDTH)
                break
        }
        return point
    },
    resize: function(event, item, begin, p0, p1, pos) {
        switch (pos) {
            case 5:
                item.Value(html.X, begin.x + p1.x - p0.x)
                item.Value(html.Y, begin.y + p1.y - p0.y)
                return
        }

        switch (pos) {
            case 1:
            case 2:
            case 3:
                item.Value(html.Y, begin.y + p1.y - p0.y)
                item.Value(chat.HEIGHT, begin.height - p1.y + p0.y)
                break
        }
        switch (pos) {
            case 1:
            case 4:
            case 7:
                item.Value(html.X, begin.x + p1.x - p0.x)
                item.Value(chat.WIDTH, begin.width - p1.x + p0.x)
                break
        }
        switch (pos) {
            case 3:
            case 6:
            case 9:
                item.Value(chat.WIDTH, begin.width + p1.x - p0.x)
                break
        }
        switch (pos) {
            case 7:
            case 8:
            case 9:
                item.Value(chat.HEIGHT, begin.height + p1.y - p0.y)
                break
        }
    },
})

