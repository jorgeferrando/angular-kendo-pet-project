define(["angular"], function (angular) {
    "use strict";

    function offCanvas() {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: "js/directives/offcanvas/offcanvas.html",
            link: function (scope, element, attrs) {
                element.on("click", function () {
                        $("." + attrs.toggleClass).toggleClass("active");
                });
            }
        }
    }

    return [offCanvas];
});