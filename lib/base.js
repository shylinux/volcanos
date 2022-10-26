Volcanos("base", {
	Int: function(val, def) { return parseInt(val)||def||0 },
	Min: function(val, min) { return val > min? val: min },
	Max: function(val, max) { return val < max? val: max },
	Obj: function(val, def) {
		try {
			if (typeof val == lang.STRING) { if (val == "") { return def } val = JSON.parse(val) }
			if (val.length > 0) { return val } for (var k in val) { return val } return def
		} catch (e) { return val&&val.split&&val.split(ice.FS) || def }
	},
	Copy: function(to, from, skip) { if (!from) { return to }
		if (arguments.length == 2 || typeof skip == "boolean") {
			for (var k in from) {
				if (skip && to[k] != undefined) { continue }
				if (from[k] === "") { delete(to[k]); continue }
				to[k] = from[k]
			} return to
		} for (var i = 2; i < arguments.length; i++) { var k = arguments[i]; to[k] = from[k] } return to
	},
	Eq: function(to, from) { var call = arguments.callee
		if (typeof to != typeof from) { return false }
		if (typeof to == lang.OBJECT) { if (to.length != from.length) { return false }
			for (var i = 0; i < to.length; i++) { if (!call(to[i], from[i])) { return false } }
			for (var k in to) { if (!call(to[k], from[k])) { return false } }
			return true
		} return to === from
	},

	Ext: function(path) { return (path.split(ice.PS).pop().split(ice.PT).pop()).toLowerCase() },
	Path: function(path) { var res = ""
		for (var i = 0; i < arguments.length; i++) { if (!arguments[i]) { continue }
			res += (arguments[i][0]==ice.PS || res=="" || res[res.length-1]==ice.PS? "": ice.PS) + arguments[i].trim()
		} return res
	},
	Args: function() { var res = []
		for (var i = 0; i < arguments.length; i += 2) {
			if (typeof arguments[i] == lang.OBJECT) {
				for (var k in arguments[i]) { res.push(encodeURIComponent(k)+"="+encodeURIComponent(arguments[i][k])) } i--; continue
			} else if (arguments[i]) { 
				res.push(encodeURIComponent(arguments[i])+"="+encodeURIComponent(arguments[i+1]))
			}
		} return res.join("&")
	},
	MergeURL: function(url) { var args = this._parse(url); delete(args["_origin"])
		for (var i = 1; i < arguments.length; i++) { switch (typeof arguments[i]) {
			case lang.STRING: args[arguments[i]] = arguments[i+1], i++; break
			case lang.OBJECT:
				if (arguments[i].length > 0) {
					for (var j = 0; j < arguments[i].length; j += 2) { args[arguments[i][j]] = arguments[i][j] }
				} else {
					for (var k in arguments[i]) { args[k] = arguments[i][k] }
				}
		} }
		var list = []; for (var k in args) { k &&args[k] && list.push(encodeURIComponent(k)+"="+encodeURIComponent(args[k])) }
		return url.split("?")[0]+(list.length>0? "?"+list.join("&"): "")
	},
	_parse: function(url, res) { var list = url.split("?"); res = res||{}, res["_origin"] = list[0]
		list[1] && list[1].split("&").forEach(function(item) {
			var ls = item.split("="); res[decodeURIComponent(ls[0])] = decodeURIComponent(ls[1])
		}); return res
	},
	ParseURL: function(url) { var res = this._parse(url); res.link = url, res.origin = res._origin; return res },
	ParseJSON: function(str) { var res; if (typeof str == lang.OBJECT) { return str }
		if (str.indexOf(ice.HTTP) == 0) { var res = this._parse(str, {type: mdb.LINK, name: "", text: str}); return res.name = res._origin.split("://").pop().split(ice.PS)[0], res }
		try { res = JSON.parse(str), res.text = res.text||str, res.type = res.type||nfs.JSON } catch (e) { res = {type: mdb.TEXT, text: str} } return res
	},
	ParseSize: function(size) { size = size.toLowerCase()
		if (size.endsWith("tb") || size.endsWith("t")) { return parseInt(size) * 1024 * 1024 * 1024 * 1024 }
		if (size.endsWith("gb") || size.endsWith("g")) { return parseInt(size) * 1024 * 1024 * 1024 }
		if (size.endsWith("mb") || size.endsWith("m")) { return parseInt(size) * 1024 * 1024 }
		if (size.endsWith("kb") || size.endsWith("k")) { return parseInt(size) * 1024 }
		return parseInt(size)
	},

	Size: function(size) { size = parseInt(size)
		if (size > 1000000000) { return parseInt(size/1000000000) + ice.PT + parseInt(size/10000000%100) + "G" }
		if (size > 1000000) { return parseInt(size/1000000) + ice.PT + parseInt(size/10000%100) + "M" }
		if (size > 1000) { return parseInt(size/1000) + ice.PT + parseInt(size/10%100) + "K" }
		return size + "B"
	},
	Number: function(d, n) { var result = []
		while (d > 0) { result.push(d%10); d = parseInt(d/10); n-- }
		while (n > 0) { result.push("0"); n-- }
		return result.reverse(), result.join("")
	},
	Format: function(obj) { return JSON.stringify(obj) },
	Simple: function() { var res = []
		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i]; switch (typeof arguments[i]) {
				case lang.OBJECT:
					if (arg.length > 0) { res = res.concat(arg); break }
					for (var k in arg) { k && arg[k] && res.push(k, arg[k]) }
					break
				default: res.push(arg)
			}
		} return res
	},
	AddUniq: function(list, value) { list = list||[]; return list.indexOf(value) == -1 && list.push(value), list },

	Date: function(time) { var now = new Date()
		if (typeof time == lang.STRING && time != "") { var ls = time.split(ice.SP)
			var vs = ls[0].split("-"); now.setFullYear(parseInt(vs[0])), now.setMonth(parseInt(vs[1])-1), now.setDate(parseInt(vs[2]))
			var vs = ls[1].split(":"); now.setHours(parseInt(vs[0])), now.setMinutes(parseInt(vs[1])), now.setSeconds(parseInt(vs[2]))
		} else if (time) { now = time } return now
	},
	Time: function(time, fmt) { var now = this.Date(time)
		fmt = fmt||"%y-%m-%d %H:%M:%S" // fmt = fmt||"%H:%M:%S"
		fmt = fmt.replace("%y", now.getFullYear())
		fmt = fmt.replace("%m", this.Number(now.getMonth()+1, 2))
		fmt = fmt.replace("%d", this.Number(now.getDate(), 2))
		fmt = fmt.replace("%w", ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][now.getDay()])
		fmt = fmt.replace("%H", this.Number(now.getHours(), 2))
		fmt = fmt.replace("%M", this.Number(now.getMinutes(), 2))
		fmt = fmt.replace("%S", this.Number(now.getSeconds(), 2))
		return fmt
	},
	TimeAdd: function(t, d) { return new Date(t - t%(24*3600*1000) - 8*3600*1000 + d*24*3600*1000) },
	Duration: function(n) { var res = "", h = 0
		h = parseInt(n/3600000/24), h > 0 && (res += h+"d"), n = n % (3600000*24)
		h = parseInt(n/3600000), h > 0 && (res += h+"h"), n = n % 3600000
		h = parseInt(n/60000), h > 0 && (res += h+"m"), n = n % 60000
		h = parseInt(n/1000), h > 0 && (res += h), n = n % 1000
		return res + (n > 0? ice.PT+parseInt(n/10): "") + "s"
	},
	isNight: function() { var now = new Date(); return now.getHours() < 7 || now.getHours() >= 17 },

	isNumber: function(val) { return typeof val == lang.NUMBER },
	isString: function(val) { return typeof val == lang.STRING },
	isObject: function(val) { return typeof val == lang.OBJECT },
	isArray: function(val) { return typeof val == lang.OBJECT && val.length != undefined },
	isFunc: function(val) { return typeof val == lang.FUNCTION },
	isFunction: function(val) { return typeof val == lang.FUNCTION },
	isUndefined: function(val) { return val == undefined },
	isNull: function(val) { return val == null },
	getValid: function() {
		for (var i = 0; i < arguments.length; i++) { var v = arguments[i]
			if (typeof v == lang.OBJECT) { if (v == null) { continue }
				if (v.length > 0) { return v } for (var k in v) { return v }
			} else if (typeof v == lang.STRING && v) { return v
			} else if (v == undefined) { continue
			} else { return v }
		}
	},

	beginWith: function(str, begin) { return str.trim().indexOf(begin) == 0 },
	endWith: function(str, end) { return str.lastIndexOf(end) + end.length == str.length },
	trim: function(args) { if (this.isString(args)) { return args.trim() }
		if (this.isArray(args)) { for (var i = args.length-1; i >= 0; i--) { if (!args[i]) { args.pop() } else { break } } }
		return args
	},
	trimPrefix: function(str, pre) { if (str.indexOf(pre) == -1) { return str } return str.slice(pre.length) },
	trimSuffix: function(str, end) { var index = str.lastIndexOf(end); if (index == -1 || index+end.length != str.length) { return str } return str.slice(0, index) },
	join: function(list, sp) { return (list||[]).join(sp||ice.SP) },
	joins: function(list, inner, outer) { 
		for (var i = 0; i < list.length; i++) {
			list[i] = typeof list[i] == lang.STRING? list[i]: list[i].join(inner||ice.FS)
		} return list.join(outer||ice.SP)
	},
	joinKV: function(list, inner, outer) { var res = []
		for (var i = 0; i < list.length-1; i += 2) {
			res.push(list[i]+(inner||": ")+list[i+1])
		} return res.join(outer||ice.SP)
	},
	count: function(str, s) { var n = 0
		for (var i = 0; i < str.length; i++) {
			if (str[i] == s) { n++ }
		} return n
	},
	replaceAll: function(str) {
		for (var i = 1; i < arguments.length; i += 2) { if (!arguments[i]) { continue }
			if (str.replaceAll) { str = str.replaceAll(arguments[i], arguments[i+1]); continue }
			if (arguments[i] && str.replace) { while (str.indexOf(arguments[i]) > -1) { str = str.replace(arguments[i], arguments[i+1]) } }
		} return str
	},
	random: function(max, min) { return min = min||0, parseInt(Math.random()*(max-min))+min },
	mod: function(index, total) { return (index+total) % total },
})
