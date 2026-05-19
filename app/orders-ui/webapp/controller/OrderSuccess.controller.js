sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
    "use strict";

    return Controller.extend("ordersui.controller.OrderSuccess", {

        onReturnHome: function () {

            const oRouter = UIComponent.getRouterFor(this);

            oRouter.navTo("home");

        },
        onReturnHome: function () {

            const oRouter = sap.ui.core.UIComponent
                .getRouterFor(this);

            oRouter.navTo("master");

        }

    });

});