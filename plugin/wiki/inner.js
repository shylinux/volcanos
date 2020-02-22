Volcanos("onimport", {help: "导入数据", list: [],
    init: function(can, msg, cb, output, action, option) {output.innerHTML = msg.Result();
        can.page.Select(can, output, "table", function(table) {can.page.OrderTable(can, table)})
        can.page.Select(can, output, ".story", function(story) {var data = story.dataset||{};
            story.oncontextmenu = function(event) {var detail = can.feature.detail || can.ondetail.list;
                switch (data.type) {
                    case "shell":
                        detail = ["运行"]
                }

                can.user.carte(event, shy("", can.ondetail, detail, function(event, cmd, meta) {var cb = meta[cmd];
                    typeof cb == "function"? cb(event, can, msg, cmd, story):
                        can.run(event, ["story", typeof cb == "string"? cb: cmd, data.type, data.name, data.text], function(msg) {

                            var timer = msg.Result()? can.user.toast(msg.Result()): can.user.toast({
                                duration: -1, text: cmd, width: 800, height: 400,
                                list: [{type: "table", list: [{row: msg.append, sub: "th"}].concat(msg.Table(function(line, index) {
                                    return {row: can.core.List(msg.append, function(key) {return msg[key][index]})}
                                }))}, {button: ["关闭", function(event) {timer.stop = true}]}],
                            })
                        }, true)
                }))
            }
        })
        can.page.Select(can, output, "div.stack", function(stack) {var data = stack.dataset||{};
            function fold(stack) {
                stack.nextSibling && (stack.nextSibling.style.display = "none")
                can.page.Select(can, stack, "span.state", function(state) {
                    if (state.innerText == "o") {return}
                    can.page.ClassList.add(can, stack, "fold")
                    can.page.ClassList.del(can, stack, "span")
                    state.innerText = ">"
                })
            }
            function span(stack) {
                stack.nextSibling && (stack.nextSibling.style.display = "")
                can.page.Select(can, stack, "span.state", function(state) {
                    if (state.innerText == "o") {return}
                    can.page.ClassList.add(can, stack, "span")
                    can.page.ClassList.del(can, stack, "fold")
                    state.innerText = "v"
                })
            }
            function mark(stack, color) {
                stack.style.background = color;
                stack.style.color = color == ""? "": "white";
            }

            stack.oncontextmenu = function(event) {var detail = can.feature.detail || can.ondetail.list, target = event.target;
                can.user.carte(event, shy("", can.ondetail, ["全部折叠", "全部展开", "标记颜色", "清除颜色", "red", "green", "blue"], function(event, cmd, meta) {var cb = meta[cmd];
                    switch (cmd) {
                        case "red":
                        case "green":
                        case "blue":
                            mark(target, cmd)
                            break
                        case "标记颜色":
                            can.user.prompt("请输入颜色：", function(color) {
                                mark(target, color)
                            })
                            break
                        case "清除颜色":
                            mark(target, "")
                            break
                        case "全部折叠":
                            fold(stack), can.page.Select(can, stack.nextSibling, "div.stack", fold)
                            break
                        case "全部展开":
                            span(stack), can.page.Select(can, stack.nextSibling, "div.stack", span)
                            break
                    }
                }))
            }
            stack.onclick = function(event) {stack.nextSibling && (stack.nextSibling.style.display == "none"? span(stack): fold(stack))}
        })
    },
    favor: function(event, can, msg, cmd, output) {var key = msg.detail[0];
        var cb = can.onaction[key]; if (typeof cb == "function") {cb(event, can, msg, cmd, output); return msg.Echo(can._name, " onaction ", key), msg._hand = true}
        var cb = can.onchoice[key]; if (typeof cb == "function") {cb(event, can, msg, cmd, output); return msg.Echo(can._name, " onchoice ", key), msg._hand = true}
    },
})
Volcanos("onaction", {help: "组件交互", list: []})
Volcanos("onchoice", {help: "组件菜单", list: ["返回", "清空", "复制", "下载", "表格", "绘图", "媒体"],
    "返回": function(event, can, msg, key, target) {
        can.run(event, ["", "Last"])
    },
    "清空": function(event, can, msg, key, target) {
        can.target.innerHTML = "";
    },
    "复制": function(event, can, msg, key, target) {
        var list = can.onexport.Format(can, msg, "data");
        can.user.toast(can.page.CopyText(can, list[2]), "复制成功")
    },
    "下载": function(event, can, msg, key, target) {
        var list = can.onexport.Format(can, msg, msg._plugin_name||"data");
        can.page.Download(can, list[0]+list[1], list[2]);
    },
})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})


