Volcanos("page", {help: "网页模块",
    ClassList: {
        has: function(can, obj, key) {var list = obj.className? obj.className.split(" "): []
            for (var i = 2; i < arguments.length; i++) {
                if (list.indexOf(arguments[i]) == -1) {return false}
            }
            return true
        },
        add: function(can, obj, key) {var list = obj.className? obj.className.split(" "): []
            return obj.className = list.concat(can.core.List(key, function(value, index) {
                return list.indexOf(value) == -1? value: undefined
            })).join(" ").trim()
        },
        del: function(can, obj, key) {var list = can.core.List(arguments, function(value, index) {return index > 0? value: undefined})
            return obj.className = can.core.List(obj.className.split(" "), function(value) {
                return list.indexOf(value) == -1? value: undefined
            }).join(" ").trim()
        },
        set: function(can, obj, key, condition) {
            condition? can.page.ClassList.add(can, obj, key): can.page.ClassList.del(can, obj, key)
        },
        neg: function(can, obj, key) {
            this.has(can, obj, key)? this.del(can, obj, key): this.add(can, obj, key)
        },
    },

    Select: shy("选择节点", function(can, obj, key, cb, interval, cbs) {if (key == ".") {return []}
        var item = obj && obj.querySelectorAll(key)
        return can.core.List(item, cb, interval, cbs)
    }),
    Modify: shy("修改节点", function(can, target, value) { target = target || {}
        target = typeof target == "string"? document.querySelector(target): target
        typeof value == "string"? (target.innerHTML = value): can.core.Item(value, function(key, value) {
            typeof value != "object"? (target[key] = value): can.core.Item(value, function(sub, value) {
                var size = {
                    "width": true, "max-width": true, "min-width": true,
                    "height": true, "max-height": true, "min-height": true,
                    "left": true, "right": true, "top": true, "bottom": true,
                    "margin-top": true, "margin-left": true,
                }
                if (size[sub] && value && (typeof value == "number" || value.indexOf("px") == -1)) {
                    value += "px"
                }
                target[key] && (target[key][sub] = value)
            })
        })
        return target
    }),
    Create: shy("创建节点", function(can, key, value) {
        return can.page.Modify(can, document.createElement(key), value)
    }),
    Append: shy("添加节点", function(can, target, key, value) {
        if (typeof key == "string") { var res = can.page.Create(can, key, value); return target.appendChild(res), res }

        value = value || {}
        can.core.List(key, function(item, index) { if (!item) { return }
            if (typeof item == "string") { target.innerHTML = item; return }
            if (item.nodeName) { target.appendChild(item); return }

            // 基本结构: type name data list
            var type = item.type || "div", data = item.data || {}
            var name = item.name || data.name || ""

            // 数据调整
            can.core.Item(item, function(key, value) {
                switch (key) {
                    case "type":
                    case "name":
                    case "data":
                    case "list":
                        break
                    case "click":
                        data.onclick = item.click
                        break
                    case "inner":
                        data.innerHTML = item.inner
                        break
                    default:
                        data[key] = item[key]
                }
            })

            if (item.view) { var list = can.core.List(item.view)
                list.length > 0 && list[0] && can.page.ClassList.add(can, data, list[0])
                type = list[1] || "div"
                data.innerHTML = can.user.trans(can, list[2]) || data.innerHTML || ""
                name = name || list[3] || ""

            } else if (item.text) { var list = can.core.List(item.text)
                data.innerHTML = can.user.trans(can, list[0]) || data.innerHTML || ""
                type = list[1] || "span"
                list.length > 2 && list[2] && can.page.ClassList.add(can, data, list[2])

            } else if (item.button) { var list = can.core.List(item.button)
                type = "button", name = name || list[0]
                data.innerText = can.user.trans(can, list[0]), data.onclick = function(event) {
                    typeof list[1] == "function" && list[1](event, name)
                    event.stopPropagation()
                    event.preventDefault()
                    return true
                }

            } else if (item.select) { var list = item.select
                type = "select", name = name || list[0][0]
                data.onchange = function(event) {
                    typeof list[1] == "function" && list[1](event, event.target.value, name)
                }
                item.list = list[0].slice(1).map(function(value) {
                    return {type: "option", value: value, inner: can.user.trans(can, value)}
                })
                data.className = data.className || list[0][0] || ""
                data.title = can.user.trans(can, data.title || name)
                data.name = name

            } else if (item.input) { var list = can.core.List(item.input)
                type = "input", name = name || list[0] || ""
                data.name = data.name || name
                data.className = data.className || data.name
                data.placeholder = data.placeholder || data.name
                data.placeholder = data.placeholder.split(".").pop()
                data.title = data.title || data.placeholder
                data.autocomplete = "off"

                data.onfocus = data.onfocus || function(event) {
                    event.target.setSelectionRange(0, -1)
                }
                data.onkeydown = function(event) {
                    typeof list[1] == "function" && list[1](event)
                }
                data.onkeyup = function(event) {
                    typeof list[2] == "function" && list[2](event)
                }
            } else if (item.username) { var list = can.core.List(item.username)
                type = "input", name = name || list[0] || "username"
                data.name = data.name || name
                data.className = list[1] || data.className || data.name
                data.placeholder = data.placeholder || data.name
                data.title = data.title || data.placeholder
                data.autocomplete = data.autocomplete || "username"

            } else if (item.password) { var list = can.core.List(item.password)
                type = "input", name = name || list[0] || "password"
                data.type = "password"
                data.name = data.name || name
                data.className = list[1], data.className || data.name
                data.placeholder = data.placeholder || data.name
                data.title = data.title || data.placeholder
                data.autocomplete = data.autocomplete || "current-password"

            } else if (item.img) { var list = can.core.List(item.img)
                type = "img"
                data.src = list[0]

            } else if (item.row) { type = "tr"
                item.list = item.row.map(function(text) {return {text: [text, item.sub||"td"]}})
            } else if (item.th) { type = "tr"
                item.list = item.th.map(function(text) {return {text: [text, "th"]}})
            } else if (item.td) { type = "tr"
                item.list = item.td.map(function(text) {return {text: [text, "td"]}})

            } else if (item.include) {var list = can.core.List(item.include)
                type = "script"
                data.src = list[0]
                data.onload = list[1]
            }

            item.type == "input" && data.type == "button" && (data.value = can.user.trans(can, data.value))
            item.type == "input" && data.type == "text" && (data.autocomplete = data.autocomplete||"off")
            data.placeholder && (data.placeholder = can.user.trans(can, data.placeholder))
            data.title && (data.title = can.user.trans(can, data.title))

            // 创建节点
            name = name || data.className || type || ""
            !data.name && item.name && (data.name = item.name)
            var node = can.page.Create(can, type, data)

            value.last = node, value.first = value.first || node, value[name||""] = value[data.className||""] = value[type] = node
            item.list && can.page.Append(can, node, item.list, value)
            typeof item._init == "function" && item._init(node)
            target && target.append && target.appendChild(node)
            target.appendChild(node)
        })
        return value
    }),
    Appends: shy("添加节点", function(can, target, key, value) {
        return target.innerHTML = "", can.page.Append(can, target, key, value)
    }),
    Remove: shy("删除节点", function(can, target) {
        target && target.parentNode && target.parentNode.removeChild(target)
    }),

    AppendAction: shy("添加控件", function(can, action, list, cb) {
        return can.page.Append(can, action, can.core.List(list, function(line) {
            return ["br", "hr"].indexOf(line.type) > -1? line: {view: "item", list: [typeof line == "string"? {button: [line, cb]}: line.length > 0? {select: [line, cb]}:
                line.input && typeof line.input != "string" ? {input: [line.input[0], function(event) {
                    typeof line.input[1] == "function" && line.input[1](event, can)
                }, function(event) {
                    typeof line.input[2] == "function" && line.input[2](event, can)
                }]}: line]}
        }))
    }),
    AppendTable: shy("添加表格", function(can, msg, target, list, cb) {
        if (!msg.append || msg.append.length == 0) {return}

        var table = can.page.Append(can, target, "table")
        var tr = can.page.Append(can, table, "tr", {dataset: {index: -1}})
        can.core.List(list, function(key, index) { if (key.indexOf("_") == 0) { return }
            key = can.Conf("feature.table.trans."+key) || {}[key] || key

            can.page.Append(can, tr, "th", key.trim()).onclick = function(event) {
                var dataset = event.target.dataset
                dataset["sort_asc"] = (dataset["sort_asc"] == "1") ? 0: 1
                can.page.RangeTable(can, table, index, dataset["sort_asc"] == "1")
            }
        })

        can.page.Append(can, table, can.core.List(msg.Table(), function(line, index, array) {
            return {type: "tr", dataset: {index: index}, list: can.core.List(list, function(key) { if (key.indexOf("_") == 0) { return }
                return cb(can.page.Display(line[key]).trim(), key, index, line, array)
            })}
        }))
        return table
    }),
    RangeTable: function(can, table, index, sort_asc) {
        var list = can.page.Select(can, table, "tr", function(tr) {
            return tr.style.display == "none" || can.page.ClassList.has(can, tr, "hide")? null: tr
        }).slice(1)

        index = typeof index == "object"? index: [index]
        index = can.core.List(index, function(item) { if (item > -1) { return item} })
        if (index.length == 0) { return }

        var is_time = true, is_number = true
        can.core.List(list, function(tr) {
            var text = tr.childNodes[index[0]].innerText
            is_time = is_time && Date.parse(text) > 0
            is_number = is_number && !isNaN(parseInt(text))
        })

        var num_list = can.core.List(list, function(tr) {
            var text = tr.childNodes[index[0]].innerText
            return is_time? Date.parse(text):
                is_number? can.base.parseSize(text): text
        })
        function isless(a, b, index) {
            if (a.childNodes[index[0]] && b.childNodes[index[0]]) {
                if (a.childNodes[index[0]].innerText < b.childNodes[index[0]].innerText) { return true }
                if (a.childNodes[index[0]].innerText > b.childNodes[index[0]].innerText) { return false }
            }
            return index.length > 1 && isless(a, b, index.slice(1))
        }

        // 选择排序
        for (var i = 0; i < num_list.length; i++) { var min = i
            for (var j = i+1; j < num_list.length; j++) {
                if (num_list[min] == num_list[j] && index.length > 1 && list[index[1]]) {
                    if (sort_asc? isless(list[min], list[j], index.slice(1)): isless(list[j], list[min], index.slice(1))) {
                        min = j
                    }
                } else if (sort_asc? num_list[min] < num_list[j]: num_list[j] < num_list[min]) {
                    min = j
                }
            }

            if (min != i) {
                var temp = num_list[i]; num_list[i] = num_list[min]; num_list[min] = temp
                var temp = list[i]; list[i] = list[min]; list[min] = temp
            }

            var tbody = list[i].parentElement
            list[i].parentElement && tbody.removeChild(list[i])
            tbody.appendChild(list[i])
        }
    },
    OrderTable: function(can, table) {
        can.page.Select(can, table, "th", function(th, index) {
            table.onclick = function(event) {
                var dataset = event.target.dataset
                dataset["sort_asc"] = (dataset["sort_asc"] == "1") ? 0: 1
                can.page.RangeTable(can, table, index, dataset["sort_asc"] == "1")
            }
        })
    },

    Display: function(text) { if (typeof text != "string") { return "" }
        if (text.indexOf("http://") == 0 || text.indexOf("https://") == 0 || text.indexOf("ftp://") == 0) {
            var ls = text.split(" ")
            return "<a href='"+ls[0]+"' target='_blank'>"+ls[0]+"</a>"+ls.slice(1).join(" ")
        }

        text = text.replace(/\033\[31m/g, "<span style='color:#f00'>")
        text = text.replace(/\033\[32m/g, "<span style='color:#0f0'>")
        text = text.replace(/\033\[33m/g, "<span style='color:#ff0'>")
        text = text.replace(/\033\[34m/g, "<span style='color:#00f'>")
        text = text.replace(/\033\[36m/g, "<span style='color:#0ff'>")
        text = text.replace(/\033\[34;1m/g, "<span style='color:#00f'>")
        text = text.replace(/\033\[37;1m/g, "<span style='color:#fff'>")
        text = text.replace(/\033\[1m/g, "<span style='font-weight:bold'>")
        text = text.replace(/\033\[0m/g, "</span>")
        text = text.replace(/\033\[m/g, "</span>")
        text = text.replace(/\\n/g, "<br>")
        return text
    },
    Format: function(type, src, name) {
        switch (type) {
            case "a":
                return "<a href='"+arguments[1]+"' target='_blank'>"+(arguments[2]||arguments[1])+"</a>"
            case "img":
                return "<img src='"+arguments[1]+"'>"
        }
    },
    DelText: function(target, start, count) {
        target.value = target.value.substring(0, start)+target.value.substring(start+(count||target.value.length), target.value.length)
        target.setSelectionRange(start, start)
    },

    Cache: function(name, output, data) { var cache = output._cache || {}; output._cache = cache
        if (data) { if (output.children.length == 0) { return }
            // 写缓存
            var temp = document.createDocumentFragment()
            while (output.childNodes.length>0) {
                var item = output.childNodes[0]
                item.parentNode.removeChild(item)
                temp.appendChild(item)
            }

            cache[name] = {node: temp, data: data}
            return name
        }

        output.innerHTML = ""
        var list = cache[name]; if (!list) {return}

        // 读缓存
        while (list.node.childNodes.length>0) {
            var item = list.node.childNodes[0]
            item.parentNode.removeChild(item)
            output.appendChild(item)
        }
        delete(cache[name])
        return list.data
    },
    Toggle: function(can, target, show, hide) { var status = target.style.display == "none"
        can.page.Modify(can, target, {style: {display: status? "": "none"}})
        status? typeof show == "function" && show(): typeof hide == "function" && hide()
        return status
    },
    Anchor: function(event, target, pos, point) {
        switch (pos) {
            case 1:
            case 2:
            case 3:
                point.y = target.Val("y")
                break
            case 4:
            case 5:
            case 6:
                point.y = target.Val("y") + target.Val("height") / 2
                break
            case 7:
            case 8:
            case 9:
                point.y = target.Val("y") + target.Val("height")
                break
        }

        switch (pos) {
            case 1:
            case 4:
            case 7:
                point.x = target.Val("x")
                break
            case 2:
            case 5:
            case 8:
                point.x = target.Val("x") + target.Val("width") / 2
                break
            case 3:
            case 6:
            case 9:
                point.x = target.Val("x") + target.Val("width")
                break
        }
        return point
    },
    Prepos: function(event, item, p, q) {
        var max = 20
        p = p || item.getBoundingClientRect()
        q = q || {x: event.clientX, y: event.clientY}

        var pos = 5
        var y = (q.y - p.y) / p.height
        if (y < 0.2 && q.y - p.y < max) {
            pos -= 3
        } else if (y > 0.8 && q.y - p.y - p.height > -max) {
            pos += 3
        }
        var x = (q.x - p.x) / p.width
        if (x < 0.2 && q.x - p.x < max) {
            pos -= 1
        } else if (x > 0.8 && q.x - p.x - p.width > -max) {
            pos += 1
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
    Resizes: function(event, item, begin, p0, p1, pos) {
        switch (pos) {
            case 5:
                item.Value("x", begin.x + p1.x - p0.x)
                item.Value("y", begin.y + p1.y - p0.y)
                return
        }

        switch (pos) {
            case 1:
            case 2:
            case 3:
                item.Value("y", begin.y + p1.y - p0.y)
                item.Value("height", begin.height - p1.y + p0.y)
                break
        }
        switch (pos) {
            case 1:
            case 4:
            case 7:
                item.Value("x", begin.x + p1.x - p0.x)
                item.Value("width", begin.width - p1.x + p0.x)
                break
        }
        switch (pos) {
            case 3:
            case 6:
            case 9:
                item.Value("width", begin.width + p1.x - p0.x)
                break
        }
        switch (pos) {
            case 7:
            case 8:
            case 9:
                item.Value("height", begin.height + p1.y - p0.y)
                break
        }
    },
    EnableDrop: function(can, parent, search, target) {
        return can.page.Modify(can, target, { draggable: true,
            ondragstart: function(event) { var target = event.target; can.drop = function(event, tab) {
                parent.insertBefore(target, tab)
                can.page.Select(can, parent, search, function(item) {
                    can.page.ClassList.del(can, item, "over")
                })
            } },
            ondragover: function(event) { event.preventDefault()
                can.page.Select(can, parent, search, function(item) {
                    can.page.ClassList.del(can, item, "over")
                }), can.page.ClassList.add(can, event.target, "over")
            },
            ondrop: function(event) { event.preventDefault()
                can.drop(event, event.target)
            },
        })
    },
})

