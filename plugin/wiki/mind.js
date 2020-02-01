Volcanos("onimport", {help: "导入数据", list: [],
    init: function(can, msg, cb, output, action, option) {output.innerHTML = "";
        if (msg.append && msg.append.length > 0) {
            var table = can.page.AppendTable(can, output, msg, msg.append);
            table.onclick = function(event) {switch (event.target.tagName) {
                case "TD":
                    can.onimport.which(event, table, msg.append, function(index, key) {
                        can.Option("name", event.target.innerHTML.trim())
                        can.run(event, [event.target.innerHTML.trim()], function(msg) {})
                    })
                    break
                case "TH":
                    break
                case "TR":
                case "TABLE":
            }}
            return typeof cb == "function" && cb(msg), table;
        }

        var code = can.page.Append(can, output, [{view: ["code", "div", msg.Result()]}]).code;
        can.page.Select(can, output, "svg", function(item) {can.svg = item, item.Value = function(key) {return item[key].baseVal.value}});
        can.page.Select(can, output, "svg *", function(item, index) {
            can.onaction.init(event, can, msg, index, item);
        })
        can.point = []
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
    rect: {
        data: {rx: 4, ry: 4}, // <rect x="60" y="10" rx="10" ry="10" width="30" height="30"/>
        draw: function(event, can, point, color) {
            var p0 = point[0], p1 = point[1];
            var data = {
                "x": p0.x > p1.x? p1.x: p0.x,
                "y": p0.y > p1.y? p1.y: p0.y,
                "width": Math.abs(p0.x-p1.x),
                "height": Math.abs(p0.y-p1.y),
            }
            can.core.Item(can.onfigure.rect.data, function(key, value) {
                data[key] = value
            }), data.fill = color
            can.Status(event, data, "width");
            event.type == "click" && point.length == 2 && (can.point = [])
            return data;
        },
        text: function(event, can, data, target) {
            data.x = target.x.baseVal.value+target.width.baseVal.value/2
            data.y = target.y.baseVal.value+target.height.baseVal.value/2
            return data
        },
        copy: function(event, can) {

        },
        show: function(event, can, value, target) {
            return value.tagName
                + ": (" + value.x.baseVal.value + "," + value.y.baseVal.value+ ")"
                + " + (" + value.width.baseVal.value + "," + value.height.baseVal.value+ ")"
        },
    },
    circle: {
        data: {}, // <circle cx="25" cy="75" r="20"/>
        draw: function(event, can, point, color) {
            var p0 = point[0], p1 = point[1];
            var data = {
                "cx": p0.x, "cy": p0.y,
                "r": Math.sqrt(Math.pow(p0.x-p1.x, 2)+Math.pow(p0.y-p1.y, 2)),
                "fill": color,
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
                + " > (" + parseInt(value.r.baseVal.value) + ")"
        },
    },
    ellipse: {
        data: {}, // <ellipse cx="75" cy="75" rx="20" ry="5"/>
        draw: function(event, can, point, color) {
            var p0 = point[0], p1 = point[1];
            var data = {
                "cx": p0.x, "cy": p0.y,
                "rx": Math.abs(p0.x - p1.x), "ry": Math.abs(p0.y - p1.y),
                "fill": color,
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
    line: {
        data: {},  // <line x1="10" x2="50" y1="110" y2="150"/>
        draw: function(event, can, point, color) {
            var p0 = point[0], p1 = point[1];
            var data = {
                "x1": p0.x, "y1": p0.y,
                "x2": p1.x, "y2": p1.y,
                "stroke": color,
            }
            event.type == "click" && point.length == 2 && (can.point = [])
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
    path: {
        data: {},  //  <path d="M10 10 H 90 V 90 H 10 Z" fill="transparent" stroke="black"/>
        draw: function(event, can, point, color) {
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
            console.log(data)
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
        draw: function(event, can, point, color) {if (point.length < 2) {return}
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
        draw: function(event, can, point, color) {if (point.length < 2) {return}
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
Volcanos("onaction", {help: "组件菜单", list: ["保存",
        ["color", "red", "yellow", "green", "purple", "blue", "cyan", "white", "black"],
        ["shape", "rect", "circle", "ellipse", "path", "line", "polyline", "polygon"],
    ],
    "保存": function(event, can, msg, cmd, target) {
        can.run(event, ["action", cmd, can.Option("name"),
            '<svg vertion="1.1" xmlns="https://www.w3.org/2000/svg" width="'+can.svg.Value("width")+'" height="'+can.svg.Value("height")+'">',
            can.svg.innerHTML,
            "</svg>",
            ], function() {
            can.user.toast("保存成功")
        }, true)
    },
    color: function(event, can, value, cmd, target) {can.color = value},
    shape: function(event, can, value, cmd, target) {can.shape = value},

    resize: function(event, can, value, cmd, item) {var target = can.target.firstChild;
        if (cmd == "x") {target.style.width = target.offsetHeight + value + "px"}
        if (cmd == "y") {target.style.height = target.offsetHeight + value + "px"}
    },

    init: function(event, can, msg, cmd, item) {
        item.ondblclick = item.oncontextmenu = function(event) {can.user.carte(event, shy("", can.ondetail, can.ondetail.list, function(event, key, meta) {var cb = meta[key];
            typeof cb == "function" && cb(event, can, msg, cmd, key, key, item);
        }), can), event.stopPropagation(), event.preventDefault()}
        item.onclick = function() {
        }
        return item;
    },
    push: function(event, can, msg, cmd, target) {
        var rect = document.createElementNS("http://www.w3.org/2000/svg", cmd);
        can.core.Item(msg, function(key, value) {rect.setAttribute(key, value)});
        target.appendChild(can.onaction.init(event, can, msg, cmd, rect));
        return rect;
    },
    draw: function(event, can, point) {
        can.Status(event, null, "width");
        can.Status(event, null, "begin");
        if (point.length == 1) {return}
        can.Status(event, point[0], "begin")

        var color = can.page.Select(can, can.action, "select.color", function(item) {return item.value})[0]

        var shape = can.page.Select(can, can.action, "select.shape", function(item) {return item.value})[0]
        var figure = can.onfigure[shape];
        var data = figure && figure.draw(event, can, point, color);
        return data && can.onaction.push(event, can, data, shape, can.svg)
    },

    onclick: function(event, can) {if (!can.svg) {return}
        var p = can.svg.getBoundingClientRect()
        var point = {x: event.clientX-p.x, y: event.clientY-p.y}

        can.point = (can.point || []).concat([point])
        can.onaction.draw(event, can, can.point)
    },
    onmouseover: function(event, can) {
        can.Status(event, event.target, "which")
    },
    onmousemove: function(event, can) {if (!can.svg) {return}
        var p = can.svg.getBoundingClientRect()
        var point = {x: event.clientX-p.x, y: event.clientY-p.y}

        can.temp && can.page.Remove(can, can.temp) && delete(can.temp)
        can.temp = can.onaction.draw(event, can, can.point.concat(point))

        can.Status(event, point, "point")
    },
    onkeydown: function(event, can) {
        if (event.key == "Enter") {
            can.point = []
            return
        }
    },
})
Volcanos("onchoice", {help: "组件交互", list: ["保存", "清空", ["rect", "rect", "line", "circle"]],
    "清空": function(event, can, msg, cmd, target) {
        console.log("choice", cmd)
    },
})
Volcanos("ondetail", {help: "组件详情", list: ["编辑", "删除"],
    "编辑": function(event, can, msg, index, key, cmd, target) {
        can.user.prompt("文字", function(text) {
            if (target.tagName == "text") {return target.innerHTML = text}

            var color = can.page.Select(can, can.action, "select.color", function(item) {return item.value})[0]

            var data = {"text-anchor": "middle", "dominant-baseline": "middle", "stroke": color}
            var figure = can.onfigure[target.tagName]
            figure.text(event, can, data, target)

            var p = can.onaction.push(event, can, data, "text", can.svg)
            p.innerHTML = text;

            target.Text && can.page.Remove(can, target.Text) && delete(target.Text)
            target.Text = p
        }, target.Text && target.Text.innerText || "")
    },
    "复制": function(event, can, msg, index, key, cmd, target) {
        var figure = can.onfigure[target.tagName]
        figure.copy(event, can, target)
    },
    "删除": function(event, can, msg, index, key, cmd, target) {
        can.page.Remove(can, target)
    },
})
Volcanos("onstatus", {help: "组件状态", list: ["begin", "width", "point", "which"],
    "begin": function(event, can, value, cmd, target) {target.innerHTML = value? value.x+","+value.y: ""},
    "width": function(event, can, value, cmd, target) {target.innerHTML = value? value.width+","+value.height: ""},
    "point": function(event, can, value, cmd, target) {target.innerHTML = value.x+","+value.y},
    "which": function(event, can, value, cmd, target) {var figure = can.onfigure[value.tagName];
        target.innerHTML = figure? figure.show(event, can, value, target): value.tagName;
    },
})
Volcanos("onexport", {help: "导出数据", list: []})

