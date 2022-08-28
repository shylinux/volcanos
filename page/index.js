Volcanos({name: "chat", river: {
	product: {name: "产品群", storm: {
		office: {name: "办公 office",  list: [
			{name: "feel", help: "影音媒体", index: "web.wiki.feel"},
			{name: "draw", help: "思维导图", index: "web.wiki.draw"},
			{name: "data", help: "数据表格", index: "web.wiki.data"},
			{name: "location", help: "地图导航", index: "web.chat.location"},
			{name: "context", help: "编程", index: "web.wiki.word", args: ["src/main.shy"]},
		]},
		website: {name: "定制 website", index: [
			"web.chat.website",
			"web.chat.div",
			"web.code.vimer",
			"web.dream",
		]},
	}},
	project: {name: "研发群", storm: {
		studio: {name: "研发 studio", list: [
			{name: "vimer", help: "编辑器", index: "web.code.vimer"},
			{name: "repos", help: "代码库", index: "web.code.git.status"},
			{name: "plan", help: "任务表", index: "web.team.plan"},
			{name: "todo", help: "待办项", index: "web.team.todo"},
			{name: "ctx", help: "上下文", index: "web.wiki.word"},
		]},
	}},
	profile: {name: "测试群", storm: {
		release: {name: "发布 release", index: [
			"web.code.install",
			"web.code.upgrade",
			"web.code.webpack",
			"web.code.binpack",
			"web.code.autogen",
			"web.code.compile",
			"web.code.publish",
			"web.code.git.server",
			"web.code.git.status",
		]},
		research: {name: "测试 research", index: [
			"web.code.favor",
			"web.code.bench",
			"web.code.pprof",
			"web.code.xterm",
			"web.code.case",
		]},
	}},
	operate: {name: "运维群", storm: {
		aaa: {name: "权限 aaa", index: [
			"user", "totp", "sess", "role",
		]},
		web: {name: "应用 web", index: [
			"broad", "serve", "space", "dream", "route",
			"share", "spide", "cache", "story",
		]},
		cli: {name: "系统 cli", index: [
			"qrcode", "daemon", "system", "runtime", "mirrors", "forever", "port",
		]},
		nfs: {name: "文件 nfs", index: [
			"cat", "dir", "pack", "tail", "trash",
		]},
	}},
}})
