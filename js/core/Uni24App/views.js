if (Uni24App) {
    Uni24App.views = {
        views: [],
        TabsCreated: false,
        //Exists
        Exist: function (name) {
            var tmp = this.views[name];
            if (tmp) {
                return tmp.index;
            }
        },
        Get: function (name) {
            if (this.views.hasOwnProperty(name)) {
                return this.views[name];
            }
            for (var key in this.views) {
                if (key.toLowerCase() === name.toLowerCase()) {
                    return this.views[key];
                }
            }
        },
        Add: function (name, label, containername) {
            var v = new Uni24View();
            v.name = name;
            v.label = label;
            v.containerName = containername;
            Uni24App.views.views[name] = v;
        }
    };
}