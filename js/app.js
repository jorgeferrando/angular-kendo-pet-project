define([
    "angular",
    "ngRoute",
    "states",
    "oc.lazyLoad",
    "services/uni24service",
    "directives/offcanvas/offcanvas-directive",
    "directives/panelbar/panelbar-directive"],
    function (angular, ngRoute, states, lazyLoad, uni24Service, offCanvasDirective, panelBarDirective) {
        "use strict";
        return angular.module('SampleApp', ['ngRoute', 'oc.lazyLoad', 'kendo.directives'])
            .directive("drawOffCanvas", offCanvasDirective)
            .directive("panelBar", panelBarDirective)
            .factory("uni24Service", uni24Service)
            .controller("loginCtrl", function ($scope, $location, uni24Service) {
                $scope.doLogin = function () {
                    uni24Service.login({}).then(function () {
                        uni24Service.setAuthorized(true);
                        $location.url("/test");
                    });
                };
            })
            .config([
                "$routeProvider", "$locationProvider",
                function ($routeProvider, $locationProvider) {
                    states.forEach(function (state) {
                        $routeProvider.when(state.state.url, state.state);
                    });
                    $routeProvider.otherwise({redirectTo: "/login"});
                    // Without server side support html5 must be disabled.
                    return $locationProvider.html5Mode(false);
                }
            ])
            .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
                $ocLazyLoadProvider.config({
                    asyncLoader: require
                });
            }])
            .run(['$location', '$rootScope', '$route', 'uni24Service', function ($location, $rootScope, $route, uni24Service) {
                $rootScope.$on('$routeChangeStart', function (event, current, previous) {
                    if (current.$$route.authenticate && !uni24Service.isAuthorized()) {
                        event.preventDefault();
                        $location.url("/login");
                    }
                });
            }]);
    });