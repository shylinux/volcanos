Volcanos("onimport", {help: "导入数据", list: [],
    _begin: function(can) {},
    _start: function(can) {},
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

        can.preview = can.page.Append(can, output, [{view: "preview", inner: msg.Result(),
            style: {border: "solid 2px red"},
        }]).last

        can.page.Select(can, can.preview, ".story", function(item) {
            var figure = can.onfigure[item.dataset.type] || can.onfigure[item.localName];

            item.onclick = function(event) {can.node = item}
            item.oncontextmenu = function(event) {var target = event.target; can.user.carte(event, shy("", can.ondetail, figure.menu||can.ondetail.list, function(event, key, meta) {var cb = meta[key];
                typeof cb == "function" && cb(event, can, msg, 0, key, key, target);
            }), can), event.stopPropagation(), event.preventDefault()}

            figure && figure.init && figure.init({}, can, item.localName, "init", item)
        })
        return typeof cb == "function" && cb(msg), can.preview;
    },
    which: function(event, table, list, cb) {if (event.target == table) {return cb(-1, "")}
        can.page.Select(can, table, "tr", function(tr, index) {if (event.target == tr) {return cb(index-1, "")}
            can.page.Select(can, tr, "th,td", function(td, order) {
                if (event.target == td) {return cb(index-1, list[order])}
            })
        })
    },
})
Volcanos("onfigure", {help: "图形绘制", list: [],
    premenu: {
        init: function(event, can, value, cmd, target) {
            can.page.Append(can, target, can.page.Select(can, can.preview, "h1.story,h2.story,h3.story", function(item) {var data = item.dataset;
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
        push: function(event, can, value, cmd, target) {var data = target.dataset;
            return [{view: ["story", "h1", "h1"], dataset: {type: "title", name: "", text: ""}, inner: "h1...."}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'title "' + value.replace(data.name+" ", "") + '"': ""
        },
    },
    h2: {
        push: function(event, can, value, cmd, target) {
            return [{view: ["story", "h2", "h2"], dataset: {type: "title", name: "", text: ""}, inner: "h2...."}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'chapter "' + value.replace(data.name+" ", "") + '"': ""
        },
    },
    h3: {
        push: function(event, can, value, cmd, target) {var data = target.dataset;
            return [{view: ["story", "h3", "h3"], dataset: {type: "title", name: "", text: ""}, inner: "h3...."}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'section "' + value.replace(data.name+" ", "") + '"': ""
        },
    },
    brief: {
        push: function(event, can, value, cmd, target) {var data = target.dataset;
            return [{view: ["story", "p", "p"], dataset: {type: "brief", name: "", text: ""}, inner: "brief...."}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'brief "'+data.name+'" `' + value + '`': ""
        },
    },
    refer: {
        push: function(event, can, value, cmd, target) {var data = target.dataset;
            return [{view: ["story", "ul"], dataset: {type: "refer", name: "", text: ""}, list: [{type: "li", inner: "refer...."}]}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'refer "'+data.name+'" `\n' + can.page.Select(can, target, "li", function(item) {
                return item.innerHTML.replace(": ", " ")
            }).join("\n") + '\n`': ""
        },
    },
    spark: {
        push: function(event, can, value, cmd, target) {var data = target.dataset;
            return [{view: ["story", "p", "p"], dataset: {type: "spark", name: "", text: ""}, inner: "spark...."}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'spark "'+data.name+'" `' + value + '`': ""
        },
    },

    local: {
        push: function(event, can, value, cmd, target) {var data = target.dataset;
            return [{view: ["story", "div"], dataset: {type: "local", name: "", text: ""}, inner: "local...."}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'local "'+data.name+'" '+' `' + data.text + '`': ""
        },
    },
    shell: {
        push: function(event, can, value, cmd, target) {var data = target.dataset;
            return [{view: ["story", "code", "code"], dataset: {type: "shell", name: "", text: "", dir: "./"}, inner: "shell...."}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'shell "'+data.name+'" '+'"'+data.dir+'"' +' `' + data.text + '`': ""
        },
    },
    order: {
        push: function(event, can, value, cmd, target) {var data = target.dataset;
            return [{view: ["story", "ul"], dataset: {type: "order", name: "", text: ""}, list: [{type: "li", inner: "order...."}]}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'order "'+data.name+'" `\n' + can.page.Select(can, target, "li", function(item) {
                return item.innerHTML
            }).join("\n") + '\n`': ""
        },
    },
    table: {
        data: {menu: ["追加行", "追加列", "删除行", "删除列"]},
        push: function(event, can, value, cmd, target) {var data = target.dataset;
            return [{view: ["story", "table", "table"], dataset: {type: "table", name: "", text: ""}, list: [
                {type: "tr", list: [{type: "th"}, {type: "th"}]},
                {type: "tr", list: [{type: "td"}, {type: "td"}]},
            ]}]
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
        push: function(event, can, value, cmd, target) {var data = target.dataset;
            return [{view: ["stack", "div"], dataset: {type: "stack", name: "", text: ""}}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'stack "'+data.name+'"' +' `' + data.text + '`': ""
        },
    },

    label: {
        init: function(event, can, value, cmd, target) {var data = target.dataset;
            target.Value = function(key, value) {return value && target.setAttribute(key, value), target.getAttribute(key||"class")||target[key]&&target[key].baseVal&&target[key].baseVal.value||target[key]&&target[key].baseVal||""}
        },
        push: function(event, can, value, cmd, target) {var data = target.dataset;
            return [{view: ["story", "svg"], dataset: {type: "story", name: "", text: ""}}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'label "'+data.name+'"' +' `\n' + data.text + '\n`' + " " + [
                target.Value("font-size")||16, target.Value("stroke")||"yellow", target.Value("fill")||"blue",
            ].join(" "): ""
        },
    },
    chain: {
        push: function(event, can, value, cmd, target) {var data = target.dataset;
            return [{view: ["story", "svg"], dataset: {type: "story", name: "", text: ""}}]
        },
        save: function(event, can, value, cmd, target) {var data = target.dataset;
            return value? 'chain "'+data.name+'"' +' `\n' + data.text + '\n`': ""
        },
    },
})
Volcanos("onaction", {help: "组件菜单", list: ["保存", ["操作", "只读", "排序", "编辑"],
    "插入", ["元素", "h1", "h2", "h3", "brief", "refer", "spark", "shell", "order", "table", "stack"]],

    "保存": function(event, can, value, cmd, target) {
        var save = can.page.Select(can, target, ".story", function(story) {
            var figure = can.onfigure[story.dataset.type] || can.onfigure[story.localName];
            return figure && figure.save && figure.save(event, can, story.innerHTML, cmd, story) || story.innerHTML
        }).join("\n\n")

        can.run(event, ["action", cmd, can.Option("name"), save], function(msg) {
            can.user.toast("保存成功")
        }, true)
    },
    "只读": function(event, can, value, cmd, target) {
        can.page.Select(can, can.preview, ".story", function(item) {
            item.setAttribute("contenteditable", false)
            item.setAttribute("draggable", false)
        })
    },
    "排序": function(event, can, value, cmd, target) {
        can.page.Select(can, can.preview, ".story", function(item) {
            item.setAttribute("draggable", true)
            item.ondragstart = function(event) {can.drag = event.target}
            item.ondragover = function(event) {event.preventDefault()}
            item.ondrop = function(event) {event.preventDefault()
                can.preview.insertBefore(can.drag, item)
            }
        })
    },
    "编辑": function(event, can, value, cmd, target) {
        can.page.Select(can, can.preview, ".story", function(item) {
            item.setAttribute("contenteditable", true)
        })
    },
    "插入": function(event, can, value, cmd, target) {var figure = can.onfigure[can.Action("元素")];
        can.page.Append(can, can.preview, figure.push(event, can, value, cmd, target)).first.setAttribute("contenteditable", true)
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
    "删除": function(event, can, msg, index, key, cmd, target) {
        can.page.Remove(can, target)
    },

    "删除行": function(event, can, msg, index, key, cmd, target) {
        var table = target.parentNode.parentNode
        var tr = target.parentNode
        table.removeChild(tr)
    },
    "追加行": function(event, can, msg, index, key, cmd, target) {
        var tr = document.createElement("tr")
        can.page.Append(can, tr, can.page.Select(can, target.parentNode, "td,th", function() {
            return {type: "td", inner: " "}
        }))
        target.parentNode.parentNode.append(tr)
    },
    "追加列": function(event, can, msg, index, key, cmd, target) {
        var table = target.parentNode.parentNode
        var tr = target.parentNode
        var index = can.page.Select(can, tr, "th,td", function(item, index) {
            return item == target && index || undefined
        })[0]

        can.page.Select(can, table, "tr", function(tr, index) {
            can.page.Append(can, tr, [{type: index == 0? "th": "td", inner: " "}])
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: []})

