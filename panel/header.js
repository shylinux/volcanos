Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.onmotion.clear(can)
		can.onimport._title(can, msg, target)
		can.onimport._state(can, msg, target)
		can.onimport._avatar(can, msg, target)
		can.onimport._background(can, msg, target)
		can.onimport._search(can, msg, target)
		can.onimport._menus(can, msg, target)
		can.ondaemon._init(can)
		can.base.isFunc(cb) && cb(msg)
	},
	_title: function(can, msg, target) { if (can.user.isMobile) { return }
		can.core.List(can.base.getValid(msg.result, can.Conf(chat.TITLE)||["shylinux.com/x/contexts"]), function(item) {
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
					can.onaction.carte(event, can, [can.page.Format(html.IMG, can.onexport.avatar(can), 160)])
				}}]); return
			}
			can.page.Append(can, target, [{view: [can.base.join([chat.STATE, item]), html.DIV, (can.Conf(item)||"").slice(0, 10)], onmouseenter: function(event) {
				can.core.CallFunc([can.onaction, item], [event, can, item])
			}, _init: function(target) { item == mdb.TIME && can.onimport._time(can, target) }}])
		})
	},
	_avatar: function(can, msg) { if (can.user.isExtension || can.user.isLocalFile) { return }
		can.page.Modify(can, "div.state.avatar>img", {src: can.onexport.avatar(can)})
	},
	_background: function(can, msg) { if (can.user.isExtension || can.user.isLocalFile) { return }
		can.onlayout.background(can, can.onexport.background(can))
	},
	_search: function(can, msg, target) {
		var ui = can.onappend.input(can, {type: html.TEXT, name: mdb.SEARCH, onkeydown: function(event) {
			can.onkeymap.input(event, can); switch (event.key) {
				case lang.ENTER: can.onengine.signal(can, chat.ONOPENSEARCH, can.request(event, {type: mdb.FOREACH, word: event.target.value}))
			}
		}}, "", target, "title search")
		can.onimport.menu(can, mdb.SEARCH, function() {
			can.onengine.signal(can, chat.ONOPENSEARCH, can.request(event, {type: mdb.FOREACH, word: ui.value}))
		})
		can.user.isMobile && can.page.style(can, ui.parentNode, {float: html.RIGHT})
	},
	_menus: function(can, msg, target) {
		can.setHeaderMenu(can.user.mod.isPod||can.user.isExtension||can.user.isMobile? [ctx.CONFIG]:
			can.base.Obj(msg.Option(chat.MENUS)||can.Conf(chat.MENUS), can.onaction._menus), function(event, button) {
				can.core.CallFunc(can.onaction[button]||function(event, can) {
					can.run(event, [button], function(msg) { can.user.toastSuccess(can, can.user.trans(can, button)) })
				}, {event: event, can: can, button: button})
			})
	},

	_time: function(can, target) {
		can.core.Timer({interval: 500}, function() { can.onimport.time(can, target) })
		can.onappend.figure(can, {action: "date", style: {"min-width": 306}}, target, function(sub) {
			can.getActionSize(function(msg, top) { can.page.style(can, sub._target, {top: top, right: 0, left: ""}) })
		}), target.onmouseenter = target.click
	},
	time: function(can, target) { can.onimport.topic(can)
		target.innerHTML = can.user.time(can, null, "%w %H:%M:%S")
	},
	avatar: function(event, can, avatar) { if (can.user.isExtension || can.user.isLocalFile) { return }
		can.runAction(event, aaa.AVATAR, [avatar], function(msg) {
			can.user.info.avatar = avatar, can.onimport._avatar(can, msg), can.user.toastSuccess(can)
		})
	},
	topic: function(can, topic) { topic && (can._topic = topic)
		can.user.topic(can, can._topic || can.misc.Search(can, chat.TOPIC) || Volcanos.meta.args.topic || (can.base.isNight()? chat.BLACK: chat.WHITE))
	},
	background: function(event, can, background) { if (can.user.isExtension || can.user.isLocalFile) { return }
		can.runAction(event, aaa.BACKGROUND, [background], function(msg) {
			can.user.info.background = background, can.onimport._background(can, msg), can.user.toastSuccess(can)
		})
	},
	menu: function(can, cmds, cb, trans) { can.base.isString(cmds) && (cmds = [cmds])
		return can.page.Append(can, can._output, [{type: cmds[0], list: can.core.List(can.base.getValid(cmds.slice(1), [cmds[0]]), function(item) {
			if (can.base.isString(item)) {
				return {view: [html.MENU, html.DIV, can.user.trans(can, item, trans)], onclick: function(event) {
					can.base.isFunc(cb) && cb(event, item, [item])
					// can.base.isFunc(cb) && cb(event, item, cmds)
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
Volcanos(chat.ONPLUGIN, {help: "注册插件",
	"topic": shy("主题", {
		"demo": function(can, msg, cmds) { can.onimport.topic(can, cmds[0]) },
	}, ["topic:select=white,black", "run:button", "demo:button"], function(can, msg, cmds) {
		can.onimport.topic(can, cmds[0])
	}),
	"cookie": shy("提示", {}, ["text", "list", "back"], function(can, msg, cmds) {
		can.core.Item(can.misc.Cookie(can), function(key, value) {
			msg.Push("key", key), msg.Push("value", value)
		})
	}),
	"alert": shy("提示", {}, ["text", "list", "back"], function(can, msg, cmds) {
		can.user.alert(cmds[0])
	}),
	"info": shy("信息", {}, ["text", "list", "back"], function(can, msg, cmds) {
		msg.Echo("hello world")
	}),
	"log": shy("日志", {}, ["text", "list", "back"], function(can, msg, cmds) {
		console.log(cmds[0])
	}),
})
Volcanos(chat.ONACTION, {help: "交互数据", _init: function(can, cb, target) {
		can.base.isFunc(cb) && cb()
	},
	_menus: [["setting", chat.BLACK, chat.WHITE, chat.PRINT, code.WEBPACK, "toimage", ctx.CONFIG]],
	_trans: {
		"search": "搜索",

		"setting": "设置",
		"black": "黑色主题",
		"white": "白色主题",
		"print": "打印主题",
		"webpack": "打包页面",
		"toimage": "生成图片",
		"config": "拉取配置",

		"shareuser": "共享用户",
		"setnick": "设置昵称",
		"password": "修改密码",
		"language": "语言地区", "chinese": "中文",
		"clear": "清除背景",
		"logout": "退出登录",
	},
	onmain: function(can, msg) {
		can.run({}, [], function(msg) {
			if (!can.Conf(aaa.USERNICK, msg.Option(aaa.USERNICK)||msg.Option(ice.MSG_USERNAME))) {
				msg.Option(chat.SSO)? can.user.jumps(msg.Option(chat.SSO)): can.user.login(can, function() {
					can.onengine.signal(can, chat.ONMAIN, msg)
				}, msg.Option(aaa.LOGIN), msg.Option("login.dev"))
				return // 登录认证
			}
			can.base.Copy(can.onaction._trans, can.base.Obj(msg.Option(chat.TRANS), {}))
			can.user.info.usernick = can.Conf(aaa.USERNICK), can.user.info.avatar = msg.Option(aaa.AVATAR), can.user.info.background = msg.Option(aaa.BACKGROUND)
			msg.Option(nfs.SCRIPT) && can.require(can.base.Obj(msg.Option(nfs.SCRIPT)), function(can) { can.onaction.source(can, msg) }) 
			can.onimport._init(can, msg, function(msg) { can.onengine.signal(can, chat.ONLOGIN, msg) }, can._output)
		})
	},
	onsearchfocus: function(can) { can.page.Select(can, can._output, ["div.search", html.INPUT], function(target) { target.focus() }) },
	onwebpack: function(can, msg) { can.onaction[code.WEBPACK](msg._event, can) },
	onstorm_select: function(can, msg, river, storm) { can.Conf(chat.RIVER, river), can.Conf(chat.STORM, storm) },
	onaction_cmd: function(can, msg) { can.onmotion.hidden(can) },

	title: function(event, can) {
		var args = {}; can.core.List([chat.TITLE, chat.TOPIC, chat.LAYOUT], function(key) {
			var value = can.misc.Search(can, key); value && (args[key] = value)
		})
		can.user.jumps(can.misc.MergeURL(can, args, true))
	},

	black: function(event, can, button) { can.onimport.topic(can, button), can.onlayout._init(can) },
	white: function(event, can, button) { can.onimport.topic(can, button), can.onlayout._init(can) },
	print: function(event, can, button) { can.onimport.topic(can, [chat.WHITE, button]), can.setRiver(html.HEIGHT, ""), can.setAction(html.HEIGHT, "") },
	webpack: function(event, can) {
		can.user.input(event, can, [{name: mdb.NAME, value: can.user.title()}], function(data) {
			can.core.Item(Volcanos.meta.pack, function(key, msg) { 
				can.core.List(["_event", "_can", "_xhr", ice.MSG_SESSID, ""], function(key) { delete(msg[key]) })
			})
			var msg = can.request(event, {
				topic: can._topic, layout:  can.getAction(chat.LAYOUT),
				river: can.Conf(chat.RIVER), storm: can.Conf(chat.STORM),
				name: data.name, content: JSON.stringify(Volcanos.meta.pack),
				args: "name,topic,layout,river,storm",
			})

			var toast = can.user.toastProcess(can, "打包中...", code.WEBPACK)
			can.runAction(event, code.WEBPACK, [], function(msg) {
				toast.close(), can.user.toastSuccess(can, "打包成功", code.WEBPACK)
				can.user.download(can, "/share/local/"+msg.Result(), name, nfs.HTML)
			})
		})
	},
	toimage: function(event, can, button) {
		can.onmotion.toimage(event, can, can.user.title(), can._root._target)
	},
	config: function(event, can) {
		can.user.input(event, can, [{name: "scope", value: "etc/local.shy"}], function(args) {
			can.runAction(event, ctx.CONFIG, args, function(msg) { can.user.jumps(msg.Result()) })
		})
	},

	carte: function(event, can, list, cb) {
		can.user.carte(event, can, can.onaction, list, cb)
	},
	share: function(event, can, args) {
		can.user.share(can, can.request(event), [ctx.ACTION, chat.SHARE].concat(args||[], [chat.RIVER, can.Conf(chat.RIVER), chat.STORM, can.Conf(chat.STORM)]))
	},

	usernick: function(event, can) { if (can.user.mod.isPod || can.user.isExtension || can.user.isLocalFile) { return }
		can.onaction.carte(event, can, ["shareuser", "setnick", aaa.PASSWORD, [aaa.LANGUAGE, aaa.CHINESE, aaa.ENGLISH], cli.CLEAR, aaa.LOGOUT])
	},
	shareuser: function(event, can) {
		can.user.share(can, can.request(event), [ctx.ACTION, chat.SHARE, mdb.TYPE, aaa.LOGIN])
	},
	setnick: function(event, can) {
		var ui = can.user.input(event, can, [{name: aaa.USERNICK, value: can.Conf(aaa.USERNICK)}], function(list) {
			can.runAction(event, aaa.USERNICK, [list[0]], function(msg) {
				can.page.Select(can, can._output, can.core.Keys(html.DIV, aaa.USERNICK), function(item) {
					can.page.Modify(can, item, can.Conf(aaa.USERNICK, list[0]))
				}), can.user.toastSuccess(can)
			})
		})
		can.user.isMobile && can.page.style(can, ui._target, {top: 40, right: 0, left: ""})
	},
	password: function(event, can) {
		var ui = can.user.input(event, can, [
			{name: html.PASSWORD, type: html.PASSWORD, action: ice.AUTO},
			{name: html.PASSWORD, type: html.PASSWORD, action: ice.AUTO},
		], function(list) {
			if (list[0] != list[1]) { return can.user.toast(can, "密码不一致"), ui.focus(), true }
			can.runAction(event, aaa.PASSWORD, [list[0]])
		})
		can.user.isMobile && can.page.style(can, ui._target, {top: 40, right: 0, left: ""})
	},
	chinese: function(event, can) { can.misc.Search(can, aaa.LANGUAGE, "zh") },
	english: function(event, can) { can.misc.Search(can, aaa.LANGUAGE, "en") },
	clear: function(event, can) { can.onimport.background(event, can, ""), can.onimport.avatar(event, can, "") },
	logout: function(event, can) { can.user.logout(can) },
})
Volcanos(chat.ONEXPORT, {help: "导出数据",
	height: function(can) { return can._target.offsetHeight },
	topic: function(can) { return can._topic },
	avatar: function(can) {
		if (can.user.info.avatar == "void") {
			return ""
		}
		return can.user.info.avatar
	},
	background: function(can) {
		if (can.user.info.background == "void") {
			return ""
		}
		return can.user.info.background
	},
})
