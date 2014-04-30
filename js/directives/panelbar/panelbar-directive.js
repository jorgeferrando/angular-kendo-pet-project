define(["angular"], function (angular) {
    "use strict";

    function panelBar($timeout, uni24Service) {
        return {
            restrict: 'A',
            replace: true,
            template: "<ul kendo-panel-bar></ul>",
            controller: function ($scope, $element, uni24Service) {
                $scope.$watch(function () {
                    return !!$element.data("kendoPanelBar") && uni24Service.isAuthorized();
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if (newValue === true) {
                            var panelBar = $element.data("kendoPanelBar");
                            uni24Service.getFlexModuleList().then(function (result) {
                                var list = {};
                                result.forEach(function (item) {
                                    if (list[item.CategoryLabel]) {
                                        list[item.CategoryLabel].items.push({
                                            encoded: false,
                                            text: "<a href='#/test'>" + item.Label + "</a>"
                                        });
                                    } else {
                                        list[item.CategoryLabel] = {};
                                        list[item.CategoryLabel] = {
                                            text: item.CategoryLabel,
                                            encoded: false,
                                            items: []
                                        };
                                        list[item.CategoryLabel].items.push({
                                            encoded: false,
                                            text: "<a href='#/test'>" + item.Label + "</a>"
                                        });
                                    }
                                });
                                for (var attr in list) {
                                    if (list.hasOwnProperty(attr)) {
                                        panelBar.append(list[attr]);
                                    }
                                }
                            });
                        }
                    }
                });

            },
            link: function (scope, element, attrs) {

            }
        };
    }

    return ['$timeout', 'uni24Service', panelBar];
});