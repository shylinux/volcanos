Volcanos("page", {help: "网页模块",
    ClassList: {
        has: function(can, obj, key) {var list = obj.className? obj.className.split(" "): [];
            for (var i = 1; i < arguments.length; i++) {
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
        can.core.List(key, function(item, index) {
            // 基本结构: type name data list
            var type = item.type || "div", data = item.data || {};
            var name = item.name || data.name;

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
                data.innerText = list[0], data.onclick = function(event) {
                    typeof list[1] == "function" && list[1](event, name);
                }

            } else if (item.select) {var list = item.select;
                type = "select", name = name || list[0][0];
                data.onchange = function(event) {
                    typeof list[1] == "function" && list[1](event, event.target.value);
                }
                item.list = list[0].slice(1).map(function(value) {
                    return {type: "option", value: value, inner: value};
                })
                data.className = list[0][0] || "";

            } else if (item.input) {var list = can.core.List(item.input);
                type = "input", name = name || list[0] || "";
                data.name = data.name || name;
                data.className = data.className || data.name;
                data.placeholder = data.placeholder || data.name;
                data.title = data.title || data.placeholder;

                data.onkeydown = function(event) {
                    typeof list[1] == "function" && list[1](event);
                }
                data.onkeyup = function(event) {
                    typeof list[2] == "function" && list[2](event);
                }

            } else if (item.row) {type = "tr";
                item.list = item.row.map(function(text) {return {text: [text, item.sub||"td"]}});
            }


            // 创建节点
            name = name || data.className || type;
            var node = can.page.Create(can, type, data);
            value.last = node, value.first || (value.first = node), name && (value[name] = node);
            item.list && can.page.Append(can, node, item.list, value);
            target && target.append && target.append(node);
        })
        return value
    }),
    Appends: shy("添加节点", function(can, target, key, value) {
        return target.innerHTML = "", can.page.Append(can, target, key, value)
    }),

    AppendItem: shy("添加插件", function(can, target, list, click, cb, cbs) {
        can.core.List(list, function(line, index) {
            var item = can.page.Append(can, target, [{view: ["item k"+line.key], list: [{text: [line.nick||line.key]}], click: function(event) {
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
        can.page.Select(can, target, "div.item")[0].click()
    }),
    AppendField: shy("添加插件", function(can, target, type, item) {
        var dataset = {}; item && item.name && (dataset.names = item.name); item && item.group && (dataset.group = item.group);
        var field = can.page.Append(can, target, [{view: [type, "fieldset"], list: [
            {text: [(item.nick||item.name||"")+"("+(item.help||"")+")", "legend"]},
            {view: ["option", "form"], dataset: dataset, list: [{type: "input", style: {display: "none"}}]},
            {view: ["action"]},
            {view: ["output"]},
        ]}]).first;
        return field;
    }),
    AppendTable: shy("添加表格", function(can, target, msg, list, cb, cbs) {
        var table = can.page.Append(can, target, "table");
        var tr = can.page.Append(can, table, "tr");
        can.core.List(list, function(key) {can.page.Append(can, tr, "th", key)});

        can.page.Append(can, table, can.core.List(msg.Table(), function(line, index) {
            return {type: "tr", list: can.core.List(list, function(key) {var cbcb, cbcbs;
                typeof cb == "function" && (cbcb = function(event) {cb(event, line[key], key, index, event.target.parentNode, event.target)});
                typeof cbs == "function" && (cbcbs = function(event) {cbs(event, line[key], key, index, event.target.parentNode, event.target)});
                return {type: "td", inner: can.page.Display(line[key]), click: cbcb, oncontextmenu: cbcbs};
            })}
        }))
        return table;
    }),

    Display: function(text) {
        if (text.startsWith("http")) {return "<a href='"+text+"' target='_blank'>"+text+"</a>"}
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
        can.user.toast({title: "下载中...", width: 200,
            text:'<a href="'+URL.createObjectURL(new Blob([value]))+'" target="_blank" download="'+name+'">'+name+'</a>',
        })
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
                    if (target.value.endsWith("j") && event.key == "k") {
                        can.page.DelText(target, target.selectionStart-1, 2)
                        target.blur()
                        break
                    }
                    return false
            }
        }

        event.stopPropagation()
        event.preventDefault()
        return true
    },
})

