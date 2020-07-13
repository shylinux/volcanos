Volcanos("heart", {help: "心形", list: [],
    data: {name: "path",
        size: {},
        x: function(event, can, value, cmd, target) {
            var tt = JSON.parse(target.Value("tt")||'{"tx":0, "ty":0}')
            if (value != undefined) {
                tt.tx = value-target.Val("xx")
                target.Value("tt", JSON.stringify(tt))
                target.Value("transform", "translate("+tt.tx+","+tt.ty+")")
            }
            return target.Val("xx")+tt.tx
        },
        y: function(event, can, value, cmd, target) {
            var tt = JSON.parse(target.Value("tt")||'{"tx":0, "ty":0}')
            if (value != undefined) {
                tt.ty = value-target.Val("yy")
                target.Value("tt", JSON.stringify(tt))
                target.Value("transform", "translate("+tt.tx+","+tt.ty+")")
            }
            return target.Val("yy")+tt.ty
        },
        copy: ["d", "cmd", "name", "meta", "tt", "xx", "yy", "fill"],
    }, // <circle cx="25" cy="75" r="20"/>
    draw: function(event, can, point) {if (point.length < 2) {return}

        var p0 = point[0], p1 = point[1], p2 = point[2];
        pl = {x: 2*p0.x - p1.x, y:2*p0.y-p1.y}
        var r0 = Math.sqrt(Math.pow(p0.x - p1.x, 2), Math.pow(p0.y - p1.y, 2)) / 2
        var d = [
                "M", pl.x, pl.y,
                "A", r0, r0, 0, 0, 0, p0.x, p0.y,
                "A", r0, r0, 0, 0, 0, p1.x, p1.y,
            ]

        if (point.length == 3) {
            var r1 = Math.sqrt(Math.pow(p2.x - p1.x, 2), Math.pow(p2.y - p1.y, 2))
            d = d.concat([
                "A", r1, r1, 180, 0, 0, p2.x, p2.y,
                "A", r1, r1, 180, 0, 0, pl.x, pl.y,
            ])
        }

        var data = {
            cmd: "pwd",
            name: "heart", d: d.join(" "),
            meta: JSON.stringify(point),
            tt: JSON.stringify({tx: 0, ty: 0}),
            xx: p0.x, yy:p1.y,
        }

        // can._tmp && can.page.Remove(can, can._tmp) && delete(can._tmp)
        // can._tmp = can.onaction.push(event, can, data, "path", can.group||can.svg)
        // event.type == "click" && point.length == 3 && (can.point = [], can._tmp = null);
        return event.type == "click" && point.length == 3 && (can.point = []), data;
    },
    text: function(event, can, data, target) {
        data.x = target.Val("cx")
        data.y = target.Val("cy")
        return data
    },
    show: function(event, can, value, target) {
        return ": (" + value.Val("cx") + "," + value.Val("cy") + ")"
            + " > (" + parseInt(value.Val("r")) + ")"
    },
    // run: function(event, can, value, cmd, target) {
    //     event.type == "click" && can.Run(event, ["action", "执行", target.Value("cmd")], function(msg) {
    //         can.user.toast(msg.Result())
    //     }, true)
    // },
})

