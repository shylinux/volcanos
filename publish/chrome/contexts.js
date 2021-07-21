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
}, [], function(can) { can._load("/frame.js")
    chrome.extension.onMessage.addListener(function(req, sender, cb) {
        var msg = can.request(); can.core.List(req.option, function(key) { msg.Option(key, req[key][0]) })
        can.core.CallFunc([can, req.detail[3]||"spide"], {can: can, msg: msg, arg: req.detail.slice(4), cb: function() {
            delete(msg._event), delete(msg._can), cb(msg)
        }})
    })

    can.run = function(event, cmds, cb) { var msg = can.request(event); msg.detail = ["page"].concat(cmds)
        chrome.runtime.sendMessage(msg, function(res) {
            can.base.isFunc(cb) && cb(msg.Copy(res))
        })
    }

    can.require(["https://shylinux.com/page/index.css"])
    can.onappend.plugin(can, {index: "web.spide"}, function(sub, meta) {
        can.page.Modify(can, sub._target, {style: {
            position: "absolute", "z-index": "100", "top": "400px",
            background: "radial-gradient(black, transparent)",
        }})
        sub.run = function(event, cmds, cb) {
            can.run(event, ["action", "command", "run", meta.index].concat(cmds), cb)
        }
    }, document.body)
})

