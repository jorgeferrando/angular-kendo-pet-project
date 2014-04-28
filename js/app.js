define(["angular", "states", "oc.lazyLoad", "ui.router","off-canvas-directive"], function (angular, states, a, b, offCanvasDirective) {
    "use strict";
    return angular.module('SampleApp', ['ui.router', 'oc.lazyLoad', 'kendo.directives'])
        .directive("drawOffCanvas", offCanvasDirective)
        .factory("loginService", function () {
            var auth = false;
            return {
                auth: auth
            };
        })
        .controller("loginCtrl", function ($scope, $state, loginService) {
            $scope.doLogin = function () {
                loginService.auth = true;
                $state.go("test");
            };
        })
        .config([
            "$stateProvider", "$locationProvider", "$urlRouterProvider",
            function ($stateProvider, $locationProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/login');
                states.forEach(function (state) {
                    $stateProvider.state(state.name, state.state);
                });
                // Without server side support html5 must be disabled.
                return $locationProvider.html5Mode(false);
            }
        ])
        .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
            $ocLazyLoadProvider.config({
                asyncLoader: require
            });
        }])
        .run(['$state', '$rootScope', 'loginService', function ($state, $rootScope, loginService) {
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (toState.authenticate && !loginService.auth) {
                    event.preventDefault();
                    $state.go("login");
                }
            });
        }]);
});