sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast"
], function (Controller, UIComponent, MessageToast) {
    "use strict";

    return Controller.extend("ordersui.controller.Review", {

        onNavBack: function () {

            window.history.back();

        },

        onEditCheckout: function () {

            const oRouter = UIComponent.getRouterFor(this);

            oRouter.navTo("checkout");

        },

        onPlaceOrder: function () {

            MessageToast.show(
                "Order placed successfully!"
            );

            const oRouter = UIComponent.getRouterFor(this);

            oRouter.navTo("success");

        }

    });

});