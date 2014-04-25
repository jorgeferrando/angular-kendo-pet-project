define(["angular"],function(angular) {
    "use strict";
    return angular.module("test",[])
        .controller("testCtrl",function($scope){
            $scope.testmsg = "Test message";
        });
});