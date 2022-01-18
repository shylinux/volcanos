Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can)
        can.onimport._title(can, msg, target)
        can.onimport._state(can, msg, target)
        can.onimport._toast(can, msg, target)
        can.onimport._cli(can, msg, target)
        can.base.isFunc(cb) && cb(msg)
    },
    _title: function(can, msg, target) {
        !can.user.isMobile && can.core.List(msg.result, function(item) {
            can.page.Append(can, target, [{view: [chat.TITLE, html.DIV, item], title: "联系站长"}])
        })
    },
    _state: function(can, msg, target) {
        can.core.List(can.base.Obj(msg.Option(chat.STATE)||can.Conf(chat.STATE), ["ncmd"]), function(item) {
            can.page.Append(can, target, [{view: [can.base.join([chat.STATE, item]), html.DIV, can.Conf(item)], list: [
                {text: [item, html.LABEL]}, {text: [": ", html.LABEL]}, {text: [can.Conf(item)||"", html.SPAN, item]},
            ], onclick: function(event) {
                can.show = can.show? (can.page.Remove(can, can.show), null): can.onaction._cmd(can)
                can.page.Modify(can, can.show, {style: {left: "", top: "", right: 0, bottom: can.onexport.height(can)}})
            }}])
        })
    },
    _toast: function(can, msg, target) {
        can.toast = can.page.Append(can, target, [{view: chat.TOAST, onclick: function(event) {
            can.show = can.show? (can.page.Remove(can, can.show), null): can.onappend.float(can, can._toast).first
            can.page.Modify(can, can.show, {style: {left: "", top: "", right: 0, bottom: can.onexport.height(can)}})
        }}]).first
    },
    _cli: function(can, msg, target) {
        can.onappend.input(can, {type: html.TEXT, name: "cmd", onkeydown: function(event) {
            can.onkeymap.input(event, can); if (event.key != lang.ENTER) { return }
            switch (event.target.value) {
            case cli.CLEAR: can.cli && can.cli.close(); break
            case cli.CLOSE: can.cli && can.cli.close(); break
            default:
                can.run(event, [ice.RUN].concat(can.core.Split(event.target.value, ice.SP)), function(msg) {
                    can.cli && can.cli.close()
                    can.cli = can.onappend.float(can, msg, function(value, key, index, line, list) {

                    }), can.page.Modify(can, can.cli.first, {style: {bottom: can.onexport.height(can), top: ""}})
                })
            }
        }}, "", target, "title cmd")
    },

    toast: function(can, msg, title, content, fileline, time) { can._toast = can._toast||can.request()
        can.page.Modify(can, can.toast, [time.split(ice.SP).pop(), title, content].join(ice.SP))
        can._toast.Push({time: time, fileline: fileline, title: title, content: content})
    },
    ncmd: function(can, msg, _follow, _cmds) { var NCMD = "ncmd"; can._cmds = can._cmds||can.request()
        can._cmds.Push({time: can.base.Time(), follow: _follow, cmds: _cmds})
        can.page.Select(can, can._output, can.core.Keys(html.SPAN, NCMD), function(item) {
            item.innerHTML = can.Conf(NCMD, parseInt(can.Conf(NCMD)||"0")+1+"")+""
        })
    },
})
Volcanos("onaction", {help: "交互数据", list: [], _init: function(can, cb, target) {
        can.base.isFunc(cb) && cb()
    },
    onlogin: function(can, msg) { can.run({}, [], function(msg) { can.onimport._init(can, msg, [], null, can._output) }) },
    ontoast: function(can, msg) { can.core.CallFunc(can.onimport.toast, {can: can, msg: msg}) },
    onremote: function(can, msg) { can.core.CallFunc(can.onimport.ncmd, {can: can, msg: msg}) },
    oncommandfocus: function(can) { 
        can.page.Select(can, can._output, "div.cmd input", function(target) { target.focus() })
    },

    _cmd: function(can) {
        return can.onappend.float(can, can._cmds, function(value, key, index, line, list) {
            var cmds = can.base.Obj(line.cmds); switch (line.follow) {
                case "chat.Action": cmds = cmds.slice(2); break
                case "chat.Footer": cmds = cmds.slice(2); break
            }
            switch (cmds[0]) {
                case "web.wiki.word": cmds = cmds.slice(5); break
            }

            can.get("Action", "size", function(msg, top, left, width, height) {
                can.onappend.plugin(can, {index: cmds[0], args: cmds.slice(1), height: height-100, width: width}, function(sub) {
                    sub.run = function(event, cmd, cb) {
                        can.run(event, can.misc.concat(can, [ctx.ACTION, ice.RUN, cmds[0]], cmd), cb)
                    }

                    can.page.Modify(can, sub._target, {style: {top: top+100, left: left}})
                    can.page.Modify(can, sub._legend, {style: {display: html.BLOCK}})
                    can.page.Modify(can, sub._output, {style: {"max-width": width}})
                    can.page.ClassList.add(can, sub._target, chat.FLOAT)
                }, document.body)
            })
        }).first
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    height: function(can) { return can._target.offsetHeight },
})

