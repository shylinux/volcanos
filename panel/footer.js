Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can)
        can.onimport._title(can, msg, target)
        can.onimport._state(can, msg, target)
        can.onimport._toast(can, msg, target)

        can.onmotion.float.auto(can, can._output, "carte", "input")
        can.base.isFunc(cb) && cb(msg)
    },
    _title: function(can, msg, target) { const TITLE = "title"
        !can.user.isMobile && can.core.List(msg.result, function(item) {
            can.page.Append(can, target, [{view: [TITLE, "div", item], title: "联系站长"}])
        })
    },
    _state: function(can, msg, target) { const STATE = "state"
        can.core.List(can.base.Obj(msg.Option(STATE), can.Conf(STATE)||["ncmd"]), function(item) {
            can.page.Append(can, target, [{view: [STATE+" "+item, "div", can.Conf(item)], list: [
                {text: [item, "label"]}, {text: [": ", "label"]}, {text: [can.Conf(item)||"", "span", item]},
            ], onclick: function(event) {
                can.show = can.show? (can.page.Remove(can, can.show), null): can.onimport._cmd(can)
            }}])
        })
    },
    _cmd: function(can) {
        return can.onappend.float(can, can._cmds, function(value, key, index, line, list) {
            var commands = can.base.Obj(line.commands)
            commands.length > 2 && can.onappend.plugin(can, {index: commands[2]}, function(sub) {
                sub.run = function(event, cmds, cb) {
                    can.run(event, ["action", "command", "run", commands[2]].concat(cmds), cb)
                }

                can.search({}, ["Action.onexport.size"], function(msg, top, left, width, height) {
                    can.page.Modify(can, sub._output, {style: {"max-width": width, "max-height": height-28}})
                    can.page.Modify(can, sub._target, {style: {top: top+100, left: left}})
                    can.page.Modify(can, sub._legend, {style: {display: "block"}})
                    can.page.ClassList.add(can, sub._target, "float")
                })

            }, document.body)

        }).first
    },
    _toast: function(can, msg, target) {
        can.toast = can.page.Append(can, target, [{view: "toast", onclick: function(event) {
            can.show = can.show? (can.page.Remove(can, can.show), null): can.onappend.float(can, can._toast).first
        }}]).first
    },

    toast: function(can, msg, title, content, fileline, time) { can._toast = can._toast || can.request()
        can.page.Modify(can, can.toast, [time.split(" ").pop(), title, content].join(" "))
        can._toast.Push({time: time, fileline: fileline, title: title, content: content})
    },
    ncmd: function(can, msg, time, follow, commands) { const NCMD = "ncmd"; can._cmds = can._cmds || can.request()
        can._cmds.Push({time: time, follow: follow, commands: commands})
        can.page.Select(can, can._output, can.core.Keys("span", NCMD), function(item) {
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
})
Volcanos("onexport", {help: "导出数据", list: [],
    height: function(can) { return can._target.offsetHeight },
})

