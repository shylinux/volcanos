Volcanos({name: "popup", iceberg: "http://localhost:9020/chat/", river: {
	product: {name: "产品群", storm: {
		office: {name: "办公 office",  list: [
			{name: "feel", help: "影音媒体", index: "web.wiki.feel"},
			{name: "draw", help: "思维导图", index: "web.wiki.draw"},
			{name: "data", help: "数据表格", index: "web.wiki.data"},
			{name: "plan", help: "计划任务", index: "web.team.plan"},
			{name: "think", help: "智库", index: "web.wiki.word", args: ["usr/learning/"]},
			{name: "index", help: "索引", index: "web.wiki.word", args: ["usr/learning/index.shy"]},
			{name: "context", help: "编程", index: "web.wiki.word", args: ["src/main.shy"]},
		]},
		chrome: {name: "爬虫 chrome",  list: [
			{name: "feel", help: "网页爬虫", index: "web.wiki.feel", args: ["spide/"], feature: {
				display: "/plugin/local/wiki/feel.js",
				height: 200, limit: 3,
			}},
			{name: "cached", help: "爬虫缓存", index: "web.code.chrome.cache", args: []},
			{name: "spided", help: "网页爬虫", index: "web.code.chrome.spide", args: location && location.protocol && location.protocol=="chrome-extension:"? ["1", "", "spide"]: ["1"]},
		]},
	}},
	project: {name: "研发群", storm: {
		studio: {name: "研发 studio", list: [
			{name: "vimer", help: "编辑器", index: "web.code.vimer", args: ["src/,usr/volcanos/,usr/icebergs/,usr/toolkits/", "main.go"]},
			{name: "repos", help: "代码库", index: "web.code.git.status"},
			{name: "favor", help: "收藏夹", index: "web.chat.favor"},
			{name: "plan", help: "任务表", index: "web.team.plan"},
			{name: "ctx", help: "上下文", index: "web.wiki.word"},
		]},
		chrome: {name: "网页 chrome",  index: [
			"web.code.chrome.chrome",
			"web.code.chrome.daemon",
			"web.code.chrome.spide",
			"web.code.chrome.cache",
			"web.code.chrome.style",
			"web.code.chrome.field",
		]},
	}},
	profile: {name: "测试群", storm: {
		release: {name: "发布 release", index: [
			"web.code.webpack",
			"web.code.compile",
			"web.code.publish",
			"web.code.docker.client",
			"web.space",
			"web.dream",
			"web.code.git.server",
			"web.code.git.status",
		]},
		toolkit: {name: "工具 toolkit", index: [
			"web.code.favor",
			"web.code.xterm",
			"web.code.inner",
			"web.code.vimer",
			"web.code.bench",
			"web.code.pprof",
			"web.code.oauth",
		]},
		language: {name: "语言 language", index: [
			"web.code.c",
			"web.code.sh",
			"web.code.py",
			"web.code.shy",
			"web.code.js",
			"web.code.go",
		]},
	}},
	operate: {name: "运维群", storm: {
		aaa: {name: "权限 aaa", index: [
			"offer", "email", "user", "totp", "sess", "role",
		]},
		web: {name: "应用 web", index: [
			"broad", "serve", "space", "dream", "share", "cache", "spide",
		]},
		cli: {name: "系统 cli", index: [
			"qrcode", "daemon", "system", "runtime", "mirrors", "forever", "host", "port",
		]},
		nfs: {name: "文件 nfs", index: [
			"cat", "dir", "pack", "tail", "trash",
		]},
	}},
}})

