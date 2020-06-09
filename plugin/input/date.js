Volcanos("onfigure", {help: "控件详情", list: [],
    date: {onclick: function(event, can, item, target) {
        can._figure && can.page.Remove(can, can._figure.fieldset)
        can._figure = can.onappend.field(can, can._target, "input date", {})
        // 设置输入
        target.style.width = "120px"; function set(now) {
            target.value = can.base.Time(now); 
            item.action == "auto" && can.run({});
        }

        // 添加插件
        var figure = can._figure
        figure.table = can.page.Append(can, figure.output, [{type: "table"}]).first
        can.page.Modify(can, figure.fieldset, {style: {top: target.offsetTop+20, left: target.offsetLeft}})
        can.page.Remove(can, figure.legend)

        // 添加控件
        var now = target.value? new Date(target.value): new Date();
        var control = can.page.AppendAction(can, figure.action, ["今天", "随机",
            ["hour"].concat(can.core.List(24)), ["minute"].concat(can.core.List(0, 60, 5)), ["second"].concat(can.core.List(0, 60, 5)), {view: ["", "br"]},
            "关闭", {type: "hr", style: {margin: 0}},
            "上一月", ["year"].concat(can.core.List(now.getFullYear() - 20, now.getFullYear() + 20)),
            ["month"].concat(can.core.List(1, 13)), "下一月", {view: ["", "br"]},
        ], function(event, value, cmd) {can.stick = true;
            // 设置时间
            switch (cmd) {
                case "year": now.setFullYear(parseInt(value)); show(now); return;
                case "month": now.setMonth(parseInt(value)-1); show(now); return;
                case "hour": now.setHours(parseInt(value)); set(show(now)); return;
                case "minute": now.setMinutes(parseInt(value)); set(show(now)); return;
                case "second": now.setSeconds(parseInt(value)); set(show(now)); return;
            }

            // 设置日期
            switch (value) {
                case "关闭": can.page.Remove(can, figure.fieldset); break;
                case "今天": now = new Date(); set(show(now)); break;
                case "随机": now.setDate((Math.random() * 100 - 50) + now.getDate()); set(show(now)); break;
                case "关闭": can.page.Remove(can, figure.first); delete(can.figure);
                case "前一年": now.setFullYear(now.getFullYear()-1); show(now); break;
                case "后一年": now.setFullYear(now.getFullYear()+1); show(now); break;
                case "上一月": now.setMonth(now.getMonth()-1); show(now); break;
                case "下一月": now.setMonth(now.getMonth()+1); show(now); break;
            }
        })

        function show(now) {
            // 设置控件
            control.month.value = now.getMonth()+1;
            control.year.value = now.getFullYear();
            control.hour.value = now.getHours();
            control.minute.value = parseInt(now.getMinutes()/5)*5;
            control.second.value = parseInt(now.getSeconds()/5)*5;

            // 设置组件
            can.page.Appends(can, figure.table, [{type: "tr", list: can.core.List(["日", "一", "二", "三", "四", "五", "六"], function(day) {return {text: [day, "th"]}})}])
            var tr; function add(day, type) {if (day.getDay() == 0) {tr = can.page.Append(can, figure.table, [{type: "tr"}]).tr}
                can.page.Append(can, tr, [{text: [day.getDate(), "td", can.base.Time(day).split(" ")[0] == can.base.Time(now).split(" ")[0]? "select": type],
                    dataset: {date: day.getTime()}, click: function(event) {set(now = new Date(parseInt(event.target.dataset.date)))},
                }])
            }

            // 时间区间
            var one = new Date(now); one.setDate(1);
            var end = new Date(now); end.setMonth(now.getMonth()+1); end.setDate(1);
            var head = new Date(one); head.setDate(one.getDate()-one.getDay());
            var tail = new Date(end); tail.setDate(end.getDate()+7-end.getDay());

            // 时间序列
            for (var day = new Date(head); day < one; day.setDate(day.getDate()+1)) {add(day, "last")}
            for (var day = new Date(one); day < end; day.setDate(day.getDate()+1)) {add(day, "main")}
            for (var day = new Date(end); end.getDay() != 0 && day < tail; day.setDate(day.getDate()+1)) {add(day, "next")}
            return now
        }; set(show(now));
    }},
}, ["/plugin/input/date.css"])
