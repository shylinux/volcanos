Volcanos("onimport", {help: "导入数据", list: [],
    _begin: function(can) {},
    _start: function(can) {
        var def = {
            "font-size": "24",
            "fill": "purple",
            "stroke": "yellow",
            "stroke-width": 2,
            "grid": "10",
        }
        can.core.Item(def, function(key, value) {
            can.svg && can.svg.Value(key, can.Action(key, can.svg.Value(key)||value))
        })
        can.Action("mode", "select")
    },
    init: function(can, msg, cb, output, action, option) {output.innerHTML = "";
        can.page.AppendTable(can, output, msg, msg.append, function(event, value, key, index, tr, td) {
            can.Export(event, value, key)
        });

        var code = can.page.Append(can, output, [{view: ["code", "div", msg.Result()||can.Export(event, null, "file")]}]).code;
        can.page.Select(can, output, "svg", function(svg) {
            can.group = can.svg = svg;
            can.onaction.init(event, can, msg, "init", svg);

            var list = can.core.List(can.onaction.list, function(item, index) {if (item[0] == "group") {
                return can.onaction.list[index] = ["group", "svg"]
            }})[0]

            // 分组
            can.page.Select(can, svg, "*", function(item, index) {
                can.onaction.init(event, can, msg, index, item);

                switch (item.tagName) {
                    case "g":
                        list.push(item.Value("class"));
                        break
                }
            })
        })
        can.point = [];
        can.keys = [];
        return typeof cb == "function" && cb(msg);
    },
    keydown: function(event, can, value, cmd, target) {
        can.keys.push(value)

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
    draw: function(event, can, value) {
        var figure = can.onfigure[value.shape]
        var data = figure.draw(event, can, value.point, value.style)
        return can.onaction.push(event, can, data, value.shape, can.group||can.svg)
    },
}, ["/plugin/wiki/draw.css"])
Volcanos("onfigure", {help: "图形绘制", list: [],
    svg: {
        data: {
            size: {x: "x", y: "y"},
        },
        show: function(event, can, value, target) {
            return can.svg.Val("width") +","+ can.svg.Val("width")
        },
    },
    rect: {
        data: {
            rx: 4, ry: 4,
            size: {x: "x", y: "y"},
            copy: ["width", "height", "rx", "ry"],
        }, // <rect x="60" y="10" rx="10" ry="10" width="30" height="30"/>
        draw: function(event, can, point, style) {if (point.length < 2) {return}
            var p0 = point[0], p1 = point[1];
            var data = {
                "x": p0.x > p1.x? p1.x: p0.x,
                "y": p0.y > p1.y? p1.y: p0.y,
                "width": Math.abs(p0.x-p1.x),
                "height": Math.abs(p0.y-p1.y),
                "rx": this.data.rx,
                "ry": this.data.ry,
            }
            can.core.Item(style, function(key, value) {data[key] = value})
            can.Status(event, data, "width");
            return event.type == "click" && point.length == 2 && (can.point = []), data;
        },
        space: function(event, can) {
            can.user.prompt("width", function(width) {
                can.user.prompt("height", function(height) {
                    can.temp && can.page.Remove(can, can.temp) && delete(can.temp)
                    can.onaction.push(event, can, can.onfigure.rect.draw(event, can, [can.point[0], [can.point[0]+width, can.point[1]+height]]), "rect", can.group||can.svg)
                    can.point = []
                })
            })
        },
        text: function(event, can, data, target) {
            data.x = target.x.baseVal.value+target.width.baseVal.value/2
            data.y = target.y.baseVal.value+target.height.baseVal.value/2
            return data
        },
        show: function(event, can, value, target) {
            return value.parentNode.Value("class") + " " + value.tagName
                + ": (" + value.x.baseVal.value + "," + value.y.baseVal.value+ ")"
                + " + (" + value.width.baseVal.value + "," + value.height.baseVal.value+ ")"
        },
    },
    circle: {
        data: {
            size: {x: "cx", y: "cy", width: "r", height: "r"},
            copy: ["r"],
        }, // <circle cx="25" cy="75" r="20"/>
        draw: function(event, can, point) {
            if (point.length == 1) {return}
            var p0 = point[0], p1 = point[1];
            var data = {
                "cx": p0.x, "cy": p0.y,
                "r": Math.sqrt(Math.pow(p0.x-p1.x, 2)+Math.pow(p0.y-p1.y, 2)),
            }
            event.type == "click" && point.length == 2 && (can.point = [])
            return data;
        },
        text: function(event, can, data, target) {
            data.x = target.cx.baseVal.value
            data.y = target.cy.baseVal.value
            return data
        },
        show: function(event, can, value, target) {
            return value.parentNode.Value("class") + " " + value.tagName
                + ": (" + value.cx.baseVal.value + "," + value.cy.baseVal.value+ ")"
                + " > (" + parseInt(value.r.baseVal.value) + ")"
        },
    },
    ellipse: {
        data: {
            size: {x: "cx", y: "cy", width: "rx", height: "ry"},
        }, // <ellipse cx="75" cy="75" rx="20" ry="5"/>
        draw: function(event, can, point) {
            var p0 = point[0], p1 = point[1];
            var data = {
                "cx": p0.x, "cy": p0.y,
                "rx": Math.abs(p0.x - p1.x), "ry": Math.abs(p0.y - p1.y),
            }
            event.type == "click" && point.length == 2 && (can.point = [])
            return data;
        },
        text: function(event, can, data, target) {
            data.x = target.cx.baseVal.value
            data.y = target.cy.baseVal.value
            return data
        },
        show: function(event, can, value, target) {
            return value.tagName
                + ": (" + value.cx.baseVal.value + "," + value.cy.baseVal.value+ ")"
                + " > (" + parseInt(value.rx.baseVal.value) + parseInt(value.ry.baseVal.value) + ")"
        },
    },
    text: {
        data: {
            size: {x: "x", y: "y"},
        }, // <text x="60" y="10">hi<text>
        draw: function(event, can, point) {if (point.length < 1) {return}
            var p0 = point[0];
            var data = {
                "x": p0.x, "y": p0.y,
                "inner": can.user.prompt("text"),
            }
            return can.point = [], data;
        },
        show: function(event, can, value, target) {
            return value.parentNode.Value("class") + " " + value.tagName
                + ": (" + target.Val("x") + "," + target.Val("y")+ ")"
        }
    },
    line: {
        data: {
            size: {x: "x1", y: "y1", x2: "x2", y: "y2"},
            copy: ["x1", "y1", "x2", "y2"],
        },  // <line x1="10" x2="50" y1="110" y2="150"/>
        draw: function(event, can, point) {
            if (point.length < 2) {return}
            var p0 = point[0], p1 = point[1];
            var data = {
                "x1": p0.x, "y1": p0.y,
                "x2": p1.x, "y2": p1.y,
            }
            return event.type == "click" && point.length == 2 && (can.point = []), data;
        },
        text: function(event, can, data, target) {
            data.x = (target.x1.baseVal.value + target.x2.baseVal.value) / 2
            data.y = (target.y1.baseVal.value + target.y2.baseVal.value) / 2
            return data
        },
        show: function(event, can, value, target) {
            return value.tagName
                + ": (" + value.x1.baseVal.value + "," + value.y1.baseVal.value+ ")"
                + " - (" + value.x2.baseVal.value + "," + value.y2.baseVal.value+ ")"
        },
    },

    path: {
        data: {},  //  <path d="M10 10 H 90 V 90 H 10 Z" fill="transparent" stroke="black"/>
        draw: function(event, can, point) {
            var data = {
                d: can.core.List(point, function(p, i) {
                    switch (i) {
                        case 0: return "M " + p.x + " " + p.y; break
                        case 1: return "H " + p.x; break
                        case 2: return "V " + p.y; break
                        case 3: return "H " + p.x + " Z"; break
                    }
                }).join(" ")
            }
            event.type == "click" && point.length == 4 && (can.point = [])
            return data;
        },
        text: function(event, can, data, target) {
            data.x = (target.x1.baseVal.value + target.x2.baseVal.value) / 2
            data.y = (target.y1.baseVal.value + target.y2.baseVal.value) / 2
            return data
        },
        show: function(event, can, value, target) {
            return value.tagName
                + ": (" + value.x1.baseVal.value + "," + value.y1.baseVal.value+ ")"
                + " - (" + value.x2.baseVal.value + "," + value.y2.baseVal.value+ ")"
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
})
Volcanos("onaction", {help: "组件菜单", list: ["保存", "清空", "删除", "添加",
        ["group", "svg"],
        ["font-size", 12, 16, 18, 24, 32],
        ["stroke-width", 1, 2, 3, 4, 5],
        {text: "c"}, ["stroke", "red", "yellow", "green", "purple", "blue", "cyan", "white", "black"],
        {text: "f"}, ["fill", "red", "yellow", "green", "purple", "blue", "cyan", "white", "black", "#0000"],
        {text: "a"}, ["mode", "draw", "move", "resize", "select", "scale", "delete"],
        {text: "s"}, ["shape", "rect", "circle", "ellipse", "text", "line", "path", "polyline", "polygon"],
        ["grid", 1, 2, 3, 4, 5, 10, 20],
    ],
    "保存": function(event, can, msg, cmd, target) {
        can.run(event, ["action", cmd, can.Option("path"), can.Export(event, can.svg, "file")], function() {
            can.user.toast("保存成功")
        }, true)
    },
    "清空": function(event, can, msg, cmd, target) {can.svg.innerHTML = ""},
    "删除": function(event, can, msg, cmd, target) {
        if (can.group == can.svg) {return}
        can.page.Remove(can, can.group)
        can.page.Select(can, can.action, "option[value="+can.group.Value("class")+"]", function(item) {
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
    "font-size": function(event, can, value, cmd, target) {can.group.Value(value, cmd)},
    "stroke-width": function(event, can, value, cmd, target) {can.group.Value(value, cmd)},
    stroke: function(event, can, value, cmd, target) {can.Action(value, can.group.Value(value, cmd))},
    fill: function(event, can, value, cmd, target) {can.Action(value, can.group.Value(value, cmd))},
    shape: function(event, can, value, cmd, target) {cmd && can.Action(value, cmd)},
    grid: function(event, can, value, cmd, target) {cmd && can.Action(value, cmd)},

    init: function(event, can, msg, cmd, item) {
        item.Value = function(key, value) {
            var figure = can.onfigure[item.tagName];
            key && (key = figure && figure.data && figure.data.size && figure.data.size[key] || key)

            return value && item.setAttribute(key, value), item.getAttribute(key||"class")||item[key]&&item[key].baseVal&&item[key].baseVal.value||item[key]&&item[key].baseVal||"";
        }
        item.Val = function(key, value) {
            return parseInt(item.Value(key, value == undefined? value: parseInt(value)||0));
        }
        item.Group = function() {
            var target = item
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
    push: function(event, can, msg, cmd, target) {cmd = {select: "rect"}[cmd] || cmd
        var rect = document.createElementNS("http://www.w3.org/2000/svg", cmd);
        target.appendChild(can.onaction.init(event, can, msg, cmd, rect));
        can.core.Item(msg, function(key, value) {
            if (key == "inner") {
                rect.innerHTML =  value
                return
            }
            rect.Value(key, value)
        });
        return rect;
    },
    mode: function(event, can, value, cmd) {
        cmd && can.Action("mode", cmd)
    },
    _draw: function(event, can, point) {
        can.Status(event, null, "width");
        can.Status(event, null, "begin");
        can.Status(event, point[0], "begin")

        var shape = can.page.Select(can, can.action, "select.shape", function(item) {return item.value})[0]
        var figure = can.onfigure[shape];
        var data = figure && figure.draw(event, can, point);
        return data && can.onaction.push(event, can, data, shape, can.group||can.svg)
    },
    _move: function(event, can, point) {
        if (point.length == 1) {if (event.type != "click") {return}
            // 记录图形
            can.onaction._select(event, can, point)
            can.point = point, can.current = {target: can.group}
        } else if (point.length == 2) {
            if (event.type == "click") {
                can.point = [], delete(can.current); return
            }
        }

        var target = can.current.target
        var figure = can.onfigure[target.tagName];
        if (point.length == 1) {
            target.style.cursor = "move"
            can.current.pos = 5, can.current.begin = can.page.Select(can, target, "*", function(item) {
                if (item.tagName == "g") {return}
                target.style.cursor = "move"
                return {
                    target: item,
                    x: item.Val("x"),
                    y: item.Val("y"),
                    width: item.Val("width"),
                    height: item.Val("height"),
                }
            })
        } else {
            can.core.List(can.current.begin, function(item) {
                can.page.Resizes(event, item.target, item, point[0], point[1], can.current.pos)
            })
        }
    },
    _resize: function(event, can, point) {
        if (point.length == 1) {if (event.type != "click") {return}
            // 记录图形
            can.current = {target: event.target}
        } else if (point.length == 2) {
            if (event.type == "click") {
                can.point = [], delete(can.current); return
            }
        }

        var target = can.current.target
        var figure = can.onfigure[target.tagName];
        if (point.length == 1) {
            can.current.pos = can.page.Prepos(event, target)
            can.current.begin =  {
                x: target.Val("x"),
                y: target.Val("y"),
                width: target.Val("width"),
                height: target.Val("height"),
            }
        } else {
            can.page.Resizes(event, target, can.current.begin, point[0], point[1], can.current.pos)
        }
    },
    _scale: function(event, can, point) {
        if (point.length < 2) {
            return
        }
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
        event.target != can.svg && can.page.Remove(can, event.target)
        can.point = []
    },
    _select: function(event, can, point) {
        var target = event.target
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

    space: function(event, can) {
        if (!can.current) {return}
        var figure = can.onfigure[can.current.tagName]
        figure && figure.space(event, can)
    },
    oncontextmenu: function(event, can) {var target = event.target
        var figure = can.onfigure[event.target.tagName]||{data: {}}

        can.user.carte(event, shy("", can.ondetail, figure.data.detail || can.ondetail.list, function(event, key, meta) {var cb = meta[key];
            typeof cb == "function" && cb(event, can, figure, key, target);
        }), can), event.stopPropagation(), event.preventDefault()
    },
    onclick: function(event, can) {if (!can.svg) {return}
        var p = can.svg.getBoundingClientRect();
        var point = {x: event.clientX-p.x, y: event.clientY-p.y};
        point.x = point.x - point.x % parseInt(can.Action("grid"));
        point.y = point.y - point.y % parseInt(can.Action("grid"));

        can.point = (can.point || []).concat([point]);
        can.temp && can.page.Remove(can, can.temp) && delete(can.temp);
        can.onaction["_"+can.Action("mode")](event, can, can.point);
    },
    onmouseover: function(event, can) {
        can.Status(event, event.target, "which")
    },
    onmousemove: function(event, can) {
        if (["move", "resize"].indexOf(can.Action("mode"))) {
            can.current || can.page.Prepos(event, event.target)
        }

        if (!can.svg || can.point.length == 0) {return}
        var p = can.svg.getBoundingClientRect()
        var point = {x: event.clientX-p.x, y: event.clientY-p.y}
        point.x = point.x - point.x % parseInt(can.Action("grid"));
        point.y = point.y - point.y % parseInt(can.Action("grid"));

        can.temp && can.page.Remove(can, can.temp) && delete(can.temp)
        can.temp = can.onaction["_"+can.Action("mode")](event, can, can.point.concat(point))

        can.Status(event, point, "point")
    },
})
Volcanos("onchoice", {help: "组件交互", list: ["保存", "清空"]})
Volcanos("ondetail", {help: "组件详情", list: ["编辑", "复制", "删除"],
    "编辑": function(event, can, value, cmd, target) {
        can.user.prompt("文字", function(text) {
            if (target.tagName == "text") {return target.innerHTML = text}

            var data = {}
            var figure = can.onfigure[target.tagName]
            figure.text(event, can, data, target)

            var p = can.onaction.push(event, can, data, "text", target.Group())
            p.innerHTML = text;

            target.Text && can.page.Remove(can, target.Text) && delete(target.Text)
            target.Text = p
        }, target.Text && target.Text.innerText || "")
    },
    "复制": function(event, can, value, cmd, target) {
        var figure = can.onfigure[target.tagName].data
        var data = {}
        data[figure.move.x] = parseInt(target.Value(figure.move.x))+20;
        data[figure.move.y] = parseInt(target.Value(figure.move.y))+20;
        can.core.List(figure.copy, function(item) {data[item] = target.Value(item)});
        return data && can.onaction.push(event, can, data, target.tagName, can.group||can.svg)
    },
    "删除": function(event, can, value, key, cmd, target) {can.page.Remove(can, target)},
})
Volcanos("onstatus", {help: "组件状态", list: ["begin", "width", "point", "which", "keys"],
    "begin": function(event, can, value, cmd, target) {target.innerHTML = value? value.x+","+value.y: ""},
    "width": function(event, can, value, cmd, target) {target.innerHTML = value? value.width+","+value.height: ""},
    "point": function(event, can, value, cmd, target) {target.innerHTML = value.x+","+value.y},
    "which": function(event, can, value, cmd, target) {var figure = can.onfigure[value.tagName];
        target.innerHTML = figure? figure.show(event, can, value, value): value.tagName;
    },
    "keys": function(event, can, value, cmd, target) {target.innerHTML = value},
})
Volcanos("onexport", {help: "导出数据", list: [],
    file: function(event, can, svg, cmd, target) {
        return ['<svg vertion="1.1" xmlns="https://www.w3.org/2000/svg" text-anchor="middle" dominant-baseline="middle"'].concat(svg? can.core.List(["width", "height", "stroke", "fill", "stroke-width"], function(item) {
            return svg.Value(item)? ' ' + item + '="' + svg.Value(item) + '"': ""
        }): []).concat(['>', svg?svg.innerHTML:"", "</svg>"]).join("")
    },
})

