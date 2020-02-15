Volcanos("onimport", {help: "导入数据", list: [],
    _begin: function(can) {},
    _start: function(can) {},
    init: shy("添加控件", function(can, item, name, value, option) {
        var input = {type: "input", name: name, data: item};
        item.type = item.type || item._type || item._input;
        switch (item.type) {
            case "upfile": item.type = "file"; break
            case "select":
                item.values = typeof item.values == "string"? item.values.split(" "): item.values;
                input.type = "select", input.list = item.values.map(function(value) {
                    return {type: "option", value: value, inner: value};
                })
                item.value = value || item.value || item.values[0];
                can.page.ClassList.add(can, item, "args");
                break
            case "textarea":
                var half = parseFloat(item.half||"1")||1;
                input.type = "textarea", item.style = "height:"+(item.height||"50px")+";width:"+parseInt(((500-35)/half))+"px";
                // no break
            case "password":
            case "text":
                can.page.ClassList.add(can, item, "args");
                item.value = value || item.value || "";
                item.autocomplete = "off";
                break
            case "button":
                item.value = item.value || item.name;
        }
        can.page.ClassList.add(can, item, item.view);
        can.core.List((item.clist||"").split(" "), function(value) {
            can.page.ClassList.add(can, item, value);
        })

        var target = can.Dream(option, "input", input)[input.name];
        !target.placeholder && (target.placeholder = item.name || "");
        // (item.type == "text" || item.type == "textarea") && !target.placeholder && (target.placeholder = item.name || "");
        item.type == "text" && !target.title && (target.title = item.placeholder || item.name || "");
        item.type == "button" && item.action == "auto" && can.run && can.run({});
        item.type == "textarea" && can.page.Append(can, option, [{type: "br"}])
        return target;
    }),
    path: function(event, can, value, cmd, target) {
        return target.value + (target.value == "" || target.value.endsWith("/")? "": "/") + value
    },
})
Volcanos("onfigure", {help: "控件详情", list: [],
    key: {click: function(event, can, value, cmd, target) {
        function add(msg, list, update) {
            can.page.Append(can, can.figure.output, [{view: "list", list: can.core.List(list, function(item) {
                return {text: [item, "div", "label"], onclick: function(event) {
                    target.value = item;
                    update && can.history.unshift(item);
                    msg.Option("_refresh") && run()
                }}
            })}])
        }
        function run() {can.figure.output.innerHTML = ""
            can.Run(event, ["action", "input", can.item.name, target.value], function(msg) {
                add(msg, can.history), can.core.List(msg.append, function(key) {add(msg, msg[key], true)})
            }, true)
        }

        can.history = can.history || [];
        can.onfigure._prepare(event, can, value, cmd ,target) && run()
    }},
    date: {click: function(event, can, value, cmd, target) {if (can.date) {return}
        target.style.width = "120px"
        function set(now) {
            target.value = can.base.Time(now); 
            if (can.item.action == "auto") {
                can.run({});
            }
        }

        can.stick = false
        can.now = target.value? new Date(target.value): new Date();
        can.date = can.page.Append(can, document.body, [{view: ["date input", "fieldset"], style: {
            position: "absolute", left: event.clientX+"px", top: event.clientY+10+"px",
        }, onmouseleave: function(event) {
            if (can.stick) {can.stick = false; return}
            can.page.Remove(can, can.date); delete(can.date);
        }}]).last

        var action = can.page.Append(can, can.date, [{view: ["action"]}]).last
        var control = can.page.AppendAction(can, action, ["今天", "随机",
            ["hour"].concat(can.core.List(24)), ["minute"].concat(can.core.List(0, 60, 5)), ["second"].concat(can.core.List(0, 60, 5)), {view: ["", "br"]},
            "上一月", ["year"].concat(can.core.List(can.now.getFullYear() - 20, can.now.getFullYear() + 20)),
            ["month"].concat(can.core.List(1, 13)), "下一月", {view: ["", "br"]},
        ], function(event, value, cmd) {can.stick = true;
            switch (cmd) {
                case "year": can.now.setFullYear(parseInt(value)); show(can.now); return;
                case "month": can.now.setMonth(parseInt(value)-1); show(can.now); return;
                case "hour": can.now.setHours(parseInt(value)); show(can.now); set(can.now); return;
                case "minute": can.now.setMinutes(parseInt(value)); show(can.now); set(can.now); return;
                case "second": can.now.setSeconds(parseInt(value)); show(can.now); set(can.now); return;
            }

            switch (value) {
                case "今天": can.now = new Date(); show(can.now); set(can.now); break;
                case "随机": can.now.setDate((Math.random() * 100 - 50) + can.now.getDate()); show(can.now); set(can.now); break;
                case "关闭":can.page.Remove(can, can.date); delete(can.date);
                case "前一年": can.now.setFullYear(can.now.getFullYear()-1); show(can.now); break;
                case "后一年": can.now.setFullYear(can.now.getFullYear()+1); show(can.now); break;
                case "上一月": can.now.setMonth(can.now.getMonth()-1); show(can.now); break;
                case "下一月": can.now.setMonth(can.now.getMonth()+1); show(can.now); break;
            }
        })

        var table = can.page.Append(can, can.date, [{type: "table"}]).table
        function click(event) {
            var day = new Date(parseInt(event.target.dataset.date))
            can.now = day;
            set(can.now);
        }
        function show(now) {
            control.month.value = now.getMonth()+1;
            control.year.value = now.getFullYear();
            control.hour.value = now.getHours();
            control.minute.value = parseInt(now.getMinutes()/5)*5;
            control.second.value = parseInt(now.getSeconds()/5)*5;
            var meta = ["日", "一", "二", "三", "四", "五", "六"]
            can.page.Appends(can, table, [{type: "tr", list: can.core.List(meta, function(day) {return {text: [day, "th"]}})}])

            var one = new Date(now); one.setDate(1);
            var end = new Date(now); end.setMonth(now.getMonth()+1); end.setDate(1);
            var head = new Date(one); head.setDate(one.getDate()-one.getDay());
            var tail = new Date(end); tail.setDate(end.getDate()+7-end.getDay());

            var tr;
            function add(day, type) {
                if (day.getDay() == 0) {tr = can.page.Append(can, table, [{type: "tr"}]).tr}
                can.page.Append(can, tr, [{className: can.base.Time(day).split(" ")[0] == can.base.Time(now).split(" ")[0]? "now": type,
                    text: [day.getDate(), "td"], dataset: {date: day.getTime()}, click: click,
                }])
            }
            for (var day = new Date(head); day < one; day.setDate(day.getDate()+1)) {add(day, "last")}
            for (var day = new Date(one); day < end; day.setDate(day.getDate()+1)) {add(day, "main")}
            for (var day = new Date(end); end.getDay() != 0 && day < tail; day.setDate(day.getDate()+1)) {add(day, "next")}
        }

        show(can.now);
        set(can.now);
    }},
    province: {click: function(event, can, value, cmd, target) {
        if (can.figure) {return}
        can.figure = can.page.Append(can, document.body, [{view: ["date input", "fieldset"], style: {
            position: "absolute", left: "20px", top: event.clientY+10+"px",
        }, onmouseleave: function(event) {
            can.page.Remove(can, can.figure); delete(can.figure);
        }}]).last

        can.page.Append(can, can.figure, [{include: ["/plugin/github.com/shylinux/echarts/echarts.js", function(event) {
            can.page.Append(can, can.figure, [{include: ["/plugin/github.com/shylinux/echarts/china.js", function(event) {
                var china_chart = echarts.init(can.page.Append(can, can.figure, [{type: "div", style: {width: "600px", height: "400px"}}]).last);

                var option = {geo: {map: 'china'}};
                china_chart.setOption(option);

                china_chart.on('click', function (params) {
                    target.value = params.name;
                });
            }]}]);
        }]}]);
    },
    },
    upload: {click: function(event, can, value, cmd, target) {
        if (!can.onfigure._prepare(event, can, value, cmd, target)) {return}
        can.figure.stick = true
        var action = can.page.AppendAction(can, can.figure.action, [{type: "input", data: {name: "upload", type: "file"}}, "上传", "关闭"], function(event, value, cmd) {
            switch (value) {
                case "关闭": can.onfigure._release(event, can, value, cmd, target); return
            }

            var msg = can.Event(event);
            msg.upload = action.upload.files[0]
            can.run(event, ["action", "上传"], true, function(msg) {
                can.user.toast("上传成功")
            })
        })
    }},
    _prepare: function(event, can, value, cmd, target) {if (can.figure) {return}
        can.figure = can.page.Append(can, document.body, [{view: ["input "+cmd, "fieldset"], style: {
            position: "absolute", left: "20px", top: event.clientY+10+"px",
        }, list: [{text: [cmd, "legend"]}, {view: ["action"]}, {view: ["output"]}], onmouseleave: function(event) {
            !can.figure.stick && can.onfigure._release(event, can, value, cmd, target)
        }}])
        return can.figure
    },
    _release: function(event, can, value, cmd, target) {
        can.page.Remove(can, can.figure.first); delete(can.figure);
    },
})
Volcanos("onaction", {help: "控件交互", list: [],
    onclick: function(event, can) {can.Select(event);
        var figure = can.onfigure[can.item.cb] || can.onfigure[can.item.figure]
        figure? figure.click(event, can, can.item, can.item.name, event.target): can.item.type == "button" && can.run(event)
    },
    onchange: function(event, can) {
        can.item.type == "select" && can.item.action == "auto" && can.Runs(event)
    },
    onkeydown: function(event, can) {
        can.page.oninput(event, can, function(event) {
            switch (event.key) {
                case "b":
                    can.Append(event)
                    return true
                case "m":
                    can.Clone(event)
                    return true
            }
        })

        switch (event.key) {
            case "Enter": can.run(event, []); break
            case "Escape": event.target.blur(); break
            default:
                if (event.target.value.endsWith("j") && event.key == "k") {
                    can.page.DelText(event.target, event.target.selectionStart-1, 2);
                    event.target.blur();
                    break
                }
                return false
        }
        event.stopPropagation()
        event.preventDefault()
        return true
    },
    onkeyup: function(event, can) {
        switch (event.key) {
            default: return false
        }
        event.stopPropagation()
        event.preventDefault()
        return true
    },
})
Volcanos("onchoice", {help: "控件菜单", list: ["全选", "复制", "清空"],
    "全选": function(event, can, msg, value, target) {
        can.target.focus(), can.target.setSelectionRange(0, can.target.value.length);
    },
    "复制": function(event, can, msg, value, target) {
        can.user.toast(can.page.CopyText(can, can.target.value), "复制成功")
    },
    "清空": function(event, can, msg, value, target) {
        can.target.value = "";
    },
})
Volcanos("ondetail", {help: "控件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

