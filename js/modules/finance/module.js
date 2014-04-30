define(["angular"], function (angular) {
    "use strict";
    return angular.module("finance", [])
        .controller("financeCtrl", function ($scope,uni24Service) {
            $scope.grid = {
                options: {
                    dataSource: [
                        {
                            ContactName: "Jorge",
                            ContactTitle: "Utvikler",
                            CompanyName: "Unimicro",
                            Country: "Norway"
                        }
                    ],
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
                        }
                    ]
                }
            };
            uni24Service.getFlatInvoices().then(function (result) {
                //onsole.log(result.Data);
                var grid = $("#fmGrid").data("kendoGrid");
                var dataSource = new kendo.data.DataSource({
                    data: result.Data,
                    pageSize: 10
                });
                grid.setDataSource(dataSource);
            });
        });
});
