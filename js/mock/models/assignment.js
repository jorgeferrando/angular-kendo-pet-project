define([], initModule);

function initModule() {

    return {
        Assignment: Assignment
    };

    function Assignment(id, assigneeID, invoiceID) {
        var me = this;
        me.ID = id;
        me.FK_ID = invoiceID;
        me.AssigneeID = assigneeID;
        me.Type = 2; // SUPPLIER-INVOICE
    }

}