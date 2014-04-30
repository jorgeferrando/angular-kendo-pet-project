define([], apiHelpers);

function apiHelpers() {

    var apiHelpers = {
        dataObjectify: dataObjectify,
        params: {
            extractParam: extractParam,
            extractPart: extractPart,
            getParamValue: getParamValue
        },
        callAfterRandomDelay: callAfterRandomDelay,
        dates: {
            netDate: netDate,
            moNetDate: moNetDate
        },
        randomInt: randomInt
    }
    return apiHelpers;

    // Private section

    function extractParam(params, index, charDivider) {
        var parts = params.split(charDivider || "|");
        if (parts.length > index) {
            return parts[index].toLowerCase();
        }
        return "";
    }

    function extractPart(item, keyword, nextPartDivider) {
        var part = "";
        if (typeof item !== "string") return "";
        var ix = item.indexOf(keyword);
        if (ix > 0) {
            part = item.substring(ix + keyword.length);
            ix = part.indexOf(nextPartDivider);
            if (ix > 0)
                part = part.substring(0, ix);
            if (part.substring(part.length - 1) === "&")
                part = part.substring(0, part.length - 1);
        }

        return part;
    }

    function getParamValue(apiParam, charSplit) {
        charSplit = charSplit || ":";
        if (typeof apiParam !== 'string') return "";
        var parts = apiParam.split(charSplit);
        if (parts.length > 1)
            return parts[1];
        return "";
    }

    function callAfterRandomDelay(handler) {
        var ticks = Math.floor((Math.random() * 300) + 1) + 50;
        setTimeout(function () { handler(ticks); }, ticks);
    }

    function netDate(day, month, year) {
        var a;
        if (arguments.length === 3)
            a = moment.utc([year, month - 1, day]);
        else {
            a = moment(new Date());
            a.add('days', day);
        }
        return "\/Date(" + a.valueOf() + "+0200\/";
    }
    function moNetDate(mo) {
        return "\/Date(" + mo.valueOf() + "+0200\/";
    }

    function randomInt(min, max) {
        return Math.floor((Math.random() * (max - min)) + 1) + min;
    }



    function dataObjectify(obj, itemName, filterChildTypes) {

        function isFilterType(name) {
            if (typeof filterChildTypes === "string") {
                var parts = filterChildTypes.split(',');
                for (var i = 0; i < parts.length; i++) {
                    if (parts[i].toLowerCase() === name.toLowerCase())
                        return true;
                }
            }
            return false;
        }

        //Isodate-helper
        function dateToYMD(date) {
            var d = date.getDate();
            var m = date.getMonth() + 1;
            var y = date.getFullYear();
            return '' + y + '' + (m <= 9 ? '0' + m : m) + '' + (d <= 9 ? '0' + d : d);
        }

        //Convert value to string (for servicecall)
        function xmlString(value) {
            var out = '' + value;
            if (out.indexOf('"') >= 0) return out.replace(/"/g, "'");
            if (out.length > 10240) return out.substring(out, 0, 10240);
            return out;
        }

        //Subfunction that adds properties
        function AddProperties(obj, wrapInColumn) {
            var xml = wrapInColumn ? '"column":[' : '';
            var nChilds = 0;
            var children = '';
            var itemCount = 0;
            for (var key in obj) {
                var colName = key;
                var colValue = obj[key];
                var colType = typeof colValue;
                var oktoadd = false;

                if (colValue !== null) {

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
                                    colValue = dateToYMD(colValue);
                                } else if (colValue !== null) {
                                    //Children?									
                                    if (colValue.hasOwnProperty("length")) {
                                        //Subnodes?
                                        if (!isFilterType(colName)) {
                                            nChilds = colValue.length;
                                            children += ',"children": { "@type":"' + colName + '", "record": ' + 
                                                (nChilds > 1 ? '[' : '') + ' {';
                                            for (var i = 0; i < colValue.length; i++) {
                                                oktoadd = true;
                                                //Empty flag?
                                                if (colValue[i].hasOwnProperty("IsEmpty"))
                                                    oktoadd = colValue[i].IsEmpty() === false;
                                                //Add subnode
                                                if (oktoadd)
                                                    children += AddProperties(colValue[i], true);
                                            }
                                            children += "} " + (nChilds > 1 ? "]" : "") + " }";
                                        }
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
                            itemCount++;
                            if (itemCount > 1) xml += ",";
                            xml += '{ "@name": "' + colName + '",';
                            xml += '"#text":"' + xmlString(colValue) + '"';
                            xml += '}';
                        }
                    }
                }
            }
            if (wrapInColumn) {
                xml += "]" + children;
            } else {
                xml += children;
            }
            return xml;
        }

        //Main object wrapping
        var js = '{"dataobject": { "@type":"' + itemName + '",';
        js += '"record": {';
        js += AddProperties(obj, true);
        js += '} } }';
        return js;

    }


}