Volcanos("onimport", {help: "导入数据", list: [],
    _start: function(can) {
        var def = {
            "font-size": "24",
            "stroke-width": 2,
            "stroke": "yellow",
            "fill": "purple",
            "grid": "10",
        }
        // 默认参数
        can.core.Item(def, function(key, value) {
            can.svg.Value(key, can.Action(key, can.svg.Value(key)||value))
        })
        can.Action("mode", "select")
        can.Action("mode", "draw")
        can.Action("shape", "path")
    },
    init: function(can, msg, cb, output, action, option) {output.innerHTML = "";
        if (msg.Option("_display") == "table") {
            // 文件目录
            can.page.AppendTable(can, output, msg, msg.append, function(event, value, key, index, tr, td) {
                can.Export(event, value, key)
            })
            return typeof cb == "function" && cb(msg);
        }

        // 交互数据
        can.point = [], can.keys = []
        can.current = null, can.temp = null
        can.group = null, can.svg = null
        can.last = null

        // 加载绘图
        var code = can.page.AppendBoard(can, output, msg.Result()||can.Export(event, null, "file"))
        can.page.Select(can, output, "svg", function(svg) {
            // 画布
            can.onaction.init(event, can, msg, "init", svg);
            can.group = can.svg = svg;

            var list = can.core.List(can.onaction.list, function(item, index) {if (item[0] == "group") {
                // 清空分组
                return can.onaction.list[index] = ["group", "svg"]
            }})[0]

            can.page.Select(can, svg, "*", function(item, index) {
                // 元素
                can.onaction.init(event, can, msg, index, item);
                item.tagName == "g" && item.Value("class") != "" && list.push(item.Value("class"));
            })
        })

        return typeof cb == "function" && cb(msg);
    },
    draw: function(event, can, value) {
        var figure = can.onfigure[value.shape]
        var data = figure.draw(event, can, value.point, value.style)
        can.core.Item(value.style, function(key, value) {data[key] = value})
        return can.onaction.push(event, can, data, value.shape, can.group||can.svg)
    },
    escape: function(event, can, value) {
        can.point = can.point.slice(0, -1)
    },
    keydown: function(event, can, value) {
        if (["Control", "Shift", "Meta", "Alt"].indexOf(value) > -1 ) {return}
        can.keys.push((event.ctrlKey? "C-": "") + (event.shiftKey? value.toUpperCase(): value))

        var list = {
            a: {prefix: ["mode", "mode"],
                w: {list: ["draw"]},
                m: {list: ["move"]},
                r: {list: ["resize"]},
                s: {list: ["select"]},
                d: {list: ["delete"]},
            },
            s: {prefix: ["shape", "shape"],
                r: {list: ["rect"]},
                c: {list: ["circle"]},
                e: {list: ["ecllipse"]},
                t: {list: ["text"]},
                l: {list: ["line"]},
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
                return can.keys = [], can.Status(event, can.keys, "keys")
            }

            // 查找递进
            prefix = prefix.concat(can.core.List(list.prefix))
            list = list[key]
        })

        if (!list || !list.list) {
            // 等待输入
            return can.Status(event, can.keys+"("+can.core.Item(list).join(",")+")", "keys")
        }

        function call(cmds) {
            cmds && can.onaction[cmds[0]] && can.onaction[cmds[0]].apply(can, [event, can].concat(cmds.slice(1)))
        }

        // 执行命令
        call(prefix.concat(list.list))
        return can.keys = [], can.Status(event, can.keys, "keys")
    },
}, ["plugin/local/wiki/draw.css"])
Volcanos("onfigure", {help: "图形绘制", list: [],
    _spawn: function(sup, can) {can.sup = sup},
    _swell: function(can, sub) {
        can.sup && can.sup.action && sub.draw && can.page.Select(can, can.sup.action, "select.shape", function(shape) {
            can.page.Append(can, shape, [{text: [sub._name, "option"]}])
        })
    },
    svg: {
        data: {
            size: {},
        }, // <svg font-size="24" stroke-width="2" stroke="yellow" fill="purple" grid="10"/>
        show: function(event, can, value, target) {
            return can.svg.Val("width") +","+ can.svg.Val("width")
        },
    },
    rect: {
        data: {
            rx: 4, ry: 4,
            size: {x: "x", y: "y"},
            copy: ["width", "height", "rx", "ry"],
        }, // <rect x="60" y="10" rx="10" ry="10" width="30" height="30" rx="4" ry="4"/>
        draw: function(event, can, point) {if (point.length < 2) {return}
            var p0 = point[0], p1 = point[1];
            var data = {
                "x": p0.x > p1.x? p1.x: p0.x,
                "y": p0.y > p1.y? p1.y: p0.y,
                "width": Math.abs(p0.x-p1.x),
                "height": Math.abs(p0.y-p1.y),
                "rx": this.data.rx,
                "ry": this.data.ry,
            }
            return event.type == "click" && point.length == 2 && (can.point = []), data;
        },
        text: function(event, can, data, target) {
            data.x = target.Val("x")+target.Val("width")/2
            data.y = target.Val("y")+target.Val("height")/2
            return data
        },
        show: function(event, can, value, target) {
            return ": (" + value.Val("x") + "," + value.Val("y") + ")"
                + " + (" + value.Val("width") + "," + value.Val("height") + ")"
        },
    },
    circle: {
        data: {
            size: {x: "cx", y: "cy", width: "r", height: "r"},
            copy: ["r"],
        }, // <circle cx="25" cy="75" r="20"/>
        draw: function(event, can, point) {if (point.length < 2) {return}
            var p0 = point[0], p1 = point[1];
            var data = {
                "cx": p0.x, "cy": p0.y,
                "r": Math.sqrt(Math.pow(p0.x-p1.x, 2)+Math.pow(p0.y-p1.y, 2)),
            }
            return event.type == "click" && point.length == 2 && (can.point = []), data;
        },
        text: function(event, can, data, target) {
            data.x = target.Val("cx")
            data.y = target.Val("cy")
            return data
        },
        show: function(event, can, value, target) {
            return ": (" + value.Val("cx") + "," + value.Val("cy") + ")"
                + " > (" + parseInt(value.Val("r")) + ")"
        },
    },
    ellipse: {
        data: {
            size: {x: "cx", y: "cy", width: "rx", height: "ry"},
            copy: ["rx", "ry"],
        }, // <ellipse cx="75" cy="75" rx="20" ry="5"/>
        draw: function(event, can, point) {if (point.length < 2) {return}
            var p0 = point[0], p1 = point[1];
            var data = {
                "cx": p0.x, "cy": p0.y,
                "rx": Math.abs(p0.x - p1.x), "ry": Math.abs(p0.y - p1.y),
            }
            return event.type == "click" && point.length == 2 && (can.point = []), data;
        },
        text: function(event, can, data, target) {
            data.x = target.Val("cx")
            data.y = target.Val("cy")
            return data
        },
        show: function(event, can, value, target) {
            return ": (" + value.Val("cx") + "," + value.Val("cy") + ")"
                + " > (" + value.Val("rx") + value.Val("ry") + ")"
        },
    },
    text: {
        data: {
            size: {x: "x", y: "y"},
            copy: ["inner"],
        }, // <text x="60" y="10">hi<text>
        draw: function(event, can, point, style) {if (point.length < 1 || event.type == "mousemove") {return}
            var p0 = point[0];
            var data = {
                "x": p0.x, "y": p0.y,
                "inner": style&&style.inner||can.user.prompt("text"),
            }
            return can.point = [], data;
        },
        show: function(event, can, value, target) {
            return ": (" + target.Val("x") + "," + target.Val("y")+ ")"
        }
    },
    line: {
        data: {
            size: {},
            copy: ["x1", "y1", "x2", "y2"],
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
            if (event.target == can.svg) {return}
            var pos = can.page.Prepos(event, target)
            var p = point[point.length-1]
            p.target = target
            p.anchor = pos
            target.Val && can.page.Anchor(event, target, pos, p)
            return point
        },
        draw: function(event, can, point) {if (point.length < 2) {return}
            var p0 = point[0], p1 = point[1];
            var data = {
                "x1": p0.x, "y1": p0.y,
                "x2": p1.x, "y2": p1.y,
            }
            return event.type == "click" && point.length == 2 && (can.point = []), data;
        },
        text: function(event, can, data, target) {
            data.x = (target.Val("x1") + target.Val("x2")) / 2
            data.y = (target.Val("y1") + target.Val("y2")) / 2
            return data
        },
        show: function(event, can, value, target) {
            return ": (" + value.Val("x1") + "," + value.Val("y1") + ")"
                + " - (" + value.Val("x2") + "," + value.Val("y2") + ")"
        },
    },
    path: {
        data: {
            size: {},
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
            copy: ["d", "cmd", "name", "meta", "tt", "xx", "yy", "fill"],
        },  //  <path d="M10 10 H 90 V 90 H 10 Z" fill="transparent" stroke="black"/>
        draw: function(event, can, point) {
            if (point.length == 1) {
                can._temp = {}
            }
            if (point.length < 2) {return}
            if (can.keys && can.keys.length > 0) {
                switch (can._temp[point.length-1] = can.keys[0]) {
                    case "C": can._temp[point.length+1] = ","
                    case "Q": can._temp[point.length] = ","; break
                    default:
                }
                can.keys = can.keys.slice(1)
            }

            var skip = 0;
            var end = false;
            var data = {
                d: can.core.List(point, function(p, i) {var k = p.k
                    if (i < skip) {return}
                    switch (i) {
                        case 0: k = "M"; break
                        default: k = can._temp[i] || p.k || "L"; break
                    }
                    if (end) {return}

                    switch (k) {
                        case "Z": return can.point = [], can._temp = {}, k
                        case "L": return k+" " + p.x + " " + p.y
                        case "M": return k+" " + p.x + " " + p.y
                        case "H": return k+" " + p.x
                        case "V": return k+" " + p.y
                        case "A":
                            switch (point.length - i) {
                                case 1: end = true;
                                    return k+" " + (point[i-1].x+p.x)/2 + " " + (point[i-1].y+p.y)/2 + " 0 0 0 " + p.x + " " + p.y
                                case 2: end = true;
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
                                case 1: end = true;
                                    return k+" " + (point[i-1].x+p.x)/2 + " " + (point[i-1].y+p.y)/2 + "," + (point[i-1].x+p.x)/2 + " " + (point[i-1].y+p.y)/2 + "," + p.x + " " + p.y
                                case 2: end = true;
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
                                case 1: end = true;
                                    return k+" " + (point[i-1].x+p.x)/2 + " " + (point[i-1].y+p.y)/2 + "," + p.x + " " + p.y
                                case 2: end = true;
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
            return data;
        },
        text: function(event, can, data, target) {
            data.x = (target.x1.baseVal.value + target.x2.baseVal.value) / 2
            data.y = (target.y1.baseVal.value + target.y2.baseVal.value) / 2
            return data
        },
        show: function(event, can, value, target) {
            return value.tagName
        },
    },

    think: {
        data: {
            rx: 4, ry: 4,
            size: {x: "x", y: "y"},
            copy: ["width", "height", "rx", "ry"],
        }, // <rect x="60" y="10" rx="10" ry="10" width="30" height="30" rx="4" ry="4"/>
        draw: function(event, can, point) {if (point.length < 2) {return}
            can._temp && can.page.Remove(can, can._temp) && delete(can._temp);
            can._temp = can.onaction.push(event, can, {}, "g", can.group||can.svg)
            var rect = can.onaction.push(event, can, can.onfigure.rect.draw(event, can, point), "rect", can._temp)
            if (event.type == "click" && point.length == 2) {
                can.ondetail["标签"](event, can, {}, "", rect);
                delete(can._temp)
            }
            return
        },
        text: function(event, can, data, target) {
            data.x = target.Val("x")+target.Val("width")/2
            data.y = target.Val("y")+target.Val("height")/2
            return data
        },
        show: function(event, can, value, target) {
            return ": (" + value.Val("x") + "," + value.Val("y") + ")"
                + " + (" + value.Val("width") + "," + value.Val("height") + ")"
        },
    },
    polyline: {
        data: {},  // <polyline points="60 110, 65 120, 70 115, 75 130, 80 125, 85 140, 90 135, 95 150, 100 145"/>
        draw: function(event, can, point) {if (point.length < 2) {return}
            var data = {
                points: can.core.List(point, function(item) {return item.x + " " + item.y}).join(", ")
            }
            return data;
        },
        text: function(event, can, data, target) {
            data.x = (target.x1.baseVal.value + target.x2.baseVal.value) / 2
            data.y = (target.y1.baseVal.value + target.y2.baseVal.value) / 2
            return data
        },
        show: function(event, can, value, target) {
            return value.tagName + ": (" + value.points.baseVal.value + ")"
        },
    },
    polygon: {
        data: {},  // <polyline points="60 110, 65 120, 70 115, 75 130, 80 125, 85 140, 90 135, 95 150, 100 145"/>
        draw: function(event, can, point) {if (point.length < 2) {return}
            var data = {
                points: can.core.List(point, function(item) {return item.x + " " + item.y}).join(", ")
            }
            return data;
        },
        text: function(event, can, data, target) {
            data.x = (target.x1.baseVal.value + target.x2.baseVal.value) / 2
            data.y = (target.y1.baseVal.value + target.y2.baseVal.value) / 2
            return data
        },
        show: function(event, can, value, target) {
            return value.tagName + ": (" + value.points.baseVal.value + ")"
        },
    },
}, Config.libs.concat(["plugin/local/wiki/draw/heart"]))
Volcanos("onaction", {help: "组件菜单", list: ["保存", "清空", "删除", "添加",
        ["group", "svg"],
        ["font-size", 12, 16, 18, 24, 32],
        ["stroke-width", 1, 2, 3, 4, 5],
        {text: "c"}, ["stroke", "red", "yellow", "green", "purple", "blue", "cyan", "white", "black"],
        {text: "f"}, ["fill", "red", "yellow", "green", "purple", "blue", "cyan", "white", "black", "#0000"],
        {text: "a"}, ["go", "auto", "manual"],
        {text: "a"}, ["mode", "draw", "move", "resize", "select", "delete"],
        {text: "s"}, ["shape", "think", "rect", "circle", "ellipse", "text", "line", "path", "polyline", "polygon"],
        ["grid", 1, 2, 3, 4, 5, 10, 20],
    ],
    "保存": function(event, can, msg, cmd, target) {
        can.run(event, ["action", cmd, can.Option("path"), can.Export(event, can.svg, "file")], function() {
            can.user.toast("保存成功")
        }, true)
    },
    "清空": function(event, can, msg, cmd, target) {
        can.svg.innerHTML = ""
        can.point = []
        can.keys = []
    },
    "删除": function(event, can, msg, cmd, target) {if (can.group == can.svg) {return}
        can.page.Remove(can, can.group), can.page.Select(can, can.action, "option[value="+can.group.Value("class")+"]", function(item) {
            can.page.Remove(can, item)
        })
        can.Action("group", "svg")
    },
    "添加": function(event, can, msg, cmd, target) {
        can.user.prompt("add group", function(name) {
            var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            can.group.append(can.onaction.init(event, can, msg, cmd, group))

            can.group = group, can.group.Value("class", name)
            can.core.List(["font-size", "stroke-width", "stroke", "fill"], function(name) {
                can.group.Value(name, can.Action(name))
            })
            can.page.Select(can, can.action, "select.group", function(item) {
                can.page.Append(can, item, [{type: "option", value: name, inner: name}]);
                item.value = name
            })
        })
    },

    group: function(event, can, value, cmd, target) {
        if (cmd == "svg") {
            can.group = can.svg
        } else {
            can.page.Select(can, can.svg, "g."+cmd, function(item) {
                can.group = item
            })
        }
        can.core.List(["font-size", "storke-width", "stroke", "fill"], function(key) {
            can.Action(key, can.group.Value(key)||can.Action(key))
        })
        return can.group
    },
    "font-size": function(event, can, value, cmd, target) {can.Action(value, can.group.Value(value, cmd))},
    "stroke-width": function(event, can, value, cmd, target) {can.Action(value, can.group.Value(value, cmd))},
    stroke: function(event, can, value, cmd, target) {can.Action(value, can.group.Value(value, cmd))},
    fill: function(event, can, value, cmd, target) {can.Action(value, can.group.Value(value, cmd))},
    shape: function(event, can, value, cmd, target) {cmd && can.Action(value, cmd)},
    mode: function(event, can, value, cmd, target) {cmd && can.Action(value, cmd)},
    grid: function(event, can, value, cmd, target) {cmd && can.Action(value, cmd)},

    init: function(event, can, msg, cmd, item) {
        item.Value = function(key, value) {
            if (typeof key == "object") {
                can.core.Item(key, function(key, value) {
                    item.Value(key, value)
                })
                return
            }
            var figure = can.onaction._get(can, item);
            key && (key = figure && figure.data && figure.data.size && figure.data.size[key] || key)
            if (figure && figure.data && typeof figure.data[key] == "function") {
                return figure.data[key](event, can, value, key, item)
            }
            if (key == "inner") {
                return value != undefined && (item.innerHTML = value), item.innerHTML
            }
            return value && item.setAttribute(key, value), item.getAttribute(key||"class")||item[key]&&item[key].baseVal&&item[key].baseVal.value||item[key]&&item[key].baseVal||"";
        }
        item.Val = function(key, value) {
            return parseInt(item.Value(key, value == undefined? value: parseInt(value)||0))||0;
        }
        item.Group = function() {var target = item
            while (target) {
                if (["svg", "g"].indexOf(target.tagName) > -1) {
                    return target;
                }
                target = target.parentNode;
            }
            return can.svg
        }
        return item;
    },
    push: function(event, can, msg, cmd, target) {
        var rect = document.createElementNS("http://www.w3.org/2000/svg", cmd);
        target.appendChild(can.onaction.init(event, can, msg, cmd, rect));

        can.core.Item(msg, function(key, value) {
            if (key == "inner") {return rect.innerHTML = value}
            rect.Value(key, value)
        });

        if (can.point.length == 0) {
            var pid = "p"+ can.svg.Val("count", can.svg.Val("count")+1)
            rect.Value("class", (rect.Value("class") + " " + rect.Value("pid", pid)).trim());
        }
        return can.last = rect;
    },
    _get: function(can, item, name) {
        return can.onfigure[name||item.getAttribute("name")||item.tagName];
    },
    _ship: function(can, value, target) {
        var ship = JSON.parse(target.Value("ship")||"[]").concat([value])
        target.Value("ship", JSON.stringify(ship))
    },
    _run: function(event, can, target) {
        var figure = can.onaction._get(can, event.target);
        var msg = can.Event(event);
        figure && can.core.List(["x", "y", "cmd"].concat(figure.copy||[]), function(item) {
            msg.Option(item, target.Value(item))
        })
        figure && figure.run? figure.run(event, can, figure, "run", event.target): (event.type == "click" && can.run(event, ["action", "执行", target.Value("cmd")], function(msg) {
            msg.Table(function(value, index) {
                index > 0 && can.core.Item(value, function(key, val) {
                    target.Value(key, val)
                })
            })
        }, true))
        return
    },
    _draw: function(event, can, point) {
        var shape = can.Action("shape");
        var figure = can.onfigure[shape];
        figure && figure.grid && figure.grid(event, can, point);
        var data = figure && figure.draw(event, can, point);
        var obj = data && can.onaction.push(event, can, data, figure.data.name||shape, can.group||can.svg);

        event.type == "click" && obj && can.core.List(point, function(item, index) {if (!item.target) {return}
            can.onaction._ship(can, {pid: obj.Value("pid"), which: index, anchor: item.anchor}, item.target)
        })
        return obj
    },
    _move: function(event, can, point) {
        if (point.length == 1) {if (event.type != "click") {return}
            can.onaction._select(event, can, point)
            // can.point = point, can.current = {target: can.group}
            can.point = point, can.current = {target: event.target}
        } else if (point.length == 2) {
            if (event.type == "click") {
                return can.point = [], delete(can.current)
            }
        }

        var target = can.current.target
        var figure = can.onaction._get(can, target);
        if (point.length == 1) {
            target.style.cursor = "move"
            can.current.pos = 5, can.current.begin = can.core.List([target], function(item) {
                if (item.tagName == "g") {return}
                return target.style.cursor = "move", {
                    target: item,
                    x: item.Val("x"),
                    y: item.Val("y"),
                    width: item.Val("width"),
                    height: item.Val("height"),
                    ship: can.core.List(JSON.parse(item.Value("ship")||"[]"), function(ship) {
                        return ship.pid && (ship.target = can.page.Select(can, can.svg, "."+ship.pid)[0]) && ship
                    })
                }
            })
            /*
            can.current.pos = 5, can.current.begin = can.page.Select(can, target, "*", function(item) {
                if (item.tagName == "g") {return}
                return target.style.cursor = "move", {
                    target: item,
                    x: item.Val("x"),
                    y: item.Val("y"),
                    width: item.Val("width"),
                    height: item.Val("height"),
                    ship: can.core.List(JSON.parse(item.Value("ship")||"[]"), function(ship) {
                        ship.target = can.page.Select(can, can.svg, "."+ship.pid)[0];
                        return ship
                    })
                }
            })
            */
            return
        }

        can.core.List(can.current.begin, function(item) {
            var figure = can.onaction._get(can, item.target)

            can.page.Resizes(event, item.target, item, point[0], point[1], can.current.pos)
            can.page.Select(can, can.svg, "."+item.target.Value("text"), function(text) {
                text.Value(figure.text(event, can, {}, item.target))
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
    _resize: function(event, can, point) {
        if (point.length == 1) {if (event.type != "click") {return}
            can.current = {target: event.target}
        } else if (point.length == 2) {
            if (event.type == "click") {
                return can.point = [], delete(can.current)
            }
        }

        var target = can.current.target
        var figure = can.onaction._get(can, target);
        if (point.length == 1) {
            can.current.pos = can.page.Prepos(event, target)
            can.current.begin =  {
                x: target.Val("x"),
                y: target.Val("y"),
                width: target.Val("width"),
                height: target.Val("height"),
            }
            return
        }

        can.page.Resizes(event, target, can.current.begin, point[0], point[1], can.current.pos)
    },
    _scale: function(event, can, point) {if (point.length < 2) {return}
        if (point.length == 2) {
            can.last && can.page.Remove(can, can.last)
            var figure = can.onfigure["line"];
            var data = figure && figure.draw(event, can, point);
            can.last = can.onaction.push(event, can, data, "line", can.group||can.svg)
            if (event.type == "click" && point.length == 2) {
                can.point = point
            }
            return
        }

        can.now && can.page.Remove(can, can.now)
        var figure = can.onfigure["line"];
        var data = figure && figure.draw(event, can, [point[0], point[2]]);
        can.now = can.onaction.push(event, can, data, "line", can.group||can.svg)
        if (event.type == "click" && point.length == 3) {
            can.now && can.page.Remove(can, can.now)
            can.last && can.page.Remove(can, can.last)
            can.point = []
        }

        can.group.Value("transform", "scale("+(point[2].x-point[0].x)/(point[1].x-point[0].x)+","+(point[2].y-point[0].y)/(point[1].y-point[0].y)+")")
    },
    _delete: function(event, can, point) {
        can.point = [], event.target != can.svg && can.page.Remove(can, event.target)
    },
    _select: function(event, can, point) {var target = event.target
        while (target) {
            if (target.tagName == "g") {
                can.Action("group", target.Value("class"))
                can.group = target
                break
            }
            if (target.tagName == "svg") {
                can.Action("group", "svg")
                can.group = can.svg
                break
            }
            target = target.parentNode
        }
        can.point = []
    },

    oncontextmenu: function(event, can) {var target = event.target
        var figure = can.onaction._get(can, target);
        can.user.carte(event, shy("", can.ondetail, figure.data.detail || can.ondetail.list, function(event, key, meta) {var cb = meta[key];
            typeof cb == "function" && cb(event, can, figure, key, target);
        }), can), event.stopPropagation(), event.preventDefault()
    },
    onclick: function(event, can) {
        var p = can.svg.getBoundingClientRect();
        var point = {x: event.clientX-p.x, y: event.clientY-p.y};
        point.x = point.x - point.x % parseInt(can.Action("grid"));
        point.y = point.y - point.y % parseInt(can.Action("grid"));
        can.point = (can.point || []).concat([point]);

        can.temp && can.page.Remove(can, can.temp) && delete(can.temp);
        can.temp = can.onaction["_"+can.Action("mode")](event, can, can.point);
        can.point.length == 0 && delete(can.temp);
    },
    onmouseover: function(event, can) {
        can.Status(event, event.target, "which")
    },
    onmousemove: function(event, can) {
        var p = can.svg.getBoundingClientRect()
        var point = {x: event.clientX-p.x, y: event.clientY-p.y}
        point.x = point.x - point.x % parseInt(can.Action("grid"));
        point.y = point.y - point.y % parseInt(can.Action("grid"));
        can.Status(event, point, "point")

        var pos = can.page.Prepos(event, event.target)

        if (can.Action("go") == "auto" && can.point.length == 0) {
            if (event.target.tagName == "text") {

            } else if (event.target == can.svg) {
                if (pos == 5) {
                    can.Action("mode", "draw")
                    can.Action("shape", "think")
                } else {
                    can.Action("mode", "resize")
                }
            } else {
                if (pos == 5) {
                    can.Action("mode", "move")
                } else {
                    can.Action("mode", "draw")
                    can.Action("shape", "line")
                }
            }
        }

        // if (["move", "resize"].indexOf(can.Action("mode"))) {
            // can.current || 
        // }

        can.temp && can.page.Remove(can, can.temp) && delete(can.temp);
        can.temp = can.onaction["_"+can.Action("mode")](event, can, can.point.concat(point));
        can.point.length == 0 && delete(can.temp);
    },
})
Volcanos("onchoice", {help: "组件交互", list: ["move", "draw", "保存", "添加", "删除"],
    "move": function(event, can, msg, cmd, target) {
        can.Action("mode", cmd)
    },
    "draw": function(event, can, msg, cmd, target) {
        can.Action("mode", cmd)
    },
})
Volcanos("ondetail", {help: "组件详情", list: ["标签", "编辑", "复制", "变色", "运行", "删除"],
    "标签": function(event, can, value, cmd, target) {
        var def = value.def; can.page.Select(can, can.svg, "."+target.Value("text"), function(item) {
            def = item.Value("inner")
        })
        can.user.prompt("文字", function(text) {
            if (target.tagName == "text") {return target.innerHTML = text}

            if (can.page.Select(can, can.svg, "."+target.Value("text"), function(item) {
                item.Value("inner", text)
            }).length > 0) {
                return
            }

            var figure = can.onaction._get(can, target);
            var data = figure.text(event, can, {inner: text}, target)
            var obj = can.onaction.push(event, can, data, "text", target.Group())
            target.Value("text", obj.Value("pid"))
        }, def, value.silent)
    },
    "编辑": function(event, can, value, cmd, target) {
        var figure = can.onaction._get(can, target);
        can.user.input(event, can, can.core.List(["x", "y"].concat(figure.data.copy||[]), function(item) {
            return {_input: "text", name: item, value: target.Value(item)}
        }), function(event, cmd, meta, list) {
            can.core.Item(meta, function(key, value) {
                target.Value(key, value)
            })
        })
    },
    "复制": function(event, can, value, cmd, target) {
        var figure = can.onaction._get(can, target).data;
        var data = {}
        can.core.List(figure.copy, function(item) {data[item] = target.Value(item)});
        data[figure.size.x||"x"] = parseInt(target.Value(figure.size.x||"x"))+20;
        data[figure.size.y||"y"] = parseInt(target.Value(figure.size.y||"y"))+20;

        var p = data && can.onaction.push(event, can, data, target.tagName, can.group||can.svg)
        can.page.Select(can, can.svg, "."+target.Value("text"), function(item) {
            can.ondetail["标签"](event, can, {silent: true, def: item.Value("inner")}, "", p);
        })

        return p
    },
    "变色": function(event, can, value, cmd, target) {
        if (target._timer) {
            target._timer.stop = true
            delete(target._timer)
            return
        }

        var list = ["red", "green", "yellow", "blue"]
        target._timer = can.core.Timer({value: 500, length: -1}, function() {
            target.Value("fill", list[parseInt(Math.random()*list.length%list.length)])
        })
    },
    "运行": function(event, can, value, cmd, target) {
        if (target._timer) {
            target._timer.stop = true
            delete(target._timer)
            return
        }

        target._timer = can.core.Timer({value: 500, length: -1}, function(event) {
            can.onaction._run({type: "click", target: target}, can, target)
        })
    },
    "删除": function(event, can, value, cmd, target) {can.page.Remove(can, target)},
})
Volcanos("onstatus", {help: "组件状态", list: ["point", "which", "begin", "width", "keys"],
    "point": function(event, can, value, cmd, target) {target.innerHTML = value.x+","+value.y},
    "which": function(event, can, value, cmd, target) {
        var figure = can.onaction._get(can, value);
        target.innerHTML = (value.Group && value.Group().Value("class") || "") + " " + value.tagName + " " + (
            figure? figure.show(event, can, value, value): "")
    },
    "begin": function(event, can, value, cmd, target) {target.innerHTML = value? value.x+","+value.y: ""},
    "width": function(event, can, value, cmd, target) {target.innerHTML = value? value.Val("width")+","+value.Val("height"): ""},
    "keys": function(event, can, value, cmd, target) {target.innerHTML = value},
})
Volcanos("onexport", {help: "导出数据", list: [],
    file: function(event, can, svg, cmd, target) {
        return ['<svg vertion="1.1" xmlns="https://www.w3.org/2000/svg" text-anchor="middle" dominant-baseline="middle"'].concat(
            svg? can.core.List(["count", "width", "height", "font-size", "stroke-width", "stroke", "fill"], function(item) {
                return svg.Value(item)? ' ' + item + '="' + svg.Value(item) + '"': ""
            }): []).concat(['>', svg? svg.innerHTML: "", "</svg>"]).join("")
    },
})

