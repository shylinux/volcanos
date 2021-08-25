Volcanos("chrome", {
    pwd: function(can, msg, arg) {
        msg.Push("hi", "hello")
        msg.Echo("hello")
    },
    style: function(can, msg, arg) {
        can.page.Select(can, document.body, arg[0], function(target) {
            can.page.Modify(can, target, can.base.Obj(arg[1]))
        })
    },
    order: function(can, msg, arg) {
        var ui = can.user.input(event, can, ["index", "args", "selection"], function(event, button, data, list, args) {
            can.run(event, [chat.FIELD, mdb.INSERT, kit.MDB_ZONE, location.hostname].concat(args), function(res) {
                can.user.toast(can, "添加成功")
            })
        })
        can.page.Modify(can, ui._target, {style: {left: 200, top: 200}})
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
    field: function(can, msg, arg) {
        can.onappend.plugin(can, {index: arg[0], arg: can.base.Obj(arg[1])}, function(sub, meta) {
            can.page.ClassList.add(can, sub._target, "contexts")
            var top = msg.Option("top")||400
            var left = msg.Option("left")||0
            can.onmotion.float.auto(can, sub._output, "carte")
            can.onmotion.float.auto(can, document.body, "carte")
            can.page.Modify(can, sub._target, {style: {"top": top, "left": left}})
            can.page.Modify(can, sub._output, {style: {
                "max-height": window.innerHeight-top-80,
                "max-width": window.innerWidth,
            }})

            sub._legend.onclick = function(event) {
                can.onmotion.toggle(can, sub._option)
                can.onmotion.toggle(can, sub._action)
                can.onmotion.toggle(can, sub._output)
                can.onmotion.toggle(can, sub._status)
            }, msg.Option("selection")||sub._legend.onclick()

            sub.run = function(event, cmds, cb) { if (cmds[0] == "_search") { return }
                can.run(event, can.misc.Concat([ctx.ACTION, cli.RUN, meta.index], cmds), cb)
            }
            can.onmotion.move(can, sub._target, {})

            msg.Option("selection") && (document.body.ondblclick = function(event) {
                sub.Option(msg.Option("selection"), window.getSelection())
                sub.Update()
            })

            sub.onaction["保存参数"] = function(event) {
                can.request(event, {zone: location.hostname, id: msg.Option(kit.MDB_ID)})
                can.run(event, [chat.FIELD, mdb.MODIFY, "top", sub._target.offsetTop])
                can.run(event, [chat.FIELD, mdb.MODIFY, "left", sub._target.offsetLeft])
                can.run(event, [chat.FIELD, mdb.MODIFY, "args", JSON.stringify(sub.Input([], true))])
                can.user.toast(can, "保存成功")
            }
        }, document.body)
    },
    Option: function() { return [] },
}, ["/frame.js"], function(can) {
    chrome.extension.onMessage.addListener(function(req, sender, cb) { var msg = can.request(); msg.Copy(req); can.misc.Log(req.detail, msg)
        can.core.CallFunc([can, req.detail[3]||"spide"], {can: can, msg: msg, arg: req.detail.slice(4), cb: function() {
            delete(msg._event), delete(msg._can), cb(msg)
        }})
    })

    can.run = function(event, cmds, cb) { if (cmds[0] == "_search") { return }
        var msg = can.request(event, {hostname: location.hostname}); msg.detail = can.misc.Concat(["page"], cmds)
        chrome.runtime.sendMessage(msg, function(res) { can.base.isFunc(cb) && cb(msg.Copy(res)) })
    }
    can.run({}, [ctx.ACTION, ctx.COMMAND], function(msg) {
        msg.result && msg.result[0] && can.field(can, msg, msg.result)
    })
})

