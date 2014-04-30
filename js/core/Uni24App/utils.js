if (Uni24App) {
    Uni24App.utils = {
        part: [],
        addPart: function (name, obj) {
            this.part[name] = obj;
        },
        getPart: function (name, callBack) {
            if (this.part[name] === undefined) {
                $.getScript("js/" + name + ".js", function (data, textStatus, jqxhr) {
                    if (jqxhr.status === 200)
                        callBack(Uni24App.utils.part[name]);
                });
            } else {
                callBack(this.part[name]);
            }
        },
        uniSearch: function (entity, fx, rel, sVal, bizMod, rAll, filter) {
            Uni24App.utils.getPart("uniSearch", function (sClass) {
                var sx = new sClass(Uni24App);
                sx.SetFilter(filter);
                sx.Search(entity, null, { callBack: fx, relative: rel, modal: rel === undefined, sValue: sVal, bizModule: bizMod, retAll: rAll });
            });
        },
        dateAdd: function (dt, days) {
            var newdate = new Date();
            newdate.setDate(dt.getDate() + days);
            return newdate;
        }

    };
}