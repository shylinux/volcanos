Volcanos("onappend", {help: "渲染引擎", list: [],
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

