if (Uni24App) {
    Uni24App.service = {
        servicepost: function (msg, handler) {
            Uni24App.session.SetBusy(true);
            $.ajax({
                url: "json.aspx",
                type: "post",
                data: msg,
                contentType: "wolf/xml",
                success: function (result) {
                    Uni24App.session.SetBusy(false);
                    if (result) {
                        //Exception?
                        if (msg.indexOf("<Method>Logout") < 0) {
                            if (result.hasOwnProperty("ClassName")) {
                                if (result.ClassName === "System.Exception") {
                                    //Change state (open reconnect dialog)
                                    Uni24App.session.disconnectedmsg = msg;
                                    Uni24App.session.disconnectedhandler = handler;
                                    Uni24App.session.StateChanged("disconnected");
                                    return;
                                }
                            }
                        }
                    }
                    //Normal callback
                    handler(result);
                },
                statusCode: {
                    404: function () {
                        Uni24App.session.SetBusy(false);
                        alert("Service down, please try later!");
                    }
                }
            });
        },
        //Builds a servicemessage
        buildmsg: function (method) {
            var me = this.buildmsg;
            me.chfix = function (str) {
                var out = "" + str;
                if (out.indexOf("&") >= 0)
                    out = out.replace(/&/g, "&amp;");
                if (out.length === 0)
                    out = "?";
                return out;
            };

            var msg = "<?xml version='1.0' encoding='utf-8'?><WOLF version='1.0'><Request><Target>Uni24Orb.Uni24OrbMain</Target><Method>" + method + "</Method>";
            msg += "<Arguments>";
            for (var i = 1; i < arguments.length; i++)
                msg += "<String>" + me.chfix(arguments[i]) + "</String>";
            msg += "</Arguments></Request></WOLF>";
            return msg;
        },

        // Converts an object into an xml-dataobject
        // Second parameter = Name of root object
        serializeToXmlDataobject: function (obj) {
            var me = this.serializeToXmlDataobject;

            //Isodate-helper
            me.dateToYMD = function (date) {
                var d = date.getDate();
                var m = date.getMonth() + 1;
                var y = date.getFullYear();
                return '' + y + '' + (m <= 9 ? '0' + m : m) + '' + (d <= 9 ? '0' + d : d);
            };

            //Convert value to string (for servicecall)
            me.xmlString = function (value) {
                var out = '' + value;
                if (out.indexOf('"') >= 0) return out.replace(/"/g, "'");
                if (out.length > 10240) return out.substring(out, 0, 10240);
                return out;
            };

            //Subfunction that adds properties
            me.AddProperties = function (obj, wrapInRecord) {
                var xml = wrapInRecord ? "<record>" : "";
                for (var key in obj) {
                    var colName = key;
                    var colValue = obj[key];
                    var colType = typeof colValue;
                    var oktoadd = false;

                    //Observable?
                    if (colType === "function") {
                        if (ko.isObservable(colValue)) {
                            colValue = colValue();
                            colType = typeof colValue;
                        }
                    }

                    //Lets not add "tmp" columns (prefixed with tmp)
                    if (colName.indexOf("tmp") !== 0) {
                        switch (colType) {
                            case "number":
                            case "string":
                            case "double":
                                oktoadd = true;
                                break;
                            case "function":
                                break;
                            case "object":
                                if (colName.indexOf("date") >= 0) {
                                    oktoadd = true;
                                    colValue = me.dateToYMD(colValue);
                                } else {
                                    //Children?									
                                    if (colValue.hasOwnProperty("length")) {
                                        //Subnodes?
                                        xml += "<children type='" + colName + "'>";
                                        for (var i = 0; i < colValue.length; i++) {
                                            oktoadd = true;
                                            //Empty flag?
                                            if (colValue[i].hasOwnProperty("IsEmpty"))
                                                oktoadd = colValue[i].IsEmpty() === false;
                                            //Add subnode
                                            if (oktoadd)
                                                xml += me.AddProperties(colValue[i], true);
                                        }
                                        xml += "</children>";
                                        oktoadd = false;
                                    }
                                }
                                break;
                            case "boolean":
                                colValue = colValue ? "true" : "false";
                                oktoadd = true;
                                break;
                            case "undefined":
                                break;
                            default:
                                alert("Invalid type:" + colType + " for " + colName);
                        }
                        if (oktoadd) {
                            xml += "<column name='" + colName + "'>";
                            xml += me.xmlString(colValue);
                            xml += "</column>";
                        }
                    }
                }
                if (wrapInRecord)
                    xml += "</record>";
                return xml;
            };

            //Main object wrapping
            var xml = "<dataobject type='" + arguments[1] + "'>";
            xml += "<record>";
            xml += me.AddProperties(obj, false);
            xml += "</record></dataobject>";
            return xml;
        },

        // Converts a dataobject to a "flatter" javascript object
        //  Note! if intoObj is supplied the values will be copied into the given object.
        //	It is also possible to supply mappings for child-array objects by supplying name and model as pairs of arguments.
        //  sample: normalizeDataobject( obj, invoice, "Lines", Uni24App.GetModel("Invoiceline") );
        normalizeDataobject: function (obj, intoObj) {
            var me = this.normalizeDataobject;
            var coltype = "";

            //Number-casting
            me.SFCurr = function (value) {
                var tmp;
                if (value === undefined) return 0;
                if (typeof value === "int") return value;
                if (typeof value === "float") return value;
                if (typeof value === "string") {
                    if (value.indexOf(",") >= 0)
                        tmp = parseFloat(value.replace(/,/g, "."));
                    else
                        tmp = parseFloat(value);
                } else
                    tmp = parseFloat(value);
                if (isNaN(tmp)) return 0;
                return tmp;
            };

            //Convert iso-date to date (or blank)
            me.FromIsoDate = function (value) {
                if (value.length === 8) {
                    var yr = parseFloat(value.substr(0, 4));
                    var md = parseFloat(value.substr(4, 2));
                    var dy = parseFloat(value.substr(6, 2));
                    return new Date(yr, md - 1, dy);
                }
                return '';
            };

            //Typecasting
            me.TypeCast = function (dst, value) {
                var coltype = ko.isObservable(dst) ? typeof dst() : typeof dst;
                switch (coltype) {
                    case "string":
                        return value;
                    case "number":
                        return me.SFCurr(value);
                    case "boolean":
                        return ("" + value).toLowerCase() === "true";
                    case "object":
                        var isdate = false;
                        if (ko.isObservable(dst)) {
                            if (dst().getDate) isdate = true;
                        } else {
                            if (dst.getDate) isdate = true;
                        }
                        if (isdate) {
                            return me.FromIsoDate(value);
                        }
                        return value;
                }
            };

            //Helper function sets a column value and converts any known types
            me.SetObjectValue = function (dst, colname, setval) {
                //object + hasOwnProperty("getMonth") = date
                if (ko.isObservable(dst[colname])) {
                    coltype = typeof dst[colname]();
                    dst[colname](me.TypeCast(dst[colname], setval));
                    //console.debug(coltype + ".(" + colname + ") = " + dst[colname]());
                } else {
                    coltype = typeof dst[colname];
                    dst[colname] = me.TypeCast(dst[colname], setval);
                    //console.debug(coltype + "." + colname + " = " + dst[colname]);
                }
            };

            //Helper function that extracts column values
            me.AddColumns = function (src, dst, lcaseNames) {
                if (src.hasOwnProperty("column")) {
                    for (var col = 0; col < src.column.length; col++) {
                        var colname = src.column[col]["@name"];
                        if (lcaseNames) colname = colname.toLowerCase();
                        var setval = src.column[col]["#text"];
                        if (dst[colname] === undefined) {
                            dst[colname] = setval;
                        } else {
                            me.SetObjectValue(dst, colname, setval);
                        }
                    }
                }
            };

            //Helper function that extracts data from a record object
            me.AddRecord = function (rec, intoObj, mappings) {
                if (rec === undefined)
                    return {};

                //Extract columns from record
                var x = {};
                var existObject = false;
                if (intoObj != undefined) {
                    x = intoObj;
                    existObject = true;
                }
                me.AddColumns(rec, x, existObject);

                //Children?
                if (rec['children']) {

                    //List or not?
                    var childList = rec['children'];
                    if (!$.isArray(childList))
                        childList = [childList];

                    //Model?
                    var model;
                    var modelname = "";

                    for (var ic = 0; ic < childList.length; ic++) {
                        var pn = childList[ic]["@type"]; //Get name of array
                        if (x[pn] === undefined) x[pn] = []; //Autocreate array (if missing)

                        //Model?
                        if (mappings !== undefined) {
                            if ((model === undefined || modelname !== pn) && (mappings.length > 0)) {
                                for (var im = 2; im < mappings.length; im = im + 2) {
                                    if (mappings[im] === pn) {
                                        model = mappings[im + 1];
                                        modelname = pn;
                                        break;
                                    }
                                }
                            }
                        }

                        var records = childList[ic].record;
                        if (!$.isArray(records))
                            records = [records];

                        var orgLength = x[pn].length;
                        for (var ri = 0; ri < records.length; ri++) {
                            var instance = model == undefined ? null : new model();
                            if (ko.isObservable(x[pn]))
                                x[pn].push(me.AddRecord(records[ri], instance, mappings));
                            else {
                                if ((orgLength > 0) && (ri === 0)) //Do we already have one item?
                                    me.AddRecord(records[ri], x[pn][0], mappings);
                                else
                                    x[pn].push(me.AddRecord(records[ri], instance, mappings));
                            }
                        }
                    }
                }

                return x;
            };

            //Copy mappings
            var mappings = [];
            for (var i = 2; i < arguments.length; i++)
                mappings[i] = arguments[i];

            //Extract
            return me.AddRecord(obj.record, intoObj, mappings);
        }

    };
}