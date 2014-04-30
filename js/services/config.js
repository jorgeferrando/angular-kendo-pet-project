define([], function () {
    "use strict";
    return {
        api: {
            modules: {
                finance:"RMFinance.RMFinanceLib.RMFinance",
            },
            services: {
                proxy: "proxy",
                login: "login",
                logout: "logout",
                clientinfo: "getclientinfo"
            },
            methods: {
                getFlexModuleList: "GetFlexModuleList",
                getFlatInvoices: "GetMylist"
            }
        }
    };
});
