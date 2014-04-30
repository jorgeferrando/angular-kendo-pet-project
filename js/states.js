define(["vendor/customLazyLoader"], function (lazyLoader) {
    "use strict";
    var states = [], i = 0;
    // #login
    states.push({
        name: "login",
        state: {
            url: "/login",
            templateUrl: "partials/login.html",
            controller: "loginCtrl",
            authenticate: false
        }
    });

    // #finance

    states.push({
        name: "finance",
        state: {
            url: "/finance",
            template: lazyLoader.template,
            controller: function ($scope, $ocLazyLoad) {
                lazyLoader.load($scope, $ocLazyLoad,
                    'finance',
                    'js/modules/finance/module.js',
                    'partials/finance/index.html'
                    );
            },
            authenticate: true
        }
    });

    return states;
});
