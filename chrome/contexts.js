var can = Volcanos("chrome", {
    video: function(can) {
    },
}, [], function(can) {
    can.user = user
    can.page = page
    can.misc = misc
    can.core = core
    can.base = base

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

