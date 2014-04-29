define(["angular"], function (angular) {
    "use strict";

    function panelBar($timeout) {
        return {
            restrict: 'A',
            replace: true,
            template: "<ul kendo-panel-bar></ul>",
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

                $scope.$watch(function () {
                    return !!$element.data("kendoPanelBar") && loginService.auth;
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        console.log(newValue)
                        if (newValue === true) {
                            var panelBar = $element.data("kendoPanelBar");
                            panelBar.append([
                                {
                                    text: "<b>Item 2</b>",
                                    encoded: false,                                 // Allows use of HTML for item text
                                    items: [
                                        {text: "<a href='#/login'>login</a>", encoded: false},
                                        {text: "<a href='#/test'>test</a>", encoded: false}
                                    ]                             // content within an item
                                }
                            ]);
                            panelBar._updateClasses();
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