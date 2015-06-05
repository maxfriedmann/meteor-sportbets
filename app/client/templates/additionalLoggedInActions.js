Template._loginButtonsLoggedInDropdown.events({
    'click #login-buttons-profile': function (event) {
        window.location = "/account/profile";
    },
    'click #login-buttons-merge': function (event) {
        window.location = "/account/merge";
    }
});