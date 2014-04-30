define(["angular"], function (angular) {
    "use strict";
    return angular.module("finance", [])
        .controller("financeCtrl", function ($scope, uni24Service) {
            $scope.grid = {
                options: {
                    editable: "inline",
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
            $scope.data = [];
            uni24Service.getFlatInvoices().then(function (result) {
                //onsole.log(result.Data);
                $scope.data = result.Data;
                var grid = $("#fmGrid").data("kendoGrid");
                var dataSource = new kendo.data.DataSource({
                    //data: result.Data,
                    pageSize: 10,
                    transport: {
                        read: function(e) {
                            e.success($scope.data);
                        },
                        update: function(e) {
                            e.success();
                        },
                        create: function(e) {
                            var item = e.data;
                            item.AssignmentID = $scope.data.length + 1;
                            e.success(item);
                        }
                    },
                    schema: {
                        model: {
                            id: "AssignmentID"
                        }
                    }
                });
                grid.setDataSource(dataSource);
            });
        });
});
