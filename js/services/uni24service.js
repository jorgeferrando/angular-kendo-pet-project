define(["services/config"], function (config) {
    "use strict";

    var app = Uni24App;

    function uni24Service($q, $timeout) {

        var _isAuthorized = false;

        function sendMessage(service, module, method, filters) {
            var module = module || config.api.financeModule;
            var dfd = $q.defer();
            var args = [service, module, method];
            for (var i = 3; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            var msg = app.service.buildmsg.apply(null, args);
            app.service.servicepost(msg, function (result) {
                return dfd.resolve(result);
            });
            return dfd.promise;
        }

        function getflexmodulelist() {
            return sendMessage(config.api.methods.getFlexModuleList);
        }

        function getflatinvoices() {
            return sendMessage(
                config.api.services.proxy,
                config.api.modules.finance,
                config.api.methods.getFlatInvoices);
        }

        function login(credentials) {
            return sendMessage(config.api.services.login);
        }

        function logout() {
            return sendMessage(config.api.services.logout);
        }

        function isAuthorized() {
            return _isAuthorized;
        }

        function setAuthorized(state) {
            _isAuthorized = state;
        }

        return {
            isAuthorized: isAuthorized,
            setAuthorized: setAuthorized,
            login: login,
            logout: logout,
            getFlexModuleList: getflexmodulelist,
            getFlatInvoices: getflatinvoices
        };
    }


    return ['$q', '$timeout', uni24Service];
});