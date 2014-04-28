define(["angular"],function(angular) {
    "use strict";
    return angular.module("test", [])
        .controller("testCtrl", function ($scope) {
            console.log($scope.$parent.$parent.propertyData)
            $scope.testmsg = "Test message";
        });
});