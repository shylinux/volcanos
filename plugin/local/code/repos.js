Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb, target) {
	can.page.ClassList.add(can, can._fields, "repos")
	can.page.Append(can, can._output, [{view: "info", list: [{text: "localhost:9020 / golang-story"}, {view: "button", list: [{text: "code"}, {text: "Issues"}, {text: "Pusll Requests"}, {text: "Wiki"}]}]}])
	can.page.Append(can, can._output, [{view: "commit", list: [{text: "56 次提交"}, {text: "3 个分支"}, {text: "5 个版本"}]}])
	can.page.Append(can, can._output, [{view: "url", list: [
		{text: "http://localhost:9020/x/golang-story.git"},
		{text: "https"}, {text: "ssh"},
		{text: "分支：master", className: "branch"},
	]}])
	var table = can.onappend.table(can, msg)
	can.onappend.board(can, msg.Option("file"))
	can.page.Select(can, can._output, "div.code", function(target) {
		can.page.style(can, target, "background-color", "#f0f0f0")
	})
	can.onappend.board(can, msg)
	can.page.style(can, table, html.WIDTH, can.ConfWidth()-200)
	can.page.Select(can, can._output, "div.code", function(target) {
		can.page.style(can, target, html.WIDTH, can.ConfWidth()-200)
	})
	can.page.SelectChild(can, can._output, "*", function(target) {
		can.page.style(can, target, html.WIDTH, can.ConfWidth()-200)
		can.page.style(can, target, html.MARGIN_LEFT, 100)
	})
}}, [""])

