define([], function () {
    "use strict";
    var app = angular.module('SampleApp', ['kendo.directives'])
        .controller('sampleCtrl', ['$scope', function ($scope) {
            $scope.message = "Test";
            $scope.selectedThing = "";
            $scope.thingsOptions = {
                dataSource: {
                    data: [{ name: "Thing 1", id: 1 },
                        { name: "Thing 2", id: 2 },
                        { name: "Thing 3", id: 3 }]
                },
                dataTextField: "name",
                dataValueField: "id",
                optionLabel: "Select A Thing"
            };
            $scope.thingsChange = function (e) {

            };
        }]);

    return app;
});