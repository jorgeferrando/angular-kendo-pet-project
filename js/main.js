require.config({
    baseurl: "js/",
    paths: {
        "jquery": "http://code.jquery.com/jquery-1.9.1.min",
        "bootstrap3": "http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min",
        "angular": "http://ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular",
        "kendo": "http://cdn.kendostatic.com/2014.1.318/js/kendo.all.min",
        "angular-kendo": "vendor/angular-kendo",
        "oc.lazyLoad": "vendor/ocLazyLoad",
        "customLazyLoader": "vendor/customLazyLoader",
        "ngRoute": "http://ajax.googleapis.com/ajax/libs/angularjs/1.2.10/angular-route",
        //"ui.router": "https://raw.githubusercontent.com/angular-ui/ui-router/master/release/angular-ui-router.min",
        "moment": "vendor/moment",
        "app": "app"
    },
    shim: {
        "angular": {
            exports: "angular"
        },
        "jquery": {
            exports: "$"
        },
        "bootstrap3": {
            deps: ["jquery"]
        },
        "moment": {
            exports: "moment"
        },
        "kendo": {
            deps: ["jquery"]
        },
        "angular-kendo": {
            deps: ["angular", "kendo"]
        },
        "ngRoute": {
            deps: ["angular"]
        },
        "oc.lazyLoad": {
            deps: ["angular", "ngRoute"]
        },
        "customLazyLoader": {
            deps: ["oc.lazyLoad"]
        },
        "app": {
            deps: ["angular-kendo"]
        }
    }
});

define([
    "jquery", "bootstrap3", "angular", "kendo", "angular-kendo", "app"
], function ($, bootstrap3, angular, kendo, angularkendo, app) {
    "use strict";
    $(document).ready(function () {
        angular.bootstrap(document, ["SampleApp"]);
    });
});