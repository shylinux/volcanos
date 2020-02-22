Volcanos("onfigure", {help: "控件详情", list: [],
    date: {click: function(event, can, value, cmd, target) {if (can.date) {return}
        target.style.width = "120px"
        function set(now) {
            target.value = can.base.Time(now); 
            if (can.item.action == "auto") {
                can.run({});
            }
        }

        can.stick = false
        can.now = target.value? new Date(target.value): new Date();
        can.date = can.page.Append(can, document.body, [{view: ["date input", "fieldset"], style: {
            position: "absolute", left: event.clientX+"px", top: event.clientY+10+"px",
        }, onmouseleave: function(event) {
            if (can.stick) {can.stick = false; return}
            can.page.Remove(can, can.date); delete(can.date);
        }}]).last

        var action = can.page.Append(can, can.date, [{view: ["action"]}]).last
        var control = can.page.AppendAction(can, action, ["今天", "随机",
            ["hour"].concat(can.core.List(24)), ["minute"].concat(can.core.List(0, 60, 5)), ["second"].concat(can.core.List(0, 60, 5)), {view: ["", "br"]},
            "上一月", ["year"].concat(can.core.List(can.now.getFullYear() - 20, can.now.getFullYear() + 20)),
            ["month"].concat(can.core.List(1, 13)), "下一月", {view: ["", "br"]},
        ], function(event, value, cmd) {can.stick = true;
            switch (cmd) {
                case "year": can.now.setFullYear(parseInt(value)); show(can.now); return;
                case "month": can.now.setMonth(parseInt(value)-1); show(can.now); return;
                case "hour": can.now.setHours(parseInt(value)); show(can.now); set(can.now); return;
                case "minute": can.now.setMinutes(parseInt(value)); show(can.now); set(can.now); return;
                case "second": can.now.setSeconds(parseInt(value)); show(can.now); set(can.now); return;
            }

            switch (value) {
                case "今天": can.now = new Date(); show(can.now); set(can.now); break;
                case "随机": can.now.setDate((Math.random() * 100 - 50) + can.now.getDate()); show(can.now); set(can.now); break;
                case "关闭":can.page.Remove(can, can.date); delete(can.date);
                case "前一年": can.now.setFullYear(can.now.getFullYear()-1); show(can.now); break;
                case "后一年": can.now.setFullYear(can.now.getFullYear()+1); show(can.now); break;
                case "上一月": can.now.setMonth(can.now.getMonth()-1); show(can.now); break;
                case "下一月": can.now.setMonth(can.now.getMonth()+1); show(can.now); break;
            }
        })

        var table = can.page.Append(can, can.date, [{type: "table"}]).table
        function click(event) {
            var day = new Date(parseInt(event.target.dataset.date))
            can.now = day;
            set(can.now);
        }
        function show(now) {
            control.month.value = now.getMonth()+1;
            control.year.value = now.getFullYear();
            control.hour.value = now.getHours();
            control.minute.value = parseInt(now.getMinutes()/5)*5;
            control.second.value = parseInt(now.getSeconds()/5)*5;
            var meta = ["日", "一", "二", "三", "四", "五", "六"]
            can.page.Appends(can, table, [{type: "tr", list: can.core.List(meta, function(day) {return {text: [day, "th"]}})}])

            var one = new Date(now); one.setDate(1);
            var end = new Date(now); end.setMonth(now.getMonth()+1); end.setDate(1);
            var head = new Date(one); head.setDate(one.getDate()-one.getDay());
            var tail = new Date(end); tail.setDate(end.getDate()+7-end.getDay());

            var tr;
            function add(day, type) {
                if (day.getDay() == 0) {tr = can.page.Append(can, table, [{type: "tr"}]).tr}
                can.page.Append(can, tr, [{className: can.base.Time(day).split(" ")[0] == can.base.Time(now).split(" ")[0]? "now": type,
                    text: [day.getDate(), "td"], dataset: {date: day.getTime()}, click: click,
                }])
            }
            for (var day = new Date(head); day < one; day.setDate(day.getDate()+1)) {add(day, "last")}
            for (var day = new Date(one); day < end; day.setDate(day.getDate()+1)) {add(day, "main")}
            for (var day = new Date(end); end.getDay() != 0 && day < tail; day.setDate(day.getDate()+1)) {add(day, "next")}
        }

        show(can.now);
        set(can.now);
    }},
    _prepare: function(event, can, value, cmd, target) {if (can.figure) {return}
        can.figure = can.page.Append(can, document.body, [{view: ["input "+cmd, "fieldset"], style: {
            position: "absolute", left: "20px", top: event.clientY+10+"px",
        }, list: [{text: [cmd, "legend"]}, {view: ["action"]}, {view: ["output"]}], onmouseleave: function(event) {
            !can.figure.stick && can.onfigure._release(event, can, value, cmd, target)
        }}])
        return can.figure
    },
    _release: function(event, can, value, cmd, target) {
        can.page.Remove(can, can.figure.first); delete(can.figure);
    },
})
