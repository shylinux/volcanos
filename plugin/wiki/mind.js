Volcanos("onimport", {help: "导入数据", list: [],
    _begin: function(can) {
    },
    _start: function(can) {
        can.Action("stroke-width", 2)
        can.Action("stroke", "yellow")
        can.Action("fill", "purple")
        can.Action("grid", "20")
    },
    init: function(can, msg, cb, output, action, option) {output.innerHTML = "";
        if (msg.append && msg.append.length > 0) {action.innerHTML = "";
            var table = can.page.AppendTable(can, output, msg, msg.append);
            table.onclick = function(event) {switch (event.target.tagName) {
                case "TD":
                    can.onimport.which(event, table, msg.append, function(index, key) {
                        can.run(event, [can.Option("name", event.target.innerHTML.trim())])
                    })
                    break
                case "TH":
                    break
                case "TR":
                case "TABLE":
            }}
            return typeof cb == "function" && cb(msg), table;
        }

        var code = can.page.Append(can, output, [{view: ["code", "div", msg.Result()||can.Export(event, null, "file")]}]).code;
        can.page.Select(can, output, "svg", function(svg) {can.group = can.svg = svg;
            can.onaction.init(event, can, msg, "init", svg);
            can.onaction.list[2] = ["group", "svg", "add"];
            can.page.Select(can, svg, "*", function(item, index) {
                can.onaction.init(event, can, msg, index, item);
                switch (item.tagName) {
                    case "g":
                        can.onaction.list[2].push(item.Value("class"));
                        break
                }
            })
        }), can.point = [];

        return typeof cb == "function" && cb(msg), code;
    },
    which: function(event, table, list, cb) {if (event.target == table) {return cb(-1, "")}
        can.page.Select(can, table, "tr", function(tr, index) {if (event.target == tr) {return cb(index-1, "")}
            can.page.Select(can, tr, "th,td", function(td, order) {
                if (event.target == td) {return cb(index-1, list[order])}
            })
        })
    },
})
Volcanos("onfigure", {help: "图形绘制", list: [],
    select: {draw: function(event, can, point) {if (point.length == 1) {return}
        var p0 = point[0], p1 = point[1];
        var data = {
            "x": p0.x > p1.x? p1.x: p0.x,
            "y": p0.y > p1.y? p1.y: p0.y,
            "width": Math.abs(p0.x-p1.x),
            "height": Math.abs(p0.y-p1.y),
            "fill": "#11000000",
            "class": "temp",
        }
        can.Status(event, data, "width");
        event.type == "click" && point.length == 2 && (can.point = [])
        return data;
    }},
    resize: {draw: function(event, can, point) {
        if (point.length == 1) {if (event.type != "click") {return}
            // 记录图形
            can.current = {target: event.target}
        } else if (point.length == 2) {
            if (event.type == "click") {can.point = [], delete(can.current); return}
        }

        var target = can.current.target
        var figure = can.onfigure[target.tagName];
        if (point.length == 1) {
            // 记录起点
            can.core.Item(figure.data.resize, function(key, value) {
                can.current[key] = parseInt(target.Value(value))
            })
        } else {
            var resize = figure.data.resize;
            target.Value(resize.width, can.current.width + point[1].x - point[0].x)
            target.Value(resize.height, can.current.height + point[1].y - point[0].y)
        }
    }},
    move: {draw: function(event, can, point) {
        if (point.length == 1) {if (event.type != "click") {return}
            // 记录图形
            can.current = {target: event.target}
        } else if (point.length == 2) {
            if (event.type == "click") {return can.point = [], delete(can.current), null}
        }

        var target = can.current.target
        var figure = can.onfigure[can.current.target.tagName];
        var move = figure.data.move || {x: "x", y: "y"}
        if (point.length == 1) {
            // 记录起点
            can.current.x = parseInt(target.Value(move.x))
            can.current.y = parseInt(target.Value(move.y))
        } else {
            // 移动图形
            target.Value(move.x, can.current.x+point[1].x-point[0].x)
            target.Value(move.y, can.current.y+point[1].y-point[0].y)
        }
    }},
    svg: {
        data: {resize: {width: "width", height: "height"}},
        show: function(event, can, value, target) {},
    },
    text: {
        data: {move: {x: "x", y: "y"}}, // <text x="60" y="10">hi<text>
        show: function(event, can, value, target) {}
    },
    rect: {
        data: {
            resize: {width: "width", height: "height"},
            move: {x: "x", y: "y"}, copy: ["width", "height", "rx", "ry"],
            rx: 4, ry: 4,
        }, // <rect x="60" y="10" rx="10" ry="10" width="30" height="30"/>
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
            can.Status(event, data, "width");
            return event.type == "click" && point.length == 2 && (can.point = []), data;
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
    line: {
        data: {
            resize: {width: "x2", height: "y2"},
            move: {x: "x1", y: "y1"}, copy: ["x1", "y1", "x2", "y2"],
        },  // <line x1="10" x2="50" y1="110" y2="150"/>
        draw: function(event, can, point) {if (point.length < 2) {return}
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
    circle: {
        data: {move: {x: "cx", y: "cy"}, copy: ["r"]}, // <circle cx="25" cy="75" r="20"/>
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
        data: {}, // <ellipse cx="75" cy="75" rx="20" ry="5"/>
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
Volcanos("onaction", {help: "组件菜单", list: ["保存", "清空",
        ["group", "svg", "add"],
        ["stroke-width", 1, 2, 3, 4, 5],
        ["stroke", "red", "yellow", "green", "purple", "blue", "cyan", "white", "black"],
        ["fill", "red", "yellow", "green", "purple", "blue", "cyan", "white", "black", "#0000"],
        ["shape", "move", "select", "resize", "rect", "circle", "ellipse", "path", "line", "polyline", "polygon"],
        ["grid", 1, 2, 3, 4, 5, 10, 20],
    ],
    "保存": function(event, can, msg, cmd, target) {
        can.run(event, ["action", cmd, can.Option("name"), can.Export(event, can.svg, "file")], function() {
            can.user.toast("保存成功")
        }, true)
    },
    "清空": function(event, can, msg, cmd, target) {can.svg.innerHTML = ""},

    group: function(event, can, value, cmd, target) {
        switch (value) {
            case "svg": return can.group = can.svg;
            case "add": 
                can.user.prompt("add group", function(name) {
                    can.svg.append(can.onaction.init(event, can, value, cmd, can.group = document.createElementNS('http://www.w3.org/2000/svg', 'g')))
                    can.group.Value("class", name)
                    can.core.List(["stroke-width", "stroke", "fill"], function(name) {
                        can.group.Value(name, can.Action(name))
                    })
                    can.page.Select(can, can.action, "select.group", function(item) {
                        can.page.Append(can, item, [{type: "option", value: name, inner: name}]);
                        item.value = name
                    })
                })
                break
            default:
                can.page.Select(can, can.svg, "g."+value, function(item) {
                    can.group = item
                })
        }
        return can.group
    },
    "stroke-width": function(event, can, value, cmd, target) {can.group.Value(cmd, value)},
    stroke: function(event, can, value, cmd, target) {can.group.Value(cmd, value)},
    fill: function(event, can, value, cmd, target) {can.group.Value(cmd, value)},
    shape: function(event, can, value, cmd, target) {can.shape = value},
    grid: function(event, can, value, cmd, target) {can.grid = value},

    init: function(event, can, msg, cmd, item) {
        item.ondblclick = item.oncontextmenu = function(event) {can.user.carte(event, shy("", can.ondetail, can.ondetail.list, function(event, key, meta) {var cb = meta[key];
            typeof cb == "function" && cb(event, can, msg, cmd, key, key, item);
        }), can), event.stopPropagation(), event.preventDefault()}
        item.onclick = function() {
        }
        item.Value = function(key, value) {return value && item.setAttribute(key, value), item.getAttribute(key||"class")||item[key]&&item[key].baseVal&&item[key].baseVal.value||item[key]&&item[key].baseVal||""}
        return item;
    },
    push: function(event, can, msg, cmd, target) {cmd = {select: "rect"}[cmd] || cmd
        var rect = document.createElementNS("http://www.w3.org/2000/svg", cmd);
        target.appendChild(can.onaction.init(event, can, msg, cmd, rect));
        can.core.Item(msg, function(key, value) {rect.Value(key, value)});
        return rect;
    },
    draw: function(event, can, point) {
        can.Status(event, null, "width");
        can.Status(event, null, "begin");
        can.Status(event, point[0], "begin")

        var shape = can.page.Select(can, can.action, "select.shape", function(item) {return item.value})[0]
        var figure = can.onfigure[shape];
        var data = figure && figure.draw(event, can, point);
        return data && can.onaction.push(event, can, data, shape, can.group||can.svg)
    },

    onclick: function(event, can) {if (!can.svg) {return}
        var p = can.svg.getBoundingClientRect();
        var point = {x: event.clientX-p.x, y: event.clientY-p.y};
        point.x = point.x - point.x % parseInt(can.Action("grid"));
        point.y = point.y - point.y % parseInt(can.Action("grid"));

        can.point = (can.point || []).concat([point]);
        can.temp && can.page.Remove(can, can.temp) && delete(can.temp);
        can.onaction.draw(event, can, can.point);
    },
    onmouseover: function(event, can) {
        can.Status(event, event.target, "which")
    },
    onmousemove: function(event, can) {if (!can.svg || can.point.length == 0) {return}
        var p = can.svg.getBoundingClientRect()
        var point = {x: event.clientX-p.x, y: event.clientY-p.y}
        point.x = point.x - point.x % parseInt(can.Action("grid"));
        point.y = point.y - point.y % parseInt(can.Action("grid"));

        can.temp && can.page.Remove(can, can.temp) && delete(can.temp)
        can.temp = can.onaction.draw(event, can, can.point.concat(point))

        can.Status(event, point, "point")
    },
})
Volcanos("onchoice", {help: "组件交互", list: ["保存", "清空"]})
Volcanos("ondetail", {help: "组件详情", list: ["编辑", "复制", "删除"],
    "编辑": function(event, can, msg, index, key, cmd, target) {
        can.user.prompt("文字", function(text) {
            if (target.tagName == "text") {return target.innerHTML = text}

            var data = {"text-anchor": "middle", "dominant-baseline": "middle"}
            var figure = can.onfigure[target.tagName]
            figure.text(event, can, data, target)

            var p = can.onaction.push(event, can, data, "text", can.svg)
            p.innerHTML = text;

            target.Text && can.page.Remove(can, target.Text) && delete(target.Text)
            target.Text = p
        }, target.Text && target.Text.innerText || "")
    },
    "复制": function(event, can, msg, index, key, cmd, target) {
        var figure = can.onfigure[target.tagName].data
        var data = {}
        data[figure.move.x] = parseInt(target.Value(figure.move.x))+20;
        data[figure.move.y] = parseInt(target.Value(figure.move.y))+20;
        can.core.List(figure.copy, function(item) {data[item] = target.Value(item)});
        return data && can.onaction.push(event, can, data, target.tagName, can.group||can.svg)
    },
    "删除": function(event, can, msg, index, key, cmd, target) {can.page.Remove(can, target)},
})
Volcanos("onstatus", {help: "组件状态", list: ["begin", "width", "point", "which"],
    "begin": function(event, can, value, cmd, target) {target.innerHTML = value? value.x+","+value.y: ""},
    "width": function(event, can, value, cmd, target) {target.innerHTML = value? value.width+","+value.height: ""},
    "point": function(event, can, value, cmd, target) {target.innerHTML = value.x+","+value.y},
    "which": function(event, can, value, cmd, target) {var figure = can.onfigure[value.tagName];
        target.innerHTML = figure? figure.show(event, can, value, target): value.tagName;
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    file: function(event, can, svg, cmd, target) {
        return ['<svg vertion="1.1" xmlns="https://www.w3.org/2000/svg"'].concat(svg? can.core.List(["width", "height", "stroke-width", "stroke", "fill"], function(item) {
            return svg.Value(item)? ' ' + item + '="' + svg.Value(item) + '"': ""
        }): []).concat(['>', svg?svg.innerHTML:"", "</svg>"]).join("")
    },
})

