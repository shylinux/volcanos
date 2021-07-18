Volcanos({name: "chat", iceberg: "/chat/", volcano: "/frame.js",
    libs: ["/lib/base.js", "/lib/core.js", "/lib/misc.js", "/lib/page.js", "/lib/user.js"], panels: [
        {name: "cmd", help: "工作台", pos: "main"},
    ], main: {name: "Header", list: []}, plugin: [
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
    ],
})

