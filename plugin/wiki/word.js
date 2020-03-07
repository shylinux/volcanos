Volcanos("onimport", {help: "导入数据", list: [],
    init: function(can, msg, cb, output, action, option) {output.innerHTML = "";
        if (msg.Option("_display") == "table") {
            // 文件目录
            can.page.AppendTable(can, output, msg, msg.append, function(event, value, key, index, tr, td) {
                can.Export(event, value, key)
            })
            return typeof cb == "function" && cb(msg);
        }

        output.innerHTML = msg.Result()

        can.page.Select(can, output, ".story", function(item) {var data = item.dataset
            item.oncontextmenu = function(event) {
                can.user.carte(event, shy("组件菜单", can.ondetail, can.ondetail.list, function(event, key, meta) {
                    var cb = meta[key] || can.onchoice[key] || can.onaction[key]; typeof cb == "function" && cb(event, can, data, key, item);
                }));
                event.stopPropagation(), event.preventDefault();
            }

            switch (item.tagName) {
                case "FIELDSET":
                    can.Plugin(can, data.name, JSON.parse(data.meta||"{}"), function(event, cmds, cb, silent) {
                        can.run(event, ["action", "story", data.type, data.name, data.text].concat(cmds), cb, true)
                    }, item, function(sub) {

                    })
                    break
                default:
                    var figure = can.onfigure[data.type||item.tagName]
                    figure && figure.init && figure.init({}, can, msg, "init", item)

            }
        })
        return typeof cb == "function" && cb(msg)
    },
}, ["/plugin/wiki/word.css"])
Volcanos("onfigure", {help: "图形绘制", list: [],
    _spawn: function(sup, can) {can.sup = sup},
    _swell: function(can, sub) {},
    _begin: function(can) {},
    _start: function(can) {},
    _close: function(can) {},

    premenu: {
        init: function(event, can, value, cmd, target) {
            can.page.Append(can, target, can.page.Select(can, can.target, "h1.story,h2.story,h3.story", function(item) {var data = item.dataset;
                return {text: [item.innerHTML, "li"], onclick: function(event) {
                    item.scrollIntoView();
                }};
            }))
        },
        save: function(event, can, value, cmd, target) {return "premenu"},
    },
    endmenu: {
        init: function(event, can, value, cmd, target) {},
        save: function(event, can, value, cmd, target) {return "endmenu"},
    },
    h1: {
        push: function(event, can, value) {
            return [{view: ["story", "h1", value.text], dataset: {type: "title", name: value.name, text: value.text}}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'title "' + value.replace(data.name+" ", "") + '"': ""
        },
    },
    h2: {
        push: function(event, can, value) {
            return [{view: ["story", "h2", value.text], dataset: {type: "chapter", name: value.name, text: value.text}}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'chapter "' + value.replace(data.name+" ", "") + '"': ""
        },
    },
    h3: {
        push: function(event, can, value) {
            return [{view: ["story", "h3", value.text], dataset: {type: "section", name: value.name, text: value.text}}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'section "' + value.replace(data.name+" ", "") + '"': ""
        },
    },
    brief: {
        push: function(event, can, value) {
            return [{view: ["story", "p", value.text], dataset: {type: "brief", name: value.name, text: value.text}}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'brief "'+data.name+'" `' + value + '`': ""
        },
    },
    refer: {
        push: function(event, can, value, cmd, target) {
            return [{view: ["story", "ul"], dataset: {type: "refer", name: value.name, text: value.text}, list: can.core.List(value.text.split("\n"), function(line) {
                return {type: "li", inner: line}
            })}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'refer "'+data.name+'" `\n' + can.page.Select(can, target, "li", function(item) {
                return item.innerHTML.replace(": ", " ")
            }).join("\n") + '\n`': ""
        },
    },
    spark: {
        push: function(event, can, value) {
            return [{view: ["story", "p", value.text], dataset: {type: "spark", name: value.name, text: value.text}}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'spark "'+data.name+'" `' + value + '`': "spark"
        },
    },

    local: {
        push: function(event, can, value) {
            return [{view: ["story", "div", value.text], dataset: {type: "local", name: value.name, text: value.text}}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'local "'+data.name+'" '+' `' + data.text + '`': ""
        },
    },
    shell: {
        push: function(event, can, value) {
            return [{view: ["story", "code", value.text], dataset: {type: "shell", name: value.name, dir: "./", text: value.text}}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'shell "'+data.name+'" '+'"'+data.dir+'"' +' `' + data.text + '`': ""
        },
    },
    field: {
        push: function(event, can, value) {
            return [{view: ["story", "code", value.text], dataset: {type: "field", name: value.name, text: value.text}}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'field "'+data.name+'" `'+data.text+'`': ""
        },
    },

    order: {
        push: function(event, can, value) {
            return [{view: ["story", "ul"], dataset: {type: "order", name: value.name, text: value.text}, list: can.core.List(value.text.split("\n"), function(line) {
                return {type: "li", inner: line}
            })}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'order "'+data.name+'" `\n' + can.page.Select(can, target, "li", function(item) {
                return item.innerHTML
            }).join("\n") + '\n`': ""
        },
    },
    table: {
        data: {menu: ["追加行", "追加列", "删除行", "删除列"]},
        push: function(event, can, value) {
            return [{view: ["story", "table"], dataset: {type: "table", name: value.name, text: value.text}, list: can.core.List(value.text.split("\n"), function(line, index) {
                return {type: "tr", list: can.core.List(line.split(" "), function(word) {
                    return {type: index==0? "th": "td", inner: word}
                })}
            })}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'table "'+data.name+'" `\n' + can.page.Select(can, target, "tr", function(tr) {
                return can.page.Select(can, tr, "th,td", function(td) {
                    return td.innerHTML
                }).join(" ")
            }).join("\n") + '\n`': ""
        },
    },
    stack: {
        init: function(event, can, value, cmd, target) {var data = target.dataset;
            can.page.Select(can, target, "div.stack", function(stack) {var data = stack.dataset||{};
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

                stack.onclick = function(event) {stack.nextSibling && (stack.nextSibling.style.display == "none"? span(stack): fold(stack))}
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
            })
        },
        push: function(event, can, value) {
            return [{view: ["story", "div", value.text], dataset: {type: "stack", name: value.name, text: value.text}}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'stack "'+data.name+'"' +' `' + data.text + '`': ""
        },
    },
    label: {
        init: function(event, can, value, cmd, target) {var data = target.dataset;
            target.Value = function(key, value) {return value && target.setAttribute(key, value), target.getAttribute(key||"class")||target[key]&&target[key].baseVal&&target[key].baseVal.value||target[key]&&target[key].baseVal||""}
        },
        push: function(event, can, value) {
            return [{view: ["story", "svg", value.text], dataset: {type: "label", name: value.name, text: value.text}}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'label "'+data.name+'"' +' `\n' + data.text + '\n`' + " " + [
                target.Value("font-size")||16, target.Value("stroke")||"yellow", target.Value("fill")||"blue",
            ].join(" "): ""
        },
    },
    chain: {
        init: function(event, can, value, cmd, target) {var data = target.dataset;
            target.Value = function(key, value) {return value && target.setAttribute(key, value), target.getAttribute(key||"class")||target[key]&&target[key].baseVal&&target[key].baseVal.value||target[key]&&target[key].baseVal||""}
        },
        push: function(event, can, value) {
            return [{view: ["story", "svg", value.text], dataset: {type: "chain", name: value.name, text: value.text}}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'chain "'+data.name+'"' +' `\n' + data.text + '\n`': ""
        },
    },
}, [], function(can) {var sup = can.sup

})
Volcanos("onaction", {help: "组件菜单", list: ["保存", "刷新", ["操作", "只读", "排序", "编辑"]],
    "保存": function(event, can, value, cmd, target) {
        can.run(event, ["action", cmd, can.Option("path"), can.Export(event, "", "file")], function(msg) {
            can.user.toast("保存成功")
        }, true)
    },
    "刷新": function(event, can, value, cmd, target) {
        can.run(event)
    },

    "只读": function(event, can, value, cmd, target) {
        can.page.Select(can, can.target, ".story", function(item) {
            item.setAttribute("contenteditable", false)
            item.setAttribute("draggable", false)
        })
    },
    "排序": function(event, can, value, cmd, target) {
        can.page.Select(can, can.target, ".story", function(item) {
            item.setAttribute("draggable", true)
            item.ondragstart = function(event) {can.drag = event.target}
            item.ondragover = function(event) {event.preventDefault()}
            item.ondrop = function(event) {event.preventDefault()
                can.target.insertBefore(can.drag, item)
            }
        })
    },
    "编辑": function(event, can, value, cmd, target) {
        can.page.Select(can, can.target, ".story", function(item) {
            item.setAttribute("contenteditable", true)
        })
    },
})
Volcanos("onchoice", {help: "组件交互", list: ["保存", "刷新", "编辑", "排序"]})
Volcanos("ondetail", {help: "组件详情", list: ["保存", "刷新", "编辑", "复制", "插入", "删除"],
    "复制": function(event, can, value, cmd, target) {
        var clone = target.cloneNode(true);
        target.parentNode.insertBefore(clone, target);
    },
    "插入": function(event, can, value, cmd, target) {
        can.user.input(event, can, [["type", "spark", "refer", "brief", "h3", "h2", "h1",
            "local", "shell", "field", "order", "table", "stack", "label", "chain"], "name", {name: "text", type: "textarea"}], function(event, value, form, list) {
            var figure = can.onfigure[form.type]
            var node = can.page.Append(can, target.parentNode, figure.push(event, can, form)).first;
            figure && figure.init && figure.init(event, can, figure, "init", node);
            target.parentNode.insertBefore(node, target);
        })
    },
    "删除": function(event, can, value, cmd, target) {
        can.page.Remove(can, target)
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    file: function(event, can, shy, cmd, target) {
        return can.page.Select(can, target, ".story", function(story) {
            var figure = can.onfigure[story.dataset.type] || can.onfigure[story.localName];
            var text = figure && figure.save && figure.save(event, can, story.innerText||story.innerHTML, cmd, story) || story.innerText||story.innerHTML
            return text
        }).join("\n\n")
    },
})

