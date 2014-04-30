(function () {

    "use strict";

    var mockData = {};
    var helpers = null;
    var models = null;
    var defaultEndpoint = "RMFinance.RMFinanceLib.RMFinance";
    var accountingEndpoint = "RMAccounting.RMAccountingLib.RMAccounting";

    Uni24App.service.mockapi = proxyWrapper;
    return;

    //Lets require some helper libraries before we handle any servicecalls
    function proxyWrapper(args, handler) {
        require(["js/mock/apiHelpers.js", "js/mock/models/invoice.js"
            , "js/mock/models/dimension.js", "js/mock/models/assignee.js"
            , "js/mock/models/assignment.js"],
            function (hlp, inv, dim, asgn, asgmt) {

                if (helpers === null) {
                    helpers = hlp;
                    models = {
                        Invoice: inv.Invoice,
                        Dimension: dim.Dimension,
                        Assignee: asgn.Assignee,
                        Assignment: asgmt.Assignment
                    };
                    initMockData(mockData);
                    testMockData(mockData);
                }

                proxyHandler(args, handler);
            });
    }

    //Actual RMFinance api mockings
    function proxyHandler(args, handler, noDelay) {
        var result = null;
        var method = args[1].toLowerCase();
        var arg1 = args.length > 2 ? args[2] : "";
        switch (method) {
            case "getlist":
                warnIfNotEqual(args[1], "GetList");
                warnIfNotEqual(args[0], defaultEndpoint, args[1]);
                result = getlist(arg1);
                //toastr.warning("GetList is deprecated. Please use GetMylist instead!");
                break;
            case "getfinancedocuments":
                warnIfNotEqual(args[1], "GetFinancedocuments");
                warnIfNotEqual(args[0], defaultEndpoint, args[1]);
                result = getFinanceDocuments(arg1);
                break;
            case "queryfortable":
                result = queryForTableHandler(args);
                break;
            case "getobject":
                warnIfNotEqual(args[1], "GetObject");
                warnIfNotEqual(args[0], defaultEndpoint, args[1]);
                result = getObject(arg1);
                break;
            case "getmylist":
                warnIfNotEqual(args[1], "GetMylist");
                warnIfNotEqual(args[0], defaultEndpoint, args[1]);
                result = wrapInServiceresponse(method, "rmfinance", getmylist(args));
                break;
            case "getassigneelist":
                warnIfNotEqual(args[1], "GetAssigneelist");
                warnIfNotEqual(args[0], defaultEndpoint, args[1]);
                result = wrapInServiceresponse(method, "rmfinance", getassigneelist());
                break;
            case "assigninvoice":
                warnIfNotEqual(args[1], "AssignInvoice");
                warnIfNotEqual(args[0], defaultEndpoint, args[1]);
                result = wrapInServiceresponse(method, "rmfinance", assignInvoice(pValue(arg1, 0, "int"), pValue(arg1, 1, "int")));
                break;
            case "acceptinvoice":
                warnIfNotEqual(args[1], "AcceptInvoice");
                warnIfNotEqual(args[0], defaultEndpoint, args[1]);
                result = wrapInServiceresponse(method, "rmfinance", acceptinvoice(arg1));
                break;
            case "acceptinvoicewithcomment":
                warnIfNotEqual(args[1], "AcceptInvoiceWithComment");
                warnIfNotEqual(args[0], defaultEndpoint, args[1]);
                result = wrapInServiceresponse(method, "rmfinance", acceptinvoicewithcomment(arg1));
                break;
            case "declineinvoice":
                warnIfNotEqual(args[1], "DeclineInvoice");
                warnIfNotEqual(args[0], defaultEndpoint, args[1]);
                result = wrapInServiceresponse(method, "rmfinance", declineInvoice(arg1));
                break;
            case "savesupplierinvoice":
                warnIfNotEqual(args[1], "SaveSupplierInvoice");
                warnIfNotEqual(args[0], defaultEndpoint, args[1]);
                result = wrapInServiceresponse(method, "rmfinance", saveSupplierInvoice(arg1));
                break;
            case "getvatcodes":
                warnIfNotEqual(args[1], "GetVatCodes");
                warnIfNotEqual(args[0], accountingEndpoint, args[1]);
                result = wrapInServiceresponse(method, "RMAccounting", getvatcodes());
                break;
            default:
                console.log("proxy(" + args[1] + "," + args[2] + ")");
                break;
        }
        if (result !== null) {

            if (noDelay === true) {
                handler(result);
                return;
            }

            helpers.callAfterRandomDelay(function (ticks) {
                //console.log(ticks + "ms : ApiCall=> " + args[1] + "(" + helpers.params.extractParam(arg1, 0) + ")");
                console.log(ticks + "ms : ApiCall=> " + args[1] + "( '" + arg1 + "' )");
                handler(result);
            });
        }
    }

    function listArr(arr) {
        var ret = "";
        for (var i = 0; i < arr.length; i++)
            ret += (i > 0 ? "," : "") + arr[i];
        return ret;
    }

    function queryForTableHandler(args) {
        warnIfNotEqual(args[1], "QueryForTable");
        var params = args[2];
        var items = [];
        var register = helpers.params.extractParam(params, 0);
        var filter = helpers.params.extractPart(helpers.params.getParamValue(helpers.params.extractParam(params, 1)), "$filter=", "$");
        switch (register) {
            case "string:dimension":
                if (args[0] !== defaultEndpoint)
                    warnIfNotEqual(args[0], accountingEndpoint, args[1]);
                items = getDimensions(filter);
                break;
            case "string:supplierinvoice":
                warnIfNotEqual(args[0], defaultEndpoint, args[1]);
                items = queryForInvoice(filter);
                break;
            case "string:konto":
                warnIfNotEqual(args[0], accountingEndpoint, args[1]);
                items = getAccounts(filter);
                break;
            default:
                return null;
        }

        return wrapInServiceresponse("QueryForTable", "RMSales", items);

        //return { 'Method': 'QueryForTable', 'ObjectName': 'RMSales', 'Success': true, 'ErrorMessage': '', 'ErrorCode': 0, 'Data': items };
    }

    function wrapInServiceresponse(method, objectname, result, failureMessage) {
        var bSuccess = true;
        if (failureMessage !== undefined) {
            if (typeof failureMessage === "String") {
                if (failureMessage.length > 0) bSuccess = false;
            }
        }
        return { 'Method': method, 'ObjectName': objectname, 'Success': bSuccess, 'ErrorMessage': failureMessage || '', 'ErrorCode': 0, 'Data': result };
    }

    function getObject(params) {
        var register = helpers.params.extractParam(params, 0);
        switch (register) {
            case "string:supplierinvoice":
                return getInvoice(helpers.params.extractParam(params, 1));
            default:
                return null;
        }
    }

    function getlist(filter) {
        if (filter !== "string:")
            return flattenInvoiceList(mockData.invoices);
        var list = [];
        for (var i = 0; i < mockData.invoices.length; i++)
            if (mockData.invoices[i].Status < 4)
                list.push(mockData.invoices[i]);
        return flattenInvoiceList(list);
    }

    function getmylist(args) {
        var list = [], hasArgs = args.length === 3, invoice, assignee = firstAssignee();

        if (hasArgs) {
            if (args[2] == undefined) hasArgs = false;
            if (args[2] == "") hasArgs = false;
            if (args[2] == null) hasArgs = false;
        }

        if (args.length != 2 && args.length != 3) {
            warn("Invalid arguments to GetMylist");
            return null;
        }

        function isValid(item) {
            if (!isAssignedTo(item.ID, assignee.ID))
                return false;
            if (hasArgs)
                return true;
            return (item.Status < mockData.status.ACCEPTED);
        }

        for (var i = 0; i < mockData.invoices.length; i++) {
            invoice = mockData.invoices[i];
            if (isValid(invoice))
                list.push(mockData.invoices[i]);
        }
        return flattenInvoiceList(list, true);
    }

    function flattenInvoiceList(items, includeAssignmentID) {
        var list = [];
        for (var i = 0; i < items.length; i++) {
            list.push(items[i].getFlatCopy(includeAssignmentID));
        }
        return list;
    }

    function getassigneelist() {
        return mockData.assignees;
    }

    function assignInvoice(invoiceid, assigneeid) {
        var invoice = findInvoice(invoiceid);
        if (invoice != null) {
            var id = randomId();
            var assignment = new models.Assignment(id, assigneeid, invoice.ID);
            invoice.Status = mockData.status.ASSIGNED;
            //Remove existing assignment
            removeItemWithID(mockData.assignments, invoice.AssignmentID);
            //Add new assignment
            invoice.AssignmentID = assignment.ID;
            mockData.assignments.push(assignment);
            return true;
        }
        return false;
    }

    function isAssignedTo(invoiceId, assigneeId) {
        for (var i = 0; i < mockData.assignments.length; i++) {
            if ((mockData.assignments[i].FK_ID === invoiceId) &&
                (mockData.assignments[i].AssigneeID === assigneeId))
                return true;
        }
        return false;
    }

    function randomId() {
        return parseInt(Math.random() * 9999999) + 1
    }

    function removeItemWithID(arr, id) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].ID == id) {
                arr.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    function getItemWithId(arr, id) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].ID == id) {
                return arr[i];
            }
        }
        return null;
    }

    function getItemWithValue(arr, prop, value) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][prop] == value) {
                return arr[i];
            }
        }
        return null;
    }


    function pValue(params, index, prefixedtype, defaultValue) {
        var typ, value, item = helpers.params.extractParam(params, index, "|");
        if (typeof item === "string") {
            typ = helpers.params.extractParam(item, 0, ":");
            value = helpers.params.extractParam(item, 1, ":");
            if (typ === prefixedtype)
                return value;
        }
        return defaultValue || "";
    }

    function acceptinvoice(params) {
        var assignmentid = pValue(params, 0, "int");
        var asg = getItemWithId(mockData.assignments, assignmentid);
        if (asg == null) return false;
        var invoice = findInvoice(asg.FK_ID);
        if (invoice != null) {
            //removeItemWithID(mockData.assignments, invoice.AssignmentID);
            invoice.Status = mockData.status.ACCEPTED;
            return true;
        }
        return false;
    }

    function acceptinvoicewithcomment(params) {
        var assignmentid = pValue(params, 0, "int");
        var comment = pValue(params, 1, "string");
        if (comment.length === 0) return false;
        var asg = getItemWithId(mockData.assignments, assignmentid);
        if (asg == null) return false;
        var invoice = findInvoice(asg.FK_ID);
        if (invoice != null) {
            invoice.Status = mockData.status.ACCEPTED;
            if (typeof comment === "string")
                invoice.comment = invoice.comment + "user: " + comment;

            return true;
        }
        return false;
    }


    function declineInvoice(params) {
        var assignmentid = pValue(params, 0, "int");
        var comment = pValue(params, 1, "string");
        if (comment.length === 0) return false;
        var asg = getItemWithId(mockData.assignments, assignmentid);
        if (asg == null) return false;
        var invoice = findInvoice(asg.FK_ID);
        if (invoice != null) {
            removeItemWithID(mockData.assignments, invoice.AssignmentID);
            invoice.Status = mockData.status.REJECTED;
            return true;
        }
        return false;
    }

    function saveSupplierInvoice(xmlInvoice) {
        var param = helpers.params.extractParam(xmlInvoice, 1, ":");
        param = param.replace('"', '');
        return true;
    }

    function getvatcodes() {
        return [
            { "Code": 0, "Name": "Ingen mva", "VatPercentage": 0.0, "SalesAccountType": 0 },
            { "Code": 1, "Name": "Inngående mva, høy sats (kjøp)", "VatPercentage": 25.00, "SalesAccountType": 0 },
            { "Code": 3, "Name": "Utgående mva, høy sats (salg)", "VatPercentage": 25.00, "SalesAccountType": 1 },
            { "Code": 5, "Name": "Avgiftsfritt salg, innenfor avgiftsområdet", "VatPercentage": 0.0, "SalesAccountType": 2 },
            { "Code": 6, "Name": "Avvikende inng. mva sats", "VatPercentage": 0.0, "SalesAccountType": 0 },
            { "Code": 8, "Name": "Avvikende utg. mva sats", "VatPercentage": 0.0, "SalesAccountType": 0 },
            { "Code": 10, "Name": "Avgiftsfritt salg, utenfor avgiftsområdet", "VatPercentage": 0.0, "SalesAccountType": 3 },
            { "Code": 11, "Name": "Inngående mva, mellomsats (kjøp)", "VatPercentage": 15.00, "SalesAccountType": 0 },
            { "Code": 13, "Name": "Utgående mva, mellomsats (salg)", "VatPercentage": 15.00, "SalesAccountType": 4 },
            { "Code": 14, "Name": "Utgående mva, lav sats (salg)", "VatPercentage": 8.00, "SalesAccountType": 5 },
            { "Code": 15, "Name": "Inngående mva, lav sats (kjøp)", "VatPercentage": 8.00, "SalesAccountType": 0 },
            { "Code": 16, "Name": "Mva tjenester Utland m/fradrag", "VatPercentage": 0.0, "SalesAccountType": 0 },
            { "Code": 17, "Name": "Mva tjenester Utland u/fradrag", "VatPercentage": -20.0, "SalesAccountType": 0 },
            { "Code": 21, "Name": "Direktepostert inng. mva v/import, høy sats (varekjøp)", "VatPercentage": 0.0, "SalesAccountType": 0 },
            { "Code": 22, "Name": "Direktepostert inng. mva v/import, mellomsats (varekjøp)", "VatPercentage": 0.0, "SalesAccountType": 0 },
            { "Code": 31, "Name": "Momskompensasjon høy sats - Drift", "VatPercentage": 25.00, "SalesAccountType": 0 },
            { "Code": 32, "Name": "Momskompensasjon, mellomsats", "VatPercentage": 15.00, "SalesAccountType": 0 },
            { "Code": 33, "Name": "Momskompensasjon, lav sats", "VatPercentage": 8.00, "SalesAccountType": 0 },
            { "Code": 34, "Name": "Momskompensasjon 0% Drift", "VatPercentage": 0.0, "SalesAccountType": 0 },
            { "Code": 41, "Name": "Momskompensasjon høy sats - Invest.", "VatPercentage": 25.00, "SalesAccountType": 0 },
            { "Code": 42, "Name": "Momskompensasjon, mellomsats -Invest.", "VatPercentage": 15.00, "SalesAccountType": 0 },
            { "Code": 43, "Name": "Momskompensasjon, lav sats -Invest.", "VatPercentage": 8.00, "SalesAccountType": 0 },
            { "Code": 44, "Name": "Momskompensasjon 0% Invest", "VatPercentage": 0.0, "SalesAccountType": 0 },
            { "Code": 51, "Name": "Uten momskomp. høy sats - Drift", "VatPercentage": 25.00, "SalesAccountType": 0 },
            { "Code": 52, "Name": "Uten momskomp., mellomsats -Drift", "VatPercentage": 15.00, "SalesAccountType": 0 },
            { "Code": 61, "Name": "Uten momskomp. høy sats - Invest", "VatPercentage": 25.00, "SalesAccountType": 0 },
            { "Code": 62, "Name": "Uten momskomp., mellomsats -Invest.", "VatPercentage": 25.00, "SalesAccountType": 0 }
        ];
    }

    function getAccounts(filter) {
        var accounts = [
            { "Kontonr": 3000, "Navn": "Salgsinntekter avgiftspliktige", "Momskode": 3, "Kontotype": 0 },
            { "Kontonr": 3060, "Navn": "Uttak av varer", "Momskode": 3, "Kontotype": 0 },
            { "Kontonr": 3080, "Navn": "Rabatter og andre salgsinnt.reduksjon", "Momskode": 3, "Kontotype": 0 },
            { "Kontonr": 3100, "Navn": "Salgsinntekter avgiftsfrie", "Momskode": 5, "Kontotype": 0 },
            { "Kontonr": 3200, "Navn": "Salgsinntekter utenfor avgiftsområdet", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 3410, "Navn": "Andre offentlige tilskudd/refusjoner", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 3600, "Navn": "Leieinntekter fast eiendom", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 3620, "Navn": "Andre leieinntekter", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 3700, "Navn": "Provisjonsinntekt", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 4000, "Navn": "Innkjøp materialer eller varer", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 4060, "Navn": "Frakt toll og spedisjon", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 4090, "Navn": "Beholdningsendring", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 4300, "Navn": "Innkjøp varer for videresalg", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 5000, "Navn": "Lønn til ansatte", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 5010, "Navn": "Feriepenger", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 5200, "Navn": "Fri bil", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 5210, "Navn": "Fri telefon", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 5300, "Navn": "Tantieme", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 5330, "Navn": "Godtgj. til styre og bedriftsforsamling", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 5400, "Navn": "Arbeidsgiveravgift", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 5410, "Navn": "Arbeidsgiveravgift av feriepenger", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 5420, "Navn": "Innberetningspliktige pensjonskostnader", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 5800, "Navn": "Refusjon av sykepenger", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 5820, "Navn": "Refusjon av arbeidsgiveravgift", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 5900, "Navn": "Gave til ansatte", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 5920, "Navn": "Yrkesskadeforsikring", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 5990, "Navn": "Andre personalkostnader", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 6000, "Navn": "Avskrivning bygninger og annen f.eiendom", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 6010, "Navn": "Avskrivning maskiner og inventar", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 6100, "Navn": "Frakt transp. kostn. og forsikring varefors.", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6260, "Navn": "Vann", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6290, "Navn": "Annet brensel", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6300, "Navn": "Leie lokaler", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 6340, "Navn": "Lys. varme", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6360, "Navn": "Renhold", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6390, "Navn": "Andre kostnader lokaler", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6400, "Navn": "Leie maskiner", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6410, "Navn": "Leie inventar", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6440, "Navn": "Leie transportmidler", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6510, "Navn": "Håndverktøy", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6540, "Navn": "Inventar", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6550, "Navn": "Driftsmaterialer", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6560, "Navn": "Rekvisita", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6570, "Navn": "Arbeidsklær og verneutstyr", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6590, "Navn": "Annet driftsmateriale", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6600, "Navn": "Reparasjon og vedlikehold bygninger", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6620, "Navn": "Reparasjon og vedlikehold utstyr", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6700, "Navn": "Revisjons- og regnskapshonorar", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6790, "Navn": "Andre fremmede tjenester", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6800, "Navn": "Kontorrekvisita", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6820, "Navn": "Trykksaker", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6840, "Navn": "Aviser tidsskrifter m.v.", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 6890, "Navn": "Andre kontorkostnader", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6900, "Navn": "Telefon", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 6940, "Navn": "Porto", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 7000, "Navn": "Drivstoff", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 7020, "Navn": "Vedlikehold", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 7040, "Navn": "Forsikring", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 7100, "Navn": "Bilgodtgjørelse oppgavepliktig", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 7130, "Navn": "Reisekostnader oppgavepliktige", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 7140, "Navn": "Reisekostnader ikke oppgavepliktige", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 7150, "Navn": "Diettkostnader oppgavepliktige", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 7160, "Navn": "Diettkostnader ikke oppgavepliktig", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 7300, "Navn": "Salgskostnader", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 7320, "Navn": "Reklamekostnader", "Momskode": 1, "Kontotype": 0 },
            { "Kontonr": 7350, "Navn": "Representasjon fradragsberettiget", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 7360, "Navn": "Representasjon ikke fradragsberettiget", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 7400, "Navn": "Kontingent fradragsberettiget", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 7410, "Navn": "Kontingent ikke fradragsberettiget", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 7420, "Navn": "Gave fradragsberettiget", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 7430, "Navn": "Gave ikke fradragsberettiget", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 7500, "Navn": "Forsikringspremier", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 7710, "Navn": "Styre- og bedriftsforsamlingsmøter", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 7770, "Navn": "Bank- og kortgebyrer", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 7790, "Navn": "Andre kostnader", "Momskode": 0, "Kontotype": 0 },
            { "Kontonr": 7830, "Navn": "Tap på fordringer", "Momskode": 0, "Kontotype": 0 }
        ];
        var fieldName = helpers.params.extractParam(filter, 0, " ").toLowerCase();
        var operator = helpers.params.extractParam(filter, 1, " ").toLowerCase();
        var value = helpers.params.extractParam(filter, 2, " ").toLowerCase();
        if (fieldName === "kontonr" && operator === "eq") {
            return [ getItemWithValue(accounts, "Kontonr", value) ];
        }
        warn("Unchecked mockup query: " + filter + " returning all accounts");
        return accounts;
    }

    function queryForInvoice(filter) {

        var items = [];
        var supplierid = helpers.params.extractParam(filter, 2, " ");
        if (parseInt(supplierid) > 0) {
            for (var i = 0; i < mockData.invoices.length; i++) {
                if (mockData.invoices[i].SupplierID == supplierid)
                    items.push(mockData.invoices[i]);
            }
        }
        return items;
    }

    function getInvoice(filter) {
        var id = helpers.params.extractParam(filter, 1, ":");
        if (parseInt(id) > 0) {
            var invoice = findInvoice(id);
            var ret = helpers.dataObjectify(invoice, "SupplierInvoice", "employees,documents");
            return JSON.parse(ret);

        }
        return null;
    }

    function getFinanceDocuments(filter) {
        var invoice = findInvoice(helpers.params.getParamValue(filter));
        if (invoice !== null) return invoice.documents;
    }

    function getDimensions(dimtype) {
        return [
            { DimKey: 1, Name: 'Produksjon' },
            { DimKey: 2, Name: 'Utkjøring' }
        ];
    }

    function initMockData(data) {

        data.assignees = [
            new models.Assignee(441, "Ola", "ola@norman.no"),
            new models.Assignee(442, "Kari", "kari@norman.no"),
            new models.Assignee(443, "Administrator", ""),
            new models.Assignee(444, "VIP", ""),
            new models.Assignee(445, "Sjefen", "hans@unimicro.no")
        ];
        data.invoices = [
            new models.Invoice(1, 200001, "GuleSider (2 docs)", 10931.25, "GuleSider faktura", "invoice1.jpg", 1, "att2.jpg"),
            new models.Invoice(2, 200002, "Toma", 7774.00, "Toma faktura", "invoice2.jpg"),
            new models.Invoice(3, 200003, "COOP (3 pages)", 2705.00, "COOP JAN 2014", 'invoice3.jpg', 3),
            new models.Invoice(4, 200003, "MPD", 15821.00, "Hardware", 'invoice4.jpg'),
            new models.Invoice(5, 200003, "Posten Norge (jpg only)", 89.00, "PORTO/FRIMERKER", 'invoice5.jpg', -1)
        ];

        /*
         var i = 100;
         var randomNames = ["GuleSider (2 docs)", "Toma", "COOP (3 pages)", "MPD", "Posten Norge (jpg only)", "Test Invoice"];
         while (i--) {
         data.invoices.push(new models.Invoice(5, 200003, randomNames[Math.floor(Math.random()*6)], 89.00, "PORTO/FRIMERKER", 'invoice5.jpg', -1))
         }
         */

        data.status = {
            CREATED: 1,
            ASSIGNED: 2,
            PARTACCEPT: 3,
            ACCEPTED: 4,
            POSTED: 5,
            PAID: 6,
            REJECTED: 7
        };


        data.assignments = [];
        for (var i = 0; i < data.invoices.length; i++)
            assignInvoice(data.invoices[i].ID, data.assignees[0].ID);

        //Flag the second as "posted"
        data.invoices[1].Status = data.status.POSTED;

    }

    function findInvoice(id) {
        for (var i = 0; i < mockData.invoices.length; i++)
            if (mockData.invoices[i].ID == id) return mockData.invoices[i];
        return null;
    };

    function firstAssignee() {
        return mockData.assignees[0];
    }

    function testMockData(data) {

        assert(declineInvoice("int:" + mockData.assignments[0].ID + "|string:A valid comment!", "Testing purposes!"), "declineinvoice", "Unable to decline invoice!");
        assert(acceptinvoice("int:" + mockData.assignments[0].ID), "acceptinvoice", "Unable to accept invoice!");
        assert(acceptinvoicewithcomment("int:" + mockData.assignments[0].ID + "|string:TheComment"), "acceptinvoicewithcomment", "Unable to accept invoice!");

        /*

         proxyHandler([defaultEndpoint, "GetMylist"], function (result) {
         assert(result.Success, "Proxy.GetMyList.Success", "returned success = false");
         assert(result.Data !== null, "Proxy.GetMyList.Data", "No data in servicerepsonse");
         assert(result.Data[0].AssignmentID > 0, "Proxy.GetMyList.Data[0].AssignmentID", "No AssignmentID in data");
         var maxStatus = 0;
         for (var i = 0; i < result.Data.length; i++) {
         if (maxStatus < result.Data[i].Status)
         maxStatus = result.Data[i].Status;
         }
         assert(maxStatus < data.status.ACCEPTED, "GetMylist (history) returned some invoices that are accepted or have a higher status!");
         },true);

         proxyHandler([defaultEndpoint, "GetMylist", "string:|int:720"], function (result) {
         assert(result.Success, "Proxy.GetMyList.Success", "returned success = false");
         assert(result.Data !== null, "Proxy.GetMyList.Data", "No data in servicerepsonse");
         assert(result.Data[0].AssignmentID > 0, "Proxy.GetMyList.Data[0].AssignmentID", "No AssignmentID in data");
         var maxStatus = 0;
         for (var i = 0; i < result.Data.length; i++) {
         if (maxStatus < result.Data[i].Status)
         maxStatus = result.Data[i].Status;
         }
         assert(maxStatus >= data.status.ACCEPTED, "GetMylist (history) returned no invoices that are accepted or have a higher status!");
         }, true);

         */

        proxyHandler([defaultEndpoint, "GetAssigneelist"], function (result) {
            assert(result.Success, "Proxy.getassigneelist.Success", "returned success = false");
            assert(result.Data !== null, "Proxy.getassigneelist.Data", "No data in servicerepsonse");
            assert(result.Data[0].ID > 0, "Proxy.getassigneelist.Data[0].ID", "No ID in data");
        }, true);

        proxyHandler([accountingEndpoint, "GetVatCodes"], function (result) {
            assert(result.Success, "Proxy.GetVatCodes.Success", "returned success = false");
            assert(result.Data !== null, "Proxy.GetVatCodes.Data", "No data in servicerepsonse");
            assert(result.Data[1].VatPercentage === 25, "Proxy.GetVatCodes.Data[1].VatPercentage != 25", "Invalid vatcode data!");
        }, true);

        proxyHandler([accountingEndpoint, "QueryForTable", "string:konto|string:$select=Kontonr,Navn,Momskode,Kontotype&$filter=Kontonr eq 4000"], function (result) {
            assert(result.Success, "Proxy.QueryForTable.Success", "returned success = false");
            assert(result.Data !== null, "Proxy.QueryForTable.Data", "No data in servicerepsonse");
            assert(result.Data[0].Momskode === 1, "Proxy.QueryForTable.Data[0].Momskode != 1", "Invalid vatcode for account data!");
        }, true);

        //$select=Kontonr,Navn,Momskode,Kontotype&$filter=Kontonr ge 3000 and Kontonr le 8000

    }


    function assert(expression, name, msg) {
        if (expression) {
            console.log("TEST SUCCESS : " + name);
            return;
        }
        //toastr.warning("** TEST FAIL ** : '" + name + "' : " + (msg || "error") );
    }

    function warnIfNotEqual(v1, v2, contextInfo) {
        if (v1 === v2) return;
        //toastr.warning("API ERROR " + (contextInfo || "") + " : " + v1 + " is not equal to " + v2);
    }

    function warn(msg) {
        console.log(msg);
        //toastr.warning(msg);
    }


})();


