try { if (typeof(global) == lang.OBJECT) { // nodejs
	Volcanos.meta._load = function(url, cb) { if (!url) { return cb() }
		switch (url.split("?")[0].split(nfs.PT).pop().toLowerCase()) {
			case nfs.JS:
				// console.log("require", url)
				require(url.indexOf("/src/") == 0? path.join(process.cwd(), url): path.join(process.cwd(), "usr/volcanos", url))
				cb(Volcanos.meta.cache[url]); break
		}
	}
	Volcanos.meta._main = function(main) { var res
		Volcanos({panels: [], plugin: []}, function(can) { can.require([main], function(can) { var msg = can.request()
			can._path = main, can.core.CallFunc(can.onimport._init, {can: can, msg: msg}), res = msg.Result()
		}) }); console.log(res); return
	}
} } catch (e) { console.log(e) }

_can_name = "./frame.js"
Volcanos("onappend", {
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
						line.push(lex.SP)
					}
					line.push(lex.SP)
				}
				list.push(line.join(""))
			}
			line = []; for (var i = 0; i < msg.append.length; i++) { var k = msg.append[i]
				line.push(value[k])
				for (var j = 0; j <= max[k]-value[k]; j++) {
					line.push(lex.SP)
				}
				line.push(lex.SP)
			}
			list.push(line.join(""))
		})
		console.log(list.join(lex.NL))
	},
	board: function(can, msg) {
		console.log(msg.Result())
	},
})

