Volcanos(chat.ONIMPORT, {
	_init: function(can, msg, cb) { can.page.requireModules(can, can.Conf("modules"), function() {
		var target = can.page.Appends(can, can._output, [{type: html.TEXTAREA}])._target
		can.page.style(can, can._output, html.MAX_HEIGHT, "")
		tinymce.init({target: target, height: can.ConfHeight(), // menubar: false,
			content_style: "body#tinymce { background:transparent; color:silver; }",
			toolbar: [
				[
					"code undo redo cut copy paste",
					"backcolor forecolor bold italic underline strikethrough subscript superscript",
					"alignleft aligncenter alignright alignjustify outdent indent",
					"bullist numlist table image media link charmap",
					"blockquote removeformat hr pagebreak anchor insertdatetime",
					"fullscreen wordcount preview print help",
				].join("|"),
			],
			plugins: [
				"code",
				"lists",
				"advlist",
				"table",
				"image",
				"media",
				"link",
				"insertdatetime",
				"charmap",
				"anchor",
				"pagebreak",

				"fullscreen",
				"wordcount",
				"preview",
				"help",

				"save",
				// "autosave",
				"codesample",
				"directionality",
				"emoticons",
				"importcss",
				"font_size",
				"autolink",
				"nonbreaking",
				"searchreplace",
				"visualblocks",
				"visualchars",
			].join(" ")
		}).then(function(list) { can.ui.editor = list[0], can.ui.editor.setContent(msg.Result()), cb && cb(msg) })
	}) },
	content: function(can, text) { return can.ui.editor.setContent(text) },
}, [""])
Volcanos(chat.ONEXPORT, {
	content: function(can) { return can.ui.editor.getContent() },
})
Volcanos(chat.ONPLUGIN, {
	tinymce: shy("富文本", {
		save: shy(function(can, msg) { can.user.toast(can, msg.Option(nfs.CONTENT)) }),
	}, [nfs.PATH, ice.LIST, nfs.SAVE], function(can, msg, meta) {
		msg.Display(meta._path)
	}),
})
