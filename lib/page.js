Volcanos("page", {help: "用户界面", ClassList: {
        has: function(can, obj, key) { var list = obj.className? obj.className.split(" "): []
            return list.indexOf(key) > -1
        },
        add: function(can, obj, key) { var list = obj.className? obj.className.split(" "): []
            var value = can.base.AddUniq(list, key).join(" ").trim()
            return value != obj.className && (obj.className = value), value
        },
        del: function(can, obj, key) { var list = obj.className? obj.className.split(" "): []
            return obj.className = can.core.List(list, function(value) {
                return value == key? undefined: value
            }).join(" ").trim()
        },
        set: function(can, obj, key, condition) {
            condition? this.add(can, obj, key): this.del(can, obj, key)
        },
        neg: function(can, obj, key) {
            return (this.has(can, obj, key)? this.del(can, obj, key): this.add(can, obj, key)).indexOf > -1
        },
    },
    Select: shy("选择节点", function(can, target, key, cb, interval, cbs) { if (key == ".") { cb(target); return [] }
        return can.core.List(target && target.querySelectorAll(key), cb, interval, cbs)
    }),
    Modify: shy("修改节点", function(can, target, value) { target = target || {}
        target = typeof target == "string"? document.querySelector(target): target
        typeof value == "string"? (target.innerHTML = value): can.core.Item(value, function(key, val) {
            typeof val != "object"? (target[key] = val): can.core.Item(val, function(k, v) {
                var size = {
                    "width": true, "max-width": true, "min-width": true,
                    "height": true, "max-height": true, "min-height": true,
                }
                if (size[k] && parseInt(v) < 0) { return target[key] && (target[key][k] = "") }

                var size = {
                    "width": true, "max-width": true, "min-width": true,
                    "height": true, "max-height": true, "min-height": true,
                    "left": true, "right": true, "top": true, "bottom": true,
                    "margin-top": true, "margin-left": true,
                }

                if (size[k] && v && (typeof v == "number" || v.indexOf && v.indexOf("px") == -1)) {
                    v += "px"
                }
                target[key] && (target[key][k] = v)
            })
        })
        return target
    }),
    Create: shy("创建节点", function(can, key, value) {
        return can.page.Modify(can, document.createElement(key), value)
    }),
    Remove: shy("删除节点", function(can, target) {
        target && target.parentNode && target.parentNode.removeChild(target)
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
                    case "type": break
                    case "name": break
                    case "data": break
                    case "list": break
                    case "inner": data.innerHTML = item.inner; break
                    case "click": data.onclick = item.click; break
                    default: data[key] = item[key]
                }
            })

            if (item.view) { var list = can.core.List(item.view)
                list.length > 0 && list[0] && can.page.ClassList.add(can, data, list[0])
                type = list[1] || "div"
                data.innerHTML = list[2] || data.innerHTML || ""
                name = name || list[3] || ""

            } else if (item.text) { var list = can.core.List(item.text)
                data.innerHTML = list[0] || data.innerHTML || ""
                type = list[1] || "span"
                list[2] && can.page.ClassList.add(can, data, list[2])

            } else if (item.button) { var list = can.core.List(item.button)
                type = "button", name = name || list[0]
                data.innerText = can.user.trans(can, list[0]), data.onclick = function(event) {
                    typeof list[1] == "function" && list[1](event, name)
                    event.stopPropagation(), event.preventDefault()
                    return true
                }

            } else if (item.select) { var list = item.select
                type = "select", data.name = name = name || list[0][0]
                data.title = can.user.trans(can, data.title || name)
                data.className = data.className || list[0][0] || ""

                item.list = list[0].slice(1).map(function(value) {
                    return {type: "option", value: value, inner: can.user.trans(can, value)}
                })
                data.onchange = function(event) {
                    typeof list[1] == "function" && list[1](event, event.target.value, name)
                }

            } else if (item.input) { var list = can.core.List(item.input)
                type = "input", name = name || list[0] || "", data.name = data.name || name
                data.className = data.className || data.name
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
                type = "input", name = name || list[0] || "username", data.name = data.name || name
                data.className = list[1] || data.className || data.name
                data.autocomplete = data.autocomplete || "username"

            } else if (item.password) { var list = can.core.List(item.password)
                type = "input", name = name || list[0] || "password", data.name = data.name || name
                data.className = list[1] || data.className || data.name
                data.autocomplete = data.autocomplete || "current-password"
                data.type = "password"

            } else if (item.img) { var list = can.core.List(item.img)
                type = "img", data.src = list[0]

            } else if (item.row) { type = "tr"
                item.list = item.row.map(function(text) { return {text: [text, item.sub||"td"]} })
            } else if (item.th) { type = "tr"
                item.list = item.th.map(function(text) { return {text: [text, "th"]} })
            } else if (item.td) { type = "tr"
                item.list = item.td.map(function(text) { return {text: [text, "td"]} })
            }

            if (type == "input")  { data.type == "button" && (data.value = can.user.trans(can, data.value))
                if (data.type == "text" || data.type == "password" || !data.type) { data.autocomplete = data.autocomplete||"off"
                    data.placeholder = can.user.trans(can, (data.placeholder||data.name||"").split(".").pop())
                    data.title = can.user.trans(can, data.title||data.placeholder)
                }
            }
            if (type == "textarea")  {
                data.placeholder = can.user.trans(can, (data.placeholder||data.name||"").split(".").pop())
            }

            // 创建节点
            !data.name && item.name && (data.name = item.name)
            var node = can.page.Create(can, type, data)

            // 创建索引
            name = name || data.className || type || ""
            value[name||""] = value[data.className||""] = value[type] = node
            value.first = value.first || node, value.last = node
            value._target = value._target || node

            // 递归节点
            item.list && can.page.Append(can, node, item.list, value)
            target && target.append && target.appendChild(node)
            can.base.isFunc(item._init) && item._init(node)
        })
        return value
    }),
    Appends: shy("添加节点", function(can, target, key, value) {
        return target.innerHTML = "", can.page.Append(can, target, key, value)
    }),

    AppendTable: shy("添加表格", function(can, msg, target, list, cb) {
        if (!msg.append || msg.append.length == 0) {return}

        var table = can.page.Append(can, target, "table")
        can.page.Append(can, table, [{type: "tr", data: {dataset: {index: -1}}, list: 
            can.core.List(list, function(key) {
                return key[0] == "_"? undefined: {text: [key.trim(), "th"]}
            })
        }])
        can.page.Append(can, table, can.core.List(msg.Table(), function(line, index, array) {
            return {type: "tr", dataset: {index: index}, list: can.core.List(list, function(key) { if (key.indexOf("_") == 0) { return }
                return cb(can.page.Color(line[key]).trim(), key, index, line, array)
            })}
        }))
        return can.page.OrderTable(can, table)
    }),
    OrderTable: function(can, table) {
        can.page.Select(can, table, "th", function(th, index) {
            th.onclick = function(event) { var dataset = event.target.dataset
                dataset["sort_asc"] = (dataset["sort_asc"] == "1") ? 0: 1
                can.page.RangeTable(can, table, index, dataset["sort_asc"] == "1")
            }
        })
        return table
    },
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

    Format: function(type, src) {
        switch (type) {
            case "a": return "<a href='"+arguments[1]+"' target='_blank'>"+(arguments[2]||arguments[1])+"</a>"
            case "img": return arguments[2]? "<img src='"+arguments[1]+"' height="+arguments[2]+">": "<img src='"+arguments[1]+"'>"
        }
    },
    Color: function(text) { if (typeof text != "string") { return "" }
        if (text.indexOf("http://") == 0 || text.indexOf("https://") == 0 || text.indexOf("ftp://") == 0) {
            var ls = text.split(" ");
            text = "<a href='"+ls[0]+"' target='_blank'>"+ls[0]+"</a>"+ls.slice(1).join(" ")
        }; text = text.replace(/\\n/g, "<br>")

        if (text.indexOf("\033\[") == -1) { return text }
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
        return text
    },
    Cache: function(name, output, data) { var cache = output._cache || {}; output._cache = cache
        if (data) { if (output.children.length == 0) { return }
            var temp = document.createDocumentFragment()
            while (output.childNodes.length > 0) { // 写缓存
                var item = output.childNodes[0]
                item.parentNode.removeChild(item),
                temp.appendChild(item)
            }
            return cache[name] = {node: temp, data: data}, name
        }

        output.innerHTML = ""

        var list = cache[name]; if (!list) { return }
        while (list.node.childNodes.length > 0) { // 读缓存
            var item = list.node.childNodes[0]
            item.parentNode.removeChild(item)
            output.appendChild(item)
        }
        return delete(cache[name]), list.data
    },

    input: function(can, item, value) {
        var input = {type: html.INPUT, name: item.name, data: item, dataset: {}, _init: item._init, style: item.style||{}}
        item.value == "auto" && (item.value = "", item.action = "auto"), item.action == "auto" && (input.dataset.action = "auto")

        switch (item.type = item.type||item._input||html.TEXT) {
            case html.TEXTAREA: input.type = html.TEXTAREA
                input.style.height = input.style.height||can.Conf(["feature", html.TEXTAREA, item.name, "height"].join("."))||can.Conf(["feature", html.TEXTAREA, "height"].join("."))
                input.style.width = input.style.width||can.Conf(["feature", html.TEXTAREA, item.name, "width"].join("."))||can.Conf(["feature", html.TEXTAREA, "width"].join("."))
                // no break
            case "password":
                // no break
            case html.TEXT:
                item.autocomplete = "off"
                item.value = value||item.value||""
                item.className || can.page.ClassList.add(can, item, "args")
                break
            case html.SELECT: input.type = html.SELECT
                item.values = typeof item.values == "string"? can.core.Split(item.values): item.values
                if (!item.values && item.value) { item.values = can.core.Split(item.value), item.value = item.values[0] }

                item.value = value||item.value, input.list = item.values.map(function(value) {
                    return {type: html.OPTION, value: value, inner: value}
                }), item.className || can.page.ClassList.add(can, item, "args")
                break
            case html.BUTTON: item.value = item.value||item.name||"list"; break
            case "upfile": item.type = html.FILE; break
            case "upload": item.type = html.FILE, input.name = "upload"; break
        }
        return input
    },
})

