Volcanos("onimport", {
    init: function(can, msg, cb, target, option) {
        target.innerHTML = msg.result.join("")
    },
})
Volcanos("onaction", {
    copy: function(event, can, msg, cb, target, option) {
        can.user.alert("hello world")
    },
})
Volcanos("onchoice", {
    list: ["copy", "复制", "下载"],
    copy: function(event, can, msg, cb, target, option) {
        can.user.alert("hello world")
    },
})
Volcanos("ondetail", {
    list: ["复制", "下载"],
    copy: function(event, can, msg, cb, target, option) {
    },
})
