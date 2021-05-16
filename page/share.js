Volcanos({name: "chat", iceberg: "/chat/", volcano: "/frame.js",
    libs: ["/lib/base.js", "/lib/core.js", "/lib/misc.js", "/lib/page.js", "/lib/user.js"], panels: [
        {name: "Header", help: "标题栏", pos: "head", state: ["time", "username", "avatar"]},
        {name: "Search", help: "搜索框", pos: "auto"},
        {name: "River",  help: "群聊组", pos: "left", action: ["创建", "刷新"]},
        {name: "Action", help: "工作台", pos: "main"},
        {name: "Footer", help: "状态条", pos: "foot", state: ["ncmd"]},
    ], main: {name: "Header"}, river: {
        "serivce": {name: "运营群", storm: {
            "wx": {name: "公众号 wx",  action: [
                {name: "微信公众号", help: "wx", index: "web.wiki.word", args: ["usr/icebergs/misc/wx/wx.shy"]},
            ]},
            "mp": {name: "小程序 mp",  action: [
                {name: "微信小程序", help: "mp", index: "web.wiki.word", args: ["usr/icebergs/misc/mp/mp.shy"]},
            ]},
            "lark": {name: "机器人 lark",  action: [
                {name: "飞书机器人", help: "lark", index: "web.wiki.word", args: ["usr/icebergs/misc/lark/lark.shy"]},
            ]},
            "share": {name: "上下文 share",  action: [
                {name: "系统上下文", help: "shylinux/contexts", index: "web.wiki.word", args: ["usr/learning/社会/管理/20200724.shy"]},
            ]},
        }},
    },
})
