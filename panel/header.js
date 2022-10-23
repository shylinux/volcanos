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
		can.core.List(can.base.getValid(can.Conf(chat.TITLE)||msg.result, ["shylinux.com/x/contexts"]), function(item) {
			can.page.Append(can, target, [{view: [chat.TITLE, html.DIV, item], title: "返回主页", onclick: function(event) {
				can.onaction.title(event, can)
			}}])
		})
	},
	_state: function(can, msg, target) { if (can.user.isMobile) { return }
		can.core.List(can.base.Obj(can.Conf(chat.STATE)||msg.Option(chat.STATE), [mdb.TIME, aaa.USERNICK]), function(item) {
			if (item == aaa.AVATAR ) { if (can.user.isLocalFile) { return }
				can.page.Append(can, target, [{view: can.base.join([chat.STATE, item]), list: [{img: ice.SP}], onmouseenter: function(event) {
					can.onaction.carte(event, can, [can.page.Format(html.IMG, can.onexport.avatar(can), 160)])
				}}]); return
			}
			can.page.Append(can, target, [{view: [can.base.join([chat.STATE, item]), html.DIV, (can.Conf(item)||msg.Option(item)||"").slice(0, 10)], onmouseenter: function(event) {
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
				case lang.ENTER: can.onengine.signal(can, chat.ONOPENSEARCH, can.request(event, {type: mdb.FOREACH, word: event.target.value||""}))
			}
		}}, "", target, "title search"); can._search = ui, can.user.isMobile || can.onimport.menu(can, mdb.SEARCH, function() {
			can.onengine.signal(can, chat.ONOPENSEARCH, can.request(event, {type: mdb.FOREACH, word: ui.value||""}))
		})
	},
	_menus: function(can, msg, target) { if (can.user.mod.isPod || can.user.isMobile) { return }
		can.setHeaderMenu(can.base.Obj(can.Conf(chat.MENUS)||msg.Option(chat.MENUS), can.onaction._menus), function(event, button) {
				can.core.CallFunc(can.onaction[button]||function(event, can) {
					can.run(event, [button], function(msg) { can.user.toastSuccess(can, button) })
				}, {event: event, can: can, button: button})
			})
	},

	_time: function(can, target) {
		can.core.Timer({interval: 500}, function() { can.onimport.time(can, target) })
		can.onappend.figure(can, {action: "date", style: {"min-width": 306}, _init: function(sub) {
			can.getActionSize(function(msg, top) { can.page.style(can, sub._target, {top: top, right: 0, left: ""}) })
		}}, target), target.onmouseenter = target.click
	},
	time: function(can, target) {
		can.onimport.topic(can), target.innerHTML = can.user.time(can, null, "%w %H:%M:%S")
	},
	avatar: function(event, can, avatar) { if (can.user.isExtension || can.user.isLocalFile) { return }
		can.runAction(event, aaa.AVATAR, [avatar], function(msg) {
			can.user.info.avatar = avatar, can.onimport._avatar(can, msg), can.user.toastSuccess(can)
		})
	},
	background: function(event, can, background) { if (can.user.isExtension || can.user.isLocalFile) { return }
		can.runAction(event, aaa.BACKGROUND, [background], function(msg) {
			can.user.info.background = background, can.onimport._background(can, msg), can.user.toastSuccess(can)
		})
	},
	topic: function(can, topic) { topic && (can._topic = topic), can.user.topic(can, can.onexport.topic(can)) },
	menu: function(can, cmds, cb, trans) { can.base.isString(cmds) && (cmds = [cmds])
		return can.page.Append(can, can._output, [{type: cmds[0], list: can.core.List(can.base.getValid(cmds.slice(1), [cmds[0]]), function(item) {
			if (can.base.isString(item)) {
				return {view: [html.MENU, html.DIV, can.user.trans(can, item, trans)], onclick: function(event) {
					can.base.isFunc(cb) && cb(event, item, [item])
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
	"title": shy("标题", {}, ["title", "run:button"], function(can, msg, cmds) {
		can.user.title(cmds[0])
	}),
	"topic": shy("主题", {}, ["topic:select=white,black", "run:button"], function(can, msg, cmds) {
		can.onimport.topic(can, cmds[0])
	}),
	"cookie": shy("参数", {}, ["name", "value", "list", "back"], function(can, msg, cmds) {
		can.core.Item(can.misc.Cookie(can), function(key, value) {
			if (cmds[0] && key != cmds[0]) { return }
			msg.Push(mdb.NAME, key), msg.Push(mdb.VALUE, value)
		})
	}),
	"alert": shy("提示", {}, ["text", "list", "back"], function(can, msg, cmds) {
		cmds && cmds[0] && can.user.alert(cmds[0])
	}),
	"log": shy("日志", {}, ["text", "list", "back"], function(can, msg, cmds) {
		console.log(cmds[0])
	}),
	"location": shy("地址", {
		copy: function(can, msg, cmds) {
			can.user.copy(msg._event, can, location.href)
		},
	}, ["link", "list", "back", "copy"], function(can, msg, cmds, cb) {
		var _msg = can.request({}, mdb.LINK, location.href)
		can.run(_msg._event, [web.SHARE], function(res) {
			msg.Echo(res.Append(mdb.TEXT))
			msg.Echo("\n")
			msg.Echo(can.page.Format(html.A, res.Append(mdb.NAME)))
			can.base.isFunc(cb) && cb(msg)
		}) 
	}),
})
Volcanos(chat.ONACTION, {help: "交互数据",
	_menus: [["setting", chat.BLACK, chat.WHITE, chat.PRINT, code.WEBPACK, "toimage"]],
	_trans: {
		"search": "搜索",

		"setting": "设置",
		"black": "黑色主题",
		"white": "白色主题",
		"print": "打印主题",
		"webpack": "打包页面",
		"toimage": "生成图片",

		"shareuser": "共享用户",
		"setnick": "设置昵称",
		"password": "修改密码",
		"language": "语言地区", "chinese": "中文",
		"clear": "清除背景",
		"logout": "退出登录",
	},
	onsize: function(can, msg) {
		can.onimport.topic(can)
	},
	onmain: function(can, msg) {
		can.run({}, [], function(msg) {
			if (!can.Conf(aaa.USERNICK, msg.Option(aaa.USERNICK)||msg.Option(ice.MSG_USERNICK)||msg.Option(ice.MSG_USERNAME))) {
				msg.Option(chat.SSO)? can.user.jumps(msg.Option(chat.SSO)): can.user.login(can, function() {
					can.onengine.signal(can, chat.ONMAIN, msg)
				}, msg.Option(aaa.LOGIN), msg.Option("login.dev"))
				return // 登录认证
			}
			can.user.info.language = can.misc.Search(can, aaa.LANGUAGE)||msg.Option(aaa.LANGUAGE)
			can.user.info.usernick = can.Conf(aaa.USERNICK), can.user.info.avatar = msg.Option(aaa.AVATAR), can.user.info.background = msg.Option(aaa.BACKGROUND)
			msg.Option(nfs.SCRIPT) && can.require(can.base.Obj(msg.Option(nfs.SCRIPT)), function(can) { can.onaction.source(can, msg) }) 
			can.onimport._init(can, msg, function(msg) { can.onengine.signal(can, chat.ONLOGIN, msg) }, can._output)
		})
	},
	onstorm_select: function(can, msg, river, storm) { can.Conf(chat.RIVER, river), can.Conf(chat.STORM, storm) },
	onsearch_focus: function(can) { can._search && can._search.focus() },
	onaction_cmd: function(can, msg) { can.onmotion.hidden(can) },
	onwebpack: function(can, msg) {
		can.user.input(msg._event, can, [{name: mdb.NAME, value: can.user.title()}], function(data) {
			can.core.Item(Volcanos.meta.pack, function(key, msg) { 
				can.core.List(["_event", "_can", "_xhr", ice.MSG_SESSID, ""], function(key) { delete(msg[key]) })
			})
			var msg = can.request({}, {
				name: data.name, content: JSON.stringify(Volcanos.meta.pack),
				river: can.Conf(chat.RIVER), storm: can.Conf(chat.STORM),
				topic: can._topic, layout:  can.getAction(chat.LAYOUT),
				args: "name,river,storm,topic,layout",
				_toast: "打包中...",
			})
			can.runAction(msg._event, code.WEBPACK, [], function(msg) {
				can.user.download(can, "/share/local/"+msg.Result(), name, nfs.HTML)
				can.user.toastSuccess(can, "打包成功", code.WEBPACK)
			})
		})
	},

	title: function(event, can) {
		var args = {}; can.core.List([chat.TITLE, chat.TOPIC], function(key) { var value = can.misc.Search(can, key); value && (args[key] = value) })
		can.user.jumps(can.misc.MergeURL(can, args, true))
	},

	black: function(event, can, button) { can.onimport.topic(can, button), can.onlayout._init(can) },
	white: function(event, can, button) { can.onimport.topic(can, button), can.onlayout._init(can) },
	print: function(event, can, button) { can.onimport.topic(can, [chat.WHITE, button]), can.onengine.signal(can, chat.ONPRINT) },
	webpack: function(event, can) { can.onengine.signal(can, "onwebpack", can.request(event)) },
	toimage: function(event, can, button) { can.onmotion.toimage(event, can, can.user.title(), can._target.parentNode) },

	carte: function(event, can, list, cb) { can.user.carte(event, can, can.onaction, list, cb) },
	share: function(event, can, args) { can.user.share(can, can.request(event), [ctx.ACTION, chat.SHARE].concat(args||[])) },

	usernick: function(event, can) { if (can.user.mod.isPod || can.user.isExtension || can.user.isLocalFile) { return }
		can.onaction.carte(event, can, ["shareuser", "setnick", aaa.PASSWORD, [aaa.LANGUAGE, aaa.CHINESE, aaa.ENGLISH], cli.CLEAR, aaa.LOGOUT])
	},
	shareuser: function(event, can) { can.user.share(can, can.request(event), [ctx.ACTION, chat.SHARE, mdb.TYPE, aaa.LOGIN]) },
	setnick: function(event, can) {
		can.user.input(event, can, [{name: aaa.USERNICK, value: can.Conf(aaa.USERNICK)}], function(list) {
			can.runAction(event, aaa.USERNICK, [list[0]], function(msg) {
				can.page.Select(can, can._output, can.core.Keys(html.DIV, aaa.USERNICK), function(item) {
					can.page.Modify(can, item, can.Conf(aaa.USERNICK, list[0]))
				}), can.user.toastSuccess(can)
			})
		})
	},
	password: function(event, can) {
		var ui = can.user.input(event, can, [
			{name: html.PASSWORD, type: html.PASSWORD, action: ice.AUTO},
			{name: html.PASSWORD, type: html.PASSWORD, action: ice.AUTO},
		], function(list) {
			if (list[0] != list[1]) { return can.user.toast(can, "密码不一致"), ui.focus(), true }
			can.runAction(event, aaa.PASSWORD, [list[0]])
		})
	},
	chinese: function(event, can) { can.misc.Search(can, aaa.LANGUAGE, "zh") },
	english: function(event, can) { can.misc.Search(can, aaa.LANGUAGE, "en") },
	clear: function(event, can) { can.onimport.background(event, can, ""), can.onimport.avatar(event, can, "") },
	logout: function(event, can) { can.user.logout(can) },
})
Volcanos(chat.ONEXPORT, {help: "导出数据",
	height: function(can) { return can._target.offsetHeight },
	topic: function(can) { return can._topic || can.misc.Search(can, chat.TOPIC) || Volcanos.meta.args.topic || (can.base.isNight()? chat.BLACK: chat.WHITE) },
	background: function(can) { return can.user.info.background == "void"? "": can.user.info.background },
	avatar: function(can) { return can.user.info.avatar == "void"? "": can.user.info.avatar },
})
