Volcanos({name: "chat", panels: [
		{name: "Header", help: "标题栏", pos: chat.HEAD, state: ["time", "usernick", "avatar"]},
		{name: "River",  help: "群聊组", pos: html.LEFT, action: ["create", "refresh"]},
		{name: "Action", help: "工作台", pos: chat.MAIN},
		{name: "Footer", help: "状态条", pos: chat.FOOT, state: ["ncmd"]},
		{name: "Search", help: "搜索框", pos: chat.AUTO},
	], main: {name: "Header", list: ["/publish/order.js"]}, river: {
	serivce: {name: "运营群", storm: {
		wx: {name: "公众号 wx",  list: [
			{name: "微信公众号", help: "wx", index: "web.wiki.word", args: ["usr/icebergs/misc/wx/wx.shy"]},
		]},
		mp: {name: "小程序 mp",  list: [
			{name: "微信小程序", help: "mp", index: "web.wiki.word", args: ["usr/icebergs/misc/mp/mp.shy"]},
		]},
		lark: {name: "机器人 lark",  list: [
			{name: "飞书机器人", help: "lark", index: "web.wiki.word", args: ["usr/icebergs/misc/lark/lark.shy"]},
		]},
	}},
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
		english: {name: "英汉 english",  list: [
			{name: "english", help: "英汉", index: "web.wiki.alpha.alpha", args: ["word", "hi"]},
			{name: "chinese", help: "汉英", index: "web.wiki.alpha.alpha", args: ["line", "你好"]},
			{name: "wubi", help: "五笔", index: "web.code.input.wubi", args: ["word", "wqvb"]},
			{name: "wubi", help: "五笔", index: "web.code.input.wubi", args: ["line", "你好"]},
		]},
		learning: {name: "学习 learning",  list: [
			{name: "golang", help: "编程", index: "web.wiki.word", args: ["usr/golang-story/src/main.shy"]},
			{name: "tmux", help: "粘贴", index: "web.code.tmux.text"},
			{name: "study", help: "学习", index: "web.wiki.word", args: ["usr/learning/study.shy"]},
		]},
		chrome: {name: "爬虫 chrome",  list: [
			{name: "feel", help: "网页爬虫", index: "web.wiki.feel", args: ["spide/"], feature: {
				display: "/plugin/local/wiki/feel.js",
				height: 200, limit: 3,
			}},
			{name: "cached", help: "爬虫缓存", index: "web.code.chrome.cache", args: []},
			{name: "spided", help: "网页爬虫", index: "web.code.chrome.spide", args: location && location.protocol && location.protocol=="chrome-extension:"? ["1", "", "spide"]: ["1"]},
			{name: "modify", help: "编辑页面", index: "web.code.chrome.modify", args: []},
		]},
	}},
	project: {name: "研发群", storm: {
		studio: {name: "研发 studio", list: [
			{name: "vimer", help: "编辑器", index: "web.code.vimer"},
			{name: "repos", help: "代码库", index: "web.code.git.status"},
			{name: "plan", help: "任务表", index: "web.team.plan"},
			{name: "ctx", help: "上下文", index: "web.wiki.word"},
		]},
		web: {name: "网页 web",  list: [
			{name: "HTML5", help: "浏览器", index: "web.wiki.word", args: ["usr/icebergs/misc/chrome/chrome.shy"]},
		]},
		cli: {name: "命令 cli",  list: [
			{name: "bash", help: "命令行", index: "web.wiki.word", args: ["usr/icebergs/misc/bash/bash.shy"]},
			{name: "git", help: "代码库", index: "web.wiki.word", args: ["usr/icebergs/misc/git/git.shy"]},
			{name: "vim", help: "编辑器", index: "web.wiki.word", args: ["usr/icebergs/misc/vim/vim.shy"]},
			{name: "tmux", help: "命令行", index: "web.wiki.word", args: ["usr/icebergs/misc/tmux/tmux.shy"]},
		]},
		linux: {name: "系统 linux",  list: [
			{name: "idc", help: "平台", index: "web.wiki.word", args: ["usr/linux-story/idc/idc.shy"]},
			{name: "iso", help: "系统", index: "web.wiki.word", args: ["usr/linux-story/iso/iso.shy"]},
			{name: "iot", help: "设备", index: "web.wiki.word", args: ["usr/linux-story/iot/iot.shy"]},
			{name: "cli", help: "命令", index: "web.wiki.word", args: ["usr/linux-story/cli/cli.shy"]},
			{name: "linux", help: "系统", index: "web.wiki.word", args: ["usr/linux-story/src/main.shy"]},
		]},
		nginx: {name: "代理 nginx",  list: [
			{name: "nginx", help: "代理", index: "web.wiki.word", args: ["usr/nginx-story/src/main.shy"]},
		]},
		context: {name: "编程 context",  list: [
			{name: "golang", help: "编程", index: "web.wiki.word", args: ["usr/golang-story/src/main.shy"]},
		]},
		redis: {name: "缓存 redis",  list: [
			{name: "redis", help: "缓存", index: "web.wiki.word", args: ["usr/redis-story/src/main.shy"]},
			{name: "kafka", help: "队列", index: "web.wiki.word", args: ["usr/redis-story/src/kafka/kafka.shy"]},
		]},
		mysql: {name: "存储 mysql",  list: [
			{name: "mysql", help: "数据存储", index: "web.wiki.word", args: ["usr/mysql-story/src/main.shy"]},
			{name: "clickhouse", help: "数据存储", index: "web.wiki.word", args: ["usr/mysql-story/src/clickhouse/clickhouse.shy"]},
		]},
	}},
	profile: {name: "测试群", storm: {
		website: {name: "定制 website", index: [
			"web.chat.website",
			"web.chat.div",
			"web.code.vimer",
			"web.dream",
		]},
		release: {name: "发布 release", index: [
			"web.code.install", "web.code.upgrade", "web.code.publish", "web.code.compile", "web.code.autogen", "web.code.binpack", "web.code.webpack",
			"web.code.git.status", "web.code.git.server",
		]},
		research: {name: "测试 research", index: [
			"web.code.favor", "web.code.bench", "web.code.pprof",
			"web.code.case",
		]},
	}},
	operate: {name: "运维群", storm: {
		aaa: {name: "权限 aaa", index: [
			"user", "totp", "sess", "role",
		]},
		web: {name: "应用 web", index: [
			"serve", "space", "dream", "route",
			"share", "spide", "cache", "story",
		]},
		cli: {name: "系统 cli", index: [
			"qrcode", "daemon", "system", "runtime",
		]},
		nfs: {name: "文件 nfs", index: [
			"cat", "dir", "tail", "trash",
		]},
	}},
}})
