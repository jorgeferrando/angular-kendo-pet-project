if (Uni24App) {
    Uni24App.session = {
        //key : ko.observable(""),
        user: { userName: function () { return "testuser"; } },
        //client : ko.observable(new ClientInfo()),
        //modulemenuitems : null, 
        StateChanged: function (value) {
            Uni24App.session.status = value;
        },
        status : "loggedoff",
        //groups : ko.observableArray(),		
			
        //Busy indicator observable
        //busy : ko.observable( false ),
        //busycomment : ko.observable( "" ),
        SetBusy: function (isBusy, comment, timeout) { },
        SetBusyModal: function (show) { },
        hasModule: function (name) {
            return true;
        }


    };
}