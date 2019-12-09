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
                (list.length > 0 && list[0]) && can.page.ClassList.add(can, data, list[0])
                type = list[1] || "div"
                data.innerHTML = list[2] || data.innerHTML || ""
                name = name || list[3] || ""
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

    AppendTable: shy("添加表格", function(can, target, msg, list) {
        var table = can.page.Append(can, target, "table");
        var tr = can.page.Append(can, table, "tr");
        can.core.List(list, function(key) {can.page.Append(can, tr, "th", key)});
        msg.Table(function(line) {var tr = can.page.Append(can, table, "tr");
            can.core.List(list, function(key) {can.page.Append(can, tr, "td", can.page.Display(line[key]))});
        })
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
})

