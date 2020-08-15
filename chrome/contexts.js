var can = Volcanos("chrome", {
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
            msg.Push("time", can.base.Time())
            msg.Push("type", "img")
            msg.Push("name", "img")
            msg.Push("text", item.src)
            msg.Push("link", item.src)
        })
    },
}, [], function(can) {
    can.user = user
    can.page = page
    can.misc = misc
    can.core = core
    can.base = base

    chrome.extension.onMessage.addListener( function (msg, sender, cb) { var action = can[msg.detail[3]||"spide"]
        msg = can.request({}, msg)
        delete(msg._event)
        delete(msg._can)
        typeof action == "function" && action(can, msg) || typeof cb == "function" && cb(msg)
    })
    return

    chrome.extension.onMessage.addListener( function (request, sender, sendResponse) {
        var title = can.page.Select(can, document.body, "p.title", function(item) {
            return item.innerText
        }).join("-")
        can.page.Select(can, document.body, "video", function(item) {
            sendResponse({poster: item.poster, src: item.src, title: title})
            console.log(item)
        })
    })
})

