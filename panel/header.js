Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, cb, target) {
		can.Conf(aaa.USERNICK, msg.Option(aaa.USERNICK)||msg.Option(ice.MSG_USERNICK)||msg.Option(ice.MSG_USERNAME)||can.Conf(aaa.USERNICK))

		can.onmotion.clear(can)
		can.onimport._agent(can, msg, target)
		can.onimport._grant(can, msg, target)
		can.onimport._title(can, msg, target)
		can.onimport._state(can, msg, target)
		can.onimport._search(can, msg, target)
		can.onimport._background(can, msg, target)
		can.onimport._avatar(can, msg, target)
		can.onimport._menus(can, msg, target)
		can.base.isFunc(cb) && cb(msg)
	},
	_agent: function(can, msg, target) {
		can.run({}, [chat.AGENT], function(msg) { if (!msg.Option(ssh.SCRIPT)) { return }
			can.require(can.base.Obj(msg.Option(ssh.SCRIPT)), function(can) { can.onaction.source(can, msg) })
		})
	},
	_grant: function(can, msg, target) {
		if (can.misc.Search(can, chat.GRANT)) {
			if (can.user.confirm(chat.GRANT+ice.SP+can.misc.Search(can, chat.GRANT))) {
				can.run(event, [ctx.ACTION, chat.GRANT, web.SPACE, can.misc.Search(can, chat.GRANT)])
			}
			can.misc.Search(can, chat.GRANT, "")
		}
	},
	_title: function(can, msg, target) {
		can.user.title(can.misc.Search(can, chat.TITLE)||can.misc.Search(can, ice.POD))
		!can.user.isMobile && can.core.List(can.base.getValid(msg.result, can.Conf(chat.TITLE)||["shylinux.com/x/contexts"]), function(item) {
			can.page.Append(can, target, [{view: [chat.TITLE, html.DIV, item], title: "返回主页", onclick: function(event) {
				can.onaction.title(event, can)
			}, onmouseenter: function(event) { var list = msg.Table()
				can.user.carte(event, can, {}, can.core.List(list, function(item) { return item.name }), function(event, item, meta, index) {
					event.shiftKey? can.user.open(list[index].path): can.user.jumps(list[index].path)
				})
			}}])
		})
	},
	_state: function(can, msg, target) {
		can.core.List(can.base.Obj(msg.Option(chat.STATE)||can.Conf(chat.STATE), [mdb.TIME, aaa.USERNICK]), function(item) {
			if (item == aaa.AVATAR ) { if (can.user.isLocalFile) { return }
				can.page.Append(can, target, [{view: can.base.join([chat.STATE, item]), list: [{img: ice.SP}], onmouseenter: function(event) {
					can.onaction.carte(event, can, [can.page.Format(html.IMG, "/share/local/avatar", 160)])
				}}]); return
			}

			can.page.Append(can, target, [{view: [can.base.join([chat.STATE, item]), html.DIV, (can.Conf(item)||"").slice(0, 10)], onmouseenter: function(event) {
				can.core.CallFunc([can.onaction, item], [event, can, item])
			}, _init: function(target) { item == mdb.TIME && can.onimport._time(can, target) }}])
		})
	},
	_search: function(can, msg, target) {
		var ui = can.onappend.input(can, {type: html.TEXT, name: mdb.SEARCH, onkeydown: function(event) {
			can.onkeymap.input(event, can); switch (event.key) {
				case lang.ENTER: can.onengine.signal(can, "onopensearch", can.request(event, {type: "*", word: event.target.value}))
			}
		}}, "", target, "title search").parentNode
		can.user.isMobile && can.page.Modify(can, ui, {style: {float: html.RIGHT}})
	},
	_background: function(can, msg) { if (can.user.isExtension || can.user.isLocalFile) { return }
		msg.Option(aaa.BACKGROUND) && can.onlayout.background(can, "/share/local/background", document.body)
	},
	_avatar: function(can, msg) { if (can.user.isExtension || can.user.isLocalFile) { return }
		// can.page.Modify(can, "div.state.avatar>img", {src: "/share/local/avatar/"})
		msg.Option(aaa.AVATAR) && can.page.Modify(can, "div.state.avatar>img", {src: "/share/local/avatar"})
	},
	_menus: function(can, msg, target) {
		can.setHeaderMenu(can.user.mod.isPod||can.user.isMobile||can.user.isExtension? []:
			can.base.Obj(msg.Option(chat.MENUS)||can.Conf(chat.MENUS), can.onaction._menus), function(event, button) {
				can.core.CallFunc(can.onaction[button]||function(event, can) {
					can.run(event, [button], function(msg) { can.user.toast(can, "执行成功", can.user.trans(can, button)) })
				}, {event: event, can: can, button: button})
			})
	},

	_time: function(can, target) {
		can.core.Timer({interval: 500}, function() { can.onimport.time(can, target) })
		can.onappend.figure(can, {action: "date", style: {"min-width": 306}}, target, function(sub) {
			can.get("Action", "size", function(msg, top) {
				can.page.Modify(can, sub._target, {style: {top: top, right: 0, left: null}})
			})
		}), target.onmouseenter = target.click
	},
	time: function(can, target) { can.onlayout.topic(can)
		target.innerHTML = can.user.time(can, null, "%w %H:%M:%S")
	},
	topic: function(can, topic) { can.onlayout.topic(can, can._topic = topic) },
	background: function(event, can, url) { if (can.user.isExtension || can.user.isLocalFile) { return }
		can.run(event, [ctx.ACTION, aaa.BACKGROUND, url], function(msg) { can.onimport._background(can, msg) })
	},
	avatar: function(event, can, url) { if (can.user.isExtension || can.user.isLocalFile) { return }
		can.run(event, [ctx.ACTION, aaa.AVATAR, url], function(msg) { can.onimport._avatar(can, msg) })
	},
	menu: function(can, cmds, cb, trans) {
		return can.page.Append(can, can._output, [{type: cmds[0], list: can.core.List(cmds.slice(1), function(item) {
			if (can.base.isString(item)) {
				return {view: [html.MENU, html.DIV, can.user.trans(can, item, trans)], onclick: function(event) {
					can.base.isFunc(cb) && cb(event, item, cmds)
				}}

			} else if (can.base.isArray(item)) {
				var list = can.core.List(item, function(value, index) { return can.user.trans(can, value, trans) })
				return {view: [html.MENU, html.DIV, can.user.trans(can, list[0], trans)], onmouseenter: function(event) {
					can.onaction.carte(event, can, list.slice(1), function(event, button, meta, index) {
						can.base.isFunc(cb) && cb(event, item[index+1], item)
					}, trans)
				}}

			} else if (can.base.isObject(item)) {
				return item
			}
		}) }]).first
	},
})
Volcanos("onaction", {help: "交互数据", list: [], _init: function(can, cb, target) {
		can.base.isFunc(cb) && cb()
	},
	_menus: [["setting", chat.BLACK, chat.WHITE, chat.PRINT, "webpack", "devpack", "toimage", "refresh"]],
	_trans: {
		"search": "搜索",
		"create": "创建",
		"share": "共享",

		"setting": "设置",
		"black": "黑色主题",
		"white": "白色主题",
		"print": "打印主题",
		"toimage": "生成图片",
		"refresh": "刷新页面",

		"shareuser": "共享用户",
		"setnick": "设置昵称",
		"password": "修改密码",
		"language": "语言地区",
		"chinese": "中文",
		"clear": "清除背景",
	},
	onmain: function(can, msg) {
		function init() { can.run({}, [], function(msg) {
			can.base.Copy(can.onaction._trans, can.base.Obj(msg.Option(chat.TRANS), {}))
			can.onimport._init(can, msg, function(msg) { can.onengine.signal(can, chat.ONLOGIN, msg) }, can._output)
		}) }

		// 登录检查
		can.user.isLocalFile? init(): can.run({}, [chat.CHECK], function(msg) {
			can.Conf(aaa.USERNICK, msg.Option(ice.MSG_USERNICK)||msg.Option(ice.MSG_USERNAME))? init():
				msg.Option(chat.SSO)? can.user.jumps(msg.Option(chat.SSO)):
				can.user.login(can, init, msg.Option(aaa.LOGIN))
		})
	},
	onstorm_select: function(can, msg, river, storm) { can.Conf(chat.RIVER, river), can.Conf(chat.STORM, storm) },
	onsearchfocus: function(can) {
		can.page.Select(can, can._output, "div.search input", function(target) { target.focus() })
	},

	title: function(event, can) {
		var args = {}; can.core.List([chat.TITLE, chat.TOPIC, chat.LAYOUT], function(key) {
			var value = can.misc.Search(can, key); value && (args[key] = value)
		})
		can.user.jumps(can.misc.MergeURL(can, args, true))
	},

	black: function(event, can, button) { can.onlayout.topic(can, button), can.onlayout._init(can) },
	white: function(event, can, button) { can.onlayout.topic(can, button), can.onlayout._init(can) },
	print: function(event, can, button) { can.onlayout.topic(can, can.base.join([chat.WHITE, button]))
		can.set("River", html.HEIGHT, -1), can.set("Action", html.HEIGHT, -1)
	},
	webpack: function(event, can) {
		can.user.input(event, can, [{name: mdb.NAME, value: can.user.title()}], function(ev, button, meta, list) {
			can.core.Item(Volcanos.meta.pack, function(key, msg) { 
				can.core.List(["_event", "_can", "_xhr", ice.MSG_SESSID, ""], function(key) { delete(msg[key]) })
			})
			var msg = can.request(event, {
				name: meta.name, content: JSON.stringify(Volcanos.meta.pack),
				river: can.Conf(chat.RIVER), storm: can.Conf(chat.STORM),
			})

			var toast = can.user.toast(can, "打包中...", code.WEBPACK, 1000000)
			can.run(event, [code.WEBPACK], function(msg) {
				toast.close(), can.user.toast(can, "打包成功", code.WEBPACK)
				can.user.download(can, "/share/local/"+msg.Result(), name+".html")
			})
		})
	},
	toimage: function(event, can, button) { can.onmotion.toimage(event, can, document.title, document.body) },
	refresh: function(event, can, button) { can.onlayout._init(can) },

	carte: function(event, can, list, cb, trans) { can.user.carte(event, can, can.onaction, list, cb) },
	share: function(event, can, args) {
		can.user.share(can, can.request(event), [ctx.ACTION, chat.SHARE].concat(args||[],
			[chat.RIVER, can.Conf(chat.RIVER), chat.STORM, can.Conf(chat.STORM)]))
	},

	usernick: function(event, can) {
		can.onaction.carte(event, can, ["shareuser", "setnick", "password", [aaa.LANGUAGE, aaa.CHINESE, aaa.ENGLISH], cli.CLEAR, aaa.LOGOUT])
	},
	shareuser: function(event, can) { can.user.share(can, can.request(event), [ctx.ACTION, chat.SHARE, mdb.TYPE, aaa.LOGIN]) },
	setnick: function(event, can) {
		var ui = can.user.input(event, can, [{name: aaa.USERNICK, value: can.Conf(aaa.USERNICK)}], function(ev, button, data, list, args) {
			can.run(event, [aaa.USERNICK, list[0]], function(msg) {
				can.page.Select(can, can._output, can.core.Keys(html.DIV, aaa.USERNICK), function(item) {
					can.page.Modify(can, item, can.Conf(aaa.USERNICK, list[0]))
				}), can.user.toastSuccess(can)
			}, true)
		})
		can.user.isMobile && can.page.Modify(can, ui._target, {style: {top: 40, right: 0, left: ""}})
	},
	password: function(event, can) {
		var ui = can.user.input(event, can, [{type: html.PASSWORD, action: ice.AUTO}, {type: html.PASSWORD, action: ice.AUTO}], function(ev, button, data, list, args) {
			if (list[0] != list[1]) {
				can.user.toast(can, "密码不一致")
				ui.focus()
				return true
			}

			can.run(event, [aaa.PASSWORD, list[0]], function(msg) {
				can.user.toastSuccess(can)
			}, true)
		})
		can.user.isMobile && can.page.Modify(can, ui._target, {style: {top: 40, right: 0, left: ""}})
	},
	chinese: function(event, can) { can.misc.Search(can, aaa.LANGUAGE, "zh") },
	english: function(event, can) { can.misc.Search(can, aaa.LANGUAGE, "en") },
	clear: function(event, can) { can.onimport.background(event, can, ""), can.onimport.avatar(event, can, ""), can.user.reload(true) },
	logout: function(event, can) { can.user.logout(can) },
})
Volcanos("onexport", {help: "导出数据", list: [],
	height: function(can) { return can._target.offsetHeight },
	topic: function(can) { return can._topic },
})

