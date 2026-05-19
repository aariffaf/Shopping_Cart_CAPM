sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("ordersui.controller.OrderDetail", {

        onInit: function () {

            this.getOwnerComponent()
                .getRouter()
                .getRoute("orderDetail")
                .attachPatternMatched(
                    this._onObjectMatched,
                    this
                );
        },

        _onObjectMatched: function (oEvent) {

            var sOrderId =
                oEvent.getParameter("arguments").orderId;

            this.getView().bindElement({

                path: "/ConfirmedOrders('" + sOrderId + "')",

                parameters: {
                    expand: "items"
                }
            });
        },

        onNavBack: function () {

            this.getOwnerComponent()
                .getRouter()
                .navTo("orders");
        }

    });
});