Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, conf, output, action, option, field) {output.innerHTML = "";
        conf.title && can.page.Append(can, output, [{view: "title",
            list: [{text: conf.title, className: "title"}], click: function(event) {can.Export(event, conf.title, "title")}}])

        can.ui = can.page.Append(can, output, [{view: "state", list: can.core.List(conf.state, function(item) {
            return {text: conf[item]||"", className: item, click: function(event) {can.Export(event, conf[item], item)}};
        })}])

        can.timer = can.Timer({interval: 1000, length: -1}, function(event) {
            can.onimport.time(event, can, can.base.Time().split(" ")[1], "time")
        })
    },
    title: function(event, can, value, cmd, field) {
        can.ui[cmd].innerHTML = value
    },
    username: function(event, can, value, cmd, field) {
        value.length > 10 && (value = value.slice(0, 8))
        can.ui["user"].innerHTML = value
    },
    time: function(event, can, value, cmd, field) {
        can.ui[cmd].innerHTML = value
    },

    river: function(event, can, value, cmd, field) {if (value == "update") {return}
        can.Conf("river", value)
    },
    storm: function(event, can, value, cmd, field) {if (value == "update") {return}
        can.Conf("storm", value)
    },
    layout: function(event, can, value, cmd, field) {if (value == "update") {return}
        can.Conf("layout", value)
    },
})
Volcanos("onaction", {help: "组件交互", list: []})
Volcanos("onchoice", {help: "组件菜单", list: []})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: [],
    title: function(event, can, value, cmd, field) {
        var args = {river: can.Conf("river"), storm: can.Conf("storm"), layout: can.Conf("layout")}

        can.page.Select(can, document.body, "fieldset.Action>div.action input", function(input) {
            input.name && input.value && (args[input.name] = input.value)
        })
        can.user.Search(can, args)
    },
    user: function(event, can, value, cmd, field) {
        if (can.user.confirm("logout?")) {
            can.user.Cookie(can, "sessid", "")
            can.user.reload()
        }
    },
})

