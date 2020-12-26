Volcanos("chrome", {
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

            if (item.src.startsWith("data:image")) {
                msg.Push("name", item.src.slice(item.src.length-20))
            } else {
                msg.Push("name", ls[ls.length-1]||"image.jpg")
            }

            msg.Push("text", item.src)
            msg.Push("link", item.src)
        })
    },
}, [], function(can) { can._load("chrome")
    chrome.extension.onMessage.addListener(function(req, sender, cb) {
        var msg = can.request(); can.core.List(req.option, function(key) { msg.Option(key, req[key][0]) })
        can.core.CallFunc(can.core.Value(can, req.detail[3]||"spide"), {can: can, msg: msg, cmds: req.detail.slice(4), cb: cb})
    })
})

