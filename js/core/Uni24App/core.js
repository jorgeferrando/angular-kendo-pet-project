Uni24App = {

    //Models
    models: [],
    AddModel: function (name, model) {
        this.models[name] = model;
    },
    GetModel: function (name) {
        return this.models[name];
    },
    Factory: function (name) {
        return new this.models[name]();
    },
    //CheckSave
    CheckSave: function (e) {
        if (this.views === undefined) return false;
        if (this.views.HasUnsavedChanges())
            return "Vil du forlate denne siden? Endringer som ikke er lagret vil gå tapt!";
    },
    //Module helpers
    GetModule: function (name, callBack) {

    },
    ShowModule: function (name, label, altName, loadHidden, OnReadyCallback) {

    },
    RunReport: function (name) {

    }
};