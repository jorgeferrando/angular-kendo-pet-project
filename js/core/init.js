
Uni24App.service.servicepost(
    Uni24App.service.buildmsg("Login", Uni24App.utils.debuguser.client, Uni24App.utils.debuguser.name, Uni24App.utils.debuguser.pwd),
    function (result) {
        if (result.length > 0) {
            Uni24App.session.status = "loggedin";
            //console.log("Login successfull:" + result);
            require(["../loader"]);
            Uni24App.session.user.userName()
        } else {
            alert("Invalid login!");
        }
    });
