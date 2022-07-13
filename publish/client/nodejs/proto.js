try { if (typeof(global) == lang.OBJECT) { // nodejs
	Volcanos.meta._load = function(url, cb) { if (!url) { return }
		setTimeout(function() { if (Volcanos.meta.cache[url]) { return cb(Volcanos.meta.cache[url]) }
			switch (url.split("?")[0].split(ice.PT).pop().toLowerCase()) {
				case nfs.JS:
					require(path.isAbsolute(url)? url: path.join(process.cwd(), "usr/volcanos", url))
					cb(Volcanos.meta.cache[url])
					break
			}
		}, 100)
	}

	Volcanos.meta._load(global.plugin, function(cache) {
		Volcanos.meta.volcano = "./frame.js", Volcanos({libs: [
			"./lib/base.js", "./lib/core.js", "./lib/misc.js", "./lib/page.js", // "./lib/user.js",
		], panels: [], plugin: []}, function(can) { can.core.List(cache, function(item) { can[item._name] = item })
			Volcanos.meta._load("./publish/client/nodejs/proto.js", function(cache) {
				can.core.List(cache, function(item) { can.base.Copy(can[item._name]||{}, item) })
				can.onimport._init(can, can.request(), function(msg) { console.log(ice.NL) }, null)
			})
		})
	})
} } catch (e) { console.log(e) }

_can_name = "./frame.js"
Volcanos("onappend", {help: "渲染引擎",
	table: function(can, msg) {
		var max = {}; msg.Table(function(value, index, array) {
			for (var k in value) { if (value[k].length > (max[k]||0)) {
				max[k] = value[k].length
			} }
		})

		var list = []; msg.Table(function(value, index, array) { var line = []
			if (index == 0) {
				for (var i = 0; i < msg.append.length; i++) { line.push(msg.append[i])
					for (var j = 0; j <= max[msg.append[i]]-msg.append[i].length; j++) {
						line.push(ice.SP)
					}
					line.push(ice.SP)
				}
				list.push(line.join(""))
			}
			line = []; for (var i = 0; i < msg.append.length; i++) { var k = msg.append[i]
				line.push(value[k])
				for (var j = 0; j <= max[k]-value[k]; j++) {
					line.push(ice.SP)
				}
				line.push(ice.SP)
			}
			list.push(line.join(""))
		})
		console.log(list.join(ice.NL))
	},
	board: function(can, msg) {
		console.log(msg.Result())
	},
})

