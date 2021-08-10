Volcanos("chrome", {
    pwd: function(can, msg, arg, cb) {
        msg.Push("hi", "hello")
        msg.Echo("hello")
        console.log(arg)
        cb()
    },
    style: function(can, msg, arg) {
        can.page.Select(can, document.body, arg[0], function(target) {
            can.page.Modify(can, target, can.base.Obj(arg[1]))
        })
    },
    spide: function(can, msg, arg) { var has = {}
        can.page.Select(can, document.body, "video", function(item) {
            if (!item.src || has[item.src]) { return } has[item.src] = true
            var p = can.page.Select(can, document.body, "p.title")[0]
            var ls = item.src.split("?")
            var ls = ls[0].split(".")
            msg.Push(kit.MDB_TIME, can.base.Time())
            msg.Push(kit.MDB_TYPE, "video")
            msg.Push(kit.MDB_NAME, (p && p.innerText || "video")+"."+ls[ls.length-1])
            msg.Push(kit.MDB_TEXT, item.src)
            msg.Push(kit.MDB_LINK, item.src)
        })

        can.page.Select(can, document.body, "img", function(item) {
            if (!item.src || has[item.src]) { return } has[item.src] = true
            var ls = item.src.split("?")
            var ls = ls[0].split("/")

            msg.Push(kit.MDB_TIME, can.base.Time())
            msg.Push(kit.MDB_TYPE, "img")

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
        // can.require(["https://shylinux.com/page/index.css"])
        can.require(["http://localhost:9020/page/field.css"])
        can.onappend.plugin(can, {index: arg[0], arg: arg.slice(1)}, function(sub, meta) {
            var top = msg.Option("top")||400
            can.onmotion.float.auto(can, sub._output, "carte")
            can.onmotion.float.auto(can, document.body, "carte")
            can.page.Modify(can, sub._target, {style: {"top": top}})
            can.page.Modify(can, sub._output, {style: {
                "max-height": window.innerHeight-top-80,
                "max-width": window.innerWidth,
            }})

            sub._legend.onclick = function(event) {
                can.onmotion.toggle(can, sub._option)
                can.onmotion.toggle(can, sub._action)
                can.onmotion.toggle(can, sub._output)
                can.onmotion.toggle(can, sub._status)
            }, sub._legend.onclick()

            sub.run = function(event, cmds, cb) {
                can.run(event, [ctx.ACTION, cli.RUN, meta.index].concat(cmds), cb)
            }
            can.onmotion.move(can, sub._target, {})

            msg.Option("selection") && (document.body.ondblclick = function(event) {
                sub.Option(msg.Option("selection"), window.getSelection())
                sub.Update()
            })
        }, document.body)
    },
}, ["/frame.js"], function(can) {
    chrome.extension.onMessage.addListener(function(req, sender, cb) {
        var msg = can.request(); can.core.List(req.option, function(key) { msg.Option(key, req[key][0]) })
        can.core.CallFunc([can, req.detail[3]||"spide"], {can: can, msg: msg, arg: req.detail.slice(4), cb: function() {
            delete(msg._event), delete(msg._can), cb(msg)
        }})
    })

    can.run = function(event, cmds, cb) { var msg = can.request(event, {hostname: location.hostname}); msg.detail = ["page"].concat(cmds)
        chrome.runtime.sendMessage(msg, function(res) { can.base.isFunc(cb) && cb(msg.Copy(res)) })
    }
    can.run({}, [ctx.ACTION, ctx.COMMAND], function(msg) {
        msg.result && msg.result[0] && can.field(can, msg, msg.result)
    })
})

