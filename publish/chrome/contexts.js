Volcanos("chrome", {
    pwd: function(can, msg, arg, cb) {
        msg.Push("hi", "hello")
        msg.Echo("hello")
        console.log(arg)
        cb()
    },
    spide: function(can, msg) {
        can.page.Select(can, document.body, "video", function(item) {
            var p = can.page.Select(can, document.body, "p.title")[0]

            var ls = item.src.split("?")
            var ls = ls[0].split(".")
            msg.Push("time", can.base.Time())
            msg.Push("type", "video")
            msg.Push("name", (p && p.innerText || "video")+"."+ls[ls.length-1])
            msg.Push("text", item.src)
            msg.Push("link", item.src)
        })
        can.page.Select(can, document.body, "img", function(item) {
            var ls = item.src.split("?")
            var ls = ls[0].split("/")

            msg.Push("time", can.base.Time())
            msg.Push("type", "img")

            if (item.src.indexOf("data:image") == 0) {
                msg.Push("name", item.src.slice(item.src.length-20))
            } else {
                msg.Push("name", ls[ls.length-1]||"image.jpg")
            }

            msg.Push("text", item.src)
            msg.Push("link", item.src)
        })
    },
    field: function(can, msg, arg) { can.require(["https://shylinux.com/page/index.css"])
        can.onappend.plugin(can, {index: arg[0], arg: arg.slice(1)}, function(sub, meta) {
            var top = msg.Option("top")||400
            can.onmotion.float.auto(can, document.body, "carte")
            can.onmotion.float.auto(can, sub._output, "carte")
            can.page.Modify(can, sub._target, {style: {
                background: "radial-gradient(black, #00000073)",
                position: "absolute", "top": top,
            }})
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
                can.run(event, ["action", "command", "run", meta.index].concat(cmds), cb)
            }
        }, document.body)
    },
}, ["/frame.js"], function(can) {
    chrome.extension.onMessage.addListener(function(req, sender, cb) {
        var msg = can.request(); can.core.List(req.option, function(key) { msg.Option(key, req[key][0]) })
        can.core.CallFunc([can, req.detail[3]||"spide"], {can: can, msg: msg, arg: req.detail.slice(4), cb: function() {
            delete(msg._event), delete(msg._can), cb(msg)
        }})
    })

    can.run = function(event, cmds, cb) { var msg = can.request(event); msg.detail = ["page"].concat(cmds)
        chrome.runtime.sendMessage(msg, function(res) { can.base.isFunc(cb) && cb(msg.Copy(res)) })
    }
    can.run({}, ["action", "command", "get"], function(msg) {
        msg.result && msg.result[0] && can.field(can, msg, msg.result)
    })
})

