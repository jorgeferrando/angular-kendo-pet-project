define(["angular", "ngRoute", "states", "oc.lazyLoad", "off-canvas-directive", "panelbar-directive"],
    function (angular, ngRoute, states, a, offCanvasDirective, panelBarDirective) {
        "use strict";
        return angular.module('SampleApp', ['ngRoute', 'oc.lazyLoad', 'kendo.directives'])
            .directive("drawOffCanvas", offCanvasDirective)
            .directive("panelBar", panelBarDirective)
            .factory("loginService", function () {
                var auth = false;
                return {
                    auth: auth
                };
            })
            .controller("loginCtrl", function ($scope, $location, loginService) {
                $scope.doLogin = function () {
                    loginService.auth = true;
                    $location.url("/test");
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
            .run(['$location', '$rootScope', '$route', 'loginService', function ($location, $rootScope, $route, loginService) {
                $rootScope.$on('$routeChangeStart', function (event, current, previous) {
                    //console.log("routeChange:", arguments);
                    if (current.$$route.authenticate && !loginService.auth) {
                        event.preventDefault();
                        $location.url("/login");
                    }
                });
            }]);
        ;
    });