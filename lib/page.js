Volcanos("page", {ClassList: {
		has: function(can, obj, key) { var list = obj.className? obj.className.split(ice.SP): []; return list.indexOf(key) > -1 },
		add: function(can, obj, key) { var list = obj.className? obj.className.split(ice.SP): [], value = can.base.AddUniq(list, key).join(ice.SP).trim()
			return value != obj.className && (obj.className = value), value
		},
		del: function(can, obj, key) { var list = obj.className? obj.className.split(ice.SP): []
			return obj.className = can.core.List(list, function(value) { return value == key? undefined: value }).join(ice.SP).trim()
		},
		set: function(can, obj, key, condition) { return (condition? this.add(can, obj, key): this.del(can, obj, key)).indexOf(key) > -1 },
		neg: function(can, obj, key) { return (this.has(can, obj, key)? this.del(can, obj, key): this.add(can, obj, key)).indexOf(key) > -1 },
	},
	SelectAll: function(can, target, key, cb, interval, cbs) {
		can.page.Select(can, target, html.IFRAME, function(item) { can.page.SelectAll(can, item.contentWindow.document.body, key, cb, interval, cbs) })
		return can.core.List(target && target.querySelectorAll(key), cb, interval, cbs)
	},
	SelectInput: function(can, target, name, cb) { return can.page.Select(can, target, "input[name="+name+"]", cb)[0] },
	SelectArgs: function(can, option, key, cb) {
		if (can.base.isUndefined(option)) { return can.page.SelectArgs(can, can._option, "").concat(can.page.SelectArgs(can, can._action, "")) }
		if (can.base.isUndefined(key)) { var value = {}; can.page.SelectArgs(can, option, "", function(item) { item.name && item.value && (value[item.name] = item.value) }); return [value] }
		if (can.base.isObject(key)) { return can.core.Item(key, function(key, value) { can.page.SelectArgs(can, option, key, value) }), [key] }
		if (!can.base.isFunc(cb)) { var value = cb; cb = function(item) { if (item.type == html.BUTTON) { return } return item.name && (can.base.isUndefined(value)? item.value: (item.value = value))||"" } }
		if (key.indexOf(ice.PT) > -1) { return [""]}
		return can.page.Select(can, option, key? "textarea[name="+key+"],"+"input[name="+key+"],"+"select[name="+key+"]": ".args", cb)
	},
	SelectChild: function(can, target, key, cb) { var i = 0; return can.page.Select(can, target, key, function(node) { if (node.parentNode == target) { return cb(node, i++) } }) },
	SelectOne: function(can, target, key, cb) { return can.page.Select(can, target, key, function(target, index) { index == 0 && can.base.isFunc(cb) && cb(target) })[0] },
	Select: function(can, target, key, cb, interval, cbs) { if (key == ice.PT) { cb(target); return [] }
		return can.core.List(target && target.querySelectorAll(can.page.Keys(key)), cb, interval, cbs)
	},
	Modify: function(can, target, value) { target = can.base.isString(target)? document.querySelector(target): target; if (!target) { return }
		can.base.isString(value)? (target.innerHTML = value): can.core.Item(value, function(key, val) {
			key == "className" && can.base.isArray(val) && (val = val.join(ice.SP))
			!can.base.isObject(val)? (target[key] = val): can.core.Item(val, function(k, v) {
				if (can.base.isIn(k, "height", "width", "min-height", "max-height", "min-width", "max-width") && parseInt(v) < 0) { return target[key] && (target[key][k] = "") }
				if (can.base.isIn(k, "height", "width", "min-height", "max-height", "min-width", "max-width",
					"left", "top", "right", "bottom", "margin-left", "margin-top", "margin", "padding", "font-size",
				) && v && (can.base.isNumber(v) || !can.base.endWith(v, "px"))) { v += "px" }
				target[key] && (target[key][k] = v)
			})
		}); return target
	},
	Create: function(can, key, value) { return can.page.Modify(can, document.createElement(key), value) },
	Remove: function(can, target) { return target && target.parentNode && target.parentNode.removeChild(target), target },
	Append: function(can, target, key, value) { value = value||{}
		if (can.base.isString(key)) { var res = can.page.Create(can, key, value); return target.appendChild(res), res }
		can.core.List(key, function(item, index) { if (!item) { return }
			if (item.nodeName) { target.appendChild(item); return }
			if (can.base.isString(item)) { item = {view: [item]} }

			var type = item.type||html.DIV, data = item.data||{}, name = item.name||data.name||""
			can.core.Item(item, function(key, value) { switch (key) {
				case mdb.TYPE: break
				case mdb.NAME: break
				case mdb.DATA: break
				case mdb.LIST: break
				case html.CLICK: data.onclick = item.click; break
				case html.INNER: data.innerHTML = item.inner; break
				default: can.base.isUndefined(item[key]) || (data[key] = item[key])
			} })

			if (item.view) { var list = can.core.List(item.view); if (can.base.isArray(list[0])) { list[0] = list[0].join(ice.SP) }
				list[0] && can.page.ClassList.add(can, data, list[0]), type = list[1]||html.DIV, data.innerHTML = list[2]||data.innerHTML||"", name = name||list[3]||""
			} else if (item.text) { var list = can.core.List(item.text); if (can.base.isArray(list[2])) { list[2] = list[2].join(ice.SP) }
				data.innerHTML = list[0]||data.innerHTML||"", type = list[1]||html.SPAN, list[2] && can.page.ClassList.add(can, data, list[2])
			} else if (item.button) { var list = can.core.List(item.button); type = html.BUTTON, name = name||list[0]
				data.innerText = can.user.trans(can, list[0]), data.onclick = function(event) {
					can.base.isFunction(list[1]) && list[1](event, name), can.onkeymap.prevent(event); return true
				}
			} else if (item.select) { var list = item.select; type = html.SELECT
				data.name = name = name||list[0][0], data.title = can.user.trans(can, data.title||name), data.className = data.className||list[0][0]||""
				item.list = list[0].slice(1).map(function(value) { return {type: html.OPTION, value: value, inner: can.user.trans(can, value)} })
				data.onchange = function(event) { can.base.isFunction(list[1]) && list[1](event, event.target.value, name) }
			} else if (item.input) { var list = can.core.List(item.input); type = html.INPUT, name = name||list[0]||""
				data.type = data.type||"text", data.name = data.name||name, data.autocomplete = "off", data.className = data.className||data.name
				data.onfocus = data.onfocus||function(event) { event.target.setSelectionRange(0, -1) }
				data.onkeydown = function(event) { can.base.isFunction(list[1]) && list[1](event) }
				data.onkeyup = function(event) { can.base.isFunction(list[2]) && list[2](event) }
			} else if (item.username) { var list = can.core.List(item.username); type = html.INPUT, name = name||list[0]||html.USERNAME
				data.name = data.name||name, data.autocomplete = data.autocomplete||html.USERNAME, data.className = list[1]||data.className||data.name
			} else if (item.password) { var list = can.core.List(item.password); type = html.INPUT, name = name||list[0]||html.PASSWORD
				data.type = html.PASSWORD, data.name = data.name||name, data.autocomplete = data.autocomplete||"current-password", data.className = list[1]||data.className||data.name
			} else if (item.img) { var list = can.core.List(item.img); type = html.IMG, data.src = list[0]
			} else if (item.row) { type = html.TR, item.list = item.row.map(function(text) { return {text: [text, item.sub||html.TD]} })
			} else if (item.th) { type = html.TR, item.list = item.th.map(function(text) { return {text: [text, html.TH]} })
			} else if (item.td) { type = html.TR, item.list = item.td.map(function(text) { return {text: [text, html.TD]} }) }

			if (type == html.SELECT)  { data.title = can.user.trans(can, data.title||data.name) }
			if (type == html.INPUT)  { data.type == html.BUTTON && (data.value = can.user.trans(can, data.value))
				if (data.type == html.TEXT||data.type == html.PASSWORD||!data.type) { data.autocomplete = data.autocomplete||"off"
					data.placeholder = (data.placeholder||data.name||"").split(ice.PT).pop(), data.title = can.user.trans(can, data.title||data.placeholder)
				}
			} else if (type == html.TEXTAREA)  { data.placeholder = can.user.trans(can, (data.placeholder||data.name||"").split(ice.PT).pop()) }

			!data.name && item.name && (data.name = item.name); var node = can.page.Create(can, type, data)
			value[name||""] = value[can.core.Split(data.className)[0]||""] = value[type] = node, value._target = value._target||node, value.first = value.first||node, value.last = node
			item.list && can.page.Append(can, node, item.list, value), target && target.appendChild && target.appendChild(node), can.base.isFunc(item._init) && item._init(node, value)
		}); return value
	},
	Appends: function(can, target, key, value) { return target.innerHTML = "", can.page.Append(can, target, key, value) },
	AppendTable: function(can, msg, target, list, cb) { if (!msg.append||msg.append.length == 0) {return}
		var table = can.page.Append(can, target, html.TABLE), thead = can.page.Append(can, table, html.THEAD), tbody = can.page.Append(can, table, html.TBODY)
		can.page.Append(can, thead, [{type: html.TR, data: {dataset: {index: -1}}, list: can.core.List(list, function(key) { return key[0] != "_" && {text: [key.trim(), html.TH]} }) }])
		can.page.Append(can, tbody, can.core.List(msg.Table(), function(line, index, array) { return {type: html.TR, dataset: {index: index}, list: can.core.List(list, function(key) { return key[0] != "_" && cb(can.page.Color(line[key]).trim(), key, index, line, array) }) } }))
		return can.page.OrderTable(can, table)
	},
	OrderTable: function(can, table) {
		can.page.Select(can, table, html.TH, function(th, index) { th.onclick = function(event) { var dataset = event.target.dataset
			can.page.RangeTable(can, table, index, (dataset["sort_asc"] = (dataset["sort_asc"] == "1") ? 0: 1) == "1")
		} }); return table
	},
	RangeTable: function(can, table, index, sort_asc) { index = can.base.isArray(index)? can.core.List(index, function(item) { if (item > -1) { return item } }): [index]; if (index.length == 0) { return }
		var list = can.page.Select(can, table, html.TR, function(tr) { if (tr.style.display != html.NONE && !can.page.ClassList.has(can, tr, html.HIDE)) { return tr } }).slice(1)
		var is_time = true, is_number = true; can.core.List(list, function(tr) { var text = tr.childNodes[index[0]].innerHTML; is_time = is_time && Date.parse(text) > 0, is_number = is_number && !isNaN(parseInt(text)) })
		var num_list = can.core.List(list, function(tr) { var text = tr.childNodes[index[0]].innerHTML; return is_time? Date.parse(text): is_number? can.base.ParseSize(text): text })
		function isless(a, b, index) { if (a.childNodes[index[0]] && b.childNodes[index[0]]) {
			if (a.childNodes[index[0]].innerHTML < b.childNodes[index[0]].innerHTML) { return true }
			if (a.childNodes[index[0]].innerHTML > b.childNodes[index[0]].innerHTML) { return false }
		} return index.length > 1 && isless(a, b, index.slice(1)) }

		for (var i = 0; i < num_list.length; i++) { var min = i
			for (var j = i+1; j < num_list.length; j++) {
				if (sort_asc? num_list[min] < num_list[j]: num_list[j] < num_list[min]) { min = j; continue }
				if (num_list[min] == num_list[j] && index.length > 1) { if (sort_asc? isless(list[min], list[j], index.slice(1)): isless(list[j], list[min], index.slice(1))) { min = j } }
			}
			if (min != i) {
				var temp = num_list[i]; num_list[i] = num_list[min]; num_list[min] = temp
				var temp = list[i]; list[i] = list[min]; list[min] = temp
			}
			var tbody = list[i].parentElement; list[i].parentElement && tbody.removeChild(list[i]), tbody.appendChild(list[i])
		}
	},

	inputs: function(can, list) {
		var _list = []; for (var i = 0; i < list.length; i++) { switch (list[i]) {
			case "": _list.push(""); break
			case ice.AUTO:
				_list.push({type: html.BUTTON, name: ice.LIST})
				_list.push({type: html.BUTTON, name: ice.BACK})
				break
			case mdb.PAGE:
				_list.push({type: html.TEXT, name: mdb.LIMIT, value: can._msg.Option(mdb.LIMIT)})
				_list.push({type: html.TEXT, name: mdb.OFFEND, value: can._msg.Option(mdb.OFFEND)})
				_list.push(mdb.PREV, mdb.NEXT)
				break
			default:
				(function() { var item = can.core.SplitInput(list[i], html.BUTTON);
					if (item.type == html.SELECT) { item._init = function(target) { target.value = item.value||item.values[0], target.onchange = function(event) { can.run(event) } } }
					item.action && (function() { item._init = function(target) { can.onappend.figure(can, item, target) } })()
					item.type == html.BUTTON? _list.push(list[i]): _list.push(item)
				})()
		} } return _list
	},
	input: function(can, item, value) {
		var input = {type: html.INPUT, name: item.name, data: item, dataset: {}, _init: item._init, style: item.style||{}}
		item.value == ice.AUTO && (item.value = "", item.action = ice.AUTO), item.action == ice.AUTO && (input.dataset.action = ice.AUTO)
		switch (item.type = item.type||html.TEXT) {
			case html.TEXTAREA: input.type = html.TEXTAREA
				input.style.height = input.style.height||can.Conf([ctx.FEATURE, html.TEXTAREA, item.name, html.HEIGHT].join(ice.PT))||can.Conf([ctx.FEATURE, html.TEXTAREA, html.HEIGHT].join(ice.PT))
				input.style.width = input.style.width||can.Conf([ctx.FEATURE, html.TEXTAREA, item.name, html.WIDTH].join(ice.PT))||can.Conf([ctx.FEATURE, html.TEXTAREA, html.WIDTH].join(ice.PT))
				// no break
			case html.USERNAME: // no break
			case html.PASSWORD: // no break
			case html.TEXT:
				item.autocomplete = "off"
				item.name = item.name||item.type
				item.value = value||item.value||""
				item.placeholder = item.placeholder||item.name||item.type
				item.title = item.title||item.placeholder||item.name||item.type
				item.className || can.page.ClassList.add(can, item, ctx.ARGS); break
			case html.SELECT: input.type = html.SELECT
				item.values = can.base.isString(item.values)? can.core.Split(item.values): item.values
				if (!item.values && item.value) { item.values = can.core.Split(item.value), item.value = item.values[0] }
				if (item.values.slice(1).indexOf(item.values[0]) > -1) { item.value = item.value||item.values[0], item.values = item.values.slice(1) }
				item.value = value||item.value, input.list = item.values.map(function(value) { return {type: html.OPTION, value: value, inner: value} })
				item.className || can.page.ClassList.add(can, item, ctx.ARGS); break
			case html.BUTTON: item.value = item.value||item.name||mdb.LIST; break
			case html.UPLOAD: item.type = html.FILE, input.name = html.UPLOAD; break
			case "upfile": item.type = html.FILE; break
		} return input
	},

	Format: function(type) { var args = arguments; switch (type) {
		case html.A: return "<a href='"+args[1]+"' target='_blank'>"+(args[2]||args[1])+"</a>"
		case html.IMG: return args[2]? "<img src='"+args[1]+"' height="+args[2]+">": "<img src='"+args[1]+"'>"
		case html.SPAN: return args[2]? "<span class='"+args[2]+"'>"+args[1]+"</span>": args[1]
	} },
	Color: function(text) { if (typeof text != lang.STRING) { return "" } text = text.replace(/\\n/g, "<br>")
		if (text.indexOf(ice.HTTP) == 0 && text.length > 10) { var ls = text.split(ice.SP); text = "<a href='"+ls[0]+"' target='_blank'>"+ls[0]+"</a>"+ls.slice(1).join(ice.SP) }
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
	Keys: function() { var list = [] // FS SP GT PT
		for (var i = 0; i < arguments.length; i++) { var v = arguments[i]
			if (typeof v == lang.OBJECT) {
				for (var j = 0; j < v.length; j++) { if (typeof v[j] == lang.OBJECT) {
					for (var k = 0; k < v[j].length; k++) { if (typeof v[j][k] == lang.OBJECT) { v[j][k] = v[j][k].join(ice.PT) } }
					v[j] = v[j].join(ice.GT)
				} } list.push(v.join(ice.SP))
			} else { list.push(v+"") }
		} return list.join(ice.FS)
	},
	Cache: function(name, output, data) { if (!name) { return }
		var cache = output._cache||{}; output._cache = cache
		if (data) { if (output.children.length == 0) { return }
			var temp = document.createDocumentFragment()
			while (output.childNodes.length > 0) { var item = output.childNodes[0]; item.parentNode.removeChild(item), temp.appendChild(item) }
			return cache[name] = {node: temp, data: data}, name
		} output.innerHTML = ""
		var list = cache[name]; if (!list) { return }
		while (list.node.childNodes.length > 0) { var item = list.node.childNodes[0]; item.parentNode.removeChild(item), output.appendChild(item) }
		return delete(cache[name]), list.data
	},

	insertBefore: function(can, list, before, parent) { parent = parent||before.parentNode
		var item = can.base.isArray(list)? can.page.Append(can, parent, list)._target: list
		return before && parent.insertBefore(item, before), item
	},
	styleDisplay: function(can, target, value) { return can.page.style(can, target, html.DISPLAY, value), target.style.display },
	styleHeight: function(can, target, value) { return can.page.style(can, target, html.HEIGHT, value), target.offsetHeight },
	styleWidth: function(can, target, value) { return can.page.style(can, target, html.WIDTH, value), target.offsetWidth },
	styleClass: function(can, target, value) { can.page.Modify(can, target, {className: value}) },
	style: function(can, target, style) { var value = {}
		for (var i = 2; i < arguments.length; i += 2) {
			if (typeof arguments[i] == lang.OBJECT) {
				can.page.Modify(can, target, {style: arguments[i--]})
			} else if (can.base.isUndefined(arguments[i])) { continue
			} else { value[arguments[i]] = arguments[i+1] }
		} return can.page.Modify(can, target, {style: value}), value
	},
	tagis: function(target) { var type = target.tagName.toLowerCase(); for (var i = 1; i < arguments.length; i++) { if (type == arguments[i]) { return true } } },
	editable: function(can, item, ok) { item.setAttribute("contenteditable", ok) },
	draggable: function(can, item, ok) { item.setAttribute("draggable", ok) },
	height: function() { return window.innerHeight },
	width: function() { return window.innerWidth },
	ismodkey: function(event) { return [lang.META, lang.ALT, lang.CONTROL, lang.SHIFT].indexOf(event.key) > -1 },
	isDisplay: function(target) { return target.style.display != html.NONE && target.innerHTML != "" },
})
