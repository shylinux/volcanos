Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, conf, output, action, option, field) {output.innerHTML = "";
        conf.title && can.page.Append(can, output, [{view: "title", list: [{text: conf.title, className: "title"}]}])
        can.ui = can.page.Append(can, output, [{view: "state", list: can.core.List(conf.state, function(item) {
            return {text: conf[item]||"", className: item, click: function(event) {var cb = can.onexport[item];
                typeof cb == "function" && cb(event, can, item, item, output)
            }};
        })}])
    },
    email: function(event, can, value, cmd, output) {
        can.ui[cmd].innerHTML = value
    },
    ntxt: function(event, can, value, cmd, output) {var state = can.Conf(cmd);
        can.ui[cmd].innerHTML = cmd+":"+ can.Conf(cmd, can.base.Int(value)+can.base.Int(state))
    },
    ncmd: function(event, can, value, cmd, output) {var state = can.Conf(cmd);
        can.ui[cmd].innerHTML = cmd+":"+ can.Conf(cmd, can.base.Int(value)+can.base.Int(state))
    },
})
Volcanos("onaction", {help: "组件交互", list: []})
Volcanos("onchoice", {help: "组件菜单", list: []})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

