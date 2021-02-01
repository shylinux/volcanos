Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can)
        can.ui = can.onlayout.profile(can)
        typeof cb == "function" && cb(msg)
        can.onmotion.hidden(can, can._action)

        // 交互数据
        can.svg = null, can.group = null
        can.last = null, can.temp = null
        can.point = [], can.current = null

        // 加载绘图
        can.page.Modify(can, can.ui.content, msg.Result()||can.onexport.content(can))
        can.page.Select(can, can.ui.content, "svg", function(svg) {
            can.page.Select(can, svg, "*", function(item, index) {
                item.tagName == "g"? can.onimport._group(can, item): can.onimport._block(can, item)
            })
            can.core.Item(can.onimport, function(key, value) {
                key.indexOf("on") == 0 && (svg[key] = function(event) { value(event, can) })
            })
            can.svg = can.group = svg, can.onimport._group(can, svg).click()
        })

        // 默认参数
        can.core.Timer(10, function() { can.core.Item({
            "stroke-width": 2, "stroke": "yellow", "fill": "purple", "font-size": "24", 
            "shape": "rect", "grid": "10", "go": "run",
        }, function(key, value) { can.svg.Value(key, can.Action(key, can.svg.Value(key)||value)) }) }) 
    },
    _group: function(can, target) { can.onimport._block(can, target)
        function show(event) { can.group = target, can.ondetail["显示"](event, can)
            can.core.List(["stroke-width", "stroke", "fill", "font-size"], function(key) {
                can.Action(key, target.Value(key)||can.Action(key))
            })
        }
        return can.onappend.item(can, "item", {name: target.Groups()}, show, function(event) { show(event)
            can.user.carte(event, can, can.ondetail, ["隐藏", "显示", "添加", "删除", "清空"])
        }, can.ui.project)
    },
    _block: function(can, target) {
        target.Val = function(key, value) {
            return parseInt(target.Value(key, value == undefined? value: parseInt(value)||0)) || 0
        }
        target.Value = function(key, value) { if (typeof key == undefined) { return }
            if (typeof key == "object") { can.core.Item(key, target.Value); return }

            var figure = can.onfigure._get(can, target)
            key = figure && figure.data && figure.data.size && figure.data.size[key] || key
            if (figure && figure.data && typeof figure.data[key] == "function") {
                return figure.data[key](can, value, key, target)
            }

            if (key == "inner") {
                return value != undefined && (target.innerHTML = value), target.innerHTML
            }
            if (key == "ship") {
                return value != undefined && target.setAttribute(key, JSON.stringify(value)), can.base.Obj(target.getAttribute(key), [])
            }
            return value != undefined && target.setAttribute(key, value), target.getAttribute(key||"class")
                || target[key]&&target[key].baseVal&&target[key].baseVal.value
                || target[key]&&target[key].baseVal || ""
        }
        target.Group = function() { var item = target
            while (item) { if (["svg", "g"].indexOf(item.tagName) > -1) { return item }; item = item.parentNode }
            return can.svg
        }
        target.Groups = function() { var item = target
            var list = []; while (item && item.tagName != "svg") {
                item.tagName == "g" && item.Value("class") && list.push(item.Value("class"))
                item = item.parentNode
            }
            return list.reverse().join(".")
        }
        return target
    },
    _point: function(event, can) {
        var p = can.svg.getBoundingClientRect()
        var point = {x: event.clientX-p.x, y: event.clientY-p.y}
        point.x = point.x - point.x % parseInt(can.Action("grid"))
        point.y = point.y - point.y % parseInt(can.Action("grid"))
        return can.Status("坐标", point.x+","+point.y), point
    },
    _figure: function(event, can, points, target) {
        can.temp && can.page.Remove(can, can.temp) && delete(can.temp)
        can.temp = can.onaction._mode[can.Action("mode")](event, can, points, target)
        can.point.length == 0 && delete(can.temp)
    },
    draw: function(event, can, value) {
        var figure = can.onfigure[value.shape]
        var data = figure.draw(event, can, value.point, value.style)
        can.core.Item(value.style, function(key, value) { data[key] = value })
        return can.onfigure._push(can, data, value.shape, can.group||can.svg)
    },

    ondblclick: function(event, can) {
        if (can.Action("go") == "run") { return }
        can.ondetail["标签"](event, can)
    },
    onclick: function(event, can) { var point = can.onimport._point(event, can)
        if (can.Action("go") == "run") { return can.onaction._mode.run(event, can) }
        can.onimport._figure(event, can, can.point = can.point.concat(point), event.target)
    },
    onmousemove: function(event, can) { var point = can.onimport._point(event, can)
        if (can.Action("go") == "run") { return can.page.Modify(can, event.target, {style: {cursor: ""}}) }
        if (can.Action("go") == "auto") { can.onaction._auto(can, event.target) }
        can.onimport._figure(event, can, can.point.concat(point))
    },
    onmouseover: function(event, can) { can.onexport._show(can, event.target) },
    oncontextmenu: function(event, can) { can.onexport._show(can, event.target) },
}, ["/plugin/local/wiki/draw.css"])
Volcanos("onfigure", {help: "图形绘制", list: [],
    _get: function(can, item, name) {
        return can.onfigure[name]||can.onfigure[item.getAttribute("name")]||can.onfigure[item.tagName]
    },
    _ship: function(can, target, value) {
        return target.Value("ship", target.Value("ship").concat([value]))
    },
    _push: function(can, data, cmd, target) {
        var rect = document.createElementNS("http://www.w3.org/2000/svg", cmd)
        target.appendChild(can.onimport._block(can, rect))
        rect.Value(data); if (can.point.length == 0) {
            var pid = "p"+can.svg.Val("count", can.svg.Val("count")+1)
            rect.Value("class", (rect.Value("class") + " " + rect.Value("pid", pid)).trim())
        }
        return can.last = rect
    },
    _copy: function(event, can, target) {
        var figure = can.onfigure._get(can, target).data

        var data = {}
        can.core.List(figure.copy, function(item) { data[item] = target.Value(item) })
        data[figure.size.x||"x"] = target.Val(figure.size.x||"x")+10
        data[figure.size.y||"y"] = target.Val(figure.size.y||"y")+10

        var p = data && can.onfigure._push(can, data, target.tagName, can.group||can.svg)
        can.page.Select(can, can.svg, "."+target.Value("text"), function(item) {
            can.ondetail["标签"](event, can, {silent: true, def: item.Value("inner")}, "", p)
        })
        return p
    },

    svg: { // <svg width="600" height="200" count="0" grid="10" stroke-width="2" stroke="yellow" fill="purple" font-size="24"/>
        data: {size: {}, copy: []},
        show: function(can, target) { return target.Val("width") +","+ target.Val("height") },
    },
    text: { // <text x="60" y="10">hi<text>
        data: {size: {x: "x", y: "y"}, copy: ["inner"]},
        draw: function(event, can, point, style) { if (point.length < 1 || event.type == "mousemove") { return }
            var p0 = point[0]; var data = {"x": p0.x, "y": p0.y, "inner": style&&style.inner || can.user.prompt("text")}
            return can.point = [], data
        },
        show: function(can, target) { return ": (" + target.Val("x") + "," + target.Val("y")+ ")" }
    },
    rect: { // <rect rx="10" ry="10" x="60" y="10" width="30" height="30"/>
        data: {rx: 4, ry: 4, size: {x: "x", y: "y"}, copy: ["width", "height", "rx", "ry"]},
        draw: function(event, can, point) { if (point.length < 2) { return }
            var p0 = point[0], p1 = point[1]; var data = {
                "rx": this.data.rx, "ry": this.data.ry,
                "x": p0.x > p1.x? p1.x: p0.x, "y": p0.y > p1.y? p1.y: p0.y,
                "width": Math.abs(p0.x-p1.x), "height": Math.abs(p0.y-p1.y),
            }
            return event.type == "click" && point.length == 2 && (can.point = []), data
        },
        text: function(can, data, target) {
            data.x = target.Val("x")+target.Val("width")/2
            data.y = target.Val("y")+target.Val("height")/2
            return data
        },
        show: function(can, target) {
            return ": (" + target.Val("x") + "," + target.Val("y") + ")"
                + " + (" + target.Val("width") + "," + target.Val("height") + ")"
        },
    },
    line: { // <line x1="10" y1="50" x2="110" y2="150" xx="100" yy="100"/>
        data: {size: {}, copy: ["x1", "y1", "x2", "y2"],
            x: function(can, value, cmd, target) {
                if (value != undefined) {
                    var offset = value - target.Val("xx")
                    target.Val("x1", target.Val("x1") + offset)
                    target.Val("x2", target.Val("x2") + offset)
                    target.Val("xx", value)
                }
                return target.Val("xx")
            },
            y: function(can, value, cmd, target) {
                if (value != undefined) {
                    var offset = value - target.Val("yy")
                    target.Val("y1", target.Val("y1") + offset)
                    target.Val("y2", target.Val("y2") + offset)
                    target.Val("yy", value)
                }
                return target.Val("yy")
            },
            width: function(can, value, cmd, target) {
                return value != undefined && target.Val("x2", target.Val("x1") + parseInt(value)), target.Val("x2") - target.Val("x1")
            },
            height: function(can, value, cmd, target) {
                return value != undefined && target.Val("y2", target.Val("y1") + parseInt(value)), target.Val("y2") - target.Val("y1")
            },
        },
        grid: function(event, can, point) { var target = event.target
            if (target == can.svg) { return }
            var p = point[point.length-1], pos = can.page.Prepos(event, target)
            target.Val && can.page.Anchor(event, target, pos, p)
            return p.target = target, p.anchor = pos, point
        },
        draw: function(event, can, point) { if (point.length < 2) { return }
            var p0 = point[0], p1 = point[1]; var data = {"x1": p0.x, "y1": p0.y, "x2": p1.x, "y2": p1.y}
            return event.type == "click" && point.length == 2 && (can.point = []), data
        },
        text: function(can, target, data) {
            data.x = (target.Val("x1") + target.Val("x2")) / 2
            data.y = (target.Val("y1") + target.Val("y2")) / 2
            return data
        },
        show: function(can, target) {
            return ": (" + target.Val("x1") + "," + target.Val("y1") + ")"
                + " - (" + target.Val("x2") + "," + target.Val("y2") + ")"
        },
    },
    circle: { // <circle cx="25" cy="75" r="20"/>
        data: {size: {x: "cx", y: "cy", width: "r", height: "r"}, copy: ["r"]},
        draw: function(event, can, point) { if (point.length < 2) { return }
            var p0 = point[0], p1 = point[1]; var data = {"cx": p0.x, "cy": p0.y, "r": Math.sqrt(Math.pow(p0.x-p1.x, 2)+Math.pow(p0.y-p1.y, 2))}
            return event.type == "click" && point.length == 2 && (can.point = []), data
        },
        text: function(can, target, data) { return data.x = target.Val("cx"), data.y = target.Val("cy"), data },
        show: function(can, target) { return ": (" + target.Val("cx") + "," + target.Val("cy") + ")" + " > (" + parseInt(target.Val("r")) + ")" },
    },
    ellipse: { // <ellipse cx="75" cy="75" rx="20" ry="5"/>
        data: {size: {x: "cx", y: "cy", width: "rx", height: "ry"}, copy: ["rx", "ry"]},
        draw: function(event, can, point) { if (point.length < 2) { return }
            var p0 = point[0], p1 = point[1]; var data = {"cx": p0.x, "cy": p0.y, "rx": Math.abs(p0.x - p1.x), "ry": Math.abs(p0.y - p1.y)}
            return event.type == "click" && point.length == 2 && (can.point = []), data
        },
        text: function(can, target, data) { return data.x = target.Val("cx"), data.y = target.Val("cy"), data },
        show: function(can, target) { return ": (" + target.Val("cx") + "," + target.Val("cy") + ")" + " > (" + target.Val("rx") + "," + target.Val("ry") + ")" },
    },

    block: { // <rect rx="10" ry="10" x="60" y="10" width="30" height="30"/>
        data: {rx: 4, ry: 4, size: {x: "x", y: "y"}, copy: ["width", "height", "rx", "ry"]},
        draw: function(event, can, point) { if (point.length < 2) { return }
            this._temp && can.page.Remove(can, this._temp) && delete(this._temp)
            this._temp = can.onfigure._push(can, {}, "g", can.group||can.svg)

            var rect = can.onfigure._push(can, can.onfigure.rect.draw(event, can, point), "rect", this._temp)
            if (event.type != "click" && point.length != 2) { return }
            delete(this._temp)
        },
        text: function(can, target, data) {
            data.x = target.Val("x")+target.Val("width")/2
            data.y = target.Val("y")+target.Val("height")/2
            return data
        },
        show: function(can, target) {
            return ": (" + target.Val("x") + "," + target.Val("y") + ")"
                + " + (" + target.Val("width") + "," + target.Val("height") + ")"
        },
    },
}, [])
Volcanos("onaction", {help: "组件菜单", list: [
        ["stroke-width", 1, 2, 3, 4, 5],
        ["stroke", "red", "yellow", "green", "purple", "blue", "cyan", "white", "black"],
        ["fill", "red", "yellow", "green", "purple", "blue", "cyan", "white", "black", "#0000"],
        ["font-size", 12, 16, 18, 24, 32],

        ["shape", "text", "rect", "line", "circle", "ellipse", "block"],
        ["mode", "translate", "draw", "resize", "delete"],
        ["grid", 1, 2, 3, 4, 5, 10, 20],
        ["go", "run", "auto", "manual"],
    ],
    "编辑": function(event, can, key) { can.Action("go", "auto") },
    "save": function(event, can, key) {
        var msg = can.request(event, {content: can.onexport.content(can, can.svg)})
        can.run(event, ["action", "save", can.Option("path"), can.Option("file")], function(msg) {
            can.user.toast(can, "保存成功")
        }, true)
    },
    "项目": function(event, can) { can.page.Toggle(can, can.ui.project) },

    "font-size": function(event, can, key, value) { can.Action(key, value), can.group.Value(key, value) },
    "stroke-width": function(event, can, key, value) { can.Action(key, value), can.group.Value(key, value) },
    stroke: function(event, can, key, value) { can.Action(key, value), can.group.Value(key, value) },
    fill: function(event, can, key, value) { can.Action(key, value), can.group.Value(key, value) },

    shape: function(event, can, key, value) { can.Action(key, value) },
    mode: function(event, can, key, value) { can.Action(key, value) },
    go: function(event, can, key, value) { can.Action(key, value) },

    _auto: function(can, target) {
        if (can.point.length > 0) { return }
        var pos = can.page.Prepos(event, event.target)
        if (target.tagName == "text") {

        } else if (target == can.svg) {
            if (pos == 5) {
                can.Action("mode", "draw")
                can.Action("shape", "rect")
                can.page.Modify(can, can.svg, {style: {cursor: "crosshair"}})
            } else {
                can.Action("mode", "resize")
            }
        } else {
            switch (pos) {
                case 5:
                case 9:
                    can.Action("mode", "resize")
                    break
                default:
                    can.Action("mode", "draw")
                    can.Action("shape", "line")
            }
        }
    },
    _mode: {
        run: function(event, can) { var target = event.target
            event.type == "click" && target.Value("type") && can.run(event, ["action", "run", target.Value("zone"), target.Value("type"), target.Value("name"), target.Value("text")], function(msg) {
                can.onappend.table(can, msg, function() {}, can.ui.display)
                can.onappend.board(can, msg.Result(), can.ui.display)
            }, true)
        },
        translate: function(event, can, point) {
            if (event.type == "click") {
                if (point.length == 1) {
                    var target = can.group
                    can._temp = {
                        x: target.Val("translate_x"),
                        y: target.Val("translate_y"),
                        target: target,
                    }
                    return
                }

                var target = can._temp.target
                var x = target.Val("translate_x") + point[1].x - point[0].x
                var y = target.Val("translate_y") + point[1].y - point[0].y
                target.Value("transform", "translate("+x+","+y+") scale(1)")
                target.Value("translate_x", x)
                target.Value("translate_y", y)
                console.log(x, y)
                can.point = []
                return
            }

            if (point.length > 1) {
                var shape = "line"
                var figure = can.onfigure[shape]
                var data = figure.draw && figure.draw(event, can, point)
                var obj = data && can.onfigure._push(can, data, figure.data.name||shape, can.group||can.svg)
                return obj
            }
        },
        draw: function(event, can, point) {
            var shape = can.Action("shape")
            var figure = can.onfigure[shape]
            figure.grid && figure.grid(event, can, point)

            var data = figure.draw && figure.draw(event, can, point)
            var obj = data && can.onfigure._push(can, data, figure.data.name||shape, can.group||can.svg)

            event.type == "click" && obj && can.core.List(point, function(item, index) {
                item.target && can.onfigure._ship(can, item.target, {pid: obj.Value("pid"), which: index, anchor: item.anchor})
            })
            return obj
        },
        resize: function(event, can, point, target) { target = target || event.target
            if (point.length == 1) {
                if (event.type == "click") {
                    can.current = {target: target, begin: can.core.List([target], function(item) { if (item.tagName == "g") { return }
                        return {
                            x: item.Val("x"), y: item.Val("y"), width: item.Val("width"), height: item.Val("height"),
                            target: item, ship: can.core.List(item.Value("ship"), function(ship) {
                                return ship.pid && (ship.target = can.page.Select(can, can.svg, "."+ship.pid)[0]) && ship
                            })
                        }
                    }), pos: can.page.Prepos(event, target)}
                }
                return
            }
            if (event.type == "click") {
                return can.point = [], delete(can.current)
            }

            can.core.List(can.current.begin, function(item) { var figure = can.onfigure._get(can, item.target)
                can.page.Resizes(event, item.target, item, point[0], point[1], can.current.pos)
                can.page.Select(can, can.svg, "."+item.target.Value("text"), function(text) {
                    text.Value(figure.text(can, {}, item.target))
                })
                can.core.List(item.ship, function(ship) {
                    var p = can.page.Anchor(event, item.target, ship.anchor, {}) 
                    if (ship.which == 0) {
                        ship.target.Val("x1", p.x)
                        ship.target.Val("y1", p.y)
                    }
                    if (ship.which == 1) {
                        ship.target.Val("x2", p.x)
                        ship.target.Val("y2", p.y)
                    }
                })
            })
        },
        delete: function(event, can, point) {
            can.point = [], event.target != can.svg && can.page.Remove(can, event.target)
        },
    },
})
Volcanos("ondetail", {help: "组件详情", list: ["复制", "标签", "编辑", "删除"],
    "显示": function(event, can) { can.onmotion.show(can, 10, null, event.target) },
    "隐藏": function(event, can) { can.onmotion.show(can, {value:100, length: 10}, null, event.target) },
    "添加": function(event, can) {
        can.user.prompt("add group", function(name) {
            var group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
            can.group.append(can.onimport._block(can, group))
            group.Value("class", name), can.core.List(["font-size", "stroke-width", "stroke", "fill"], function(name) {
                group.Value(name, can.Action(name))
            })

            can.onimport._group(can, group).click()
        })
    },
    "清空": function(event, can) {
        can.group.innerHTML = "", can.point = [], delete(can.temp)
    },
    "删除": function(event, can) { if (can.group == can.svg) { return }
        can.page.Remove(can, event.target)
        can.page.Remove(can, can.group), can.page.Select(can, can.action, "option[value="+can.group.Value("class")+"]", function(item) {
            can.page.Remove(can, item)
        })
        can.Action("group", "svg")
    },


    "复制": function(event, can) {
        can.onfigure._copy(event, can, event.target)
    },
    "标签": function(event, can) { var target = event.target
        var def = target.Value("text"); can.page.Select(can, can.svg, "."+target.Value("text"), function(item) {
            def = item.Value("inner")
        })
        can.user.prompt("文字", function(text) {
            if (target.tagName == "text") {return target.innerHTML = text}

            if (can.page.Select(can, can.svg, "."+target.Value("text"), function(item) {
                item.Value("inner", text)
            }).length > 0) {
                return
            }

            var figure = can.onfigure._get(can, target)
            var data = figure.text(can, {inner: text}, target)
            var obj = can.onfigure._push(can, data, "text", target.Group())
            target.Value("text", obj.Value("pid"))
        }, def)
    },

    "编辑": function(event, can) { var target = event.target
        var figure = can.onfigure._get(can, target)
        can.user.input(event, can, can.core.List(["x", "y", "transform", "translate_x", "translate_y"].concat(figure.data.copy||[]), function(item) {
            return {_input: "text", name: item, value: target.Value(item)}
        }), function(event, cmd, meta, list) {
            can.core.Item(meta, function(key, value) {
                target.Value(key, value)
            })
        })
    },
    "删除": function(event, can) { if (event.target == can.svg) { return }
        can.core.List(event.target.Value("ship"), function(value) {
            can.page.Select(can, can.svg, "."+value.pid, function(item) {
                can.page.Remove(can, item)
            })
        })
        can.page.Select(can, can.svg, "."+event.target.Value("text"), function(item) {
            can.page.Remove(can, item)
        })
        can.page.Remove(can, event.target)
    },
})
Volcanos("onexport", {help: "导出数据", list: ["分组", "图形", "坐标", "按键"],
    _show: function(can, target) { var figure = can.onfigure._get(can, target)
        can.Status("分组", target.Groups() || can.group.Value("class") )
        can.Status("图形", target.tagName + " " + (figure? figure.show(can, target): ""))
    },

    content: function(can, svg) {
        return ['<svg vertion="1.1" xmlns="https://www.w3.org/2000/svg" text-anchor="middle" dominant-baseline="middle"'].concat(
            svg? can.core.List(["width", "height", "count", "grid",
                "stroke-width", "stroke", "fill", "font-size",
                "transform", "translate_x", "translate_y",
            ], function(item) {
                return svg.Value(item)? ' ' + item + '="' + svg.Value(item) + '"': ""
            }): [" width=600 height=200 "]).concat(['>', svg? svg.innerHTML: "", "</svg>"]).join("")
    },
})

