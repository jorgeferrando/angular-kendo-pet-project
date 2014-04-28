define(["angular"], function (angular) {
    "use strict";

    function offCanvas() {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: "draw-off-canvas.html",
            link: function (scope, element, attrs) {
                element.on("click", function () {
                        $("." + attrs.toggleClass).toggleClass("active");
                });
            }
        }
    }

    return [offCanvas];
});