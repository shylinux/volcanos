Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, conf, output, action, option, field) {
        can.user.carte = function(event, cb, src) {if (!cb || !cb.list || cb.list.length == 0) {return}
            output.innerHTML = "", can.page.Append(can, output, can.core.List(cb.list, function(item) {
                return {view: ["item"], list: [typeof item == "string"? {text: [item], click: function(event) {
                    typeof cb == "function" && cb(event, item, cb.meta)
                }}: {select: [item, function(event) {
                    typeof cb == "function" && cb(event, event.target.value, cb.meta)
                }], value: src[item[0]]||""}]}
            }))
            can.page.Select(can, output, "select", function(item) {
                item.value = src[item.className]||""
            }) 

            var pos = {display: "block", left: event.x, top: event.y}
            if (document.body.clientWidth - event.x < 60) {
                var pos = {display: "block", right: event.x, top: event.y}
            }
            pos.left += "px"; pos.top += "px";
            can.page.Modify(can, field, {style: pos})

            event.stopPropagation()
            event.preventDefault()
            can.Show()
        }
    },
})
Volcanos("onaction", {help: "组件交互", list: []})
Volcanos("onchoice", {help: "组件菜单", list: []})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

