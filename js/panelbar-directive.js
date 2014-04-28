define(["angular"], function (angular) {
    "use strict";

    function panelBar($timeout) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: "panelBar.html",
            controller: function ($scope, $element, loginService) {
                var menuItems = [

                    {
                        header: "Header 1",
                        items: [
                            {text: "item1"},
                            {text: "item2"},
                            {text: "item3"},
                            {text: "item4"}
                        ]
                    }

                ];

                $scope.$watch(function() {
                    return !!$element.data("kendoPanelBar") && loginService.auth;
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if (newValue === true) {
                            $element.data("kendoPanelBar").append([{
                                text: "<b>Item 2</b>",
                                encoded: false,                                 // Allows use of HTML for item text
                                content: "text"                                 // content within an item
                            }]);
                        }
                    }
                });

            },
            link: function (scope, element, attrs) {

            }
        };
    }

    return ['$timeout', panelBar];
});