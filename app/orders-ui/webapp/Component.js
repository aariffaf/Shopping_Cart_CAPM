sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "ordersui/model/models"
], function (UIComponent, JSONModel, models) {

    "use strict";

    return UIComponent.extend("ordersui.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () {
            // Call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // Set the device model
            this.setModel(models.createDeviceModel(), "device");

            // Set the application layout model
            const oAppModel = new JSONModel({
                layout: "TwoColumnsMidExpanded"
            });
            this.setModel(oAppModel, "app");

            // Set the shopping cart model
            const oCartModel = new JSONModel({
                items: []
            });
            this.setModel(oCartModel, "cart");

            // Set the checkout configuration model
            const oCheckoutModel = new JSONModel({
                paymentType: "COD"
            });
            this.setModel(oCheckoutModel, "checkout");

            this.setModel(oAppModel, "app");

            // Initialize the router at the very end
            this.getRouter().initialize();
        }
    });
});
