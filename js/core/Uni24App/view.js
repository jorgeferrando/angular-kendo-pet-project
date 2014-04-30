function Uni24View() {
    return {
        name: "",
        label: "",
        containerName: "",
        index: 0,
        unSavedChanges: false,
        viewState: ko.observable(""),

        //Refresh(): updates the inputfields with matching model-values
        Refresh: function () {
            var me = this;
            var bunch = $('input', this.containerName);
            bunch.each(function (index) {
                var propname = bunch[index].id;
                if (propname) {
                    if (me.current.hasOwnProperty(propname)) {
                        if (propname.indexOf("date") >= 0) {
                            $(bunch[index]).datepicker("setDate", me.current[propname]);
                        } else {
                            bunch[index].value = me.current[propname] === undefined ? "" : me.current[propname];
                        }
                    } else
                        alert("Could not find " + propname + " in model!");
                }
            });
        },

        //Looks for date-inputs and reads them back into the model (if found)
        FetchDates: function () {
            var me = this;
            var bunch = $('input', this.containerName);
            bunch.each(function (index) {
                var propname = bunch[index].id;
                if (propname) {
                    if (me.current.hasOwnProperty(propname)) {
                        if (propname.indexOf("date") >= 0) {
                            me.current[propname] = $(bunch[index]).datepicker("getDate");
                        }
                    }
                }
            });
        },

        //FocusFirst() : sets focus to the first inputfield
        FocusFirst: function () {
            var inputs = $('input', this.containerName);
            if (inputs) {
                if (inputs.length > 0)
                    inputs[0].select();
            }
        },

        ViewStates: { Default: "", Saving: "Saving", Readonly: "Readonly" }
    };
}