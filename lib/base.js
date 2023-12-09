Volcanos("base", {
	Int: function(val, def) { return parseInt(val)||def||0 },
	Min: function(val, min, max) {
		if (max < min) { max = min }
		if (val == "max") { return max }
		return val < min? min: val > max? max: val
	},
	Max: function(val, max, min) {
		if (min > max) { min = max }
		return val > max? max: val < min? min: val
	},
	Obj: function(val, def) {
		try {
			if (typeof val == code.STRING) { if (val == "") { return def } val = JSON.parse(val) }
			if (typeof val == code.NUMBER) { return [val] }
			if (val.length > 0) { return val } for (var k in val) { return val } return def
		} catch (e) { return typeof val == code.STRING && val.split(mdb.FS) || def }
	},
	CopyStr: function(to, from) { if (!from) { return to }
		for (var k in from) { typeof from[k] == code.STRING && (to[k] = from[k]) }
		return to
	},
	Copy: function(to, from, merge) { if (!from) { return to }
		if (arguments.length == 2 || typeof merge == code.BOOLEAN) { for (var k in from) { if (k == undefined) { continue }
			if (merge && to.hasOwnProperty(k) && to[k] != undefined && to[k] != "") { continue }
			if (from[k] === "") { delete(to[k]) } else { to[k] = from[k] }
		} return to } for (var i = 2; i < arguments.length; i++) { var k = arguments[i]; to[k] = from[k] } return to
	},
	Eq: function(to, from, skip) { var call = arguments.callee; if (typeof to != typeof from) { return false }
		if (typeof to == code.OBJECT) { if (to.length != from.length) { return false }
			for (var i = 0; i < to.length; i++) { if (!call(to[i], from[i])) { return false } }
			for (var k in to) { if (k.indexOf("_") == 0) { continue }
				if (k != skip && !call(to[k], from[k])) { return false }
			} return true
		} return to === from
	},

	Ext: function(path) { return path.split(nfs.PS).pop().split(nfs.PT).pop().toLowerCase() },
	Dir: function(path) { return path.endsWith(nfs.PS)? path: path.slice(0, path.lastIndexOf(nfs.PS)+1) },

	Path: function(path) { var res = "", arg = arguments; for (var i = 0; i < arg.length; i++) { if (!arg[i]) { continue }
		res += (arg[i][0]==nfs.PS || res=="" || res[res.length-1]==nfs.PS? "": nfs.PS) + arg[i].trim()
	} return res },
	Args: function() { var res = [], arg = arguments; function encode(k, v) { k && v != undefined && v != null && res.push(encodeURIComponent(k)+mdb.EQ+encodeURIComponent(v)) }
		for (var i = 0; i < arg.length; i += 2) { if (typeof arg[i] == code.OBJECT) {
			if (arg[i].length > 0) { for (var j = 0; j < arg[i].length; j += 2) { encode(arg[i][j], arg[i][j+1]) } } else { for (var k in arg[i]) { encode(k, arg[i][k]) } } i--
		} else { encode(arg[i], arg[i+1]) } } return res.join("&")
	},
	_parse: function(url, res) { var list = url.split("#")[0].split(ice.QS); res = res||{}, res._origin = list[0]
		list[1] && list[1].split("&").forEach(function(item) { var ls = item.split(mdb.EQ); res[decodeURIComponent(ls[0])] = decodeURIComponent(ls[1]) })
		return res
	},
	MergeURL: function(url) { var arg = this._parse(url); delete(arg._origin); for (var i = 1; i < arguments.length; i += 2) { delete(arg[arguments[i]]) }
		var arg = this.Args.apply(this, [arg].concat(Array.prototype.slice.call(arguments, 1))); return url.split(ice.QS)[0]+(arg? ice.QS+arg: "")
	},
	ParseURL: function(url) { var res = this._parse(url); res.link = url, res.origin = res._origin; return res },
	ParseJSON: function(str) { var res; if (typeof str == code.OBJECT) { return str }
		if (str.indexOf(ice.HTTP) == 0) { var res = this._parse(str, {type: web.LINK, name: "", text: str}); return res.name = res._origin.split("://").pop().split(nfs.PS)[0], res }
		try { res = JSON.parse(str), res.text = res.text||str, res.type = res.type||nfs.JSON } catch (e) { res = {type: mdb.TEXT, text: str} } return res
	},
	ParseSize: function(size) { size = size.toLowerCase().split(" ")[0]
		if (size.endsWith("tb") || size.endsWith("t")) { return parseFloat(size) * this._unit.t }
		if (size.endsWith("gb") || size.endsWith("g") || size.endsWith("gib")) { return parseFloat(size) * this._unit.g }
		if (size.endsWith("mb") || size.endsWith("m") || size.endsWith("mib")) { return parseFloat(size) * this._unit.m }
		if (size.endsWith("kb") || size.endsWith("k")) { return parseFloat(size) * this._unit.k }
		return parseFloat(size)
	}, _unit: {k: 1024, m: 1024*1024, g: 1024*1024*1024, t: 1024*1024*1024*1024},
	Size: function(size) { size = parseInt(size); var n = 100, k = this._unit.k, m = this._unit.m, g = this._unit.g, t = this._unit.t
		if (size > t) { return parseInt(size/t) + nfs.PT + parseInt(size/g%k*n/k) + "T" }
		if (size > g) { return parseInt(size/g) + nfs.PT + parseInt(size/m%k*n/k) + "G" }
		if (size > m) { return parseInt(size/m) + nfs.PT + parseInt(size/k%k*n/k) + "M" }
		if (size > k) { return parseInt(size/k) + nfs.PT + parseInt(size%k*n/k) + "K" }
		return size + "B"
	},
	Number: function(d, n) { var res = []
		while (d > 0) { res.push(d%10); d = parseInt(d/10); n-- } while (n > 0) { res.push("0"); n-- }
		return res.reverse(), res.join("")
	},
	Format: function(obj) { return JSON.stringify(obj) },
	Simple: function() { var res = []; for (var i = 0; i < arguments.length; i++) { var val = arguments[i]; switch (typeof val) {
		case code.OBJECT: if (val.length > 0) { res = res.concat(val); break }
			for (var k in val) { k && val[k] && res.push(k, val[k]) } break
		default: res.push(val)
	} } return res },
	AddUniq: function(list, value) { list = list||[], list.indexOf(value) == -1 && list.push(value); return list },
	isIn: function(item) { var arg = arguments; for (var i = 1; i < arg.length; i++) {
		if (typeof arg[i] == code.OBJECT && arg[i].length > 0 && arg[i].indexOf(item) > -1) { return true }
		if (item == arg[i]) { return true }
	} },
	Time: function(time, fmt) { var now = this.Date(time)
		fmt = fmt||"%y-%m-%d %H:%M:%S"
		fmt = fmt.replace("%y", now.getFullYear())
		fmt = fmt.replace("%m", this.Number(now.getMonth()+1, 2))
		fmt = fmt.replace("%d", this.Number(now.getDate(), 2))
		fmt = fmt.replace("%w", ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][now.getDay()])
		fmt = fmt.replace("%H", this.Number(now.getHours(), 2))
		fmt = fmt.replace("%M", this.Number(now.getMinutes(), 2))
		fmt = fmt.replace("%S", this.Number(now.getSeconds(), 2))
		fmt = fmt.replace("%s", this.Number(now.getMilliseconds(), 3))
		return fmt
	},
	Date: function(time) { var now = new Date(); if (typeof time == code.STRING && time != "") { var ls = time.split(lex.SP)
		var vs = ls[0].split("-"); now.setFullYear(parseInt(vs[0])), now.setMonth(parseInt(vs[1])-1), now.setDate(parseInt(vs[2]))
		var vs = ls[1].split(nfs.DF); now.setHours(parseInt(vs[0])), now.setMinutes(parseInt(vs[1])), now.setSeconds(parseInt(vs[2]))
	} else if (time) { now = time } return now },
	DateAdd: function(stamp, days) { return new Date(stamp - stamp%(24*3600*1000) - 8*3600*1000 + days*24*3600*1000) },
	Duration: function(n) { var res = "", h = 0
		h = parseInt(n/3600000/24), h > 0 && (res += h+"d"), n = n % (3600000*24)
		h = parseInt(n/3600000), h > 0 && (res += h+"h"), n = n % 3600000
		h = parseInt(n/60000), h > 0 && (res += h+"m"), n = n % 60000
		h = parseInt(n/1000), h > 0 && (res += h+"s"), n = n % 1000
		return res + (n > 0? nfs.PT+parseInt(n/10): "") + "s"
	},
	isNight: function() { var now = new Date(); return now.getHours() < 7 || now.getHours() > 17 },
	isNumber: function(val) { return typeof val == code.NUMBER },
	isString: function(val) { return typeof val == code.STRING },
	isObject: function(val) { return typeof val == code.OBJECT },
	isArray: function(val) { return Array.isArray(val) },
	isFunc: function(val) { return typeof val == code.FUNCTION },
	isUndefined: function(val) { return val == undefined },
	isNull: function(val) { return val == null },
	toLast: function(list, value) { if (!list) { return }
		for (var i = 0; i < list.length-1; i++) { if (list[i] == value) {
			for (i; i < list.length-1; i++) { list[i] = list[i+1] }
			list[list.length-1] = value
		} }
	},
	getValid: function() { for (var i = 0; i < arguments.length; i++) { var v = arguments[i]
		if (typeof v == code.OBJECT) { if (v == null) { continue }
			if (v.length > 0) { return v } for (var k in v) { return v }
		} else if (typeof v == code.STRING) { if (v == "") { continue } else { return v }
		} else if (v == undefined) { continue } else { return v }
	} },
	replaceAll: function(str) { if (!str) { return str } var arg = arguments; for (var i = 1; i < arg.length; i += 2) { if (!arg[i]) { continue }
		if (str.replaceAll) { str = str.replaceAll(arg[i], arg[i+1]); continue }
		if (arg[i] && str.replace) { while (str.indexOf(arg[i]) > -1) { str = str.replace(arg[i], arg[i+1]) } }
	} return str },
	contains: function(str) { var arg = arguments; for (var i = 1; i < arg.length; i++) { if (!arg[i] || str.indexOf(arg[i]) > -1) { return true } } },
	capital: function(str) { return str.slice(0, 1).toUpperCase()+str.slice(1) },
	beginWith: function(str) {
		for (var i = 1; i < arguments.length; i++) {
			if (typeof str == code.STRING && str.trim().indexOf(arguments[i]) == 0) { return true }
			if (typeof str == code.OBJECT) { var begin = true
				for (var j = 0; j < arguments[i].length; j++) {
					if (str[j] != arguments[i][j]) { begin = false; break }
				} if (begin) { return true }
			}
		}
	},
	endWith: function(str) { var arg = arguments; for (var i = 1; i < arg.length; i++) { if (typeof str == code.STRING && str.lastIndexOf(arg[i]) > 0 && str.lastIndexOf(arg[i]) + arg[i].length == str.length) { return true } } },
	trimPrefix: function(str, pre) { if (typeof str != code.STRING) { return str } var arg = arguments, callee = arg.callee
		if (arg.length > 2) { for (var i = 1; i < arg.length; i++) { str = callee(str, arg[i]) } return str }
		if (str.indexOf(pre) == -1) { return str } return str.slice(pre.length)
	},
	trimSuffix: function(str, end) { while (str) { var index = str.lastIndexOf(end)
		if (index == -1 || index+end.length != str.length) { break } str = str.slice(0, index)
	} return str },
	trim: function(arg) { if (this.isString(arg)) { return arg.trim() }
		if (this.isArray(arg)) { for (var i = arg.length-1; i >= 0; i--) { if (!arg[i]) { arg.pop() } else { break } } } return arg
	},
	join: function(list, sp) { return typeof list == code.STRING? list: (list||[]).join(sp||lex.SP) },
	joins: function(list, inner, outer) { for (var i = 0; i < list.length; i++) { list[i] = typeof list[i] == code.STRING? list[i]: list[i].join(inner||mdb.FS) } return list.join(outer||lex.SP) },
	joinKV: function(list, inner, outer) { var res = []; for (var i = 0; i < list.length-1; i += 2) { res.push(list[i]+(inner||": ")+list[i+1]) } return res.join(outer||lex.SP) },
	random: function(max, min) { return min = min||0, parseInt(Math.random()*(max-min))+min },
})
