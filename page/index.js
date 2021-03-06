Volcanos({name: "chat", iceberg: "/chat/", volcano: "/frame.js",
    libs: ["/lib/base.js", "/lib/core.js", "/lib/misc.js", "/lib/page.js", "/lib/user.js"], panels: [
        {name: "Header", help: "标题栏", pos: "head", state: ["time", "username", "avatar"]},
        {name: "Search", help: "搜索框", pos: "auto"},
        {name: "River",  help: "群聊组", pos: "left", action: ["create", "refresh"]},
        {name: "Action", help: "工作台", pos: "main"},
        {name: "Footer", help: "状态条", pos: "foot", state: ["ncmd"]},
    ], main: {name: "Header", list: ["/publish/order.js"]}, plugin: [
        "/plugin/state.js",
        "/plugin/input.js",
        "/plugin/table.js",
        "/plugin/input/key.js",
        "/plugin/input/date.js",
        "/plugin/story/trend.js",
        "/plugin/story/spide.js",
        "/plugin/local/code/inner.js",
        "/plugin/local/code/vimer.js",
        "/plugin/local/wiki/draw/path.js",
        "/plugin/local/wiki/draw.js",
        "/plugin/local/wiki/word.js",
        "/plugin/local/team/plan.js",
    ], river: {
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
        "product": {name: "产品群", storm: {
            "office": {name: "办公 office",  action: [
                {name: "feel", help: "影音媒体", index: "web.wiki.feel"},
                {name: "draw", help: "思维导图", index: "web.wiki.draw"},
                {name: "data", help: "数据表格", index: "web.wiki.data"},
                {name: "plan", help: "计划任务", index: "web.team.plan"},
                {name: "think", help: "智库", index: "web.wiki.word", args: ["usr/learning/"]},
                {name: "index", help: "索引", index: "web.wiki.word", args: ["usr/learning/index.shy"]},
                {name: "context", help: "编程", index: "web.wiki.word", args: ["src/main.shy"]},
            ]},
            "english": {name: "英汉 english",  action: [
                {name: "english", help: "英汉", index: "web.wiki.alpha.alpha", args: ["word", "hi"]},
                {name: "chinese", help: "汉英", index: "web.wiki.alpha.alpha", args: ["line", "你好"]},
                {name: "wubi", help: "五笔", index: "web.code.input.wubi", args: ["word", "wqvb"]},
                {name: "wubi", help: "五笔", index: "web.code.input.wubi", args: ["line", "你好"]},
            ]},
            "learning": {name: "学习 learning",  action: [
                {name: "golang", help: "编程", index: "web.wiki.word", args: ["usr/golang-story/src/main.shy"]},
                {name: "tmux", help: "粘贴", index: "web.code.tmux.text"},
                {name: "study", help: "学习", index: "web.wiki.word", args: ["usr/learning/study.shy"]},
            ]},
            "chrome": {name: "爬虫 chrome",  action: [
                {name: "feel", help: "网页爬虫", index: "web.wiki.feel", args: ["spide/"], feature: {
                    display: "/plugin/local/wiki/feel.js",
                    height: 200, limit: 3,
                }},
                {name: "cached", help: "爬虫缓存", index: "web.code.chrome.cache", args: []},
                {name: "spided", help: "网页爬虫", index: "web.code.chrome.spide", args: location && location.protocol && location.protocol=="chrome-extension:"? ["1", "", "spide"]: ["1"]},
            ]},
        }},
        "project": {name: "研发群", storm: {
            "studio": {name: "研发 studio", action: [
                {name: "vimer", help: "编辑器", index: "web.code.vimer", args: ["src/", "main.go"]},
                {name: "repos", help: "代码库", index: "web.code.git.status"},
                {name: "plan", help: "任务表", index: "web.team.plan"},
                {name: "contexts", help: "上下文", index: "web.wiki.word", args: ["src/main.shy"]},
            ]},
            "cli": {name: "命令 cli",  action: [
                {name: "bash", help: "命令行", index: "web.wiki.word", args: ["usr/icebergs/misc/bash/bash.shy"]},
                {name: "git", help: "代码库", index: "web.wiki.word", args: ["usr/icebergs/misc/git/git.shy"]},
                {name: "vim", help: "编辑器", index: "web.wiki.word", args: ["usr/icebergs/misc/vim/vim.shy"]},
                {name: "tmux", help: "命令行", index: "web.wiki.word", args: ["usr/icebergs/misc/tmux/tmux.shy"]},
            ]},
            "web": {name: "网页 web",  action: [
                {name: "HTML5", help: "浏览器", index: "web.wiki.word", args: ["usr/icebergs/misc/chrome/chrome.shy"]},
            ]},
            "linux": {name: "系统 linux",  action: [
                {name: "idc", help: "平台", index: "web.wiki.word", args: ["usr/linux-story/idc/idc.shy"]},
                {name: "iso", help: "系统", index: "web.wiki.word", args: ["usr/linux-story/iso/iso.shy"]},
                {name: "iot", help: "设备", index: "web.wiki.word", args: ["usr/linux-story/iot/iot.shy"]},
                {name: "linux", help: "系统", index: "web.wiki.word", args: ["usr/linux-story/src/main.shy"]},
            ]},
            "nginx": {name: "代理 nginx",  action: [
                {name: "nginx", help: "代理", index: "web.wiki.word", args: ["usr/nginx-story/src/main.shy"]},
            ]},
            "context": {name: "编程 context",  action: [
                {name: "golang", help: "编程", index: "web.wiki.word", args: ["usr/golang-story/src/main.shy"]},
            ]},
            "redis": {name: "缓存 redis",  action: [
                {name: "redis", help: "缓存", index: "web.wiki.word", args: ["usr/redis-story/src/main.shy"]},
            ]},
            "mysql": {name: "数据 mysql",  action: [
                {name: "mysql", help: "数据存储", index: "web.wiki.word", args: ["usr/mysql-story/src/main.shy"]},
            ]},
        }},
        "profile": {name: "测试群", storm: {
            "release": {name: "发布 release", index: [
                "web.code.publish", "web.code.compile", "web.code.autogen",
            ]},
            "research": {name: "测试 research", index: [
                "web.code.favor", "web.code.bench", "web.code.pprof",
            ]},
        }},
        "operate": {name: "运维群", storm: {
            "cli": {name: "系统 cli", index: [
                "qrcode", "daemon", "system", "runtime",
            ]},
            "web": {name: "应用 web", index: [
                "spide", "route", "share", "dream",
            ]},
            "aaa": {name: "权限 aaa", index: [
                "user", "sess", "role", "totp",
            ]},
            "nfs": {name: "文件 nfs", index: [
                "cat", "dir", "tail", "trash",
            ]},
            "ssh": {name: "脚本 ssh", index: [
                "connect", "session", "service", "channel",
                "source", "screen",
            ]},
        }},
    },
})
