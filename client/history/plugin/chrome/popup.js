var can = Volcanos("popup", {
    demo: function() {
        can.chrome.notice("hi", "hello")
    },
}, Config.libs.concat(Config.list), function(can) {can.Conf(Config)
    can.page.Append(can, document.body, [{button: ["baidu", function() {
        can.chrome.open("https://www.baidu.com")
    }]}])
    can.page.Append(can, document.body, [{button: ["volcanos", function() {
        can.chrome.open("http://localhost:9020")
    }]}])

    can.page.Append(can, document.body, [{button: ["send", function() {
        can.chrome.send({names: "crx", cmds: ["hi"]}, function(msg) {
            can.chrome.notice("hi", "hello")
            console.log(msg)
        })
    }]}])
})
