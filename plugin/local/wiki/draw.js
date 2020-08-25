Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) { can._output.innerHTML = ""
        can.onappend.table(can, target, "table", msg), can.ui = can.page.Append(can, target, [
            {view: "project", style: {display: "none"}},
            {view: "content", onmouseenter: function(event) {
                can.onkeypop.action = can
            }}, {view: "display"},
        ])
        can.page.Modify(can, can._action, {style: {display: "none"}})

        // 交互数据
        can.point = [], can.keys = []
        can.svg = null, can.group = null
        can.last = null, can.temp = null
        can.current = null

        // 加载绘图
        var code = can.onappend.board(can, can.ui.content, "board", msg, msg.Result()||can.onexport.content(can))
        can.page.Select(can, can.ui.content, "svg", function(svg) { can.svg = can.group = svg 
            can.onimport.block(can, svg), can.onimport.group(can, svg).click()
            can.page.Select(can, svg, "*", function(item, index) {
                can.onimport.block(can, item); if (item.tagName == "g" && item.Value("class") != "") {
                    can.onimport.group(can, item)
                }
            })
        })

        // 加载事件
        can.core.Item(can.onaction, function(key, value) {
            if (key.indexOf("on") == -1 || !can.onaction.hasOwnProperty(key)) { return }
            can.svg[key] = can.ui.content[key] || function(event) {
                value(event, can)
            }
        })

        can.Timer(10, function() {
            // 默认参数
            can.core.Item({
                "font-size": "24",
                "stroke-width": 2,
                "stroke": "yellow",
                "fill": "purple",
                "shape": "rect",
                "grid": "10",
                "go": "run",
            }, function(key, value) {
                can.svg.Value(key, can.Action(key, can.svg.Value(key)||value))
            })
        }) 
        return typeof cb == "function" && cb(msg)
    },
    group: function(can, target) { var name = target.Groups() || "svg"
        return can.onappend.item(can, can.ui.project, "item", {name: name}, function(event) {
            can.group = target, can.core.List(["font-size", "storke-width", "stroke", "fill"], function(key) {
                can.Action(key, target.Value(key)||can.Action(key))
            }), can.onmotion.show(can, target, {value: 100, length: 10})
        }, function(event) {
            can.user.carte(can, can.onaction||{}, ["隐藏", "显示", "添加", "删除", "清空"], function(ev, item, meta) {
                switch (item) {
                    case "显示":
                        can.page.Select(can, can.ui.content, "g."+name, function(item) {
                            can.onmotion.show(can, target, {value: 100, length: 10})
                        }); break
                    case "隐藏":
                        can.page.Select(can, can.ui.content, "g."+name, function(item) {
                            can.onmotion.hide(can, target, {value: 100, length: 10})
                        }); break
                    default:
                        can.onaction[item](event, can, item)
                }
            })
        })
    },
    block: function(can, target) {
        target.Val = function(key, value) {
            return parseInt(target.Value(key, value == undefined? value: parseInt(value)||0)) || 0
        }
        target.Value = function(key, value) {
            if (typeof key == "object") { can.core.Item(key, target.Value); return }

            var figure = can.onfigure._get(can, target)
            key && (key = figure && figure.data && figure.data.size && figure.data.size[key] || key)

            if (figure && figure.data && typeof figure.data[key] == "function") {
                return figure.data[key](event, can, value, key, target)
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
            while (item) { if (["svg", "g"].indexOf(item.tagName) > -1) {
                return item
            }; item = item.parentNode }
            return can.svg
        }
        target.Groups = function() { var item = target
            var list = []
            while (item && item.tagName != "svg") {
                item.tagName == "g" && list.push(item.Value("class"))
                item = item.parentNode
            }
            return list.reverse().join(".")
        }
        target.ondblclick = function(event) {
            if (can.Action("go") == "run") { return }
            can.ondetail["标签"](event, can)
            event.stopPropagation()
            event.preventDefault()
        }
        return target
    },

    draw: function(event, can, value) {
        var figure = can.onfigure[value.shape]
        var data = figure.draw(event, can, value.point, value.style)
        can.core.Item(value.style, function(key, value) {data[key] = value})
        return can.onfigure._push(can, data, value.shape, can.group||can.svg)
    },
    keydown: function(event, can, value) {
        if (["Control", "Shift", "Meta", "Alt"].indexOf(value) > -1 ) {return}
        can.keys.push((event.ctrlKey? "C-": "") + (event.shiftKey? value.toUpperCase(): value))
        if (value == "Escape") {
            can.point = [], delete(can.temp)
            return
        }

        var list = {
            g: {prefix: ["go", "go"],
                r: {list: ["run"]},
                a: {list: ["auto"]},
                m: {list: ["manual"]},
            },
            a: {prefix: ["mode", "mode"],
                d: {list: ["draw"]},
                r: {list: ["resize"]},
            },
            s: {prefix: ["shape", "shape"],
                s: {list: ["line"]},
                r: {list: ["rect"]},
                c: {list: ["circle"]},
                e: {list: ["ellipse"]},
                l: {list: ["line"]},
                p: {list: ["path"]},
            },
            c: {prefix: ["stroke", "stroke"],
                r: {list: ["red"]},
                b: {list: ["blue"]},
                g: {list: ["green"]},
                y: {list: ["yellow"]},
                p: {list: ["purple"]},
                c: {list: ["cyan"]},
                h: {list: ["black"]},
                w: {list: ["white"]},
            },
            f: {prefix: ["fill", "fill"],
                r: {list: ["red"]},
                b: {list: ["blue"]},
                g: {list: ["green"]},
                y: {list: ["yellow"]},
                p: {list: ["purple"]},
                c: {list: ["cyan"]},
                h: {list: ["black"]},
                w: {list: ["white"]},
            },
        }

        var prefix = []
        can.core.List(can.keys, function(key) {
            if (!list) {
                // 查找失败
                return can.keys = [], can.Status("按键", can.keys)
            }

            // 查找递进
            prefix = prefix.concat(can.core.List(list.prefix))
            list = list[key]
        })

        if (!list || !list.list) {
            // 等待输入
            return can.Status("按键", can.keys+"("+can.core.Item(list).join(",")+")")
        }

        function call(cmds) {
            cmds && can.onaction[cmds[0]] && can.onaction[cmds[0]].apply(can, [event, can].concat(cmds.slice(1)))
        }

        // 执行命令
        call(prefix.concat(list.list))
        return can.keys = [], can.Status("按键", can.keys)
    },
}, ["/plugin/local/wiki/draw.css"])
Volcanos("onfigure", {help: "图形绘制", list: [],
    _get: function(can, item, name) {
        return can.onfigure[name]||can.onfigure[item.getAttribute("name")]||can.onfigure[item.tagName]
    },
    _push: function(can, data, cmd, target) {
        var rect = document.createElementNS("http://www.w3.org/2000/svg", cmd)
        target.appendChild(can.onimport.block(can, rect))
        rect.Value(data); if (can.point.length == 0) {
            var pid = "p"+can.svg.Val("count", can.svg.Val("count")+1)
            rect.Value("class", (rect.Value("class") + " " + rect.Value("pid", pid)).trim())
        }
        return can.last = rect
    },
    _ship: function(can, target, value) {
        return target.Value("ship", target.Value("ship").concat([value]))
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

    svg: {
        data: {
            size: {},
        }, // <svg font-size="24" stroke-width="2" stroke="yellow" fill="purple" grid="10"/>
        show: function(can, target) {
            return target.Val("width") +","+ target.Val("height")
        },
    },
    rect: {
        data: { size: {x: "x", y: "y"}, rx: 4, ry: 4,
            copy: ["width", "height", "rx", "ry"],
        }, // <rect x="60" y="10" rx="10" ry="10" width="30" height="30" rx="4" ry="4"/>
        draw: function(event, can, point) { if (point.length < 2) { return }
            var p0 = point[0], p1 = point[1]; var data = {
                "x": p0.x > p1.x? p1.x: p0.x,
                "y": p0.y > p1.y? p1.y: p0.y,
                "width": Math.abs(p0.x-p1.x),
                "height": Math.abs(p0.y-p1.y),
                "rx": this.data.rx,
                "ry": this.data.ry,
            }
            return event.type == "click" && point.length == 2 && (can.point = []), data
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
    text: {
        data: { size: {x: "x", y: "y"}, copy: ["inner"],
        }, // <text x="60" y="10">hi<text>
        draw: function(event, can, point, style) { if (point.length < 1 || event.type == "mousemove") { return }
            var p0 = point[0]; var data = {
                "x": p0.x, "y": p0.y,
                "inner": style&&style.inner || can.user.prompt("text"),
            }
            return can.point = [], data
        },
        show: function(can, target) {
            return ": (" + target.Val("x") + "," + target.Val("y")+ ")"
        }
    },
    line: {
        data: { size: {}, copy: ["x1", "y1", "x2", "y2"],
            x: function(event, can, value, cmd, target) {
                if (value != undefined) {
                    var offset = value - target.Val("xx")
                    target.Val("x1", target.Val("x1") + offset)
                    // target.Val("x2", target.Val("x2") + offset)
                    target.Val("xx", value)
                }
                return target.Val("xx")
            },
            y: function(event, can, value, cmd, target) {
                if (value != undefined) {
                    var offset = value - target.Val("yy")
                    target.Val("y1", target.Val("y1") + offset)
                    // target.Val("y2", target.Val("y2") + offset)
                    target.Val("yy", value)
                }
                return target.Val("yy")
            },
            width: function(event, can, value, cmd, target) {
                return value != undefined && target.Val("x2", target.Val("x1") + parseInt(value)), target.Val("x2") - target.Val("x1")
            },
            height: function(event, can, value, cmd, target) {
                return value != undefined && target.Val("y2", target.Val("y1") + parseInt(value)), target.Val("y2") - target.Val("y1")
            },
        },  // <line x1="10" y1="50" x2="110" y2="150"/>
        grid: function(event, can, point) {var target = event.target
            if (target == can.svg) {return}
            var p = point[point.length-1]
            var pos = can.page.Prepos(event, target)
            target.Val && can.page.Anchor(event, target, pos, p)
            return p.target = target, p.anchor = pos, point
        },
        draw: function(event, can, point) { if (point.length < 2) { return }
            var p0 = point[0], p1 = point[1]; var data = {
                "x1": p0.x, "y1": p0.y,
                "x2": p1.x, "y2": p1.y,
            }
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
    path: {
        data: { size: {}, copy: ["d", "name", "meta", "tt", "xx", "yy"],
            x: function(event, can, value, cmd, target) {
                var tt = JSON.parse(target.Value("tt")||'{"tx":0, "ty":0}')
                if (value != undefined) {
                    tt.tx = value-target.Val("xx")
                    target.Value("tt", JSON.stringify(tt))
                    target.Value("transform", "translate("+tt.tx+","+tt.ty+")")
                }
                return target.Val("xx")+tt.tx
            },
            y: function(event, can, value, cmd, target) {
                var tt = JSON.parse(target.Value("tt")||'{"tx":0, "ty":0}')
                if (value != undefined) {
                    tt.ty = value-target.Val("yy")
                    target.Value("tt", JSON.stringify(tt))
                    target.Value("transform", "translate("+tt.tx+","+tt.ty+")")
                }
                return target.Val("yy")+tt.ty
            },
        },  //  <path d="M10 10 H 90 V 90 H 10 Z" fill="transparent" stroke="black"/>
        draw: function(event, can, point, style) {
            if (style && style.d) { return style }
            if (point.length == 1) { can._temp = {} }
            if (point.length < 2) {return}

            if (can.keys && can.keys.length > 0) { var k;
                k = can._temp[point.length-1] = can.keys[0]
                switch (k.toUpperCase()) {
                    case "C": can._temp[point.length+1] = ","
                    case "Q": can._temp[point.length] = ","; break
                    default:
                }
                can.keys = can.keys.slice(1)
            }

            var skip = 0
            var end = false
            var data = {
                d: can.core.List(point, function(p, i) { var k = p.k
                    if (i < skip) {return}
                    switch (i) {
                        case 0: k = "M"; break
                        default: k = can._temp[i] || p.k || "L"; break
                    }
                    if (end) {return}

                    k = k.toUpperCase()
                    switch (k) {
                        case "Z": return can.point = [], can._temp = {}, k
                        case "L": return k+" " + p.x + " " + p.y
                        case "M": return k+" " + p.x + " " + p.y
                        case "H": return k+" " + p.x
                        case "V": return k+" " + p.y
                        case "A":
                            switch (point.length - i) {
                                case 1: end = true
                                    return k+" " + (point[i-1].x+p.x)/2 + " " + (point[i-1].y+p.y)/2 + " 0 0 0 " + p.x + " " + p.y
                                case 2: end = true
                                    var r = Math.sqrt(Math.pow(point[i+1].x - p.x, 2) + Math.pow(point[i+1].y - p.y, 2))
                                    return k+" " + r + " " + r + " 0 0 0 " + p.x + " " + p.y
                                case 3:
                                    if (!p.done) {
                                        var r = Math.sqrt(Math.pow(point[i+1].x - p.x, 2) + Math.pow(point[i+1].y - p.y, 2))
                                        var temp = point[i]
                                        p = point[i] = point[i+1]
                                        point[i+1] = temp
                                        var temp = can.point[i]
                                        p = can.point[i] = can.point[i+1]
                                        can.point[i+1] = temp
                                        p.x = r
                                        p.y = r
                                        p.done = true
                                        p.arg = " 0 0 0 "
                                    }
                                default:
                                    skip = i + 2
                                    return k+" " + p.x + " " + p.y + " 0 0 0 " + point[i+1].x + " " + point[i+1].y
                            }
                            break
                        case "C":
                            switch (point.length - i) {
                                case 1: end = true
                                    return k+" " + (point[i-1].x+p.x)/2 + " " + (point[i-1].y+p.y)/2 + "," + (point[i-1].x+p.x)/2 + " " + (point[i-1].y+p.y)/2 + "," + p.x + " " + p.y
                                case 2: end = true
                                    return k+" " + point[i+1].x + " " + point[i+1].y + "," + (point[i-1].x+p.x)/2 + " " + (point[i-1].y+p.y)/2 + "," + p.x + " " + p.y
                                case 3:
                                    return k+" " + point[i+1].x + " " + point[i+1].y + "," + point[i+2].x + " " + point[i+2].y + "," + p.x + " " + p.y
                                case 4:
                                    if (!p.done) {
                                        var temp = point[i]
                                        p = point[i] = point[i+1]
                                        point[i+1] = temp

                                        var temp = point[i+1]
                                        point[i+1] = point[i+2]
                                        point[i+2] = temp
                                        p.done = true
                                    }
                                default:
                                    return k+" " + p.x + " " + p.y
                            }
                        case "Q":
                            switch (point.length - i) {
                                case 1: end = true
                                    return k+" " + (point[i-1].x+p.x)/2 + " " + (point[i-1].y+p.y)/2 + "," + p.x + " " + p.y
                                case 2: end = true
                                    return k+" " + point[i+1].x + " " + point[i+1].y + "," + p.x + " " + p.y
                                case 3:
                                    if (!p.done) {
                                        var temp = point[i]
                                        p = point[i] = point[i+1]
                                        point[i+1] = temp
                                        p.done = true
                                    }
                                default:
                                    return k+" " + p.x + " " + p.y
                            }
                        default: return k+" " + p.x + " " + p.y
                    }
                }).join(" ")
            }
            return data
        },
        text: function(can, target, data) {
            data.x = (target.x1.baseVal.value + target.x2.baseVal.value) / 2
            data.y = (target.y1.baseVal.value + target.y2.baseVal.value) / 2
            return data
        },
        show: function(can, target) {
            return target.tagName + " " + target.Value("d")
        },
    },
    circle: {
        data: { size: {x: "cx", y: "cy", width: "r", height: "r"}, copy: ["r"],
        }, // <circle cx="25" cy="75" r="20"/>
        draw: function(event, can, point) { if (point.length < 2) { return }
            var p0 = point[0], p1 = point[1]; var data = {
                "cx": p0.x, "cy": p0.y,
                "r": Math.sqrt(Math.pow(p0.x-p1.x, 2)+Math.pow(p0.y-p1.y, 2)),
            }
            return event.type == "click" && point.length == 2 && (can.point = []), data
        },
        text: function(can, target, data) {
            data.x = target.Val("cx")
            data.y = target.Val("cy")
            return data
        },
        show: function(can, target) {
            return ": (" + target.Val("cx") + "," + target.Val("cy") + ")"
                + " > (" + parseInt(target.Val("r")) + ")"
        },
    },
    ellipse: {
        data: { size: {x: "cx", y: "cy", width: "rx", height: "ry"}, copy: ["rx", "ry"],
        }, // <ellipse cx="75" cy="75" rx="20" ry="5"/>
        draw: function(event, can, point) { if (point.length < 2) { return }
            var p0 = point[0], p1 = point[1]; var data = {
                "cx": p0.x, "cy": p0.y,
                "rx": Math.abs(p0.x - p1.x), "ry": Math.abs(p0.y - p1.y),
            }
            return event.type == "click" && point.length == 2 && (can.point = []), data
        },
        text: function(can, target, data) {
            data.x = target.Val("cx")
            data.y = target.Val("cy")
            return data
        },
        show: function(can, target) {
            return ": (" + target.Val("cx") + "," + target.Val("cy") + ")"
                + " > (" + target.Val("rx") + "," + target.Val("ry") + ")"
        },
    },
    block: {
        data: { size: {x: "x", y: "y"}, rx: 4, ry: 4, copy: ["width", "height", "rx", "ry"],
        }, // <rect x="60" y="10" rx="10" ry="10" width="30" height="30" rx="4" ry="4"/>
        draw: function(event, can, point) { if (point.length < 2) { return }
            this._temp && can.page.Remove(can, this._temp) && delete(this._temp)
            this._temp = can.onfigure._push(can, {}, "g", can.group||can.svg)

            var temp = this._temp
            var rect = can.onfigure._push(can, can.onfigure.rect.draw(event, can, point), "rect", temp)
            if (event.type == "click" && point.length == 2) { var point = can.onfigure.rect.text(can, rect, {})
                can.require(["/plugin/input/key"])
                can.run(event, ["action", "plugin"], function(msg) {
                    var ui = can.user.input(event, can, [
                        {name: "zone", select: [["zone"].concat(msg.append), function(event, value) {
                            can.page.Appends(can, ui.type, can.core.List(msg[value], function(item) {
                                return {type: "option", value: item, inner: item}
                            }))
                        }]},
                        {name: "type", select: [["type"].concat(msg[msg.append[0]]), function(event, value) {

                        }]},

                        {name: "name", type: "input", onclick: function(event) {
                            can.onfigure.key.onclick(event, can, {name: "name", zone: ui.zone.value, type: ui.type.value}, event.target)
                        }, autocomplete: "off"},
                        {name: "text", type: "input", onclick: function(event) {
                            can.onfigure.key.onclick(event, can, {name: "text", zone: ui.zone.value, type: ui.type.value}, event.target)
                        }, autocomplete: "off"},
                    ], function(event, button, data, list) {
                        var text = can.onfigure._push(can, can.onfigure.text.draw(event, can, [point], {inner: data.name}), "text", temp)
                        rect.Value(data)
                        text.Value(data)
                        return true
                    })
                }, true)
                delete(this._temp)
            }
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
}, ["/plugin/local/wiki/draw/heart.js"])
Volcanos("onaction", {help: "组件菜单", list: [
        ["grid", 1, 2, 3, 4, 5, 10, 20],
        ["stroke-width", 1, 2, 3, 4, 5],
        ["font-size", 12, 16, 18, 24, 32],
        {text: [" c:", "div", "item"]}, ["stroke", "red", "yellow", "green", "purple", "blue", "cyan", "white", "black"],
        {text: [" f:", "div", "item"]}, ["fill", "red", "yellow", "green", "purple", "blue", "cyan", "white", "black", "#0000"],
        {text: [" g:", "div", "item"]}, ["go", "run", "auto", "manual"],
        {text: [" a:", "div", "item"]}, ["mode", "translate", "draw", "resize", "delete"],
        {text: [" s:", "div", "item"]}, ["shape", "block", "rect", "text", "line", "path", "circle", "ellipse", "heart"],
    ],
    "编辑": function(event, can, key) { can.Action("go", "auto") },
    "保存": function(event, can, key) {
        var msg = can.request(event); msg.Option("content", can.onexport.content(can, can.svg))
        can.run(event, ["action", key, can.Option("path"), can.Option("file")], function() {
            can.user.toast(can, "保存成功")
        }, true)
    },
    "项目": function(event, can, key) {
        can.page.Modify(can, can.ui.project, {style: {display: can.ui.project.style.display=="none"? "block": "none"}})
    },
    "变参": function(event, can, key) {
        can.page.Modify(can, can._action, {style: {display: can._action.style.display=="none"? "": "none"}})
    },
    "清空": function(event, can) {
        can.group.innerHTML = "", can.point = [], can.keys = [], delete(can.temp)
    },
    "删除": function(event, can) { if (can.group == can.svg) { return }
        can.page.Remove(can, event.target)
        can.page.Remove(can, can.group), can.page.Select(can, can.action, "option[value="+can.group.Value("class")+"]", function(item) {
            can.page.Remove(can, item)
        })
        can.Action("group", "svg")
    },
    "添加": function(event, can) {
        can.user.prompt("add group", function(name) {
            var group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
            can.group.append(can.onimport.block(can, group))
            group.Value("class", name), can.core.List(["font-size", "stroke-width", "stroke", "fill"], function(name) {
                group.Value(name, can.Action(name))
            })

            can.onimport.group(can, group).click()
        })
    },

    "font-size": function(event, can, key, value) { can.Action(key, value), can.group.Value(key, value) },
    "stroke-width": function(event, can, key, value) { can.Action(key, value), can.group.Value(key, value) },
    stroke: function(event, can, key, value) { can.Action(key, value), can.group.Value(key, value) },
    fill: function(event, can, key, value) { can.Action(key, value), can.group.Value(key, value) },
    shape: function(event, can, key, value) { can.Action(key, value) },
    mode: function(event, can, key, value) { can.Action(key, value) },
    go: function(event, can, key, value) { can.Action(key, value) },

    _mode: {
        run: function(event, can) { var target = event.target
            event.type == "click" && target.Value("type") && can.run(event, ["action", "run", target.Value("zone"), target.Value("type"), target.Value("name"), target.Value("text")], function(msg) {
                can.onappend.table(can, can.ui.display, "table", msg)
                can.onappend.board(can, can.ui.display, "board", msg)
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
                    text.Value(figure.text(can, item.target, {}))
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
    _action: function(event, can, points, target) {
        can.temp && can.page.Remove(can, can.temp) && delete(can.temp)
        can.temp = can.onaction._mode[can.Action("mode")](event, can, points, target)
        can.point.length == 0 && delete(can.temp)
    },
    _point: function(event, can) {
        var p = can.svg.getBoundingClientRect()
        var point = {x: event.clientX-p.x, y: event.clientY-p.y}
        if (can.Action("mode") == "view") { return point }
        point.x = point.x - point.x % parseInt(can.Action("grid"))
        point.y = point.y - point.y % parseInt(can.Action("grid"))
        return point
    },
    _show: function(can, target) { var figure = can.onfigure._get(can, target)
        can.Status("分组", target.Groups() || can.group.Value("class") )
        can.Status("图形", target.tagName + " " + (
            figure? figure.show(can, target): ""))
    },
    _auto: function(can, target, pos) {
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

    onclick: function(event, can) {
        if (can.Action("go") == "run") {
            can.onaction._mode.run(event, can)
            return
        }
        var target = event.target
        if (event.altKey) {
            target = can.onfigure._copy(event, can, event.target)
            can.Action("mode", "resize")
        }
        if (event.target == can._target) { return }
        var point = can.onaction._point(event, can)
        can.onaction._action(event, can, can.point = can.point.concat(point), target)
    },
    onmousemove: function(event, can) {
        var point = can.onaction._point(event, can)
        can.Status("坐标", point.x+","+point.y)
        if (can.Action("go") == "run") { return can.page.Modify(can, event.target, {style: {cursor: ""}}) }

        var pos = can.page.Prepos(event, event.target)
        if (can.Action("go") == "auto" && can.point.length == 0) {
            can.onaction._auto(can, event.target, pos)
        }
        can.onaction._action(event, can, can.point.concat(point))
    },
    onmouseover: function(event, can) {
        can.onaction._show(can, event.target)
    },
    oncontextmenu: function(event, can) {
        can.onaction._show(can, event.target)
    },
})
Volcanos("ondetail", {help: "组件详情", list: ["复制", "标签", "编辑", "删除"],
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
            var data = figure.text(can, target, {inner: text})
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
Volcanos("onexport", {help: "导出数据", list: ["坐标", "分组", "图形", "按键"],
    content: function(can, svg) {
        return ['<svg vertion="1.1" xmlns="https://www.w3.org/2000/svg" text-anchor="middle" dominant-baseline="middle"'].concat(
            svg? can.core.List([
                "count", "width", "height", "font-size", "stroke-width", "stroke", "fill",
                "transform", "translate_x", "translate_y",
            ], function(item) {
                return svg.Value(item)? ' ' + item + '="' + svg.Value(item) + '"': ""
            }): [" width=600 height=200 "]).concat(['>', svg? svg.innerHTML: "", "</svg>"]).join("")
    },
})

