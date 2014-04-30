define([], initModule);

function initModule() {

    return {
        Dimension: Dimension
    };

    function Dimension(id, name, dimType) {
        var me = this;
        me.DimKey = id;
        me.Name = name;
        me.DimType = dimType;
    }

}