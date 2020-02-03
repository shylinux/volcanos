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

        can.page.Append(can, output, [{view: "preview", inner: msg.Option("preview"), style: {
            float: "left", "max-height": "250px", overflow: "auto",
            border: "solid 2px red",
        }}])
        var last = can.page.Append(can, output, [{type: "textarea", cols: 32, rows: 19, inner: msg.Result()}]).last;
        return typeof cb == "function" && cb(msg), can.view = last;
    },
    which: function(event, table, list, cb) {if (event.target == table) {return cb(-1, "")}
        can.page.Select(can, table, "tr", function(tr, index) {if (event.target == tr) {return cb(index-1, "")}
            can.page.Select(can, tr, "th,td", function(td, order) {
                if (event.target == td) {return cb(index-1, list[order])}
            })
        })
    },
})
Volcanos("onaction", {help: "组件菜单", list: ["保存"],
    "保存": function(event, can, msg, cmd, target) {
        can.run(event, ["action", cmd, can.Option("name"), can.view.value], function() {
            can.user.toast("保存成功")
        }, true)
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

