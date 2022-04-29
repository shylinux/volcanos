Volcanos("page", {help: "用户界面", ClassList: {
		has: function(can, obj, key) { var list = obj.className? obj.className.split(ice.SP): []
			return list.indexOf(key) > -1
		},
		add: function(can, obj, key) { var list = obj.className? obj.className.split(ice.SP): []
			var value = can.base.AddUniq(list, key).join(ice.SP).trim()
			return value != obj.className && (obj.className = value), value
		},
		del: function(can, obj, key) { var list = obj.className? obj.className.split(ice.SP): []
			return obj.className = can.core.List(list, function(value) { return value == key? undefined: value }).join(ice.SP).trim()
		},
		set: function(can, obj, key, condition) {
			return (condition? this.add(can, obj, key): this.del(can, obj, key)).indexOf(key) > -1
		},
		neg: function(can, obj, key) {
			return (this.has(can, obj, key)? this.del(can, obj, key): this.add(can, obj, key)).indexOf(key) > -1
		},
	},
	SelectArgs: function(can, option, key, cb) {
		if (can.base.isUndefined(key)) { var value = {}
			can.page.SelectArgs(can, option, "", function(item) {
				item.name && item.value && (value[item.name] = item.value)
			}); return [value]
		}
		if (can.base.isObject(key)) {
			return can.core.Item(key, function(key, value) { can.page.SelectArgs(can, option, key, value) }), [key]
		}
		if (!can.base.isFunc(cb)) { var value = cb; cb = function(item) { if (item.type == html.BUTTON) { return }
			return item.name && (can.base.isUndefined(value)? item.value: (item.value = value))||""
		} }
		if (key.indexOf(ice.PT) > -1) { return [""]}
		return can.page.Select(can, option, key? "textarea[name="+key+"],"+"input[name="+key+"],"+"select[name="+key+"]": ".args", cb)
	},
	SelectAll: shy("选择节点", function(can, target, key, cb, interval, cbs) {
		can.page.Select(can, target, html.IFRAME, function(item) {
			can.page.SelectAll(can, item.contentWindow.document.body, key, cb, interval, cbs)
		})
		return can.core.List(target && target.querySelectorAll(key), cb, interval, cbs)
	}),
	Select: shy("选择节点", function(can, target, key, cb, interval, cbs) { if (key == ice.PT) { cb(target); return [] }
		return can.core.List(target && target.querySelectorAll(can.page.Keys(key)), cb, interval, cbs)
	}),
	Modify: shy("修改节点", function(can, target, value) { target = target||{}
		target = can.base.isObject(target)? target: document.querySelector(target); if (!target) { return }
		can.base.isString(value)? (target.innerHTML = value): can.core.Item(value, function(key, val) {
			!can.base.isObject(val)? (target[key] = val): can.core.Item(val, function(k, v) {
				var size = {
					"height": true, "max-height": true, "min-height": true,
					"width": true, "max-width": true, "min-width": true,
				}
				if (size[k] && parseInt(v) < 0) { return target[key] && (target[key][k] = "") }

				var size = {
					"margin-top": true, "margin-left": true, "font-size": true,
					"left": true, "right": true, "top": true, "bottom": true,
					"height": true, "max-height": true, "min-height": true,
					"width": true, "max-width": true, "min-width": true,
				}

				if (size[k] && v && (can.base.isNumber(v) || v.indexOf && v.indexOf("px") == -1)) { v += "px" }
				target[key] && (target[key][k] = v)
			})
		})
		return target
	}),
	Remove: shy("删除节点", function(can, target) {
		return target && target.parentNode && target.parentNode.removeChild(target), target
	}),
	Create: shy("创建节点", function(can, key, value) {
		return can.page.Modify(can, document.createElement(key), value)
	}),
	Append: shy("添加节点", function(can, target, key, value) { value = value||{}
		if (can.base.isString(key)) { var res = can.page.Create(can, key, value); return target.appendChild(res), res }

		can.core.List(key, function(item, index) { if (!item) { return }
			if (can.base.isString(item)) { target.innerHTML = item; return }
			if (item.nodeName) { target.appendChild(item); return }

			// 基本结构: type name data list
			var type = item.type||html.DIV, data = item.data||{}
			var name = item.name||data.name||""

			// 数据调整
			can.core.Item(item, function(key, value) {
				switch (key) {
					case mdb.TYPE: break
					case mdb.NAME: break
					case mdb.DATA: break
					case mdb.LIST: break
					case html.INNER: data.innerHTML = item.inner; break
					case html.CLICK: data.onclick = item.click; break
					default: data[key] = item[key]
				}
			})

			// 基本类型: view text button select input username password
			// 基本类型: img row th td
			if (item.view) { var list = can.core.List(item.view)
				if (can.base.isArray(list[0])) { list[0] = list[0].join(ice.SP) }
				list[0] && can.page.ClassList.add(can, data, list[0])
				type = list[1]||html.DIV
				data.innerHTML = list[2]||data.innerHTML||""
				name = name||list[3]||""

			} else if (item.text) { var list = can.core.List(item.text)
				data.innerHTML = list[0]||data.innerHTML||""
				type = list[1]||html.SPAN
				list[2] && can.page.ClassList.add(can, data, list[2])

			} else if (item.button) { var list = can.core.List(item.button)
				type = html.BUTTON, name = name||list[0]
				data.innerText = can.user.trans(can, list[0]), data.onclick = function(event) {
					can.base.isFunction(list[1]) && list[1](event, name)
					can.onkeymap.prevent(event)
					return true
				}

			} else if (item.select) { var list = item.select
				type = html.SELECT, data.name = name = name||list[0][0]
				data.title = can.user.trans(can, data.title||name)
				data.className = data.className||list[0][0]||""

				item.list = list[0].slice(1).map(function(value) {
					return {type: html.OPTION, value: value, inner: can.user.trans(can, value)}
				})
				data.onchange = function(event) {
					can.base.isFunction(list[1]) && list[1](event, event.target.value, name)
				}

			} else if (item.input) { var list = can.core.List(item.input)
				type = html.INPUT, name = name||list[0]||"", data.name = data.name||name
				data.className = data.className||data.name
				data.autocomplete = "off"

				data.onfocus = data.onfocus||function(event) {
					event.target.setSelectionRange(0, -1)
				}
				data.onkeydown = function(event) {
					can.base.isFunction(list[1]) && list[1](event)
				}
				data.onkeyup = function(event) {
					can.base.isFunction(list[2]) && list[2](event)
				}
			} else if (item.username) { var list = can.core.List(item.username)
				type = html.INPUT, name = name||list[0]||html.USERNAME, data.name = data.name||name
				data.className = list[1]||data.className||data.name
				data.autocomplete = data.autocomplete||html.USERNAME

			} else if (item.password) { var list = can.core.List(item.password)
				type = html.INPUT, name = name||list[0]||html.PASSWORD, data.name = data.name||name
				data.className = list[1]||data.className||data.name
				data.autocomplete = data.autocomplete||"current-password"
				data.type = html.PASSWORD

			} else if (item.img) { var list = can.core.List(item.img)
				type = html.IMG, data.src = list[0]

			} else if (item.row) { type = html.TR
				item.list = item.row.map(function(text) { return {text: [text, item.sub||html.TD]} })
			} else if (item.th) { type = html.TR
				item.list = item.th.map(function(text) { return {text: [text, html.TH]} })
			} else if (item.td) { type = html.TR
				item.list = item.td.map(function(text) { return {text: [text, html.TD]} })
			}

			// 语言转换
			if (type == html.INPUT)  { data.type == html.BUTTON && (data.value = can.user.trans(can, data.value))
				if (data.type == html.TEXT||data.type == html.PASSWORD||!data.type) { data.autocomplete = data.autocomplete||"off"
					// data.placeholder = can.user.trans(can, (data.placeholder||data.name||"").split(ice.PT).pop())
					data.placeholder = (data.placeholder||data.name||"").split(ice.PT).pop()
					data.title = can.user.trans(can, data.title||data.placeholder)
				}
			}
			if (type == html.TEXTAREA)  {
				data.placeholder = can.user.trans(can, (data.placeholder||data.name||"").split(ice.PT).pop())
			}

			// 创建节点
			!data.name && item.name && (data.name = item.name)
			var node = can.page.Create(can, type, data)

			// 创建索引
			name = name||data.className||type||""
			value[name||""] = value[data.className||""] = value[type] = node
			value.first = value.first||node, value.last = node
			value._target = value._target||node

			// 递归节点
			item.list && can.page.Append(can, node, item.list, value)
			target && target.appendChild && target.appendChild(node)
			can.base.isFunc(item._init) && item._init(node, value)
		})
		return value
	}),
	Appends: shy("添加节点", function(can, target, key, value) {
		return target.innerHTML = "", can.page.Append(can, target, key, value)
	}),

	AppendTable: shy("添加表格", function(can, msg, target, list, cb) {
		if (!msg.append||msg.append.length == 0) {return}

		var table = can.page.Append(can, target, html.TABLE)
		can.page.Append(can, table, [{type: html.TR, data: {dataset: {index: -1}}, list: 
			can.core.List(list, function(key) {
				return key[0] == "_"? undefined: {text: [key.trim(), html.TH]}
			})
		}])
		can.page.Append(can, table, can.core.List(msg.Table(), function(line, index, array) {
			var _list = can.core.List(list, function(key) { if (key.indexOf("_") == 0) { return }
				return cb(can.page.Color(line[key]).trim(), key, index, line, array)
			})
			return _list.length > 0? {type: html.TR, dataset: {index: index}, list: _list}: undefined
		}))
		return can.page.OrderTable(can, table)
	}),
	OrderTable: function(can, table) {
		can.page.Select(can, table, html.TH, function(th, index) {
			th.onclick = function(event) { var dataset = event.target.dataset
				dataset["sort_asc"] = (dataset["sort_asc"] == "1") ? 0: 1
				can.page.RangeTable(can, table, index, dataset["sort_asc"] == "1")
			}
		})
		return table
	},
	RangeTable: function(can, table, index, sort_asc) {
		var list = can.page.Select(can, table, html.TR, function(tr) {
			return tr.style.display == html.NONE||can.page.ClassList.has(can, tr, "hide")? null: tr
		}).slice(1)

		index = can.base.isObject(index)? index: [index]
		index = can.core.List(index, function(item) { if (item > -1) { return item} })
		if (index.length == 0) { return }

		var is_time = true, is_number = true
		can.core.List(list, function(tr) {
			var text = tr.childNodes[index[0]].innerText
			is_time = is_time && Date.parse(text) > 0
			is_number = is_number && !isNaN(parseInt(text))
		})

		var num_list = can.core.List(list, function(tr) {
			var text = tr.childNodes[index[0]].innerText
			return is_time? Date.parse(text):
				is_number? can.base.ParseSize(text): text
		})
		function isless(a, b, index) {
			if (a.childNodes[index[0]] && b.childNodes[index[0]]) {
				if (a.childNodes[index[0]].innerText < b.childNodes[index[0]].innerText) { return true }
				if (a.childNodes[index[0]].innerText > b.childNodes[index[0]].innerText) { return false }
			}
			return index.length > 1 && isless(a, b, index.slice(1))
		}

		// 选择排序
		for (var i = 0; i < num_list.length; i++) { var min = i
			for (var j = i+1; j < num_list.length; j++) {
				if (num_list[min] == num_list[j] && index.length > 1 && list[index[1]]) {
					if (sort_asc? isless(list[min], list[j], index.slice(1)): isless(list[j], list[min], index.slice(1))) {
						min = j
					}
				} else if (sort_asc? num_list[min] < num_list[j]: num_list[j] < num_list[min]) {
					min = j
				}
			}

			if (min != i) {
				var temp = num_list[i]; num_list[i] = num_list[min]; num_list[min] = temp
				var temp = list[i]; list[i] = list[min]; list[min] = temp
			}

			var tbody = list[i].parentElement
			list[i].parentElement && tbody.removeChild(list[i])
			tbody.appendChild(list[i])
		}
	},

	Cache: function(name, output, data) { if (!name) { return }
		var cache = output._cache||{}; output._cache = cache
		if (data) { if (output.children.length == 0) { return }
			var temp = document.createDocumentFragment()
			while (output.childNodes.length > 0) { // 写缓存
				var item = output.childNodes[0]
				item.parentNode.removeChild(item),
					temp.appendChild(item)
			}
			return cache[name] = {node: temp, data: data}, name
		}
		output.innerHTML = ""

		var list = cache[name]; if (!list) { return }
		while (list.node.childNodes.length > 0) { // 读缓存
			var item = list.node.childNodes[0]
			item.parentNode.removeChild(item)
			output.appendChild(item)
		}
		return delete(cache[name]), list.data
	},
	Format: function(type) {
		switch (type) {
			case html.A: return "<a href='"+arguments[1]+"' target='_blank'>"+(arguments[2]||arguments[1])+"</a>"
			case html.IMG: return arguments[2]? "<img src='"+arguments[1]+"' height="+arguments[2]+">": "<img src='"+arguments[1]+"'>"
		}
	},
	replace: function(can, text, key, value) {
		return can.base.replaceAll(text, "<", "&lt;", ">", "&gt;", key, value)
	},
	Color: function(text) { if (typeof text != lang.STRING) { return "" }
		if (text.indexOf("http://") == 0 || text.indexOf("https://") == 0 || text.indexOf("ftp://") == 0) {
			var ls = text.split(ice.SP);
			text = "<a href='"+ls[0]+"' target='_blank'>"+ls[0]+"</a>"+ls.slice(1).join(ice.SP)
		}; text = text.replace(/\\n/g, "<br>")

		if (text.indexOf("\033\[") == -1) { return text }
		text = text.replace(/\033\[31m/g, "<span style='color:#f00'>")
		text = text.replace(/\033\[32m/g, "<span style='color:#0f0'>")
		text = text.replace(/\033\[33m/g, "<span style='color:#ff0'>")
		text = text.replace(/\033\[34m/g, "<span style='color:#00f'>")
		text = text.replace(/\033\[36m/g, "<span style='color:#0ff'>")
		text = text.replace(/\033\[34;1m/g, "<span style='color:#00f'>")
		text = text.replace(/\033\[37;1m/g, "<span style='color:#fff'>")
		text = text.replace(/\033\[1m/g, "<span style='font-weight:bold'>")
		text = text.replace(/\033\[0m/g, "</span>")
		text = text.replace(/\033\[m/g, "</span>")
		return text
	},
	input: function(can, item, value) {
		var input = {type: html.INPUT, name: item.name, data: item, dataset: {}, _init: item._init, style: item.style||{}}
		item.value == ice.AUTO && (item.value = "", item.action = ice.AUTO), item.action == ice.AUTO && (input.dataset.action = ice.AUTO)

		switch (item.type = item.type||html.TEXT) {
			case html.TEXTAREA: input.type = html.TEXTAREA
				input.style.height = input.style.height||can.Conf([ctx.FEATURE, html.TEXTAREA, item.name, html.HEIGHT].join(ice.PT))||can.Conf(["feature", html.TEXTAREA, html.HEIGHT].join(ice.PT))
				input.style.width = input.style.width||can.Conf([ctx.FEATURE, html.TEXTAREA, item.name, html.WIDTH].join(ice.PT))||can.Conf(["feature", html.TEXTAREA, html.WIDTH].join(ice.PT))
				// no break
			case html.USERNAME:
			case html.PASSWORD:
				// no break
			case html.TEXT:
				item.autocomplete = "off"
				item.name = item.name||item.type
				item.value = value||item.value||""
				item.placeholder = item.placeholder||item.name||item.type
				item.title = item.title||item.placeholder||item.name||item.type
				item.className || can.page.ClassList.add(can, item, ctx.ARGS)
				break
			case html.SELECT: input.type = html.SELECT
				item.values = can.base.isString(item.values)? can.core.Split(item.values): item.values
				if (!item.values && item.value) { item.values = can.core.Split(item.value), item.value = item.values[0] }

				item.value = value||item.value, input.list = item.values.map(function(value) {
					return {type: html.OPTION, value: value, inner: value}
				}), item.className || can.page.ClassList.add(can, item, ctx.ARGS)
				break
			case html.BUTTON: item.value = item.value||item.name||mdb.LIST; break
			case "upfile": item.type = html.FILE; break
			case html.UPLOAD: item.type = html.FILE, input.name = html.UPLOAD; break
			default:
		}
		return input
	},

	styleDisplay: function(can, target, value) {
		return can.page.style(can, target, html.DISPLAY, value), target.style.display
	},
	styleHeight: function(can, target, value) {
		return can.page.style(can, target, html.HEIGHT, value), target.offsetHeight
	},
	styleWidth: function(can, target, value) {
		return can.page.style(can, target, html.WIDTH, value), target.offsetWidth
	},
	style: function(can, target, style) { var value = {}
		for (var i = 2; i < arguments.length; i += 2) {
			if (typeof arguments[i] == lang.OBJECT) {
				can.base.Copy(value, arguments[i--])
			} else if (typeof arguments[i] == lang.UNDEFINED) {
				continue
			} else {
				value[arguments[i]] = arguments[i+1]
			}
		}
		return can.page.Modify(can, target, {style: value}), value
	},
	Keys: function() { var list = [] // FS SP GT PT
		for (var i = 0; i < arguments.length; i++) { var v = arguments[i]
			if (typeof v == lang.OBJECT) {
				for (var j = 0; j < v.length; j++) {
					if (typeof v[j] == lang.OBJECT) {
						for (var k = 0; k < v[j].length; k++) {
							if (typeof v[j][k] == lang.OBJECT) { v[j][k] = v[j][k].join(ice.PT) }
						}
						v[j] = v[j].join(ice.GT)
					}
				}
				list.push(v.join(ice.SP))
			} else {
				list.push(v+"")
			}
		}
		return list.join(ice.FS)
	},
	css: function(text) {
		var styleSheet = document.createElement("style")
		styleSheet.type = "text/css", styleSheet.innerText = text
		document.head.appendChild(styleSheet)
	},
	tagis: function(type, target) { type = typeof type == lang.OBJECT? type: [type]
		if (type.indexOf(target.tagName.toLowerCase()) > -1) { return true }
	},
	offsetTop: function(item) { var res = 0
		while (item) { res += item.offsetTop||0, item = item.parentNode }
		return res
	},
	offsetLeft: function(item) { var res = 0
		// if (item.offsetLeft) { return item.offsetLeft }
		while (item) { res += item.offsetLeft||0, item = item.parentNode }
		return res
	},

	AppendVue: function(can, meta, list, target) {
		can.require(["https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"], function() {
			can.require(["https://unpkg.com/element-ui/lib/index.js", "https://unpkg.com/element-ui/lib/theme-chalk/index.css"], function() {
				new Vue(can.base.Copy({el: can.page.Append(can, target||can._output, [{type: "div", inner: list}]).first}, meta))
			})
		})
	},

	insertBefore: function(can, list, before) {
		var item = can.page.Append(can, before.parentNode, list).first
		before.parentNode.insertBefore(item, before)
		return item
	},
})

