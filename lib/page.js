Volcanos("page", {help: "网页模块",
    ClassList: {
        has: function(can, obj, key) {var list = obj.className? obj.className.split(" "): [];
            for (var i = 2; i < arguments.length; i++) {
                if (list.indexOf(arguments[i]) == -1) {return false}
            }
            return true;
        },
        add: function(can, obj, key) {var list = obj.className? obj.className.split(" "): []
            return obj.className = list.concat(can.core.List(key, function(value, index) {
                return list.indexOf(value) == -1? value: undefined;
            })).join(" ").trim();
        },
        del: function(can, obj, key) {var list = can.core.List(arguments, function(value, index) {return index > 0? value: undefined})
            return obj.className = can.core.List(obj.className.split(" "), function(value) {
                return list.indexOf(value) == -1? value: undefined;
            }).join(" ").trim();
        },
    },

    Select: shy("选择节点", function(can, obj, key, cb, interval, cbs) {
        var item = obj && obj.querySelectorAll(key);
        return can.core.List(item, cb, interval, cbs);
    }),
    Modify: shy("修改节点", function(can, target, value) {
        target = typeof target == "string"? document.querySelector(target): target;
        typeof value == "string"? (target.innerHTML = value): can.core.Item(value, function(key, value) {
            typeof value != "object"? (target[key] = value): can.core.Item(value, function(sub, value) {
                target[key] && (target[key][sub] = value);
            })
        });
        return target;
    }),
    Create: shy("创建节点", function(can, key, value) {
        return can.page.Modify(can, document.createElement(key), value);
    }),
    Append: shy("添加节点", function(can, target, key, value) {
        if (typeof key == "string") {var res = can.page.Create(can, key, value); return target.appendChild(res), res}

        value = value || {}
        can.core.List(key, function(item, index) {if (!item) {return}
            // 基本结构: type name data list
            var type = item.type || "div", data = item.data || {};
            var name = item.name || data.name;
            name && (data.name = data.name || item.name);

            // 数据调整
            can.core.Item(item, function(key, value) {
                switch (key) {
                    case "type":
                    case "name":
                    case "data":
                    case "list":
                        break
                    case "click":
                        data.onclick = item.click;
                        break
                    case "inner":
                        data.innerHTML = item.inner;
                        break
                    default:
                        data[key] = item[key];
                }
            })

            if (item.view) {var list = can.core.List(item.view);
                (list.length > 0 && list[0]) && can.page.ClassList.add(can, data, list[0]);
                type = list[1] || "div";
                data.innerHTML = list[2] || data.innerHTML || "";
                name = name || list[3] || "";

            } else if (item.text) {var list = can.core.List(item.text);
                data.innerHTML = list[0] || data.innerHTML || "";
                type = list[1] || "span";
                list.length > 2 && (data.className = list[2]);

            } else if (item.button) {var list = can.core.List(item.button);
                type = "button", name = name || list[0];
                data.value = data.value || name;
                data.innerText = list[0], data.onclick = function(event) {
                    typeof list[1] == "function" && list[1](event, name);
                    event.stopPropagation()
                    event.preventDefault()
                    return true
                }

            } else if (item.select) {var list = item.select;
                type = "select", name = name || list[0][0];
                data.onchange = function(event) {
                    typeof list[1] == "function" && list[1](event, event.target.value, name);
                }
                item.list = list[0].slice(1).map(function(value) {
                    return {type: "option", value: value, inner: value};
                })
                data.className = list[0][0] || "";
                data.title = data.title || name;
                data.name = name;

            } else if (item.input) {var list = can.core.List(item.input);
                type = "input", name = name || list[0] || "";
                data.name = data.name || name;
                data.className = data.className || data.name;
                data.placeholder = data.placeholder || data.name;
                data.title = data.title || data.placeholder;
                data.autocomplete = "none"

                data.onkeydown = function(event) {
                    typeof list[1] == "function" && list[1](event);
                }
                data.onkeyup = function(event) {
                    typeof list[2] == "function" && list[2](event);
                }
            } else if (item.username) {var list = can.core.List(item.username);
                type = "input", name = name || list[0] || "username";
                data.name = data.name || name;
                data.className = list[1] || data.className || data.name;
                data.placeholder = data.placeholder || data.name;
                data.title = data.title || data.placeholder;
                data.autocomplete = data.autocomplete || "username"

            } else if (item.password) {var list = can.core.List(item.password);
                type = "input", name = name || list[0] || "password";
                data.type = "password"
                data.name = data.name || name;
                data.className = list[1], data.className || data.name;
                data.placeholder = data.placeholder || data.name;
                data.title = data.title || data.placeholder;
                data.autocomplete = data.autocomplete || "current-password"

            } else if (item.img) {var list = can.core.List(item.img);
                type = "img";
                data.src = list[0];

            } else if (item.row) {type = "tr";
                item.list = item.row.map(function(text) {return {text: [text, item.sub||"td"]}});
            } else if (item.include) {var list = can.core.List(item.include);
                type = "script";
                data.src = list[0];
                data.onload = list[1];
            }


            // 创建节点
            name = name || data.className || type;
            var node = can.page.Create(can, type, data);
            value.last = node, value.first || (value.first = node), name && (value[name] = value[data.className||""] = value[type] = node);
            item.list && can.page.Append(can, node, item.list, value);
            target && target.append && target.append(node);
        })
        return value
    }),
    Appends: shy("添加节点", function(can, target, key, value) {
        return target.innerHTML = "", can.page.Append(can, target, key, value)
    }),
    Remove: shy("删除节点", function(can, target, key, value) {
        target.parentNode && target.parentNode.removeChild(target)
    }),

    CopySub: shy("复制节点", function(can, target, source) {
        while (source.children.length > 0) {
            target.appendChild(source.children[0])
        }
    }),
    AppendItem: shy("添加插件", function(can, target, list, click, cb, cbs) {
        can.core.List(list, function(line, index) {
            var item = can.page.Append(can, target, [{view: ["item k"+line.key], list: [{text: [line.nick||line.name||line.key]}], click: function(event) {
                typeof cb == "function" && cb(event, line, item)
                can.page.Select(can, target, "div.item.select", function(item) {
                    can.page.ClassList.del(can, item, "select")
                })
                can.page.ClassList.add(can, item, "select")
            }, data: {oncontextmenu: function(event) {
                can.user.carte(event, shy("", can.ondetail, can.ondetail.list, function(event, key, meta) {var cb = meta[key];
                    typeof cb == "function"? cb(event, can, line, line.key, key, item):
                        can.run(event, [typeof cb == "string"? cb: key, item], null, true)
                }))

                event.stopPropagation()
                event.preventDefault()
            }}}]).first
        })

        if (click === false) {return}
        if (click != "") {
            var list = can.page.Select(can, target, "div.item.k"+click)
            if (list.length>0) {list[0].click(); return}
        }
        can.page.Select(can, target, "div.item", function(item, index) {
            index == 0 && item.click()
        })
    }),
    AppendField: shy("添加插件", function(can, target, type, item) {
        typeof item.help == "string" && item.help.startsWith("[") && (item.help = JSON.parse(item.help))

        var dataset = {}; item && item.name && (dataset.names = item.name);
        var field = can.page.Append(can, target, [{view: [type, "fieldset"], list: [
            item.pos? undefined: {text: [(item.nick||item.name||"")+"("+((typeof item.help == "string"? item.help: item.help.length > 0 && item.help[0])||"")+")", "legend"]},
            {view: ["option", "form"], dataset: dataset, list: []},
            {view: ["action"]}, {view: ["output"]}, {view: ["status"]},
        ]}]).first;
        return field.Meta = item, field;
    }),
    AppendTable: shy("添加表格", function(can, target, msg, list, cb, cbs) {
        if (!msg.append || msg.append.length == 0) {return}

        var table = can.page.Append(can, target, "table");
        var tr = can.page.Append(can, table, "tr");
        can.core.List(list, function(key, index) {can.page.Append(can, tr, "th", key).onclick = function(event) {
            var dataset = event.target.dataset;
            dataset["sort_asc"] = (dataset["sort_asc"] == "1") ? 0: 1;
            can.page.RangeTable(can, table, index, dataset["sort_asc"] == "1");
        }});

        can.page.Append(can, table, can.core.List(msg.Table(), function(line, index) {
            return {type: "tr", dataset: {index: index}, list: can.core.List(list, function(key) {var cbcb, cbcbs;
                typeof cb == "function" && (cbcb = function(event) {cb(event, line[key], key, index, event.target.parentNode, event.target)});
                typeof cbs == "function" && (cbcbs = function(event) {cbs(event, line[key], key, index, event.target.parentNode, event.target)});
                return {type: "td", inner: can.page.Display(line[key]), click: cbcb, oncontextmenu: cbcbs};
            })}
        }))
        return table;
    }),
    RangeTable: function(can, table, index, sort_asc) {
        var list = can.page.Select(can, table, "tr", function(tr) {
            return tr.style.display == "none" || can.page.ClassList.has(can, tr, "hide")? null: tr
        }).slice(1)

        var is_time = true, is_number = true
        can.core.List(list, function(tr) {
            var text = tr.childNodes[index].innerText
            is_time = is_time && Date.parse(text) > 0
            is_number = is_number && !isNaN(parseInt(text))
        })

        var num_list = can.core.List(list, function(tr) {
            var text = tr.childNodes[index].innerText
            return is_time? Date.parse(text):
                is_number? parseInt(text): text
        })

        for (var i = 0; i < num_list.length; i++) {
            for (var j = i+1; j < num_list.length; j++) {
                if (sort_asc? num_list[i] < num_list[j]: num_list[i] > num_list[j]) {
                    var temp = num_list[i]
                    num_list[i] = num_list[j]
                    num_list[j] = temp
                    var temp = list[i]
                    list[i] = list[j]
                    list[j] = temp
                }
            }
            var tbody = list[i].parentElement
            list[i].parentElement && tbody.removeChild(list[i])
            tbody.appendChild(list[i])
        }
    },
    OrderTable: function(can, table) {
        can.page.Select(can, table, "th", function(th, index) {
            table.onclick = function(event) {
                var dataset = event.target.dataset;
                dataset["sort_asc"] = (dataset["sort_asc"] == "1") ? 0: 1;
                can.page.RangeTable(can, table, index, dataset["sort_asc"] == "1");
            }
        })
    },

    AppendFigure: shy("添加控件", function(event, can, cmd, name) {if (can.figure) {return}
        return can.figure = can.page.Append(can, document.body, [{view: ["input "+cmd+" "+name, "fieldset"], style: {
            position: "absolute", left: event.clientX+"px", top: event.clientY+10+"px",
        }, list: [{text: [name||cmd, "legend"]}, {view: ["action"]}, {view: ["output"]}], onmouseleave: function(event) {
            if (can.figure.stick) {return}
            can.page.Remove(can, can.figure.first); delete(can.figure);
        }}])
    }),
    AppendAction: shy("添加控件", function(can, action, list, cb) {
        return can.page.Append(can, action, can.core.List(list, function(line) {
            return line.type == "br"? line: {view: "item", list: [typeof line == "string"? {button: [line, cb]}: line.length > 0? {select: [line, cb]}:
                line.input && typeof line.input != "string" ? {input: [line.input[0], function(event) {
                    typeof line.input[1] == "function" && line.input[1](event, can)
                }, function(event) {
                    typeof line.input[2] == "function" && line.input[2](event, can)
                }]}: line]}
        }))
    }),
    AppendStatus: shy("添加控件", function(can, status, list, cb) {
        can.page.Append(can, status, can.core.List(list, function(line) {
            return {view: [line]}
        }))
    }),

    Display: function(text) {
        if (text.startsWith("http")) {return "<a href='"+text+"' target='_blank'>"+text+"</a>"}
        text = text.replace(/\033\[31m/g, "<span style='color:#f00'>")
        text = text.replace(/\033\[32m/g, "<span style='color:#0f0'>")
        text = text.replace(/\033\[36m/g, "<span style='color:#0ff'>")
        text = text.replace(/\033\[1m/g, "<span style='font-weight:bold'>")
        text = text.replace(/\033\[0m/g, "</span>")
        text = text.replace(/\033\[m/g, "</span>")
        text = text.replace(/\\n/g, "<br>")
        return text;
    },
    CopyText: function(can, text) {
        if (text) {
            var input = can.page.Append(can, document.body, [{type: "textarea", inner: text}]).last;
            input.focus(), input.setSelectionRange(0, text.length);
        }

        text = window.getSelection().toString();
        if (text == "") {return ""}

        // kit.History("txt", -1) && kit.History("txt", -1).data == text || kit.History("txt", -1, text) && 
        document.execCommand("copy");
        input && document.body.removeChild(input);
        return text;
    },
    Download: function(can, name, value) {
        var timer = can.user.toast({title: "下载中...", width: 200,
            text:'<a href="'+URL.createObjectURL(new Blob([value]))+'" target="_blank" download="'+name+'">'+name+'</a>',
        })
        can.page.Select(can, timer.toast.content, "a", function(item) {
            item.click()
        })
    },
    Upload: function(can, file, cb, cbs) {
    },

    DelText: function(target, start, count) {
        target.value = target.value.substring(0, start)+target.value.substring(start+(count||target.value.length), target.value.length)
        target.setSelectionRange(start, start)
    },
    oninput: function(event, can, local) {var target = event.target
        if (event.ctrlKey) {
            if (typeof local == "function" && local(event)) {
                event.stopPropagation()
                event.preventDefault()
                return true
            }

            var his = target.History || []
            var pos = target.Current || -1
            switch (event.key) {
                case "p":
                    pos = (pos-1+his.length+1) % (his.length+1)
                    target.value = pos < his.length? his[pos]: ""
                    target.Current = pos
                    break
                case "n":
                    pos = (pos+1) % (his.length+1)
                    target.value = pos < his.length? his[pos]: ""
                    target.Current = pos
                    break
                case "a":
                case "e":
                case "f":
                case "b":
                    break
                case "h":
                    can.page.DelText(target, target.selectionStart-1, target.selectionStart)
                    break
                case "d":
                    can.page.DelText(target, 0, target.selectionStart)
                    break
                case "k":
                    can.page.DelText(target, target.selectionStart)
                    break
                case "u":
                    can.page.DelText(target, 0, target.selectionEnd)
                    break
                case "w":
                    var start = target.selectionStart-2
                    var end = target.selectionEnd-1
                    for (var i = start; i >= 0; i--) {
                        if (target.value[end] == " " && target.value[i] != " ") {
                            break
                        }
                        if (target.value[end] != " " && target.value[i] == " ") {
                            break
                        }
                    }
                    can.page.DelText(target, i+1, end-i)
                    break
                default:
                    return false
            }
        } else {
            switch (event.key) {
                case " ":
                    event.stopPropagation()
                    return true
                default:
                    return false
            }
        }

        event.stopPropagation()
        event.preventDefault()
        return true
    },

    Prepos: function(event, item) {
        var pos = 1;
        var p = item.getBoundingClientRect();
        var y = (event.clientY - p.y) / p.height
        if (y < 0.2) {
            pos += 0;
        } else if (y > 0.8) {
            pos += 6;
        } else {
            pos += 3;
        }
        var x = (event.clientX - p.x) / p.width
        if (x < 0.2) {
            pos += 0;
        } else if (x > 0.8) {
            pos += 2;
        } else {
            pos += 1;
        }

        var cursor = [
            "nw-resize", "n-resize", "ne-resize",
            "w-resize", "move", "e-resize",
            "sw-resize", "s-resize", "se-resize",
        ]
        item.style.cursor = cursor[pos-1]
        return pos
    },
    Resize: function(event, item, begin, pos) {
        switch (pos) {
            case 5:
                item.style.left = begin.left + event.clientX - begin.x + "px"
                item.style.top = begin.top + event.clientY - begin.y + "px"
                return
        }

        switch (pos) {
            case 1:
            case 2:
            case 3:
                item.style.top = begin.top + event.clientY - begin.y + "px"
                item.style.height = begin.height - event.clientY + begin.y + "px"
                break
        }
        switch (pos) {
            case 1:
            case 4:
            case 7:
                item.style.left = begin.left + event.clientX - begin.x + "px"
                item.style.width = begin.width - event.clientX + begin.x + "px"
                break
        }
        switch (pos) {
            case 3:
            case 6:
            case 9:
                item.style.width = begin.width + event.clientX - begin.x + "px"
                break
        }
        switch (pos) {
            case 7:
            case 8:
            case 9:
                item.style.height = begin.height + event.clientY - begin.y + "px"
                break
        }
    },
})

