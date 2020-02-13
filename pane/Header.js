Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, conf, output, action, option, field) {output.innerHTML = "";
        conf.title && can.page.Append(can, output, [{view: "title",
            list: [{text: conf.title, className: "title"}], click: function(event) {can.onexport.title(event, can)}}])

        can.ui = can.page.Append(can, output, [{view: "state", list: can.core.List(conf.state, function(item) {
            return {text: conf[item]||"", className: item, click: function(event) {var cb = can.onexport[item];
                typeof cb == "function" && cb(event, can, item, item, output)
            }};
        })}])

        can.timer = can.Timer({interval: 1000, length: -1}, function() {
            can.ui.time.innerHTML = can.base.Time().split(" ")[1]
        })
    },
    title: function(event, can, value, cmd, output) {
        can.ui[cmd].innerHTML = value
    },
    username: function(event, can, value, cmd, output) {
        can.ui["user"].innerHTML = value
    },
    time: function(event, can, value, cmd, output) {
        can.ui[cmd].innerHTML = value
    },
    link: function(event, can, value, cmd, output) {
        can.ui[cmd].innerHTML = value
    },
    river: function(event, can, value, cmd, output) {if (value == "update") {return}
        can.Conf("river", value)
    },
    storm: function(event, can, value, cmd, output) {if (value == "update") {return}
        can.Conf("storm", value)
    },
    layout: function(event, can, value, cmd, output) {if (value == "update") {return}
        can.Conf("layout", value)
    },
})
Volcanos("onaction", {help: "组件交互", list: []})
Volcanos("onchoice", {help: "组件菜单", list: []})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: [],
    title: function(event, can, value, cmd, output) {
        var args = {
            river: can.Conf("river"),
            storm: can.Conf("storm"),
            layout: can.Conf("layout"),
        }
        can.page.Select(can, document.body, "fieldset.Action>div.action>input", function(input) {
            args[input.name] = input.value
        })
        can.user.Search(can, args)
    },
    link: function(event, can, value, cmd, output) {
        can.ui[cmd].innerHTML = value
    },
    user: function(event, can, value, cmd, output) {
        if (can.user.confirm("logout?")) {
            can.user.Cookie(can, "sessid", "")
            can.user.reload()
        }
        can.ui["user"].innerHTML = value
    },
})

