Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, conf, output, action, option, field) {
        can.page.Select(can, action, "input", function(input) {
            input.value = can.user.Search(can, input.name) || ""
        })
    },
    init: function(event, can, msg, cmd, target) {can.output.innerHTML = "";
        can._local[msg.cmds[0]] = can._local[msg.cmds[0]] || {}
        can._local[msg.cmds[0]][msg.cmds[1]] = msg.Table(function(item, index) {if (!item.name) {return}
            var plugin = can[item.name] = can.Plugin(can, item.name, item, function(event, cmds, cbs) {
                can.run(event, [item.river, item.storm, item.action].concat(cmds), cbs)
            }, can.page.AppendField(can, can.output, "item "+item.name, item))
            return can._plugins.push(plugin), plugin
        })
    },
    river: function(event, can, value, cmd, target) {
        if (value == "update") {return}
        can.Conf("temp_river", value)
    },
    storm: function(event, can, value, cmd, target) {
        can.Cache(can.Conf("river")+"."+can.Conf("storm"), can.output, "some");

        can.Conf("river", can.Conf("temp_river"))
        can.Conf("storm", value)
        if (!can.Cache(can.Conf("river")+"."+can.Conf("storm"), can.output)) {
            can.run(event, [can.Conf("river"), can.Conf("storm")], function(msg) {
                can.onimport.init(event, can, msg, cmd, can.output)
            })
        }
    },

    layout: function(event, can, value, cmd, target) {can.layout = value;
        can.page.Select(can, can.action, "select.layout", function(item) {
            item.value = value
        })
    },
    scroll: function(event, can, value, cmd, target) {can.layout = value;
        can.output.parentElement.scrollBy(value.x, value.y)
    },

    you: function(event, can, value, cmd, target) {
        can.user.title(value)
    },
    favor: function(event, can, msg, cmd, target) {var key = msg.detail[0];
        if (msg._hand) {return}
        var cb = can.onaction[key]; if (typeof cb == "function") {cb(event, can, msg, cmd, can.output); return msg.Echo(can._name, " onaction ", key), msg._hand = true}
        var cb = can.onchoice[key]; if (typeof cb == "function") {cb(event, can, msg, cmd, can.output); return msg.Echo(can._name, " onchoice ", key), msg._hand = true}

        var sub = can[key]; if (sub && sub.Select) {sub.Select(event, null, true); return msg.Echo(can._name, " select ", sub._name), msg._hand = true}

        can._plugin && can._plugin.Import(event, msg, cmd)
    },
})
Volcanos("onaction", {help: "组件交互", list: [["layout"].concat(Config.layout.list), "刷新", "清屏", "并行","串行",
    ["action", "正常", "编辑", "编排", "定位"],
    {input: "pod"}, {input: "you"}, {input: "hot"}, {input: "top"},
],
    onmousemove: function(event, can, msg, cmd, target) {
        can.resize && can.resize(event)
    },

    layout: function(event, can, value, cmd, target) {can.Export(event, value, cmd)},

    "共享": function(event, can, msg, cmd, target) {
        can.user.input(event, can, ["name", "text"], function(event, cmd, meta, list) {
            cmd == "提交" && can.run(event, [can.Conf("river"), can.Conf("storm"), "share", meta.name, meta.text], function(msg) {
                can.user.toast(can.user.Share(can, {path: "/share/"+msg.Result()+"/"}, true))
            }, true)
            return true
        })
    },
    "保存": function(event, can, msg, cmd, target) {
        var list = []
        can.page.Select(can, target, "fieldset", function(item) {var meta = item.Meta
            can.page.Select(can, item, "form.option", function(option) {
                meta.args = can.page.Select(can, option, ".args", function(item) {return item.value})
            })
            list.push(meta.node||"", meta.group, meta.index, meta.help, JSON.stringify(meta.args||[]))
        })
        can.run(event, [can.Conf("river"), can.Conf("storm"), "save"].concat(list), function(msg) {
            can.user.toast("保存成功")
        })
    },
    "刷新": function(event, can, msg, cmd, target) {
        can.page.Select(can, can.output, "fieldset.item>div.output", function(item) {
            item.innerHTML = "";
        })
        can.run(event, [can.Conf("river"), can.Conf("storm")], function(msg) {
            can.onimport.init(event, can, msg, cmd, can.output)
        })
    },
    "清屏": function(event, can, msg, cmd, target) {
        can.page.Select(can, can.output, "fieldset.item>div.output", function(item) {
            item.innerHTML = "";
        })
    },
    "并行": function(event, can, msg, cmd, target) {
        can.page.Select(can, target, "fieldset.item", function(field) {
            can.page.Select(can, field, "input[type=button]", function(input, index) {
                index == 0 && field.Check(event, input, function() {})
            })
        })
    },
    "串行": function(event, can, msg, cmd, target) {
        can.core.Next(can.page.Select(can, target, "fieldset.item", function(field) {
            return field
        }), function(field, cb) {
            can.page.Select(can, field, "input[type=button]", function(input, index) {
                index == 0 && field.Check(event, input, cb)
            })
        })
    },
    action: function(event, can, value, cmd, target) {
        switch (value) {
            case "正常":
                can.page.Select(can, target, "fieldset.item", function(item) {
                    item.setAttribute("draggable", false)
                    item.style.position = ""
                    item.style.left = ""
                    item.style.top = ""
                })
                break
            case "编排":
                can.page.Select(can, target, "fieldset.item", function(item) {
                    item.setAttribute("draggable", true)
                    item.ondragstart = function(event) {can.drag = event.target}
                    item.ondragover = function(event) {event.preventDefault()}
                    item.ondrop = function(event) {event.preventDefault()
                        item.parentNode.insertBefore(can.drag, item)
                    }
                })
                break
            case "定位":
                var max = 0;
                var current, begin;
                can.page.Select(can, target, "fieldset.item", function(item) {
                    item.style.left = item.offsetLeft + "px"
                    item.style.top = item.offsetTop + "px"
                })
                can.page.Select(can, target, "fieldset.item", function(item) {
                    item.style.position = "absolute"
                    item.onmousedown = function(event) {
                        if (can.Action("action") != "定位") {return}

                        if (current) {
                            current.style.left = event.clientX - begin.x + begin.left + "px"
                            current.style.top = event.clientY - begin.y + begin.top + "px"
                            current = null;
                            return
                        }
                        current = event.target;
                        current.style["z-index"] = max = max + 1
                        begin = {x: event.clientX, y: event.clientY, left: item.offsetLeft, top: item.offsetTop}
                    };
                    target.onmousemove = item.onmousemove = function(event) {if (!current) {return}
                        current.style.left = event.clientX - begin.x + begin.left + "px"
                        current.style.top = event.clientY - begin.y + begin.top + "px"
                    }
                })
                break
        }
    },
})
Volcanos("onchoice", {help: "组件菜单", list: ["保存", "刷新", "共享"]})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

