Volcanos("page", {help: "网页模块",
    ClassList: {
        has: function(can, obj, key) {var list = obj.className? obj.className.split(" "): [];
            for (var i = 1; i < arguments.length; i++) {
                if (list.indexOf(arguments[i]) == -1) {return false}
            }
            return true
        },
        add: function(can, obj, key) {var list = obj.className? obj.className.split(" "): []
            return obj.className = list.concat(can.core.List(arguments, function(value, index) {
                return index > 0 && list.indexOf(value) == -1? value: undefined
            })).join(" ")
        },
        del: function(can, obj, key) {var list = can.core.List(arguments, function(value, index) {return index > 0? value: undefined})
            return obj.className = can.core.List(obj.className.split(" "), function(value) {
                return list.indexOf(value) == -1? value: undefined
            }).join(" ")
        },
    },
    Display: function(text) {
        if (text.startsWith("http")) {return "<a href='"+text+"' target='_blank'>"+text+"</a>"}
        return text
    },

    Select: shy("选择器", function(can, obj, key, cb, interval, cbs) {
        var item = obj && obj.querySelectorAll(key);
        return can.core.List(item, cb, interval, cbs);
    }),
    Modify: shy("修改节点", function(can, target, value) {
        if (typeof value == "string") {target.innerHTML = value}
        return target
    }),
    Append: shy("添加节点", function(can, target, key, value) {
        if (typeof key == "string") {var res = document.createElement(key);
            return target.appendChild(res), can.page.Modify(can, res, value);
        }
    }),
    AppendTable: shy("添加表格", function(can, target, msg, list) {
        var table = can.page.Append(can, target, "table")
        var tr = can.page.Append(can, table, "tr");
        can.core.List(list, function(key) {can.page.Append(can, tr, "th", key)});
        msg.Table(function(line) {var tr = can.page.Append(can, table, "tr");
            can.core.List(list, function(key) {can.page.Append(can, tr, "td", can.page.Display(line[key]))});
        })
        return table
    }),
})

