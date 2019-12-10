Volcanos("user", {help: "用户模块",
    alert: function(text) {alert(JSON.stringify(text))},
    confirm: function(text) {return confirm(JSON.stringify(text))},
    prompt: function(text, cb) {(text = prompt(text)) != undefined && typeof cb == "function" && cb(text); return text},
    reload: function() {confirm("重新加载页面？") && location.reload()},

    toast: function(text) {},
    carte: function(event, cb) {},

    isWeiXin: navigator.userAgent.indexOf("MicroMessenger") > -1,
    isMobile: navigator.userAgent.indexOf("Mobile") > -1,
    isIPhone: navigator.userAgent.indexOf("iPhone") > -1,
    isMacOSX: navigator.userAgent.indexOf("Mac OS X") > -1,
    isWindows: navigator.userAgent.indexOf("Windows") > -1,
})

