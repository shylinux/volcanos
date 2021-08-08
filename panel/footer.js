Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can)
        can.onimport._title(can, msg, target)
        can.onimport._state(can, msg, target)
        can.onimport._cli(can, msg, target)
        can.onimport._toast(can, msg, target)
        can.base.isFunc(cb) && cb(msg)
    },
    _title: function(can, msg, target) { const TITLE = chat.TITLE
        !can.user.isMobile && can.core.List(msg.result, function(item) {
            can.page.Append(can, target, [{view: [TITLE, html.DIV, item], title: "联系站长"}])
        })
    },
    _state: function(can, msg, target) { const STATE = "state"
        can.core.List(can.base.Obj(can.Conf(STATE)||msg.Option(STATE), ["ncmd"]), function(item) {
            can.page.Append(can, target, [{view: [STATE+" "+item, html.DIV, can.Conf(item)], list: [
                {text: [item, html.LABEL]}, {text: [": ", html.LABEL]}, {text: [can.Conf(item)||"", html.SPAN, item]},
            ], onclick: function(event) {
                can.show = can.show? (can.page.Remove(can, can.show), null): can.onaction._cmd(can)
            }}])
        })
    },
    _toast: function(can, msg, target) {
        can.toast = can.page.Append(can, target, [{view: "toast", onclick: function(event) {
            can.show = can.show? (can.page.Remove(can, can.show), null): can.onappend.float(can, can._toast).first
        }}]).first
    },
    _cli: function(can, msg, target) {
        can.page.Append(can, target, [{input: ["cmd", function(event) {
            can.onkeypop.input(event, can); if (event.key != "Enter") { return }
            switch (event.target.value) {
            case "close": can.cli && can.cli.close(); break
            case "clear": can.cli && can.cli.close(); break
            default:
                can.run(event, [cli.RUN].concat(can.core.Split(event.target.value+" ")), function(msg) {
                    can.cli && can.cli.close()
                    can.cli = can.onappend.float(can, msg, function(value, key, index, line, list) {

                    }), can.page.Modify(can, can.cli.first, {style: {bottom: 32, top: ""}})
                })
            }
        }]}])
    },

    toast: function(can, msg, title, content, fileline, time) { can._toast = can._toast || can.request()
        can.page.Modify(can, can.toast, [time.split(" ").pop(), title, content].join(" "))
        can._toast.Push({time: time, fileline: fileline, title: title, content: content})
    },
    ncmd: function(can, msg, time, follow, commands) { const NCMD = "ncmd"; can._cmds = can._cmds || can.request()
        can._cmds.Push({time: time, follow: follow, commands: commands})
        can.page.Select(can, can._output, can.core.Keys(html.SPAN, NCMD), function(item) {
            item.innerHTML = can.Conf(NCMD, parseInt(can.Conf(NCMD)||"0")+1+"")+""
        })
    },
})
Volcanos("onaction", {help: "交互数据", list: [], _init: function(can, msg, list, cb, target) {
        can.base.isFunc(cb) && cb(msg)
    },
    onlogin: function(can, msg) {
        can.run({}, [], function(msg) { can.onimport._init(can, msg, [], null, can._output) })
    },

    _cmd: function(can) {
        return can.onappend.float(can, can._cmds, function(value, key, index, line, list) {
            var commands = can.base.Obj(line.commands); switch (line.follow) {
                case "chat.Action": commands = commands.slice(2); break
                case "chat.Footer": commands = commands.slice(2); break
            }
            switch (commands[0]) {
                case "web.wiki.word": commands = commands.slice(5); break
            }

            can.search({}, ["Action.onexport.size"], function(msg, top, left, width, height) {
                can.onappend.plugin(can, {index: commands[0], args: commands.slice(1), width: width, height: height-100}, function(sub) {
                    sub.run = function(event, cmds, cb) {
                        can.run(event, [ctx.ACTION, cli.RUN, commands[0]].concat(cmds), cb)
                    }

                    can.page.Modify(can, sub._output, {style: {"max-width": width}})
                    can.page.Modify(can, sub._target, {style: {top: top+100, left: left}})
                    can.page.Modify(can, sub._legend, {style: {display: "block"}})
                    can.page.ClassList.add(can, sub._target, "float")
                }, document.body)
            })
        }).first
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    height: function(can) { return can._target.offsetHeight },
})

