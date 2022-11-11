Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb, target) {
		can.page.ClassList.add(can, target, "form")
		msg.Push("type", "text")
		msg.Push("name", "name")
		msg.Push("value", "harveyshao")
		msg.Push("action", "key")

		msg.Push("type", "text")
		msg.Push("name", "age")
		msg.Push("value", "18")
		msg.Push("action", "")

		msg.Push("type", "select")
		msg.Push("name", "male")
		msg.Push("value", "male,female")
		msg.Push("action", "")

		msg.Push("type", "textarea")
		msg.Push("name", "intro")
		msg.Push("value", "program")
		msg.Push("action", "")

		msg.Push("type", "button")
		msg.Push("name", "submit")
		msg.Push("value", "提交")
		msg.Push("action", "")

		var action = ""; msg.Table(function(value, index, array) {
			switch (value.type) {
				case html.BUTTON: action = action||value.name
					can.page.Append(can, target, [{view: "item", list: [
						{view: ["input"], list: [{type: html.INPUT, style: {width: (can.ConfWidth()-90)/2}, data: {type: value.type, value: value.value}, onclick: function(event) {
							var args = [ctx.ACTION, action]
							can.page.Select(can, target, ".args", function(item) { args.push(item.name, item.value)})
							can.run(event, args)
						}}]},
					]}])
					break
				case html.SELECT:
					can.page.Append(can, target, [{view: "item", list: [
						{view: ["label"], list: [{text: value.name}]},
						{view: ["input"], list: [{type: html.SELECT, className: "args", style: {width: can.ConfWidth()-100},
							data: value, list: can.core.List(can.core.Split(value.value), function(v) { return {type: html.OPTION, name: v, value: v, inner: v} }) }]},
					]}])
					break
				case html.TEXTAREA:
					can.page.Append(can, target, [{view: "item", list: [
						{view: ["label"], list: [{text: value.name}]},
						{view: ["input"], list: [{type: html.TEXTAREA, className: "args", style: {width: can.ConfWidth()-100}, data: value}]},
					]}])
					break
				default:
					can.page.Append(can, target, [{view: "item", list: [
						{view: ["label"], list: [{text: value.name}]},
						{view: ["input"], list: [{type: "input", className: "args", style: {width: can.ConfWidth()-100}, data: value}]},
					]}])
			}
		})
	},
}, [""])
