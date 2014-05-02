define([], function () {
    "use strict";
    var SmartPhone = {
        getUserAgent: function () {
            return navigator.userAgent;
        },
        isAndroid: function () {
            return this.getUserAgent().match(/Android/i);
        },
        isBlackBerry: function () {
            return this.getUserAgent().match(/BlackBerry/i);
        },
        isIOS: function () {
            return this.getUserAgent().match(/iPhone|iPad|iPod/i);
        },
        isOpera: function () {
            return this.getUserAgent().match(/Opera Mini/i);
        },
        isWindows: function () {
            return this.getUserAgent().match(/IEMobile/i);
        },
        isAny: function () {
            var foundAny = false;
            var getAllMethods = Object.getOwnPropertyNames(SmartPhone).filter(function (property) {
                return typeof SmartPhone[property] == 'function';
            });

            for (var index in getAllMethods) {
                if (getAllMethods[index] === 'getUserAgent' || getAllMethods[index] === 'isAny') {
                    continue;
                }
                if (SmartPhone[getAllMethods[index]]()) {
                    foundAny = true;
                    break;
                }
            }
            return foundAny;
        }
    };
    return SmartPhone;
});
