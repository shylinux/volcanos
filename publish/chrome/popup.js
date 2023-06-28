Volcanos({name: "popup", iceberg: "http://localhost:9020/chat/", river: {
	product: {name: "产品群", icon: "bi bi-bar-chart-line-fill", storm: {
		office: {name: "办公 office", icon: "bi bi-bar-chart-line-fill",  index: ["web.chat.macos.desktop", "web.wiki.feel", "web.wiki.draw", "web.wiki.data"]},
		chrome: {name: "爬虫 chrome", icon: "bi-browser-chrome", list: [
			{name: "feel", help: "网页爬虫", index: "web.wiki.feel", args: ["spide/"], feature: {
				display: "/plugin/local/wiki/feel.js",
				height: 200, limit: 3,
			}},
			{name: "cached", help: "爬虫缓存", index: "web.code.chrome.cache", args: []},
			{name: "spided", help: "网页爬虫", index: "web.code.chrome.spide", args: location && location.protocol && location.protocol=="chrome-extension:"? ["1", "", "spide"]: ["1"]},
		]},
	}},
	project: {name: "研发群", icon: "bi bi-git", storm: {
		studio: {name: "研发 studio", icon: "bi bi-git", index: ["web.code.vimer", "web.code.git.status", "web.chat.favor", "web.team.plan", "web.wiki.word"]},
		chrome: {name: "网页 chrome",  icon: "bi-browser-chrome", index: [
			"web.code.chrome.chrome",
			"web.code.chrome.daemon",
			"web.code.chrome.spide",
			"web.code.chrome.cache",
			"web.code.chrome.style",
			"web.code.chrome.field",
		]},
	}},
	profile: {name: "测试群", icon: "bi bi-list-columns", type: aaa.TECH, storm: {
		release: {name: "发布 release", icon: "bi bi-list-check", index: ["web.code.compile", "web.code.publish", "web.code.pprof", "web.code.bench", "web.dream", "web.space", "web.code.git.service", "web.code.git.status"]},
	}},
	operate: {name: "运维群", icon: "bi bi-gear", type: aaa.TECH, storm: {
		web: {name: "应用 web", icon: "bi bi-browser-chrome", index: ["broad", "serve", "space", "dream", "share"]},
		aaa: {name: "权限 aaa", icon: "bi bi-people-fill", index: ["offer", "email", "user", "totp", "sess", "role"]},
		cli: {name: "系统 cli", icon: "bi bi-windows", index: ["qrcode", "daemon", "runtime", "cli.procstat", "cli.procinfo", "mirrors", "signal", "timer", "routine", "log.debug"]},
		nfs: {name: "文件 nfs", icon: "bi bi-server", index: ["dir", "cat", "tar", "pack", "tail", "trash", "server", "host", "port"]},
	}},
}}) // https://icons.getbootstrap.com/
