define([], initModule);

function initModule() {

    return {
        Assignee: Assignee
    };

    function Assignee(id, name, email) {
        var me = this;
        me.ID = id;
        me.Name = name;
        me.email = email;
        me.accesskey = 0;
        me.externaluserid = 0;
    }

}