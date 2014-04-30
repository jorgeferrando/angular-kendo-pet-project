define(["js/mock/models/document.js", "js/mock/apiHelpers.js", "moment"], initModule);

function initModule(doc, helpers,moment) {

    moment.lang("nb");

    Invoice.prototype.getFlatCopy = getFlatCopy;
    return {
        Invoice: Invoice
    };

    function getFlatCopy(includeAssigmentID) {
        var me = this;
        var ret = {
            ID: me.ID,
            SupplierID: me.SupplierID,
            Name: me.Name,
            Invoice_Date: me.Invoice_Date,
            Status: me.Status,
            DueDate: me.DueDate,
            Total: me.Total,
            Dim1: me.Dim1,
            Dim1Navn: me.Dim1Navn,
            Dim2: me.Dim2,
            Dim2Navn: me.Dim2Navn,
            Invoice_Date: me.InvoiceDate            
        }
        if (includeAssigmentID)
            ret.AssignmentID = me.AssignmentID;
        return ret;
    }

    function Invoice(id, supplierId, name, total, text, files, pageCount, files2) {
        var me = this;
        me.ID = id;
        me.SupplierID = supplierId;
        me.Name = name;
        //Create some random dates
        
        me.InvoiceDate = helpers.dates.moNetDate(moment().subtract('days', helpers.randomInt(2, 7)));
        me.DueDate = helpers.dates.moNetDate(moment(me.Invoice_Date).add('days', helpers.randomInt(7, 30)));
        me.Status = 1;
        me.Total = total;
        me.LedgerText = text;
        me.Dim1 = 0;
        me.Dim1Navn = "";
        me.Dim2 = 0;
        me.Dim2Navn = "";
        me.AssignmentID = 0;
        me.documents = [new doc.Document(files, pageCount)];
        if (files2 !== undefined)
            me.documents.push(new doc.Document(files2));
        me.Lines = [
            new InvoiceLine(1, text, 4000, 1, total, total, 0, 0, moment(me.Invoice_Date).month() )
        ];
    }

    function InvoiceLine(id, lineText, account, vatCode, net, total, dim1, dim2, period) {
        var me = this;
        me.ID = id;
        me.LineText = lineText;
        me.Account = account;
        me.VatCode = vatCode;
        me.Net = net;
        me.Total = total;
        me.Dim1 = dim1;
        me.Dim2 = dim2;
        me.Period = period;
    }
}

