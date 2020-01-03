Volcanos("onimport", {help: "导入数据", list: [],
    init: function(event, can, msg, cmd, output) {output.innerHTML = "";
        msg.Table(function(item, index) {if (!item.name) {return}
            can._plugins.push(can[item.name] = can.Plugin(can, item.name, item, function(event, cmds, cbs) {
                can.run(event, [item.river, item.storm, item.action].concat(cmds), cbs)
            }, can.page.AppendField(can, output, "item "+item.group+" "+item.name, item)))
        })
    },
    size: function(event, can, value, cmd, output) {
    },
    layout: function(event, can, value, cmd, output) {can.layout = value;
        can.page.Select(can, can.action, "select.layout", function(item) {
            item.value = value
        })
    },
    scroll: function(event, can, value, cmd, output) {can.layout = value;
        output.parentElement.scrollBy(value.x, value.y)
    },
    river: function(event, can, value, cmd, output) {
        if (value == "update") {return}
        can.Conf("temp_river", value)
    },
    you: function(event, can, value, cmd, output) {
        can.user.title(value)
    },
    storm: function(event, can, value, cmd, output) {
        can.Cache(can.Conf("river")+"."+can.Conf("storm"), output, "some");

        can.Conf("river", can.Conf("temp_river"))
        can.Conf("storm", value)
        if (!can.Cache(can.Conf("river")+"."+can.Conf("storm"), output)) {
            can.run(event, [can.Conf("river"), can.Conf("storm")], function(msg) {
                can.onimport.init(event, can, msg, cmd, output)
            })
        }
    },
    favor: function(event, can, msg, cmd, output) {var key = msg.detail[0];
        if (msg._hand) {return}
        var cb = can.onaction[key]; if (typeof cb == "function") {cb(event, can, msg, cmd, output); return msg.Echo(can._name, " onaction ", key), msg._hand = true}
        var cb = can.onchoice[key]; if (typeof cb == "function") {cb(event, can, msg, cmd, output); return msg.Echo(can._name, " onchoice ", key), msg._hand = true}

        var sub = can[key]; if (sub && sub.Select) {sub.Select(event, null, true); return msg.Echo(can._name, " select ", sub._name), msg._hand = true}

        can._plugin && can._plugin.Import(event, msg, cmd)
    },
})
Volcanos("onaction", {help: "组件交互", list: [["layout", "工作", "办公", "聊天"], "清屏", "刷新", "串行", "并行",
    {input: "pod"}, {input: "you"}, {input: "hot"}, {input: "top"},
],
    "工作": function(event, can, msg, cmd, output) {

        can.Export(event, cmd, "layout")
    },
    "办公": function(event, can, msg, cmd, output) {
        can.Export(event, cmd, "layout")
    },
    "聊天": function(event, can, msg, cmd, output) {
        can.Export(event, cmd, "layout")
    },
    "清屏": function(event, can, msg, cmd, output) {
        can.page.Select(can, output, "fieldset.item>div.output", function(item) {
            item.innerHTML = "";
        })
    },
    "刷新": function(event, can, msg, cmd, output) {
        can.page.Select(can, output, "fieldset.item>div.output", function(item) {
            item.innerHTML = "";
        })
        can.run(event, [can.Conf("river"), can.Conf("storm")], function(msg) {
            can.onimport.init(event, can, msg, cmd, output)
        })
    },
})
Volcanos("onchoice", {help: "组件菜单", list: [["layout", "工作", "办公", "聊天"]],
    "工作": function(event, can, msg, cmd, target) {
        can.Export(event, cmd, "layout")
    },
    "办公": function(event, can, msg, cmd, target) {
        can.Export(event, cmd, "layout")
    },
    "聊天": function(event, can, msg, cmd, target) {
        can.Export(event, cmd, "layout")
    },
})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

