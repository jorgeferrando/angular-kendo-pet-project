define(["customLazyLoader"], function (lazyLoader) {
    "use strict";
    var states = [], i = 0;
    // #login
    states.push({
        name: "login",
        state: {
            url: "/login",
            templateUrl: "login.html",
            controller: "loginCtrl",
            authenticate: false
        }
    });

    // #finance

    states.push({
        name: "test",
        state: {
            url: "/test",
            template: lazyLoader.template,
            controller: function ($scope, $ocLazyLoad) {
                lazyLoader.load($scope, $ocLazyLoad,
                    'test',
                    'js/test.js',
                    'test.html'
                    );
            },
            authenticate: true
        }
    });

    return states;
});
