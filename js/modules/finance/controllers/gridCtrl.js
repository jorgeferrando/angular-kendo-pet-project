define([], function () {
    "use strict";
    function gridCtrl($scope, uni24Service) {
        $scope.grid = {
            options: {
                editable: "popup",
                toolbar: ["save", "cancel", "create"],
                groupable: true,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [
                    {
                        field: "AssignmentID",
                        title: "Assignment ID",
                        width: 200
                    },
                    {
                        field: "DueDate",
                        title: "Due Date",
                        format: "{0: yyyy-MM-dd HH:mm:ss}",
                        width: 200
                    },
                    {
                        field: "Name",
                        title: "Name",
                        width: 250
                    },
                    {
                        field: "Total",
                        title: "Total"
                    },
                    { command: ["edit", "destroy"] }
                ]
            }
        };
        $scope.$watch(function () {
            return $("#fmGrid").data("kendoGrid");
        }, function (newvalue, oldvalue) {
            if (newvalue && newvalue !== oldvalue) {
                uni24Service.getFlatInvoices().then(function (result) {
                    var dataSource = new kendo.data.DataSource({
                        data: result.Data,
                        pageSize: 10,
                        transport: {
                            create: function(options) {
                                return options.success(options.data);
                            },
                            read: function(options) {
                                return options.success(result.Data);
                            },
                            update: function(options) {
                                return options.success(options.data);
                            },
                            destroy: function (options) {
                                options.success(result.Data);
                            }
                        },
                        schema: {
                            model: {
                                id: "AssignmentID"
                            }
                        }
                    });
                    newvalue.setDataSource(dataSource);
                });
            }
        });
    }

    return ['$scope', 'uni24Service', gridCtrl];
});
