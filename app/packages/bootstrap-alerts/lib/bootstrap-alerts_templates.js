Template.bootstrapAlert.rendered = function () {
    var alert = this.data;
    var $node = $(this.firstNode);

    Meteor.defer(function () {
        Alerts.collection_.update(alert._id, {
            $set: { seen: true }
        });
    });

    $node.removeClass('hide').hide().fadeIn(alert.options.fadeIn, function () {

        if (alert.options.autoHide) {
            Meteor.setTimeout(function () {
                    $node.fadeOut(alert.options.fadeOut);
                },
                alert.options.autoHide);
        }
    });
};

Template.bootstrapAlerts.helpers({
    alerts: function () {
        return Alerts.collection_.find();
    }
});