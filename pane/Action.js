Volcanos("onimport", {help: "导入数据", list: [],
    _begin: function(can) {},
    _start: function(can) {
        can.page.Select(can, can.action, "input,select", function(input) {
            input.value = can.user.Search(can, input.name) || input.value || ""
        })
    },

    init: function(event, can, msg, cmd, field) {can.output.innerHTML = "";
        can._local[msg.cmds[0]] = can._local[msg.cmds[0]] || {}
        can._local[msg.cmds[0]][msg.cmds[1]] = msg.Table(function(item, index) {if (!item.name) {return}
            // 添加插件
            var plugin = can[item.name] = can.Plugin(can, item.name, item, function(event, cmds, cbs) {
                can.run(event, [item.river, item.storm, item.action].concat(cmds), cbs)
            }, can.page.AppendField(can, can.output, "item "+item.name, item))
            return can._plugins.push(plugin), plugin
        })
    },
    river: function(event, can, value, cmd, field) {if (value == "update") {return}
        can.Conf("temp_river", value)
    },
    storm: function(event, can, value, cmd, field) {if (value == "update") {return}
        // 保存界面
        can.Cache(can.Conf("river")+"."+can.Conf("storm"), can.output, "some");
        if (can.Cache(can.Conf("river", can.Conf("temp_river"))+"."+can.Conf("storm", value), can.output)) {
            // 恢复界面
            return
        }
        // 刷新界面
        can.run(event, [can.Conf("river"), can.Conf("storm")], function(msg) {
            can.onimport.init(event, can, msg, cmd, can.output)
        })
    },
    you: function(event, can, value, cmd, field) {
        can.user.title(value)
    },

    layout: function(event, can, value, cmd, field) {value && can.Action(cmd, value)},
    scroll: function(event, can, value, cmd, field) {can.layout = value;
        can.output.parentElement.scrollBy(value.x, value.y)
    },
    favor: function(event, can, msg, cmd, field) {if (msg._hand) {return}
        var cmds = msg.detail, key = cmds[0];
        if (key == can.name()) {key = cmds[1], cmds = cmds.slice(1)}

        // 下发数据
        can.core.Item(can._local, function(river, list) {
            can.core.Item(list, function(storm, list) {
                can.core.List(list, function(sub) {
                    if (sub._name == key) {
                        sub.Select(event), msg._hand = true;
                        msg.Echo(can._name, " ", key)
                    }
                })
            })
        })
    },
})
Volcanos("onaction", {help: "组件交互", list: [
    ["layout"].concat(Config.layout.list), "清屏", "刷新", "并行","串行",
    ["action", "正常", "竖排", "编排", "定位", "定形"],
    {input: "pod"}, {input: "you"}, {input: "hot"}, {input: "top"},
],
    layout: function(event, can, value, cmd, field) {can.Export(event, value, cmd)},

    "清屏": function(event, can, msg, cmd, field) {
        can.page.Select(can, can.output, "fieldset.item>div.output", function(item) {
            item.innerHTML = "";
        })
    },
    "刷新": function(event, can, msg, cmd, field) {
        can.page.Select(can, can.output, "fieldset.item>div.output", function(item) {
            item.innerHTML = "";
        })
        can.run(event, [can.Conf("river"), can.Conf("storm")], function(msg) {
            can.onimport.init(event, can, msg, cmd, can.output)
        })
    },
    "并行": function(event, can, msg, cmd, field) {
        can.page.Select(can, field, "fieldset.item", function(field) {
            can.page.Select(can, field, "input[type=button]", function(input, index) {
                index == 0 && input.click()
            })
        })
    },
    "串行": function(event, can, msg, cmd, field) {
        can.core.Next(can.page.Select(can, field, "fieldset.item", function(field) {
            return field
        }), function(field, cb) {
            can.page.Select(can, field, "input[type=button]", function(input, index) {
                index == 0 && field.Check(event, input, cb)
            })
        })
    },

    "正常": function(event, can, value, cmd, field) {
        can.page.Select(can, can.output, "fieldset.item", function(item) {
            item.setAttribute("draggable", false)
            item.style.position = ""
            item.style.cursor = ""
            item.style.clear = ""
            item.style.left = ""
            item.style.top = ""
        })
    },
    "竖排": function(event, can, value, cmd, field) {
        can.page.Select(can, can.output, "fieldset.item", function(item) {
            item.style.clear = "both"
        })
    },
    "编排": function(event, can, value, cmd, field) {
        can.page.Select(can, can.target, "fieldset.item", function(item) {
            item.setAttribute("draggable", true)
            item.ondragstart = function(event) {can.drag = event.target}
            item.ondragover = function(event) {event.preventDefault()}
            item.ondrop = function(event) {event.preventDefault()
                item.parentNode.insertBefore(can.drag, item)
            }
        })
    },
    "定位": function(event, can, value, cmd, field) {
        can.page.Select(can, can.output, "fieldset.item", function(item) {
            item.style.left = item.offsetLeft + "px"
            item.style.top = item.offsetTop + "px"
        })

        var max, current, begin;
        can.page.Select(can, can.output, "fieldset.item", function(item) {
            item.style.position = "absolute"

            item.onmousedown = function(event) {if (can.Action("action") != "定位") {return}
                if (current) {
                    // 更新位置
                    current.style.left = begin.left + event.clientX - begin.x + "px"
                    current.style.top = begin.top + event.clientY - begin.y + "px"
                    current = null;
                    return
                }
                // 记录位置
                current = item;
                current.style["z-index"] = max = max + 1
                begin = {x: event.clientX, y: event.clientY, left: item.offsetLeft, top: item.offsetTop}
            };

            can.output.onmousemove = item.onmousemove = function(event) {if (!current) {return}
                // 移动位置
                current.style.left = begin.left + event.clientX - begin.x + "px"
                current.style.top = begin.top + event.clientY - begin.y + "px"
            }
        })
    },
    "定形": function(event, can, value, cmd, field) {
        can.page.Select(can, can.output, "fieldset.item", function(item) {
            item.style.top = item.offsetTop + "px"
            item.style.left = item.offsetLeft + "px"
            item.style.width = item.offsetWidth + "px"
            item.style.height = item.offsetHeight + "px"
        })

        var max, pos, current, begin;
        can.page.Select(can, can.output, "fieldset.item", function(item) {
            item.style.position = "absolute"

            item.onmousedown = function(event) {
                if (can.Action("action") != "定形") {return}
                if (current) {current = null; return}

                // 记录位置
                current = item;
                current.style["z-index"] = max = max + 1
                begin = {
                    x: event.clientX, y: event.clientY,
                    left: item.offsetLeft, top: item.offsetTop,
                    width: item.offsetWidth, height: item.offsetHeight,
                }
            };

            item.onmousemove = function(event) {
                if (can.Action("action") != "定形") {return}
                var pos = can.page.Prepos(event, item)
                if (!current) {return}
                can.page.Resize(event, current, begin, pos)
            }
        })
    },
})
Volcanos("onchoice", {help: "组件菜单", list: ["共享", "保存", "刷新"],
    "共享": function(event, can, msg, cmd, field) {
        can.user.input(event, can, ["name", "text"], function(event, cmd, meta, list) {
            var msg = can.Event(event);
            msg.Option("name", meta.name)
            msg.Option("text", meta.key)
            cmd == "提交" && can.Export(event, can.name(), "share")
            return true
        })
    },
    "保存": function(event, can, msg, cmd, field) {
        var list = []
        can.page.Select(can, field, "fieldset", function(item) {var meta = item.Meta
            can.page.Select(can, item, "form.option", function(option) {
                meta.args = can.page.Select(can, option, ".args", function(item) {return item.value})
            })
            list.push(meta.node||"", meta.group, meta.index, meta.help, JSON.stringify(meta.args||[]))
        })
        can.run(event, [can.Conf("river"), can.Conf("storm"), "save"].concat(list), function(msg) {
            can.user.toast("保存成功")
        })
    },
})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

