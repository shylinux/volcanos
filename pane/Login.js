Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, output, action, option, field) {
    can.user.carte = function(event, cb) {if (!cb || !cb.list || cb.list.length == 0) {return}
        output.innerHTML = "", can.page.AppendItem(can, output, can.core.List(cb.list, function(item) {
            return {key: item};
        }), false, function(event, line, item) {
            typeof cb == "function" && cb(event, line.key, cb.meta)
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
}})
Volcanos("onaction", {help: "组件交互", list: []})
Volcanos("onchoice", {help: "组件菜单", list: []})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

