Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, meta, list, cb, output, action, option, field) {output.innerHTML = "";
        can._init = function() {
            can.run({}, [], function(msg) {
                can.core.List(msg.result, function(title) {
                    can.page.Append(can, output, [{view: "title", list: [{text: title, className: "title"}]}])
                })

                can.ui = can.page.Append(can, output, [{view: "state", list: can.core.List(meta.state, function(item) {
                    return {text: meta[item]||"", className: item, click: function(event) {can.Export(event, meta[item], item)}};
                })}])
            })
        }
    },
    username: function(event, can, value, cmd, field) {can._init()},

    email: function(event, can, value, cmd, field) {
        can.ui[cmd].innerHTML = value
    },
    ntxt: function(event, can, value, cmd, field) {var state = can.Conf(cmd);
        can.ui[cmd].innerHTML = cmd+":"+ can.Conf(cmd, can.base.Int(value)+can.base.Int(state))
    },
    ncmd: function(event, can, value, cmd, field) {var state = can.Conf(cmd);
        can.ui && (can.ui[cmd].innerHTML = cmd+":"+ can.Conf(cmd, can.base.Int(value)+can.base.Int(state)))
    },
})
Volcanos("onaction", {help: "组件交互", list: []})
Volcanos("onchoice", {help: "组件菜单", list: []})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

