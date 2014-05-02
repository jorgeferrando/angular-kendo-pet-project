define(["angular", "modules/finance/controllers/gridCtrl"], function (angular, gridCtrl) {
    "use strict";
    return angular.module("finance", [])
        .controller("gridCtrl", gridCtrl);
});
