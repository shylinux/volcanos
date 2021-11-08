setTimeout(function() { Volcanos({
    pwd: function(can, msg, arg) {
        msg.Push("hi", "hello")
        msg.Echo("hello")
    },
    style: function(can, msg, arg) {
        can.page.Select(can, document.body, arg[0], function(target) {
            can.page.Modify(can, target, can.base.Obj(arg[1]))
        })
    },
    field: function(can, msg, arg) {
        can.onappend.plugin(can, {type: "contexts", index: arg[0], args: can.base.Obj(arg[1])}, function(sub, meta) {
            can.page.Modify(can, sub._target, {style: {left: msg.Option("left"), top: msg.Option("top"), right: msg.Option("right"), bottom: msg.Option("bottom")}})
            can.page.Modify(can, sub._output, {style: {"max-height": window.innerHeight, "max-width": window.innerWidth}})
            can.onmotion.move(can, sub._target, {})

            sub._legend.onclick = function(event) {
                can.onmotion.toggle(can, sub._option)
                can.onmotion.toggle(can, sub._action)
                can.onmotion.toggle(can, sub._output)
                can.onmotion.toggle(can, sub._status)
            }, msg.Option("selection")||sub._legend.onclick()
            can.onmotion.float.auto(can, sub._target, chat.CARTE)

            sub.run = function(event, cmds, cb) {
                can.run(event, can.misc.Concat([ctx.ACTION, cli.RUN, meta.index], cmds), cb)
            }

            msg.Option("selection") && (document.body.ondblclick = function(event) {
                sub.Option(msg.Option("selection"), window.getSelection()), sub.Update()
            })

            sub.onaction["保存参数"] = function(event) {
                can.request(event, {zone: location.host, id: msg.Option(kit.MDB_ID)})
                can.run(event, [chat.FIELD, mdb.MODIFY, "top", sub._target.offsetTop])
                can.run(event, [chat.FIELD, mdb.MODIFY, "left", sub._target.offsetLeft])
                can.run(event, [chat.FIELD, mdb.MODIFY, "args", JSON.stringify(sub.Input([], true))])
                can.user.toast(can, "保存成功")
            }
        }, document.body)
    },
    order: function(can, msg, arg) {
        var ui = can.user.input(event, can, ["index", "args", "selection"], function(event, button, data, list, args) {
            can.run(event, [chat.FIELD, mdb.INSERT, kit.MDB_ZONE, location.host].concat(args), function(res) {
                can.user.toast(can, "添加成功")
            })
        }); can.page.Modify(can, ui._target, {style: {left: 200, top: 200}})
    },

    spide: function(can, msg, arg) { var has = {}
        can.page.Select(can, document.body, html.VIDEO, function(item) {
            if (!item.src || has[item.src]) { return } has[item.src] = true
            var p = can.page.Select(can, document.body, "p.title")[0]
            var ls = item.src.split("?")
            var ls = ls[0].split(".")
            msg.Push(kit.MDB_TIME, can.base.Time())
            msg.Push(kit.MDB_TYPE, html.VIDEO)
            msg.Push(kit.MDB_NAME, (p && p.innerText || html.VIDEO)+"."+ls[ls.length-1])
            msg.Push(kit.MDB_TEXT, item.src)
            msg.Push(kit.MDB_LINK, item.src)
        })

        can.page.Select(can, document.body, html.IMG, function(item) {
            if (!item.src || has[item.src]) { return } has[item.src] = true
            var ls = item.src.split("?")
            var ls = ls[0].split("/")

            msg.Push(kit.MDB_TIME, can.base.Time())
            msg.Push(kit.MDB_TYPE, html.IMG)

            if (item.src.indexOf("data:image") == 0) {
                msg.Push(kit.MDB_NAME, item.src.slice(item.src.length-20))
            } else {
                msg.Push(kit.MDB_NAME, ls[ls.length-1]||"image.jpg")
            }

            msg.Push(kit.MDB_TEXT, item.src)
            msg.Push(kit.MDB_LINK, item.src)
        })
    },
    Option: function() { return [] },
}, function(can) {
    chrome.extension.onMessage.addListener(function(req, sender, cb) { var msg = can.request(); msg.Copy(req); can.misc.Log(req.detail, msg)
        can.core.CallFunc([can, req.detail[3]||"spide"], {can: can, msg: msg, arg: req.detail.slice(4), cb: function() {
            delete(msg._event), delete(msg._can), cb(msg)
        }})
    })

    can.run = function(event, cmds, cb) { if (cmds[0] == "_search") { return }
        var msg = can.request(event, {host: location.host}); msg.detail = can.misc.Concat(["page"], cmds)
        chrome.runtime.sendMessage(msg, function(res) { can.base.isFunc(cb) && cb(msg.Copy(res)) })
    }
    can.run({}, [ctx.ACTION, ctx.COMMAND], function(msg) {
        msg.result && msg.result[0] && can.field(can, msg, msg.result)
    })
}) }, 100)
